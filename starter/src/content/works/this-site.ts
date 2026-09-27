/**
 * サンプル作品（Web）: このサイト自体。/process（作り方のページ）へつなぐ例。
 * ⚠️ 文言・画像ともに占位。
 */
import type { Work } from "../types";
import cover from "@/assets/images/works/this-site/cover.jpg";
import p1 from "@/assets/images/works/this-site/process-01.jpg";
import o1 from "@/assets/images/works/this-site/01.jpg";

export const thisSite: Work = {
  slug: "this-site",
  category: "web",
  year: "2025",
  featured: true,
  title: { ja: "このポートフォリオサイト（サンプル）", zh: "这个作品集网站（示例）", en: "This Portfolio Site (sample)" },
  cover: {
    src: cover,
    alt: { ja: "サイトのトップ画面（占位画像）", zh: "网站首页（占位图）", en: "The site’s home page (placeholder)" },
  },
  summary: {
    ja: "AI と一緒に、設計から公開までを自分で行った Web サイト。",
    zh: "与 AI 一起，从设计到上线都由自己完成的网站。",
    en: "A website I designed and shipped myself, working alongside AI.",
  },
  facts: {
    role: { ja: "企画・デザイン・実装", zh: "企划・设计・开发", en: "Planning, design, development" },
    tools: ["Figma", "Claude Code", "Next.js", "GSAP", "Vercel"],
  },
  background: {
    ja: ["課題・背景（サンプル文）。"],
    zh: ["课题与背景（示例文字）。"],
    en: ["Brief and background (sample text)."],
  },
  process: {
    body: {
      ja: ["詳しい作り方は Process ページにまとめています（サンプル文）。"],
      zh: ["详细做法整理在 Process 页面（示例文字）。"],
      en: ["The full making-of lives on the Process page (sample text)."],
    },
    images: [
      {
        src: p1,
        alt: { ja: "ワイヤーフレーム（占位画像）", zh: "线框图（占位图）", en: "Wireframes (placeholder)" },
        caption: { ja: "ワイヤーフレーム", zh: "线框图", en: "Wireframes" },
      },
    ],
  },
  outcome: {
    images: [{ src: o1, alt: { ja: "完成画面（占位画像）", zh: "完成画面（占位图）", en: "Finished screens (placeholder)" } }],
  },
  reflection: {
    ja: ["振り返り（サンプル文）。"],
    zh: ["回顾（示例文字）。"],
    en: ["Reflection (sample text)."],
  },
  links: [{ label: { ja: "作り方を見る", zh: "查看做法", en: "See how it was made" }, href: "/process" }],
};
