import Link from "next/link";

// Migas visibles. Existen por dos razones: orientan al visitante que llega
// desde Google a una página interna, y son el contenido visible que respalda
// el BreadcrumbList del JSON-LD (docs/08: el marcado debe reflejar lo que se ve).
export default function Breadcrumbs({
  trail,
}: {
  trail: { name: string; path: string }[];
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="max-w-7xl mx-auto px-6 pt-28 pb-2"
      style={{ position: "relative", zIndex: 20 }}
    >
      <ol className="flex items-center gap-2 text-xs flex-wrap">
        {trail.map((t, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={t.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" style={{ color: "var(--aurora-light)" }}>
                  {t.name}
                </span>
              ) : (
                <>
                  <Link
                    href={t.path}
                    className="transition-opacity hover:opacity-100"
                    style={{ color: "rgba(175,169,236,0.65)" }}
                  >
                    {t.name}
                  </Link>
                  <span aria-hidden="true" style={{ color: "rgba(175,169,236,0.35)" }}>
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
