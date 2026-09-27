# Asset sources（素材台账）

公開する画像・動画・字体・アイコン・3D モデルは、すべてここに 1 行ある：**どこから来たか・どう加工したか・許可はどこまでか**。
追加・差し替え・削除は**同じ commit で**この表を更新する（DESIGN.md「Assets & Imagery」）。

> ⚠️ このファイルを `public/` に置かない —— `public/` の中身は全部公開配信され、許可メモが誰でも読める。
> ⚠️ 原素材（原画像・PSD・AI・未加工の動画）はリポジトリに入れない。置き場所（`portfolio-materials/…`）だけ書く。
> ⚠️ 他人が写っている写真・他人と作った作品は、クレジットと公開許可を `materials/02_works/<作品>/credits.md` に日付つきで残す。

## 加工規則（`npm run images` と同じ。変えるなら両方）

- 写真: 長辺 ≤ 3200px（原本が小さければそのまま、**拡大しない**）、EXIF（GPS 等）除去、sRGB JPEG q90。
- 透過 PNG・線画・UI スクリーンショット: PNG のまま。
- 表示画質は `next.config.ts` の `images.qualities`（既定 90）で決まる。素材側で低く圧縮しない（拡大で荒れる）。
- 動画: H.264 + AAC、`-movflags +faststart`。CRF は 20 前後から始め、**実際の画面で比較して**決める（粒子・細かい質感は高 CRF で崩れる）。
- 切り抜き: `focus`（object-position）で指定。公開前に `object-fit: cover` を実比率で再現して主体が切れていないか確かめる（V-07）。
- 1 枚が 900 KB を超えたら書き出し設定を疑う（W-17）。

## 許可の書き方

| 状態 | 意味 |
| --- | --- |
| `OK` | 公開してよいと書面で確認済み（誰が・いつ・どこで） |
| `⚠️ 待确认: <何>` | 例: 肖像（写っている人）、撮影者のクレジット、学校・企業の作品の公開可否、第三者ロゴ |
| `占位` | starter 付属・仮の画像。**公開前に全部差し替えるか削除** |

`⚠️ 待确认` と `占位` は公開前に 0 件にする（CHECKLISTS.md §4 / `npm run placeholders`）。

## 一覧

### src/assets/images/

| ファイル | 出典 | 加工 | 許可 |
| --- | --- | --- | --- |
| works/graduation-collection/*.jpg（5 枚） | starter 付属の占位画像 | — | 占位 |
| works/poster-campaign/*.jpg（4 枚） | starter 付属の占位画像 | — | 占位 |
| works/this-site/*.jpg（3 枚） | starter 付属の占位画像 | — | 占位 |
| profile/portrait.jpg | starter 付属の占位画像 | — | 占位 |

### src/app/ ・ public/

| ファイル | 出典 | 加工 | 許可 |
| --- | --- | --- | --- |
| src/app/icon.svg | starter 付属の占位 favicon（イニシャル） | — | 占位 |
| public/noise.svg | starter 付属（feTurbulence の粒子テクスチャ。自作） | — | OK |

<!-- 例（npm run images が出力する行）:
| works/poster-campaign/cover.jpg | selects/01_main.tif（6000×4000） | 長辺 ≤3200・EXIF 除去・q90 | ⚠️ 待确认: 展示主催者の掲載許可 |
-->
