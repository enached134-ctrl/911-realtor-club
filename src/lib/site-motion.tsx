/**
 * 911 Realtor Club — motion primitives.
 *
 * SSR contract (Cloudflare Worker): every export renders static markup on the
 * server; all GSAP / Lenis / window access lives inside useEffect only. Nothing
 * waits at opacity:0 for a scroll trigger (headless full-page screenshots must
 * show every section) — scroll reveals animate TRANSFORM ONLY. The hero headline
 * build is the one opacity animation, and it fires ON MOUNT, not on scroll.
 * Every effect is gated behind prefers-reduced-motion with a static fallback.
 */
import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

let registered = false;
function ensureGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}
function reduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Lenis smooth scroll bridged to the GSAP ticker (no double RAF). */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (reduced()) return;
    ensureGsap();
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}

/**
 * Transform-only scroll reveal (screenshot-safe: element is always visible,
 * it just settles up + scales in as it enters). Optional stagger for children
 * matching `staggerSelector`.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  y = 26,
  delay = 0,
  staggerSelector,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  y?: number;
  delay?: number;
  staggerSelector?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    ensureGsap();
    const ctx = gsap.context(() => {
      const targets = staggerSelector
        ? el.querySelectorAll(staggerSelector)
        : [el];
      gsap.from(targets, {
        y,
        scale: 0.985,
        transformOrigin: "50% 100%",
        duration: 0.8,
        ease: "power3.out",
        delay,
        stagger: staggerSelector ? 0.1 : 0,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [y, delay, staggerSelector]);
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Hero headline: word-by-word opacity+rise build on MOUNT (not scroll gated). */
export function HeadlineBuild({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    ensureGsap();
    const lines = el.querySelectorAll("[data-line]");
    const ctx = gsap.context(() => {
      gsap.from(lines, {
        yPercent: 115,
        opacity: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.12,
        delay: 0.1,
      });
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Parallax + gentle Ken-Burns scale on the hero media (transform only). */
export function Parallax({
  children,
  className,
  amount = 60,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    ensureGsap();
    const inner = el.querySelector("[data-parallax-inner]") ?? el;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { yPercent: -amount / 20, scale: 1.08 },
        {
          yPercent: amount / 20,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [amount]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Signature: a brand-red bar that draws itself (scaleX) under a headline. */
export function RedUnderline({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      el.style.transform = "scaleX(1)";
      return;
    }
    ensureGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          ease: "power3.inOut",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <span
      ref={ref}
      aria-hidden
      className={"block h-[3px] origin-left bg-brand " + className}
      style={{ transform: "scaleX(0)" }}
    />
  );
}

/** Count number 0 -> target when the element enters view (once). */
export function useCountInView<T extends HTMLElement = HTMLElement>(target: number) {
  const ref = useRef<T>(null);
  const [value, setValue] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      setValue(target);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setValue(target);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  return { ref, value };
}

/** Magnetic wrapper: element eases toward the cursor (transform only). */
export function Magnetic({
  children,
  className,
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const prefersReduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });
  const ref = useRef<HTMLDivElement>(null);
  function onMove(e: React.PointerEvent) {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }
  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
