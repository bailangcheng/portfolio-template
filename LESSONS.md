# LESSONS — 事故档案（作品集版）

> 编号 R / B / V / W / P 沿用 `web-app-template/LESSONS.md` 的原编号（全库通用锚点，**不改号**）。
> 这里只收**和个人作品集相关**的条目，每条压缩成「症状 → 对策 → 一句话」；完整经过在原仓库。
> `PF-xx` 是本模板（从个人作品集项目整理出来时）新增的条目。
> starter / harness 里注释写的编号，出处都在这里。

## 一屏体检表

| 编号 | 一句话 | 住在哪里（防线） |
|---|---|---|
| R-01 | fallback 让生产发假内容而 CI 全绿 | 表单 env 缺失 → 明确失败（`send-contact.ts`）；`pick()` 不回落到别的语言 |
| R-02 | `NEXT_PUBLIC_*` 是构建时烧进去的 | `.env.example` 的表；改值后必须重新部署 |
| R-03 | `??` 挡不住空字符串 | `site.ts` 的 `siteConfig.url` 用 `\|\|` |
| R-05 | 本地部署把 localhost 烧进 canonical | 生产只走 `main` → Vercel；settings.json 把 `vercel deploy` 设为 ask |
| R-08 | 在没定下来的路由上发了 301 | `next.config.ts`：URL 定之前只用 307 |
| R-09 | 唯一碰生产的 CI 文件没人测 | ci.yml 注释；CI 改动当生产代码对待 |
| B-02 | `next/font/google` + Turbopack → 500 | 字体走 `<link>` |
| B-04 | `--color-X` 与 `--text-X` 同名 → `text-X` 变颜色 | `scripts/check-tokens.mjs`（lint） |
| V-01 | 把文档当现状（犯了三次） | `live-verifier` agent |
| V-04 | Git Bash 把 UTF-8 转成本地代码页 | 三语表单测试用 Node `fetch` |
| V-06 | 内嵌预览 rAF 不跑：看不见 ≠ 坏了 | dev 暴露 `__gsap` / `__three` |
| V-07 | 视觉要量出来 | 390 / 320 溢出检查；裁切用 PIL 复现 |
| W-04 / W-18 | 更新频率决定 CMS 还是代码；模板默认带的东西是没被问过的决策 | 本模板无 CMS；表单是开关（`contact.form`） |
| W-06 | agent 把字重"改良"了 +200 | DESIGN.md：标题 400，禁止自行加粗 |
| W-07 | 全局 harness 里的上个项目内容污染新项目 | `new-project.sh` 扫全局 / 祖先 CLAUDE.md |
| W-17 | 50 个素材 6 天后全删，13.6 MB 永远留在 git 历史 | `npm run images`（>900 KB 警告）；原素材不进仓库 |
| P-6 | fallback 是负债，不是韧性 | — |
| P-10 | build-time 和 runtime 是硬边界 | `.env.example` |
| P-15 | 不要在信息没到位时开始产出 | `rework-guard` agent；PLAYBOOK 的顺序 |
| PF-01 | 未知 locale（`/favicon.ico`）→ 500 | `pick()` 里 `notFound()` |
| PF-02 | 3D 在隐藏标签页 / 内嵌预览里不画 ≠ 坏了 | `ThreeStage` 的可见性判断 + `__three.frame()` |
| PF-03 | 欧文的负字距套在日文 / 中文上，字会撞 | `--ls-*` 变量按 `:lang()` 切换 |
| PF-04 | 三语站最常见的事故：一种语言漏写 | `L<T>` 类型 + `check-messages.mjs` |
| PF-05 | 新 clone / CI 里 `tsc` 找不到图片 import 的类型 | `typecheck` = `next typegen && tsc --noEmit` |

---

## 三个核心教训（原仓库序章的摘要）

1. **事故的本体不是 bug，是让 bug 隐形的那个机制。** 一行 `?? mock` 让生产发了约 50 天假内容而 CI 全绿。**验证产出物，不要验证配置；fallback 是负债。**（R-01 / P-1 / P-6）
2. **Coding agent 让"产出"变便宜了，返工没有。** 所有大块返工都是"信息没到位就开始产出"。（W 系列 / P-15）
3. **agent 每个 session 都是全新的。** 约定写成表；全局 harness 放"我是谁"，项目 harness 放"这是什么"。（W-06 / W-07 / P-21）

---

## 摘录

### R-01 ★ 生产发假内容，CI 全绿
- **症状**：取数失败被一行 fallback 吞掉，生产展示 mock 内容约 50 天，CI 一直是绿的。
- **对策**：区分「未配置」「失败」「0 条」。失败必须可见。作品集里的对应物：**表单没配 env 时绝不显示「送信しました」**；缺某种语言的文字时绝不拿另一种语言顶上。
- > 宁可红，不可假。

### R-02 / P-10 构建期变量设成运行时，原理上不可能生效
- `NEXT_PUBLIC_*` 在构建时内联进 bundle。在 Vercel 改了值不重新部署 = 没改。
- > build-time 和 runtime 是硬边界。

### R-03 `??` 挡不住空字符串
- 未设置的 CI / 平台变量常常是 `""`。`??` 放行 → sitemap 的 `<loc>` 为空。环境变量一律 `||`。

### R-05 / P-13 能部署到生产的路径超过一条，就有一条是错的
- 本地部署读了 `.env.local`，把 `localhost:3000` 烧进了 canonical。生产只走 Git 集成。

### R-08 ★ 在还没定下来的路由上发了 301
- 301 被浏览器无限期缓存，撤不回。URL 方案定之前一律 307（`permanent: false`）。
- > 有些配置的作用域不在你的系统里。

### R-09 唯一能碰生产的代码，是唯一没有测试的代码
- 22 行 CI YAML 造成 3 次发布故障，平均 25 天才发现。CI 改动当生产代码变更对待。

### B-02 `next/font/google` 和 Turbopack 不兼容 → 500
- 字体走 `<head>` 的 `<link>`，CSP 的 `font-src` / `style-src` 同步。

### B-04 〔P2〕Tailwind v4：颜色和字号 token 同名
- `--color-hero` + `--text-hero` → `text-hero` 解析成颜色，移动端 h1 变成 15px、几乎白色。构建和 lint 全绿。
- 对策：颜色名带用途后缀（`surface`），`check-tokens.mjs` 同名即失败。
- > 把"只有看画面才知道"的错误，变成一个会失败的检查。

### V-01 ★ 三次同构的错误：把文档当现状
- 读缓存当取数正常、信没勾的 checkbox、信过时的记录。基础设施的真相只在运行的系统里 → `live-verifier`。

### V-04 shell 把 UTF-8 转成了本地代码页
- Windows 的 Git Bash 给 curl 传日语 / 中文会在发出前就乱码。外部 API 测试用 Node `fetch`。先怀疑自己的测试路径。

### V-06 〔P2〕内嵌预览里 rAF 不跑
- 元素停在 `opacity: 0`、截图空白。以数值为证据；dev 下手动 `__gsap.ticker.tick()`。
- > 先确认验证环境能区分"坏了"和"好了"。

### V-07 〔P2〕视觉对不对，要量出来
- `object-fit: cover` 居中裁掉了主体；GSAP 从 `translateY(110%)` 开始没写 `y: 0`，标题低了 97px。
- 同 viewport 量 computed style；裁切用 PIL 复现；390 / 320 查横向溢出。

### W-04 / W-18 〔P2〕内容放哪里由更新频率决定；模板默认带的东西是没被问过的决策
- 作品集一年更新几次 → 内容放仓库，vibe coding 更新，不要 CMS。
- 从企业模板起步时 CMS 和表单都搭好了，第二天全删。所以本模板：**无 CMS；表单是 `site.contact.form` 一个开关**。

### W-06 ★ 字重被集体"改良"了 +200
- agent 有"标题粗一点好看"的先验。对策是写成表 + 明写默认值 + 明写禁止：本模板标题 400。

### W-07 ★★ 全局 harness 是上一个项目的
- 全局 CLAUDE.md 里的上个项目 token 名，被用进了新项目（class 不存在，背景静默消失）。
- 全局放"我是谁"，项目放"这是什么"。`new-project.sh` 会扫 `~/CLAUDE.md`、`~/.claude/CLAUDE.md` 和所有祖先目录。

### W-17 资源批量返工
- 设计没定就导入约 50 个素材，6 天后全删；13.6 MB 的 PNG 永远留在 git 历史。设计 FIX 后再导；按显示尺寸导出；看一眼体积。

### P-15 ★★ 不要在信息还没到位时开始产出
- 素材 / 文案 / 设计没到 → 只留类型和一行 TODO。作品集里：**text.md 没写完就不做那个作品的页面。**

---

## 本模板新增（PF）

### PF-01 未知 locale 走进 `[locale]` → 500
- **症状**：浏览器自动请求的 `/favicon.ico` 返回 500，服务器日志 `[content] missing "favicon.ico" value`。
- **根因**：`proxy.ts` 的 matcher 不处理带扩展名的路径（为了放行静态文件），于是 `/favicon.ico` 以 `locale = "favicon.ico"` 进入 `[locale]` 段；`generateMetadata` 比 layout 的 `notFound()` 先执行，取内容时抛异常。
- **对策**：`pick()` 里先判 `hasLocale`，未知 locale → `notFound()`（404）。已知 locale 缺值才抛异常。
- **怎么发现的**：生产构建 + `next start` 下看服务器日志。页面本身一切正常 —— 出错的是浏览器自动发出的请求，不看日志就看不见。
- > 自动请求（favicon、apple-touch-icon、爬虫）也是用户。验证时看服务器日志，不只看页面。

### PF-02 3D 不画 ≠ 坏了
- **症状**：内嵌预览里 canvas 一直 `opacity: 0`，`data-ready` 不出现。
- **根因**：预览窗口被遮挡时 `document.visibilityState === "hidden"`、rAF 0fps。`ThreeStage` 按设计在隐藏时停止渲染（省电）。
- **对策**：dev 下 `window.__three.frame()` 手动画一帧，紧接着 `gl.readPixels` 数像素（同一个 JS task 内读，不需要 `preserveDrawingBuffer`）。
- > 和 V-06 同构：先确认环境能区分坏和好。

### PF-03 欧文的负字距套在 CJK 上
- **症状**：`letter-spacing: -0.06em` 的大标题在日文 / 中文里字挨字、甚至重叠。
- **对策**：字距用 `--ls-hero / --ls-display / --ls-title` 变量，`:root:lang(ja|zh)` 里放宽（-0.02em 左右）；正文行高也按语言切换（`--lh-prose`）。标题不要硬写 `tracking-[-0.0Xem]`。

### PF-04 三语站最常见的事故：一种语言漏写
- **症状**（预防）：next-intl 找不到键时只显示键名，构建照样通过；内容缺一种语言时，最省事的写法是拿英文顶上 —— 两者都会静默上线。
- **对策**：内容用 `L<T> = Record<Locale, T>`（缺一种语言 = 类型错误）；`messages/*.json` 的键由 `check-messages.mjs` 在 lint 里比对。加语言 = 改 `routing.ts` 后跟着类型错误逐个补。

### PF-05 新 clone / CI 里 typecheck 全灭（图片 import）
- **症状**：模板在开发机上 `npm run check` 全绿；用 `new-project.sh` 生成的新项目里，`npm run typecheck` 对每个 `import cover from "…/cover.jpg"` 报 TS2307。CI（lint → typecheck → build 的顺序）也会同样失败。
- **根因**：`*.jpg` 的模块类型在 `next-env.d.ts` 里，而它被 gitignore，只在 `next dev` / `next build` / `next typegen` 时生成。开发机上它一直存在（跑过 build），所以在那里永远复现不了。
- **对策**：`"typecheck": "next typegen && tsc --noEmit"`。冒烟测试一定要在**全新目录**里从 `npm ci` 跑起。
- > 在"干净的地方"验证：开发机上残留的生成物会让检查静默通过（P-1）。
