import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "@/components/ui/ArrowUpRight";
import { SmartLink } from "@/components/ui/SmartLink";
import { pick } from "@/content/pick";
import { site } from "@/content/site";
import { contactChannels } from "./social";

/**
 * 深色 footer。連絡先は独立ページを作らず、ここと About（#contact）に置く（sitemap 方針）。
 * 大きなメールアドレス（mailto）→ SNS チップ。
 * ⚠️ 表示するのは本人確認済みのアドレスだけ（site.contact。null は出さない）。
 */
export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations();
  const channels = contactChannels(site.contact);
  const email = site.contact.email;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 flex min-h-[400px] flex-col justify-between rounded-t-[22px] bg-footer px-pad py-[30px] text-footer-ink md:min-h-[460px] md:rounded-t-footer">
      <div className="flex justify-between gap-[25px] text-meta">
        <span>
          © {year} {pick(site.name, locale)}
        </span>
        {site.location ? <span>{pick(site.location, locale)}</span> : null}
      </div>

      <div data-reveal className="py-[55px] text-center md:py-[65px]">
        <p className="mb-[22px] text-ui text-footer-muted">{t("home.contact")}</p>
        {email ? (
          <a
            href={`mailto:${email}`}
            className="group inline-flex max-w-full items-center gap-[0.22em] break-all text-[clamp(26px,7.4vw,48px)] leading-[1.1] tracking-[-0.04em] md:text-footer-cta-lg"
          >
            {email}
            <ArrowUpRight className="size-[0.62em] shrink-0 translate-y-[0.04em] transition-transform duration-[var(--dur-hover)] ease-[var(--ease-out)] group-hover:translate-x-[0.08em] group-hover:-translate-y-[0.04em]" />
          </a>
        ) : (
          <SmartLink href="/about#contact" className="text-footer-cta md:text-footer-cta-lg">
            {t("about.contact")}
          </SmartLink>
        )}
        {channels.length > 0 ? (
          <ul aria-label={t("a11y.social")} className="mt-8 flex flex-wrap justify-center gap-[14px] text-nav">
            {channels.map((s) => (
              <li key={s.href}>
                <SmartLink
                  href={s.href}
                  newTab
                  className="inline-block rounded-full border border-footer-line px-[17px] py-[7px] text-footer-muted transition-colors duration-[var(--dur-hover)] ease-[var(--ease-out)] hover:border-footer-ink hover:bg-footer-ink hover:text-footer"
                >
                  {s.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="flex justify-between gap-[25px] text-micro text-footer-muted md:text-meta">
        <span>{pick(site.tagline, locale)}</span>
        <a href="#top" className="link-line shrink-0">
          {t("a11y.backToTop")}{" "}
          <span className="link-arrow" data-dir="up" aria-hidden="true">
            ↑
          </span>
        </a>
      </div>
    </footer>
  );
}
