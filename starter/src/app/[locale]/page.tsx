import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { contactChannels } from "@/components/layout/social";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { JsonLd } from "@/components/ui/JsonLd";
import { SmartLink, TextLink } from "@/components/ui/SmartLink";
import { WorkRow } from "@/components/works/WorkRow";
import { toView } from "@/components/works/view";
import { pick } from "@/content/pick";
import { profile } from "@/content/profile";
import { site, siteConfig } from "@/content/site";
import { featuredWorks } from "@/content/works";
import { alternatesFor, type Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: { absolute: `${pick(site.name, locale)} — Portfolio` },
    alternates: alternatesFor(locale as Locale, "/"),
  };
}

/**
 * TOP: 首屏（名前 + 一句定位 + 主視覚）→ 精選作品 3〜4 → About 摘要 → 連絡先。
 * 非対称の分栏は首屏の下から（DESIGN.md「Layout」）。
 */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const featured = featuredWorks().map((w) => toView(w, locale, t(`categories.${w.category}`)));
  const channels = contactChannels(site.contact);
  const email = site.contact.email;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: pick(site.name, locale),
          url: siteConfig.url,
          ...(channels.length ? { sameAs: channels.map((c) => c.href) } : {}),
        }}
      />

      <Hero locale={locale} />

      {/* 01 / SELECTED WORK */}
      <section id="works" className="section scroll-mt-4">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-14">
          <div>
            <div data-reveal>
              <Eyebrow>01 / {t("home.selectedWorks").toUpperCase()}</Eyebrow>
            </div>
            <h2 data-reveal className="text-section">
              {t("home.selectedWorks")}
            </h2>
          </div>
          <div data-reveal>
            <TextLink href="/works" arrow="→">
              {t("home.allWorks")}
            </TextLink>
          </div>
        </div>
        {featured.map((w, i) => (
          <WorkRow
            key={w.slug}
            work={w}
            no={String(i + 1).padStart(2, "0")}
            reverse={i % 2 === 1}
            last={i === featured.length - 1}
            cta={t("work.label")}
          />
        ))}
      </section>

      {/* 02 / ABOUT（摘要） */}
      <section className="section grid items-center gap-[35px] md:grid-cols-[1.35fr_1fr] md:gap-[8vw]">
        <div>
          <div data-reveal>
            <Eyebrow>02 / {t("home.about").toUpperCase()}</Eyebrow>
          </div>
          <h2 data-reveal className="max-w-[680px] text-heading-lg md:text-section">
            {pick(site.tagline, locale)}
          </h2>
          <p data-reveal className="mt-7 mb-6 max-w-[520px] text-prose md:text-prose-lg">
            {pick(profile.lead, locale)}
          </p>
          <div data-reveal>
            <TextLink href="/about" arrow="↗">
              {t("home.moreAbout")}
            </TextLink>
          </div>
        </div>
        {profile.portrait ? (
          <div data-reveal="media" className="overflow-hidden rounded-media bg-media">
            <Image
              src={profile.portrait.src}
              alt={pick(profile.portrait.alt, locale)}
              placeholder="blur"
              sizes="(min-width: 801px) 38vw, 100vw"
              className="aspect-[4/5] w-full object-cover"
              style={profile.portrait.focus ? { objectPosition: profile.portrait.focus } : undefined}
            />
          </div>
        ) : null}
      </section>

      {/* 03 / CONTACT（独立ページは作らない。メール + SNS を直接） */}
      {email || channels.length > 0 ? (
        <section className="section border-t border-rule">
          <div data-reveal>
            <Eyebrow>03 / {t("home.contact").toUpperCase()}</Eyebrow>
          </div>
          <p data-reveal className="max-w-[640px] text-lead md:text-lead-lg">
            {t("about.contactLead")}
          </p>
          <ul data-reveal className="mt-8 flex flex-wrap gap-x-[30px] gap-y-3 text-ui">
            {email ? (
              <li>
                <SmartLink href={`mailto:${email}`} arrow="↗" className="link-line">
                  {email}
                </SmartLink>
              </li>
            ) : null}
            {channels.map((c) => (
              <li key={c.href}>
                <SmartLink href={c.href} arrow="↗" newTab className="link-line">
                  {c.label}
                </SmartLink>
              </li>
            ))}
            {site.contact.form ? (
              <li>
                <SmartLink href="/about#contact" arrow="→" className="link-line">
                  {t("contact.formTitle")}
                </SmartLink>
              </li>
            ) : null}
          </ul>
        </section>
      ) : null}
    </>
  );
}
