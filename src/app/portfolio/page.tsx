import PortfolioPage from "@/components/PortfolioPage";
import Cursor from "@/components/Cursor";
import Breadcrumbs from "@/components/Breadcrumbs";
import { graph, breadcrumbs, webPage } from "@/lib/schema";

export const metadata = {
  title: "Portfolio | The Icebreakerlab",
  alternates: { canonical: "/portfolio" },
  description: "Our work — websites that rank on Google and convert visitors into clients.",
};

export default function Portfolio() {
  return (
    <>
      <Cursor />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: graph([
            webPage("/portfolio", "Portfolio", "Our work — websites that rank on Google and convert visitors into clients."),
            breadcrumbs([{ name: "Home", path: "/" }, { name: "Portfolio", path: "/portfolio" }]),
          ]),
        }}
      />
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Portfolio", path: "/portfolio" }]} />
      <PortfolioPage />
    </>
  );
}
