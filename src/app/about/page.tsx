import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CrackLink } from "@/components/IceCrack";
import { graph, breadcrumbs, webPage, organization } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About | The Icebreakerlab",
  alternates: { canonical: "/about" },
  description:
    "The Icebreakerlab is a web design agency for small and medium businesses. We build custom websites in English and Spanish, optimized to rank on Google from day one.",
};

const trail = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

// Cada bloque abre con una respuesta directa y autocontenida, para que pueda
// citarse fuera de contexto (docs/10).
const sections = [
  {
    q: "What The Icebreakerlab does",
    a: "The Icebreakerlab is a web design agency that builds custom websites for small and medium businesses, optimized for Google from day one.",
    body: "Every site is designed and written from scratch around what the business actually needs to say. No templates, no recycled layouts. Search optimization is part of the build, not a service sold separately afterwards.",
  },
  {
    q: "Who it is for",
    a: "We work with small and medium businesses that are good at what they do but hard to find online.",
    body: "Service companies, local businesses, professional practices and independent brands — the kind of business where the website is the first impression and often the only salesperson working at 2 a.m.",
  },
  {
    q: "Languages we work in",
    a: "We build and write in English and Spanish, so the site speaks the language the clients actually think in.",
    body: "This matters for search too: the same business often needs different wording to be found in each language, not a direct translation.",
  },
  {
    q: "Where we work",
    a: "We work remotely with clients across the United States.",
    body: "Projects run over video calls and shared documents, with a single point of contact from the first call to launch.",
  },
];

const facts = [
  { k: "Sites launched", v: "12+" },
  { k: "Custom builds", v: "100% — no templates" },
  { k: "First call to live site", v: "4 weeks" },
  { k: "Average load time", v: "Under 2 seconds" },
  { k: "Languages", v: "English and Spanish" },
];

export default function About() {
  return (
    <main>
      <Cursor />
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph([
            webPage("/about", "About The Icebreakerlab", metadata.description as string),
            organization,
            breadcrumbs(trail),
          ]),
        }}
      />
      <Breadcrumbs trail={trail} />

      <section className="py-16" style={{ background: "var(--night)" }}>
        <div className="max-w-3xl mx-auto px-6">
          <p className="section-eyebrow mb-4">About</p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "var(--snow)", textWrap: "balance" }}
          >
            We remove the barriers between great businesses and great websites.
          </h1>
          <p className="text-base leading-relaxed mb-14" style={{ color: "rgba(175,169,236,0.8)" }}>
            The Icebreakerlab was born from a simple truth: communication is the number one
            problem for businesses online. Great companies stay invisible because their
            website never says what they actually do. We break that ice.
          </p>

          {sections.map((s) => (
            <div key={s.q} className="mb-12">
              <h2 className="text-xl font-bold mb-3" style={{ color: "var(--snow)" }}>
                {s.q}
              </h2>
              <p className="text-base leading-relaxed mb-3" style={{ color: "var(--snow)" }}>
                {s.a}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(175,169,236,0.75)" }}>
                {s.body}
              </p>
            </div>
          ))}

          <h2 className="text-xl font-bold mb-5" style={{ color: "var(--snow)" }}>
            The short version
          </h2>
          {/* Tabla: los motores de IA extraen datos enumerables mejor que prosa */}
          <div className="overflow-x-auto mb-14">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <tbody>
                {facts.map((f) => (
                  <tr key={f.k} style={{ borderBottom: "1px solid rgba(83,74,183,0.2)" }}>
                    <th
                      scope="row"
                      className="text-left py-3 pr-6 font-medium"
                      style={{ color: "rgba(175,169,236,0.75)", width: "45%" }}
                    >
                      {f.k}
                    </th>
                    <td className="py-3 font-semibold" style={{ color: "var(--snow)" }}>
                      {f.v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CrackLink
            href="/#contact"
            className="inline-block px-8 py-4 rounded-full font-semibold"
            style={{
              background: "var(--aurora)",
              color: "var(--snow)",
              boxShadow: "0 0 40px rgba(83,74,183,0.45)",
            }}
          >
            Break the ice →
          </CrackLink>
        </div>
      </section>

      <Footer />
    </main>
  );
}
