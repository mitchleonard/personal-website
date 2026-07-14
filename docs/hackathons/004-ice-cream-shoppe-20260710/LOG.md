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

[+24:34] Made by Mitch catalog migrated with privacy review
  why: The Shoppe’s homemade pint lab needed to become a real collection rather than a placeholder after the second iPhone album arrived.
  did: Reviewed the source PDF, paired its 17 named flavors to all 27 user-specified photos, and published responsive web JPEGs. A verification pass caught retained iPhone EXIF/GPS after the first conversion; the final pipeline explicitly strips all metadata before the images enter the public directory. Type check, production build, and direct asset delivery all pass.
  next: Deploy the completed collection and verify the live route.

[+25:12] Archive card density and photo-order correction completed
  why: The initial mobile cards obscured portrait ice cream photos and an historic Cereal Killerz image had been re-added to the iPhone album, breaking the chronological pairing after its intended 2021 position.
  did: Redesigned the rating case into a two-column mobile grid with portrait-forward image crops, three desktop columns, and four at wide desktop sizes. Replaced location-status labels and quoted notes with compact map/price icons and a plain Rating number. Moved the Cereal Killerz source image from the end of the album back to rating #42, set its verified September 21, 2021 date, and advanced the affected 113 associations.
  next: Deploy and verify the compact rating case in production.

[+25:44] Editorial archive corrections applied
  why: A follow-up review identified three local photo-pair swaps, one flavor-name correction, and several homemade-pint gallery order changes.
  did: Applied the verified State Fair, Dat Malt Dough, and North Shore/Barney’s image swaps; corrected Cookies Are My Butter Half; removed homemade dates and duplicate ingredient copy; and reversed the specified pint photo sequences. The rating card now pairs date with a concise # rank, and presents the shop and price with icon-led detail rather than status labels.
  next: Publish the editorial pass, then choose a longer-term card-art direction.

[+25:58] Cherry Ledge score treatment selected
  why: The score needed more visual emphasis while retaining the calm, serif-forward hierarchy of the gallery-label card.
  did: Anchored the score at the lower-right of each card body and added a short cherry ledge above it. The result keeps the rating in the Shoppe’s existing cream, chocolate, and cherry visual language rather than turning it into a separate badge.
  next: Deploy and verify the selected score treatment.

[+26:12] Shoppe held private for map validation
  why: The location experience needs a verified shop-level data pass before the collection is ready for public recommendations.
  did: Updated the storefront copy, normalized Mexican peso prices to MXN, and introduced a single Shoppe visibility flag. While off, the route resolves to not found and is removed from the navigation and sitemap, while the rest of Ice Cream Mode remains available across the site.
  next: Complete the separate shop-location research pass, validate the map, then re-enable the public route.

[+26:37] Interactive scoop map added for private review
  why: The completed shop-location research makes the archive ready for a useful, destination-level map rather than a decorative GPS field.
  did: Replaced the static coordinate plot with an OpenStreetMap-powered pan/zoom map that groups repeat tastings into clickable cherry markers, exposes ratings and top flavors in popups, and links each stop to directions. The private route gate remains in place for review.
  next: Review marker placement against the researched shop addresses, then make the Shoppe public when the map is approved.

[+26:42] Unlisted map-review deployment enabled
  why: The interactive map needs a reviewable URL without making the Shoppe discoverable on the production site.
  did: Allowed the route only on Vercel preview deployments. The production visibility flag, navigation, sitemap exclusion, and production 404 remain unchanged.
  next: Review the preview map, then remove the preview exception when the Shoppe launches publicly.

[+26:58] Map data integrity pass added
  why: Similar shop names and two missing photo geotags caused the interactive map to split repeat visits and silently omit ratings.
  did: Added a reusable map audit that requires all 155 ratings to resolve to valid coordinates and verifies the multi-visit 4 Queens and Honey & Mackie’s destinations. Resolved the two missing coordinates from the completed location research and applied the Deadwood correction to The Depot.
  next: Rebuild the preview and verify every destination marker against the shop-location research before launch.

[+27:13] Map controls and full-photo viewing refined
  why: Map review found an inaccessible zoom experience and image crops that made it difficult to inspect individual scoops and pint details.
  did: Enabled touch pinch, trackpad/wheel, double-click, and smooth fractional zoom on the map; removed nonfunctional location chips; and added a keyboard-accessible full-image viewer for rating cards and Pint Lab images.
  next: Review the interaction pass in the private preview on touch and desktop devices.

[+27:24] Desktop full-photo viewer corrected
  why: Desktop review showed portrait photos being forced into a landscape frame, which cropped the full scoop or pint composition.
  did: Replaced the fixed-ratio image rendering with a native-dimension viewer that constrains each photo only to the available viewport, keeping the viewer image-only while retaining overlay controls for multi-photo pints.
  next: Recheck both portrait and landscape photos in the private preview before publishing the Shoppe.

[+28:02] Ice Cream Shoppe launched publicly
  why: The full archive, destination map, and image viewing pass are ready to become a useful public recommendation resource rather than a private preview.
  did: Opened the Shoppe route, navigation entry, sitemap listing, and indexing; added the Ice Cream Shoppe as a substantial Digital Archive project with its own case study; and removed the Hackathon classification from the project.
  next: Add new tastings through the import workflow as they happen, keeping the archive current.
