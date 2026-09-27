import type { StaticImageData } from "next/image";
import { pick } from "@/content/pick";
import type { Work } from "@/content/types";

/**
 * 一覧・カード用に 1 言語へ解決した作品。client component（WorksIndex）へ渡すため、関数や L<T> を含まない。
 */
export type WorkView = {
  slug: string;
  href: string;
  category: Work["category"];
  categoryLabel: string;
  year?: string;
  title: string;
  summary: string;
  cover: { src: StaticImageData; alt: string; focus?: string };
};

export function toView(work: Work, locale: string, categoryLabel: string): WorkView {
  return {
    slug: work.slug,
    href: `/works/${work.slug}`,
    category: work.category,
    categoryLabel,
    year: work.year,
    title: pick(work.title, locale),
    summary: pick(work.summary, locale),
    cover: { src: work.cover.src, alt: pick(work.cover.alt, locale), focus: work.cover.focus },
  };
}
