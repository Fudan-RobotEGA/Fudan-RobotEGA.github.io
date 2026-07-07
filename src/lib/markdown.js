import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
});

const replaceAssetUrls = (html, resolveAssetPath) =>
  html.replace(/(src|href)="\/([^"]+)"/g, (_, attr, assetName) => {
    const resolved = resolveAssetPath(assetName);
    return `${attr}="${resolved}"`;
  });

export const renderMarkdown = (content, resolveAssetPath = (value) => value) =>
  replaceAssetUrls(md.render(content || ""), resolveAssetPath);
