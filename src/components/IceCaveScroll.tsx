"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BurnTransition,
  DepthRenderer,
  FrameSequence,
  PixelBlur,
  clamp,
  lerp,
  phaseState,
  type Phase,
} from "./ice-cave/engine";
import { ANCHORS } from "./ice-cave/anchors";
import { FRAME_COUNT } from "./ice-cave/frames";
import PhoneShowcase from "./ice-cave/PhoneShowcase";
import "./ice-cave/ice-cave.css";

// Recorrido de una cueva de hielo controlado por scroll: secuencia de
// fotogramas con paralaje por profundidad y bloques de texto que entran y
// salen en tramos fijos del progreso (0 → 1).
const SCROLL_LENGTH_VH = 380;
const SCROLL_SMOOTHING = 0.09;
const LOADER_MIN_MS = 1500;
// El celular reemplaza al logo de la plantilla: mide PHONE_TO_ANCHOR veces el
// alto que tenía el logo, sin pasar de una fracción del alto de la pantalla.
const PHONE_TO_ANCHOR = 1.35;
// De lejos se ve 15% más chico; la reducción se desvanece hasta el tamaño final.
const PHONE_FAR_FACTOR = 0.85;
const ANCHOR_HEIGHTS = ANCHORS.map((a) => a[2]);
const ANCHOR_MIN = Math.min(...ANCHOR_HEIGHTS);
const ANCHOR_MAX = Math.max(...ANCHOR_HEIGHTS);
const PHONE_MAX_VH = { wide: 0.56, narrow: 0.44 };
// Desde aquí giraba el logo en el video original: ahí empieza a girar el celular.
const SPIN_FROM_FRAME = 100;
// Alto de la carcasa en CSS a escala 1 (ver .ic-phone-shell).
const PHONE_BASE_HEIGHT = 530;

const PHASES: Record<"hero" | "mid" | "cards" | "final", Phase> = {
  hero: { exit: [0.16, 0.28] },
  mid: { enter: [0.38, 0.46], exit: [0.58, 0.68] },
  cards: { enter: [0.76, 0.84] },
  final: { enter: [0.82, 0.9] },
};

function Title({ line, italicLine, as: Tag = "h2" }: { line: string; italicLine: string; as?: "h1" | "h2" }) {
  const first = line.split(" ");
  const second = italicLine.split(" ");
  const words = (list: string[], offset: number) =>
    list.map((w, i) => (
      <span key={i} className="ic-word" style={{ "--word-index": i + offset } as React.CSSProperties}>
        {w}
        {i < list.length - 1 ? " " : ""}
      </span>
    ));
  return (
    <Tag className="ic-title">
      <span className="ic-title-line">{words(first, 0)}</span>
      <span className="ic-title-line ic-italic">{words(second, first.length)}</span>
    </Tag>
  );
}

function Card({ side, title, text }: { side: "left" | "right"; title: string; text: string }) {
  return (
    <article className={`ic-card ${side}`}>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export default function IceCaveScroll() {
  const sceneRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burnRef = useRef<HTMLCanvasElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardBlursRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [loader, setLoader] = useState<"loading" | "burning" | "done" | "error">("loading");
  const [introReady, setIntroReady] = useState(false);
  const [phoneSpinning, setPhoneSpinning] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current!;
    const canvas = canvasRef.current!;
    const sequence = new FrameSequence();
    let renderer: DepthRenderer;
    try {
      renderer = new DepthRenderer(canvas, sequence);
    } catch {
      // Sin WebGL no hay escena; el aviso se agenda fuera del cuerpo del efecto.
      const id = requestAnimationFrame(() => setLoader("error"));
      return () => cancelAnimationFrame(id);
    }
    const blur = new PixelBlur(canvas, scene);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let cancelled = false;
    let target = 0;
    let progress = 0;
    let spinning = false;

    // Se mide en cada frame en vez de escuchar `scroll`: Lenis mueve la página
    // sin que el evento llegue siempre a tiempo.
    const measure = () => {
      const travel = scene.offsetHeight - window.innerHeight;
      target = clamp(-scene.getBoundingClientRect().top / Math.max(1, travel));
    };

    const applyPhase = (el: HTMLElement | null, phase: Phase, reveal: boolean, translate = true) => {
      if (!el) return;
      const s = phaseState(progress, phase);
      el.style.opacity = String(s.opacity);
      if (translate) el.style.transform = `translate3d(0,${s.y}px,0)`;
      el.style.visibility = s.visible ? "visible" : "hidden";
      if (!reveal || !phase.enter) return;
      const t = clamp((progress - phase.enter[0]) / (phase.enter[1] - phase.enter[0]));
      const words = el.querySelectorAll<HTMLElement>(".ic-word");
      words.forEach((w, i) => {
        const delay = (i / Math.max(words.length, 1)) * 0.58;
        w.style.setProperty("--reveal", String(clamp((t - delay) / 0.34)));
      });
      el.querySelector<HTMLElement>(".ic-copy")?.style.setProperty("--detail-reveal", String(clamp((t - 0.62) / 0.38)));
    };

    // El celular sigue la cámara: se ancla donde estaba el logo en el fotograma
    // que está en pantalla, con el mismo paralaje que la pared del fondo.
    const placePhone = () => {
      const el = phoneRef.current;
      const shown = renderer.frame;
      if (!el || shown < 0) return;
      const [ax, ay, ah] = ANCHORS[shown];
      const p = renderer.project(ax, ay, 0);
      const maxVh = window.innerWidth <= 900 ? PHONE_MAX_VH.narrow : PHONE_MAX_VH.wide;
      const near = clamp((ah - ANCHOR_MIN) / (ANCHOR_MAX - ANCHOR_MIN));
      const factor = PHONE_TO_ANCHOR * lerp(PHONE_FAR_FACTOR, 1, near);
      const height = Math.min(ah * p.scale * factor, window.innerHeight * maxVh);
      const scale = height / PHONE_BASE_HEIGHT;
      el.style.transform = `translate3d(${p.x}px,${p.y}px,0) translate(-50%,-50%) scale(${scale})`;
      // De lejos es solo un brillo: el pie de foto y el clic llegan al acercarse.
      el.style.setProperty("--near", String(clamp((scale - 0.45) / 0.25)));
      // Solo se avisa a React al cruzar el umbral, no en cada frame.
      if (shown >= SPIN_FROM_FRAME !== spinning) {
        spinning = shown >= SPIN_FROM_FRAME;
        setPhoneSpinning(spinning);
      }
    };

    const loop = () => {
      measure();
      progress = lerp(progress, target, reducedMotion ? 1 : SCROLL_SMOOTHING);
      const frame = Math.round(progress * (FRAME_COUNT - 1));
      sequence.load(frame).catch(() => {});
      renderer.render(frame);
      applyPhase(heroRef.current, PHASES.hero, false);
      applyPhase(midRef.current, PHASES.mid, true);
      applyPhase(cardBlursRef.current, PHASES.cards, false, false);
      applyPhase(cardsRef.current, PHASES.cards, false);
      applyPhase(finalRef.current, PHASES.final, true);
      placePhone();
      blur.render();
      raf = requestAnimationFrame(loop);
    };

    const onResize = () => renderer.resize();
    const onPointerMove = (e: PointerEvent) =>
      renderer.setPointer((e.clientX / window.innerWidth - 0.5) * 2, (0.5 - e.clientY / window.innerHeight) * 2);
    const onPointerLeave = () => renderer.setPointer(0, 0);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    const intro = async () => {
      const start = performance.now();
      let ready = false;
      const firstFrame = sequence.start().then(() => {
        ready = true;
        renderer.resize();
        renderer.render(0);
      });

      // El contador no pasa de 99 hasta que el primer fotograma está listo.
      await new Promise<void>((resolve) => {
        const tick = (now: number) => {
          if (cancelled) return resolve();
          const elapsed = now - start;
          const pct = Math.floor(Math.min(elapsed / LOADER_MIN_MS, ready ? 1 : 0.99) * 100);
          if (counterRef.current) counterRef.current.textContent = String(pct);
          if (barRef.current) barRef.current.style.transform = `scaleX(${pct / 100})`;
          if (elapsed >= LOADER_MIN_MS && ready) return resolve();
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      await firstFrame;
      if (cancelled) return;

      setLoader("burning");
      let burn: Promise<void> = Promise.resolve();
      try {
        if (!reducedMotion && burnRef.current) burn = new BurnTransition(burnRef.current).play(1150);
      } catch {
        // Sin WebGL para la transición: el loader simplemente desaparece.
      }
      await new Promise((r) => setTimeout(r, reducedMotion ? 0 : 760));
      if (cancelled) return;
      setIntroReady(true);
      await burn;
      if (cancelled) return;
      setLoader("done");
      measure();
      progress = target;
      loop();
    };

    intro().catch(() => !cancelled && setLoader("error"));

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      sequence.stop();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <section
      ref={sceneRef}
      className={`ic-scene${introReady ? " ic-intro-ready" : ""}`}
      style={{ height: `${SCROLL_LENGTH_VH}vh` }}
      aria-label="Breaking through the ice"
    >
      <div className="ic-stage">
        <canvas ref={canvasRef} className="ic-sequence" aria-hidden="true" />
        <div className="ic-shade" />

        <div ref={cardBlursRef} className="ic-card-blurs" aria-hidden="true">
          <div className="ic-card-blur left">
            <canvas className="ic-pixel-blur" data-blur="24" />
          </div>
          <div className="ic-card-blur right">
            <canvas className="ic-pixel-blur" data-blur="24" />
          </div>
        </div>

        <div className="ic-content">
          <div ref={heroRef} className="ic-state ic-hero">
            <Title as="h1" line="Break the ice." italicLine="Get found on Google." />
            <div className="ic-copy">
              <p>We build websites that rank on Google and turn cold visitors into warm clients.</p>
              <Link className="ic-cta" href="/frost">
                Start your project
              </Link>
            </div>
          </div>

          <div ref={midRef} className="ic-state ic-mid">
            <Title line="Cold traffic." italicLine="Warm leads." />
            <div className="ic-copy">
              <p>From invisible to unmissable: design, speed and SEO working as one system.</p>
            </div>
          </div>

          <PhoneShowcase ref={phoneRef} spinning={introReady && phoneSpinning} />

          <div ref={cardsRef} className="ic-cards">
            <Card side="left" title="SEO" text="Websites built to rank from day one, with technical SEO baked into every page." />
            <Card side="right" title="Conversion" text="Landing pages designed around one goal: turning visitors into clients." />
          </div>

          <div ref={finalRef} className="ic-state ic-final">
            <Title line="Built to" italicLine="break the ice." />
            <div className="ic-copy">
              <p>One website, designed from the core outward to rank and convert.</p>
            </div>
          </div>
        </div>

        {loader !== "done" && (
          <div className={`ic-loader ic-loader--${loader}`} role="status" aria-live="polite">
            <canvas ref={burnRef} className="ic-burn" />
            <div className="ic-loader-ui">
              {loader === "error" ? (
                <p className="ic-loader-error">Unable to load the scene.</p>
              ) : (
                <>
                  <div className="ic-counter">
                    <span ref={counterRef}>0</span>%
                  </div>
                  <div className="ic-track">
                    <div ref={barRef} className="ic-bar" />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
