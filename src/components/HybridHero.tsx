"use client";
import {useEffect,useRef,useState} from "react";
import Image from "next/image";
import {AnimatePresence,motion,useMotionValue,useReducedMotion,useScroll,useSpring,useTransform} from "framer-motion";
import IcebergGLB,{type SceneMotion} from "./IcebergGLB";
import "./hybrid-hero.css";

type Project = {name:string;detail:string;src:string;mobileSrc?:string};

// Desktop: one browser window with full websites and one authentic phone
// using mobile screenshots. Both rotate, without multiplying visual clutter.
const portfolioPairs:ReadonlyArray<ReadonlyArray<Project>>=[
 [
  {name:"Las Marías",detail:"E-COMMERCE · ONLINE STORE",src:"/images/portfolio/mockups/las-marias-market.jpg"},
  {name:"EVA Shoes",detail:"BRANDING · WEB EXPERIENCE",src:"/images/portfolio/mockups/eva-shoes-2026.webp"}
 ],
 [
  {name:"NODO Academy",detail:"WEB DESIGN · SEO",src:"/images/portfolio/mockups/nodo-academy.png",mobileSrc:"/images/portfolio/mockups/nodo-academy-mobile.png"},
  {name:"Market Open Media",detail:"WEB DESIGN · STRATEGY",src:"/images/portfolio/mockups/market-open-media.png",mobileSrc:"/images/portfolio/mockups/market-openmedia-mobile.png"}
 ]
];
// On narrow screens the agreed single browser card continues to show all four.
const mobileProjects:ReadonlyArray<Project> = [
 portfolioPairs[1][0],portfolioPairs[1][1],portfolioPairs[0][0],portfolioPairs[0][1]
];

function RotatingProjectCard({
 projects,position,reveal,prepare,reduced,mobile=false
}:{
 projects:ReadonlyArray<Project>;
 position:number;
 reveal:boolean;
 prepare:boolean;
 reduced:boolean;
 mobile?:boolean;
}){
 const [active,setActive]=useState(0);
 const [paused,setPaused]=useState(false);
 useEffect(()=>{
  if(!reveal){setActive(0);return;}
  // Respect reduced-motion preferences and pause when the card is hovered
  // or keyboard-focused, so visitors can inspect a specific project.
  if(paused||reduced)return;
  const mobile=window.matchMedia("(max-width:760px)").matches;
  const interval=window.setInterval(()=>{
   if(document.visibilityState==="visible")setActive(current=>(current+1)%projects.length);
  },mobile?7100:(position===0?5200:6300));
  return()=>window.clearInterval(interval);
 },[reveal,paused,reduced,position,projects.length,mobile]);
 const project=projects[active];
 const isPhone=position===1&&!mobile;
 return <motion.a
   href="/portfolio"
   className={"ibh-preview ibh-reveal-card "+(position===0?"ibh-primary":"ibh-secondary")+(mobile?" ibh-mobile-preview":"")+(isPhone?" ibh-phone-preview":"")}
   aria-label={"View "+project.name+" in our portfolio"}
   aria-hidden={!reveal}
   tabIndex={reveal?0:-1}
   onMouseEnter={()=>setPaused(true)}
   onMouseLeave={()=>setPaused(false)}
   onFocus={()=>setPaused(true)}
   onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))setPaused(false);}}
   initial={false}
   animate={reveal
    ? {opacity:1,x:0,y:0,scale:1,filter:"blur(0px)",pointerEvents:"auto"}
    : {opacity:0,x:position===0?76:-70,y:position===0?-24:48,scale:.88,filter:"blur(8px)",pointerEvents:"none"}}
   transition={{duration:reduced?0:.72,delay:reveal&&!reduced?position*.17:0,ease:[.2,.8,.2,1]}}
 >
  {isPhone ? (
   <>
    <span className="ibh-phone-shell">
     <span className="ibh-phone-screen-frame">
      <AnimatePresence initial={false}>
       {prepare&&<motion.span
        key={project.name}
        className="ibh-phone-screen-image"
        initial={reduced?false:{opacity:0,y:20,scale:1.06}}
        animate={{opacity:1,y:0,scale:1}}
        exit={reduced?{opacity:0}:{opacity:0,y:-20,scale:.97}}
        transition={{duration:reduced?0:.5,ease:[.25,.75,.25,1]}}
       >
        <Image src={project.mobileSrc??project.src}
         alt={"Mobile version of "+project.name}
         fill
         loading={active===0?"eager":"lazy"}
         sizes="(max-width:1150px) 175px, 225px"
         style={{objectFit:"cover",objectPosition:"top"}}
        />
       </motion.span>}
      </AnimatePresence>
     </span>
     <span className="ibh-phone-island" aria-hidden="true"/>
     <span className="ibh-phone-homebar" aria-hidden="true"/>
    </span>
    <span className="ibh-phone-caption"><strong>{project.name}</strong><small>{project.detail}</small></span>
   </>
  ) : (
   <>
    <span className="ibh-chrome">
     <span className="ibh-dotset" aria-hidden="true"><i/><i/><i/></span>
     <span className="ibh-card-position">{String(active+1).padStart(2,"0")} / {String(projects.length).padStart(2,"0")}</span>
    </span>
    <AnimatePresence initial={false}>
     {prepare&&<motion.span
      key={project.name}
      className="ibh-card-swap"
      initial={reduced?false:{opacity:0,y:12,scale:1.025,filter:"blur(6px)"}}
      animate={{opacity:1,y:0,scale:1,filter:"blur(0px)"}}
      exit={reduced?{opacity:0}:{opacity:0,y:-12,scale:.985,filter:"blur(6px)"}}
      transition={{duration:reduced?0:.46,ease:[.25,.75,.25,1]}}
     >
      <span className="ibh-screen">
       <Image src={project.src} alt={"Website preview for "+project.name}
        fill loading={active===0?"eager":"lazy"}
        sizes="(max-width:760px) 78vw, (max-width:1150px) 34vw, 390px"
        style={{objectFit:"cover",objectPosition:"top"}}
       />
      </span>
      <span className="ibh-preview-label">
       <strong>{project.name}</strong><small>{project.detail}</small>
      </span>
     </motion.span>}
    </AnimatePresence>
   </>
  )}
 </motion.a>;
}

function WebsiteReveal({reveal,prepare,reduced}:{reveal:boolean;prepare:boolean;reduced:boolean}){
 return <div className="ibh-reveal-layer" aria-live="off">
  <div className="ibh-reveal-desktop">
   {portfolioPairs.map((projects,index)=><RotatingProjectCard
    key={index}
    projects={projects}
    position={index}
    reveal={reveal}
    prepare={prepare}
    reduced={reduced}
   />)}
  </div>
  <div className="ibh-reveal-mobile">
   <RotatingProjectCard
    projects={mobileProjects}
    position={0}
    reveal={reveal}
    prepare={prepare}
    reduced={reduced}
    mobile
   />
  </div>
 </div>;
}

export default function HybridHero(){
 const section=useRef<HTMLElement>(null);
 const [fracture,setFracture]=useState(0);
 const [reveal,setReveal]=useState(false);
 const restart=()=>{setReveal(false);setFracture(0);};
 const shatter=()=>setFracture(v=>Math.min(3,v+1));
 const coordinates=useRef<SceneMotion>({x:0,y:0,scroll:0});
 const reduced=useReducedMotion();
 const mx=useMotionValue(0),my=useMotionValue(0);
 const x=useSpring(mx,{stiffness:45,damping:20}),y=useSpring(my,{stiffness:45,damping:20});
 const ry=useTransform(x,[-1,1],[-7,7]),rx=useTransform(y,[-1,1],[5,-5]);
 useEffect(()=>{
  if(fracture!==3)return;
  const timer=window.setTimeout(()=>setReveal(true),reduced?250:1550);
  return()=>window.clearTimeout(timer);
 },[fracture,reduced]);
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
  <div className="ibh-fullstage"><IcebergGLB motion={coordinates} fracture={fracture}/></div>
  <div className="ibh-grid">
   <motion.div className="ibh-copy" style={reduced?{}:{y:textY}}>
    <div className="ibh-eyebrow"><span className="ibh-glowdot"/> WEB DESIGN STUDIO <span>·</span> SEO <span>·</span> STRATEGY</div>
    <motion.h1 initial={reduced?false:{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:.8}}>We build websites <em>that break the ice.</em></motion.h1>
    <motion.p initial={reduced?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.75,delay:.18}}>Beautiful on the surface. Strategic underneath. Websites built to get your business found, remembered, and chosen.</motion.p>
    <div className="ibh-mobile-ice-invite">
     <span className="ibh-mobile-invite-icon" aria-hidden="true">✳</span>
     <div><strong>YOUR TURN TO BREAK THE ICE</strong><small>Tap the iceberg three times to discover our work ↓</small></div>
    </div>
    <div className="ibh-buttons ibh-buttons-desktop"><a className="ibh-button ibh-button-main" href="#contact">Start a project <span>↗</span></a><a className="ibh-button ibh-button-alt" href="#portfolio">Explore our work <span>→</span></a></div>
    <div className="ibh-caption"><span/> DESIGN-LED. PERFORMANCE-DRIVEN.</div>
   </motion.div>
   <motion.div className="ibh-visual" style={reduced?{}:{y:visualY,rotateX:rx,rotateY:ry}}>
    <div className="ibh-halo" aria-hidden="true"/>
    <button type="button" className={"ibh-model ibh-ice-button ibh-fracture-"+fracture} onClick={fracture===3?restart:shatter} disabled={reveal} aria-label={fracture===3?"Rebuild the iceberg":"Break the iceberg, stage "+(fracture+1)+" of 3"} /> 
    <WebsiteReveal reveal={reveal} prepare={fracture>=2} reduced={Boolean(reduced)}/>
    <div className="ibh-ice-hint" aria-live="polite">
      <span className="ibh-ice-count">0{fracture} / 03</span>
      <span>{fracture===0?"CLICK THE ICEBERG TO BREAK THE ICE":fracture===1?"THE FIRST CRACK — CLICK AGAIN":fracture===2?"IT'S BREAKING — ONE MORE CLICK":reveal?"OUR WORK, REVEALED":"BREAKING THE ICE..."}</span>
      {fracture===3&&<button type="button" onClick={restart}>REBUILD ↻</button>}
    </div>
   </motion.div>
   {reveal&&<motion.div
    className="ibh-mobile-actions"
    initial={reduced?false:{opacity:0,y:18}}
    animate={{opacity:1,y:0}}
    transition={{duration:reduced?0:.6,delay:reduced?0:.16}}
   >
    <div className="ibh-buttons">
     <a className="ibh-button ibh-button-main" href="#contact">Start a project <span>↗</span></a>
     <a className="ibh-button ibh-button-alt" href="#portfolio">Explore our work <span>→</span></a>
    </div>
   </motion.div>}
  </div>
  <a href="#services" className="ibh-scroll"><span/>SCROLL TO EXPLORE</a>
 </section>;
}
