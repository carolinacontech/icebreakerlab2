import { getGoogleReviews, type GoogleReviews } from "./googleReviews";

// Reseñas reales del perfil de Google, copiadas a mano.
//
// Se usan tal cual las dejó el cliente: no se editan ni se recortan, igual
// que exigiría la API. Para añadir una, copiá el texto y el nombre tal como
// aparecen en Google.
const MANUAL: GoogleReviews = {
  rating: 5,
  total: 0,
  mapsUri: "", // enlace al perfil de Google (opcional)
  reviews: [
    // {
    //   author: "Nombre tal como aparece en Google",
    //   rating: 5,
    //   text: "Texto de la reseña, sin modificar.",
    //   relativeTime: "hace 2 meses",
    // },
  ],
};

// Si hay credenciales de Places API usa las reseñas en vivo; si no, las
// manuales. Así se puede lanzar hoy y automatizar después sin tocar la vista.
export async function getReviews(): Promise<GoogleReviews | null> {
  const live = await getGoogleReviews();
  if (live) return live;
  if (MANUAL.reviews.length === 0) return null;
  return {
    ...MANUAL,
    total: MANUAL.total || MANUAL.reviews.length,
    rating:
      MANUAL.rating ||
      MANUAL.reviews.reduce((a, r) => a + r.rating, 0) / MANUAL.reviews.length,
  };
}
