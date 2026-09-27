import Image from "next/image";
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { pick } from "@/content/pick";
import type { Img, Paragraphs } from "@/content/types";

/**
 * ケーススタディの部品。並び（1 タイトル → 9 次の作品）は works/[slug]/page.tsx が決める。
 * 節は 0.65 : 1.4 の非対称 2 列（左に番号+見出し、右に本文）。≤800 は縦積み。
 */

/** 節（番号 + 見出し + 本文 + 任意の図）。 */
export function CaseSection({ no, title, children }: { no: string; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-rule px-pad py-[50px] md:grid-cols-[0.65fr_1.4fr] md:gap-[6vw] md:py-[80px]">
      <div data-reveal>
        <Eyebrow>{no}</Eyebrow>
        <h2 className="text-heading md:text-heading-lg">{title}</h2>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export function Prose({ paragraphs }: { paragraphs: Paragraphs }) {
  return (
    <div data-reveal className="prose-block max-w-[680px] text-prose md:text-prose-lg">
      {paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

/** 4. 担当範囲・期間・ツール・クレジット。値が無い行は行ごと出さない（占位を出さない）。 */
export function FactsTable({ rows }: { rows: { label: string; value: ReactNode | undefined }[] }) {
  const present = rows.filter((r) => r.value !== undefined && r.value !== null);
  if (present.length === 0) return null;
  return (
    <dl data-reveal className="grid max-w-[680px] grid-cols-[minmax(90px,0.35fr)_1fr] text-ui">
      {present.map((r) => (
        <div key={r.label} className="contents">
          <dt className="border-b border-rule py-3 pr-4 text-muted">{r.label}</dt>
          <dd className="border-b border-rule py-3">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * 図の並び。1 枚 = 全幅、2 枚以上 = 2 列（縦長は縦長のまま、切り抜かない）。
 * ⚠️ 作品画像に色を乗せない・切り抜きで主体を切らない（DESIGN.md「Assets & Imagery」）。
 */
export function Figures({ images, locale, priority }: { images: readonly Img[]; locale: string; priority?: boolean }) {
  if (images.length === 0) return null;
  const single = images.length === 1;
  return (
    <div className={`mt-10 grid gap-6 md:gap-8 ${single ? "" : "md:grid-cols-2"}`}>
      {images.map((img, i) => (
        <figure key={img.src.src} data-reveal="media">
          <div className="overflow-hidden rounded-figure bg-media">
            <Image
              src={img.src}
              alt={pick(img.alt, locale)}
              placeholder="blur"
              priority={priority && i === 0}
              sizes={single ? "(min-width: 801px) 65vw, 100vw" : "(min-width: 801px) 32vw, 100vw"}
              className="h-auto w-full"
            />
          </div>
          {img.caption ? <figcaption className="mt-3 text-meta text-muted">{pick(img.caption, locale)}</figcaption> : null}
        </figure>
      ))}
    </div>
  );
}
