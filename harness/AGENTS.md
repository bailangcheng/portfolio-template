# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all
differ from your training data. **Read the relevant guide in `node_modules/<pkg>/dist/docs/`
before writing any code that touches routing, proxy, config, caching, or font loading.**
Heed deprecation notices.

Known breaking changes in this version:

- `middleware.ts` → `proxy.ts`（函数名也从 `middleware` 改成 `proxy`）
- `next build` 默认走 Turbopack（本项目部署在 Vercel，无适配层）
- `next/font/google` 与 Turbopack 不兼容 → **500**。用 `<head>` 的 `<link>`
- Tailwind v4：**不需要** `tailwind.config.js`。token 写在 `globals.css` 的 `@theme inline {}`
- Tailwind v4 的 preflight 把 `<button>` 的 cursor 重置成 default
- Tailwind v4 的 `text-X` 同时匹配 `--text-X`（字号）和 `--color-X` → 同名时变成颜色（B-04，`npm run lint` 会拦）
- `next-env.d.ts`（`*.jpg` 等 static import 的类型）被 gitignore，只在 `next dev` / `next build` / `next typegen` 时生成 → 新 clone 和 CI 里先跑 `tsc` 会让所有图片 import 报 TS2307。`npm run typecheck` = `next typegen && tsc --noEmit`，不要改回去
- `params` / `searchParams` 是 Promise，必须 `await`
- `revalidateTag(tag)` 单参数形已废弃 → `revalidateTag(tag, "max")`
- React 开发版需要 `eval` → CSP 的 `'unsafe-eval'` 只在 development 放行（`next.config.ts`）。本番绝不放
- `next/image` 的 `quality` 只能取 `images.qualities` 里的值（不在列表里 → 取最接近的允许值）。要改画质先改 `next.config.ts`
- `eslint-plugin-react-hooks` 的 `set-state-in-effect`：effect 里同步 `setState` 会被 lint 拦 → 外部状态（URL 等）用 `useSyncExternalStore`
- next-intl 4：`proxy.ts` 的 matcher 不通过带扩展名的路径 → `/favicon.ico` 会以 `locale="favicon.ico"` 进到 `[locale]`。未知 locale 必须 404（`pick()` 已处理），不能抛异常（→ 500）
- Three.js（r18x）：ESM only。addons 从 `three/addons/...` import；`@types/three` 版本与 `three` 对齐

<!--
  维护（这个文件是活的）：
  - 踩到新的 breaking change → 立刻加进上面的列表。「注意可能有 breaking change」无效 —— 必须列出具体项（B-01）。
  - 大版本升级时逐条重查。
  - 编号出典：模板仓库的 LESSONS.md。
-->
