"""Build the Made by Mitch collection from the ordered iPhone photo export.

The image ranges below come from Mitch's handwritten association list. Source
photos and XMP remain private; only 1200px metadata-stripped JPEGs are written
to public/ice-cream/made-by-mitch.
"""

import json
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

DATE_RE = re.compile(r"<photoshop:DateCreated>([^<]+)")

PINTS = [
    {"name": "Pumpkin Pie", "base": "Pumpkin ice cream", "mix_ins": ["Caramel swirl"], "description": "Pumpkin ice cream with a caramel swirl", "images": [1]},
    {"name": "Peanut Explosion", "base": "Peanut butter ice cream", "mix_ins": ["Reese’s Puffs", "Chocolate swirl", "Salted peanuts"], "description": "Peanut butter ice cream, Reese’s Puffs cereal with a chocolate swirl and salted peanuts", "images": [2, 3]},
    {"name": "M&M and Oreo", "base": "Vanilla ice cream", "mix_ins": ["Crushed M&Ms", "Oreos"], "description": "Vanilla ice cream, crushed M&Ms and Oreos", "images": [4]},
    {"name": "Reese’s Peanut Butter Cup and Butterfinger", "base": "Vanilla ice cream", "mix_ins": ["Butterfinger", "Reese’s Peanut Butter Cups", "Chocolate swirl"], "description": "Vanilla ice cream, crushed Butterfinger and Reese’s Peanut Butter Cups with chocolate swirl", "images": [6, 5]},
    {"name": "Flossy’s Nutty Chocolate Swirl", "base": "Vanilla ice cream", "mix_ins": ["Grandma’s chocolate sauce", "Peanuts", "Crunchy bits"], "description": "Vanilla ice cream, Grandma’s chocolate sauce swirl, chopped peanuts, crunchy bits", "images": [7, 8]},
    {"name": "PBP Deconstruct-O", "base": "Oreo ice cream", "mix_ins": ["Grandma’s chocolate sauce", "Salted peanuts"], "description": "Oreo ice cream, layers of Grandma’s chocolate sauce and crushed salted peanuts", "images": [9, 10]},
    {"name": "Scotcheroo", "base": "Peanut butter ice cream", "mix_ins": ["Grandma’s chocolate sauce", "Butterscotch", "Rice Krispies"], "description": "Peanut butter ice cream, Grandma’s chocolate sauce, and clusters of butterscotch, peanut butter, and Rice Krispies", "images": [11]},
    {"name": "Gooey (Cookie) Dough Balls", "base": "Vanilla ice cream", "mix_ins": ["Chocolate shavings", "Grandma’s chocolate sauce", "Marshmallow cream", "Cookie dough balls"], "description": "Vanilla ice cream with semi-sweet chocolate shavings, swirls of Grandma’s chocolate sauce and marshmallow cream, and movie theater cookie dough balls", "images": [13, 12]},
    {"name": "Only the Best Candy", "base": "Oreo ice cream", "mix_ins": ["Grandma’s chocolate sauce", "M&Ms", "Reese’s Peanut Butter Cups"], "description": "Oreo ice cream, swirls of Grandma’s chocolate sauce, crushed M&Ms, and Reese’s Peanut Butter Cups", "images": [15, 14]},
    {"name": "Strawberry Shortbread Cookie", "base": "Vanilla ice cream", "mix_ins": ["Shortbread cookie", "Strawberry topping", "Marshmallow topping"], "description": "Vanilla ice cream, shortbread cookie chunks, and swirls of Smucker’s strawberry and marshmallow topping", "images": [17, 16]},
    {"name": "Banana Pudding", "base": "Banana pudding ice cream", "mix_ins": ["Butterscotch swirl", "Nilla wafers"], "description": "Banana pudding ice cream, butterscotch swirl, and smashed Nila wafers", "images": [20, 19, 18]},
    {"name": "Halloween Peanut M&M and Oreo", "base": "Orange vanilla ice cream", "mix_ins": ["Oreos", "Peanut M&Ms"], "description": "Orange-colored Vanilla ice cream, crushed Oreos and peanut M&Ms", "images": [21]},
    {"name": "Spooky C&C", "base": "Green cookies & cream ice cream", "mix_ins": ["Crushed Oreos"], "description": "Green cookies & cream ice cream with crushed Oreos", "images": [22]},
    {"name": "Q’s Sprinkles", "base": "Cookies & cream ice cream", "mix_ins": ["Colorful sprinkles"], "description": "Cookies & cream ice cream with colorful sprinkles", "images": [23]},
    {"name": "Minty C&C", "base": "Green cookies & cream ice cream", "mix_ins": ["Andes chocolate mints"], "description": "Green cookies & cream ice cream with chopped Andes chocolate mints", "images": [24]},
    {"name": "Luck of the Charm", "base": "Lucky Charm steeped ice cream", "mix_ins": ["Marshmallow layers"], "description": "Lucky Charm steeped ice cream with marshmallow layers", "images": [26, 25]},
    {"name": "Cadury Good Time", "base": "Vanilla ice cream", "mix_ins": ["Crushed mini eggs"], "description": "Vanilla ice cream, crushed mini eggs", "images": [27]},
]


def slugify(value: str) -> str:
    value = value.lower().replace("’", "").replace("'", "")
    return re.sub(r"(^-|-$)", "", re.sub(r"[^a-z0-9]+", "-", value))


def photo_index(photo_dir: Path) -> list[dict]:
    items = []
    for xmp in photo_dir.glob("*.xmp"):
        text = xmp.read_text(encoding="utf-8", errors="ignore")
        match = DATE_RE.search(text)
        if not match:
            raise ValueError(f"Missing capture date in {xmp.name}")
        items.append({"stem": xmp.stem, "created": match.group(1)})
    return sorted(items, key=lambda item: item["created"])


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
    stripped = destination.with_suffix(".stripped.jpg")
    subprocess.run(["ffmpeg", "-y", "-i", str(destination), "-map_metadata", "-1", "-q:v", "5", str(stripped)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    stripped.replace(destination)
    intermediate.unlink(missing_ok=True)


def main(photo_dir: Path) -> None:
    root = Path.cwd()
    photos = photo_index(photo_dir)
    if len(photos) != 27:
        raise SystemExit(f"Expected 27 homemade photos, found {len(photos)}.")

    homemade = []
    for item in PINTS:
        slug = slugify(item["name"])
        associated = [photos[index - 1] for index in item["images"]]
        images = []
        for position, photo in enumerate(associated, start=1):
            source = find_media(photo_dir, photo["stem"])
            image_name = f"{slug}-{position}-{photo['stem'].lower()}.jpg"
            convert(source, root / "public" / "ice-cream" / "made-by-mitch" / image_name)
            images.append({"src": f"/ice-cream/made-by-mitch/{image_name}", "alt": f"{item['name']} homemade ice cream"})
        homemade.append({
            "id": slug,
            "slug": slug,
            "name": item["name"],
            "madeAt": datetime.fromisoformat(associated[0]["created"]).date().isoformat(),
            "base": item["base"],
            "mixIns": item["mix_ins"],
            "description": item["description"],
            "wouldMakeAgain": True,
            "images": images,
        })

    data_path = root / "data" / "iceCream.imported.json"
    data = json.loads(data_path.read_text(encoding="utf-8"))
    data["homemade"] = homemade
    data_path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print(f"Published {len(homemade)} homemade pints and {sum(len(item['images']) for item in homemade)} photos.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: build-homemade-pints.py PHOTO_EXPORT_DIRECTORY")
    main(Path(sys.argv[1]))
