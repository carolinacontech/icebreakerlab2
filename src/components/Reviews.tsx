import { getReviews } from "@/lib/reviews";

// Server Component: toma las reseñas en vivo si hay credenciales de Places
// API, y si no las copiadas a mano. Sin ninguna de las dos no renderiza nada.
export default async function Reviews() {
  const data = await getReviews();
  if (!data) return null;

  const stars = (n: number) => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));

  return (
    <section className="relative py-16 sm:py-24" style={{ background: "var(--night)" }}>
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(93,202,165,0.08) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6">
        <div className="text-center mb-10 sm:mb-14">
          <p className="section-eyebrow mb-4">What clients say</p>
          <h2 className="section-title mb-5">Reviewed on Google</h2>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-lg" style={{ color: "#F5B301", letterSpacing: "0.1em" }}>
              {stars(data.rating)}
            </span>
            <span className="text-sm" style={{ color: "var(--snow)" }}>
              {data.rating.toFixed(1)}
            </span>
            <span className="text-sm" style={{ color: "rgba(175,169,236,0.6)" }}>
              · {data.total} {data.total === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {data.reviews.slice(0, 3).map((r, i) => (
            <figure
              key={i}
              className="rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
              style={{
                background: "rgba(83,74,183,0.07)",
                border: "1px solid rgba(83,74,183,0.2)",
                backdropFilter: "blur(20px)",
              }}
            >
              <span className="text-sm" style={{ color: "#F5B301", letterSpacing: "0.08em" }}>
                {stars(r.rating)}
              </span>
              <blockquote
                className="text-sm leading-relaxed flex-1"
                style={{ color: "rgba(240,244,255,0.85)" }}
              >
                {r.text}
              </blockquote>
              <figcaption className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {r.photo && (
                  <img
                    src={r.photo}
                    alt=""
                    width={32}
                    height={32}
                    className="rounded-full shrink-0"
                    style={{ objectFit: "cover" }}
                  />
                )}
                <span>
                  <span className="block text-sm font-semibold" style={{ color: "var(--snow)" }}>
                    {r.author}
                  </span>
                  <span className="block text-xs" style={{ color: "rgba(175,169,236,0.55)" }}>
                    {r.relativeTime}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {data.mapsUri && (
          <div className="text-center mt-10">
            <a
              href={data.mapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline-offset-4 hover:underline"
              style={{ color: "var(--aurora-light)" }}
            >
              Read all reviews on Google →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
