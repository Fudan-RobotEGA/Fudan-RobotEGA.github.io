"""Export opponent-school operator comparisons for the static site."""

from __future__ import annotations

import json
import sys
from pathlib import Path


SITE_ROOT = Path(__file__).resolve().parents[1]
ANALYZER_ROOT = SITE_ROOT.parent / "Data_analyzer" / "fudan-rm-battlescope"
DATABASE = ANALYZER_ROOT / "rmuc_2026_region_dataset" / "rmuc_2026_region_dataset.sqlite"
OUTPUT = SITE_ROOT / "public" / "battlescope" / "api" / "opponents.json"


def main() -> None:
    if not DATABASE.is_file():
        raise SystemExit(f"Database not found: {DATABASE}")
    sys.path.insert(0, str(ANALYZER_ROOT))
    from rmuc_trajectory.operator_report import build_operator_reports
    from rmuc_trajectory.opponent_analysis import (
        build_school_operator_comparison,
        list_opponent_schools,
    )

    reference = build_operator_reports(DATABASE)
    schools = list_opponent_schools(DATABASE)
    payload = {
        "reference_school": "复旦大学",
        "comparisons": [
            build_school_operator_comparison(DATABASE, school, reference)
            for school in schools
        ],
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        json.dumps(payload, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"Exported {len(schools)} opponent-school comparisons.")


if __name__ == "__main__":
    main()
