"use client";
import { motion } from "framer-motion";
import { CrackLink } from "./IceCrack";

const steps = [
  {
    number: "01",
    title: "We listen to your brand",
    description:
      "Every project starts with understanding who you are, what you do, and — most importantly — what you want to say. We dig into your tone, your audience, your differentiators, and your goals before writing a single line of code. We work in English and Spanish, so your site speaks the language your clients actually think in.",
    accent: "#5DCAA5",
    accentRgb: "93,202,165",
  },
  {
    number: "02",
    title: "We build the full picture",
    description:
      "We craft every page with your message at the center — your story, your services, your proof. No generic templates. No filler copy. Just clear, compelling content and design that actually sounds like you.",
    accent: "#AFA9EC",
    accentRgb: "175,169,236",
  },
  {
    number: "03",
    title: "We optimize at every level",
    description:
      "Once the site is built, we make sure the world finds it. We optimize for Google (SEO), for local searches and Maps (Local SEO), and for AI tools like ChatGPT and Perplexity (AEO) — so your brand shows up wherever your next client is looking.",
    accent: "#7C6FE8",
    accentRgb: "124,111,232",
  },
];

const optimizations = [
  {
    label: "SEO",
    title: "Search Engine Optimization",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 18l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    description:
      "We optimize your site technically and editorially so Google consistently ranks you above competitors — without paying for every click.",
    items: [
      "Keyword research & content strategy",
      "On-page optimization (titles, metas, headings)",
      "Technical SEO: speed, structure, crawlability",
      "Internal linking & site architecture",
      "Schema markup & structured data",
    ],
    accent: "#5DCAA5",
    accentRgb: "93,202,165",
  },
  {
    label: "Local SEO",
    title: "Local Search Optimization",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3C10.134 3 7 6.134 7 10c0 5.25 7 15 7 15s7-9.75 7-15c0-3.866-3.134-7-7-7z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="14" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    description:
      "We make sure your business dominates Google Maps and local search results — so customers in your area find you first, not your competitors.",
    items: [
      "Google Business Profile setup & optimization",
      "Local keyword targeting",
      "Citation building & NAP consistency",
      "Review strategy & reputation management",
      "Map Pack ranking focus",
    ],
    accent: "#AFA9EC",
    accentRgb: "175,169,236",
  },
  {
    label: "AEO",
    title: "Answer Engine Optimization",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="5" width="22" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="21" cy="21" r="4" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 21l1 1 2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    description:
      "We structure your content so AI tools like ChatGPT, Perplexity, and Google AI Overviews recommend your business as the answer — not just a link in a list.",
    items: [
      "AI visibility audit",
      "Question-based content strategy",
      "Featured snippet & People Also Ask targeting",
      "Entity building & authority signals",
      "Structured data for AI comprehension",
    ],
    accent: "#7C6FE8",
    accentRgb: "124,111,232",
  },
];

const packages = [
  {
    name: "Landing Page",
    tagline: "One page. One goal. One result.",
    price: "Starting at $800",
    features: ["Custom design from scratch", "Copywriting included", "SEO + Local SEO + AEO", "Mobile-perfect", "Loads under 2s", "Contact form + Analytics"],
    accent: "#5DCAA5",
    accentRgb: "93,202,165",
  },
  {
    name: "Corporate Website",
    tagline: "Your complete online presence.",
    price: "Starting at $1,800",
    features: ["3–5 custom pages", "Full copywriting", "SEO + Local SEO + AEO", "Google Business setup", "Forms + CRM integration", "Speed & mobile optimized"],
    accent: "#AFA9EC",
    accentRgb: "175,169,236",
    featured: true,
  },
  {
    name: "E-commerce",
    tagline: "Your store, open 24/7.",
    price: "Starting at $2,500",
    features: ["Custom store design", "Product catalog setup", "Secure payment system", "SEO + Local SEO + AEO", "Order management", "Analytics dashboard"],
    accent: "#7C6FE8",
    accentRgb: "124,111,232",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6, ease: [0.23, 1, 0.32, 1] as const } }),
};

export default function ServicesPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 overflow-hidden" style={{ background: "var(--night)" }}>
        <div className="absolute inset-0 z-0" style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(83,74,183,0.18) 0%, transparent 70%)",
        }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="section-eyebrow mb-5">
            What we do
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }}
            className="font-extrabold leading-tight mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "var(--snow)", letterSpacing: "-0.03em" }}>
            We build websites that{" "}
            <span style={{
              background: "linear-gradient(135deg, #AFA9EC 0%, #5DCAA5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              say what you mean.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16 }}
            className="text-lg leading-relaxed mx-auto mb-10"
            style={{ color: "rgba(175,169,236,0.7)", maxWidth: "620px" }}>
            Every brand has a story worth telling. We make sure yours is heard — on Google, on Maps, and in AI tools. Design, copy, and optimization all in one place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-wrap gap-4 justify-center">
            <CrackLink href="/#contact"
              className="px-8 py-4 rounded-full font-semibold text-base transition-transform hover:scale-105"
              style={{ background: "var(--aurora)", color: "var(--snow)", boxShadow: "0 0 40px rgba(83,74,183,0.45)" }}>
              Break the ice →
            </CrackLink>
            <CrackLink href="/portfolio"
              className="px-8 py-4 rounded-full font-semibold text-base transition-transform hover:scale-105"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(175,169,236,0.3)", color: "var(--aurora-light)" }}>
              See our work →
            </CrackLink>
          </motion.div>
        </div>
      </section>

      {/* ── How we work ── */}
      <section className="py-24" style={{ background: "var(--night)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
            <p className="section-eyebrow mb-4">Our approach</p>
            <h2 className="section-title">How we build your site</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div key={step.number} custom={i} variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true }}
                className="relative rounded-2xl p-8"
                style={{ background: "rgba(255,255,255,0.025)", border: `1px solid rgba(${step.accentRgb},0.18)` }}>
                <div className="text-5xl font-extrabold mb-5 leading-none"
                  style={{ color: `rgba(${step.accentRgb},0.18)`, letterSpacing: "-0.04em" }}>
                  {step.number}
                </div>
                <h3 className="font-bold text-xl mb-3" style={{ color: "var(--snow)" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(175,169,236,0.65)" }}>{step.description}</p>
                <div className="absolute top-8 right-8 w-2 h-2 rounded-full" style={{ background: step.accent }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO / Local SEO / AEO breakdown ── */}
      <section className="py-24" style={{ background: "rgba(10,13,31,0.98)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-6">
            <p className="section-eyebrow mb-4">Included in every project</p>
            <h2 className="section-title mb-4">Built to be found</h2>
            <p className="text-base mx-auto" style={{ color: "rgba(175,169,236,0.6)", maxWidth: "520px" }}>
              Every website we deliver comes fully optimized — not as an afterthought, but as part of the build from day one.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
            {optimizations.map((opt, i) => (
              <motion.div key={opt.label} custom={i} variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true }}
                className="rounded-2xl p-8 flex flex-col gap-5"
                style={{ background: "rgba(255,255,255,0.025)", border: `1px solid rgba(${opt.accentRgb},0.2)` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `rgba(${opt.accentRgb},0.1)`, color: opt.accent }}>
                  {opt.icon}
                </div>
                <div>
                  <span className="text-xs font-bold tracking-widest px-2 py-0.5 rounded"
                    style={{ color: opt.accent, background: `rgba(${opt.accentRgb},0.1)`, border: `1px solid rgba(${opt.accentRgb},0.2)` }}>
                    {opt.label}
                  </span>
                  <h3 className="mt-3 font-bold text-xl" style={{ color: "var(--snow)" }}>{opt.title}</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(175,169,236,0.6)" }}>{opt.description}</p>
                <div className="h-px" style={{ background: `rgba(${opt.accentRgb},0.12)` }} />
                <ul className="flex flex-col gap-2.5">
                  {opt.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: "rgba(240,244,255,0.78)" }}>
                      <span className="font-bold shrink-0" style={{ color: opt.accent }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages ── */}
      <section className="py-24" style={{ background: "var(--night)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
            <p className="section-eyebrow mb-4">Packages</p>
            <h2 className="section-title">Choose your starting point</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <motion.div key={pkg.name} custom={i} variants={fadeUp} initial="hidden" whileInView="show"
                viewport={{ once: true }}
                className="rounded-2xl p-8 flex flex-col gap-5 relative"
                style={{
                  background: pkg.featured
                    ? "linear-gradient(160deg, rgba(83,74,183,0.2) 0%, rgba(40,30,110,0.3) 100%)"
                    : "rgba(255,255,255,0.025)",
                  border: pkg.featured
                    ? "1px solid rgba(175,169,236,0.35)"
                    : `1px solid rgba(${pkg.accentRgb},0.15)`,
                  boxShadow: pkg.featured ? "0 0 60px rgba(83,74,183,0.15)" : "none",
                }}>
                {pkg.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                    style={{ background: "var(--aurora)", color: "var(--snow)" }}>
                    Most popular
                  </div>
                )}
                <div>
                  <span className="text-xs font-semibold tracking-widest px-2 py-0.5 rounded"
                    style={{ color: pkg.accent, background: `rgba(${pkg.accentRgb},0.1)`, border: `1px solid rgba(${pkg.accentRgb},0.2)` }}>
                    {pkg.name}
                  </span>
                  <p className="mt-3 font-bold text-xl" style={{ color: "var(--snow)" }}>{pkg.tagline}</p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: pkg.accent }}>{pkg.price}</p>
                </div>
                <div className="h-px" style={{ background: `rgba(${pkg.accentRgb},0.12)` }} />
                <ul className="flex flex-col gap-3 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: "rgba(240,244,255,0.8)" }}>
                      <span className="font-bold shrink-0" style={{ color: pkg.accent }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {/* Quien elige un paquete ya decidió: va directo al brief */}
                <CrackLink href="/frost"
                  className="w-full py-4 rounded-full text-base font-bold text-center transition-all hover:scale-[1.02] block"
                  style={pkg.featured ? {
                    background: "var(--aurora)",
                    color: "var(--snow)",
                    boxShadow: "0 0 32px rgba(83,74,183,0.4)",
                  } : {
                    background: `rgba(${pkg.accentRgb},0.08)`,
                    color: pkg.accent,
                    border: `1px solid rgba(${pkg.accentRgb},0.25)`,
                  }}>
                  Break the ice →
                </CrackLink>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
