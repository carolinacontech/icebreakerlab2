"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const ValueIcon = ({ type }: { type: string }) => {
  const s = { width: 20, height: 20, stroke: "var(--aurora-teal)", strokeWidth: 1.6, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (type === "custom") return <svg viewBox="0 0 24 24" style={s}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>;
  if (type === "google") return <svg viewBox="0 0 24 24" style={s}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
  if (type === "fast") return <svg viewBox="0 0 24 24" style={s}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
  return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>;
};

const values = [
  { icon: "custom", title: "Custom built", body: "No templates. Every site is designed from scratch around your brand." },
  { icon: "google", title: "Google ready", body: "Built to rank from day one — no extra setup or plugins needed." },
  { icon: "fast", title: "Fast launch", body: "From first call to live website in 3–4 weeks." },
  { icon: "convert", title: "Built to convert", body: "Every page designed to turn visitors into real clients." },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section id="about" ref={ref} className="relative py-24 overflow-hidden">
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY, scale: 1.2 }}>
        <Image src="/images/about/silhouette.png" alt="Arctic aurora silhouette" fill className="object-cover object-center" quality={85} />
      </motion.div>
      <div className="absolute inset-0 z-[1]" style={{
        background: "linear-gradient(135deg, rgba(10,13,31,0.88) 0%, rgba(38,33,92,0.55) 50%, rgba(10,13,31,0.88) 100%)"
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9 }}>
            <p className="section-eyebrow mb-4">Who we are</p>
            <h2 className="section-title mb-6">
              We remove the barriers between{" "}
              <span style={{ color: "var(--aurora-light)" }}>great businesses and great websites.</span>
            </h2>
            <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--ice-blue)" }}>
              The Icebreakerlab was born from a simple truth: communication is the number one problem for businesses online. Great products, invisible websites.
            </p>
            <p className="text-base leading-relaxed" style={{ color: "var(--aurora-light)" }}>
              We break that ice. We build the digital infrastructure that makes your message reach the right people, fast — and in the right place on Google.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {values.map((v, i) => (
              <motion.div key={v.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.6 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="rounded-2xl p-6"
                style={{ background: "rgba(10,13,31,0.55)", border: "1px solid rgba(83,74,183,0.25)", backdropFilter: "blur(20px)" }}>
                <div className="mb-3" style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: "rgba(93,202,165,0.1)", border: "1px solid rgba(93,202,165,0.2)" }}>
                    <ValueIcon type={v.icon} />
                  </div>
                <div className="font-semibold mb-1" style={{ color: "var(--snow)", fontSize: "15px" }}>{v.title}</div>
                <div className="text-sm leading-relaxed" style={{ color: "rgba(175,169,236,0.75)" }}>{v.body}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
