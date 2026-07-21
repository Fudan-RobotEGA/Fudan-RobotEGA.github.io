"""Export the lazy-loadable operator report for the static website."""

from __future__ import annotations

import json
import sys
from pathlib import Path


SITE_ROOT = Path(__file__).resolve().parents[1]
ANALYZER_ROOT = SITE_ROOT.parent / "Data_analyzer" / "fudan-rm-battlescope"
DATABASE = ANALYZER_ROOT / "rmuc_2026_region_dataset" / "rmuc_2026_region_dataset.sqlite"
OVERVIEW_PATH = SITE_ROOT / "public" / "battlescope" / "api" / "operators.json"
DETAILS_ROOT = SITE_ROOT / "public" / "battlescope" / "api" / "operators" / "games"


def write_json(path: Path, payload: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(payload, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )


def main() -> None:
    if not DATABASE.is_file():
        raise SystemExit(f"Database not found: {DATABASE}")

    sys.path.insert(0, str(ANALYZER_ROOT))
    from rmuc_trajectory.operator_report import build_operator_export

    overview, details = build_operator_export(DATABASE)
    details_by_key = {
        (detail["game_id"], detail["robot_id"]): detail for detail in details
    }
    generated_files = set()
    for report in overview["reports"]:
        for match in report["matches"]:
            filename = f"{match['game_id']}-{match['robot_id']}.json"
            generated_files.add(filename)
            match["data_url"] = f"/battlescope/api/operators/games/{filename}"
            write_json(
                DETAILS_ROOT / filename,
                details_by_key[(match["game_id"], match["robot_id"])],
            )

    for path in DETAILS_ROOT.glob("*.json"):
        if path.name not in generated_files:
            path.unlink()

    write_json(OVERVIEW_PATH, overview)
    print(
        f"Exported {len(overview['reports'])} operator roles and "
        f"{len(details)} match details."
    )


if __name__ == "__main__":
    main()
