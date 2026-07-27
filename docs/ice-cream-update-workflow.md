# Updating the Ice Cream Shoppe

> New entries are published from the private, phone-friendly Behind the Counter
> flow described in [the content workflow](./ice-cream-content-workflow.md).
> The CSV is retained only for historic-archive maintenance, not as a file a
> Counter user needs to download or upload on mobile.

The published site combines the historic `data/iceCream.imported.json` archive with the public Shoppe projection. Approving a reviewed Counter entry publishes it right away; the CSV inbox remains available for bulk historic-import maintenance.

## Release an approved rating

1. Review the private Counter mockup, then choose **Approve and publish**.
2. The public Shoppe card, map marker, and About-page count update on the next visit or refresh. No CSV download, import, commit, or deploy is needed for a new Counter entry.
3. Use the CSV only when adding or correcting a historic batch outside the Counter.

## Release an approved homemade pint

Use `homemade` as the type. Put the pint name in `shop_or_name` and the complete description in `flavor_or_base`; it includes any mix-ins. Score, city, region, and coordinates are optional for homemade pints.

## Inbox columns

| Column | Rating | Homemade |
| --- | --- | --- |
| `type` | `rating` | `homemade` |
| `shop_or_name` | Shop name | Pint name |
| `flavor_or_base` | Flavor | Base |
| `score` | Required, 0–10 | Leave blank |
| `date` | Date tried | Date made |
| `city`, `region` | Required | Optional |
| `notes` | Tasting note | Batch description |
| `mix_ins` | Leave blank | Leave blank; include mix-ins in the description |
| `image_src` | Public photo path | Public photo path |
| `latitude`, `longitude` | Optional public-shop coordinates | Leave blank for privacy |

## Importing the Apple archive

The same CSV is the review surface for the one-time migration. Export the Apple Note as plain text or PDF and both Photos albums as unmodified originals. A migration pass can populate the CSV, extract dates and GPS coordinates from EXIF, and flag uncertain matches. Review those rows before running the import—especially coordinates—so private or ambiguous metadata never reaches the public JSON.

The importer never invents missing information. Invalid dates, scores, duplicate IDs, and incomplete rating locations fail validation with a row number.
