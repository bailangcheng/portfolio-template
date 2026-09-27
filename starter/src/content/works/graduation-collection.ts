/**
 * サンプル作品（Fashion）。materials/02_works/2023_graduation-collection/text.md から起こした想定。
 * ⚠️ 文言・画像ともに占位。自分の作品に置き換えるか、ファイルごと消して works.ts から外す。
 */
import type { Work } from "../types";
import cover from "@/assets/images/works/graduation-collection/cover.jpg";
import p1 from "@/assets/images/works/graduation-collection/process-01.jpg";
import p2 from "@/assets/images/works/graduation-collection/process-02.jpg";
import o1 from "@/assets/images/works/graduation-collection/01.jpg";
import o2 from "@/assets/images/works/graduation-collection/02.jpg";

export const graduationCollection: Work = {
  slug: "graduation-collection",
  category: "fashion",
  year: "2023",
  featured: true,
  title: { ja: "卒業制作コレクション（サンプル）", zh: "毕业设计系列（示例）", en: "Graduation Collection (sample)" },
  cover: {
    src: cover,
    alt: { ja: "コレクションのキービジュアル（占位画像）", zh: "系列主视觉（占位图）", en: "Key visual of the collection (placeholder)" },
  },
  summary: {
    ja: "日常の「たたむ」動作から形を起こした 6 ルック。",
    zh: "从日常「折叠」动作出发的 6 套造型。",
    en: "Six looks built from the everyday act of folding.",
  },
  facts: {
    role: { ja: "企画・デザイン・パターン・制作", zh: "企划・设计・制版・制作", en: "Concept, design, pattern making, sewing" },
    period: { ja: "2023 年 4 月〜12 月", zh: "2023 年 4 月—12 月", en: "Apr–Dec 2023" },
    tools: ["Illustrator", "CLO 3D"],
    // credits は公開 OK を確認したものだけ（materials の credits.md に確認日）。未確認なら書かない。
  },
  background: {
    ja: ["ここに「なぜ作ったか・何を解決したかったか」を書きます（サンプル文）。", "2〜3 段落が目安です。"],
    zh: ["这里写「为什么做、想解决什么」（示例文字）。", "以 2–3 段为宜。"],
    en: ["Describe why you made this and what problem it set out to solve (sample text).", "Two or three paragraphs is plenty."],
  },
  process: {
    body: {
      ja: ["草図・トワル・試作の順に、考えが変わった点を書きます（サンプル文）。企画職の読み手が一番見たいのはここです。"],
      zh: ["按草图、白坯、试作的顺序，写下想法改变的地方（示例文字）。策划岗最想看的就是这里。"],
      en: ["Walk through sketches, toiles and prototypes, and where your thinking changed (sample text). This is the part planners read most closely."],
    },
    images: [
      {
        src: p1,
        alt: { ja: "初期の草図（占位画像）", zh: "初期草图（占位图）", en: "Early sketches (placeholder)" },
        caption: { ja: "初期の草図", zh: "初期草图", en: "Early sketches" },
      },
      {
        src: p2,
        alt: { ja: "トワルの試作（占位画像）", zh: "白坯试作（占位图）", en: "Toile prototype (placeholder)" },
        caption: { ja: "トワルでの検証", zh: "白坯验证", en: "Testing in toile" },
      },
    ],
  },
  outcome: {
    body: {
      ja: ["完成したルックの説明（サンプル文）。数字や受賞は確認できたものだけ書きます。"],
      zh: ["完成造型的说明（示例文字）。数字、奖项只写确认过的。"],
      en: ["Describe the finished looks (sample text). Only mention numbers or awards you can verify."],
    },
    images: [
      { src: o1, alt: { ja: "ルック 1（占位画像）", zh: "造型 1（占位图）", en: "Look 1 (placeholder)" } },
      { src: o2, alt: { ja: "ルック 2（占位画像）", zh: "造型 2（占位图）", en: "Look 2 (placeholder)" } },
    ],
  },
  reflection: {
    ja: ["学んだことと、それが Web の仕事にどうつながるか（サンプル文）。"],
    zh: ["学到了什么，以及如何连接到网页工作（示例文字）。"],
    en: ["What you learned, and how it carries over into web work (sample text)."],
  },
};
