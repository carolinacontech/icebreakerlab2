// Motor de la escena "cueva de hielo": carga de fotogramas, render con
// paralaje por mapa de profundidad (WebGL), blur de cristal por píxeles y la
// transición de "quemado" del loader. Todo es imperativo a propósito: corre
// dentro de un único requestAnimationFrame, fuera del ciclo de React.
import { COLOR_FRAMES, DEPTH_FRAMES, FRAME_COUNT } from "./frames";

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const progressIn = (a: number, b: number, v: number) => clamp((v - a) / (b - a || 1));
const smooth = (t: number) => t * t * (3 - 2 * t);

export type Range = [number, number];
export type Phase = { enter?: Range; exit?: Range };

// Opacidad y desplazamiento de un bloque de texto según el progreso de scroll.
export function phaseState(progress: number, phase: Phase) {
  let opacity = 1;
  let y = 0;
  if (phase.enter && progress < phase.enter[1]) {
    const t = smooth(progressIn(phase.enter[0], phase.enter[1], progress));
    opacity = t;
    y = lerp(24, 0, t);
  } else if (phase.exit && progress > phase.exit[0]) {
    const t = smooth(progressIn(phase.exit[0], phase.exit[1], progress));
    opacity = 1 - t;
    y = lerp(0, -16, t);
  }
  return { opacity, y, visible: opacity > 0.002 };
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });

export class FrameSequence {
  color: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
  depth: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
  private pending = new Map<number, Promise<void>>();
  private stopped = false;

  load(index: number): Promise<void> {
    const i = clamp(index, 0, FRAME_COUNT - 1);
    if (this.color[i] && this.depth[i]) return Promise.resolve();
    const existing = this.pending.get(i);
    if (existing) return existing;
    const p = Promise.all([loadImage(COLOR_FRAMES[i]), loadImage(DEPTH_FRAMES[i])])
      .then(([c, d]) => {
        this.color[i] = c;
        this.depth[i] = d;
      })
      .finally(() => this.pending.delete(i));
    this.pending.set(i, p);
    return p;
  }

  // Primer fotograma bloqueante, los ocho siguientes en paralelo y el resto
  // en lotes de cuatro para no saturar la red.
  async start() {
    await this.load(0);
    void Promise.allSettled([1, 2, 3, 4, 5, 6, 7, 8].map((i) => this.load(i))).then(() =>
      this.background(9),
    );
  }

  private background(from: number) {
    let next = from;
    const batch = () => {
      if (this.stopped || next >= FRAME_COUNT) return;
      const jobs = [];
      for (let k = 0; k < 4 && next < FRAME_COUNT; k++, next++) jobs.push(this.load(next));
      void Promise.allSettled(jobs).then(() => setTimeout(batch, 20));
    };
    batch();
  }

  stop() {
    this.stopped = true;
  }

  // El fotograma cargado más cercano al pedido, o -1 si no hay ninguno.
  nearest(index: number) {
    const ready = (i: number) => i >= 0 && i < FRAME_COUNT && this.color[i] && this.depth[i];
    if (ready(index)) return index;
    for (let d = 1; d < FRAME_COUNT; d++) {
      if (ready(index - d)) return index - d;
      if (ready(index + d)) return index + d;
    }
    return -1;
  }
}

const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);

function createProgram(gl: WebGLRenderingContext, vertex: string, fragment: string) {
  const compile = (type: number, src: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) ?? "shader compile failed");
    }
    return shader;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "program link failed");
  }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  return program;
}

const QUAD_VERTEX =
  "attribute vec2 aPosition;varying vec2 vUv;void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}";

const DEPTH_FRAGMENT = `precision highp float;
uniform sampler2D uColor; uniform sampler2D uDepth;
uniform vec2 uPointer; uniform vec2 uStrength; uniform vec2 uCoverScale;
varying vec2 vUv;
void main(){
  vec2 uv=(vUv-.5)*uCoverScale+.5;
  float depth=texture2D(uDepth,uv).r;
  vec2 displaced=uv+uPointer*uStrength*((depth-.5)*2.);
  gl_FragColor=texture2D(uColor,clamp(displaced,vec2(.008),vec2(.992)));
}`;

const DEPTH_STRENGTH: [number, number] = [0.0144, 0.0108];
const POINTER_SMOOTHING = 0.055;

export class DepthRenderer {
  private gl: WebGLRenderingContext;
  private uniforms: Record<"pointer" | "cover", WebGLUniformLocation | null>;
  private colorTexture: WebGLTexture;
  private depthTexture: WebGLTexture;
  private pointerTarget = { x: 0, y: 0 };
  private pointer = { x: 0, y: 0 };
  private currentFrame = -1;
  private imageSize: [number, number] = [16, 9];

  constructor(
    private canvas: HTMLCanvasElement,
    private sequence: FrameSequence,
  ) {
    // preserveDrawingBuffer: PixelBlur copia este canvas en cada frame.
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    if (!gl) throw new Error("WebGL is not available");
    this.gl = gl;
    const program = createProgram(gl, QUAD_VERTEX, DEPTH_FRAGMENT);
    this.uniforms = {
      pointer: gl.getUniformLocation(program, "uPointer"),
      cover: gl.getUniformLocation(program, "uCoverScale"),
    };
    this.colorTexture = this.makeTexture(program, 0, "uColor");
    this.depthTexture = this.makeTexture(program, 1, "uDepth");
    gl.uniform2f(gl.getUniformLocation(program, "uStrength"), ...DEPTH_STRENGTH);
  }

  private makeTexture(program: WebGLProgram, unit: number, name: string) {
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(gl.getUniformLocation(program, name), unit);
    return tex;
  }

  private upload(tex: WebGLTexture, unit: number, img: HTMLImageElement) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  }

  // x/y en [-1, 1]
  setPointer(x: number, y: number) {
    this.pointerTarget.x = x;
    this.pointerTarget.y = y;
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(this.canvas.clientWidth * dpr);
    const h = Math.round(this.canvas.clientHeight * dpr);
    if (!w || !h) return;
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.gl.viewport(0, 0, w, h);
    }
    // "object-fit: cover" dentro del shader.
    const view = w / h;
    const image = this.imageSize[0] / this.imageSize[1];
    this.gl.uniform2f(this.uniforms.cover, view > image ? 1 : view / image, view > image ? image / view : 1);
  }

  // Fotograma que está en pantalla (-1 mientras no hay ninguno cargado).
  get frame() {
    return this.currentFrame;
  }

  // Lleva un punto de la imagen original (px) a px CSS del canvas con el mismo
  // recorte "cover" y el mismo paralaje que el shader para esa profundidad
  // (0 = fondo, 1 = cerca). `scale` = px CSS por px de imagen.
  project(ix: number, iy: number, depth: number) {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const [iw, ih] = this.imageSize;
    const view = w / h;
    const image = iw / ih;
    const sx = view > image ? 1 : view / image;
    const sy = view > image ? image / view : 1;
    const c = (depth - 0.5) * 2;
    // El shader muestra en p el texel p + d, así que el contenido se corre -d
    // (con la textura volteada en vertical).
    const u = ix / iw - this.pointer.x * DEPTH_STRENGTH[0] * c;
    const v = iy / ih + this.pointer.y * DEPTH_STRENGTH[1] * c;
    return { x: ((u - 0.5) / sx + 0.5) * w, y: ((v - 0.5) / sy + 0.5) * h, scale: w / (iw * sx) };
  }

  render(frame: number) {
    const index = this.sequence.nearest(frame);
    if (index < 0) return;
    if (index !== this.currentFrame) {
      const color = this.sequence.color[index]!;
      this.imageSize = [color.naturalWidth, color.naturalHeight];
      this.upload(this.colorTexture, 0, color);
      this.upload(this.depthTexture, 1, this.sequence.depth[index]!);
      this.currentFrame = index;
      this.resize();
    }
    this.pointer.x = lerp(this.pointer.x, this.pointerTarget.x, POINTER_SMOOTHING);
    this.pointer.y = lerp(this.pointer.y, this.pointerTarget.y, POINTER_SMOOTHING);
    this.gl.uniform2f(this.uniforms.pointer, this.pointer.x, this.pointer.y);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}

// backdrop-filter no puede desenfocar un canvas WebGL de forma fiable, así
// que cada panel "de cristal" pinta su propio recorte desenfocado del fondo.
export class PixelBlur {
  private items: { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; blur: number }[];

  constructor(
    private source: HTMLCanvasElement,
    root: ParentNode,
  ) {
    this.items = [...root.querySelectorAll<HTMLCanvasElement>(".ic-pixel-blur")].map((canvas) => ({
      canvas,
      ctx: canvas.getContext("2d")!,
      blur: Number(canvas.dataset.blur || 24),
    }));
  }

  render() {
    const src = this.source.getBoundingClientRect();
    if (!src.width || !src.height) return;
    const sx = this.source.width / src.width;
    const sy = this.source.height / src.height;
    for (const item of this.items) {
      const parent = item.canvas.parentElement!;
      const box = parent.getBoundingClientRect();
      if (box.width <= 0 || box.height <= 0 || getComputedStyle(parent).visibility === "hidden") continue;
      const pad = item.blur * 2;
      const cssW = box.width + pad * 2;
      const cssH = box.height + pad * 2;
      const w = Math.max(1, Math.round(cssW * sx));
      const h = Math.max(1, Math.round(cssH * sy));
      if (item.canvas.width !== w || item.canvas.height !== h) {
        item.canvas.width = w;
        item.canvas.height = h;
      }
      Object.assign(item.canvas.style, {
        left: `${-pad}px`,
        top: `${-pad}px`,
        width: `${cssW}px`,
        height: `${cssH}px`,
      });
      const ctx = item.ctx;
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.filter = `blur(${item.blur * sx}px)`;
      ctx.drawImage(this.source, -(box.left - src.left - pad) * sx, -(box.top - src.top - pad) * sy);
      ctx.restore();
    }
  }
}

const BURN_FRAGMENT = `precision highp float;varying vec2 vUv;uniform vec3 uBase;uniform vec2 uResolution;uniform float uProgress;uniform float uTime;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec2(13.7,8.4);a*=.5;}return v;}
void main(){vec2 uv=vUv;vec2 p=uv-.5;p.x*=uResolution.x/uResolution.y;
float n=fbm(uv*3.1+vec2(uTime*.035,-uTime*.025));float detail=fbm(uv*8.4-vec2(uTime*.02));
float field=length(p)+(n-.5)*.24+(detail-.5)*.065;float threshold=mix(-.22,1.02,uProgress);
float alpha=smoothstep(threshold-.045,threshold+.045,field);float rim=1.-smoothstep(.006,.052,abs(field-threshold));
float coverage=max(alpha,rim*.18);vec3 color=mix(uBase,vec3(1.),rim*.68);gl_FragColor=vec4(color*coverage,coverage);}`;

export class BurnTransition {
  private gl: WebGLRenderingContext;
  private progress: WebGLUniformLocation | null;
  private time: WebGLUniformLocation | null;
  private resolution: WebGLUniformLocation | null;

  constructor(private canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true });
    if (!gl) throw new Error("WebGL unavailable for loader transition");
    this.gl = gl;
    const program = createProgram(gl, QUAD_VERTEX, BURN_FRAGMENT);
    this.progress = gl.getUniformLocation(program, "uProgress");
    this.time = gl.getUniformLocation(program, "uTime");
    this.resolution = gl.getUniformLocation(program, "uResolution");
    // Azul hielo de la capa que se "derrite" sobre la escena.
    gl.uniform3f(gl.getUniformLocation(program, "uBase"), 96 / 255, 154 / 255, 202 / 255);
    this.render(0);
  }

  private resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(this.canvas.clientWidth * dpr);
    const h = Math.round(this.canvas.clientHeight * dpr);
    if (w && h && (this.canvas.width !== w || this.canvas.height !== h)) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.gl.viewport(0, 0, w, h);
      this.gl.uniform2f(this.resolution, w, h);
    }
  }

  render(progress: number) {
    this.resize();
    this.gl.uniform1f(this.progress, progress);
    this.gl.uniform1f(this.time, performance.now() / 1000);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  play(duration: number) {
    return new Promise<void>((resolve) => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        this.render(t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
  }
}
