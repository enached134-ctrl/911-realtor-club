import { HeadlineBuild, Parallax } from "../../lib/site-motion";
import { JoinFreeButton, GhostButton } from "./cta";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-paper pb-28 pt-28 md:pb-32 md:pt-32"
    >
      {/* warm, brand-tinted wash behind the hero (subtle, not a gradient blob) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 55% at 82% 18%, rgba(200,16,46,0.10), transparent 60%), radial-gradient(50% 50% at 10% 0%, rgba(224,169,59,0.08), transparent 55%)",
        }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* Left: copy */}
        <div className="relative z-10">
          <HeadlineBuild>
            <h1 className="font-display text-5xl font-black uppercase leading-[0.92] tracking-tighter text-ink sm:text-6xl xl:text-[5.2rem]">
              <span className="block overflow-hidden pb-1">
                <span data-line className="block">
                  Free Tools.
                </span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span data-line className="block">
                  Real Support.
                </span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span data-line className="block text-brand">
                  More Closings.
                </span>
              </span>
            </h1>
          </HeadlineBuild>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-body">
            The 911 Realtor Club gives Florida Realtors® the tools, content, and
            community to save time, grow visibility, and close more deals, at no
            cost.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <JoinFreeButton>Join the Club, it's Free!</JoinFreeButton>
            <GhostButton>See How It Works</GhostButton>
          </div>
        </div>

        {/* Right: hero media with parallax + depth accent */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute -right-3 -top-3 bottom-6 left-10 -z-10 rounded-[26px] bg-brand/90"
          />
          <Parallax className="relative overflow-hidden rounded-[22px] shadow-[0_30px_60px_-30px_rgba(17,20,24,0.45)]">
            <div data-parallax-inner className="will-change-transform">
              <img
                src="assets/hero.webp"
                width={1920}
                height={1080}
                alt="Three professional Florida Realtors talking together outside a modern luxury home"
                className="aspect-[16/11] w-full object-cover"
                fetchPriority="high"
              />
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
