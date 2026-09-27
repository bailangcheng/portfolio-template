import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageIntro } from "@/components/ui/PageIntro";
import { pick } from "@/content/pick";
import { processContent } from "@/content/process";
import { alternatesFor, type Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "process" });
  return { title: t("title"), description: pick(processContent.lead, locale), alternates: alternatesFor(locale as Locale, "/process") };
}

/** Process: このサイトの作り方（AI と作った過程）。手順は番号付きの縦並び、右に使った道具。 */
export default async function ProcessPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("process");

  return (
    <>
      <PageIntro eyebrow={t("eyebrow").toUpperCase()} title={[t("title")]} lead={[pick(processContent.lead, locale)]} />

      <section aria-label={t("steps")} className="px-pad pb-[60px]">
        <ol>
          {processContent.steps.map((step, i) => (
            <li
              key={step.title.en}
              className="grid gap-4 border-t border-rule py-[38px] md:grid-cols-[0.65fr_1.4fr] md:gap-[6vw] md:py-[52px]"
            >
              <div data-reveal>
                <Eyebrow>{String(i + 1).padStart(2, "0")}</Eyebrow>
                <h2 className="text-heading md:text-heading-lg">{pick(step.title, locale)}</h2>
              </div>
              <div data-reveal className="max-w-[680px]">
                <div className="prose-block text-prose md:text-prose-lg">
                  {pick(step.body, locale).map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                {step.tools?.length ? <p className="mono mt-4 text-muted">{step.tools.join(" / ")}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section border-t border-rule">
        <div data-reveal>
          <Eyebrow>{t("stack").toUpperCase()}</Eyebrow>
        </div>
        <dl data-reveal className="grid max-w-[900px] grid-cols-[minmax(110px,0.35fr)_1fr] text-ui">
          {processContent.stack.map((s) => (
            <div key={s.label} className="contents">
              <dt className="border-b border-rule py-3 pr-4">{s.label}</dt>
              <dd className="border-b border-rule py-3 text-muted">{pick(s.note, locale)}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
