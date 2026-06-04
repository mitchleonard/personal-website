# Personal Website — Working Notes

## Project structure quick-ref

- `app/` — Next.js App Router pages. `app/page.tsx` is the home (hero + Work & Projects grid). `app/projects/page.tsx` is the personal-projects index.
- `data/caseStudies.js` — single source of truth for all case studies and personal projects. Each entry has a `slug`, `title`, `description`, `tags`, etc.
- `data/projects.js` — currently empty; legacy hook kept for the homepage merge logic.
- `data/tags.js` — **canonical tag list** for both Work and Projects (see below).
- `components/TagPill.tsx` — pill primitive. Quiet outlined at rest, fills with brand color on hover or when active.
- `components/FilterableWorkGrid.tsx` — home page Work & Projects grid with click-to-filter.
- `components/FilterableProjectsGrid.tsx` — /projects grid with click-to-filter.

## Canonical Tags

When adding a new project or case study, prefer tags from these lists. If you need a brand-new tag, add it to `data/tags.js` with an explicit `colorKey` from the palette below.

### Work / Case Study tags
- AI Enablement *(cornflower)*
- Change Leadership *(tangerine)*
- Enterprise Strategy *(neutral)*
- Integrated Campaign *(frozen-lake)*
- Executive Communications *(cornflower)*
- Event Marketing *(banana)*
- Social Media Strategy *(frozen-lake)*
- Brand Campaign *(tangerine)*
- Paid & Organic *(yellow-green)*
- Content Strategy *(banana)*
- Brand Marketing *(tangerine)*
- Brand Launch *(tangerine)*
- Corporate Communications *(neutral)*

### Personal Project tags
- Claude Skills *(cornflower)*
- Documentation *(neutral)*
- Hackathon *(tangerine)*
- Full Stack *(cornflower)*
- React *(frozen-lake)*
- PWA *(yellow-green)*
- TypeScript *(frozen-lake)*
- Mobile-First *(yellow-green)*
- Health Tech *(yellow-green)*
- Firebase *(tangerine)*
- JavaScript *(banana)*
- Game Design *(tangerine)*
- Canvas API *(cornflower)*
- Leaderboard *(neutral)*
- Microsite *(frozen-lake)*
- Game Dev *(tangerine)*

### Color palette (keys for `data/tags.js`)
`banana` · `frozen-lake` · `tangerine` · `yellow-green` · `cornflower` · `neutral`

If you skip the explicit mapping, `colorKeyForTag()` falls back to a stable hash of the tag name — same tag always gets the same color, but adding it to the map keeps things intentional and grouped.

## Tag behavior
- Tags render via `<TagPill />`. Pass an `onClick` to make them filter buttons; omit it for static display.
- Filter state is local per-page (`useState`), not URL-based. Clicking a tag toggles it; click again or use the **Clear** button to reset.
- At rest: quiet outlined pill. On hover OR when active: filled with the tag's brand color — matches the chip style on `/about`.

## Conventions
- Keep `data/caseStudies.js` ordered roughly chronologically; the homepage WORK_ORDER array controls explicit display order.
- Personal projects live in `caseStudies.js` too, but their slugs are listed in `PERSONAL_SLUGS` on the home page and `/projects` page.
- Tailwind config scans `app/`, `components/`, `pages/` — **not** `data/`. Don't put Tailwind class strings in `data/` files; keep them in components.

## Build & checks
- `npx tsc --noEmit` — type check (should be clean)
- `npx next build` — full build (also catches lint-ish issues)
- `npx next dev` — local dev server on :3000
