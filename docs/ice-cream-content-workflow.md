# Ice Cream Shoppe content workflow

## The intentionally small stack

The Shoppe has one home for media and one home for workflow data:

| Concern | System | Why |
| --- | --- | --- |
| Photos and videos | **Vercel Blob** | The website already uses Vercel storage. A new upload gets one Blob URL; it is never copied into Supabase Storage. |
| Private sign-in, drafts, review state, canonical shops | **Supabase Auth + Postgres** | Structured records, a private queue, and a durable audit trail without putting the archive logic into a chat. |
| Public archive and map | **This Next.js site** | Records reach the live JSON/map only after the release checks pass. |

This is deliberately not a second media backend. Supabase holds the URL and the submission metadata, not a duplicate original image.

## The normal, phone-first loop

1. From the iPhone, open the private **Behind the Counter** page (saved to the home screen).
2. Choose **New rating** or **Made by Mitch pint**.
3. Select up to four photos. Each uploads directly to Vercel Blob. Do not send the originals to chat first.
4. Enter the short structured details:
   - **Rating:** shop, item/flavor, 0–10 score, tasting date, and an existing verified shop address. Price and note are optional.
   - **Pint:** pint name, base/description, photo, and optional mix-ins/note. Pints have no public date requirement.
5. Save a draft when moving quickly. Submit only when the screen reports **Ready for review**.
6. In the review queue, confirm the canonical shop spelling, exact address/map pin, price format, and photo/card preview.
7. Run the archive and map checks, then publish through the site release.

ChatGPT or Claude can be used to turn a photo and shorthand note into a **draft**. The private form remains the source of truth and the only way an entry advances to review.

## Required gates — no bypasses

The database migration at `supabase/migrations/20260714183141_shoppe_content_workflow.sql` enforces these rules even if someone skips the UI:

| Transition | Required | What happens if it is missing |
| --- | --- | --- |
| Draft | Nothing beyond the entry type | Saved privately so quick capture is never lost. |
| Ready for review (rating) | Blob photo, shop, item, score, date, and a **verified** canonical address | The status change is rejected with the exact missing fields. The record stays out of the review/publish path. |
| Ready for review (pint) | Blob photo, pint name, and base/description | The status change is rejected with the exact missing fields. |
| Approved | A complete review-ready record | Reviewer marks the record approved. |
| Published | An approved record plus the site’s import/map/build checks | Database rejects a direct draft-to-published jump; the release is blocked until checks pass. |

The critical map rule: photo GPS is never a publishing source. A rating must link to a separately reviewed storefront address before it can advance. That keeps a photo taken elsewhere from creating a bad map pin.

## Release checklist

Run this checklist for every approved entry before it appears on the public Shoppe:

1. Confirm the uploaded image URL is a Vercel Blob URL and the full image looks correct in the lightbox.
2. Confirm the canonical shop name and exact address. For a new or ambiguous shop, keep it blocked and research the branch first.
3. Export the approved record into `data/ice-cream-inbox.csv`.
4. Run `npm run ice-cream:check`.
5. Run `npm run ice-cream:import`.
6. Run `npm run ice-cream:map-locations` and `npm run ice-cream:map-check`.
7. Review the new card, the full-size image, and its storefront map marker locally.
8. Run `npx tsc --noEmit` and `npm run build` before committing/deploying.

Any failed command is a publishing blocker, not a warning. Correct the source record, rerun the failed check, and only then continue. This keeps the current JSON archive as a portable, reviewable fallback while the private counter is introduced.

## Free-tier guardrails

- Keep uploaded media on Vercel Blob only. The Counter limits a submission to four JPEG, PNG, or WebP images, and rejects files over 12 MB before it creates a draft.
- Store only structured text, timestamps, IDs, and Blob URLs in Supabase. Do not add Supabase Storage buckets for Shoppe media.
- The Supabase free project is suitable for the small private queue, but it may pause after a period of inactivity. The counter must show a clear unavailable/setup message rather than silently accepting an entry it cannot save.
- Vercel Blob has free-tier storage, transfer, and operation caps. If the account hits a cap, stop before creating a dangling submission and show a retry message; do not fall back to a second image host.

## One-time setup

1. Follow [the Counter setup checklist](./ice-cream-counter-setup.md).
2. Test one draft, one blocked rating (no verified location), and one valid review-ready pint before enabling the Counter link.

No service-role secret belongs in the browser, in a committed env file, or in this workflow. Owner access is enforced by Supabase row-level security, and the release checks remain the final public guard.
