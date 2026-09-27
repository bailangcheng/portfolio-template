import { getTranslations } from "next-intl/server";
import { pick } from "@/content/pick";
import { navItems, site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { NavLinks } from "./NavLinks";

/**
 * ヘッダー。sticky ではない。
 * ≤800px: 折返し（ハンバーガー無し ―― 項目 3 つ + 言語切替で収まる設計。DESIGN.md「Layout」）。
 * ★ 名前は常にリンク（h1 にしない）。各ページ唯一の <h1> はページ側。
 */
export async function SiteHeader({ locale }: { locale: string }) {
  const t = await getTranslations();
  const name = pick(site.name, locale);
  const items = navItems.map((n) => ({ href: n.href, match: n.match, label: t(`nav.${n.key}`) }));

  return (
    <header className="relative z-[5] flex flex-wrap items-start justify-between gap-x-4 gap-y-3 px-pad pt-5 pb-4 md:flex-nowrap md:gap-[25px] md:pt-[25px]">
      <Link
        href="/"
        aria-label={t("a11y.home", { name })}
        className="text-[14px] leading-[1.4] tracking-[-0.02em] md:text-[15px]"
      >
        {name}
        {site.location ? (
          <small className="mt-1 block text-meta leading-[1.4] tracking-normal text-muted">
            {pick(site.location, locale)}
          </small>
        ) : null}
      </Link>
      <div className="flex items-start gap-5 md:gap-[40px]">
        <NavLinks items={items} label={t("a11y.mainNav")} />
        <LocaleSwitcher label={t("a11y.language")} />
      </div>
    </header>
  );
}
