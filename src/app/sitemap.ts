import type { MetadataRoute } from "next";

const SITE = "https://icebreakerlab.vercel.app";

// Sin <priority> ni <changefreq>: Google los ignora (docs/06).
// `lastModified` solo debe reflejar cambios reales de contenido; usar la fecha
// de build en cada deploy lo vuelve una señal poco creíble, así que se fija a
// mano cuando el contenido cambia de verdad.
const LAST_CONTENT_UPDATE = new Date("2026-10-20");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, lastModified: LAST_CONTENT_UPDATE },
    { url: `${SITE}/services`, lastModified: LAST_CONTENT_UPDATE },
    { url: `${SITE}/portfolio`, lastModified: LAST_CONTENT_UPDATE },
    { url: `${SITE}/about`, lastModified: LAST_CONTENT_UPDATE },
  ];
}
