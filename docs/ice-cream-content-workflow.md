# Ice Cream Shoppe Content Workflow

## Recommended model

Build a private, mobile-first **Behind the Counter** capture flow inside the Shoppe. It should be the source of truth for new ratings and homemade pints. AI can help turn a photo and shorthand notes into a draft, but it should not be the only intake path or the publishing system.

Why: a native web form gives the archive a durable schema, a review queue, a clear audit trail, and a repeatable publishing loop. It also makes a stronger project story than manually pasting each entry into a chat.

## Mobile capture flow

1. Open a private `/ice-cream/counter` page from the iPhone home screen.
2. Choose **New rating** or **Made by Mitch pint**.
3. Add one or more photos directly from the camera roll.
4. Fill only the required fields:
   - Rating: shop, flavor, score, visit date, price/currency, and optional note.
   - Pint: name, base, mix-ins, and optional note.
5. Use **Find the shop** to select an existing canonical shop or add a new one with an address. The app proposes a location but requires review before it becomes a map pin.
6. Save as draft or submit for review. The user sees the uploaded photos and a card preview immediately.

## Publish workflow

```text
Phone capture → draft record + image storage → review queue
  → canonical shop/address check → generated card/map preview → publish
```

- **Draft:** fast capture; nothing public yet.
- **Review:** resolve shop aliases, branch/address, price formatting, and image alt text.
- **Publish:** validates the same archive checks that protect the current 155 ratings, adds the rating/pint, refreshes the map, and publishes the site.

## Technical shape

- **Private app surface:** Next.js route protected by owner authentication (magic link is sufficient for one editor).
- **Content database:** Supabase Postgres for ratings, pints, shops, locations, and workflow status.
- **Photo storage:** Supabase Storage, keeping original images and web-ready display versions together.
- **Map safety:** a shop-location record is separate from a photo's EXIF coordinates. A new shop cannot publish until its canonical address or map pin is reviewed.
- **Publishing:** read public records from the database with on-demand revalidation. Keep the current JSON archive as the migration source and export fallback during the transition.

## AI's role

Use ChatGPT or Claude as a **draft assistant**, not the archive database:

- Good: extract fields from a receipt/photo, suggest a flavor description, detect duplicate shop spellings, or prepare a new-shop location research brief.
- Not sufficient: own uploaded images, determine an address from noisy photo GPS, or publish straight to the public collection without review.

The best convenience layer is an optional iOS Shortcut: share a photo from Photos, choose “Add to Shoppe,” and open the prefilled private form. The form remains the final review and publish surface.

## Build sequence

1. Add the private rating/pint capture form and Supabase tables/storage.
2. Add photo upload, draft save, and mobile card preview.
3. Add canonical shop selection and new-location review.
4. Add the review queue and publish action with archive/map validation.
5. Migrate the existing JSON archive to the database, then update the Shoppe read path.

## Required decision before implementation

Approve Supabase as the private database, authentication, and image-storage provider. This introduces a new external account/project and environment variables, so it should be connected intentionally rather than assumed.
