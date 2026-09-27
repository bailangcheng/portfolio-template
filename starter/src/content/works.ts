/**
 * 作品データの入口。★ この配列の順 = 一覧の順 = 「次の作品」の順。
 *
 * 作品を足す: src/content/works/<slug>.ts を作る（既存をコピー）→ ここに 1 行 →
 *   画像は `npm run images -- <materials の作品フォルダ> <slug>` → docs/ASSET-SOURCES.md に行を足す。
 *   手順の全体は .claude/skills/add-work/SKILL.md。
 * 作品を外す: ここから外すだけで一覧・詳細・sitemap から消える（ファイルと画像も消すこと）。
 */
import type { Work } from "./types";
import { graduationCollection } from "./works/graduation-collection";
import { posterCampaign } from "./works/poster-campaign";
import { thisSite } from "./works/this-site";

export const works: readonly Work[] = [graduationCollection, posterCampaign, thisSite];

export function getWork(slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}

export function featuredWorks(): readonly Work[] {
  return works.filter((w) => w.featured).slice(0, 4);
}

/** 次の作品（末尾なら先頭へ戻る）。作品が 1 件なら undefined。 */
export function nextWork(slug: string): Work | undefined {
  if (works.length < 2) return undefined;
  const i = works.findIndex((w) => w.slug === slug);
  return works[(i + 1) % works.length];
}

// slug の重複はビルド時に落とす（同じ URL が 2 つあると後勝ちで静かに片方が消える）
const seen = new Set<string>();
for (const w of works) {
  if (seen.has(w.slug)) throw new Error(`[works] duplicate slug "${w.slug}"`);
  seen.add(w.slug);
}
