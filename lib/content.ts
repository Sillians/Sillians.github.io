import fs from "node:fs";
import path from "node:path";
import katex from "katex";
import "katex/dist/katex.min.css";

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
    if (split > -1)
      data[line.slice(0, split).trim()] = line
        .slice(split + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
  });
  const parts = path.split("/");
  const type = parts[parts.length - 2] as ContentType;
  const slug = parts.at(-1)!.replace(/\.mdx$/, "");
  const body = match[2].trim();

  if (type === "projects") {
    const missingSections = requiredProjectSections.filter(
      (section) => !new RegExp(`^## ${section}$`, "m").test(body),
    );
    if (missingSections.length) {
      throw new Error(
        `Project ${slug} is missing required sections: ${missingSections.join(", ")}`,
      );
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
  const types: ContentType[] = type
    ? [type]
    : ["projects", "research", "writing"];
  return types
    .flatMap((contentType) =>
      fs
        .readdirSync(path.join(contentRoot, contentType))
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

export function renderMarkdown(markdown: string) {
  const escaped = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const formatInline = (text: string) => {
    return (
      text
        // Inline math: $...$
        .replace(/\$([^$\n]+)\$/g, (_, expression) => {
          return katex.renderToString(expression, {
            throwOnError: false,
            displayMode: false,
          });
        })

        // Images
        .replace(
          /!\[([^\]]*)\]\(([^)\s]+)\)(?:\{width=(\d+)(?:\s+height=(\d+))?\})?/g,
          (_, alt, src, width, height) => {
            const style = [
              width ? `width: ${width}px` : "",
              height ? `height: ${height}px` : "",
            ]
              .filter(Boolean)
              .join("; ");

            return `
          <figure class="article-image">
            <img
              src="${src}"
              alt="${alt}"
              ${style ? `style="${style}"` : ""}
            />
          </figure>
        `.trim();
          },
        )

        // Links
        .replace(
          /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
        )

        // Bold
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

        // Inline code
        .replace(/`([^`]+)`/g, "<code>$1</code>")
    );
  };

  const lines = escaped.split("\n");
  const output: string[] = [];

  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      i++;
      continue;
    }

    // ----------------------------------------
    // Code block
    // ----------------------------------------

    if (line.startsWith("```")) {
      const codeLines: string[] = [];

      i++;

      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }

      i++;

      output.push(`<pre><code>${codeLines.join("\n")}</code></pre>`);

      continue;
    }

    // ----------------------------------------
    // H3
    // ----------------------------------------

    if (line.startsWith("### ")) {
      output.push(`<h3>${formatInline(line.slice(4))}</h3>`);
      i++;
      continue;
    }

    // ----------------------------------------
    // H2
    // ----------------------------------------

    if (line.startsWith("## ")) {
      output.push(`<h2>${formatInline(line.slice(3))}</h2>`);
      i++;
      continue;
    }

    // ----------------------------------------
    // H1
    // ----------------------------------------

    if (line.startsWith("# ")) {
      output.push(`<h1>${formatInline(line.slice(2))}</h1>`);
      i++;
      continue;
    }

    // ----------------------------------------
    // Markdown table
    // ----------------------------------------

    if (
      i + 1 < lines.length &&
      line.includes("|") &&
      /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(lines[i + 1])
    ) {
      const parseRow = (row: string) =>
        row
          .trim()
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((cell) => cell.trim());

      const headers = parseRow(line);
      const separator = parseRow(lines[i + 1]);

      i += 2;

      const rows: string[][] = [];

      while (i < lines.length && lines[i].includes("|")) {
        rows.push(parseRow(lines[i]));
        i++;
      }

      const getAlignment = (cell: string) => {
        const value = cell.trim();

        if (value.startsWith(":") && value.endsWith(":")) {
          return "center";
        }

        if (value.endsWith(":")) {
          return "right";
        }

        return "left";
      };

      const headerHtml = headers
        .map((header, index) => {
          const align = getAlignment(separator[index] || "");

          return `<th style="text-align: ${align}">${formatInline(
            header,
          )}</th>`;
        })
        .join("");

      const bodyHtml = rows
        .map((row) => {
          const cells = row
            .map((cell, index) => {
              const align = getAlignment(separator[index] || "");

              return `<td style="text-align: ${align}">${formatInline(
                cell,
              )}</td>`;
            })
            .join("");

          return `<tr>${cells}</tr>`;
        })
        .join("");

      output.push(
        `
        <div class="article-table">
          <table>
            <thead>
              <tr>${headerHtml}</tr>
            </thead>
            <tbody>
              ${bodyHtml}
            </tbody>
          </table>
        </div>
      `.trim(),
      );

      continue;
    }

    // ----------------------------------------
    // Unordered list
    // ----------------------------------------

    if (line.startsWith("- ")) {
      const items: string[] = [];

      while (i < lines.length) {
        const currentLine = lines[i].trim();

        if (!currentLine.startsWith("- ")) {
          break;
        }

        const item = currentLine.slice(2).trim();

        items.push(`<li>${formatInline(item)}</li>`);

        i++;
      }

      output.push(`<ul>${items.join("")}</ul>`);

      continue;
    }

    // ----------------------------------------
    // Image / figure
    // ----------------------------------------

    const imageMatch = line.match(
      /^!\[([^\]]*)\]\(([^)\s]+)\)(?:\{width=(\d+)(?:\s+height=(\d+))?\})?\s*$/,
    );

    if (imageMatch) {
      const [, alt, src, width, height] = imageMatch;

      const style = [
        width ? `width: ${width}px` : "",
        height ? `height: ${height}px` : "",
      ]
        .filter(Boolean)
        .join("; ");

      i++;

      // The next non-empty line is treated as the caption
      let caption = "";

      if (i < lines.length && lines[i].trim()) {
        caption = lines[i].trim();
        i++;
      }

      output.push(
        `
    <figure class="article-image">
      <img
        src="${src}"
        alt="${alt}"
        ${style ? `style="${style}"` : ""}
      />
      ${caption ? `<figcaption>${formatInline(caption)}</figcaption>` : ""}
    </figure>
  `.trim(),
      );

      continue;
    }

    // ----------------------------------------
    // Display math
    // ----------------------------------------

    if (line === "$$") {
      const mathLines: string[] = [];

      i++;

      while (i < lines.length && lines[i].trim() !== "$$") {
        mathLines.push(lines[i]);
        i++;
      }

      i++;

      const expression = mathLines.join("\n");

      const renderedMath = katex.renderToString(expression, {
        throwOnError: false,
        displayMode: true,
      });

      output.push(`<div class="article-math">${renderedMath}</div>`);

      continue;
    }

    // ----------------------------------------
    // Paragraph
    // ----------------------------------------

    const paragraphLines: string[] = [line];

    i++;

    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("# ") &&
      !lines[i].trim().startsWith("## ") &&
      !lines[i].trim().startsWith("### ") &&
      !lines[i].trim().startsWith("- ") &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith("![")
    ) {
      paragraphLines.push(lines[i].trim());
      i++;
    }

    output.push(`<p>${formatInline(paragraphLines.join(" "))}</p>`);
  }

  return output.join("");
}

// export function renderMarkdown(markdown: string) {
//   const escaped = markdown
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;");
//   return escaped
//     .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
//     .replace(/^## (.*)$/gm, "<h2>$1</h2>")
//     .replace(/^### (.*)$/gm, "<h3>$1</h3>")
//     .replace(/^\- (.*)$/gm, "<li>$1</li>")
//     .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
//     .replace(/`(.*?)`/g, "<code>$1</code>")
//     .split(/\n\n+/)
//     .map((block) =>
//       block.startsWith("<h") || block.startsWith("<pre")
//         ? block
//         : block.startsWith("<li>")
//           ? `<ul>${block}</ul>`
//           : `<p>${block.replace(/\n/g, " ")}</p>`,
//     )
//     .join("");
// }
