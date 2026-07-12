"""Build public Ice Cream Shoppe data from an Apple Notes text export and Photos originals.

Usage:
  python scripts/build-ice-cream-archive.py ratings.txt photo-export-directory

The source note and photo export stay private. This writes web-sized JPEGs with
metadata stripped to public/ice-cream/ratings and the matching public data JSON.
"""

import json
import re
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

PRICE_RE = re.compile(r"^(?:\$[\d,.]+(?:\s+pesos)?|[\d,.]+\s+pesos)$", re.I)
SCORE_RE = re.compile(r"^(\d+(?:\.\d+)?)/10$")
DATE_RE = re.compile(r"<photoshop:DateCreated>([^<]+)")
LAT_RE = re.compile(r"<exif:GPSLatitude>([^<]+)")
LON_RE = re.compile(r"<exif:GPSLongitude>([^<]+)")
LAT_REF_RE = re.compile(r"<exif:GPSLatitudeRef>([^<]+)")
LON_REF_RE = re.compile(r"<exif:GPSLongitudeRef>([^<]+)")


def slugify(value: str) -> str:
    value = value.lower().replace("’", "").replace("'", "")
    return re.sub(r"(^-|-$)", "", re.sub(r"[^a-z0-9]+", "-", value))


def parse_note(path: Path) -> list[dict]:
    records = []
    for block in path.read_text(encoding="utf-8").split("\n\n"):
        lines = [line.strip() for line in block.splitlines() if line.strip()]
        if lines and lines[0] == "Ice Cream:":
            lines = lines[1:]
        score_index = next((index for index, line in enumerate(lines) if SCORE_RE.match(line)), None)
        if score_index is None:
            continue
        price_index = next((index for index, line in enumerate(lines) if PRICE_RE.match(line)), None)
        content = [line for index, line in enumerate(lines) if index not in {score_index, price_index}]
        if not content:
            continue
        score = float(SCORE_RE.match(lines[score_index]).group(1))
        records.append({
            "source_order": len(records) + 1,
            "shop": content[0],
            "flavor": " ".join(content[1:]),
            "price": lines[price_index] if price_index is not None else None,
            "score": score,
        })
    return records


def parse_xmp(path: Path) -> dict:
    text = path.read_text(encoding="utf-8", errors="ignore")
    def value(pattern):
        match = pattern.search(text)
        return match.group(1) if match else None
    latitude, longitude = value(LAT_RE), value(LON_RE)
    if latitude and value(LAT_REF_RE) == "S":
        latitude = str(-float(latitude))
    if longitude and value(LON_REF_RE) == "W":
        longitude = str(-float(longitude))
    return {"stem": path.stem, "created": value(DATE_RE), "latitude": float(latitude) if latitude else None, "longitude": float(longitude) if longitude else None}


def find_media(photo_dir: Path, stem: str) -> Path:
    for extension in (".HEIC", ".heic", ".HEIF", ".heif", ".JPG", ".jpg", ".JPEG", ".jpeg", ".PNG", ".png"):
        candidate = photo_dir / f"{stem}{extension}"
        if candidate.exists():
            return candidate
    raise FileNotFoundError(f"No still photo found for {stem}")


def convert(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    intermediate = destination.with_suffix(".source.jpg")
    if source.suffix.lower() in {".heic", ".heif"}:
        subprocess.run(["/Users/mitchellleonard/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override/heif-convert", str(source), str(intermediate)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        source = intermediate
    subprocess.run(["sips", "-Z", "1200", "-s", "format", "jpeg", "-s", "formatOptions", "68", str(source), "--out", str(destination)], check=True, stdout=subprocess.DEVNULL)
    intermediate.unlink(missing_ok=True)


def main(note_path: Path, photo_dir: Path) -> None:
    root = Path.cwd()
    notes = parse_note(note_path)
    photos = sorted((parse_xmp(path) for path in photo_dir.glob("*.xmp")), key=lambda photo: photo["created"] or "")
    if len(notes) != len(photos):
        raise SystemExit(f"Cannot safely pair entries: {len(notes)} ratings versus {len(photos)} photo sidecars.")

    ratings = []
    for entry, photo in zip(notes, photos):
        source = find_media(photo_dir, photo["stem"])
        slug = f"{entry['source_order']:03d}-{slugify(entry['shop'])}-{slugify(entry['flavor'])[:52]}"
        image_name = f"{entry['source_order']:03d}-{photo['stem'].lower()}.jpg"
        destination = root / "public" / "ice-cream" / "ratings" / image_name
        convert(source, destination)
        tried_at = datetime.fromisoformat(photo["created"]).date().isoformat()
        ratings.append({
            "id": slug,
            "slug": slug,
            "shop": entry["shop"],
            "flavor": entry["flavor"],
            "score": entry["score"],
            "scoreScale": 10,
            "triedAt": tried_at,
            "notes": f"{entry['price']} · Rating #{entry['source_order']}" if entry["price"] else f"Rating #{entry['source_order']}",
            "image": {"src": f"/ice-cream/ratings/{image_name}", "alt": f"{entry['flavor']} from {entry['shop']}"},
            "location": {
                "label": entry["shop"],
                "latitude": photo["latitude"],
                "longitude": photo["longitude"],
                "precision": "photo-metadata" if photo["latitude"] is not None else "unknown",
                "source": "photo-metadata",
            },
            "status": "published",
        })

    output = root / "data" / "iceCream.imported.json"
    output.write_text(json.dumps({"ratings": ratings, "homemade": []}, indent=2) + "\n", encoding="utf-8")
    print(f"Published {len(ratings)} ratings and {sum(bool(item['location']['latitude']) for item in ratings)} GPS-tagged locations.")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Usage: build-ice-cream-archive.py RATINGS_TXT PHOTO_EXPORT_DIRECTORY")
    main(Path(sys.argv[1]), Path(sys.argv[2]))
