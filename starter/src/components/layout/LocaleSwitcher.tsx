"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { localeMeta, routing } from "@/i18n/routing";

/**
 * 言語切替（JA / 中 / EN）。今いるページの同じパスへ飛ぶ。
 * 表示は短縮形、読み上げ・title は各言語の自称（日本語 / 中文 / English）。
 * ⚠️ hash（#contact 等）は引き継がない ―― Link の既定動作。必要なら後で足す。
 */
export function LocaleSwitcher({ label }: { label: string }) {
  const pathname = usePathname();
  const current = useLocale();

  return (
    <nav aria-label={label} className="pt-0.5">
      <ul className="flex gap-3 text-meta sm:text-nav">
        {routing.locales.map((l) => (
          <li key={l}>
            <Link
              href={pathname}
              locale={l}
              lang={l}
              hrefLang={l}
              aria-current={l === current ? "true" : undefined}
              aria-label={localeMeta[l].label}
              title={localeMeta[l].label}
              className={`-my-3 inline-block py-3 ${l === current ? "" : "text-muted hover:text-ink"}`}
            >
              <span className={`link-line ${l === current ? "[background-size:100%_1px]" : ""}`}>{localeMeta[l].short}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
