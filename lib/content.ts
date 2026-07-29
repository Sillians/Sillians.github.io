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
  topic?: string;
  subtopic?: string;
  paper?: string;
  cover?: string;
  coverAlt?: string;
  body: string;
};

const contentRoot = path.join(process.cwd(), "content");
const requiredProjectSections = [
  "Architecture",
  "Data Flow",
  "Deployment",
  "Scaling",
  "Evaluation",
  "Monitoring",
];

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
  const body = match[2].trim();

  if (type === "projects") {
    const missingSections = requiredProjectSections.filter(
      (section) => !new RegExp(`^## ${section}$`, "m").test(body)
    );
    if (missingSections.length) {
      throw new Error(`Project ${slug} is missing required sections: ${missingSections.join(", ")}`);
    }
  }

  return {
    type, slug,
    title: data.title,
    description: data.description,
    date: data.date,
    year: data.date?.slice(0, 4) || "",
    tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
    featured: data.featured === "true",
    topic: data.topic,
    subtopic: data.subtopic,
    paper: data.paper,
    cover: data.cover,
    coverAlt: data.coverAlt,
    body,
  };
}

export function getAllContent(type?: ContentType) {
  const types: ContentType[] = type ? [type] : ["projects", "research", "writing"];
  return types
    .flatMap((contentType) =>
      fs.readdirSync(path.join(contentRoot, contentType))
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => {
          const filePath = path.join(contentRoot, contentType, file);
          return parseFile(filePath, fs.readFileSync(filePath, "utf8"));
        })
    )
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
import fs from "node:fs";
import path from "node:path";
