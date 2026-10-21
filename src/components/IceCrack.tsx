"use client";
import { createContext, useContext, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CrackLine { d: string; delay: number; width: number; }
interface CrackEvent { id: number; x: number; y: number; lines: CrackLine[]; }

function makeCracks(cx: number, cy: number): CrackLine[] {
  const maxLen = Math.min(window.innerWidth, window.innerHeight) * 0.35;
  const result: CrackLine[] = [];
  const count = 6;

  for (let i = 0; i < count; i++) {
    const baseAngle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const len = maxLen * (0.5 + Math.random() * 0.5);
    let x = cx, y = cy, a = baseAngle;
    let d = `M ${x} ${y}`;
    const mid = { x: cx + Math.cos(a + (Math.random() - 0.5) * 0.5) * len * 0.5, y: cy + Math.sin(a + (Math.random() - 0.5) * 0.5) * len * 0.5 };
    d += ` L ${Math.round(mid.x)} ${Math.round(mid.y)} L ${Math.round(cx + Math.cos(baseAngle) * len)} ${Math.round(cy + Math.sin(baseAngle) * len)}`;
    result.push({ d, delay: i * 0.025, width: i % 2 === 0 ? 1.8 : 1.0 });
  }
  return result;
}

let _id = 0;
const CrackCtx = createContext<(x: number, y: number, cb: () => void) => void>(() => {});
export const useCrack = () => useContext(CrackCtx);

export function IceCrackProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CrackEvent[]>([]);

  const trigger = useCallback((x: number, y: number, cb: () => void) => {
    const id = ++_id;
    setEvents(ev => [...ev, { id, x, y, lines: makeCracks(x, y) }]);
    setTimeout(cb, 480);
    setTimeout(() => setEvents(ev => ev.filter(e => e.id !== id)), 750);
  }, []);

  return (
    <CrackCtx.Provider value={trigger}>
      {children}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
        <AnimatePresence>
          {events.map(ev => (
            <motion.div
              key={ev.id}
              style={{ position: "absolute", inset: 0 }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              {/* Impact flash */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 5, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.2, 0, 0.4, 1] }}
                style={{
                  position: "absolute",
                  left: ev.x - 24,
                  top: ev.y - 24,
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(180,220,255,0.6) 45%, transparent 100%)",
                }}
              />
              {/* Cracks */}
              <svg
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
              >
                {ev.lines.map((line, i) => (
                  <motion.path
                    key={i}
                    d={line.d}
                    stroke="rgba(210,235,255,0.88)"
                    strokeWidth={line.width}
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 1, 1] }}
                    exit={{ opacity: 0 }}
                    transition={{
                      pathLength: { duration: 0.28, delay: line.delay, ease: "easeOut" },
                      opacity: { duration: 0.15, delay: line.delay },
                    }}
                  />
                ))}
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </CrackCtx.Provider>
  );
}

export function CrackLink({
  href,
  children,
  className,
  style,
  target,
  rel,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
}) {
  const crack = useCrack();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    let done = false;
    const navigate = () => {
      if (done) return;
      done = true;
      if (href.startsWith("#")) {
        const el = document.querySelector(href);
        if (el) {
          // Lenis ignora scrollTo() cuando se le pasa un elemento en este sitio,
          // así que se calcula la posición y se le pasa un número, que sí respeta.
          const top = el.getBoundingClientRect().top + window.scrollY;
          const lenis = (window as any).__lenis;
          if (lenis) {
            lenis.scrollTo(top);
          } else {
            window.scrollTo({ top, behavior: "smooth" });
          }
        }
      } else if (target === "_blank") {
        window.open(href, "_blank", rel || "noopener,noreferrer");
      } else {
        window.location.href = href;
      }
    };
    crack(e.clientX, e.clientY, navigate);
    // Fallback: navigate even if crack context is unavailable
    setTimeout(navigate, 600);
  };

  return (
    <a href={href} onClick={handleClick} className={className} style={style} target={target} rel={rel}>
      {children}
    </a>
  );
}
