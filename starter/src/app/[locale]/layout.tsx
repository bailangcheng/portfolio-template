import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import "../globals.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { pick } from "@/content/pick";
import { site, siteConfig } from "@/content/site";
import { localeMeta, routing, type Locale } from "@/i18n/routing";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f3f1",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const name = pick(site.name, locale);
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: `${name} — Portfolio`, template: `%s — ${name}` },
    description: pick(site.description, locale),
    openGraph: { type: "website", siteName: name, locale: localeMeta[locale as Locale]?.ogLocale },
    twitter: { card: "summary_large_image" },
  };
}

/**
 * 言語ごとの字体（DESIGN.md「Typography」）。Latin は全言語 Manrope + DM Mono。
 * CJK は **その言語の 1 書体だけ** 読む（ja ページで SC を読まない ―― 数 MB 単位で重い）。
 * ⚠️ font-src / style-src は next.config.ts の CSP と一致させること。
 */
const LATIN = "family=DM+Mono:wght@400&family=Manrope:wght@400;500;600";
const CJK: Record<Locale, string> = {
  ja: "&family=Noto+Sans+JP:wght@400;500",
  zh: "&family=Noto+Sans+SC:wght@400;500",
  en: "",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    // suppressHydrationWarning: 下の head スクリプトが描画前に html へ class を足すため（意図的な差分）
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* スクロール演出の準備: 描画前に html.js を付け、初期状態（非表示）を CSS で当てる。
            3 秒以内に MotionProvider が起動しなければ .reveal-fallback で強制表示（アニメのせいで内容が消えない）。 */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.add('reveal-fallback')},3000)})();",
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* ⚠️ next/font/google は Turbopack 非互換で 500（LESSONS.md B-02）。<link> で読む。
            字重は DESIGN.md のものだけ（Manrope 400/500/600・DM Mono 400・Noto 400/500）。 */}
        <link href={`https://fonts.googleapis.com/css2?${LATIN}${CJK[locale]}&display=swap`} rel="stylesheet" />
      </head>
      {/* id="top": footer の「ページの先頭へ」の着地点 */}
      <body id="top">
        <NextIntlClientProvider>
          <SkipLink />
          <SiteHeader locale={locale} />
          {/* tabIndex=-1: スキップリンク作動時に <main> へフォーカスを移す（Safari 対策） */}
          <main id="main" tabIndex={-1} className="focus:outline-none">
            {children}
          </main>
          <SiteFooter locale={locale} />
          <MotionProvider />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
