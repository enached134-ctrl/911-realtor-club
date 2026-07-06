# 911 Realtor Club — landing page

Standalone, self-contained marketing landing page. **Vite + React 19 + Tailwind v4**, animated with GSAP + Lenis + Motion. No backend, no platform lock-in. All imagery is bespoke (generated, optimized WebP). All CTAs are visual and carry `data-ghl` hooks for the GoHighLevel / WordPress port.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in dist/
npm run preview    # preview the production build
```

## Deploy (GitHub Pages)

This repo ships a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and publishes to GitHub Pages on every push to `main`.

One-time setup after pushing to GitHub:
1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `main` (or run the workflow manually). The site publishes at
   `https://<user>.github.io/<repo>/`.

`vite.config.ts` uses `base: "./"` so assets resolve correctly at the project
subpath. For a custom domain or a `<user>.github.io` root site, no change is needed.

## Structure

```
src/
  App.tsx                 page composition
  styles.css              brand tokens (Tailwind v4 @theme)
  lib/site-motion.tsx     GSAP/Lenis/Motion primitives (reduced-motion aware)
  components/site/*        one file per section (nav, hero, stats, benefits,
                          neighborhood, community, testimonials, faq, bottom-cta,
                          trust-footer) + cta.tsx (bespoke buttons) + logo.tsx
public/assets/*.webp      generated imagery
```

## Notes

- Testimonial avatars are AI-generated placeholders. Swap for real headshots before launch.
- Copy matches the approved mockup exactly.
