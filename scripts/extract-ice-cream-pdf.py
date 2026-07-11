"""Extract a ratings-note PDF into a review CSV.

Usage:
  python scripts/extract-ice-cream-pdf.py /path/to/ice-cream-ratings.pdf /path/to/review.csv

The PDF is treated as a staging source only. Dates, location, image, and a
human review status remain empty because they belong to the photo-metadata pass.
"""

import csv
import re
import sys
from pathlib import Path

import pdfplumber

PRICE_RE = re.compile(r"^(?:\$[\d,.]+(?:\s+pesos)?|[\d,.]+\s+pesos)$", re.I)
SCORE_RE = re.compile(r"^(\d+(?:\.\d+)?)/10$")


def main(input_pdf: Path, output_csv: Path) -> None:
    with pdfplumber.open(input_pdf) as pdf:
        lines = [line.strip() for page in pdf.pages for line in (page.extract_text() or "").splitlines() if line.strip()]

    records = []
    buffer = []
    for line in lines:
        score_match = SCORE_RE.match(line)
        if not score_match:
            buffer.append(line)
            continue

        price_index = next((index for index in range(len(buffer) - 1, -1, -1) if PRICE_RE.match(buffer[index])), None)
        if price_index is None:
            # Keep malformed/continued content attached to the next complete record.
            buffer.append(line)
            continue

        content = buffer[:price_index]
        if content and content[0] == "Ice Cream:":
            content = content[1:]
        if content:
            records.append({
                "source_order": len(records) + 1,
                "shop": content[0],
                "flavor_or_item": " ".join(content[1:]),
                "price_as_noted": buffer[price_index],
                "score": score_match.group(1),
                "tried_at": "",
                "city": "",
                "region": "",
                "photo_filename": "",
                "latitude": "",
                "longitude": "",
                "review_status": "needs-photo-metadata",
            })
        buffer = []

    output_csv.parent.mkdir(parents=True, exist_ok=True)
    fields = ["source_order", "shop", "flavor_or_item", "price_as_noted", "score", "tried_at", "city", "region", "photo_filename", "latitude", "longitude", "review_status"]
    with output_csv.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fields)
        writer.writeheader()
        writer.writerows(records)

    print(f"Extracted {len(records)} review rows to {output_csv}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Usage: extract-ice-cream-pdf.py INPUT_PDF OUTPUT_CSV")
    main(Path(sys.argv[1]), Path(sys.argv[2]))
