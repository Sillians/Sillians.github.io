import { getAllContent } from "@/lib/content";

export const dynamic = "force-static";

const siteUrl = "https://sillians.github.io";

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;",
  })[character] || character);
}

export function GET() {
  const posts = getAllContent("writing");
  const items = posts.map((post) => {
    const url = `${siteUrl}/writing/${post.slug}/`;
    return `
      <item>
        <title>${escapeXml(post.title)}</title>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
        <description>${escapeXml(post.description)}</description>
        <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
      </item>`;
  }).join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Basil Ihuoma — Writing</title>
        <link>${siteUrl}/writing/</link>
        <description>Technical notes on machine learning systems, evaluation, reliability, and production AI.</description>
        <language>en</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
      </channel>
    </rss>`;

  return new Response(feed, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
