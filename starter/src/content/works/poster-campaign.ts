/**
 * サンプル作品（Graphic・Ad）。⚠️ 文言・画像ともに占位。
 * 最小構成の例: outcome.body なし・credits なし（= その行は画面に出ない）。
 */
import type { Work } from "../types";
import cover from "@/assets/images/works/poster-campaign/cover.jpg";
import p1 from "@/assets/images/works/poster-campaign/process-01.jpg";
import o1 from "@/assets/images/works/poster-campaign/01.jpg";
import o2 from "@/assets/images/works/poster-campaign/02.jpg";

export const posterCampaign: Work = {
  slug: "poster-campaign",
  category: "graphic",
  year: "2024",
  featured: true,
  title: { ja: "展覧会ポスター（サンプル）", zh: "展览海报（示例）", en: "Exhibition Posters (sample)" },
  cover: {
    src: cover,
    alt: { ja: "ポスターのキービジュアル（占位画像）", zh: "海报主视觉（占位图）", en: "Poster key visual (placeholder)" },
    focus: "50% 45%",
  },
  summary: {
    ja: "2 色刷りで展示の「静けさ」を伝えるポスター連作。",
    zh: "用双色印刷传达展览「静谧感」的海报系列。",
    en: "A two-colour poster series about the quiet of an exhibition.",
  },
  facts: {
    role: { ja: "アートディレクション・デザイン", zh: "艺术指导・设计", en: "Art direction, design" },
    tools: ["Illustrator", "Photoshop"],
  },
  background: {
    ja: ["課題・背景（サンプル文）。"],
    zh: ["课题与背景（示例文字）。"],
    en: ["Brief and background (sample text)."],
  },
  process: {
    body: {
      ja: ["配色とタイポグラフィの比較検討（サンプル文）。"],
      zh: ["配色与字体排印的比较推敲（示例文字）。"],
      en: ["Comparing colour and typography options (sample text)."],
    },
    images: [
      {
        src: p1,
        alt: { ja: "配色の比較（占位画像）", zh: "配色比较（占位图）", en: "Colour comparisons (placeholder)" },
        caption: { ja: "配色の比較", zh: "配色比较", en: "Colour studies" },
      },
    ],
  },
  outcome: {
    images: [
      { src: o1, alt: { ja: "ポスター A（占位画像）", zh: "海报 A（占位图）", en: "Poster A (placeholder)" } },
      { src: o2, alt: { ja: "ポスター B（占位画像）", zh: "海报 B（占位图）", en: "Poster B (placeholder)" } },
    ],
  },
  reflection: {
    ja: ["振り返り（サンプル文）。"],
    zh: ["回顾（示例文字）。"],
    en: ["Reflection (sample text)."],
  },
};
