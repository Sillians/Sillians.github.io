"use client";

import Giscus from "@giscus/react";

export function Comments() {
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;
  if (!repoId || !categoryId) return null;

  return (
    <section className="comments" aria-label="Comments">
      <Giscus
        repo="Sillians/Sillians.github.io"
        repoId={repoId}
        category="Announcements"
        categoryId={categoryId}
        mapping="pathname"
        strict="1"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang="en"
        loading="lazy"
      />
    </section>
  );
}
