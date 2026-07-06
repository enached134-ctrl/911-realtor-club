import { Reveal, RedUnderline } from "../../lib/site-motion";
import { FacebookButton } from "./cta";

export function Community() {
  return (
    <section id="community" className="bg-paper py-24 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2">
        {/* image left (zigzag against the previous section) */}
        <Reveal className="order-1">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -bottom-3 -left-3 right-10 top-8 -z-10 rounded-[24px] bg-brand/10"
            />
            <img
              src="assets/community.webp"
              width={1360}
              height={904}
              loading="lazy"
              alt="Six Realtors around a conference table in a bright modern office"
              className="w-full rounded-[20px] object-cover shadow-[0_30px_60px_-34px_rgba(17,20,24,0.4)]"
            />
          </div>
        </Reveal>

        <Reveal className="order-2">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
            More than tools. It's a community.
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
            Connect. Learn. Grow Together.
          </h2>
          <RedUnderline className="mt-4 w-16" />
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-body">
            Join a private Facebook Group where Florida Realtors share tips, ask
            questions, celebrate wins, and help each other level up.
          </p>
          <div className="mt-8">
            <FacebookButton />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
