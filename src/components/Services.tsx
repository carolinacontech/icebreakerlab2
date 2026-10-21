"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { CrackLink } from "./IceCrack";

function TiltCard({
  children,
  delay = 0,
  featured = false,
  accentRgb = "175,169,236",
}: {
  children: React.ReactNode;
  delay?: number;
  featured?: boolean;
  accentRgb?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 200, damping: 22 });
  const rotateY = useSpring(rawY, { stiffness: 200, damping: 22 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawX.set(((e.clientY - cy) / (rect.height / 2)) * -5);
    rawY.set(((e.clientX - cx) / (rect.width / 2)) * 5);
  };
  const onLeave = () => { rawX.set(0); rawY.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay }}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          background: featured
            ? "linear-gradient(160deg, rgba(83,74,183,0.22) 0%, rgba(40,30,110,0.35) 100%)"
            : "rgba(255,255,255,0.025)",
          border: featured
            ? "1px solid rgba(175,169,236,0.3)"
            : `1px solid rgba(${accentRgb},0.12)`,
          boxShadow: featured
            ? "0 0 80px rgba(83,74,183,0.18), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "none",
        }}
        className="flex flex-col rounded-2xl overflow-hidden relative h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

const services = [
  {
    index: "01",
    name: "Landing Page",
    tagline: "One page. One goal. One result.",
    description: "A single high-impact page built to grab attention and turn visitors into leads — fast.",
    features: [
      "Custom design from scratch",
      "Google-ready from day one",
      "Mobile-perfect on every device",
      "Loads in under 2 seconds",
      "Contact form + Analytics",
    ],
    label: "Website + SEO",
    accent: "#5DCAA5",
    accentRgb: "93,202,165",
    visual: "landing",
  },
  {
    index: "02",
    name: "Corporate Website",
    tagline: "Your complete online presence.",
    description: "3–5 pages that tell your full story, rank on Google, and convert visitors into clients.",
    features: [
      "3–5 beautifully designed pages",
      "Local SEO built in from day one",
      "Content writing included",
      "Contact forms + Google tracking",
      "Optimized for speed and mobile",
    ],
    label: "Corporate + SEO",
    accent: "#AFA9EC",
    accentRgb: "175,169,236",
    visual: "corporate",
    featured: true,
  },
  {
    index: "03",
    name: "E-commerce",
    tagline: "Your store, open 24/7.",
    description: "A custom online store where customers browse, buy, and pay — any time of day.",
    features: [
      "Custom store design",
      "Secure payment system included",
      "Google-optimized product catalog",
      "Easy order management",
      "Analytics + sales dashboard",
    ],
    label: "E-commerce + SEO",
    accent: "#7C6FE8",
    accentRgb: "124,111,232",
    visual: "ecommerce",
  },
];

/* ─── Browser mockup wrapper ─── */
function BrowserMock({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: "rgba(8,7,30,0.9)" }}>
      {/* Chrome bar */}
      <div className="flex items-center gap-2 px-3 py-2 shrink-0" style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex gap-1.5">
          {["rgba(255,95,86,0.6)", "rgba(255,189,46,0.6)", "rgba(40,200,64,0.6)"].map((c, i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <div className="flex-1 mx-2 py-0.5 rounded flex items-center gap-1.5 px-2" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent, opacity: 0.7 }} />
          <div className="h-1 rounded flex-1" style={{ background: "rgba(255,255,255,0.1)" }} />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

/* ─── CSS illustrations ─── */

function LandingVisual({ accent }: { accent: string }) {
  return (
    <BrowserMock accent={accent}>
      <div className="w-full h-full flex flex-col">
        {/* Nav */}
        <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="w-12 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
          <div className="flex gap-3">{[40,36,44].map((w, i) => <div key={i} className="h-1 rounded" style={{ background: "rgba(255,255,255,0.07)", width: w }} />)}</div>
          <div className="px-2.5 py-1 rounded-full" style={{ background: accent, opacity: 0.85 }}>
            <div className="h-1 w-8 rounded" style={{ background: "rgba(10,13,31,0.4)" }} />
          </div>
        </div>
        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2.5 px-5 text-center" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(93,202,165,0.06) 0%, transparent 70%)" }}>
          <div className="flex flex-col gap-1.5 w-full">
            <div className="h-4 rounded-lg mx-auto" style={{ background: "rgba(255,255,255,0.2)", width: "82%" }} />
            <div className="h-4 rounded-lg mx-auto" style={{ background: "rgba(255,255,255,0.13)", width: "62%" }} />
          </div>
          <div className="flex flex-col gap-1 w-full max-w-[140px]">
            {[80, 70, 60].map((w, i) => <div key={i} className="h-1.5 rounded mx-auto" style={{ background: "rgba(255,255,255,0.05)", width: `${w}%` }} />)}
          </div>
          <div className="flex gap-2 mt-1">
            <div className="px-4 py-2 rounded-full" style={{ background: accent, opacity: 0.9 }}>
              <div className="h-1.5 w-10 rounded" style={{ background: "rgba(10,13,31,0.45)" }} />
            </div>
            <div className="px-4 py-2 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "transparent" }}>
              <div className="h-1.5 w-8 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>
          </div>
        </div>
        {/* Stats strip */}
        <div className="flex border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          {["Visits +84%", "#1 Google", "0–0.8s"].map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center py-2 gap-0.5" style={{ borderRight: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ color: accent, fontSize: "7px", fontWeight: 700, opacity: 0.85 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </BrowserMock>
  );
}

function CorporateVisual({ accent }: { accent: string }) {
  return (
    <BrowserMock accent={accent}>
      <div className="w-full h-full flex flex-col">
        {/* Hero image area */}
        <div className="relative overflow-hidden" style={{ height: "90px", background: "radial-gradient(ellipse 100% 120% at 60% 50%, rgba(83,74,183,0.3) 0%, rgba(20,16,60,0.9) 100%)" }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(8,7,30,0.8) 100%)" }} />
          <div className="absolute bottom-3 left-4 flex flex-col gap-1">
            <div className="h-2.5 w-24 rounded" style={{ background: "rgba(255,255,255,0.22)" }} />
            <div className="h-1.5 w-16 rounded" style={{ background: "rgba(255,255,255,0.1)" }} />
          </div>
          <div className="absolute bottom-3 right-4">
            <div className="px-3 py-1.5 rounded-full" style={{ background: accent, opacity: 0.85 }}>
              <div className="h-1.5 w-10 rounded" style={{ background: "rgba(10,13,31,0.4)" }} />
            </div>
          </div>
        </div>
        {/* Nav tabs */}
        <div className="flex gap-0 px-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {["Home", "Services", "About", "Contact"].map((p, i) => (
            <div key={p} className="px-3 py-1.5 flex flex-col items-center gap-0.5" style={{ borderBottom: i === 0 ? `1.5px solid ${accent}` : "1.5px solid transparent" }}>
              <div className="h-1 rounded" style={{ background: i === 0 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)", width: p.length * 3.5 }} />
            </div>
          ))}
        </div>
        {/* Services grid */}
        <div className="flex-1 grid grid-cols-3 gap-2 p-3">
          {[0.14, 0.18, 0.12].map((o, i) => (
            <div key={i} className="rounded-lg p-2 flex flex-col gap-1.5"
              style={{ background: `rgba(83,74,183,${o})`, border: `1px solid rgba(175,169,236,${o * 1.2})` }}>
              <div className="w-4 h-4 rounded" style={{ background: `rgba(175,169,236,${0.2 + i * 0.05})` }} />
              <div className="h-1 rounded" style={{ background: "rgba(255,255,255,0.15)", width: "80%" }} />
              <div className="h-1 rounded" style={{ background: "rgba(255,255,255,0.07)", width: "60%" }} />
            </div>
          ))}
        </div>
      </div>
    </BrowserMock>
  );
}

function EcommerceVisual({ accent }: { accent: string }) {
  const products = [
    { label: "Pro Jacket", price: "$129", hot: true },
    { label: "Core Tee", price: "$48" },
    { label: "Merino Hat", price: "$72" },
    { label: "Trail Set", price: "$95", new: true },
  ];
  return (
    <BrowserMock accent={accent}>
      <div className="w-full h-full flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex gap-2 items-center">
            <div className="w-12 h-1.5 rounded" style={{ background: "rgba(255,255,255,0.18)" }} />
          </div>
          <div className="flex gap-3">
            {[28, 22, 20].map((w, i) => <div key={i} className="h-1 rounded" style={{ background: "rgba(255,255,255,0.07)", width: w }} />)}
          </div>
          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: accent, opacity: 0.85 }}>
            <div style={{ color: "rgba(10,13,31,0.7)", fontSize: "8px", fontWeight: 800 }}>3</div>
          </div>
        </div>
        {/* Product grid */}
        <div className="grid grid-cols-2 gap-1.5 p-2 flex-1">
          {products.map((p, i) => (
            <div key={i} className="rounded-lg overflow-hidden flex flex-col"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="relative flex-1 flex items-center justify-center" style={{ background: `rgba(124,111,232,${0.07 + (i % 2) * 0.04})`, minHeight: "44px" }}>
                <div className="w-7 h-7 rounded-lg" style={{ background: `rgba(124,111,232,${0.2 + i * 0.04})`, border: "1px solid rgba(124,111,232,0.2)" }} />
                {p.hot && <div className="absolute top-1 left-1 px-1 py-0.5 rounded" style={{ background: "#ff5f56", fontSize: "5px", color: "#fff", fontWeight: 800 }}>HOT</div>}
                {p.new && <div className="absolute top-1 left-1 px-1 py-0.5 rounded" style={{ background: accent, fontSize: "5px", color: "#0a0d1f", fontWeight: 800 }}>NEW</div>}
              </div>
              <div className="px-2 py-1.5 flex items-center justify-between">
                <div style={{ color: accent, fontSize: "8px", fontWeight: 700 }}>{p.price}</div>
                <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: `rgba(124,111,232,0.2)`, border: "1px solid rgba(124,111,232,0.3)", color: accent, fontSize: "9px" }}>+</div>
              </div>
            </div>
          ))}
        </div>
        {/* Checkout strip */}
        <div className="flex items-center justify-between px-3 py-2" style={{ background: `rgba(124,111,232,0.12)`, borderTop: "1px solid rgba(124,111,232,0.2)" }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "7px" }}>3 items · <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 700 }}>$344</span></div>
          <div className="px-3 py-1.5 rounded-full" style={{ background: accent, opacity: 0.9 }}>
            <div style={{ color: "#0a0d1f", fontSize: "7px", fontWeight: 800 }}>Checkout →</div>
          </div>
        </div>
      </div>
    </BrowserMock>
  );
}

/* ─── Main component ─── */

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden py-32"
      style={{ background: "var(--night)", minHeight: "100vh" }}
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(83,74,183,0.07) 0%, transparent 70%)",
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="section-eyebrow mb-4">What we build</p>
          <h2 className="section-title">Pick your package</h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {services.map((svc, i) => (
            <TiltCard
              key={svc.name}
              delay={i * 0.1}
              featured={svc.featured}
              accentRgb={svc.accentRgb}
            >
              {/* Featured glow */}
              {svc.featured && (
                <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                  background: "radial-gradient(ellipse 90% 40% at 50% 0%, rgba(107,92,231,0.18) 0%, transparent 60%)"
                }} />
              )}

              {/* Illustration area */}
              <div
                className="relative shrink-0 overflow-hidden"
                style={{
                  height: "200px",
                  borderBottom: `1px solid rgba(${svc.accentRgb},0.12)`,
                  background: `rgba(${svc.accentRgb},0.03)`,
                }}
              >
                {svc.visual === "landing" && <LandingVisual accent={svc.accent} />}
                {svc.visual === "corporate" && <CorporateVisual accent={svc.accent} />}
                {svc.visual === "ecommerce" && <EcommerceVisual accent={svc.accent} />}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-7 relative z-10">
                {/* Label */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="tracking-widest px-2.5 py-1 rounded"
                    style={{
                      color: svc.accent,
                      background: `rgba(${svc.accentRgb},0.08)`,
                      border: `1px solid rgba(${svc.accentRgb},0.18)`,
                      fontSize: "11px",
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                    }}
                  >
                    {svc.label}
                  </span>
                </div>

                {/* Name */}
                <h3
                  className="font-bold mb-2 leading-tight"
                  style={{
                    fontSize: "clamp(1.4rem, 2vw, 1.75rem)",
                    color: "var(--snow)",
                    letterSpacing: "-0.02em",
                    textShadow: `0 0 40px rgba(${svc.accentRgb},0.2)`,
                  }}
                >
                  {svc.name}
                </h3>

                <p className="text-sm font-semibold mb-4" style={{ color: svc.accent }}>
                  {svc.tagline}
                </p>

                <p className="leading-relaxed mb-6" style={{ color: "rgba(175,169,236,0.65)", fontSize: "15px" }}>
                  {svc.description}
                </p>

                {/* Divider */}
                <div className="h-px mb-6" style={{ background: `rgba(${svc.accentRgb},0.12)` }} />

                {/* Features */}
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {svc.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: "rgba(240,244,255,0.8)" }}>
                      <span className="mt-0.5 shrink-0 font-bold" style={{ color: svc.accent }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA — quien elige paquete ya decidió: va al brief (/frost) */}
                <CrackLink
                  href="/frost"
                  className="w-full py-4 rounded-full text-base font-bold text-center transition-all hover:scale-[1.02] block"
                  style={svc.featured ? {
                    background: `linear-gradient(135deg, rgba(${svc.accentRgb},0.9), rgba(${svc.accentRgb},0.65))`,
                    color: "#0a0d1f",
                    boxShadow: `0 0 32px rgba(${svc.accentRgb},0.35)`,
                  } : {
                    background: `rgba(${svc.accentRgb},0.08)`,
                    color: svc.accent,
                    border: `1px solid rgba(${svc.accentRgb},0.25)`,
                  }}
                >
                  Break the ice →
                </CrackLink>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Included in every package */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 rounded-2xl px-8 py-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-8"
          style={{ background: "rgba(93,202,165,0.06)", border: "1px solid rgba(93,202,165,0.18)" }}>
          <p className="text-xs font-semibold tracking-widest uppercase shrink-0" style={{ color: "rgba(93,202,165,0.7)" }}>
            Included in every package
          </p>
          <div className="h-px sm:w-px sm:h-6 w-full" style={{ background: "rgba(93,202,165,0.15)" }} />
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            {[
              { label: "SEO", desc: "On-page & technical optimization" },
              { label: "Local SEO", desc: "Google Maps & local rankings" },
              { label: "AEO", desc: "Visibility in AI answers" },
              // Sin desc: el label ya se explica solo y así entra en la misma fila
              { label: "English & Spanish", desc: "" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: "rgba(93,202,165,0.08)", border: "1px solid rgba(93,202,165,0.2)" }}>
                <span className="text-xs font-bold" style={{ color: "#5DCAA5" }}>{item.label}</span>
                {item.desc && (
                  <span className="text-xs" style={{ color: "rgba(175,169,236,0.55)" }}>— {item.desc}</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Add-on: Website Maintenance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(175,169,236,0.15)" }}>
          {/* Label */}
          <div className="shrink-0">
            <span className="text-xs font-semibold tracking-widest px-2.5 py-1 rounded"
              style={{ color: "#AFA9EC", background: "rgba(175,169,236,0.08)", border: "1px solid rgba(175,169,236,0.2)" }}>
              Add-on
            </span>
            <h3 className="mt-3 font-bold text-lg leading-tight" style={{ color: "var(--snow)" }}>Website Maintenance</h3>
            <p className="text-sm mt-0.5 font-medium" style={{ color: "#AFA9EC" }}>Your site, always up to date.</p>
          </div>
          <div className="h-px sm:w-px sm:h-16 w-full" style={{ background: "rgba(175,169,236,0.1)" }} />
          {/* Features */}
          <div className="flex flex-wrap gap-x-8 gap-y-2 flex-1">
            {[
              "Content & text updates",
              "Security patches & backups",
              "Plugin & platform updates",
              "Performance monitoring",
              "Priority support",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm" style={{ color: "rgba(240,244,255,0.75)" }}>
                <span className="font-bold" style={{ color: "#AFA9EC" }}>✓</span> {f}
              </div>
            ))}
          </div>
          <CrackLink href="#contact"
            className="shrink-0 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-[1.02] whitespace-nowrap"
            style={{ background: "rgba(175,169,236,0.08)", color: "#AFA9EC", border: "1px solid rgba(175,169,236,0.25)" }}>
            Ask about it →
          </CrackLink>
        </motion.div>
      </div>
    </section>
  );
}
