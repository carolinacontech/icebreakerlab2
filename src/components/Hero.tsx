"use client";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

type Particle = {
  width: number; height: number;
  left: string; top: string;
  color: string; duration: number; delay: number;
};
const COLORS = ["var(--aurora-light)", "var(--ice-blue)", "var(--aurora-teal)"];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 22 }, (_, i) => ({
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        color: COLORS[i % 3],
        duration: Math.random() * 5 + 3,
        delay: Math.random() * 4,
      }))
    );
  }, []);

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 35, damping: 18 });
  const sy = useSpring(my, { stiffness: 35, damping: 18 });
  const imgX = useTransform(sx, [-0.5, 0.5], ["-3%", "3%"]);
  const imgY = useTransform(sy, [-0.5, 0.5], ["-3%", "3%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = e;
    const { width, height } = e.currentTarget.getBoundingClientRect();
    mx.set(clientX / width - 0.5);
    my.set(clientY / height - 0.5);
  };

  // Scroll fade out
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Hero image — follows mouse */}
      <motion.div className="absolute inset-0 z-0" style={{ x: imgX, y: imgY, scale: 1.08 }}>
        <Image src="/images/hero/hero-aurora.png" alt="Aurora sobre iceberg" fill priority className="object-cover" quality={90} />
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1]" style={{
        background: "linear-gradient(to bottom, rgba(10,13,31,0.3) 0%, rgba(38,33,92,0.15) 40%, rgba(10,13,31,0.75) 100%)",
      }} />

      {/* Particles */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        {particles.map((p, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ width: p.width, height: p.height, left: p.left, top: p.top, background: p.color }}
            animate={{ y: [0, -40, 0], opacity: [0.1, 0.9, 0.1], scale: [1, 1.5, 1] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div className="relative z-[4] max-w-5xl mx-auto px-6 text-center" style={{ opacity, y: contentY }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase mb-8"
          style={{ background: "rgba(83,74,183,0.2)", border: "1px solid rgba(175,169,236,0.3)", color: "var(--aurora-light)" }}
        >
          <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--aurora-teal)" }}
            animate={{ scale: [1, 1.8, 1], opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          Agencia de Websites & SEO
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          style={{ color: "var(--snow)", textShadow: "0 0 80px rgba(83,74,183,0.4)" }}
        >
          Rompemos el hielo.
          <br />
          <motion.span style={{ color: "var(--aurora-light)" }}
            animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            Tu negocio comunica.
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ color: "var(--ice-tip)", opacity: 0.85 }}
        >
          Como el iceberg, hay mucho más debajo de la superficie. Construimos websites
          que conquistan Google y convierten visitantes en clientes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a href="#services" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-full font-semibold text-base"
            style={{ background: "var(--aurora)", color: "var(--snow)", boxShadow: "0 0 50px rgba(83,74,183,0.55)" }}>
            Empieza tu proyecto
          </motion.a>
          <motion.a href="#portfolio" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-full font-semibold text-base"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(175,169,236,0.45)", color: "var(--aurora-light)" }}>
            Ver nuestro trabajo
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Animated scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[4] flex flex-col items-center gap-3 cursor-pointer"
        onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full flex items-start justify-center pt-2"
          style={{ border: "1.5px solid rgba(175,169,236,0.4)" }}
        >
          <motion.div className="w-1 h-2 rounded-full" style={{ background: "var(--aurora-light)" }}
            animate={{ opacity: [1, 0, 1], y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
