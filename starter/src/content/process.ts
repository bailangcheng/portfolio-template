/**
 * /process「このサイトの作り方」。AI と一緒に作った過程を、他の候補者と差がつく 1 ページにする。
 * 下の手順はこのテンプレートの実際の流れ（PLAYBOOK.md）に沿ったサンプル。自分の言葉に書き換える。
 */
import type { ProcessContent } from "./types";

export const processContent: ProcessContent = {
  lead: {
    ja: "このサイトは、素材の整理から公開まで、AI（Claude Code）と対話しながら自分で作りました。その手順と判断を残しておきます。",
    zh: "这个网站从整理素材到上线，都是我与 AI（Claude Code）对话、自己完成的。这里记录步骤与判断。",
    en: "I built this site myself, from sorting material to going live, in conversation with an AI (Claude Code). Here are the steps and the decisions.",
  },
  steps: [
    {
      title: { ja: "素材を整理する", zh: "整理素材", en: "Sort the material" },
      body: {
        ja: ["全作品を一覧にして、載せるものを選びました。原画像・PSD はリポジトリに入れず、作品ごとのフォルダで管理しています。"],
        zh: ["把全部作品列成一览，选出要放的。原图、PSD 不进仓库，按作品分文件夹管理。"],
        en: ["I listed every piece and chose what to show. Originals and PSDs stay out of the repository, in one folder per work."],
      },
    },
    {
      title: { ja: "言葉を先に書く", zh: "先写文字", en: "Write the words first" },
      body: {
        ja: ["作品ごとに text.md（概要・課題・プロセス・振り返り）を書いてから、画面を作りました。"],
        zh: ["每个作品先写 text.md（概要、课题、过程、回顾），再做画面。"],
        en: ["Each work got a text.md (summary, brief, process, reflection) before any screen was designed."],
      },
    },
    {
      title: { ja: "見た目の約束を決める", zh: "定下视觉约定", en: "Agree on the look" },
      body: {
        ja: ["色・文字・余白・動きを DESIGN.md に書き、AI はそこにない値を使わない、というルールにしました。"],
        zh: ["把颜色、字体、留白、动效写进 DESIGN.md，规定 AI 不使用其中没有的值。"],
        en: ["Colour, type, spacing and motion live in DESIGN.md, and the AI may not use values that are not in it."],
      },
      tools: ["DESIGN.md"],
    },
    {
      title: { ja: "対話しながら実装する", zh: "边对话边实现", en: "Build through conversation" },
      body: {
        ja: ["Claude Code に指示し、出てきたコードを確認・修正しながら進めました。見た目は数値で測って確かめています。"],
        zh: ["向 Claude Code 下指示，检查并修改产出的代码。视觉效果用数值测量确认。"],
        en: ["I directed Claude Code and reviewed or corrected what it produced. Visual results were checked by measuring, not by eye."],
      },
      tools: ["Claude Code", "Next.js", "GSAP"],
    },
    {
      title: { ja: "公開して確かめる", zh: "上线并确认", en: "Ship and verify" },
      body: {
        ja: ["Vercel で公開し、実際の URL で表示と送信を確認しました。"],
        zh: ["通过 Vercel 上线，并在真实 URL 上确认显示与发送。"],
        en: ["Deployed on Vercel, then checked rendering and the contact form on the live URL."],
      },
      tools: ["Vercel", "Resend"],
    },
  ],
  stack: [
    { label: "Claude Code", note: { ja: "設計の相談と実装", zh: "设计讨论与实现", en: "Design discussion and implementation" } },
    { label: "Next.js", note: { ja: "サイトの骨格（日本語・中文・English）", zh: "网站骨架（日・中・英）", en: "Site framework (Japanese, Chinese, English)" } },
    { label: "GSAP", note: { ja: "スクロールと首屏の動き", zh: "滚动与首屏动效", en: "Scroll and first-view motion" } },
    { label: "Vercel", note: { ja: "公開と画像の最適化", zh: "发布与图片优化", en: "Hosting and image optimisation" } },
    { label: "Resend", note: { ja: "お問い合わせのメール送信", zh: "联系表单的邮件发送", en: "Contact form email" } },
  ],
};
