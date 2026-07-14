# Updating the Ice Cream Shoppe

The published site reads from `data/iceCream.imported.json`. The CSV inbox makes adding records possible without touching application code.

## Add a rating

1. Add the web-ready photo to `public/ice-cream/ratings/`.
2. Open `data/ice-cream-inbox.csv` in Numbers, Excel, or Google Sheets.
3. Add one row with `type` set to `rating`.
4. Use a score from 0–10 and a date in `YYYY-MM-DD` format.
5. Set `image_src` to a public path such as `/ice-cream/ratings/my-photo.jpg`.
6. Run `npm run ice-cream:check` to catch missing or malformed fields.
7. Run `npm run ice-cream:import` to generate the published data. Established aliases are normalized automatically (for example, Honey & Mackie's and 4 Queens Dairy Cream).
8. Run `npm run ice-cream:map-locations`, then `npm run ice-cream:map-check`, to create and validate the storefront pin for the new rating.
9. Run the site and review the new card before committing.

## Add a homemade pint

Use `homemade` as the type. Put the pint name in `shop_or_name`, the ice cream base in `flavor_or_base`, and separate mix-ins with a pipe (`|`). Score, city, region, and coordinates are optional for homemade pints.

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
| `mix_ins` | Leave blank | Pipe-separated list |
| `image_src` | Public photo path | Public photo path |
| `latitude`, `longitude` | Optional public-shop coordinates | Leave blank for privacy |

## Importing the Apple archive

The same CSV is the review surface for the one-time migration. Export the Apple Note as plain text or PDF and both Photos albums as unmodified originals. A migration pass can populate the CSV, extract dates and GPS coordinates from EXIF, and flag uncertain matches. Review those rows before running the import—especially coordinates—so private or ambiguous metadata never reaches the public JSON.

The importer never invents missing information. Invalid dates, scores, duplicate IDs, and incomplete rating locations fail validation with a row number.
