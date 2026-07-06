/**
 * Bespoke CTA garments. Each call-to-action intent has its OWN interaction
 * identity (no shared site-wide button class). All are visual for this draft:
 * href points at the #join anchor and carries a data-ghl hook so the WordPress
 * / GoHighLevel build can wire the real form, chat widget, or link.
 */
import type { ReactNode } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Magnetic } from "../../lib/site-motion";

/** Facebook glyph (lucide dropped brand icons; inline keeps one icon system). */
function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.7c-.29-.04-1.28-.12-2.43-.12-2.4 0-4.05 1.47-4.05 4.16v2.16H7.5V13h2.72v8h3.28z" />
    </svg>
  );
}

/** Primary conversion action. Solid red, magnetic pull, arrow slides on hover. */
export function JoinFreeButton({
  children = "Join the Club, it's Free!",
  className = "",
  ghl = "join-free",
}: {
  children?: ReactNode;
  className?: string;
  ghl?: string;
}) {
  return (
    <Magnetic className={"inline-block " + className} strength={0.3}>
      {/* GHL-HOOK: wire to GoHighLevel form / calendar / signup */}
      <a
        href="#join"
        data-ghl={ghl}
        className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-[14px] bg-brand px-7 py-4 font-display text-sm font-bold uppercase tracking-wide text-white shadow-[0_10px_30px_-10px_rgba(200,16,46,0.6)] transition-[transform,background-color] duration-200 hover:bg-brand-dark active:translate-y-px"
      >
        <span className="relative z-10">{children}</span>
        <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover:translate-x-0" />
      </a>
    </Magnetic>
  );
}

/** Secondary action. Outline on light, play glyph, fill sweeps in on hover. */
export function GhostButton({
  children = "See How It Works",
  className = "",
  ghl = "see-how",
}: {
  children?: ReactNode;
  className?: string;
  ghl?: string;
}) {
  return (
    /* GHL-HOOK: wire to VSL / explainer modal */
    <a
      href="#how-it-works"
      data-ghl={ghl}
      className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-[14px] border border-ink/15 bg-white px-6 py-4 font-display text-sm font-bold uppercase tracking-wide text-ink transition-colors duration-300 hover:border-ink/0 hover:text-white"
    >
      <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-white transition-colors duration-300 group-hover:bg-white group-hover:text-ink">
        <Play className="h-3 w-3 translate-x-px fill-current" />
      </span>
      <span className="relative z-10">{children}</span>
      <span className="pointer-events-none absolute inset-0 -z-0 origin-bottom scale-y-0 bg-ink transition-transform duration-300 group-hover:scale-y-100" />
    </a>
  );
}

/** Dark-section watch CTA. Red, play icon inside a pulsing ring. */
export function WatchButton({
  children = "Watch Neighborhood Match",
  className = "",
  ghl = "watch-neighborhood",
}: {
  children?: ReactNode;
  className?: string;
  ghl?: string;
}) {
  return (
    /* GHL-HOOK: open Neighborhood Match VSL lightbox */
    <a
      href="#neighborhood-video"
      data-ghl={ghl}
      className="group inline-flex items-center gap-3 rounded-[14px] bg-brand px-6 py-4 font-display text-sm font-bold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-brand-dark active:translate-y-px"
    >
      <span className="relative grid h-6 w-6 place-items-center">
        <span className="absolute inset-0 rounded-full bg-white/30 motion-safe:animate-ping" />
        <span className="relative grid h-6 w-6 place-items-center rounded-full bg-white text-brand">
          <Play className="h-3 w-3 translate-x-px fill-current" />
        </span>
      </span>
      {children}
    </a>
  );
}

/** Community CTA. Facebook-tinted, icon-led. */
export function FacebookButton({
  children = "Join Our Community",
  className = "",
  ghl = "join-community",
}: {
  children?: ReactNode;
  className?: string;
  ghl?: string;
}) {
  return (
    /* GHL-HOOK: link to the private Facebook group */
    <a
      href="#community"
      data-ghl={ghl}
      className={
        "group inline-flex items-center gap-3 rounded-[14px] border border-ink/12 bg-white px-6 py-4 font-display text-sm font-bold uppercase tracking-wide text-ink transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-14px_rgba(17,20,24,0.4)] active:translate-y-0 " +
        className
      }
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#1877F2] text-white">
        <FacebookGlyph className="h-4 w-4" />
      </span>
      {children}
    </a>
  );
}
