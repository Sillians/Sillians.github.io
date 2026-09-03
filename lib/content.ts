import fs from "node:fs";
import path from "node:path";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import "katex/dist/katex.min.css";

export type ContentType = "projects" | "research" | "writing";
export type TableOfContentsItem = { id: string; title: string; level: 2 | 3 };
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
const requiredProjectSections = ["Architecture", "Data Flow", "Deployment", "Scaling", "Evaluation", "Monitoring"];

function parseFile(filePath: string, raw: string): ContentItem {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Invalid frontmatter in ${filePath}`);

  const data: Record<string, string> = {};
  match[1].split("\n").forEach((line) => {
    const split = line.indexOf(":");
    if (split > -1) {
      data[line.slice(0, split).trim()] = line.slice(split + 1).trim().replace(/^["']|["']$/g, "");
    }
  });

  const parts = filePath.split("/");
  const type = parts[parts.length - 2] as ContentType;
  const slug = parts.at(-1)!.replace(/\.mdx$/, "");
  const body = match[2].trim();

  if (type === "projects") {
    const missingSections = requiredProjectSections.filter((section) => !new RegExp(`^## ${section}$`, "m").test(body));
    if (missingSections.length) {
      throw new Error(`Project ${slug} is missing required sections: ${missingSections.join(", ")}`);
    }
  }

  return {
    type,
    slug,
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
        }),
    )
    .filter((item) => !type || item.type === type)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getContent(type: ContentType, slug: string) {
  return getAllContent(type).find((item) => item.slug === slug);
}

function plainHeadingText(text: string) {
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[\*_`]/g, "")
    .trim();
}

function headingSlug(text: string) {
  return plainHeadingText(text).toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-") || "section";
}

export function getTableOfContents(markdown: string): TableOfContentsItem[] {
  const items: TableOfContentsItem[] = [];
  const ids = new Map<string, number>();
  let inCodeBlock = false;

  for (const line of markdown.split("\n")) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    const title = plainHeadingText(match[2]);
    const baseId = headingSlug(match[2]);
    const occurrence = ids.get(baseId) || 0;
    ids.set(baseId, occurrence + 1);
    items.push({ id: occurrence ? `${baseId}-${occurrence + 1}` : baseId, title, level });
  }
  return items;
}

type HtmlNode = {
  type?: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HtmlNode[];
};

type MarkdownNode = {
  type?: string;
  value?: string;
  data?: { hProperties?: Record<string, unknown> };
  children?: MarkdownNode[];
};

function textFromNode(node: HtmlNode): string {
  if (node.type === "text") return node.value || "";
  return node.children?.map(textFromNode).join("") || "";
}

function rehypeArticleHeadingIds() {
  return (tree: HtmlNode) => {
    const ids = new Map<string, number>();
    const visit = (node: HtmlNode) => {
      if (node.tagName === "h2" || node.tagName === "h3") {
        const baseId = headingSlug(textFromNode(node));
        const occurrence = ids.get(baseId) || 0;
        ids.set(baseId, occurrence + 1);
        node.properties = { ...node.properties, id: occurrence ? `${baseId}-${occurrence + 1}` : baseId };
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

function rehypeExternalLinks() {
  return (tree: HtmlNode) => {
    const visit = (node: HtmlNode) => {
      const href = node.properties?.href;
      if (node.tagName === "a" && typeof href === "string" && /^https?:\/\//.test(href)) {
        node.properties = { ...node.properties, target: "_blank", rel: "noopener noreferrer" };
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

function rehypeFigureCaptions() {
  return (tree: HtmlNode) => {
    const figure = (image: HtmlNode, caption: HtmlNode): HtmlNode => ({
      type: "element",
      tagName: "figure",
      properties: { className: ["article-image"] },
      children: [
        image,
        { type: "element", tagName: "figcaption", properties: {}, children: [caption] },
      ],
    });
    const visit = (node: HtmlNode) => {
      if (!node.children) return;

      for (let index = 0; index < node.children.length; index += 1) {
        const imageParagraph = node.children[index];
        const captionParagraph = node.children[index + 1];
        const inlineNodes = imageParagraph.tagName === "p"
          ? imageParagraph.children?.filter((child) => child.type !== "text" || child.value?.trim())
          : undefined;
        const inlineImage = inlineNodes?.find((child) => child.tagName === "img");
        const inlineCaption = inlineNodes?.find((child) => child !== inlineImage && /^figure\s+\d+\s*[.:-]/i.test(textFromNode(child).trim()));

        if (inlineNodes?.length === 2 && inlineImage && inlineCaption) {
          node.children.splice(index, 1, figure(inlineImage, inlineCaption));
          continue;
        }
        if (!captionParagraph) continue;

        const imageChildren = imageParagraph.tagName === "p"
          ? imageParagraph.children?.filter((child) => child.type !== "text" || child.value?.trim())
          : undefined;
        const image = imageChildren?.length === 1 ? imageChildren[0] : undefined;
        const caption = textFromNode(captionParagraph).trim();

        if (image?.tagName !== "img" || captionParagraph.tagName !== "p" || !/^figure\s+\d+\s*[.:-]/i.test(caption)) continue;

        node.children.splice(index, 2, figure(image, {
          type: "element",
          tagName: "span",
          properties: {},
          children: captionParagraph.children || [],
        }));
      }

      node.children.forEach(visit);
    };
    visit(tree);
  };
}

function imageDimension(value: string) {
  const normalized = value.trim();
  return /^\d+(?:\.\d+)?(?:px|%|rem|em|vw|vh)?$/.test(normalized) ? normalized : undefined;
}

function remarkImageDimensions() {
  return (tree: MarkdownNode) => {
    const visit = (node: MarkdownNode) => {
      if (node.children) {
        for (let index = 0; index < node.children.length - 1; index += 1) {
          const image = node.children[index];
          const followingText = node.children[index + 1];
          if (image.type !== "image" || followingText.type !== "text" || !followingText.value) continue;

          const suffix = followingText.value.match(/^\{([^}]*)\}/);
          if (!suffix) continue;

          const dimensions: Record<string, string> = {};
          const attributes = suffix[1].matchAll(/\b(width|height)\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s}]+))/gi);
          for (const attribute of attributes) {
            const dimension = imageDimension(attribute[2] || attribute[3] || attribute[4] || "");
            if (dimension) dimensions[attribute[1].toLowerCase()] = dimension;
          }
          if (!Object.keys(dimensions).length) continue;

          image.data = { ...image.data, hProperties: { ...image.data?.hProperties, ...dimensions } };
          followingText.value = followingText.value.slice(suffix[0].length);
        }
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
}

export function renderMarkdown(markdown: string) {
  return String(
    remark()
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkImageDimensions)
      .use(remarkRehype)
      .use(rehypeKatex)
      .use(rehypeArticleHeadingIds)
      .use(rehypeExternalLinks)
      .use(rehypeFigureCaptions)
      .use(rehypeStringify)
      .processSync(markdown),
  );
}
