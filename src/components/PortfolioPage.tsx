"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";

const projects = [
  {
    id: -7,
    name: "Eva Shoes",
    category: "E-commerce / Footwear",
    headline: "More than shoes. A brighter you.",
    tags: ["E-commerce", "Branding", "Conversion"],
    img: "/images/portfolio/mockups/eva-shoes.png",
    w: 1122,
    h: 1402,
    color: "#F0121C",
  },
  {
    // Sin `url`: el sitio sigue en construcción, así que la ficha no enlaza a ningún lado.
    id: -6,
    name: "AI Magazine",
    category: "Editorial & Publishing",
    headline: "Where AI meets the way we work",
    tags: ["Website", "Branding", "SEO"],
    img: "/images/portfolio/mockups/ai-magazine.png",
    w: 1118,
    h: 690,
    note: "Work in progress — the site is still under construction.",
    color: "#3459D7",
  },
  {
    id: -5,
    name: "Clarity Therapy Center",
    category: "Therapy & Mental Health",
    headline: "Let's find your clarity together",
    tags: ["Website", "Local SEO", "Conversion"],
    img: "/images/portfolio/mockups/clarity.png",
    w: 2880,
    h: 1624,
    color: "#345A86",
    url: "https://clarity-phi-puce.vercel.app/",
  },
  {
    id: -4,
    name: "StayScout",
    category: "Travel & Booking Platform",
    headline: "Find your next stay, anywhere in the world",
    tags: ["Website", "Booking", "Conversion"],
    img: "/images/portfolio/mockups/scoutstay.png",
    w: 2834,
    h: 1558,
    note: "Project structure — the interface and navigation are built; the site isn't fully functional yet.",
    color: "#FF385C",
    url: "https://stayscout-zeta.vercel.app",
  },
  {
    id: 0,
    name: "NODO Jiu Jitsu Academy",
    category: "Martial Arts Academy",
    headline: "More visibility, more signups — built to rank on Google",
    tags: ["Website", "Local SEO", "Conversion"],
    img: "/images/portfolio/mockups/nodo-academy.png",
    w: 2866,
    h: 1612,
    color: "#5DCAA5",
    url: "https://www.nodoacademy.com",
  },
  {
    id: -3,
    name: "Kings Tree Services",
    category: "Corporate Website",
    headline: "Tree services in North Texas & DFW you can trust",
    tags: ["Website", "Local SEO", "Conversion"],
    img: "/images/portfolio/mockups/kings-tree-services.png",
    w: 2856,
    h: 1558,
    color: "#4A7C59",
    url: "https://www.kingstreeservicesllc.com",
  },
  {
    id: -2,
    name: "Las Marías Market",
    category: "E-commerce",
    headline: "Artisan marketplace with payment gateway and creator management",
    tags: ["E-commerce", "Website", "Conversion"],
    img: "/images/portfolio/mockups/las-marias-market.jpg",
    w: 1920,
    h: 5879,
    color: "#D4006A",
    url: "",
  },
  {
    id: -1,
    name: "Market Open Media",
    category: "Marketing Agency",
    headline: "Google Maps & LSA lead generation that actually works",
    tags: ["Website", "SEO", "Conversion"],
    img: "/images/portfolio/mockups/market-open-media.png",
    w: 2856,
    h: 1574,
    color: "#534AB7",
    url: "https://www.marketopenmedia.com",
  },
  {
    id: 1,
    name: "Aurea Estates",
    category: "Real Estate",
    headline: "Extraordinary Residences in Privileged Locations",
    tags: ["Website", "SEO", "Performance"],
    img: "/images/portfolio/mockups/real-estate.png",
    w: 1122,
    h: 1402,
    color: "#B8860B",
  },
  {
    id: 2,
    name: "Maison Noir",
    category: "Fine Dining",
    headline: "Refined Dining Experiences",
    tags: ["Landing Page", "Branding", "SEO"],
    img: "/images/portfolio/mockups/restaurant.png",
    w: 1122,
    h: 1402,
    color: "#D4A843",
  },
  {
    id: 3,
    name: "Nexus Forge",
    category: "SaaS / Tech",
    headline: "Intelligent Infrastructure for Autonomous Systems",
    tags: ["Website", "SEO", "Conversion"],
    img: "/images/portfolio/mockups/saas.png",
    w: 1122,
    h: 1402,
    color: "#534AB7",
  },
  {
    id: 4,
    name: "Luxur",
    category: "Fashion & Lifestyle",
    headline: "Live in Privilege",
    tags: ["E-commerce", "Branding", "SEO"],
    img: "/images/portfolio/mockups/fashion.png",
    w: 1024,
    h: 1536,
    color: "#888780",
  },
  {
    id: 5,
    name: "Altiture",
    category: "Architecture",
    headline: "Elevated Architecture. Meaningful Spaces.",
    tags: ["Portfolio", "SEO", "Performance"],
    img: "/images/portfolio/mockups/architecture.png",
    w: 1024,
    h: 1536,
    color: "#8B7355",
  },
  {
    id: 6,
    name: "Elara Wilde",
    category: "Photography",
    headline: "Photographs that Feel Like Memory",
    tags: ["Portfolio", "SEO", "Performance"],
    img: "/images/portfolio/mockups/photography.png",
    w: 1086,
    h: 1448,
    color: "#AFA9EC",
  },
  {
    id: 7,
    name: "Luxura",
    category: "Interior Design",
    headline: "Spaces that Inspire Living",
    tags: ["Website", "Branding", "SEO"],
    img: "/images/portfolio/mockups/interior-design.png",
    w: 1055,
    h: 1491,
    color: "#C4A882",
  },
  {
    id: 8,
    name: "Evergreen Outdoor Living",
    category: "Landscaping",
    headline: "Beautiful Outdoor Spaces, Designed to Last",
    tags: ["Website", "SEO", "Conversion"],
    img: "/images/portfolio/mockups/landscaping.png",
    w: 1024,
    h: 1536,
    color: "#5DCAA5",
  },
  {
    id: 9,
    name: "Verde Tree Services",
    category: "Tree Services",
    headline: "Stronger Trees, Beautiful Spaces",
    tags: ["Landing Page", "SEO", "Conversion"],
    img: "/images/portfolio/mockups/tree-services.png",
    w: 1067,
    h: 1474,
    color: "#4A7C59",
  },
  {
    id: 10,
    name: "Studio Calm",
    category: "Wellness & Spa",
    headline: "Begin Your Calm Retreat",
    tags: ["Website", "Booking", "SEO"],
    img: "/images/portfolio/mockups/wellness.png",
    w: 1024,
    h: 5874,
    note: "Screenshot taken directly from the live site, so its resolution is limited.",
    color: "#5DCAA5",
  },
];

const ALL_TAGS = ["All", "Website", "Landing Page", "Portfolio", "E-commerce", "SEO", "Local SEO", "Branding", "Conversion"];

export default function PortfolioPage() {
  const [active, setActive] = useState<typeof projects[0] | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const el = document.documentElement;
    // Lenis (smooth scroll) captura el wheel globalmente; hay que pausarlo
    // o seguiría moviendo el fondo detrás del lightbox.
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;

    if (active) {
      el.style.overflow = "hidden";
      lenis?.stop();
    } else {
      el.style.overflow = "";
      lenis?.start();
    }
    return () => {
      el.style.overflow = "";
      lenis?.start();
    };
  }, [active]);

  const filtered = filter === "All" ? projects : projects.filter(p => p.tags.includes(filter));

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/textures/ice-macro-2.png" alt="" fill className="object-cover opacity-8" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,13,31,0.97) 0%, rgba(38,33,92,0.6) 50%, rgba(10,13,31,0.97) 100%)" }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--aurora-teal)" }}>
            Our work
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6" style={{ color: "var(--snow)" }}>
            Built to perform.
            <br />
            <span style={{ color: "var(--aurora-light)" }}>Designed to impress.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg max-w-xl mx-auto" style={{ color: "var(--ice-blue)" }}>
            Every project is a new story. Here are some of the websites we've crafted.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-40 py-4" style={{ background: "rgba(10,13,31,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(83,74,183,0.15)" }}>
        <div className="max-w-7xl mx-auto px-6 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {ALL_TAGS.map((tag) => (
            <button key={tag} onClick={() => setFilter(tag)}
              className="px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 shrink-0"
              style={{
                background: filter === tag ? "var(--aurora)" : "rgba(83,74,183,0.12)",
                color: filter === tag ? "var(--snow)" : "var(--aurora-light)",
                border: `1px solid ${filter === tag ? "var(--aurora)" : "rgba(83,74,183,0.25)"}`,
              }}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="py-16" style={{ background: "var(--night)", minHeight: "60vh" }}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Los proyectos son h3, así que sin este h2 el nivel saltaba de h1
              a h3: los encabezados son estructura, no tamaño (docs/04). */}
          <h2 className="sr-only">Projects</h2>
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setActive(p)}
                  className="group cursor-pointer rounded-2xl overflow-hidden relative"
                  style={{ border: "1px solid rgba(83,74,183,0.2)" }}
                  whileHover={{ y: -6 }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ height: "280px" }}>
                    <Image
                      src={p.img}
                      alt={p.name}
                      fill
                      className="object-cover object-top group-hover:scale-105"
                      style={{ transition: "transform 700ms" }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                      style={{ background: "linear-gradient(to bottom, transparent, rgba(10,13,31,0.7))" }} />
                    {/* Hover overlay */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      style={{ background: "rgba(83,74,183,0.6)", backdropFilter: "blur(4px)" }}
                      onClick={(e) => {
                        if ("url" in p && p.url) {
                          e.stopPropagation();
                          window.open(p.url as string, "_blank", "noopener,noreferrer");
                        }
                      }}
                    >
                      <span className="px-6 py-3 rounded-full font-semibold text-sm"
                        style={{ background: "var(--snow)", color: "var(--deep-aurora)" }}>
                        View project →
                      </span>
                    </motion.div>
                  </div>

                  {/* Info bar */}
                  <div className="px-6 py-5 flex items-center justify-between"
                    style={{ background: "rgba(10,13,31,0.95)" }}>
                    <div>
                      <span className="text-xs tracking-widest uppercase block mb-1" style={{ color: "var(--aurora-teal)" }}>{p.category}</span>
                      <h3 className="font-semibold text-base" style={{ color: "var(--snow)" }}>{p.name}</h3>
                      <p className="text-sm mt-0.5 italic" style={{ color: "var(--aurora-light)", opacity: 0.7 }}>"{p.headline}"</p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      {p.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-xs px-2.5 py-0.5 rounded-full"
                          style={{ background: "rgba(83,74,183,0.15)", color: "var(--aurora-light)", border: "1px solid rgba(83,74,183,0.25)" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center" style={{ background: "var(--midnight)" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--aurora-teal)" }}>Ready?</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: "var(--snow)" }}>
            Your project could be next.
          </h2>
          <Link href="/#contact">
            <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="inline-block px-10 py-4 rounded-full font-semibold text-base"
              style={{ background: "var(--aurora)", color: "var(--snow)", boxShadow: "0 0 50px rgba(83,74,183,0.45)" }}>
              Start your project →
            </motion.span>
          </Link>
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
            style={{ background: "rgba(10,13,31,0.95)", backdropFilter: "blur(20px)" }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl rounded-3xl overflow-hidden flex flex-col"
              style={{ border: "1px solid rgba(175,169,236,0.2)", maxHeight: "90vh" }}
            >
              {/* Sticky header */}
              <div className="px-6 py-4 flex items-center justify-between shrink-0"
                style={{ background: "rgba(10,13,31,0.98)", borderBottom: "1px solid rgba(83,74,183,0.2)" }}>
                <div>
                  <span className="text-xs tracking-widest uppercase" style={{ color: "var(--aurora-teal)" }}>{active.category}</span>
                  <h3 className="text-lg font-bold ml-0 mt-0.5" style={{ color: "var(--snow)" }}>{active.name}</h3>
                </div>
                <div className="flex gap-3 items-center">
                  {"url" in active && active.url && (
                    <a href={active.url as string} target="_blank" rel="noopener noreferrer">
                      <motion.span whileHover={{ scale: 1.05 }}
                        className="inline-block px-5 py-2.5 rounded-full font-semibold text-sm"
                        style={{ background: "rgba(83,74,183,0.2)", color: "var(--aurora-light)", border: "1px solid rgba(83,74,183,0.4)" }}>
                        Visit site →
                      </motion.span>
                    </a>
                  )}
                  <Link href="/#contact" onClick={() => setActive(null)}>
                    <motion.span whileHover={{ scale: 1.05 }}
                      className="inline-block px-5 py-2.5 rounded-full font-semibold text-sm"
                      style={{ background: "var(--aurora)", color: "var(--snow)" }}>
                      Build mine →
                    </motion.span>
                  </Link>
                  <button onClick={() => setActive(null)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                    style={{ background: "rgba(83,74,183,0.2)", color: "var(--aurora-light)", border: "1px solid rgba(83,74,183,0.3)" }}>
                    ×
                  </button>
                </div>
              </div>

              {/* Nota de contexto del mockup (opcional por proyecto) */}
              {"note" in active && active.note && (
                <div className="px-6 py-2.5 flex items-start gap-2 shrink-0"
                  style={{ background: "rgba(83,74,183,0.09)", borderBottom: "1px solid rgba(83,74,183,0.18)" }}>
                  <span aria-hidden="true" className="text-xs leading-relaxed shrink-0" style={{ color: "var(--aurora-teal)" }}>ⓘ</span>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(175,169,236,0.75)" }}>
                    {active.note}
                  </p>
                </div>
              )}

              {/* Scrollable image */}
              <div data-lenis-prevent className="overflow-y-auto flex-1 min-h-0" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(83,74,183,0.4) transparent", overscrollBehavior: "contain" }}>
                {/* Los mockups tienen resoluciones muy distintas (1024–1920 de ancho).
                    Mostrarlos todos a 1022px estira los pequeños al doble en pantallas
                    retina y se ven pixelados, así que cada uno se limita al ancho que
                    sus píxeles sostienen (hasta ~1.4x) y se centra. */}
                <Image
                  src={active.img}
                  alt={active.name}
                  width={active.w}
                  height={active.h}
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="w-full h-auto mx-auto"
                  quality={95}
                  style={{ display: "block", maxWidth: Math.round(active.w / 1.4) }}
                />
              </div>

              {/* Sticky footer */}
              <div className="px-6 py-4 flex items-center justify-between shrink-0"
                style={{ background: "rgba(10,13,31,0.98)", borderTop: "1px solid rgba(83,74,183,0.2)" }}>
                <div className="flex gap-2 flex-wrap">
                  {active.tags.map(t => (
                    <span key={t} className="text-xs px-3 py-1 rounded-full"
                      style={{ background: "rgba(83,74,183,0.2)", color: "var(--aurora-light)", border: "1px solid rgba(83,74,183,0.3)" }}>
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-sm italic" style={{ color: "var(--aurora-light)", opacity: 0.7 }}>"{active.headline}"</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
