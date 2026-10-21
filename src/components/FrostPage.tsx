"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Particle = { width: number; height: number; left: string; top: string; color: string; duration: number; delay: number };
type Message = { role: "assistant" | "user"; text: string };

const PHASES = [
  { label: "About you", icon: "👤" },
  { label: "The website", icon: "🌐" },
  { label: "Style & vision", icon: "🎨" },
  { label: "Your business", icon: "🏢" },
  { label: "Project details", icon: "📋" },
];

const QUESTIONS = [
  // Phase 0 — About you
  { phase: 0, key: "name", text: "Hi! I'm Frost, your project guide at The Icebreakerlab 🧊\n\nI'll walk you through a few questions so our team can build the perfect website for your business. Ready? Let's start — what's your name?" },
  { phase: 0, key: "business_name", text: (a: Record<string,string>) => `Great to meet you, ${a.name}! 👋\n\nWhat's the name of your business or project?` },
  { phase: 0, key: "business_description", text: (a: Record<string,string>) => `Love it — ${a.business_name}! ✨\n\nIn a few sentences, tell me what ${a.business_name} does. What do you offer and who do you help?` },
  { phase: 0, key: "target_audience", text: "Who are your ideal customers? Tell me about them — industry, location, age range, or the type of problem they come to you to solve." },

  // Phase 1 — The website
  { phase: 1, key: "website_type", text: "Now let's talk about the website itself.\n\nWhat type do you need?\n→ Landing page (single page, one focused goal)\n→ Full website (multiple pages)\n→ E-commerce (online store)\n→ Portfolio\n→ Something else — describe it!" },
  { phase: 1, key: "website_goal", text: "What's the #1 goal of the website? What do you want visitors to do when they arrive?\n\n(e.g. call you, fill out a form, buy a product, book a consultation...)" },
  { phase: 1, key: "pages", text: "How many pages do you think you'll need? Even a rough idea helps.\n\n(e.g. Home, About, Services, Contact — or just one powerful landing page)" },
  { phase: 1, key: "features", text: "What features do you need? Mention everything that comes to mind:\n→ Contact form\n→ Online booking / calendar\n→ Online store / payments\n→ Blog or news section\n→ Photo or video gallery\n→ Live chat\n→ Multilingual\n→ Other?" },

  // Phase 2 — Style & vision
  { phase: 2, key: "inspiration_sites", text: "Now the fun part 🎨\n\nShare 2–3 websites you love the look or feel of — yours or from any industry. What specifically do you like about them?" },
  { phase: 2, key: "vibe", text: "How would you describe the vibe you want for your site?\n\nExamples: Modern & minimal / Bold & creative / Corporate & professional / Warm & approachable / Luxury & premium / Dark & dramatic\n\nOr describe it in your own words!" },
  { phase: 2, key: "colors", text: "Do you have brand colors? Share the hex codes or describe them.\n\nIf you don't have any yet — what colors feel right for your brand?" },
  { phase: 2, key: "imagery", text: "What kind of visuals fit your brand?\n\nReal photography, illustrations, icons, video backgrounds, 3D? Light or dark aesthetic? Do you have existing photos or will you need them sourced?" },
  { phase: 2, key: "logo", text: "Do you already have a logo and brand identity?\n\nIf yes — great, we'll work with it. If not — would you like us to create one as part of the project?\n\nFeel free to attach your logo files using the button below 👇" },

  // Phase 3 — Your business
  { phase: 3, key: "services_list", text: "Let's dig into what you actually offer. 🏢\n\nList each of your services or products, one by one. For each one, tell me:\n→ The name of the service\n→ A brief description\n→ The price or price range (if applicable)\n\nTake your time — the more detail, the better we can present them on your site." },
  { phase: 3, key: "client_process", text: "Walk me through your process for taking on a new client — from first contact to completed job.\n\nFor example:\n→ How does a client first reach out to you?\n→ Do you offer a free consultation or estimate, or is there a fee?\n→ What happens after they agree to work with you?\n→ How do you deliver the final result?\n\nThis helps us design a site that sets the right expectations and builds trust from the start." },
  { phase: 3, key: "differentiators", text: "What makes you different from your competitors?\n\nWhy do clients choose you over others? What do you do better, faster, or differently?" },
  { phase: 3, key: "contact_email", text: "Almost there! Let's make sure clients can easily reach you. 📬\n\nWhat's the best email address for people to contact you?" },
  { phase: 3, key: "contact_phone", text: "And your phone number? (Include area code or country code if international)" },
  { phase: 3, key: "contact_social", text: "Do you have any social media profiles you'd like linked on the site?\n\n(e.g. Instagram @handle, Facebook page, LinkedIn, TikTok...)\n\nList as many as you'd like!" },

  // Phase 4 — Project details
  { phase: 4, key: "content", text: "For the website content — do you have the copy (text) written, or will you need help writing it?\n\nAnd do you have professional photos, or will we need to source or create them?" },
  { phase: 4, key: "domain", text: "Do you have a domain name already? (e.g. yourbusiness.com)\n\nAnd do you have hosting set up, or will you need that too?" },
  { phase: 4, key: "competitors", text: "Who are your main competitors online? Drop their website URLs if you can.\n\nThis helps us make sure your site stands out in your market." },
  { phase: 4, key: "timeline", text: "What's your ideal timeline for launch?\n\n→ ASAP (rush project)\n→ 1 month\n→ 2–3 months\n→ No hard deadline — quality over speed" },
  { phase: 4, key: "extra", text: (a: Record<string,string>) => `${a.name}, you've been awesome to work with! 🧊✨\n\nAnything else you'd like The Icebreakerlab team to know? Any specific requests, non-negotiables, or things that didn't come up?\n\n(Or just say 'all good' and we're almost done!)` },
  { phase: 4, key: "reference_files", text: "Last thing! 📎\n\nDo you have any reference images, inspiration screenshots, mockups, or files you'd like to share with our team?\n\nUse the upload button below to attach them — or just say 'no' and we're done!" },
];

function buildSummary(answers: Record<string, string>): string {
  return `MARKET OPEN MEDIA — NEW PROJECT INQUIRY
========================================

👤 ABOUT THE CLIENT
Name: ${answers.name || "—"}
Business: ${answers.business_name || "—"}
Description: ${answers.business_description || "—"}
Target audience: ${answers.target_audience || "—"}

🌐 THE WEBSITE
Type: ${answers.website_type || "—"}
Main goal: ${answers.website_goal || "—"}
Pages needed: ${answers.pages || "—"}
Features: ${answers.features || "—"}

🎨 STYLE & VISION
Inspiration websites: ${answers.inspiration_sites || "—"}
Vibe: ${answers.vibe || "—"}
Colors: ${answers.colors || "—"}
Imagery: ${answers.imagery || "—"}
Logo/Brand: ${answers.logo || "—"}

🏢 THEIR BUSINESS
Services & pricing: ${answers.services_list || "—"}
Client process: ${answers.client_process || "—"}
What makes them different: ${answers.differentiators || "—"}

📬 CONTACT INFO
Email: ${answers.contact_email || "—"}
Phone: ${answers.contact_phone || "—"}
Social media: ${answers.contact_social || "—"}

📋 PROJECT DETAILS
Content/Copy: ${answers.content || "—"}
Domain/Hosting: ${answers.domain || "—"}
Competitors: ${answers.competitors || "—"}
Timeline: ${answers.timeline || "—"}
Extra notes: ${answers.extra || "—"}
Reference files: ${answers.reference_files || "—"}

========================================
Sent via The Icebreakerlab — Frost intake page`.trim();
}

const UPLOAD_KEYS = ["logo", "reference_files"];

export default function FrostPage() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ label: string; file: File }[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentQ = QUESTIONS[step];
  const currentPhase = currentQ?.phase ?? 4;
  const progress = Math.round((step / QUESTIONS.length) * 100);

  const uploadHint = currentQ?.key === "logo"
    ? "You can attach your logo or brand files here"
    : "Attach any reference images, screenshots or files here";

  useEffect(() => {
    setParticles(Array.from({ length: 12 }, (_, i) => ({
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      color: i % 3 === 0 ? "var(--aurora-teal)" : "var(--aurora-light)",
      duration: 4 + Math.random() * 4,
      delay: Math.random() * 4,
    })));
    setTimeout(() => {
      const firstQ = QUESTIONS[0];
      setMessages([{ role: "assistant", text: typeof firstQ.text === "function" ? firstQ.text({}) : firstQ.text }]);
    }, 600);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [step]);

  const sendAnswer = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newAnswers = { ...answers, [currentQ.key]: trimmed };
    setAnswers(newAnswers);
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");

    const nextStep = step + 1;
    if (nextStep >= QUESTIONS.length) {
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          role: "assistant",
          text: `That's everything I need! 🧊✨\n\nI've put together a full brief for The Icebreakerlab team. They'll review it and reach out to you shortly.\n\nClick below to send your brief — or copy it to keep a record.`,
        }]);
        setDone(true);
      }, 500);
    } else {
      setTimeout(() => {
        const nextQ = QUESTIONS[nextStep];
        const text = typeof nextQ.text === "function" ? nextQ.text(newAnswers) : nextQ.text;
        setMessages((prev) => [...prev, { role: "assistant", text }]);
        setStep(nextStep);
      }, 500);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = currentQ?.key === "logo" ? "Logo" : "Reference image";
    const files = Array.from(e.target.files || []).map(file => ({ label, file }));
    setUploadedFiles(prev => [...prev, ...files]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    setSending(true);
    setSendError(false);
    const fd = new FormData();
    fd.append("summary", buildSummary(answers));
    fd.append("businessName", answers.business_name || "");
    uploadedFiles.forEach(({ file }) => fd.append("files", file));
    try {
      const res = await fetch("/api/send", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildSummary(answers));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--night)" }}>

      {/* Salida al sitio: esta página se abre desde los paquetes, y sin esto
          quien se arrepiente queda sin forma de volver. */}
      <a href="/" aria-label="Back to The Icebreakerlab"
        className="absolute z-30 flex items-center gap-2 text-xs transition-opacity hover:opacity-100"
        style={{ top: "24px", left: "24px", color: "var(--aurora-light)", opacity: 0.6 }}>
        ← Back to site
      </a>

      {/* Background layers */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/textures/ice-macro.png" alt="" fill className="object-cover opacity-10" />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(83,74,183,0.18) 0%, transparent 70%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 60% 40% at 20% 80%, rgba(93,202,165,0.08) 0%, transparent 60%)",
        }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{ width: p.width, height: p.height, left: p.left, top: p.top, background: p.color, opacity: 0.3 }}
            animate={{ y: [-20, 20, -20], opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Chat container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col w-full"
        style={{ maxWidth: 560, height: "100vh", maxHeight: 800, margin: "0 auto" }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-8 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <motion.div className="w-10 h-10 rounded-full overflow-hidden shrink-0"
              style={{ border: "1.5px solid rgba(175,169,236,0.4)", boxShadow: "0 0 20px rgba(83,74,183,0.4)" }}
              animate={{ boxShadow: ["0 0 20px rgba(83,74,183,0.3)", "0 0 35px rgba(83,74,183,0.6)", "0 0 20px rgba(83,74,183,0.3)"] }}
              transition={{ duration: 3, repeat: Infinity }}>
              <Image src="/images/frost-avatar.png" alt="Frost" width={40} height={40} className="object-cover" />
            </motion.div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "var(--snow)" }}>Frost</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--aurora-teal)" }} />
                <p className="text-xs" style={{ color: "var(--aurora-teal)" }}>Online · The Icebreakerlab</p>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5">
            {PHASES.map((_, i) => (
              <motion.div key={i} className="h-1.5 rounded-full transition-all duration-500"
                style={{ width: i === currentPhase ? 20 : 6, background: i <= currentPhase ? "var(--aurora)" : "rgba(83,74,183,0.2)" }} />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-6 pb-4 shrink-0">
          <div className="w-full h-px rounded-full" style={{ background: "rgba(83,74,183,0.15)" }}>
            <motion.div className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, var(--aurora), var(--aurora-teal))" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs" style={{ color: "rgba(175,169,236,0.4)" }}>{PHASES[currentPhase]?.icon} {PHASES[currentPhase]?.label}</span>
            <span className="text-xs" style={{ color: "rgba(175,169,236,0.4)" }}>{progress}%</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-2 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={`flex items-end gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mb-0.5"
                    style={{ border: "1px solid rgba(175,169,236,0.3)" }}>
                    <Image src="/images/frost-avatar.png" alt="Frost" width={28} height={28} className="object-cover" />
                  </div>
                )}
                <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line"
                  style={{
                    maxWidth: "78%",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    display: "inline-block",
                    ...(m.role === "assistant"
                      ? { background: "rgba(83,74,183,0.14)", color: "var(--snow)", border: "1px solid rgba(83,74,183,0.22)", borderBottomLeftRadius: 4 }
                      : { background: "linear-gradient(135deg, var(--aurora), #6B5CE7)", color: "var(--snow)", borderBottomRightRadius: 4, boxShadow: "0 4px 20px rgba(83,74,183,0.3)" }),
                  }}>
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Input / Done */}
        <div className="px-6 pb-8 pt-4 shrink-0">
          {done ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
              {sent ? (
                <div className="w-full py-3.5 rounded-full font-semibold text-sm text-center"
                  style={{ background: "rgba(93,202,165,0.15)", color: "var(--aurora-teal)", border: "1px solid rgba(93,202,165,0.4)" }}>
                  ✓ Brief sent! We'll be in touch soon.
                </div>
              ) : (
                <motion.button onClick={handleSend} disabled={sending} whileHover={{ scale: sending ? 1 : 1.02 }} whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-full font-semibold text-sm text-center"
                  style={{ background: "linear-gradient(135deg, var(--aurora), #6B5CE7)", color: "var(--snow)", boxShadow: "0 0 40px rgba(83,74,183,0.45)", opacity: sending ? 0.7 : 1 }}>
                  {sending ? "⏳ Sending..." : "📨 Send my brief to The Icebreakerlab"}
                </motion.button>
              )}
              {sendError && (
                <p className="text-xs text-center" style={{ color: "#f87171" }}>
                  Something went wrong. Please copy your brief and email us directly.
                </p>
              )}
              <button onClick={handleCopy}
                className="w-full py-3.5 rounded-full font-semibold text-sm text-center transition-all"
                style={{ background: "rgba(83,74,183,0.12)", color: copied ? "var(--aurora-teal)" : "var(--aurora-light)", border: `1px solid ${copied ? "rgba(93,202,165,0.4)" : "rgba(83,74,183,0.25)"}` }}>
                {copied ? "✓ Copied!" : "📋 Copy brief to clipboard"}
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2">
              {/* File upload for logo and reference_files questions */}
              {UPLOAD_KEYS.includes(currentQ?.key) && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs px-1" style={{ color: "rgba(175,169,236,0.5)" }}>{uploadHint}</p>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {uploadedFiles
                      .filter(f => f.label === (currentQ?.key === "logo" ? "Logo" : "Reference image"))
                      .map((f) => (
                        <div key={f.file.name} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                          style={{ background: "rgba(83,74,183,0.18)", color: "var(--aurora-light)", border: "1px solid rgba(83,74,183,0.3)", maxWidth: 160, overflow: "hidden" }}>
                          <span className="truncate">{f.file.name}</span>
                          <button onClick={() => removeFile(uploadedFiles.indexOf(f))}
                            className="shrink-0 ml-0.5 opacity-60 hover:opacity-100" style={{ fontSize: 14, lineHeight: 1 }}>×</button>
                        </div>
                      ))}
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer text-xs font-medium transition-all hover:opacity-80"
                      style={{ background: "rgba(83,74,183,0.12)", color: "var(--aurora-light)", border: "1px solid rgba(83,74,183,0.25)" }}>
                      <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.ai,.svg,.eps,.png,.jpg,.jpeg,.webp" className="hidden"
                        onChange={handleFileChange} />
                      📎 Attach files (optional)
                    </label>
                  </div>
                </div>
              )}
              <div className="flex gap-2 items-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(83,74,183,0.25)", borderRadius: 99, padding: "6px 6px 6px 18px", backdropFilter: "blur(12px)" }}>
                <input ref={inputRef} value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAnswer(); } }}
                  placeholder="Type your answer..."
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "var(--snow)" }} />
                <motion.button onClick={sendAnswer} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                  style={{ background: input.trim() ? "linear-gradient(135deg, var(--aurora), #6B5CE7)" : "rgba(83,74,183,0.2)", color: "var(--snow)", transition: "background 0.2s", boxShadow: input.trim() ? "0 0 20px rgba(83,74,183,0.4)" : "none" }}>
                  →
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
