import { Parallax, Reveal } from "../../lib/site-motion";
import { JoinFreeButton } from "./cta";

export function BottomCta() {
  return (
    <section id="join" className="relative overflow-hidden bg-charcoal text-white">
      {/* full-bleed group image with Ken-Burns parallax */}
      <Parallax className="absolute inset-0" amount={40}>
        <div data-parallax-inner className="absolute inset-0 will-change-transform">
          <img
            src="assets/cta-group.webp"
            width={1920}
            height={1080}
            loading="lazy"
            alt="Florida Realtors standing together in front of a city skyline at golden hour"
            className="h-full w-full object-cover"
          />
        </div>
      </Parallax>
      {/* readability overlay, weighted to the left where the copy sits */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(14,22,32,0.94) 0%, rgba(14,22,32,0.82) 42%, rgba(14,22,32,0.35) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-36">
        <Reveal className="max-w-xl">
          <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Stronger together.
            <br />
            Better results.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/75">
            Join hundreds of Florida Realtors growing their business, together.
          </p>
          <div className="mt-9">
            <JoinFreeButton ghl="join-free-bottom">
              Join the 911 Realtor Club, it's Free!
            </JoinFreeButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
