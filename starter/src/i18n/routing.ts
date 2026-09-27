import { defineRouting } from "next-intl/routing";

/**
 * i18n の単一 source of truth。
 *
 * ★ 言語を増やす/減らすとき: locales を変える + messages/<locale>.json + localeMeta。
 *   content の文言は L<T> = Record<Locale, T> なので、訳を書くまで型エラーになる
 *   （他言語で黙って埋めない ―― 「英語のまま混ざる」を型で止める）。
 *
 * localePrefix "as-needed" = 既定言語は URL に接頭辞を付けない（/works）。他は /zh/works・/en/works。
 * ⚠️ defaultLocale を公開後に変えると全 URL が変わる。決めてから公開する。
 */
export const routing = defineRouting({
  locales: ["ja", "zh", "en"],
  defaultLocale: "ja",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

/** 言語ごとの表示名（言語切替）と、<head> で読む CJK 字体（layout.tsx / DESIGN.md「Typography」）。 */
export const localeMeta: Record<Locale, { label: string; short: string; ogLocale: string }> = {
  ja: { label: "日本語", short: "JA", ogLocale: "ja_JP" },
  zh: { label: "中文", short: "中", ogLocale: "zh_CN" },
  en: { label: "English", short: "EN", ogLocale: "en_US" },
};

/** locale 付きの絶対パス（sitemap / canonical / hreflang 用）。既定言語は接頭辞なし。 */
export function localizedPath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  if (locale === routing.defaultLocale) return clean || "/";
  return `/${locale}${clean}`;
}

/** metadata.alternates（canonical + hreflang）。全ページがこれを使う。 */
export function alternatesFor(locale: Locale, path: string) {
  return {
    canonical: localizedPath(locale, path),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, localizedPath(l, path)])),
      "x-default": localizedPath(routing.defaultLocale, path),
    },
  };
}
