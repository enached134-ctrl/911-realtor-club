import { Monitor, Video, Users, Mail, type LucideIcon } from "lucide-react";
import { Reveal, RedUnderline } from "../../lib/site-motion";

type Benefit = {
  img: string;
  icon: LucideIcon;
  alt: string;
  title: string;
  body: string;
  label: string;
};

const BENEFITS: Benefit[] = [
  {
    img: "assets/card-save-time.webp",
    icon: Monitor,
    alt: "A Realtor working calmly at a laptop in a bright modern office",
    title: "Save Time",
    body: "Free CRM, fully managed for you. We handle the setup, training, and follow-up.",
    label: "Focus on what matters",
  },
  {
    img: "assets/card-visibility.webp",
    icon: Video,
    alt: "A Realtor filming himself on a phone in front of a Florida luxury home",
    title: "Get More Visibility",
    body: "Be featured on Neighborhood Match and put your expertise in the spotlight.",
    label: "Be seen. Be chosen.",
  },
  {
    img: "assets/card-relationships.webp",
    icon: Users,
    alt: "A small group of Realtors laughing around a cafe table",
    title: "Build Relationships",
    body: "Join a private community of Realtors who support, share, and grow together.",
    label: "You're not alone",
  },
  {
    img: "assets/card-topofmind.webp",
    icon: Mail,
    alt: "A Realtor smiling while using her phone in a modern office",
    title: "Stay Top of Mind",
    body: "52 weeks of content, done for you. Newsletters, texts, and social posts, ready to send.",
    label: "We do the work for you",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="bg-paper py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
            Everything you need to succeed
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
            Built for Realtors. Designed for Results.
          </h2>
          <RedUnderline className="mx-auto mt-4 w-16" />
        </div>

        <Reveal
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          staggerSelector="[data-card]"
        >
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <article
                key={b.title}
                data-card
                className="group relative flex flex-col overflow-hidden rounded-[18px] border border-line bg-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_50px_-28px_rgba(17,20,24,0.4)]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={b.img}
                    width={900}
                    height={675}
                    loading="lazy"
                    alt={b.alt}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute -bottom-5 left-5 grid h-11 w-11 place-items-center rounded-full bg-brand text-white shadow-[0_8px_20px_-8px_rgba(200,16,46,0.7)] transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 pt-8">
                  <h3 className="font-display text-xl font-bold text-ink">{b.title}</h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-body">{b.body}</p>
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
                    {b.label}
                  </p>
                </div>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
