import { getExcerpt, normalizeArray, parseDate, parseFrontMatter } from "./frontMatter";

const modules = import.meta.glob("../content/docs/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

const docs = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, content } = parseFrontMatter(raw);
    const fileName = path.split("/").pop().replace(/\.md$/, "");

    return {
      slug: fileName,
      title: data.title || fileName,
      date: data.date || "",
      timestamp: parseDate(data.date),
      tags: normalizeArray(data.tags),
      categories: normalizeArray(data.categories),
      sticky: Number(data.sticky || 0),
      excerpt: getExcerpt(content),
      content,
    };
  })
  .sort((a, b) => {
    if (a.sticky !== b.sticky) {
      return b.sticky - a.sticky;
    }
    return b.timestamp - a.timestamp;
  });

export const getAllDocs = () => docs;

export const getDocBySlug = (slug) => docs.find((doc) => doc.slug === slug);

export const getDocsByCategory = () => {
  const categories = [...new Set(docs.flatMap((doc) => doc.categories))].sort();
  return categories.map((category) => ({
    category,
    items: docs.filter((doc) => doc.categories.includes(category)),
  }));
};
