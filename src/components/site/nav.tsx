import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";

const LINKS = [
  { label: "Benefits", href: "#benefits" },
  { label: "Neighborhood Match", href: "#neighborhood" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  // Transparent over the hero, solid white with a hairline + shadow after scroll.
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 " +
        (solid
          ? "border-b border-line bg-paper/90 shadow-[0_4px_20px_-12px_rgba(17,20,24,0.3)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent")
      }
    >
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative py-1 text-sm font-semibold text-ink/80 transition-colors hover:text-ink"
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-brand transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden flex-col items-end lg:flex">
          {/* GHL-HOOK: join-free (nav) */}
          <a
            href="#join"
            data-ghl="join-free-nav"
            className="rounded-[12px] bg-brand px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark active:translate-y-px"
          >
            Join Free
          </a>
          <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-body">
            100% Free for Florida Realtors®
          </span>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-white text-ink lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile slide-down menu */}
      <div
        className={
          "overflow-hidden border-t border-line bg-paper transition-[max-height,opacity] duration-300 lg:hidden " +
          (open ? "max-h-96 opacity-100" : "max-h-0 opacity-0")
        }
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-semibold text-ink hover:bg-paper-2"
            >
              {l.label}
            </a>
          ))}
          {/* GHL-HOOK: join-free (mobile) */}
          <a
            href="#join"
            data-ghl="join-free-mobile"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-[12px] bg-brand px-5 py-3.5 text-center font-display text-sm font-bold uppercase tracking-wide text-white"
          >
            Join Free
          </a>
        </nav>
      </div>
    </header>
  );
}
