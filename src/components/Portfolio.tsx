"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { CrackLink } from "./IceCrack";

const projects = [
  {
    title: "NODO Jiu Jitsu Academy",
    category: "Website + Local SEO",
    result: "More visibility, traffic & class signups",
    description: "Full website for a Brazilian Jiu Jitsu academy in Panama City — built to rank on Google and convert visitors into students.",
    url: "https://www.nodoacademy.com",
    mockup: "/images/portfolio/mockups/nodo-academy.png",
    mobile: "/images/portfolio/mockups/nodo-academy-mobile.png",
    bg: "/images/portfolio/workspace.png",
  },
  {
    title: "Market Open Media",
    category: "Corporate Website + SEO",
    result: "Google Maps & LSA lead generation",
    description: "Website for a local marketing agency specializing in Google Maps SEO and Local Services Ads — focused on generating inbound leads.",
    url: "https://www.marketopenmedia.com",
    mockup: "/images/portfolio/mockups/market-open-media.png",
    mobile: "/images/portfolio/mockups/market-openmedia-mobile.png",
    bg: "/images/portfolio/workspace-2.png",
  },
  {
    title: "Kings Tree Services",
    category: "Website + Local SEO",
    result: "Top Google rankings for North Texas & DFW",
    description: "Full website for a tree services company covering North Texas & DFW — built to rank locally, generate free estimate leads, and convert emergency calls 24/7.",
    url: "https://www.kingstreeservices.com",
    mockup: "/images/portfolio/mockups/kings-tree-services.png",
    mobile: "/images/portfolio/mockups/king-tree-services-mobile.png",
    bg: "/images/portfolio/workspace.png",
  },
];

export default function Portfolio() {
  const [active, setActive] = useState(0);

  return (
    <section id="portfolio" className="relative py-24 overflow-hidden" style={{ background: "var(--night)" }}>
      <div className="absolute inset-0 z-0" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(83,74,183,0.12) 0%, transparent 70%)"
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <p className="section-eyebrow mb-4">Case studies</p>
          <h2 className="section-title">Our Work</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Left — project list (2/5) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {projects.map((p, i) => (
              <motion.div key={p.title}
                initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}
                onClick={() => setActive(i)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(i); } }}
                role="button"
                tabIndex={0}
                aria-pressed={active === i}
                whileHover={{ x: 6 }}
                className="rounded-2xl p-6 relative overflow-hidden"
                style={{
                  background: active === i ? "rgba(83,74,183,0.25)" : "rgba(10,13,31,0.5)",
                  border: active === i ? "1px solid rgba(175,169,236,0.5)" : "1px solid rgba(83,74,183,0.2)",
                  backdropFilter: "blur(20px)",
                }}>
                {active === i && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                    style={{ background: "var(--aurora-light)" }} />
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs tracking-widest uppercase mb-1 block" style={{ color: "var(--aurora-teal)" }}>{p.category}</span>
                    <h3 className="text-lg font-semibold" style={{ color: "var(--snow)" }}>{p.title}</h3>
                  </div>
                  <span style={{ color: "var(--aurora-light)", fontSize: "1.3rem" }}>→</span>
                </div>
                <p className="text-sm mt-2 font-medium" style={{ color: "var(--aurora-teal)" }}>{p.result}</p>
                {active === i && (
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: "rgba(175,169,236,0.7)" }}>{p.description}</p>
                )}
              </motion.div>
            ))}

            {/* La home solo muestra 3 proyectos: sin esto no hay forma de
                llegar al portfolio completo salvo por el menú. */}
            <motion.a
              href="/portfolio"
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: projects.length * 0.15 }}
              whileHover={{ x: 6 }}
              className="rounded-2xl px-6 py-4 flex items-center justify-between group"
              style={{
                border: "1px dashed rgba(83,74,183,0.4)",
                background: "rgba(83,74,183,0.06)",
                backdropFilter: "blur(20px)",
              }}>
              <span className="text-sm font-semibold" style={{ color: "var(--aurora-light)" }}>
                See all our work
              </span>
              <span className="text-xs" style={{ color: "var(--aurora-teal)" }}>
                18 projects →
              </span>
            </motion.a>
          </div>

          {/* Right — mockup preview (3/5) */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="lg:col-span-3 flex flex-col gap-4"
            style={{ overflow: "visible", pointerEvents: "none" }}>
          {/* iMac-style monitor mockup */}
          <div className="relative" style={{ overflow: "visible" }}>
            {/* Ultra-thin bezel */}
            <div className="relative rounded-[14px] p-[5px] pb-0"
              style={{
                background: "#18162e",
                border: "1px solid rgba(175,169,236,0.2)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.03)",
              }}>
              {/* Chin bar with camera dot */}
              <div className="flex justify-center items-center" style={{ height: "14px" }}>
                <div className="w-1 h-1 rounded-full" style={{ background: "rgba(175,169,236,0.3)" }} />
              </div>

              {/* Screen */}
              <div className="relative overflow-hidden rounded-[9px] aspect-video"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    className="absolute inset-0"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}>
                    <Image src={projects[active].mockup} alt={projects[active].title} fill className="object-cover mockup-pan" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom chin */}
              <div style={{ height: "10px" }} />
            </div>

            {/* Stand neck — tapered */}
            <div className="mx-auto" style={{
              width: "40px", height: "22px",
              background: "linear-gradient(180deg, #18162e 0%, #111026 100%)",
              clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
            }} />
            {/* Stand base */}
            <div className="mx-auto rounded-full" style={{
              width: "100px", height: "5px",
              background: "linear-gradient(90deg, transparent 0%, rgba(175,169,236,0.18) 30%, rgba(175,169,236,0.28) 50%, rgba(175,169,236,0.18) 70%, transparent 100%)",
            }} />

            {/* iPhone mockup — bottom-right of monitor, floating */}
            <motion.div
              className="absolute z-20"
              style={{ bottom: "24px", right: "-18px", width: "88px", height: "188px" }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>

              {/* Left side buttons (volume) */}
              <div className="absolute" style={{ left: "-2px", top: "44px", width: "2px", height: "12px", background: "linear-gradient(90deg, #3a3560, #5a5490)", borderRadius: "1px 0 0 1px" }} />
              <div className="absolute" style={{ left: "-2px", top: "62px", width: "2px", height: "18px", background: "linear-gradient(90deg, #3a3560, #5a5490)", borderRadius: "1px 0 0 1px" }} />
              <div className="absolute" style={{ left: "-2px", top: "86px", width: "2px", height: "18px", background: "linear-gradient(90deg, #3a3560, #5a5490)", borderRadius: "1px 0 0 1px" }} />
              {/* Right side button (power) */}
              <div className="absolute" style={{ right: "-2px", top: "66px", width: "2px", height: "22px", background: "linear-gradient(90deg, #5a5490, #3a3560)", borderRadius: "0 1px 1px 0" }} />

              {/* Phone body */}
              <div className="relative w-full h-full rounded-[20px]"
                style={{
                  background: "linear-gradient(145deg, #1e1c38 0%, #14122a 60%, #0e0c20 100%)",
                  border: "1.5px solid transparent",
                  backgroundClip: "padding-box",
                  boxShadow: "0 0 0 1.5px rgba(140,130,220,0.45), 0 0 0 2.5px rgba(80,70,160,0.2), 0 16px 40px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)",
                }}>

                {/* Screen — edge to edge with matching radius */}
                <div className="absolute overflow-hidden rounded-[18.5px]"
                  style={{ inset: "1.5px", background: "#08071a" }}>
                  {/* Safe area for Dynamic Island */}
                  <div style={{ height: "20px" }} />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      className="absolute"
                      style={{ inset: "20px 0 0 0" }}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
                      <Image src={projects[active].mobile} alt={`${projects[active].title} mobile`} fill sizes="88px" className="object-cover mockup-pan-mobile" />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Dynamic Island — rendered ON TOP of screen */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10"
                  style={{
                    top: "7px",
                    width: "28px", height: "9px",
                    background: "#070614",
                    borderRadius: "6px",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.8)",
                  }} />

                {/* Home indicator */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10"
                  style={{
                    bottom: "5px",
                    width: "30px", height: "3px",
                    background: "rgba(255,255,255,0.28)",
                    borderRadius: "2px",
                  }} />
              </div>
            </motion.div>
          </div>

          {/* Buttons below mockup */}
          <div className="flex gap-3 pt-6" style={{ pointerEvents: "auto" }}>
            <CrackLink href={projects[active].url} target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 rounded-full text-sm font-semibold transition-transform hover:scale-105"
              style={{ background: "var(--aurora)", color: "var(--snow)", boxShadow: "0 0 24px rgba(83,74,183,0.4)" }}>
              View site →
            </CrackLink>
            <CrackLink href="#contact"
              className="px-6 py-3 rounded-full text-sm font-semibold"
              style={{ border: "1px solid rgba(83,74,183,0.4)", color: "var(--aurora-light)", background: "rgba(83,74,183,0.1)" }}>
              I want this →
            </CrackLink>
          </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
