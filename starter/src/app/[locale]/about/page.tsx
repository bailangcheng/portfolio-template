import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { contactChannels } from "@/components/layout/social";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageIntro } from "@/components/ui/PageIntro";
import { SmartLink } from "@/components/ui/SmartLink";
import { pick } from "@/content/pick";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { alternatesFor, type Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title"), description: pick(profile.lead, locale), alternates: alternatesFor(locale as Locale, "/about") };
}

/**
 * About: 経歴・スキル・ツール・やりたい仕事 → #contact（メール・SNS・任意でフォーム）。
 * 連絡先は独立ページを作らず、ここと footer に置く。
 */
export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const channels = contactChannels(site.contact);
  const email = site.contact.email;

  const block = (title: string, children: React.ReactNode, first = false) => (
    <section className={first ? "" : "mt-[45px] border-t border-rule pt-10"}>
      <h2 data-reveal className="mb-6 text-heading md:text-heading-lg">
        {title}
      </h2>
      {children}
    </section>
  );

  return (
    <>
      <PageIntro eyebrow="ABOUT" title={[pick(site.name, locale)]} lead={[pick(profile.lead, locale)]} />

      <div className="grid gap-[35px] px-pad pb-[65px] md:grid-cols-[1.35fr_1fr] md:gap-[8vw] md:pb-[100px]">
        <div className="min-w-0 py-4">
          {block(
            t("timeline"),
            <dl data-reveal className="grid max-w-[640px] grid-cols-[minmax(90px,0.3fr)_1fr] text-ui">
              {profile.timeline.map((row) => (
                <div key={row.period} className="contents">
                  <dt className="mono border-b border-rule py-3 pr-4 text-muted">{row.period}</dt>
                  <dd className="border-b border-rule py-3">{pick(row.text, locale)}</dd>
                </div>
              ))}
            </dl>,
            true,
          )}
          {block(
            t("skills"),
            <ul data-reveal className="flex max-w-[640px] flex-wrap gap-2 text-ui">
              {pick(profile.skills, locale).map((s) => (
                <li key={s} className="rounded-full border border-rule px-4 py-1.5">
                  {s}
                </li>
              ))}
            </ul>,
          )}
          {block(
            t("tools"),
            <p data-reveal className="mono max-w-[640px] text-[12px] text-muted">
              {profile.tools.join(" / ")}
            </p>,
          )}
          {block(
            t("interests"),
            <div data-reveal className="prose-block max-w-[640px] text-prose md:text-prose-lg">
              {pick(profile.interests, locale).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>,
          )}
        </div>

        {profile.portrait ? (
          <div data-reveal="media" className="self-start overflow-hidden rounded-media bg-media md:sticky md:top-8">
            <Image
              src={profile.portrait.src}
              alt={pick(profile.portrait.alt, locale)}
              placeholder="blur"
              priority
              sizes="(min-width: 801px) 38vw, 100vw"
              className="aspect-[4/5] w-full object-cover"
              style={profile.portrait.focus ? { objectPosition: profile.portrait.focus } : undefined}
            />
          </div>
        ) : null}
      </div>

      {/* #contact: footer・TOP からのリンク先 */}
      <section id="contact" className="section scroll-mt-4 grid gap-10 border-t border-rule md:grid-cols-[1fr_1.35fr] md:gap-[8vw]">
        <div>
          <div data-reveal>
            <Eyebrow>{t("contact").toUpperCase()}</Eyebrow>
          </div>
          <p data-reveal className="max-w-[420px] text-lead md:text-lead-lg">
            {t("contactLead")}
          </p>
          <ul data-reveal className="mt-8 flex flex-col gap-3 text-ui">
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
                  {c.label} <span className="text-muted">— {c.display}</span>
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
        {site.contact.form ? (
          <div data-reveal>
            <ContactForm />
          </div>
        ) : null}
      </section>
    </>
  );
}
