# Ice Cream Shoppe — data and update plan

## Recommended source of truth

Use version-controlled structured data for published entries and keep original photo files in an image host or the site’s public media folder. The website should not depend on Apple Notes or iCloud at runtime. Those are the capture sources; the repository is the reviewed publishing source.

Start with JSON or TypeScript data because it is transparent, portable, and appropriate for roughly 150 mostly static entries. Move to a database or lightweight CMS only when editing through code becomes the real bottleneck.

## Public rating record

```ts
type IceCreamRating = {
  id: string
  slug: string
  shop: string
  flavor: string
  score: number
  scoreScale: 5 | 10
  triedAt: string // ISO date; partial dates require an explicit precision field
  datePrecision: 'day' | 'month' | 'year' | 'unknown'
  notes?: string
  image: {
    src: string
    alt: string
    width?: number
    height?: number
    capturedAt?: string
  }
  location?: {
    label: string
    city?: string
    region?: string
    country?: string
    latitude?: number
    longitude?: number
    precision: 'exact-business' | 'city' | 'unknown'
    source: 'photo-metadata' | 'manual' | 'geocoded'
  }
  status: 'published' | 'needs-review' | 'draft'
}
```

Keep the raw score scale during import, then compute a normalized percentage for sorting if the note mixes scales. Do not infer a missing score or exact date.

## Homemade pint record

```ts
type HomemadePint = {
  id: string
  slug: string
  name: string
  madeAt: string
  batch?: string
  base?: string
  mixIns?: string[]
  description?: string
  verdict?: string
  wouldMakeAgain?: boolean
  images: Array<{ src: string; alt: string }>
  recipePublished: boolean
}
```

Homemade pints should not be forced into the public rating leaderboard. They tell a making-and-iteration story, and recipe details can remain private unless explicitly published.

## One-time Apple migration

1. Duplicate the Apple Note before transforming anything.
2. Export the note as PDF or copy it into a plain-text/Markdown file. A PDF preserves visual structure; plain text is easier to parse. Keeping both is ideal.
3. Export the two Photos albums as unmodified originals with metadata sidecars when available. Preserve filenames and capture dates.
4. Place the exports outside `public/` until privacy review is complete. Do not commit unreviewed GPS metadata.
5. Parse note entries into a staging CSV with columns matching the public schema.
6. Extract EXIF capture time and GPS coordinates from the photos.
7. Propose matches using filename/order, nearby dates, and note text; require manual confirmation for ambiguous matches.
8. Convert confirmed images to web formats and strip private/unneeded metadata from published copies.
9. Run validation for unique IDs/slugs, valid dates and scores, existing image paths, safe coordinate precision, and missing alt text.

## Matching strategy

Apple Notes and Photos may not share a durable identifier. Matching therefore needs confidence levels:

- **High confidence:** note date and photo capture date match, and shop/flavor context agrees.
- **Medium confidence:** dates are close and album order agrees, but there is no textual confirmation.
- **Low confidence:** order-only or visual guess. Leave these in `needs-review`.

The importer should generate a review report rather than silently choosing uncertain matches.

## Ongoing update workflow

### Simple workflow (recommended initially)

Capture new ratings in a small structured template, add the photo, run validation, and commit. This has no hosting or authentication cost and keeps publication intentional.

Suggested capture template:

```text
Shop:
Flavor:
Score:
Date tried:
Location:
Notes:
Photo filename:
```

### Shortcut-assisted workflow

An Apple Shortcut can ask those fields, select the photo, and append JSON or CSV to an iCloud Drive inbox. A local import command turns inbox entries into validated draft records. This preserves phone-first capture without exposing an admin interface.

### Future editor

If updates become frequent, add a protected editor backed by a CMS or database. This is a later optimization, not a prerequisite for publishing the collection.

## Privacy and quality gates

- Convert home-made-pint coordinates to city-level or remove them entirely.
- Publish a business coordinate only after confirming it resolves to a public storefront.
- Strip full EXIF metadata from public images after extracting required fields.
- Preserve original exports privately as the archival source.
- Use meaningful alt text focused on the ice cream and presentation.
- Record uncertain dates honestly instead of fabricating precision.
- Provide a non-map list for keyboard and screen-reader users.

