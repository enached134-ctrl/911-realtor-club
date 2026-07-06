import NumberFlow from "@number-flow/react";
import { Users, Clock, CalendarCheck, Tag, type LucideIcon } from "lucide-react";
import { useCountInView } from "../../lib/site-motion";

type Stat = {
  icon: LucideIcon;
  value: number;
  prefix?: string;
  suffix?: string;
  word: string;
  sub: string;
};

const STATS: Stat[] = [
  { icon: Users, value: 100, suffix: "%", word: "Free", sub: "No fees. No catch. Just real value." },
  { icon: Clock, value: 10, suffix: "+", word: "Hours", sub: "Saved every week on content and follow-up." },
  { icon: CalendarCheck, value: 52, word: "Weeks", sub: "Of content, ready to go for you." },
  { icon: Tag, value: 0, prefix: "$", word: "", sub: "No ad spend required to get started." },
];

function StatItem({ stat }: { stat: Stat }) {
  const { ref, value } = useCountInView<HTMLParagraphElement>(stat.value);
  const Icon = stat.icon;
  return (
    <div className="flex items-start gap-4 px-6 py-6 md:px-7">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <div>
        <p ref={ref} className="font-display text-2xl font-extrabold tracking-tight text-ink">
          {stat.prefix}
          <NumberFlow value={value} />
          {stat.suffix}
          {stat.word ? <span className="ml-1.5 uppercase">{stat.word}</span> : null}
        </p>
        <p className="mt-1 text-sm leading-snug text-body">{stat.sub}</p>
      </div>
    </div>
  );
}

export function StatsBar() {
  return (
    <div className="relative z-20 mx-auto -mt-16 max-w-6xl px-5 md:px-8">
      <div className="grid grid-cols-1 divide-y divide-line rounded-[18px] border border-line bg-white shadow-[0_24px_60px_-30px_rgba(17,20,24,0.35)] sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
        {STATS.map((s) => (
          <StatItem key={s.sub} stat={s} />
        ))}
      </div>
    </div>
  );
}
