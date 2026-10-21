// Datos estructurados (docs/08).
//
// Regla que condiciona todo lo de acá: el marcado debe reflejar contenido
// VISIBLE en la página. Por eso las migas de pan se marcan solo en las páginas
// donde además se renderizan, y los precios del catálogo son los mismos que
// se muestran en /services.

export const SITE = "https://icebreakerlab.vercel.app";
export const ORG_ID = `${SITE}/#organization`;

// Perfiles externos de la marca. docs/10: `sameAs` es la señal más fuerte para
// que buscadores y motores de IA resuelvan QUIÉN responde, no solo qué se dijo.
const SAME_AS: string[] = [
  "https://www.linkedin.com/company/theicebreakerlab",
  // Entidad en el Knowledge Graph de Google (ficha de empresa)
  "https://www.google.com/search?kgmid=/g/11zzxcy2k_",
];

export const organization = {
  "@type": "ProfessionalService",
  "@id": ORG_ID,
  name: "The Icebreakerlab",
  alternateName: "Icebreaker Lab",
  description:
    "Web design agency specialized in SEO-optimized websites built to rank on Google and convert visitors into clients.",
  url: SITE,
  // Área de servicio: Estados Unidos.
  areaServed: { "@type": "Country", name: "United States" },
  // Sin `telephone` a propósito: la captación va por formulario y agenda,
  // no por llamada. Omitirlo es coherente; un teléfono que no se atiende
  // sería peor que no tenerlo.
  knowsLanguage: ["en", "es"],
  serviceType: ["Web Design", "SEO", "E-commerce Development", "Landing Pages"],
  priceRange: "$$",
  ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
};

export const website = {
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  url: SITE,
  name: "The Icebreakerlab",
  publisher: { "@id": ORG_ID, "@type": "ProfessionalService" },
  inLanguage: "en",
};

export function webPage(path: string, name: string, description: string) {
  return {
    "@type": "WebPage",
    "@id": `${SITE}${path}#webpage`,
    url: `${SITE}${path}`,
    name,
    description,
    isPartOf: { "@id": `${SITE}/#website`, "@type": "WebSite" },
    about: { "@id": ORG_ID, "@type": "ProfessionalService" },
    inLanguage: "en",
  };
}

// Solo para páginas que muestran migas de pan en pantalla.
export function breadcrumbs(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE}${t.path}`,
    })),
  };
}

// Cada entidad se emite como nodo propio con su @context y su @type. Un
// contenedor @graph deja un nodo raíz sin @type, que los validadores marcan.
export function graph(nodes: object[]) {
  return JSON.stringify(
    nodes.map((n) => ({ "@context": "https://schema.org", ...n }))
  );
}
