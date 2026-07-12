"""Apply verified image and copy corrections from the archive review."""

import json
from pathlib import Path


def rating(data: dict, shop: str, flavor: str) -> dict:
    return next(item for item in data["ratings"] if item["shop"] == shop and item["flavor"] == flavor)


def swap_images(first: dict, second: dict) -> None:
    first["image"], second["image"] = second["image"], first["image"]


def main() -> None:
    path = Path.cwd() / "data" / "iceCream.imported.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("editorialCorrectionsRevision") == "archive-review-2026-07":
        print("Editorial corrections are already applied.")
        return

    swap_images(
        rating(data, "Blue Moon Dine-In-Theater (MN State Fair)", "Irish Butter Ice Cream Over Brown Sugar Cinnamon Toast"),
        rating(data, "A to Z Creamery (MN State Fair)", "Apple of Granny’s Eye"),
    )
    swap_images(
        rating(data, "Bebe Zito", "Dat Malt Dough"),
        rating(data, "A to Z Creamery", "It’s Gettin Hot in Here"),
    )
    swap_images(
        rating(data, "‘Nita Mae’s Scoop", "North Shore"),
        rating(data, "Barney’s Drive In", "Cookie Monster flurry"),
    )

    cookies = rating(data, "A to Z Creamery", "Cookies Are My Better Half")
    cookies["flavor"] = "Cookies Are My Butter Half"

    for item in data["ratings"]:
        if item.get("image"):
            item["image"]["alt"] = f"{item['flavor']} from {item['shop']}"

    flipped_pints = {
        "Reese’s Peanut Butter Cup and Butterfinger",
        "Gooey (Cookie) Dough Balls",
        "Only the Best Candy",
        "Strawberry Shortbread Cookie",
        "Banana Pudding",
        "Luck of the Charm",
    }
    for pint in data["homemade"]:
        if pint["name"] in flipped_pints:
            pint["images"].reverse()

    data["editorialCorrectionsRevision"] = "archive-review-2026-07"
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print("Applied three rating-photo swaps, one flavor rename, and six pint photo reversals.")


if __name__ == "__main__":
    main()
