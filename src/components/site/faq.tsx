import { Plus } from "lucide-react";
import { Reveal, RedUnderline } from "../../lib/site-motion";

const FAQS = [
  {
    q: "Is it really free?",
    a: "Yes. Membership in the 911 Realtor Club is 100% free for Florida Realtors®. No fees, no credit card, no catch.",
  },
  {
    q: "Why is this free? What's the catch?",
    a: "The Club is backed by Maya Mortgage, a local mortgage expert. We grow when you grow, so we invest in giving you the tools, content, and visibility to close more deals.",
  },
  {
    q: "Do I have to send referrals?",
    a: "No. There are no referral requirements to join or to stay a member. We are here to help you succeed.",
  },
  {
    q: "What do I actually get?",
    a: "A managed CRM, 52 weeks of done-for-you content (newsletters, texts, and social posts), a private community, and a shot at being featured on Neighborhood Match.",
  },
  {
    q: "Who is the Club for?",
    a: "Licensed Florida real-estate agents who want to save time, grow their visibility, and close more deals with real support behind them.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-paper py-24 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
            Questions? Answered.
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
            No fine print. Just real value.
          </h2>
          <RedUnderline className="mx-auto mt-4 w-16" />
        </div>

        <Reveal className="mt-12 divide-y divide-line border-y border-line" staggerSelector="details">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-2">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-bold text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-brand transition-transform duration-300 group-open:rotate-45">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <p className="pb-5 pr-12 text-[15px] leading-relaxed text-body">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
