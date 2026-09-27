/**
 * About の内容（経歴・スキル・ツール・やりたい仕事）。materials/01_profile/profile.md から起こす。
 * ⚠️ サンプル。年・所属は確認できたものだけ。雇用先・顧客名を書くかは本人が決める（書かないのが既定）。
 */
import portrait from "@/assets/images/profile/portrait.jpg";
import type { Profile } from "./types";

export const profile: Profile = {
  lead: {
    ja: "ここに 2〜3 行の自己紹介を書きます（サンプル文）。何を大事にして作っているかを一言で。",
    zh: "在这里写 2–3 行的自我介绍（示例文字）。一句话说清你做东西时最在意什么。",
    en: "A two- or three-line introduction goes here (sample text): what you care about when you make things.",
  },
  timeline: [
    { period: "2020–2024", text: { ja: "○○大学 ○○学科（サンプル）", zh: "○○大学 ○○专业（示例）", en: "BA, ○○ University (sample)" } },
    { period: "2024–", text: { ja: "フリーランス（サンプル）", zh: "自由职业（示例）", en: "Freelance (sample)" } },
  ],
  skills: {
    ja: ["アートディレクション", "グラフィックデザイン", "パターンメイキング", "Web デザイン・実装"],
    zh: ["艺术指导", "平面设计", "服装制版", "网页设计与开发"],
    en: ["Art direction", "Graphic design", "Pattern making", "Web design & build"],
  },
  tools: ["Figma", "Illustrator", "Photoshop", "CLO 3D", "Claude Code", "Next.js"],
  interests: {
    ja: ["やってみたい仕事・関わりたい分野を書きます（サンプル文）。"],
    zh: ["写下想做的工作、想参与的领域（示例文字）。"],
    en: ["The kind of work and fields you want to be part of (sample text)."],
  },
  portrait: {
    src: portrait,
    alt: { ja: "本人の写真（占位画像）", zh: "本人照片（占位图）", en: "Portrait (placeholder)" },
  },
};
