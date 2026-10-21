"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CrackLink } from "./IceCrack";

const wordVariants = {
  hidden: { opacity: 0, y: 22, rotateX: -40 },
  show: (i: number) => ({
    opacity: 1, y: 0, rotateX: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.23, 1, 0.32, 1] as const },
  }),
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

function HeroTitle({ text, style }: { text: string; style: React.CSSProperties }) {
  let wordIndex = 0;
  return (
    <h1 style={{
      ...style,
      // Color sólido de respaldo: si el navegador no soporta el degradado
      // recortado al texto, sin esto el título queda invisible.
      color: "var(--snow)",
      textWrap: "balance",
      background: "linear-gradient(135deg, #ffffff 0%, #ffffff 60%, #d4d0f7 85%, #9de8cf 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }}>
      {text.split("\n").map((line, li) => (
        <span key={li} style={{ display: "block" }}>
          {line.split(" ").map((word, wi) => {
            const idx = wordIndex++;
            return (
              <motion.span
                key={`${li}-${wi}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                style={{ display: "inline-block", marginRight: "0.28em" }}
              >
                {word}
                {" "}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

function SplitTitle({ text, style }: { text: string; style: React.CSSProperties }) {
  let wordIndex = 0;
  return (
    <h2 style={{ ...style, perspective: "800px" }}>
      {text.split("\n").map((line, li) => (
        <span key={li} style={{ display: "block" }}>
          {line.split(" ").map((word, wi) => {
            const idx = wordIndex++;
            return (
              <motion.span
                key={`${li}-${wi}`}
                custom={idx}
                variants={wordVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                style={{ display: "inline-block", transformOrigin: "50% 100%", marginRight: "0.28em" }}
              >
                {word}
                {" "}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}
function once<T extends EventTarget>(el: T, event: string, fn: (e: Event) => void) {
  const wrapped = (e: Event) => { el.removeEventListener(event, wrapped); fn(e); };
  el.addEventListener(event, wrapped);
}

const slides = [
  {
    id: "slide-0",
    label: "Websites & SEO Agency",
    title: "We break\nthe ice.",
    body: "Websites that rank on Google\nand turn visitors into clients.",
    cta: { label: "Break the ice", href: "#contact" },
    position: "bottom-left" as const,
  },
  {
    id: "slide-1",
    label: "The surface",
    title: "You're only\nshowing the tip.",
    body: "Great product. Invisible online.\nYour website should work for you.",
    cta: null,
    position: "top-left" as const,
  },
  {
    id: "slide-2",
    label: "The depth",
    title: "The real work\nhappens below.",
    body: "SEO, architecture, performance.\nInvisible to the eye. Everything to Google.",
    cta: null,
    position: "bottom-right" as const,
  },
  {
    id: "slide-3",
    label: "The result",
    title: "Ranked by Google.\nChosen by people.",
    body: "We build the infrastructure that makes\nyour message reach the right people.",
    cta: { label: "Break the ice", href: "#contact" },
    position: "center" as const,
  },
];

export default function ScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    once(document.documentElement, "touchstart", () => { video.play(); video.pause(); });

    // Single RAF loop: read scrollY directly (works with Lenis + native scroll)
    const totalSlides = slides.length;
    let lastIndex = -1;
    let currentProgress = 0;

    const tick = () => {
      const rect = container.getBoundingClientRect();
      const scrolled = -rect.top;
      const total = container.offsetHeight - window.innerHeight;
      const targetProgress = Math.max(0, Math.min(1, scrolled / total));

      // Lerp toward target — smooths out jank without lagging behind
      currentProgress += (targetProgress - currentProgress) * 0.12;

      if (video.readyState >= 2 && video.duration) {
        video.currentTime = currentProgress * video.duration;
      }

      // Update slide index only when it changes (avoids re-render every frame)
      const index = Math.min(totalSlides - 1, Math.floor(targetProgress * totalSlides));
      if (index !== lastIndex) {
        lastIndex = index;
        setActiveSlide(index);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const slide = slides[activeSlide];

  return (
    <div ref={containerRef} style={{ height: "300vh" }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Video */}
        <video ref={videoRef} muted playsInline preload="auto"
          poster="/images/hero/hero-poster-v6.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ willChange: "transform", transform: "translateZ(0)" }}>
          {/* Solo H.264: el scrub necesita todos los cuadros como keyframe, y así
              VP9 pesaba el triple. Chrome elegía el WebM (12.9 MB); este pesa 2.7 MB. */}
          <source src="/video/hero-scrub-v6.mp4" type="video/mp4" />
        </video>

        {/* Overlay sutil — aumenta contraste percibido sin matar el video */}
        <div className="absolute inset-0 z-10" style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(2,1,14,0.35) 100%)",
          mixBlendMode: "multiply",
        }} />

        {/* Slide 4 overlay — aparece solo en el último slide */}
        <AnimatePresence>
          {activeSlide === 3 && (
            <motion.div
              className="absolute inset-0 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                background: "linear-gradient(135deg, rgba(10,13,31,0.6) 0%, rgba(83,74,183,0.75) 50%, rgba(10,13,31,0.6) 100%)",
                mixBlendMode: "multiply",
              }}
            />
          )}
        </AnimatePresence>

        {/* Slide content */}
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.4s ease" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              className={`absolute inset-0 flex flex-col px-10 md:px-16 lg:px-24 pointer-events-none ${
                slide.position === "top-left"
                  ? "items-start justify-start pt-28"
                  : slide.position === "center"
                  ? "items-center justify-center text-center"
                  : slide.position === "bottom-right"
                  ? "items-end justify-end pb-28 text-right"
                  : "items-start justify-end pb-28"
              }`}
            >
              {/* Label pill */}
              <div className="h-8 mb-4 flex items-center">
                <motion.div
                  key={slide.id + "-label"}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase"
                  style={{ background: "rgba(83,74,183,0.65)", border: "1px solid rgba(175,169,236,0.7)", color: "var(--snow)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--aurora-teal)" }} />
                  {slide.label}
                </motion.div>
              </div>

              {/* Title */}
              {activeSlide === 0 ? (
                <HeroTitle
                  text={slide.title}
                  style={{
                    fontSize: "clamp(3rem, 7vw, 6.5rem)",
                    fontWeight: 800,
                    whiteSpace: "pre-line",
                    maxWidth: "680px",
                    lineHeight: 1.08,
                    letterSpacing: "-0.03em",
                    marginBottom: "0",
                    textAlign: "left",
                  }}
                />
              ) : (
                <SplitTitle
                  text={slide.title}
                  style={{
                    fontSize: "clamp(2.2rem, 6vw, 5rem)",
                    fontWeight: 800,
                    color: "var(--snow)",
                    textShadow: "0 2px 20px rgba(0,0,0,0.95), 0 4px 60px rgba(0,0,0,0.85), 0 0 120px rgba(0,0,0,0.6)",
                    whiteSpace: "pre-line",
                    maxWidth: "680px",
                    lineHeight: 1.08,
                    letterSpacing: "-0.03em",
                    marginBottom: slide.body ? "1.25rem" : "0",
                    textAlign: slide.position === "center" ? "center" : slide.position === "bottom-right" ? "right" : "left",
                  }}
                />
              )}

              {/* Body */}
              {slide.body && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{
                    fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
                    color: "rgba(220,235,252,0.92)",
                    lineHeight: 1.65,
                    whiteSpace: "pre-line",
                    maxWidth: "320px",
                    marginBottom: slide.cta ? "1.5rem" : "0",
                    textAlign: slide.position === "center" ? "center" : slide.position === "bottom-right" ? "right" : "left",
                  }}
                >
                  {slide.body}
                </motion.p>
              )}

              {/* CTAs */}
              {slide.cta && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className={`flex flex-col sm:flex-row gap-4 pointer-events-auto${slide.position === "center" ? " justify-center" : ""}`}
                >
                  <CrackLink href={slide.cta.href}
                    className="px-8 py-4 rounded-full font-semibold text-base transition-transform hover:scale-105"
                    style={{ background: "var(--aurora)", color: "var(--snow)", boxShadow: "0 0 50px rgba(83,74,183,0.55)" }}>
                    {slide.cta.label}
                  </CrackLink>
                  <CrackLink href="#portfolio"
                    className="px-8 py-4 rounded-full font-semibold text-base transition-transform hover:scale-105"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(175,169,236,0.4)", color: "var(--aurora-light)" }}>
                    See our work
                  </CrackLink>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom bar — slide counter + progress */}
        <div className="absolute bottom-0 left-0 right-0 z-30 flex items-end justify-between px-8 md:px-16 lg:px-24 pb-8"
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.4s ease" }}>

          {/* Scroll hint — only first slide */}
          <AnimatePresence>
            {activeSlide === 0 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
                  style={{ border: "1.5px solid rgba(175,169,236,0.35)" }}>
                  <div className="w-1 h-1.5 rounded-full animate-bounce" style={{ background: "var(--aurora-light)" }} />
                </div>
                <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(175,169,236,0.45)" }}>
                  Scroll
                </span>
              </motion.div>
            )}
            {activeSlide > 0 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-xs tracking-widest uppercase"
                style={{ color: "rgba(175,169,236,0.4)" }}
              >
                {String(activeSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex items-center gap-3">
            {slides.map((s, i) => (
              <div key={s.id} className="relative overflow-hidden rounded-full"
                style={{
                  width: i === activeSlide ? "36px" : "8px",
                  height: "8px",
                  background: i === activeSlide ? "transparent" : "rgba(175,169,236,0.35)",
                  border: i === activeSlide ? "none" : "1px solid rgba(175,169,236,0.2)",
                  transition: "width 0.4s cubic-bezier(0.23,1,0.32,1), background 0.3s ease",
                  boxShadow: i === activeSlide ? "none" : "0 0 0 1px rgba(175,169,236,0.1)",
                }}>
                {i === activeSlide && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: "linear-gradient(90deg, var(--aurora) 0%, var(--aurora-light) 100%)" }}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
