// Reseñas del perfil de Google Business vía Places API (New).
//
// La clave se usa solo en el servidor: nunca se expone al navegador, y la
// respuesta se cachea un día para no pagar una llamada por visita.

export type GoogleReview = {
  author: string;
  photo?: string;
  rating: number;
  text: string;
  relativeTime: string;
};

export type GoogleReviews = {
  rating: number;
  total: number;
  mapsUri: string;
  reviews: GoogleReview[];
};

type PlacesResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: Array<{
    rating?: number;
    text?: { text?: string };
    originalText?: { text?: string };
    relativePublishTimeDescription?: string;
    authorAttribution?: { displayName?: string; photoUri?: string };
  }>;
};

export async function getGoogleReviews(): Promise<GoogleReviews | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;

  const fields = [
    "rating",
    "userRatingCount",
    "googleMapsUri",
    "reviews.rating",
    "reviews.text",
    "reviews.relativePublishTimeDescription",
    "reviews.authorAttribution",
  ].join(",");

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": fields },
        // Una llamada por día: las reseñas no cambian tan seguido.
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) {
      console.error("Places API:", res.status, await res.text());
      return null;
    }

    const data = (await res.json()) as PlacesResponse;
    const reviews = (data.reviews ?? [])
      // Google exige mostrar el texto sin alterarlo, así que solo se filtran vacías.
      .filter((r) => (r.text?.text ?? r.originalText?.text ?? "").trim().length > 0)
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google user",
        photo: r.authorAttribution?.photoUri,
        rating: r.rating ?? 5,
        text: (r.text?.text ?? r.originalText?.text ?? "").trim(),
        relativeTime: r.relativePublishTimeDescription ?? "",
      }));

    if (reviews.length === 0) return null;

    return {
      rating: data.rating ?? 0,
      total: data.userRatingCount ?? 0,
      mapsUri: data.googleMapsUri ?? "",
      reviews,
    };
  } catch (err) {
    console.error("Places API falló:", err);
    return null;
  }
}
