"use client";
import { useEffect, useRef, useState } from "react";
export type SceneMotion={x:number;y:number;scroll:number};
type A={bufferView:number;byteOffset?:number;componentType:number;count:number;type:string;normalized?:boolean;min?:number[];max?:number[]};
type V={byteOffset?:number;byteLength:number};
type G={accessors:A[];bufferViews:V[];meshes:{primitives:{attributes:Record<string,number>;indices:number}[]}[];images:{bufferView:number;mimeType:string}[];textures:{source:number}[];materials:{normalTexture?:{index:number};pbrMetallicRoughness?:{baseColorTexture?:{index:number}}}[]};
const VS=`#version 300 es
precision highp float;
in vec3 aPosition;in vec3 aNormal;in vec2 aUV;
uniform float uYaw,uPitch,uTime,uScroll,uAspect,uFracture;uniform vec3 uCenter,uShard;
out vec3 vNormal,vEye,vWorld;out vec2 vUV;
void main(){
 vec3 p=aPosition-uCenter;vec3 n=aNormal;
 p=vec3(p.x,-p.z,p.y);n=vec3(n.x,-n.z,n.y);
 float cy=cos(uYaw),sy=sin(uYaw),cx=cos(uPitch),sx=sin(uPitch);
 mat3 ry=mat3(cy,0.,-sy,0.,1.,0.,sy,0.,cy);
 mat3 rx=mat3(1.,0.,0.,0.,cx,sx,0.,-sx,cx);
 mat3 rot=rx*ry;
 p=rot*p*3.05;
 // Each spatial region is rendered from a separate index range: genuine 3D shards.
 vec3 displace=rot*uShard;
 p+=displace*uFracture;
 p.y+=sin(uTime*.65)*.055-uScroll*.16;p.z-=5.2;
 vNormal=normalize(rot*n);vEye=normalize(-p);vWorld=p;vUV=aUV;
 float f=2.35;gl_Position=vec4(p.x*f/uAspect,p.y*f,-1.004*p.z-.2004,-p.z);
}`;
const FS=`#version 300 es
precision highp float;
in vec3 vNormal,vEye,vWorld;in vec2 vUV;
uniform sampler2D uAlbedo,uNormalTex;out vec4 fragColor;
void main(){
 vec3 n=normalize(vNormal);
 vec3 dp1=dFdx(vWorld),dp2=dFdy(vWorld);
 vec2 duv1=dFdx(vUV),duv2=dFdy(vUV);
 vec3 T=normalize(dp1*duv2.y-dp2*duv1.y);
 vec3 B=normalize(-dp1*duv2.x+dp2*duv1.x);
 vec3 mapped=texture(uNormalTex,vUV).rgb*2.-1.;
 n=normalize(mat3(T,B,n)*mapped);
 vec3 base=texture(uAlbedo,vUV).rgb;
 float key=max(dot(n,normalize(vec3(-.65,.9,1.1))),0.);
 float fill=max(dot(n,normalize(vec3(.9,-.12,-.6))),0.);
 float rim=pow(1.-max(dot(n,normalize(vEye)),0.),2.8);
 vec3 tint=mix(vec3(.14,.34,.56),vec3(.73,.94,.98),key);
 vec3 ice=mix(base,tint,.50)*(.66+key*.48);
 ice+=vec3(.22,.17,.59)*fill*.55+vec3(.36,.76,.84)*rim*.55;
 fragColor=vec4(ice,1.);
}`;
function compile(gl:WebGL2RenderingContext,type:number,src:string){
 const sh=gl.createShader(type);if(!sh)throw Error("Shader allocation failed");
 gl.shaderSource(sh,src);gl.compileShader(sh);
 if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh)||"Shader error");
 return sh;
}
function parse(data:ArrayBuffer):{json:G;bin:ArrayBuffer}{
 const view=new DataView(data);if(view.getUint32(0,true)!==0x46546c67||view.getUint32(4,true)!==2)throw Error("Invalid GLB");
 let pos=12,json:G|undefined,bin:ArrayBuffer|undefined;
 while(pos<data.byteLength){const size=view.getUint32(pos,true),type=view.getUint32(pos+4,true);pos+=8;
 if(type===0x4e4f534a)json=JSON.parse(new TextDecoder().decode(new Uint8Array(data,pos,size))) as G;
 if(type===0x004e4942)bin=data.slice(pos,pos+size);pos+=size;}
 if(!json||!bin)throw Error("Incomplete GLB");return {json,bin};
}
export default function IcebergGLB({motion,fracture=0}:{motion:React.RefObject<SceneMotion>;fracture?:number}){
 const ref=useRef<HTMLCanvasElement>(null);
 const fractureRef=useRef(fracture);
 useEffect(()=>{fractureRef.current=fracture;},[fracture]);
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  if(window.matchMedia("(max-width: 760px), (prefers-reduced-motion: reduce)").matches)return;
  const gl=canvas.getContext("webgl2",{alpha:true,antialias:true});
  if(!gl)return;
  let disposed=false,visible=true,raf=0;
  let resizeObserver:ResizeObserver|undefined,visibilityObserver:IntersectionObserver|undefined;
  const resources:Array<WebGLBuffer|WebGLProgram|WebGLShader|WebGLTexture>=[];
  const lost=(event:Event)=>{event.preventDefault();visible=false;setReady(false);};
  canvas.addEventListener("webglcontextlost",lost);
  (async()=>{
   try{
    const response=await fetch("/models/iceberg-web.glb",{cache:"force-cache"});
    if(!response.ok)throw Error("3D model unavailable: "+response.status);
    const {json,bin}=parse(await response.arrayBuffer());if(disposed)return;
    const vs=compile(gl,gl.VERTEX_SHADER,VS),fs=compile(gl,gl.FRAGMENT_SHADER,FS);
    const program=gl.createProgram();if(!program)throw Error("GL program allocation failed");
    resources.push(vs,fs,program);
    gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program)||"Link failed");
    gl.useProgram(program);
    const primitive=json.meshes[0].primitives[0];
    for(const [semantic,name,count] of [["POSITION","aPosition",3],["NORMAL","aNormal",3],["TEXCOORD_0","aUV",2]] as const){
      const a=json.accessors[primitive.attributes[semantic]],v=json.bufferViews[a.bufferView];
      const buffer=gl.createBuffer();if(!buffer)throw Error("Vertex buffer allocation failed");resources.push(buffer);
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      const offset=(v.byteOffset||0)+(a.byteOffset||0);
      gl.bufferData(gl.ARRAY_BUFFER,new Uint8Array(bin,offset,v.byteLength-(a.byteOffset||0)),gl.STATIC_DRAW);
      const location=gl.getAttribLocation(program,name);
      if(location<0)throw Error("Missing vertex attribute "+name);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location,count,a.componentType,a.normalized||false,0,0);
    }
    const a=json.accessors[primitive.indices],v=json.bufferViews[a.bufferView],index=gl.createBuffer();
    if(!index)throw Error("Index buffer allocation failed");resources.push(index);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index);
    // Group triangles by angular sector and height band. Each group can separate
    // without altering the original textured vertices or drawing fake cracks.
    const vertexAccessor=json.accessors[primitive.attributes.POSITION];
    const verticesView=json.bufferViews[vertexAccessor.bufferView];
    const vertices=new Float32Array(bin,(verticesView.byteOffset||0)+(vertexAccessor.byteOffset||0),vertexAccessor.count*3);
    const indices=new Uint32Array(bin,(v.byteOffset||0)+(a.byteOffset||0),a.count);
    const shardCount=32;
    const groups:Array<number[]>=Array.from({length:shardCount},()=>[]);
    const boundsMin=vertexAccessor.min||[-.475,-.489,-.981];
    const boundsMax=vertexAccessor.max||[.465,.46,0];
    const centerX=(boundsMin[0]+boundsMax[0])/2,centerY=(boundsMin[1]+boundsMax[1])/2;
    for(let i=0;i<indices.length;i+=3){
      const i0=indices[i]*3,i1=indices[i+1]*3,i2=indices[i+2]*3;
      const x=(vertices[i0]+vertices[i1]+vertices[i2])/3-centerX;
      const z=(vertices[i0+1]+vertices[i1+1]+vertices[i2+1])/3-centerY;
      const height=-(vertices[i0+2]+vertices[i1+2]+vertices[i2+2])/3;
      const angle=(Math.atan2(z,x)+Math.PI)/(Math.PI*2);
      const sector=Math.min(7,Math.floor(angle*8));
      const band=Math.min(3,Math.max(0,Math.floor(height/.99*4)));
      groups[band*8+sector].push(indices[i],indices[i+1],indices[i+2]);
    }
    const ordered=new Uint32Array(indices.length);
    const draws:{offset:number;count:number;direction:[number,number,number]}[]=[];
    let cursor=0;
    for(let g=0;g<shardCount;g++){
      const group=groups[g],sector=g%8,band=Math.floor(g/8);
      ordered.set(group,cursor);
      const angle=(sector+.5)*Math.PI/4-Math.PI;
      const mag=.55+(band%2)*.17;
      draws.push({offset:cursor*4,count:group.length,direction:[Math.cos(angle)*mag,(band-1.5)*.31,Math.sin(angle)*mag]});
      cursor+=group.length;
    }
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,ordered,gl.STATIC_DRAW);
    const material=json.materials[0];
    const texIds=[material.pbrMetallicRoughness?.baseColorTexture?.index,material.normalTexture?.index];
    for(let unit=0;unit<2;unit++){
      const texId=texIds[unit];if(texId===undefined)throw Error("Missing GLB textures");
      const image=json.images[json.textures[texId].source],view=json.bufferViews[image.bufferView];
      const bytes=bin.slice(view.byteOffset||0,(view.byteOffset||0)+view.byteLength);
      const bitmap=await createImageBitmap(new Blob([bytes],{type:image.mimeType}));
      if(disposed){bitmap.close();return;}
      const tex=gl.createTexture();if(!tex)throw Error("GL texture allocation failed");resources.push(tex);
      gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,bitmap);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.uniform1i(gl.getUniformLocation(program,unit===0?"uAlbedo":"uNormalTex"),unit);bitmap.close();
    }
    if(disposed)return;
    const uniform=(name:string)=>gl.getUniformLocation(program,name);
    const pos=json.accessors[primitive.attributes.POSITION],lower=pos.min||[-.475,-.489,-.981],upper=pos.max||[.465,.46,0];
    gl.uniform3f(uniform("uCenter"),(lower[0]+upper[0])/2,(lower[1]+upper[1])/2,(lower[2]+upper[2])/2);
    const yaw=uniform("uYaw"),pitch=uniform("uPitch"),time=uniform("uTime"),scroll=uniform("uScroll"),aspect=uniform("uAspect");
    const resize=()=>{
      const bounds=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.5);
      const width=Math.max(1,Math.round(bounds.width*dpr)),height=Math.max(1,Math.round(bounds.height*dpr));
      if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);}
      gl.uniform1f(aspect,width/height);
    };
    resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);resize();
    visibilityObserver=new IntersectionObserver(entries=>{visible=!!entries[0]?.isIntersecting;});
    visibilityObserver.observe(canvas);
    let prev=0,rotation=.32,tilt=-.08,breakValue=0;
    const shardUniform=uniform("uShard"),fractureUniform=uniform("uFracture");
    const draw=(ms:number)=>{
      if(disposed)return;raf=requestAnimationFrame(draw);
      if(!visible||document.hidden||ms-prev<30)return;prev=ms;
      const p=motion.current;
      rotation+=(.3+p.x*.28-rotation)*.065;
      tilt+=(-.08-p.y*.14+p.scroll*.17-tilt)*.07;
      gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);
      gl.uniform1f(yaw,rotation);gl.uniform1f(pitch,tilt);
      gl.uniform1f(time,ms/1000);gl.uniform1f(scroll,p.scroll);
      const target=[0,.17,.52,2.5][fractureRef.current]??0;
      breakValue+=(target-breakValue)*.085;
      gl.uniform1f(fractureUniform,breakValue);
      for(const shard of draws){
        gl.uniform3fv(shardUniform,shard.direction);
        gl.drawElements(gl.TRIANGLES,shard.count,gl.UNSIGNED_INT,shard.offset);
      }
    };
    setReady(true);raf=requestAnimationFrame(draw);
   }catch(error){if(!disposed)console.warn("3D iceberg fallback",error);}
  })();
  return()=>{disposed=true;cancelAnimationFrame(raf);resizeObserver?.disconnect();visibilityObserver?.disconnect();
   canvas.removeEventListener("webglcontextlost",lost);
   for(const item of resources){if(gl.isTexture(item))gl.deleteTexture(item);
    else if(gl.isBuffer(item))gl.deleteBuffer(item);
    else if(gl.isProgram(item))gl.deleteProgram(item);
    else if(gl.isShader(item))gl.deleteShader(item);}
  };
 },[motion]);
 return <div className="iceberg-model" role="img" aria-label="Iceberg 3D interactivo">
   <canvas ref={ref} className="iceberg-model-canvas" aria-hidden="true" style={{opacity:ready?1:0}}/>
   {!ready&&<div className="iceberg-model-fallback" aria-hidden="true"/>}
 </div>;
}
