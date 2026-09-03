import type { TableOfContentsItem } from "@/lib/content";

export function ArticleContents({ items }: { items: TableOfContentsItem[] }) {
  if (!items.length) return null;

  return (
    <aside className="article-contents" aria-label="Table of contents">
      <nav>
        <p>Contents</p>
        <ol>
          {items.map((item) => (
            <li className={`toc-level-${item.level}`} key={item.id}>
              <a href={`#${item.id}`}>{item.title}</a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
