import Navbar from "@/components/Navbar";
import HybridHero from "@/components/HybridHero";
import MarqueeStrip from "@/components/MarqueeStrip";
import StatsStrip from "@/components/StatsStrip";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import Reviews from "@/components/Reviews";
import { graph, organization, website, webPage } from "@/lib/schema";

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph([
            website,
            organization,
            webPage("/", "The Icebreakerlab", "Websites that rank on Google and convert visitors into clients."),
          ]),
        }}
      />
      <Cursor />
      <Navbar />
      <HybridHero />
      <MarqueeStrip />
      <StatsStrip />
      <Services />
      <Portfolio />
      <Reviews />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
