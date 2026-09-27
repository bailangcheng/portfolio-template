/**
 * コンテンツの型 ―― ページ/コンポーネントはこの型に対して実装する。
 *
 * ★ 文言は L<T>（= 全 locale 分）。1 言語でも欠けると型エラー。英語で黙って埋めない。
 * ★ 未確認の事実（年・担当・クレジット・連絡先）は undefined / null のまま ―― 画面には何も出ない。
 *   「確認中」「TBD」のような占位文字を公開ページに出さない（harness CLAUDE.md「公開内容の境界」）。
 * ★ 素材の出典・加工・許可は docs/ASSET-SOURCES.md。画像を足したら同じ commit で 1 行足す。
 */
import type { StaticImageData } from "next/image";
import type { SceneId } from "@/components/three/ThreeStage";
import type { Locale } from "@/i18n/routing";

/** 全 locale 分の値。 */
export type L<T> = Record<Locale, T>;

/** 段落の配列（1 要素 = 1 <p>）。 */
export type Paragraphs = readonly string[];

export type Img = {
  /** static import（src/assets/images/...）。幅・高さが自動で入り、CLS が起きない。 */
  src: StaticImageData;
  /** 内容画像は必須。装飾だけの画像は全 locale で "" を明示。 */
  alt: L<string>;
  /** 切り抜き時の注目点（CSS object-position。例 "50% 35%"）。既定は中央。 */
  focus?: string;
  caption?: L<string>;
};

// ── Site（名前・連絡先・SNS）──────────────────────────────────────────────
export type Social = { label: string; href: string };

export type HeroVisual =
  /** 十字グリッド + ポインター追従（素材なしで成立する既定。DESIGN.md「First view」） */
  | { kind: "grid" }
  /** 主視覚の画像（作品の代表カットなど） */
  | { kind: "image"; image: Img }
  /**
   * Three.js のシーン（src/components/three/scenes/ → ThreeStage の scenes に登録したもの）。
   * poster = WebGL 不可・読込中・reduced-motion のときに見える静止画（無ければ十字グリッド）。
   */
  | { kind: "three"; scene: SceneId; poster?: Img };

export type SiteContent = {
  name: L<string>;
  /** 一句定位（首屏・<meta description> の元） */
  tagline: L<string>;
  description: L<string>;
  /** 拠点（任意） */
  location?: L<string>;
  hero: {
    /** 見出しの行（行ごとにマスクで上昇する） */
    title: L<readonly string[]>;
    visual: HeroVisual;
  };
  /**
   * ⚠️ 本人が公開を確認したアドレスだけ。null = 表示しない。
   */
  contact: {
    email: string | null;
    /** true = About の #contact に Resend 送信フォームを出す（要 env。.env.example） */
    form: boolean;
    socials: readonly Social[];
  };
};

// ── Works ─────────────────────────────────────────────────────────────────
export type WorkCategory = "fashion" | "graphic" | "web";

/**
 * 1 作品 = 1 ケーススタディ（/works/<slug>）。
 * 並びは作品詳細の表示順と同じ（1 タイトル → 9 次の作品）。materials の text.md と 1:1。
 */
export type Work = {
  /** URL になる。materials の `年_slug` の slug 部分。公開後は変えない */
  slug: string;
  category: WorkCategory;
  /** 年（確認済みのみ）。例 "2024" / "2023–2024" */
  year?: string;
  /** TOP の精選作品に出す（3〜4 件） */
  featured?: boolean;

  // 1. タイトル
  title: L<string>;
  // 2. キービジュアル（一覧のカードにも使う）
  cover: Img;
  // 3. 概要（40 字以内の一言）
  summary: L<string>;
  // 4. 担当範囲・期間・ツール・クレジット（未確認の行は undefined → 行ごと出ない）
  facts: {
    role?: L<string>;
    period?: L<string>;
    tools?: readonly string[];
    /** 公開 OK を確認したクレジットだけ（materials の credits.md に確認日） */
    credits?: L<readonly string[]>;
  };
  // 5. 課題・背景
  background: L<Paragraphs>;
  // 6. プロセス（草図・試作・過程写真）
  process: { body: L<Paragraphs>; images: readonly Img[] };
  // 7. 成果（成品の大図）
  outcome: { body?: L<Paragraphs>; images: readonly Img[] };
  // 8. 振り返り
  reflection: L<Paragraphs>;
  // 9. 次の作品 … works.ts の並び順から自動
  /** 外部の公開先（実在して開けるものだけ。デモ/動画が無いのに再生ボタンを作らない） */
  links?: readonly { label: L<string>; href: string }[];
};

// ── Profile（About）────────────────────────────────────────────────────────
export type Profile = {
  lead: L<string>;
  /** 経歴（年は確認済みのみ） */
  timeline: readonly { period: string; text: L<string> }[];
  skills: L<readonly string[]>;
  tools: readonly string[];
  /** やりたい仕事 */
  interests: L<Paragraphs>;
  portrait?: Img;
};

// ── Process（このサイトの作り方）────────────────────────────────────────────
export type ProcessContent = {
  lead: L<string>;
  steps: readonly { title: L<string>; body: L<Paragraphs>; tools?: readonly string[] }[];
  /** 使った道具（AI・デザイン・開発） */
  stack: readonly { label: string; note: L<string> }[];
};
