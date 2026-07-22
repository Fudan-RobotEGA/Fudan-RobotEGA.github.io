import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OVERVIEW = PUBLIC / "battlescope" / "api" / "operators.json"
PAGE = PUBLIC / "battlescope" / "analysis" / "operators" / "index.html"


class OperatorStaticExportTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.overview = json.loads(OVERVIEW.read_text(encoding="utf-8"))
        cls.page = PAGE.read_text(encoding="utf-8")

    def test_every_match_embeds_the_compatible_detail_payload(self) -> None:
        matches = [
            match
            for report in self.overview["reports"]
            for match in report["matches"]
        ]
        self.assertEqual(len(matches), 83)
        for match in matches:
            detail_path = PUBLIC / match["data_url"].lstrip("/")
            self.assertTrue(detail_path.is_file(), detail_path)
            self.assertEqual(
                match["detail"],
                json.loads(detail_path.read_text(encoding="utf-8")),
            )

    def test_risk_axes_are_inverse(self) -> None:
        for report in self.overview["reports"]:
            self.assertTrue(report["radar_ranges"]["deaths"]["inverse"])
            self.assertTrue(report["radar_ranges"]["isolated_seconds"]["inverse"])
            keys = {metric["key"] for metric in report["radar_metrics"]}
            self.assertEqual(keys, set(report["radar_ranges"]))
            if report["robot_type"] == "工程":
                self.assertEqual(
                    keys,
                    {"deaths", "assembly_mean_level", "damage_taken",
                     "mean_support_distance", "isolated_seconds", "economy_gain_7m"},
                )
                self.assertFalse(report["radar_ranges"]["economy_gain_7m"]["inverse"])
            else:
                self.assertEqual(
                    keys,
                    {"deaths", "damage_taken", "inferred_damage",
                     "isolated_seconds", "shots", "buff_count"},
                )
                self.assertFalse(report["radar_ranges"]["inferred_damage"]["inverse"])

    def test_page_has_one_overview_request_and_no_lazy_load_states(self) -> None:
        self.assertEqual(self.page.count("fetch("), 1)
        self.assertIn("fetch('/battlescope/api/operators.json')", self.page)
        self.assertNotIn("fetch(match.data_url)", self.page)
        self.assertNotIn("待加载", self.page)
        self.assertNotIn("正在加载", self.page)
        self.assertIn("复旦 17 场平均", self.page)
        self.assertIn("radar-average", self.page)
        self.assertIn("平均装配", self.page)
        self.assertNotIn("平均最高装配", self.page)
        self.assertIn("局总经济增益", self.page)
        self.assertIn("平均推断造成伤害", self.page)


if __name__ == "__main__":
    unittest.main()
