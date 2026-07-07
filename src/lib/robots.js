import robots from "../content/robots/robots.json";
import { resolveRobotAssetPath } from "./contentAssets";

const detailModules = import.meta.glob("../content/robots/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

const detailContents = Object.fromEntries(
  Object.entries(detailModules).map(([path, raw]) => [path.split("/").pop().replace(/\.md$/, ""), raw]),
);

const normalizedRobots = robots.map((item) => ({
  ...item,
  cover: resolveRobotAssetPath(item.cover),
  tags: item.tags || [],
}));

export const getAllRobots = () => normalizedRobots;

export const getRobotBySlug = (slug) => normalizedRobots.find((item) => item.slug === slug);

export const getRobotMarkdownBySlug = (slug) => detailContents[slug] || "";

export const getRobotsBySeason = () => {
  const seasons = [...new Set(normalizedRobots.map((item) => item.season))].sort((a, b) => b.localeCompare(a));
  return seasons.map((season) => ({
    season,
    items: normalizedRobots.filter((item) => item.season === season),
  }));
};
