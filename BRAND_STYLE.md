# mitchleonard.com — Brand Style Guide

A living reference for design decisions, layout rules, and component patterns used across the portfolio. Update this file whenever a new pattern is approved.

---

## Color Palette

Defined in [`tailwind.config.js`](tailwind.config.js). All colors are available as Tailwind utilities.

| Token | Hex | Usage |
|---|---|---|
| `near-black` | `#0f0f0f` | Body text, headings, borders |
| `off-white` | `#f7f5f2` | Page background |
| `accent` / `cornflower` | `#006fab` | Primary CTAs, links, company labels, accent dots |
| `frozen-lake` | `#85d4ff` | Light blue — chip backgrounds, context section accent |
| `tangerine` | `#f56e3d` | Warm highlight — challenge section, hover states, inline underlines |
| `banana` | `#fde74c` | Callout chips, text highlights (`bg-banana/60`), insight section |
| `yellow-green` | `#9bc53d` | Results, metrics, impact section accent |

### Section accent dot colors
```
Context   → bg-frozen-lake
Challenge → bg-tangerine
Insight   → bg-banana
Role      → bg-yellow-green
Execution → bg-cornflower
Impact    → bg-yellow-green
```

### /hire page
Lives at `/hire`. Uses Yahoo-purple (`#6001d2`) as its own brand color — fully separate from the main palette.

---

## Typography

Fonts loaded via Next.js in [`app/layout.tsx`](app/layout.tsx).

| Role | Font | Tailwind class |
|---|---|---|
| Headlines | DM Serif Display | `font-serif` |
| Body / UI | Roboto | `font-sans` |

### Scale
- **Page headline:** `font-serif text-4xl md:text-5xl lg:text-6xl` — let it be the statement
- **Section headline:** `font-serif text-2xl md:text-3xl`
- **Section label:** `font-sans text-xs uppercase tracking-[0.15em] text-near-black/50` — always small and muted
- **Body text:** `font-sans text-lg md:text-xl leading-[1.85] text-near-black/80` — weighted and readable
- **Caption / meta:** `font-sans text-sm text-near-black/40`

### Inline emphasis
- Yellow marker: `bg-banana/60 px-0.5 rounded-sm`
- Warm underline: `border-b-2 border-tangerine`
- Color chip: `bg-frozen-lake/40 rounded-sm px-1`
- `==text==` syntax in `caseStudies.js` data auto-renders as banana highlight via `parseInline()`

---

## Layout

### Page shell
- Max width: `max-w-3xl mx-auto` for prose pages (case studies, about, contact)
- Horizontal padding: `px-6`
- Top padding (nav offset): `pt-28`

### Whitespace
- Content sections: `py-12` default — editorial, tight
- Major visual breaks only: `py-20`
- Section vertical gap: `space-y-14` within case study body

### Two-column split hero (desktop)
```
grid grid-cols-1 md:grid-cols-2
```
Text left, photo right. Single column stacked on mobile. Check mobile first (iPhone 14 Pro Max, 430px wide).

### Sticky sidebar labels
Long text sections use a 2-col grid with a sticky label column:
```
grid grid-cols-1 md:grid-cols-[160px_1fr] gap-x-10
```
Label div: `md:sticky md:top-28`

---

## Navigation & Footer

- **Nav links:** Work · Projects · CV · Contact
- **Contact** points to `/contact` page (not `mailto:`)
- **Footer left:** `📍 Minneapolis`
- **Footer right:** `Powered by 🍦`

---

## Scroll Animations

`AnimateIn` component wraps content for on-scroll reveal:
- Spring easing: `cubic-bezier(0.16,1,0.3,1)`
- Duration: `0.8s`
- Offset: `translateY(56px) scale(0.98)` → `translateY(0) scale(1)`
- Trigger: `IntersectionObserver` at 6% threshold with `-40px` root margin

Use `delay` prop (ms) to stagger sibling elements.

---

## Visuals Gallery

### Data flags (in `caseStudies.js`)
| Flag | Type | Effect |
|---|---|---|
| `featured: true` | boolean | Renders full-width above all other visuals |
| `portrait: true` | boolean | Item joins masonry group instead of full-width row |
| `tall: true` | boolean | Forces `columns-2` always (LinkedIn full-post, very tall IG reels) |
| `silent: true` | boolean | Hides the Sound button on video |
| `section: 'Label'` | string | Groups items under a labeled sub-section. Prefix with `__` to suppress the visible label |

### Grouping rules
- **All consecutive `portrait: true` items** (regardless of video/image/gif type) are grouped into **one masonry block**. Non-portrait items break the run.
- To get separate masonry blocks, place a non-portrait item between the groups.
- Always keep portrait items consecutive in the data array — interleaving breaks the grouping.

### Column count logic
```
tall: true  OR  items.length < 3  →  columns-2  (all screen sizes)
everything else                   →  columns-2 md:columns-3
```

### Odd item count on mobile
When `items.length % 2 !== 0`, the last item gets `hidden md:block` to prevent an empty column gap on mobile. It shows on desktop (where the minor imbalance is acceptable).

### Always use CSS `columns` — never CSS `grid`
`grid-cols-N` creates fixed row heights, which introduces white gaps above/below items of varying heights. CSS `columns` (masonry waterfall) lets each item flow naturally with zero vertical gaps.

```html
<!-- Correct -->
<div class="columns-2" style="column-gap: 0.5rem">
  <div class="break-inside-avoid mb-2">...</div>
</div>

<!-- Never do this for portrait galleries -->
<div class="grid grid-cols-2 gap-2">...</div>
```

### Horizontal (non-portrait) videos
Always full-width. No `portrait` flag. Place them **after** the portrait group in the data array.

### Single portrait item
Renders constrained to `max-w-[280px] sm:max-w-xs` — not stretched full-width.

---

## Photos & Images

- Never use `aspect-square` + `object-cover` on personal photos — it auto-crops faces
- Use `w-full` at natural ratio, or `object-cover object-top` with a generous `max-h`
- On mobile, cap hero images with `max-h-80 md:max-h-none`
- Keep photo containers clean — no decorative color blocks, drop shadows, or background shapes behind photos

---

## Components

### AutoplayVideo
- Autoplays muted on mount
- Sound button toggles unmuted playback
- Pass `silent={true}` to hide the Sound button entirely (screen recordings with no useful audio)

### ResultsBlock
- Displays metric results (`value` + `label` pairs)
- Used at the top of each case study

### AnimateIn
- Wraps any block for scroll-triggered reveal
- Props: `delay` (ms), `className`, `distance` (px offset, default 56)

---

## What to Avoid

- **Stat/analytics grids** — too dashboard-y for a personal portfolio; find an editorial way to embed metrics in body text if needed
- **Decorative elements** — no background shapes, color panels, or drop shadows behind photos
- **CSS grid for portrait galleries** — always use CSS columns
- **Forced aspect ratios on personal photos** — let them breathe at natural ratio
- **Airy whitespace** — default to `py-12`, not `py-20`, for content sections
