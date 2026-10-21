"use client";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* CTA band */}
      <div className="relative py-24 px-6 overflow-hidden" style={{ background: "rgba(6,5,28,0.98)", borderTop: "1px solid rgba(83,74,183,0.18)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(83,74,183,0.18) 0%, transparent 70%)"
        }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase mb-5" style={{ color: "var(--aurora-teal)" }}>
            Ready to break the ice?
          </p>
          <h2
            className="font-bold leading-tight mb-6"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              color: "var(--snow)",
              letterSpacing: "-0.03em",
            }}
          >
            Let's build something<br />
            <span style={{
              background: "linear-gradient(135deg, #ffffff 0%, #afa9ec 55%, #5dcaa5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              people actually find.
            </span>
          </h2>
          <p className="text-sm mb-10 max-w-md mx-auto leading-relaxed" style={{ color: "rgba(175,169,236,0.65)" }}>
            A website that ranks on Google and converts visitors into clients.<br />
            No templates. No guesswork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Antes era mailto:hola@icebreakerlab.com, un dominio que no
                controlamos: esos correos no llegaban a nadie. */}
            <a
              href="/#contact"
              className="px-8 py-4 rounded-full font-semibold text-base transition-transform hover:scale-105"
              style={{ background: "var(--aurora)", color: "var(--snow)", boxShadow: "0 0 48px rgba(83,74,183,0.5)" }}
            >
              Start your project →
            </a>
            <a
              href="/portfolio"
              className="px-8 py-4 rounded-full font-semibold text-base transition-transform hover:scale-105"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(175,169,236,0.3)", color: "var(--aurora-light)" }}
            >
              See our work
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative px-6 py-8" style={{ background: "rgba(4,3,18,0.99)", borderTop: "1px solid rgba(83,74,183,0.1)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <Image src="/images/logo/logo.png" alt="The Icebreakerlab" width={40} height={30} className="object-contain" unoptimized />
          </div>
          <p className="text-xs" style={{ color: "var(--aurora-light)", opacity: 0.3 }}>
            © 2026 The Icebreakerlab · Websites that break the ice
          </p>
          <div className="flex gap-6">
            {/* Solo perfiles que existen. Instagram y Behance estaban como
                href="#": un enlace muerto en el footer de una agencia web
                resta más de lo que suma. Se reponen cuando haya URL real. */}
            {[
              { name: "LinkedIn", href: "https://www.linkedin.com/company/theicebreakerlab" },
              { name: "Google", href: "https://www.google.com/search?kgmid=/g/11zzxcy2k_" },
            ].map(({ name: s, href }) => (
              <a key={s} href={href} target="_blank" rel="noopener noreferrer" className="text-xs transition-all duration-200"
                style={{ color: "var(--aurora-light)", opacity: 0.4 }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = "1"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = "0.4"; }}>
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
