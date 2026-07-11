# Ice Cream Shoppe — Apple export handoff

Bring these three things into the project workspace. Originals stay private until the metadata review is complete.

## 1. Ratings note

From Notes on Mac, open the note, then use **File → Export as PDF**. Also copy its contents into a plain-text file if its entries have a predictable list format. Name either export `ice-cream-ratings`.

The PDF preserves visual context; the text copy makes extraction more accurate. Both are useful.

## 2. Ratings photo album

From Photos on Mac, select the full ratings album, then use **File → Export → Export Unmodified Original**. Turn on **Export IPTC as XMP** if Photos offers it. Put the resulting folder in the workspace as `imports/ice-cream-ratings-photos/`.

Do not use screenshots, AirDrop’s automatic conversion, or optimized copies for this handoff. We need capture dates and original location metadata to match and map the ratings accurately.

## 3. Homemade pints album

Repeat the unmodified-original export for the homemade-pints album and place it at `imports/made-by-mitch-photos/`.

## What happens next

1. Parse the note into a reviewable ratings table. The PDF handoff is enough to do this now; photos do not need to arrive first.
2. Read dates and coordinates from photo metadata.
3. Match records with a confidence level, leaving uncertain pairs for review.
4. Create privacy-safe public images—metadata stripped, with home coordinates removed.
5. Import approved records into the Shoppe, test sorting/map behavior at full scale, then deploy.

You do not need to pre-clean anything. Keep the filenames and originals intact; the migration process is designed to do the careful part.

## If photos remain only on the iPhone

That changes the migration from one batch into two, but does not stop it:

1. **Ratings first:** extract shop, flavor, price, score, and original note order from the PDF. These can be reviewed now.
2. **Metadata second:** export the two albums when convenient, then enrich the matching rows with tried dates, images, and public business locations.

The best iPhone handoff is still through the Mac Photos app with iCloud Photos enabled, because it preserves albums and original metadata. If that is not available, AirDrop the selected photos from each album to the Mac using **All Photos Data** / original-quality transfer; do this album by album and keep the two exports separate. Avoid a Shared Album, screenshots, or social-media downloads, since those commonly remove or degrade metadata.
