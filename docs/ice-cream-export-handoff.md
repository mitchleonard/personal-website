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

1. Parse the note into a reviewable ratings table.
2. Read dates and coordinates from photo metadata.
3. Match records with a confidence level, leaving uncertain pairs for review.
4. Create privacy-safe public images—metadata stripped, with home coordinates removed.
5. Import approved records into the Shoppe, test sorting/map behavior at full scale, then deploy.

You do not need to pre-clean anything. Keep the filenames and originals intact; the migration process is designed to do the careful part.
