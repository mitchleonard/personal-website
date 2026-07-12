# Build log

[+00:00] Hackathon #004 kicked off
  why: Turn a private six-year Apple Notes and Photos archive into a public, maintainable ice cream collection.
  did: Confirmed the brief, 90-minute budget, project tags, definition of done, and GPT-5.6 evaluation criteria.
  next: Audit the existing Ice Cream Mode and establish the persistent experience architecture.

[+00:01] Product direction and ingestion architecture preserved in-repo
  why: The shoppe needs a coherent experience and a safe route from Apple data to public records.
  did: Linked the previously prepared experience options and data plan as project inputs.
  next: Build the global mode provider and shoppe experience against representative records.

[+09:28] First working shoppe verified
  why: Prove the core experience before importing the private archive.
  did: Built the global persistent mode, shoppe entrance, sortable rating cards, map-ready location view, pint lab, responsive styling, and accessible controls. Browser-tested desktop and mobile with no console errors; fixed an existing random-color hydration mismatch discovered during cross-route verification.
  next: Make future updates possible without editing application code.

[+09:55] CSV inbox and validated import path working
  why: New ratings must be easy to publish after the one-time Apple archive migration.
  did: Added a spreadsheet-friendly inbox, validation and import commands, generated JSON source, privacy guidance, and a step-by-step update runbook. Empty-inbox check and import both passed.
  next: Run the production build, complete the real-data migration when exports are available, and prepare the live deployment milestone.

[+10:46] Production build and completion audit passed for the application layer
  why: Separate a working prototype from a deployment-ready build and keep unproven requirements visible.
  did: Next.js compiled the new static route successfully; browser QA proved sorting, mode persistence, responsive rendering, and zero console errors. The audit identified real Apple data, real media metadata, and the production URL as the remaining external evidence.
  next: Receive the Apple Note and album exports, run the migration review, replace preview records, and deploy.

[+16:49] Restored the original Ice Cream Mode animation system
  why: A linked historical commit revealed the expressive mode behavior that was absent from the current checkout.
  did: Adapted its continuous gyroscope gravity field, falling sprinkles, tap bursts, cone favicon and title treatment, and pre-paint theme restoration to the new persistent provider. Browser QA confirmed the overlay, burst, tab treatment, a non-identity gravity rotation, and zero console errors.
  next: Import the real Apple archive and use the animation as the playful doorway into a production-ready collection.

[+34:20] Ratings archive extracted from Apple Notes PDF
  why: The source note arrived before the iPhone photo albums, so the migration needed to separate rating data from photo metadata.
  did: Visually reviewed the 21-page export, confirmed 155 scored entries, and built a reusable extractor. The initial PDF parse produced 153 clean review rows; two irregular price/score sequences are correctly left for manual review rather than guessed.
  next: Export the two iPhone albums as originals, then match dates, photos, and safe public locations to the review table.

[+35:40] Plain-text note completed the ratings extraction
  why: The text export retained one record per blank-separated block, avoiding page-break ambiguity from PDF extraction.
  did: Updated the extractor to prefer text exports and generated all 155 review rows, including the two irregularly formatted entries. Dates, photos, and locations remain intentionally blank until their source metadata is available.
  next: Use the 155-row review table as the matching target for the original iPhone album exports.

[+23:46] Real ratings and photo metadata migrated
  why: The original iPhone album export arrived with one XMP sidecar per rating.
  did: Matched the note’s chronological 155-entry order to 155 dated photo sidecars; generated 155 public rating records, 153 GPS-tagged locations, and 155 metadata-stripped web JPEGs. The first HEIC conversion path produced black images, so it was replaced with HEIF decoding plus resized JPEG output and visually rechecked. The archive now renders real photos, top-ranked sorting, recency sorting, and the GPS field; the production build passes.
  next: Add real Made by Mitch photos and flavors when that album is available, then deploy the finished collection.

[+23:48] Ice Cream Mode became the Shoppe doorway
  why: The mode needed a functional destination as well as a persistent visual identity.
  did: Added a compact Enter the Shoppe link to the desktop navigation, mobile menu, and footer only when Ice Cream Mode is on. The rating archive remains directly linkable, so the playful entrance never becomes a gate.
  next: Deployment verification and the optional Made by Mitch album.
