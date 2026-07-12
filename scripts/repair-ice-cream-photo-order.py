"""Repair the published archive after a historic photo was re-added in 2026.

IMG_5464 is the Cereal Killerz photo from September 21, 2021. Its XMP capture
timestamp reflects the later library import, so chronological matching placed it
at rating #155. This script rotates the existing public image references into
their verified order without rewriting or exposing the original image files.
"""

import copy
import json
from pathlib import Path

INSERT_AT = 41  # zero-based Rating #42
SOURCE_AT = 154  # zero-based final source image (IMG_5464)
CONFIRMED_DATE = "2021-09-21"


def main() -> None:
    root = Path.cwd()
    data_path = root / "data" / "iceCream.imported.json"
    data = json.loads(data_path.read_text(encoding="utf-8"))
    if data.get("photoOrderRevision") == "cereal-killerz-2021":
        print("Photo-order correction is already applied.")
        return

    ratings = data["ratings"]
    original = copy.deepcopy(ratings)
    for target_index in range(INSERT_AT, len(ratings)):
        source_index = SOURCE_AT if target_index == INSERT_AT else target_index - 1
        source = original[source_index]
        target = ratings[target_index]
        target["image"] = source["image"]
        target["triedAt"] = CONFIRMED_DATE if target_index == INSERT_AT else source["triedAt"]
        target["location"] = {**source["location"], "label": target["shop"]}

    data["photoOrderRevision"] = "cereal-killerz-2021"
    data_path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print("Moved IMG_5464 to Cereal Killerz (#42) and advanced 113 image associations.")


if __name__ == "__main__":
    main()
