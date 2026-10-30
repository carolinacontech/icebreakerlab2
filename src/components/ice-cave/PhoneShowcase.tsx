"use client";
import { forwardRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Celular flotante al fondo de la cueva: ocupa el lugar del logo de la
// plantilla y crece a medida que la cámara se acerca. En los fotogramas
// finales gira como lo hacía el logo, y cada vuelta presenta otro proyecto
// del portafolio (la pantalla cambia mientras se ve la parte de atrás).
const SCREENS = [
  { name: "NODO Jiu Jitsu Academy", detail: "Website + Local SEO", src: "/images/portfolio/mockups/nodo-academy-mobile.png" },
  { name: "Market Open Media", detail: "Corporate Website + SEO", src: "/images/portfolio/mockups/market-openmedia-mobile.png" },
  { name: "Kings Tree Services", detail: "Website + Local SEO", src: "/images/portfolio/mockups/king-tree-services-mobile.png" },
  { name: "Eva Shoes", detail: "E-commerce / Footwear", src: "/images/portfolio/mockups/eva-shoes-2026.webp" },
];
// Debe coincidir con la duración de @keyframes ic-spin.
const SPIN_MS = 1400;
// Tiempo de lectura entre vueltas.
const HOLD_MS = 2200;
const FIRST_SPIN_DELAY_MS = 400;

const PhoneShowcase = forwardRef<HTMLDivElement, { spinning: boolean }>(function PhoneShowcase({ spinning }, ref) {
  const [index, setIndex] = useState(0);
  const [turning, setTurning] = useState(false);

  useEffect(() => {
    if (!spinning) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const next = () => setIndex((i) => (i + 1) % SCREENS.length);

    const turn = () => {
      if (document.visibilityState === "visible") {
        if (reduced) {
          next();
        } else {
          setTurning(true);
          // A media vuelta se ve la parte de atrás: ahí cambia la página.
          later(next, SPIN_MS / 2);
          later(() => setTurning(false), SPIN_MS);
        }
      }
      later(turn, (reduced ? 0 : SPIN_MS) + HOLD_MS);
    };
    later(turn, FIRST_SPIN_DELAY_MS);

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      // Si se sale a mitad de una vuelta, el celular queda de frente.
      setTurning(false);
    };
  }, [spinning]);

  const current = SCREENS[index];
  return (
    <div ref={ref} className="ic-phone-wrap">
      <Link href="/portfolio" className="ic-phone" aria-label={`See ${current.name} and more in our portfolio`}>
        <span className={`ic-phone-body${turning ? " is-spinning" : ""}`}>
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
          <span className="ic-phone-back" aria-hidden="true">
            <span className="ic-phone-camera" />
          </span>
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
