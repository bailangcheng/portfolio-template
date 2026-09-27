# portfolio-materials（素材の置き場・雛形）

**リポジトリの外**（Google Drive / 本地）に置く。サイトのコードとは分ける ―― 原画像・PSD・AI は重く、一度 GitHub に上げると履歴から消せない。

```bash
bash scripts/new-materials.sh ~/Drive/portfolio-materials   # この雛形をコピー
```

| 場所 | 中身 | サイトのどこに行くか |
|---|---|---|
| `00_inventory.xlsx` | 全作品の一覧。載せるものに印 | `works.ts` の並び・`featured` |
| `01_profile/profile.md` | 経歴・スキル・一句定位 | `src/content/site.ts` / `profile.ts` |
| `01_profile/photo/` | 本人写真（任意） | `src/assets/images/profile/` |
| `02_works/<年>_<slug>/` | 1 作品 1 フォルダ。**slug がそのまま URL**（`/works/<slug>`） | `src/content/works/<slug>.ts` |
| 　`raw/` | 原本（触らない・Git に入れない） | — |
| 　`selects/` | Web に出す画像。**1 枚目 = キービジュアル** | `cover.jpg`, `01.jpg` … |
| 　`process/` | 草図・試作・過程写真 | `process-01.jpg` … |
| 　`text.md` | ケーススタディの文 | 作品詳細の本文 |
| 　`credits.md` | モデル・撮影・共同制作者と公開 OK の確認日 | `facts.credits` + `docs/ASSET-SOURCES.md` |
| `03_references/` | ムードボードのスクショ（出典を書く） | `DESIGN.md「Visual References」` |
| `04_brand/` | ロゴ・字体・名前の表記 | `DESIGN.md` / `icon.svg` |

作品フォルダを作る: `02_works/_template/` をコピーして `2024_my-work` のように改名（slug は小文字の英数字とハイフン）。
サイトへの取り込み: Claude Code に「`<このフォルダ>` を作品として追加して」→ `.claude/skills/add-work` の手順。
