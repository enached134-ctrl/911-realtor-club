import { Play, Trophy } from "lucide-react";
import { Reveal, RedUnderline } from "../../lib/site-motion";
import { WatchButton } from "./cta";

export function Neighborhood() {
  return (
    <section
      id="neighborhood"
      className="relative overflow-hidden bg-charcoal py-24 text-white md:py-28"
    >
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 50% at 15% 20%, rgba(200,16,46,0.18), transparent 60%), radial-gradient(40% 45% at 90% 85%, rgba(224,169,59,0.12), transparent 60%)",
        }}
      />
      <div id="how-it-works" className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">
            Your spotlight. Your neighborhood.
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
            Become the Face of Your Neighborhood.
          </h2>
          <RedUnderline className="mt-4 w-16" />
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/70">
            Get a professionally produced video segment that showcases your
            market expertise and helps homebuyers discover the communities you
            love.
          </p>
          <div className="mt-8">
            <WatchButton />
          </div>
        </Reveal>

        {/* Video thumbnail + play + winner badge */}
        <Reveal>
          {/* GHL-HOOK: neighborhood-video, open VSL lightbox on click */}
          <a
            href="#neighborhood-video"
            data-ghl="neighborhood-video"
            aria-label="Watch the Neighborhood Match segment"
            className="group relative block overflow-hidden rounded-[20px] border border-white/10 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]"
          >
            <img
              src="assets/neighborhood.webp"
              width={1360}
              height={765}
              loading="lazy"
              alt="A confident Realtor in a blue blazer in front of waterfront Florida homes"
              className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
            <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center">
              <span className="absolute inset-0 rounded-full bg-white/25 motion-safe:animate-ping" />
              <span className="relative grid h-16 w-16 place-items-center rounded-full bg-white text-brand transition-transform duration-300 group-hover:scale-110">
                <Play className="h-6 w-6 translate-x-0.5 fill-current" />
              </span>
            </span>
            {/* winner badge */}
            <span className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-xl bg-charcoal/80 px-4 py-3 backdrop-blur-sm">
              <span className="font-display text-sm font-bold uppercase tracking-wide">
                <span className="text-gold">3</span> Neighborhoods.{" "}
                <span className="text-gold">1</span> Realtor.{" "}
                <span className="text-gold">1</span> Winner.
              </span>
              <Trophy className="h-5 w-5 shrink-0 text-gold" />
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
