"use client";
import { useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";

function Counter({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        if (ref.current) ref.current.textContent = prefix + Math.round(v) + suffix;
      },
    });
    return controls.stop;
  }, [inView, count, to, suffix, prefix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

const stats = [
  { value: 12, suffix: "+", label: "Sites launched", accent: "var(--aurora-teal)" },
  { value: 100, suffix: "%", label: "Custom — no templates", accent: "var(--aurora-light)" },
  { value: 4, suffix: " weeks", label: "First call to live site", accent: "var(--aurora-teal)" },
  { value: 2, prefix: "<", suffix: "s", label: "Average load time", accent: "var(--aurora-light)" },
];

export default function StatsStrip() {
  return (
    <div
      className="relative py-14 overflow-hidden"
      style={{
        background: "rgba(6,5,28,0.98)",
        borderBottom: "1px solid rgba(83,74,183,0.12)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 50% 100% at 50% 50%, rgba(83,74,183,0.06) 0%, transparent 70%)",
      }} />
      <div className="relative max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.08 }}
            className="flex flex-col items-center text-center"
          >
            <div
              className="text-4xl font-bold leading-none mb-2"
              style={{ color: "var(--snow)", letterSpacing: "-0.03em" }}
            >
              <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div className="text-xs tracking-wide" style={{ color: "rgba(175,169,236,0.45)" }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
