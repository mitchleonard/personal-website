"""Extract an Apple Notes ratings export into a review CSV.

Usage:
  python scripts/extract-ice-cream-pdf.py /path/to/ice-cream-ratings.txt /path/to/review.csv

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


def read_blocks(input_file: Path) -> list[list[str]]:
    if input_file.suffix.lower() == ".txt":
        return [[line.strip() for line in block.splitlines() if line.strip()] for block in input_file.read_text(encoding="utf-8").split("\n\n") if block.strip()]

    with pdfplumber.open(input_file) as pdf:
        lines = [line.strip() for page in pdf.pages for line in (page.extract_text() or "").splitlines() if line.strip()]
    blocks, buffer = [], []
    for line in lines:
        buffer.append(line)
        if SCORE_RE.match(line):
            blocks.append(buffer)
            buffer = []
    return blocks


def main(input_file: Path, output_csv: Path) -> None:
    blocks = read_blocks(input_file)

    records = []
    for block in blocks:
        score_index = next((index for index, line in enumerate(block) if SCORE_RE.match(line)), None)
        if score_index is None:
            continue
        score_match = SCORE_RE.match(block[score_index])
        price_index = next((index for index, line in enumerate(block) if PRICE_RE.match(line)), None)
        content = [line for index, line in enumerate(block) if index not in {score_index, price_index}]
        if content and content[0] == "Ice Cream:":
            content = content[1:]
        if content:
            records.append({
                "source_order": len(records) + 1,
                "shop": content[0],
                "flavor_or_item": " ".join(content[1:]),
                "price_as_noted": block[price_index] if price_index is not None else "",
                "score": score_match.group(1),
                "tried_at": "",
                "city": "",
                "region": "",
                "photo_filename": "",
                "latitude": "",
                "longitude": "",
                "review_status": "needs-photo-metadata",
            })
    output_csv.parent.mkdir(parents=True, exist_ok=True)
    fields = ["source_order", "shop", "flavor_or_item", "price_as_noted", "score", "tried_at", "city", "region", "photo_filename", "latitude", "longitude", "review_status"]
    with output_csv.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fields)
        writer.writeheader()
        writer.writerows(records)

    print(f"Extracted {len(records)} review rows to {output_csv}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Usage: extract-ice-cream-pdf.py INPUT_FILE OUTPUT_CSV")
    main(Path(sys.argv[1]), Path(sys.argv[2]))
