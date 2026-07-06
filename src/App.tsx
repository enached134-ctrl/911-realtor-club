import { SmoothScroll } from "./lib/site-motion";
import { Nav } from "./components/site/nav";
import { Hero } from "./components/site/hero";
import { StatsBar } from "./components/site/stats-bar";
import { Benefits } from "./components/site/benefits";
import { Neighborhood } from "./components/site/neighborhood";
import { Community } from "./components/site/community";
import { Testimonials } from "./components/site/testimonials";
import { Faq } from "./components/site/faq";
import { BottomCta } from "./components/site/bottom-cta";
import { TrustFooter } from "./components/site/trust-footer";

// 911 Realtor Club landing page. Standalone static build (Vite + React).
// Section order + copy match the approved mockup. All CTA anchors carry
// data-ghl hooks for the WordPress / GoHighLevel port.
export function App() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <StatsBar />
        <Benefits />
        <Neighborhood />
        <Community />
        <Testimonials />
        <Faq />
        <BottomCta />
      </main>
      <TrustFooter />
    </SmoothScroll>
  );
}
