import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import ServicesPage from "@/components/ServicesPage";
import Breadcrumbs from "@/components/Breadcrumbs";
import { graph, breadcrumbs, webPage } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Services | The Icebreakerlab",
  alternates: { canonical: "/services" },
  description: "Websites built to transmit your brand's voice — and optimized to rank on Google, dominate local search, and get cited by AI.",
};

export default function Services() {
  return (
    <main>
      <Cursor />
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph([
            webPage("/services", "Services", "Websites built to transmit your brand's voice and optimized to rank on Google."),
            breadcrumbs([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]),
          ]),
        }}
      />
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]} />
      <ServicesPage />
      <Footer />
    </main>
  );
}
