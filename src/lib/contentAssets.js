const robotAssetModules = import.meta.glob("../content/robots/asset/*", {
  eager: true,
  import: "default",
});

const docAssetModules = import.meta.glob("../content/docs/asset/*", {
  eager: true,
  import: "default",
});

const buildAssetMap = (modules) =>
  Object.fromEntries(
    Object.entries(modules).map(([path, assetUrl]) => [path.split("/").pop(), assetUrl]),
  );

const robotAssetMap = buildAssetMap(robotAssetModules);
const docAssetMap = buildAssetMap(docAssetModules);

const normalizeAssetPath = (value) => String(value || "").replace(/^\//, "");

export const resolveRobotAssetPath = (value) => {
  const normalized = normalizeAssetPath(value);
  return robotAssetMap[normalized] || value;
};

export const resolveDocAssetPath = (value) => {
  const normalized = normalizeAssetPath(value);
  return docAssetMap[normalized] || value;
};
