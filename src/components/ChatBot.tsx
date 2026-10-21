"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Reemplaza al botón de WhatsApp. Es un guion determinista, no un modelo:
// sin API, sin costo por conversación, sin exponer ningún teléfono, y
// responde igual de rápido con o sin conexión al backend.
//
// Su trabajo no es conversar: es calificar en tres toques y derivar al lugar
// correcto — agenda, brief o formulario.

const CALENDLY_URL = ""; // ← pendiente: al cargarlo aparece el botón de agendar

type Step = {
  id: string;
  bot: string;
  options: { label: string; next?: string; href?: string; calendly?: boolean }[];
};

const STEPS: Record<string, Step> = {
  start: {
    id: "start",
    bot: "Hi! I'm here to point you in the right direction. What brings you in?",
    options: [
      { label: "I need a new website", next: "new" },
      { label: "My site exists but doesn't bring clients", next: "fix" },
      { label: "I want to be found on Google", next: "seo" },
      { label: "Just looking around", next: "browse" },
    ],
  },
  new: {
    id: "new",
    bot: "Got it. Roughly how big is it?",
    options: [
      { label: "One page, one goal", next: "landing" },
      { label: "A few pages about my business", next: "corporate" },
      { label: "I need to sell online", next: "ecommerce" },
      { label: "Not sure yet", next: "unsure" },
    ],
  },
  landing: {
    id: "landing",
    bot: "That's our Landing Page package — one high-impact page built to convert, from $800. Want to see what's included or start your project?",
    options: [
      { label: "See what's included", href: "/services" },
      { label: "Start my project", href: "/frost" },
      { label: "Book a call", calendly: true },
    ],
  },
  corporate: {
    id: "corporate",
    bot: "Sounds like our Corporate Website package — 3 to 5 pages that tell your full story and rank on Google, from $1,800.",
    options: [
      { label: "See what's included", href: "/services" },
      { label: "Start my project", href: "/frost" },
      { label: "Book a call", calendly: true },
    ],
  },
  ecommerce: {
    id: "ecommerce",
    bot: "That's our E-commerce package — your store open 24/7, with payments and product management, from $2,500.",
    options: [
      { label: "See what's included", href: "/services" },
      { label: "Start my project", href: "/frost" },
      { label: "Book a call", calendly: true },
    ],
  },
  unsure: {
    id: "unsure",
    bot: "No problem — that's what the first call is for. We'll look at your business and tell you what you actually need, not what's most expensive.",
    options: [
      { label: "Book a call", calendly: true },
      { label: "Tell us about the project", href: "/frost" },
      { label: "See the packages first", href: "/services" },
    ],
  },
  fix: {
    id: "fix",
    bot: "That's usually one of two things: the site doesn't say what the business does, or Google can't find it. We rebuild for both.",
    options: [
      { label: "See how we work", href: "/services" },
      { label: "See our work", href: "/portfolio" },
      { label: "Book a call", calendly: true },
    ],
  },
  seo: {
    id: "seo",
    bot: "Search optimization is built into every site we deliver — it isn't sold separately. That covers Google, Maps and AI answers.",
    options: [
      { label: "How that works", href: "/services" },
      { label: "Book a call", calendly: true },
      { label: "Tell us about the project", href: "/frost" },
    ],
  },
  browse: {
    id: "browse",
    bot: "Take your time. If you want to see real work, the portfolio is the best place to start.",
    options: [
      { label: "See our work", href: "/portfolio" },
      { label: "See the packages", href: "/services" },
    ],
  },
};

type Msg = { from: "bot" | "user"; text: string };

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [stepId, setStepId] = useState("start");
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: STEPS.start.bot }]);
  const panelRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const step = STEPS[stepId];

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [msgs]);

  // Escape cierra; el foco entra al panel al abrirlo.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const choose = (opt: Step["options"][number]) => {
    setMsgs((m) => [...m, { from: "user", text: opt.label }]);
    if (opt.calendly) {
      if (CALENDLY_URL) window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
      else
        setMsgs((m) => [
          ...m,
          { from: "bot", text: "Booking opens soon — meanwhile, tell us about your project and we reply within 24 hours." },
        ]);
      return;
    }
    if (opt.href) {
      window.location.href = opt.href;
      return;
    }
    if (opt.next) {
      const nx = STEPS[opt.next];
      setStepId(nx.id);
      setTimeout(() => setMsgs((m) => [...m, { from: "bot", text: nx.bot }]), 320);
    }
  };

  const restart = () => {
    setStepId("start");
    setMsgs([{ from: "bot", text: STEPS.start.bot }]);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? "Close chat" : "Chat with us"}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="fixed z-[60] flex items-center justify-center rounded-full"
        style={{
          right: "24px",
          bottom: "24px",
          width: "56px",
          height: "56px",
          background: "var(--aurora)",
          boxShadow: "0 6px 28px rgba(83,74,183,0.5), 0 2px 8px rgba(0,0,0,0.35)",
          color: "var(--snow)",
        }}
      >
        {open ? (
          <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>×</span>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="chat-panel"
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-label="Chat"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="fixed z-[60] flex flex-col rounded-2xl overflow-hidden"
            style={{
              right: "24px",
              bottom: "92px",
              width: "min(360px, calc(100vw - 48px))",
              maxHeight: "min(70vh, 540px)",
              background: "rgba(10,13,31,0.98)",
              border: "1px solid rgba(83,74,183,0.35)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
              backdropFilter: "blur(20px)",
              transformOrigin: "bottom right",
            }}
          >
            <div
              className="px-5 py-4 flex items-center justify-between shrink-0"
              style={{ borderBottom: "1px solid rgba(83,74,183,0.25)" }}
            >
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--snow)" }}>
                  Break the ice
                </p>
                <p className="text-xs" style={{ color: "rgba(175,169,236,0.6)" }}>
                  Answers in 3 taps
                </p>
              </div>
              <button
                onClick={restart}
                className="text-xs px-3 py-1.5 rounded-full"
                style={{ color: "var(--aurora-light)", border: "1px solid rgba(83,74,183,0.35)" }}
              >
                Restart
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 flex flex-col gap-3" data-lenis-prevent>
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className="text-sm leading-relaxed rounded-2xl px-4 py-2.5"
                  style={
                    m.from === "bot"
                      ? { background: "rgba(83,74,183,0.16)", color: "rgba(240,244,255,0.92)", alignSelf: "flex-start", maxWidth: "88%" }
                      : { background: "var(--aurora)", color: "var(--snow)", alignSelf: "flex-end", maxWidth: "80%" }
                  }
                >
                  {m.text}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="px-5 pb-5 pt-1 flex flex-col gap-2 shrink-0">
              {step.options
                .filter((o) => !(o.calendly && !CALENDLY_URL))
                .map((o) => (
                  <button
                    key={o.label}
                    onClick={() => choose(o)}
                    className="text-sm text-left px-4 py-2.5 rounded-full transition-colors"
                    style={{
                      border: "1px solid rgba(83,74,183,0.4)",
                      color: "var(--aurora-light)",
                      background: "rgba(83,74,183,0.08)",
                    }}
                  >
                    {o.label}
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
