import type { MetadataRoute } from "next";

const SITE = "https://icebreakerlab.vercel.app";

// Postura explícita sobre crawlers de IA (docs/10).
//
// Decisión para este proyecto: la agencia vende visibilidad en buscadores y en
// respuestas de IA, así que el objetivo es MAXIMIZAR la citación, no proteger
// el contenido. Por eso se permiten tanto los agentes de recuperación (los que
// alimentan respuestas con cita) como los de entrenamiento.
//
// El tradeoff: el contenido del sitio puede usarse para entrenar modelos. Es
// copy comercial público, así que el costo es bajo frente al beneficio de
// aparecer citada.
//
// Un Disallow aquí tampoco es garantía: el cumplimiento de estos bots es
// voluntario e inconsistente (docs/10). Revisar esta lista cada trimestre:
// los user-agents cambian seguido.
const AI_RETRIEVAL = [
  "OAI-SearchBot",   // ChatGPT Search
  "ChatGPT-User",    // navegación a pedido del usuario
  "PerplexityBot",
  "Claude-SearchBot",
  "Claude-User",
];

const AI_TRAINING = [
  "GPTBot",
  "Google-Extended",
  "ClaudeBot",
  "CCBot",
  "anthropic-ai",
  "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /frost se deja rastreable a propósito: lleva `noindex` en la propia
        // página. Con Disallow, Google no puede leer ese noindex y la URL
        // puede acabar indexada igual, sin contenido (docs/13).
        disallow: ["/api/"],
      },
      // Se nombran explícitamente para que la postura quede documentada y no
      // dependa del comodín.
      { userAgent: AI_RETRIEVAL, allow: "/", disallow: ["/api/"] },
      { userAgent: AI_TRAINING, allow: "/", disallow: ["/api/"] },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
