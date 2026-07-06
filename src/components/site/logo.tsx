/** 911 Realtor Club wordmark lockup. tone switches for light vs dark grounds. */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const ink = tone === "dark" ? "text-ink" : "text-white";
  const sub = tone === "dark" ? "text-body" : "text-white/60";
  return (
    <a href="#top" className="group flex items-center gap-2.5" aria-label="911 Realtor Club home">
      <span className="font-display text-3xl font-black leading-none tracking-tighter text-brand">
        911
      </span>
      <span className="flex flex-col leading-none">
        <span className="flex items-center gap-1.5">
          <span className={"font-display text-lg font-extrabold tracking-tight " + ink}>
            REALTOR
          </span>
          <span className="rounded bg-brand px-1.5 py-0.5 font-display text-[11px] font-bold uppercase tracking-wide text-white">
            Club
          </span>
        </span>
        <span className={"mt-1 text-[10px] font-medium uppercase tracking-[0.14em] " + sub}>
          Real support. Better results.
        </span>
      </span>
    </a>
  );
}
