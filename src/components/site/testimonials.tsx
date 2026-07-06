import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Quote } from "lucide-react";
import { RedUnderline } from "../../lib/site-motion";

type T = { avatar: string; quote: string; name: string; firm: string };

const ITEMS: T[] = [
  {
    avatar: "assets/avatar-jessica.webp",
    quote:
      "The content and CRM have saved me so much time. I can finally focus on my clients and closings.",
    name: "Jessica M.",
    firm: "Keller Williams, Tampa",
  },
  {
    avatar: "assets/avatar-carlos.webp",
    quote:
      "Being featured on Neighborhood Match has brought me so many new conversations.",
    name: "Carlos R.",
    firm: "Exp Realty, Naples",
  },
  {
    avatar: "assets/avatar-amanda.webp",
    quote:
      "The community is amazing. Everyone lifts each other up and shares real strategies that work.",
    name: "Amanda L.",
    firm: "Real Broker, Orlando",
  },
];

export function Testimonials() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (embla) setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    setSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);
    onSelect();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => embla.scrollNext(), 5000);
    return () => clearInterval(id);
  }, [embla, onSelect]);

  return (
    <section id="testimonials" className="bg-paper-2 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
            What Realtors are saying
          </p>
          <RedUnderline className="mx-auto mt-4 w-16" />
        </div>

        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {ITEMS.map((t) => (
              <figure
                key={t.name}
                className="flex min-w-0 flex-[0_0_100%] flex-col rounded-[18px] border border-line bg-white p-7 sm:flex-[0_0_60%] lg:flex-[0_0_calc(33.333%-1rem)]"
              >
                <Quote className="h-7 w-7 text-brand/30" />
                <blockquote className="mt-3 flex-1 text-[17px] leading-relaxed text-ink">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    width={420}
                    height={420}
                    loading="lazy"
                    alt={t.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-display text-sm font-bold text-ink">{t.name}</p>
                    <p className="text-sm text-body">{t.firm}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* dots */}
        <div className="mt-8 flex justify-center gap-2">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={"Go to testimonial " + (i + 1)}
              onClick={() => embla?.scrollTo(i)}
              className={
                "h-2 rounded-full transition-all duration-300 " +
                (i === selected ? "w-6 bg-brand" : "w-2 bg-ink/20 hover:bg-ink/40")
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
