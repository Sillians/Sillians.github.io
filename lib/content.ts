export type ContentType = "projects" | "research" | "writing";
export type ContentItem = {
  type: ContentType;
  slug: string;
  title: string;
  description: string;
  date: string;
  year: string;
  tags: string[];
  featured: boolean;
  body: string;
};

const files = import.meta.glob("../content/**/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseFile(path: string, raw: string): ContentItem {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Invalid frontmatter in ${path}`);
  const data: Record<string, string> = {};
  match[1].split("\n").forEach((line) => {
    const split = line.indexOf(":");
    if (split > -1) data[line.slice(0, split).trim()] = line.slice(split + 1).trim().replace(/^["']|["']$/g, "");
  });
  const parts = path.split("/");
  const type = parts[parts.length - 2] as ContentType;
  const slug = parts.at(-1)!.replace(/\.mdx$/, "");
  return {
    type, slug,
    title: data.title,
    description: data.description,
    date: data.date,
    year: data.date?.slice(0, 4) || "",
    tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
    featured: data.featured === "true",
    body: match[2].trim(),
  };
}

export function getAllContent(type?: ContentType) {
  return Object.entries(files)
    .map(([path, raw]) => parseFile(path, raw))
    .filter((item) => !type || item.type === type)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getContent(type: ContentType, slug: string) {
  return getAllContent(type).find((item) => item.slug === slug);
}

export function renderMarkdown(markdown: string) {
  const escaped = markdown.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped
    .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^\- (.*)$/gm, "<li>$1</li>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .split(/\n\n+/)
    .map((block) => block.startsWith("<h") || block.startsWith("<pre") ? block : block.startsWith("<li>") ? `<ul>${block}</ul>` : `<p>${block.replace(/\n/g, " ")}</p>`)
    .join("");
}
