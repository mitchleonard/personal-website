# Ice Cream Shoppe — experience directions

## Product goal

Turn Mitch's long-running ice cream habit into one memorable, explorable part of the site—not another project card or a directory of links. The experience should make roughly 150 ratings enjoyable to browse, preserve the personality of Ice Cream Mode across navigation, and leave a low-friction path for adding future ratings and homemade pints.

## Direction A — The hidden shoppe (recommended)

Ice Cream Mode becomes the doorway. Switching it on changes persistent site accents and reveals an “Enter the shoppe” affordance in the navigation. The dedicated `/ice-cream` route feels like stepping into a small editorial ice cream counter while remaining recognizably part of mitchleonard.com.

The shoppe has three rooms:

- **The Case** — a visual, sortable collection of every rating, initially showing a curated subset with progressive loading.
- **The Map** — places and trips, clustered geographically and linked back to individual ratings.
- **Made by Mitch** — a smaller recipe-lab shelf for homemade pints, intentionally distinct from public-shop ratings.

Why it fits: it rewards discovery, makes Ice Cream Mode functional, and keeps the main portfolio from becoming a menu of unrelated projects. The mode is a persistent layer; the shoppe is the destination.

Potential risk: a “hidden” destination can become too hidden. The About page’s existing “145+ ice creams rated” chip and footer’s “Powered by 🍦” can both become secondary entrances.

## Direction B — The field guide

Treat the collection as an enthusiast’s editorial archive. The page opens with a ranked “Mitch’s current top ten,” then offers a compact searchable catalog, seasonal dispatches, and a map. Visual language leans toward scorecards, tasting notes, date stamps, and geographic labels.

Why it fits: strongest information hierarchy for 150+ records and easiest to keep useful as the archive grows.

Tradeoff: less theatrical and makes Ice Cream Mode feel more like a theme switch than a portal.

## Direction C — The passport

Make geography the primary story. The opening view is a map or illustrated regional index. Visitors explore cities, trips, and shops before drilling into ratings. “Recent scoops” and “top ranked” become smaller companion views.

Why it fits: turns photo metadata into storytelling and reveals patterns that a ranked list cannot.

Tradeoff: the map is a heavier first interaction, and incomplete or noisy GPS metadata will be more visible.

## Recommended first release

Build Direction A with the data discipline of Direction B:

1. A persistent Ice Cream Mode stored in `localStorage`, initialized before paint, and exposed from the global navigation.
2. A playful “Enter the shoppe” transition that respects reduced-motion preferences.
3. A `/ice-cream` landing page with featured stats, recent ratings, top-rated scoops, and a preview of Made by Mitch.
4. A collection view sortable by newest, highest score, and shop name; filters can follow once the real data reveals useful categories.
5. A map-ready data model and location list in release one; an interactive map can follow after metadata quality is audited.
6. Data stored separately from portfolio case studies so the homepage continues to present a curated body of work.

## Interaction principles

- Ice Cream Mode persists across routes and browser sessions, but never blocks navigation or readability.
- The shoppe remains directly linkable at `/ice-cream`; mode is an invitation, not an access requirement.
- “Top ranked” uses a stable tie-breaker: score descending, then rating date descending.
- “Most recent” means the date the ice cream was tried, not the import or photo-upload date.
- Map pins disclose approximate public-business locations, never a private home coordinate.
- Homemade pints use a separate content type because their scoring, recipe notes, and privacy needs differ from purchased ice cream.
- Motion, saturated colors, and novelty typography are accents. Core controls remain accessible and consistent with the existing site.

## Suggested information architecture

```text
/ice-cream
  Overview: featured scoop, totals, recent, top ranked, Made by Mitch preview
/ice-cream/ratings
  Full sortable collection
/ice-cream/map
  Geographic exploration (after metadata audit)
/ice-cream/made-by-mitch
  Homemade pint collection
```

For the first hackathon sprint, `/ice-cream` can contain all four sections with anchored navigation. Split routes only when the real collection makes the single page unwieldy.

## Release boundaries

### Hackathon MVP

- Persistent mode and shoppe entrance
- Polished responsive landing page
- Schema and representative sample records
- Sorting by recent and top-rated
- Homemade section
- Map-ready location presentation or static preview
- Import instructions and validation script shape

### Data migration milestone

- Export and parse the Apple Note
- Export selected albums with original metadata
- Match photos to ratings
- Review duplicates, missing dates, and uncertain shops
- Redact private coordinates

### Map milestone

- Geocode only records without usable coordinates
- Cluster nearby pins
- Connect each pin to its rating cards
- Provide an accessible list alternative

