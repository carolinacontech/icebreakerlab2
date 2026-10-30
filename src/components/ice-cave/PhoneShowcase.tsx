"use client";
import { forwardRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Celular flotante del final de la cueva: tapa el fondo del recorrido y va
// rotando capturas móviles reales de proyectos del portafolio.
const SCREENS = [
  { name: "NODO Jiu Jitsu Academy", detail: "Website + Local SEO", src: "/images/portfolio/mockups/nodo-academy-mobile.png" },
  { name: "Market Open Media", detail: "Corporate Website + SEO", src: "/images/portfolio/mockups/market-openmedia-mobile.png" },
  { name: "Kings Tree Services", detail: "Website + Local SEO", src: "/images/portfolio/mockups/king-tree-services-mobile.png" },
  { name: "Eva Shoes", detail: "E-commerce / Footwear", src: "/images/portfolio/mockups/eva-shoes-2026.webp" },
];
const ROTATE_MS = 2800;

const PhoneShowcase = forwardRef<HTMLDivElement, { active: boolean }>(function PhoneShowcase({ active }, ref) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") setIndex((i) => (i + 1) % SCREENS.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [active]);

  const current = SCREENS[index];
  return (
    <div ref={ref} className="ic-phone-wrap">
      <Link href="/portfolio" className="ic-phone" aria-label={`See ${current.name} and more in our portfolio`}>
        <span className="ic-phone-shell">
          <span className="ic-phone-screen">
            {SCREENS.map((s, i) => (
              <span key={s.src} className={`ic-phone-slide${i === index ? " is-active" : ""}`} aria-hidden={i !== index}>
                <Image src={s.src} alt={`Mobile version of ${s.name}`} fill sizes="240px" style={{ objectFit: "cover", objectPosition: "top" }} />
              </span>
            ))}
          </span>
          <span className="ic-phone-island" aria-hidden="true" />
          <span className="ic-phone-homebar" aria-hidden="true" />
        </span>
        <span className="ic-phone-caption" aria-live="polite">
          <strong>{current.name}</strong>
          <small>{current.detail}</small>
        </span>
      </Link>
    </div>
  );
});

export default PhoneShowcase;
