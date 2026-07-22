import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public" / "battlescope" / "api" / "opponents.json"
PAGE = ROOT / "public" / "battlescope" / "analysis" / "opponents" / "index.html"


class OpponentStaticTests(unittest.TestCase):
    def test_export_and_page_cover_school_role_comparison(self) -> None:
        payload = json.loads(DATA.read_text(encoding="utf-8"))
        self.assertEqual(payload["reference_school"], "复旦大学")
        self.assertTrue(payload["comparisons"])
        for comparison in payload["comparisons"]:
            self.assertNotEqual(comparison["school"], "复旦大学")
            self.assertEqual(len(comparison["reports"]), 5)
            self.assertNotIn("radar_metrics", comparison)
            for report in comparison["reports"]:
                self.assertEqual(len(report["radar_metrics"]), 6)
                keys = {metric["key"] for metric in report["radar_metrics"]}
                if report["robot_type"] == "工程":
                    self.assertIn("economy_gain_7m", keys)
                    self.assertNotIn("buff_count", keys)
                else:
                    self.assertIn("buff_count", keys)
                    self.assertIn("inferred_damage", keys)
                    self.assertNotIn("mean_support_distance", keys)
                    self.assertNotIn("economy_gain_7m", keys)
        page = PAGE.read_text(encoding="utf-8")
        self.assertIn("/battlescope/api/opponents.json", page)
        self.assertIn("全部机器人类型汇总", page)
        self.assertIn("对手分析", page)


if __name__ == "__main__":
    unittest.main()
