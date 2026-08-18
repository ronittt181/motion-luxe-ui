# Next-level polish pass: Quant Plus frontend

The current build already has a strong dark terminal look, GSAP/Motion scroll work, and a full app workspace. What separates it from "best in the world" is not more effects — it is craft consistency, perceived performance, and detail work that most sites skip. Here is what I would do.

## 1. Typographic system (biggest visual upgrade)
- Introduce a real type scale (display / h1-h4 / body / caption / mono-label) as CSS variables with fluid `clamp()` sizes, instead of per-component one-off sizes.
- Optical fixes: tighter tracking on large display text, looser on small mono labels, `text-wrap: balance` on headings and `pretty` on paragraphs (partly there), max measure of ~68ch on all prose.
- Consistent numeric treatment: tabular-nums everywhere numbers change, plus a shared `<Metric>` component so price/percent/currency always render identically.

## 2. Motion discipline
- Centralize easing/duration tokens (fast 160ms, base 280ms, slow 600ms, one signature ease) and refactor components to use them — right now durations vary per component.
- Reduce entrance-animation load: currently many sections blur-in. Keep blur reveals for hero and section heads only; use pure opacity/translate elsewhere so scrolling feels fast, not laggy.
- Add page transitions between routes (shared fade/rise on `<Outlet />`) and a route-change top progress bar.
- Full `prefers-reduced-motion` coverage — Motion/GSAP animations should be gated, not just CSS ones.

## 3. Perceived performance
- Skeleton + suspense states for every app panel instead of instant-populated mock data, so the product reads as live.
- Route preloading on link hover/intent across the whole site (already only on auth pages).
- Defer GSAP/ScrollTrigger and heavy chart code behind viewport-based dynamic import; keep the hero JS payload minimal.
- Optimistic UI + toast feedback on trade actions, watchlist toggles, alerts.

## 4. Interaction craft
- A single canonical focus-visible ring style across the site (currently inconsistent) and full keyboard paths for tabs, accordions, command palette, and the intelligence feed.
- Hover states with real affordance: cursor-aware spotlight is used in places, extend to a consistent card treatment with border-glow + 2-3px lift, one shared class.
- Micro-interactions with meaning: number ticks that flash green/red on change, order-fill confirmation animation, "since your last visit" pill count animating in.
- Command palette (⌘K) upgrade: recent items, grouped results, arrow-key navigation, empty/no-result state.

## 5. Data storytelling polish
- Charts: crosshair with synced tooltip, gradient area fill under the line, animated draw-on on first paint, and a compact range selector (1D/1W/1M/1Y).
- Sparklines get min/max markers and a last-point pulse dot.
- Empty, loading, and error states designed for every data surface (most only have the happy path today).

## 6. Structural / page-level gaps
- A pricing page and a dedicated "Virtual trading" page — the marketing story currently ends at features and stops short of conversion.
- Landing: add a short "proof" band (numbers with source labels) and a compact comparison/objection section before the FAQ.
- Footer: expand to a full sitemap-style footer with disclaimer (SEBI-style "not investment advice" notice) — important for a market product's credibility.

## 7. Responsive and accessibility
- Mobile pass on the intelligence dashboard: horizontal scroll rails with snap for stat strips, bottom nav for app routes, larger tap targets.
- Contrast audit on muted-foreground over surface (currently borderline in a few panels).
- Landmarks, headings order, and aria labels for the remaining interactive components.

## 8. Foundations
- Light theme variant driven off the existing tokens (many "premium" fintech sites ship both), with a header toggle.
- Per-route OG images and JSON-LD for the marketing pages.
- Favicon/app icon set and a branded 404/500 that matches the new theme.

## Suggested order
1. Type scale + motion tokens + focus ring (design foundations, affects everything)
2. Chart/data storytelling upgrades + loading/empty states
3. Page transitions, preloading, reduced-motion coverage
4. Mobile/app-shell responsive pass
5. New pages (pricing, virtual trading), footer, SEO/OG
6. Optional: light theme

Tell me which of these to run with — I can do the whole list in sequence, or start with 1-3 which give the largest visible jump.
