"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useState, useRef } from "react";
import { useCrack } from "./IceCrack";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const crack = useCrack();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section id="contact" ref={ref} className="relative py-24 overflow-hidden">
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY, scale: 1.15 }}>
        <Image src="/images/textures/ice-macro.png" alt="Ice texture" fill className="object-cover object-center" quality={85} />
      </motion.div>
      <div className="absolute inset-0 z-[1]" style={{
        background: "linear-gradient(to bottom, rgba(10,13,31,0.92) 0%, rgba(38,33,92,0.75) 50%, rgba(10,13,31,0.92) 100%)"
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-14">
          <p className="section-eyebrow mb-4">Let's begin</p>
          <h2 className="section-title mb-4">Break the ice.</h2>
          <p className="text-lg" style={{ color: "var(--ice-blue)" }}>Tell us about your project. We respond within 24 hours.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Left column — what happens next */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="lg:col-span-2 flex flex-col gap-8">
            <div>
              <p className="text-xs tracking-widest uppercase mb-6" style={{ color: "rgba(175,169,236,0.5)" }}>What happens next</p>
              <div className="flex flex-col gap-6">
                {[
                  { step: "01", title: "You fill the form", body: "Tell us about your business and what you need." },
                  { step: "02", title: "We review your project", body: "We look at everything carefully and get back to you within 24 hours." },
                  { step: "03", title: "We send a proposal", body: "A clear proposal with scope, timeline, and investment." },
                  { step: "04", title: "We build your site", body: "You relax while we create something you'll be proud of." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 items-start">
                    <span className="text-xs font-bold shrink-0 mt-0.5" style={{ color: "var(--aurora-teal)" }}>{item.step}</span>
                    <div>
                      <p className="font-semibold text-sm mb-0.5" style={{ color: "var(--snow)" }}>{item.title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(175,169,236,0.7)" }}>{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-px" style={{ background: "rgba(83,74,183,0.2)" }} />
            <p className="text-sm leading-relaxed" style={{ color: "rgba(175,169,236,0.6)" }}>
              Not ready to fill a form? Use the chatbot below — Frost will guide you through everything at your own pace.
            </p>
          </motion.div>

          {/* Right column — form */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3 rounded-2xl p-8"
            style={{ background: "rgba(10,13,31,0.6)", border: "1px solid rgba(83,74,183,0.3)", backdropFilter: "blur(24px)" }}>
            {sent ? (
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mx-auto mb-6 flex items-center justify-center"
                  style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(93,202,165,0.15)", border: "1px solid rgba(93,202,165,0.3)" }}
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M6 16l7 7L26 9" stroke="#5DCAA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--snow)" }}>Ice broken!</h3>
                <p style={{ color: "var(--aurora-light)" }}>We got your message. We&rsquo;ll reach out within 24 hours.</p>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setError(null);
                  const fd = new FormData(e.currentTarget);
                  try {
                    const res = await fetch("/api/contact", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: fd.get("name"),
                        email: fd.get("email"),
                        service: fd.get("service"),
                        message: fd.get("message"),
                      }),
                    });
                    if (!res.ok) throw new Error("Failed to send");
                    setSent(true);
                  } catch {
                    setError("Something went wrong. Please try again or email us directly.");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="flex flex-col gap-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: "var(--aurora-light)" }}>Name</label>
                    <input name="name" type="text" required placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(83,74,183,0.3)", color: "var(--snow)" }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--aurora-light)")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(83,74,183,0.3)")} />
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: "var(--aurora-light)" }}>Email</label>
                    <input name="email" type="email" required placeholder="you@company.com"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(83,74,183,0.3)", color: "var(--snow)" }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--aurora-light)")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(83,74,183,0.3)")} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: "var(--aurora-light)" }}>What do you need?</label>
                  <select name="service"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300"
                    style={{ background: "rgba(10,13,31,0.8)", border: "1px solid rgba(83,74,183,0.3)", color: "var(--aurora-light)" }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--aurora-light)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(83,74,183,0.3)")}>
                    <option value="">Select a service</option>
                    <option>Landing Page</option>
                    <option>Corporate Website</option>
                    <option>E-commerce</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: "var(--aurora-light)" }}>Tell us about your project</label>
                  <textarea name="message" rows={4} required placeholder="Describe your business and what you need..."
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all duration-300"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(83,74,183,0.3)", color: "var(--snow)" }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--aurora-light)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(83,74,183,0.3)")} />
                </div>
                {error && (
                  <p className="text-sm text-center" style={{ color: "#ff6b6b" }}>{error}</p>
                )}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.03 }}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                  onClick={(e) => {
                    if (!loading) crack(e.clientX, e.clientY, () => {});
                  }}
                  className="w-full py-4 rounded-full font-semibold text-base"
                  style={{
                    background: "var(--aurora)",
                    color: "var(--snow)",
                    boxShadow: "0 0 40px rgba(83,74,183,0.4)",
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "none",
                  }}>
                  {loading ? "Sending…" : "Break the ice →"}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
