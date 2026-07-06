import {
  ShieldCheck,
  Handshake,
  MapPin,
  BadgeCheck,
  Headset,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "./logo";

type Trust = { icon: LucideIcon; title: string; sub: string };

const TRUST: Trust[] = [
  { icon: ShieldCheck, title: "100% Free", sub: "No hidden fees" },
  { icon: Handshake, title: "No Referral Requirements", sub: "We're here to help you succeed" },
  { icon: MapPin, title: "Built for Florida Realtors®", sub: "By a local mortgage expert" },
  { icon: BadgeCheck, title: "Trusted Partner", sub: "Backed by Maya Mortgage" },
  { icon: Headset, title: "Support When You Need It", sub: "We grow when you grow" },
];

const FOOTER_LINKS = [
  { label: "Benefits", href: "#benefits" },
  { label: "Neighborhood Match", href: "#neighborhood" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export function TrustFooter() {
  return (
    <footer className="bg-charcoal-2 text-white">
      {/* trust bar */}
      <div className="border-b border-line-dark">
        <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-8 px-5 py-14 md:grid-cols-3 md:px-8 lg:grid-cols-5">
          {TRUST.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.title} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-6 w-6 shrink-0 text-brand" strokeWidth={2} />
                <div>
                  <p className="font-display text-sm font-bold uppercase tracking-wide">
                    {t.title}
                  </p>
                  <p className="mt-1 text-sm text-white/55">{t.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* footer row */}
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-12 md:flex-row md:items-center md:px-8">
        <Logo tone="light" />
        <nav className="flex flex-wrap gap-x-7 gap-y-2">
          {FOOTER_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t border-line-dark">
        <div className="mx-auto max-w-7xl px-5 py-6 text-xs text-white/40 md:px-8">
          © {new Date().getFullYear()} 911 Realtor Club. A Maya Mortgage partner
          program. Not affiliated with any government agency.
        </div>
      </div>
    </footer>
  );
}
