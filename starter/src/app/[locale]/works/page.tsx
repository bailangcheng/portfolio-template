import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageIntro } from "@/components/ui/PageIntro";
import { WorksIndex } from "@/components/works/WorksIndex";
import { toView } from "@/components/works/view";
import { categories } from "@/content/site";
import { works } from "@/content/works";
import { alternatesFor, type Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "works" });
  return { title: t("title"), description: t("lead"), alternates: alternatesFor(locale as Locale, "/works") };
}

/** 作品一覧（Fashion / Graphic・Ad / Web で絞り込み）。並びは works.ts の順。 */
export default async function WorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const label = (c: string) => t(`categories.${c}`);
  // 1 件も無いカテゴリはボタンを出さない（押しても空になるだけの選択肢を作らない）
  const used = categories.filter((c) => works.some((w) => w.category === c));

  return (
    <>
      <PageIntro eyebrow="WORKS" title={[t("works.title")]} lead={[t("works.lead")]} />
      <div className="px-pad pb-[90px]">
        <WorksIndex
          works={works.map((w) => toView(w, locale, label(w.category)))}
          categories={used.map((c) => ({ key: c, label: label(c) }))}
        />
      </div>
    </>
  );
}
