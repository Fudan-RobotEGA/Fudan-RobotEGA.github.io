"""Export lazy-loadable strong-team overview snapshots for the static website."""

from __future__ import annotations

import json
import sys
from pathlib import Path


SITE_ROOT = Path(__file__).resolve().parents[1]
ANALYZER_ROOT = SITE_ROOT.parent / "Data_analyzer" / "fudan-rm-battlescope"
DATABASE = ANALYZER_ROOT / "rmuc_2026_region_dataset" / "rmuc_2026_region_dataset.sqlite"
OUTPUT_ROOT = SITE_ROOT / "public" / "battlescope" / "api" / "strong-compare"

STRONG_TEAMS = (
    "东北大学",
    "华南农业大学",
    "中国石油大学（华东）",
    "哈尔滨工业大学",
    "山东科技大学",
    "五邑大学",
    "广州城市理工学院",
    "哈尔滨工业大学（威海）",
    "合肥工业大学（宣城校区）",
    "同济大学",
)


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
    from rmuc_trajectory.analysis import build_school_analysis

    games_root = OUTPUT_ROOT / "games"
    games_root.mkdir(parents=True, exist_ok=True)
    generated_files: set[str] = set()
    catalog_teams = []

    for school_index, school in enumerate(STRONG_TEAMS):
        analysis = build_school_analysis(DATABASE, school)
        methodology = {
            **analysis["methodology"],
            "damage": "本侧学校造成的17mm、42mm及飞镖受击绝对值；排除撞击与判罚",
        }
        catalog_games = []
        for game in analysis["games"]:
            filename = f"{school_index:02d}-{game['game_id']}.json"
            generated_files.add(filename)
            data_url = f"/battlescope/api/strong-compare/games/{filename}"
            write_json(
                games_root / filename,
                {
                    "school": school,
                    "game_id": game["game_id"],
                    "methodology": methodology,
                    "game": game,
                },
            )
            catalog_games.append(
                {
                    "game_id": game["game_id"],
                    "赛区": game["赛区"],
                    "场次号": game["场次号"],
                    "赛程": game["赛程"],
                    "局号": game["局号"],
                    "红方学校": game["红方学校"],
                    "蓝方学校": game["蓝方学校"],
                    "开始时间": game["开始时间"],
                    "时长秒": game["时长秒"],
                    "camp": game["camp"],
                    "opponent": game["opponent"],
                    "won": game["won"],
                    "data_url": data_url,
                }
            )
        catalog_teams.append(
            {"school": school, "game_count": len(catalog_games), "games": catalog_games}
        )

    for path in games_root.glob("*.json"):
        if path.name not in generated_files:
            path.unlink()

    write_json(
        OUTPUT_ROOT / "catalog.json",
        {
            "team_count": len(catalog_teams),
            "game_count": sum(team["game_count"] for team in catalog_teams),
            "teams": catalog_teams,
        },
    )
    print(
        f"Exported {len(catalog_teams)} schools and "
        f"{sum(team['game_count'] for team in catalog_teams)} school-match snapshots."
    )


if __name__ == "__main__":
    main()
