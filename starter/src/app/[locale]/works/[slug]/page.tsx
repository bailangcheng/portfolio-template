import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageIntro } from "@/components/ui/PageIntro";
import { SmartLink } from "@/components/ui/SmartLink";
import { CaseSection, FactsTable, Figures, Prose } from "@/components/works/CaseStudy";
import { pick } from "@/content/pick";
import { site, siteConfig } from "@/content/site";
import { getWork, nextWork, works } from "@/content/works";
import { alternatesFor, localizedPath, routing, type Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string; slug: string }> };

/** works.ts にある作品だけを生成。それ以外は 404（dynamicParams = false）。 */
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => works.map((w) => ({ locale, slug: w.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const work = getWork(slug);
  if (!work) return {};
  const { src } = work.cover;
  return {
    title: pick(work.title, locale),
    description: pick(work.summary, locale),
    alternates: alternatesFor(locale as Locale, `/works/${slug}`),
    // OG 画像 = キービジュアル（Next/Vercel の最適化 URL ではなく元ファイル）
    openGraph: { images: [{ url: src.src, width: src.width, height: src.height, alt: pick(work.cover.alt, locale) }] },
  };
}

/**
 * 作品詳細（ケーススタディ）。表示順は固定:
 *   1 タイトル（作品名・カテゴリ・年）→ 2 キービジュアル → 3 概要（40 字以内）→ 4 担当範囲・期間・ツール・クレジット
 *   → 5 課題・背景 → 6 プロセス → 7 成果 → 8 振り返り → 9 次の作品
 * ⚠️ 本文は materials の text.md が出典。成果・数字・顧客名を書き足さない。
 */
export default async function WorkPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const work = getWork(slug);
  if (!work) notFound();
  const t = await getTranslations();
  const next = nextWork(slug);
  const category = t(`categories.${work.category}`);
  const title = pick(work.title, locale);

  const facts = [
    { label: t("work.role"), value: work.facts.role ? pick(work.facts.role, locale) : undefined },
    { label: t("work.period"), value: work.facts.period ? pick(work.facts.period, locale) : undefined },
    { label: t("work.tools"), value: work.facts.tools?.length ? work.facts.tools.join(" / ") : undefined },
    {
      label: t("work.credits"),
      value: work.facts.credits ? (
        <ul>
          {pick(work.facts.credits, locale).map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      ) : undefined,
    },
  ];

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: title,
          abstract: pick(work.summary, locale),
          genre: category,
          ...(work.year ? { dateCreated: work.year } : {}),
          creator: { "@type": "Person", name: pick(site.name, locale) },
          image: new URL(work.cover.src.src, siteConfig.url).toString(),
          url: new URL(localizedPath(locale as Locale, `/works/${slug}`), siteConfig.url).toString(),
        }}
      />

      {/* 1. タイトル + 3. 概要 */}
      <PageIntro
        eyebrow={
          <>
            <SmartLink href="/works" className="link-line">
              {t("work.label")}
            </SmartLink>{" "}
            / {category.toUpperCase()}
          </>
        }
        title={[title]}
        lead={[pick(work.summary, locale)]}
        meta={[category, work.year].filter((v): v is string => Boolean(v))}
      />

      {/* 2. キービジュアル */}
      <figure data-reveal className="mx-pad overflow-hidden rounded-[22px] bg-media">
        <Image
          src={work.cover.src}
          alt={pick(work.cover.alt, locale)}
          priority
          placeholder="blur"
          data-parallax
          sizes="100vw"
          className="aspect-[1.3] max-h-[720px] w-full object-cover md:aspect-[1.9]"
          style={work.cover.focus ? { objectPosition: work.cover.focus } : undefined}
        />
      </figure>

      <div className="mt-[50px] md:mt-[80px]">
        {/* 4. 担当範囲・期間・ツール・クレジット（値の無い行は出ない。全部無ければ節ごと出ない） */}
        {facts.some((f) => f.value !== undefined) ? (
          <CaseSection no="01" title={t("work.facts")}>
            <FactsTable rows={facts} />
          </CaseSection>
        ) : null}

        {/* 5. 課題・背景 */}
        <CaseSection no="02" title={t("work.background")}>
          <Prose paragraphs={pick(work.background, locale)} />
        </CaseSection>

        {/* 6. プロセス */}
        <CaseSection no="03" title={t("work.process")}>
          <Prose paragraphs={pick(work.process.body, locale)} />
          <Figures images={work.process.images} locale={locale} />
        </CaseSection>

        {/* 7. 成果 */}
        <CaseSection no="04" title={t("work.outcome")}>
          {work.outcome.body ? <Prose paragraphs={pick(work.outcome.body, locale)} /> : null}
          <Figures images={work.outcome.images} locale={locale} />
          {work.links?.length ? (
            <ul data-reveal className="mt-8 flex flex-wrap gap-x-[30px] gap-y-3 text-ui">
              {work.links.map((l) => (
                <li key={l.href}>
                  <SmartLink href={l.href} arrow="↗" newTab={!l.href.startsWith("/")} className="link-line">
                    {pick(l.label, locale)}
                  </SmartLink>
                </li>
              ))}
            </ul>
          ) : null}
        </CaseSection>

        {/* 8. 振り返り */}
        <CaseSection no="05" title={t("work.reflection")}>
          <Prose paragraphs={pick(work.reflection, locale)} />
        </CaseSection>
      </div>

      {/* 9. 次の作品 + 一覧 */}
      <nav className="flex flex-col gap-8 border-t border-rule px-pad pt-[50px] pb-[70px] md:flex-row md:items-end md:justify-between md:pb-[100px]">
        {next ? (
          <SmartLink href={`/works/${next.slug}`} className="group block max-w-[720px]">
            <span className="mono text-muted">{t("work.next")}</span>
            <span className="mt-3 block text-title md:text-title-lg">
              <span className="link-line">{pick(next.title, locale)}</span>{" "}
              <span className="link-arrow" data-dir="right" aria-hidden="true">
                →
              </span>
            </span>
          </SmartLink>
        ) : (
          <span />
        )}
        <SmartLink href="/works" arrow="←" className="link-line text-[18px]">
          {t("work.allWorks")}
        </SmartLink>
      </nav>
    </article>
  );
}
