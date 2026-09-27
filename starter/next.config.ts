import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// 多層防御としての CSP。
//
// ⚠️ 不変条件（片方だけ変えると壊れる。3 組ある）:
//    1. CSP の img-src / media-src ↔ images.remotePatterns … 外部の画像・動画ホストを足すときは両方に書く（既定は全部ローカル）
//    2. CSP の font-src / style-src ↔ [locale]/layout.tsx の <link> … フォント配信元は両方に書く
//    3. globals.css の html{background} ↔ body の背景 … overscroll 対策
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  // 'unsafe-inline' は Next のインライン bootstrap と layout の head スクリプトのため。nonce パイプラインは未導入。
  // → 意図的に受け入れているトレードオフ。理由ごと残すこと（消すと「事故」に見える）。
  // 'unsafe-eval' は **dev のみ**（React 開発版がコールスタック復元に eval を使う。本番では使わない）。
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // blob: は Three.js がテクスチャ/GLTF を読むときに使う
  "img-src 'self' data: blob:",
  "font-src 'self' data: https://fonts.gstatic.com",
  // Three.js の loader（GLTF 等）は public/ からの fetch なので 'self' で足りる。外部 CDN から読むならここに足す
  "connect-src 'self'",
  "media-src 'self'",
  // ↑ 作品動画を YouTube / Vimeo で埋め込むなら frame-src をその時に足す（→ 同じ commit で CHECKLISTS §2）
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },

  // 画質: qualities に無い quality 値は「最も近い許可値」になる（Next 16）→ [90] だけにすれば全画像 90。
  // 素材自体を低く圧縮しない（拡大で荒れる。`npm run images` は q90・長辺 3200px で書き出す）。
  images: {
    qualities: [90],
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  // ⚠️ URL 設計が固まる前に `permanent: true`（301）を出さないこと。
  //    301 は **ブラウザに無期限にキャッシュされる** ―― 取り消せない。固まるまでは 307（permanent: false）。
  //    → LESSONS.md R-08
  // async redirects() { return [{ source: "/work/:slug", destination: "/works/:slug", permanent: false }]; },
};

// src/i18n/request.ts を next-intl に登録
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
