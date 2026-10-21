import FrostPage from "@/components/FrostPage";

// Paso del embudo, no contenido para buscar. Se deja rastreable para que
// Google pueda leer este noindex; con Disallow la URL podría indexarse igual
// sin contenido, porque la enlazamos desde los paquetes (docs/13).
export const metadata = {
  robots: { index: false, follow: true },
  title: "Start your project — The Icebreakerlab",
  description: "Tell us about your project and we'll craft the perfect website for you.",
};

export default function Frost() {
  return <FrostPage />;
}
