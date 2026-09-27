# Portfolio

個人ポートフォリオサイト（日本語 / 中文 / English）。内容はすべてリポジトリ内（`src/content/`）。CMS なし —— 更新は Claude Code に頼んで書き換える（vibe coding）。

```bash
npm install
npm run dev          # http://localhost:3000
npm run check        # lint + typecheck + build（commit 前にこれ一本。CI と同じ）
npm run images -- <materials の作品フォルダ> <slug>   # 画像の取り込み
npm run placeholders # サンプルの残りを列挙（公開前に 0 件）
```

## 構成

| URL | 内容 | ファイル |
| --- | --- | --- |
| `/` | 首屏（名前 + 一句定位 + 主視覚）→ 精選作品 3〜4 → About 摘要 → 連絡先 | `src/app/[locale]/page.tsx` |
| `/works` | 作品一覧（Fashion / Graphic・Ad / Web で絞り込み。`?category=web`） | `src/app/[locale]/works/page.tsx` |
| `/works/[slug]` | ケーススタディ（タイトル → キービジュアル → 概要 → 担当・期間・ツール・クレジット → 課題 → プロセス → 成果 → 振り返り → 次の作品） | `src/app/[locale]/works/[slug]/page.tsx` |
| `/about` | 経歴・スキル・ツール・やりたい仕事 + `#contact`（メール・SNS・フォーム） | `src/app/[locale]/about/page.tsx` |
| `/process` | このサイトの作り方（AI と作った過程） | `src/app/[locale]/process/page.tsx` |
| 404 | 作品一覧へ誘導 | `src/app/[locale]/not-found.tsx` |

連絡先ページは作らない（footer と About に直接書く）。言語は `/`（日本語）・`/zh`・`/en`。

```
src/
├─ content/            ★ 更新するのはほぼここだけ
│  ├─ site.ts          名前・一句定位・メール・SNS・首屏の主視覚・ナビ
│  ├─ works.ts         作品の並び（= 一覧・次の作品の順）
│  ├─ works/<slug>.ts  1 作品 = 1 ファイル（3 言語）
│  ├─ profile.ts       About
│  ├─ process.ts       Process
│  └─ types.ts         型（L<T> = 3 言語必須）
├─ assets/images/works/<slug>/  cover.jpg / 01.jpg … / process-01.jpg …
├─ components/
│  ├─ motion/          GSAP（スクロール演出）
│  ├─ three/           Three.js（首屏の 3D。任意）
│  └─ …
├─ lib/mail/           Resend（お問い合わせ）
└─ i18n/routing.ts     言語の単一 source of truth
messages/{ja,zh,en}.json   画面の固定文字列（ナビ・見出しラベル・フォーム）
DESIGN.md                  見た目の契約（↔ src/app/globals.css）
docs/ASSET-SOURCES.md      素材台帳（出典・加工・許可）
```

## よくある更新（Claude Code への頼み方）

| やりたいこと | 頼み方の例 |
| --- | --- |
| 作品を足す | 「`../portfolio-materials/02_works/2024_poster-campaign` を作品として追加して」→ `.claude/skills/add-work` の手順で動く |
| 文言を直す | 「poster-campaign の概要を〇〇に。3 言語とも」 |
| 首屏を 3D に | 「首屏を three にして」→ `site.ts` の `hero.visual` |
| 並びを変える | 「works の順番を A, C, B に」→ `works.ts` |
| フォームを止める | 「フォームを外してメールだけに」→ `site.ts` の `contact.form = false` |

## 公開（Vercel）

1. GitHub に push → Vercel で Import（Framework: Next.js、設定はそのまま）。以降は `main` への push で本番、PR でプレビュー。
2. Environment Variables（Production / Preview それぞれ）: `NEXT_PUBLIC_SITE_URL`、フォームを使うなら `RESEND_API_KEY` / `CONTACT_FROM_EMAIL` / `CONTACT_TO_EMAIL`（→ `.env.example`）。
3. Resend で送信ドメインを認証（MX / SPF / DKIM）。未認証のまま公開しない。
4. 本番 URL で実際にフォームから 1 通送って届くのを確かめる。`CHECKLISTS.md §4`（テンプレート側）を上から。
