/**
 * 名前・一句定位・連絡先・SNS・首屏の主視覚 ＋ ナビと本番 URL の単一 source of truth。
 *
 * ★ ナビ・sitemap はここの配列を読む（1 箇所変えれば全部つながる）。
 * ⚠️ 下の値は starter の仮の値。`npm run placeholders` が残りを列挙する（公開前に 0 件にする）。
 */
import type { SiteContent, WorkCategory } from "./types";

export const siteConfig = {
  /**
   * canonical / sitemap / OGP / robots が参照する本番 URL。
   * ⚠️ `??` ではなく `||`（未設定の env は空文字で来ることがある）。→ LESSONS.md R-02 / R-03
   * 優先: 明示設定 > Vercel の本番ドメイン（ビルド時に自動注入）> ローカル。
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
} as const;

export const site: SiteContent = {
  name: { ja: "山田 花子", zh: "山田 花子", en: "Hanako Yamada" },
  tagline: {
    ja: "服と紙とスクリーンのあいだで、伝わるかたちを考えています。",
    zh: "在服装、纸面与屏幕之间，思考能被理解的形态。",
    en: "Designing forms that communicate — across fabric, paper and screen.",
  },
  description: {
    ja: "山田 花子のポートフォリオ（サンプル）。ファッション・グラフィック・Web の作品とプロセス。",
    zh: "山田 花子的作品集（示例）。服装、平面与网页作品及其过程。",
    en: "Portfolio of Hanako Yamada (sample): fashion, graphic and web work, with the process behind it.",
  },
  location: { ja: "東京", zh: "东京", en: "Tokyo" },
  hero: {
    title: {
      ja: ["かたちで、", "伝える。"],
      zh: ["用形态，", "去传达。"],
      en: ["Making ideas", "take shape."],
    },
    // 切り替え: { kind: "image", image: {...} } / { kind: "three", scene: "sample" }（DESIGN.md「First view」）
    visual: { kind: "grid" },
  },
  contact: {
    email: "hello@example.com",
    form: true,
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/example" },
      { label: "GitHub", href: "https://github.com/example" },
    ],
  },
};

/** 主ナビ。ラベルは messages の nav.<key>。 */
export const navItems = [
  { key: "works", href: "/works", match: "/works" },
  { key: "about", href: "/about", match: "/about" },
  { key: "process", href: "/process", match: "/process" },
] as const;

export type NavKey = (typeof navItems)[number]["key"];

/** 作品のカテゴリ（/works の絞り込みの順）。ラベルは messages の categories.<key>。 */
export const categories: readonly WorkCategory[] = ["fashion", "graphic", "web"];

/** sitemap の静的ルート（作品詳細は works.ts から足す）。 */
export const staticRoutes = ["/", "/works", "/about", "/process"] as const;
