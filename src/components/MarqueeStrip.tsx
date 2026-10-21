"use client";

const items = [
  "Custom built",
  "SEO from day one",
  "Live in 4 weeks",
  "No templates. Ever.",
  "Built to convert",
  "Google page one",
  "Mobile-first",
  "Under 2s load time",
  "Zero cookie-cutter",
  "Ranked & found",
];

const dot = (
  <span
    className="inline-block w-1 h-1 rounded-full mx-6 shrink-0"
    style={{ background: "rgba(93,202,165,0.45)", verticalAlign: "middle" }}
  />
);

export default function MarqueeStrip() {
  const row = [...items, ...items, ...items];
  return (
    <div
      className="relative overflow-hidden py-4"
      style={{
        borderTop: "1px solid rgba(83,74,183,0.18)",
        borderBottom: "1px solid rgba(83,74,183,0.18)",
        background: "rgba(83,74,183,0.04)",
      }}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, var(--night), transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, var(--night), transparent)" }} />

      <div className="flex whitespace-nowrap marquee-track">
        {row.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span
              className="text-xs tracking-widest uppercase font-semibold"
              style={{ color: "rgba(175,169,236,0.7)" }}
            >
              {item}
            </span>
            {dot}
          </span>
        ))}
      </div>
    </div>
  );
}
