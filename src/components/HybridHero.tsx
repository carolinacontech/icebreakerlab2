"use client";
import Image from "next/image";
import {useEffect,useRef} from "react";
import {motion,useMotionValue,useReducedMotion,useScroll,useSpring,useTransform} from "framer-motion";
import IcebergGLB,{type SceneMotion} from "./IcebergGLB";
import "./hybrid-hero.css";

function Preview({title,src,detail,kind}:{title:string;src:string;detail:string;kind:string}){
 return <a href="/portfolio" className={"ibh-preview "+kind} aria-label={"View the "+title+" website in our portfolio"}>
  <span className="ibh-chrome"><span className="ibh-dotset"><i/><i/><i/></span><span>selected work / icebreakerlab</span><span>↗</span></span>
  <span className="ibh-screen"><Image src={src} alt={"Design for "+title} fill sizes="(max-width: 760px) 210px, 360px" style={{objectFit:"cover",objectPosition:"top"}}/></span>
  <span className="ibh-preview-label"><strong>{title}</strong><small>{detail}</small></span>
 </a>;
}
export default function HybridHero(){
 const section=useRef<HTMLElement>(null);
 const coordinates=useRef<SceneMotion>({x:0,y:0,scroll:0});
 const reduced=useReducedMotion();
 const mx=useMotionValue(0),my=useMotionValue(0);
 const x=useSpring(mx,{stiffness:45,damping:20}),y=useSpring(my,{stiffness:45,damping:20});
 const ry=useTransform(x,[-1,1],[-7,7]),rx=useTransform(y,[-1,1],[5,-5]);
 const {scrollYProgress}=useScroll({target:section,offset:["start start","end start"]});
 const visualY=useTransform(scrollYProgress,[0,1],[0,75]);
 const textY=useTransform(scrollYProgress,[0,1],[0,-35]);
 useEffect(()=>{
  const update=()=>{
   const el=section.current;if(!el)return;
   const box=el.getBoundingClientRect();
   coordinates.current.scroll=Math.max(0,Math.min(1,-box.top/Math.max(1,box.height)));
  };
  update();window.addEventListener("scroll",update,{passive:true});
  return()=>window.removeEventListener("scroll",update);
 },[]);
 return <section className="ibh" id="top" ref={section}
  onPointerMove={e=>{if(reduced||e.pointerType!=="mouse")return;
   const box=e.currentTarget.getBoundingClientRect();
   coordinates.current.x=((e.clientX-box.left)/box.width-.5)*2;
   coordinates.current.y=((e.clientY-box.top)/box.height-.5)*2;
   mx.set(coordinates.current.x);my.set(coordinates.current.y);
  }}
  onPointerLeave={()=>{mx.set(0);my.set(0);coordinates.current.x=0;coordinates.current.y=0;}}>
  <div className="ibh-atmosphere" aria-hidden="true"/>
  <div className="ibh-grid">
   <motion.div className="ibh-copy" style={reduced?{}:{y:textY}}>
    <div className="ibh-eyebrow"><span className="ibh-glowdot"/> WEB DESIGN STUDIO <span>·</span> SEO <span>·</span> STRATEGY</div>
    <motion.h1 initial={reduced?false:{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:.8}}>We build websites <em>that break the ice.</em></motion.h1>
    <motion.p initial={reduced?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.75,delay:.18}}>Beautiful on the surface. Strategic underneath. Websites built to get your business found, remembered, and chosen.</motion.p>
    <div className="ibh-buttons"><a className="ibh-button ibh-button-main" href="#contact">Start a project <span>↗</span></a><a className="ibh-button ibh-button-alt" href="#portfolio">Explore our work <span>→</span></a></div>
    <div className="ibh-caption"><span/> DESIGN-LED. PERFORMANCE-DRIVEN.</div>
   </motion.div>
   <motion.div className="ibh-visual" style={reduced?{}:{y:visualY,rotateX:rx,rotateY:ry}}>
    <div className="ibh-halo" aria-hidden="true"/>
    <div className="ibh-model"><IcebergGLB motion={coordinates}/></div>
    <Preview title="NODO Academy" detail="WEB DESIGN · SEO" src="/images/portfolio/mockups/nodo-academy.png" kind="ibh-primary"/>
    <Preview title="Market Open Media" detail="WEB DESIGN · STRATEGY" src="/images/portfolio/mockups/market-open-media.png" kind="ibh-secondary"/>
    <div className="ibh-quality"><span>✦</span><div><strong>Built for impact</strong><small>Design · SEO · Speed</small></div><span>↗</span></div>
   </motion.div>
  </div>
  <a href="#services" className="ibh-scroll"><span/>SCROLL TO EXPLORE</a>
 </section>;
}
