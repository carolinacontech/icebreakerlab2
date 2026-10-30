import { Instrument_Serif } from "next/font/google";
import Navbar from "@/components/Navbar";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import IceCaveScroll from "@/components/IceCaveScroll";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

// Vista previa de la escena antes de decidir dónde vive en el sitio: no se
// indexa ni entra en el sitemap.
export const metadata = {
  robots: { index: false, follow: false },
  title: "Ice cave preview — The Icebreakerlab",
};

export default function IceCavePreview() {
  return (
    <main className={instrumentSerif.variable}>
      <Cursor />
      <Navbar />
      <IceCaveScroll />
      <Footer />
    </main>
  );
}
