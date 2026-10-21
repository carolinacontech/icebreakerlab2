"use client";

import { useEffect, useRef, useState } from "react";

export type SceneMotion = { x: number; y: number; scroll: number };

type Accessor = {
  bufferView: number; byteOffset?: number; componentType: number;
  count: number; type: string; min?: number[]; max?: number[];
};
type BufferView = { byteOffset?: number; byteLength: number };
type GLB = {
  accessors: Accessor[]; bufferViews: BufferView[];
  meshes: { primitives: { attributes: Record<string, number>; indices: number }[] }[];
  images: { bufferView: number; mimeType: string }[];
  textures: { source: number }[];
  materials: { normalTexture?: { index: number };
    pbrMetallicRoughness?: { baseColorTexture?: { index: number } } }[];
};

const ICE_VERTEX = `#version 300 es
precision highp float;
in vec3 aPosition;
in vec3 aNormal;
in vec2 aUv;
uniform vec3 uCenter, uShard, uPivot;
uniform float uYaw, uPitch, uTime, uScroll, uAspect, uBreak, uFlight, uPlacement;
out vec3 vNormal, vEye, vWorld;
out vec2 vUv;
void main() {
  vec3 p = aPosition - uCenter;
  vec3 n = aNormal;
  // Source GLB: negative Z points upwards after rotating into web world.
  p = vec3(p.x, -p.z, p.y);
  n = vec3(n.x, -n.z, n.y);
  float cy = cos(uYaw), sy = sin(uYaw);
  float cx = cos(uPitch), sx = sin(uPitch);
  mat3 ry = mat3(cy,0.,-sy, 0.,1.,0., sy,0.,cy);
  mat3 rx = mat3(1.,0.,0., 0.,cx,sx, 0.,-sx,cx);
  mat3 rotation = rx * ry;
  vec3 pivot = rotation * uPivot;
  vec3 q = rotation * p;
  // Rotate each contiguous surface region around its own 3D centroid.
  float spin = uBreak * .33 * (uShard.x * 1.4 + uShard.z);
  mat3 twist = mat3(cos(spin),0.,-sin(spin), 0.,1.,0., sin(spin),0.,cos(spin));
  q = pivot + twist * (q - pivot);
  q *= 3.5;
  q += rotation * uShard * (uBreak * 2.65 + uFlight * 1.1);
  q.x += uPlacement;
  q.y += sin(uTime * .57) * .048 - uScroll * .18;
  q.z -= 5.85;
  vNormal = normalize(rotation * n);
  vEye = normalize(-q);
  vWorld = q;
  vUv = aUv;
  float nearPlane = .1, farPlane = 80.;
  float f = 2.22;
  gl_Position = vec4(q.x * f/uAspect, q.y*f,
    -(farPlane+nearPlane)/(farPlane-nearPlane)*q.z
    -2.*farPlane*nearPlane/(farPlane-nearPlane), -q.z);
}`;

const ICE_FRAGMENT = `#version 300 es
precision highp float;
in vec3 vNormal, vEye, vWorld;
in vec2 vUv;
uniform sampler2D uAlbedo, uNormalTex;
uniform float uBreak;
out vec4 outColor;
vec3 tonemap(vec3 color) {
  return (color * (2.51 * color + .03)) /
         (color * (2.43 * color + .59) + .14);
}
void main() {
  vec3 n = normalize(vNormal);
  vec3 dpdx = dFdx(vWorld), dpdy = dFdy(vWorld);
  vec2 dUVdx = dFdx(vUv), dUVdy = dFdy(vUv);
  vec3 tangent = normalize(dpdx*dUVdy.y - dpdy*dUVdx.y);
  vec3 bitangent = normalize(-dpdx*dUVdy.x + dpdy*dUVdx.x);
  vec3 normalMap = texture(uNormalTex, vUv).rgb*2.-1.;
  vec3 detailNormal = normalize(mat3(tangent,bitangent,n)*normalMap);
  n = normalize(mix(n, detailNormal, .36));
  vec3 view = normalize(vEye);
  vec3 albedo = texture(uAlbedo, vUv).rgb;
  float iceTexture = dot(albedo,vec3(.2126,.7152,.0722));
  // Icy blue body; original fine texture is preserved as microcontrast.
  vec3 body = mix(vec3(.055,.22,.39),vec3(.38,.83,.91),clamp(iceTexture*1.55,0.,1.));
  vec3 sunlight = normalize(vec3(-.42,.86,.56));
  vec3 purpleFill = normalize(vec3(.95,.20,-.55));
  float light = max(dot(n,sunlight),0.);
  float fill = max(dot(n,purpleFill),0.);
  float translucence = max(dot(-n,sunlight),0.);
  float fresnel = pow(1.-clamp(dot(n,view),0.,1.),3.2);
  vec3 halfVector = normalize(sunlight+view);
  float specular = pow(max(dot(n,halfVector),0.),90.);
  float broadSpec = pow(max(dot(n,halfVector),0.),13.);
  vec3 color = body*(.42+light*.90+translucence*.22);
  color += vec3(.31,.17,.88)*fill*.34;
  color += vec3(.16,.8,1.)*fresnel*1.13;
  color += vec3(.8,1.,1.)*specular*1.6;
  color += vec3(.22,.68,.95)*broadSpec*.22;
  color += vec3(.14,.53,.74)*uBreak*.14;
  color = tonemap(color*1.18);
  outColor = vec4(pow(clamp(color,0.,1.),vec3(1./2.2)),1.);
}`;

const DUST_VERTEX = `#version 300 es
precision highp float;
in vec3 aPoint, aSpeed;
in float aSeed;
uniform float uYaw, uAspect, uPlacement, uTimeSinceBreak, uPixelRatio;
out float vOpacity,vSeed;
void main() {
  float t = max(uTimeSinceBreak,0.);
  vec3 p = aPoint;
  float angle = uYaw;
  p = vec3(p.x*cos(angle)+p.z*sin(angle),p.y,-p.x*sin(angle)+p.z*cos(angle));
  p *= 3.5;
  p += aSpeed*(t*3.35) + vec3(0.,-1.,0.)*(t*t*.54);
  p.x += uPlacement;
  p.z -= 5.85;
  float f=2.22;
  float nearPlane=.1,farPlane=80.;
  gl_Position=vec4(p.x*f/uAspect,p.y*f,
    -(farPlane+nearPlane)/(farPlane-nearPlane)*p.z
    -2.*farPlane*nearPlane/(farPlane-nearPlane),-p.z);
  gl_PointSize=clamp((3.5+aSeed*3.3)*uPixelRatio*5.8/max(-p.z,1.),1.,10.);
  vOpacity= (uTimeSinceBreak < 0. ? 0. : (1.-smoothstep(1.2,3.6,t)))*
    (1.-.55*aSeed);
  vSeed=aSeed;
}`;

const DUST_FRAGMENT = `#version 300 es
precision highp float;
in float vOpacity,vSeed;
out vec4 outColor;
void main() {
  vec2 uv=gl_PointCoord*2.-1.;
  float r=length(uv);
  float sparkle=pow(max(0.,1.-r),2.2);
  if(sparkle<.02 || vOpacity<=0.) discard;
  vec3 hue=mix(vec3(.28,.83,1.),vec3(.89,.77,1.),vSeed);
  outColor=vec4(hue,sparkle*vOpacity*.8);
}`;

function parseGLB(data: ArrayBuffer): { json: GLB; binary: ArrayBuffer } {
  const view = new DataView(data);
  if (view.getUint32(0,true)!==0x46546c67 || view.getUint32(4,true)!==2) {
    throw Error("Invalid GLB header");
  }
  let offset=12, json:GLB|undefined, binary:ArrayBuffer|undefined;
  while(offset<data.byteLength) {
    const length=view.getUint32(offset,true), kind=view.getUint32(offset+4,true);
    offset+=8;
    if(kind===0x4e4f534a)json=JSON.parse(new TextDecoder().decode(new Uint8Array(data,offset,length))) as GLB;
    if(kind===0x004e4942)binary=data.slice(offset,offset+length);
    offset+=length;
  }
  if(!json||!binary)throw Error("Incomplete GLB");
  return {json,binary};
}
function shader(gl:WebGL2RenderingContext,kind:number,source:string) {
  const result=gl.createShader(kind);
  if(!result)throw Error("Unable to allocate shader");
  gl.shaderSource(result,source);
  gl.compileShader(result);
  if(!gl.getShaderParameter(result,gl.COMPILE_STATUS)) {
    throw Error(gl.getShaderInfoLog(result)||"Shader compile error");
  }
  return result;
}
function program(gl:WebGL2RenderingContext,vs:string,fs:string) {
  const vert=shader(gl,gl.VERTEX_SHADER,vs),frag=shader(gl,gl.FRAGMENT_SHADER,fs);
  const result=gl.createProgram();
  if(!result)throw Error("Unable to allocate WebGL program");
  gl.attachShader(result,vert);gl.attachShader(result,frag);
  gl.linkProgram(result);gl.deleteShader(vert);gl.deleteShader(frag);
  if(!gl.getProgramParameter(result,gl.LINK_STATUS)) {
    throw Error(gl.getProgramInfoLog(result)||"Program link error");
  }
  return result;
}
function bindAttribute(gl:WebGL2RenderingContext,program:WebGLProgram,name:string,
  components:number,values:Float32Array|Uint8Array) {
  const loc=gl.getAttribLocation(program,name);
  if(loc===-1)return null;
  const buffer=gl.createBuffer();
  if(!buffer)throw Error("Unable to allocate vertex buffer");
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,values,gl.STATIC_DRAW);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc,components,gl.FLOAT,false,0,0);
  return buffer;
}
type Shard = { offset:number; count:number; direction:[number,number,number]; pivot:[number,number,number] };
export default function IcebergGLB({motion,fracture}:{motion:React.RefObject<SceneMotion>;fracture:number}) {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const stageRef=useRef(fracture);
  const [ready,setReady]=useState(false);
  useEffect(()=>{stageRef.current=fracture;},[fracture]);
  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas || window.matchMedia("(max-width:760px), (prefers-reduced-motion:reduce)").matches) return;
    const gl=canvas.getContext("webgl2",{alpha:true,antialias:true,premultipliedAlpha:false});
    if(!gl)return;
    const abort=new AbortController();
    let disposed=false,raf=0,visible=true,lastStage=0,fractureAmount=0,burstStarted=-1;
    let resizeObserver:ResizeObserver|undefined,intersectionObserver:IntersectionObserver|undefined;
    const buffers:WebGLBuffer[]=[];
    const programs:WebGLProgram[]=[];
    const textures:WebGLTexture[]=[];
    const arrays:WebGLVertexArrayObject[]=[];
    const lost=(e:Event)=>{e.preventDefault();visible=false;setReady(false);};
    canvas.addEventListener("webglcontextlost",lost);
    (async()=>{
      try {
        const response=await fetch("/models/iceberg-web.glb",{signal:abort.signal,cache:"force-cache"});
        if(!response.ok)throw Error("GLB HTTP "+response.status);
        const {json,binary}=parseGLB(await response.arrayBuffer());
        if(disposed)return;
        const primitive=json.meshes[0].primitives[0];
        const position=json.accessors[primitive.attributes.POSITION];
        const normal=json.accessors[primitive.attributes.NORMAL];
        const uv=json.accessors[primitive.attributes.TEXCOORD_0];
        const getFloats=(a:Accessor)=>{
          const view=json.bufferViews[a.bufferView];
          const offset=(view.byteOffset||0)+(a.byteOffset||0);
          return new Float32Array(binary,offset,a.count*(a.type==="VEC2"?2:3));
        };
        const vertices=getFloats(position),normals=getFloats(normal),uvs=getFloats(uv);
        const lower=position.min||[-.475,-.489,-.981],upper=position.max||[.465,.46,0];
        const center=[(lower[0]+upper[0])/2,(lower[1]+upper[1])/2,(lower[2]+upper[2])/2];
        const idxAccessor=json.accessors[primitive.indices],idxView=json.bufferViews[idxAccessor.bufferView];
        const originalIndices=new Uint32Array(binary,(idxView.byteOffset||0)+(idxAccessor.byteOffset||0),idxAccessor.count);
        const groups:Array<number[]>=Array.from({length:48},()=>[]);
        const centers=Array.from({length:48},()=>[0,0,0,0]);
        for(let i=0;i<originalIndices.length;i+=3) {
          const i0=originalIndices[i]*3,i1=originalIndices[i+1]*3,i2=originalIndices[i+2]*3;
          const x=(vertices[i0]+vertices[i1]+vertices[i2])/3-center[0];
          const depth=(vertices[i0+1]+vertices[i1+1]+vertices[i2+1])/3-center[1];
          const height=-(vertices[i0+2]+vertices[i1+2]+vertices[i2+2])/3;
          const sector=Math.min(11,Math.floor((Math.atan2(depth,x)+Math.PI)/(2*Math.PI)*12));
          const band=Math.min(3,Math.max(0,Math.floor(height/1.05*4)));
          const group=band*12+sector;
          groups[group].push(originalIndices[i],originalIndices[i+1],originalIndices[i+2]);
          centers[group][0]+=x;centers[group][1]+=height+center[2];centers[group][2]+=depth;
          centers[group][3]++;
        }
        const sorted=new Uint32Array(originalIndices.length);
        const shards:Shard[]=[];let cursor=0;
        for(let i=0;i<groups.length;i++) {
          const current=groups[i],angle=(i%12+.5)*Math.PI/6-Math.PI;
          sorted.set(current,cursor);
          const cent=centers[i],num=Math.max(cent[3],1),band=Math.floor(i/12);
          const radius=.56+((i*37)%13)*.018;
          shards.push({
            offset:cursor*4,count:current.length,
            direction:[Math.cos(angle)*radius,(band-1.5)*.29+Math.sin(i*7)*.12,Math.sin(angle)*radius],
            pivot:[cent[0]/num,cent[1]/num,cent[2]/num]
          });
          cursor+=current.length;
        }
        const iceProgram=program(gl,ICE_VERTEX,ICE_FRAGMENT);
        const dustProgram=program(gl,DUST_VERTEX,DUST_FRAGMENT);
        programs.push(iceProgram,dustProgram);
        const iceVAO=gl.createVertexArray();
        if(!iceVAO)throw Error("Unable to allocate ice VAO");
        arrays.push(iceVAO);gl.bindVertexArray(iceVAO);
        gl.useProgram(iceProgram);
        for(const [name,size,values] of [
          ["aPosition",3,vertices],["aNormal",3,normals],["aUv",2,uvs]
        ] as [string,number,Float32Array][]) {
          const buffer=bindAttribute(gl,iceProgram,name,size,values);
          if(buffer)buffers.push(buffer);
        }
        const index=gl.createBuffer();if(!index)throw Error("Unable to allocate index buffer");
        buffers.push(index);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,sorted,gl.STATIC_DRAW);
        gl.bindVertexArray(null);
        const mat=json.materials[0];
        const ids=[mat.pbrMetallicRoughness?.baseColorTexture?.index,mat.normalTexture?.index];
        for(let unit=0;unit<2;unit++){
          const texId=ids[unit];if(texId===undefined)throw Error("Missing texture");
          const img=json.images[json.textures[texId].source],view=json.bufferViews[img.bufferView];
          const offset=view.byteOffset||0;
          const bitmap=await createImageBitmap(new Blob([binary.slice(offset,offset+view.byteLength)],{type:img.mimeType}));
          if(disposed){bitmap.close();return;}
          const tex=gl.createTexture();if(!tex)throw Error("Unable to allocate texture");
          textures.push(tex);
          gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,tex);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
          gl.texImage2D(gl.TEXTURE_2D,0,unit===0?gl.SRGB8:gl.RGB8,gl.RGB,gl.UNSIGNED_BYTE,bitmap);
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
          gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
          gl.uniform1i(gl.getUniformLocation(iceProgram,unit===0?"uAlbedo":"uNormalTex"),unit);
          bitmap.close();
        }
        if(disposed)return;
        const pCount=1800,points=new Float32Array(pCount*3),
          speed=new Float32Array(pCount*3),seeds=new Float32Array(pCount);
        for(let i=0;i<pCount;i++){
          const vi=((i*173+79)%position.count)*3,k=i*3;
          const x=vertices[vi]-center[0],z=vertices[vi+1]-center[1],y=-(vertices[vi+2]-center[2]);
          points[k]=x;points[k+1]=y;points[k+2]=z;
          let theta=(i*2.3999632297)%(Math.PI*2);
          const random=((i*7127)%1987)/1987;
          const direction=Math.hypot(x,z)||1;
          speed[k]=(x/direction*.7+Math.cos(theta)*.9)*(.6+random);
          speed[k+1]=(.28+y*.45+Math.sin(theta*.65)*.85)*(.6+random);
          speed[k+2]=(z/direction*.7+Math.sin(theta)*.5)*(.6+random);
          seeds[i]=random;
        }
        const dustVAO=gl.createVertexArray();
        if(!dustVAO)throw Error("Unable to allocate particle VAO");
        arrays.push(dustVAO);gl.bindVertexArray(dustVAO);gl.useProgram(dustProgram);
        for(const [name,size,values] of [
          ["aPoint",3,points],["aSpeed",3,speed],["aSeed",1,seeds]
        ] as [string,number,Float32Array][]) {
          const buffer=bindAttribute(gl,dustProgram,name,size,values);
          if(buffer)buffers.push(buffer);
        }
        gl.bindVertexArray(null);
        const loc=(p:WebGLProgram,n:string)=>gl.getUniformLocation(p,n);
        const ui={
          center:loc(iceProgram,"uCenter"),yaw:loc(iceProgram,"uYaw"),
          pitch:loc(iceProgram,"uPitch"),time:loc(iceProgram,"uTime"),
          scroll:loc(iceProgram,"uScroll"),aspect:loc(iceProgram,"uAspect"),
          brk:loc(iceProgram,"uBreak"),flight:loc(iceProgram,"uFlight"),
          placement:loc(iceProgram,"uPlacement"),
          shard:loc(iceProgram,"uShard"),pivot:loc(iceProgram,"uPivot")
        };
        const ud={
          yaw:loc(dustProgram,"uYaw"),aspect:loc(dustProgram,"uAspect"),
          placement:loc(dustProgram,"uPlacement"),
          time:loc(dustProgram,"uTimeSinceBreak"),
          ratio:loc(dustProgram,"uPixelRatio")
        };
        let aspect=1,ratio=1;
        const resize=()=>{
          const rect=canvas.getBoundingClientRect();
          ratio=Math.min(window.devicePixelRatio||1,1.5);
          const width=Math.max(1,Math.round(rect.width*ratio));
          const height=Math.max(1,Math.round(rect.height*ratio));
          if(canvas.width!==width||canvas.height!==height) {
            canvas.width=width;canvas.height=height;
            gl.viewport(0,0,width,height);
          }
          aspect=width/height;
        };
        resizeObserver=new ResizeObserver(resize);
        resizeObserver.observe(canvas);resize();
        intersectionObserver=new IntersectionObserver(entries=>{visible=!!entries[0]?.isIntersecting;});
        intersectionObserver.observe(canvas);
        let yaw=.29,pitch=-.06,prev=0;
        const render=(ms:number)=>{
          if(disposed)return;
          raf=requestAnimationFrame(render);
          if(!visible||document.hidden||ms-prev<25)return;
          prev=ms;
          resize();
          const stage=stageRef.current;
          if(stage===3&&lastStage!==3)burstStarted=ms;
          if(stage===0&&lastStage!==0)burstStarted=-1;
          lastStage=stage;
          const target=[0,.035,.23,1][stage]??0;
          fractureAmount+=(target-fractureAmount)*.065;
          const flight=stage===3&&burstStarted>=0?Math.min((ms-burstStarted)/1000,2.4):0;
          const p=motion.current;
          yaw+=(.27+p.x*.19-yaw)*.065;
          pitch+=(-.06-p.y*.12+p.scroll*.12-pitch)*.06;
          const placement=(aspect*5.85/2.22)*.49;
          gl.viewport(0,0,canvas.width,canvas.height);
          gl.clearColor(0,0,0,0);
          gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
          gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);
          gl.useProgram(iceProgram);gl.bindVertexArray(iceVAO);
          gl.uniform3fv(ui.center,center);
          gl.uniform1f(ui.yaw,yaw);gl.uniform1f(ui.pitch,pitch);
          gl.uniform1f(ui.time,ms/1000);gl.uniform1f(ui.scroll,p.scroll);
          gl.uniform1f(ui.aspect,aspect);gl.uniform1f(ui.placement,placement);
          gl.uniform1f(ui.brk,fractureAmount);gl.uniform1f(ui.flight,flight);
          for(const shard of shards) {
            if(!shard.count)continue;
            gl.uniform3fv(ui.shard,shard.direction);
            gl.uniform3fv(ui.pivot,shard.pivot);
            gl.drawElements(gl.TRIANGLES,shard.count,gl.UNSIGNED_INT,shard.offset);
          }
          gl.bindVertexArray(null);
          if(burstStarted>=0){
            gl.useProgram(dustProgram);gl.bindVertexArray(dustVAO);
            gl.depthMask(false);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
            gl.uniform1f(ud.yaw,yaw);gl.uniform1f(ud.aspect,aspect);
            gl.uniform1f(ud.placement,placement);
            gl.uniform1f(ud.time,(ms-burstStarted)/1000);
            gl.uniform1f(ud.ratio,ratio);
            gl.drawArrays(gl.POINTS,0,pCount);
            gl.disable(gl.BLEND);gl.depthMask(true);gl.bindVertexArray(null);
          }
        };
        setReady(true);
        raf=requestAnimationFrame(render);
      }catch(error){
        if(!disposed&&!abort.signal.aborted)console.warn("Iceberg 3D fallback",error);
      }
    })();
    return()=>{
      disposed=true;abort.abort();cancelAnimationFrame(raf);
      resizeObserver?.disconnect();intersectionObserver?.disconnect();
      canvas.removeEventListener("webglcontextlost",lost);
      for(const vao of arrays)gl.deleteVertexArray(vao);
      for(const b of buffers)gl.deleteBuffer(b);
      for(const t of textures)gl.deleteTexture(t);
      for(const p of programs)gl.deleteProgram(p);
    };
  },[motion]);
  return (
    <div className="ibh-fullscene" role="img" aria-label="Sculptural iceberg that shatters into flying 3D fragments">
      <canvas ref={canvasRef} aria-hidden="true" className="ibh-fullscene-canvas"
        style={{opacity:ready?1:0}} />
    </div>
  );
}
