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
   - **Rating:** start typing the shop. Select a matching storefront when it appears. For a new shop, enter its full address, choose the map result, open the pin if needed, and explicitly confirm it is the storefront visited. Price and note are optional.
   - **Pint:** pint name, made date, one free-form description, photo, and optional note. Put mix-ins in the description rather than maintaining a second field.
5. Choose **Save draft and review**. The entry and its photos save privately, then the Counter shows a compact card mockup on the same phone screen.
6. Choose **Edit and fix** to return to the draft, or **Approve for publishing** when the mockup, canonical shop spelling, exact address/map pin, price format, and photo all look right.
7. The approved entry stays in the private queue for the protected site release. The Counter never asks a phone user to download or re-upload a CSV.

ChatGPT or Claude can be used to turn a photo and shorthand note into a **draft**. The private form remains the source of truth and the only way an entry advances to review.

## Required gates — no bypasses

The database migration at `supabase/migrations/20260714183141_shoppe_content_workflow.sql` enforces these rules even if someone skips the UI:

| Transition | Required | What happens if it is missing |
| --- | --- | --- |
| Draft | Nothing beyond the entry type | Saved privately so quick capture is never lost. |
| Ready for review (rating) | Blob photo, shop, item, score, date, and a **verified** canonical address | The status change is rejected with the exact missing fields. The record stays out of the review/publish path. |
| Ready for review (pint) | Blob photo, pint name, and description | The status change is rejected with the exact missing fields. |
| Approved | A complete review-ready record | The owner approves it from the private mockup. |
| Published | An approved record plus the site’s import/map/build checks | Database rejects a direct draft-to-published jump; the release is blocked until checks pass. |

The critical map rule: photo GPS is never a publishing source. A rating must link to a separately confirmed storefront address before it can advance. The new-shop flow uses an address lookup plus an explicit owner confirmation; it never converts photo metadata into a map pin.

## Release checklist

Run this checklist for every approved entry before it appears on the public Shoppe:

1. Confirm the uploaded image URL is a Vercel Blob URL and the full image looks correct in the lightbox.
2. Confirm the canonical shop name and exact address. For a new or ambiguous shop, compare the selected map result against the storefront before continuing.
3. Use the approved Counter record as the release source. Do not ask the mobile editor to download or re-upload a CSV.
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
