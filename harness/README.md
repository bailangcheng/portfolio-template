# harness — Coding Agent 的工作环境

本目录下的文件都是**工件**：`scripts/new-project.sh` 会把它们复制进新项目，直接能用。允许和说明文档重复 —— 工件必须自包含。

```
<project>/
├─ CLAUDE.md              ★ 项目规则：内容边界・三语・DESIGN.md・路由・内容层・验证（← CLAUDE.md）
├─ AGENTS.md              框架版本的坑（Next 16 / Tailwind v4 / next-intl / three）（← AGENTS.md）
└─ .claude/
   ├─ settings.json       权限：check / images / placeholders 放行；vercel deploy・env・git push 要确认
   ├─ agents/
   │  ├─ live-verifier.md ★ 实查生产（Vercel・DNS・Resend），不读文档（V-01）
   │  └─ rework-guard.md  ★「该不该现在做」四道闸（P-15）
   └─ skills/
      └─ add-work/        ★ 素材文件夹 → 三语作品页 + 图片 + 台账（vibe coding 的主入口）

~/.claude/CLAUDE.md       ⚠️ 只放跨项目为真的东西（我是谁、我怎么工作）
~/.claude/projects/<proj>/memory/  ← memory/seeds/*.md
```

## 第一原则：分层

| 层 | 文件 | 放什么 | 判据 |
|----|------|--------|------|
| 全局 | `~/.claude/CLAUDE.md` | 我是谁、我怎么工作 | 跨项目为真 |
| 项目 | `<repo>/CLAUDE.md` | 这个项目是什么 | 出了这个仓库就不成立 |
| 框架 | `<repo>/AGENTS.md` | 版本警告 | |
| 记忆 | `~/.claude/projects/<proj>/memory/` | 学到的教训 | 按项目隔离 |

**判据只有一个：「这句话在下个项目还成立吗？」** 全局里放了项目内容（颜色、class 名），会污染之后的每一个项目（W-07）。

其余两条：
- **约定写成表，不写成段落**（P-22）—— agent 每个 session 都是全新的，表能直接照做。
- **agent 会"改良"你的设计**（W-06）—— 对策 = 明写默认值 + 明写禁止事项（标题 400、只有一种强调色）。

## 为什么模板长这样

| 条目 | 出处 |
|---|---|
| 内容边界（不补成果、未确认不显示） | 作品集项目：本人的作品正文不能被 agent "润色" |
| 三语规则 + `L<T>` + 键比对 | PF-04 |
| `add-work` skill | vibe coding 的主操作是"加作品"—— 步骤、字段对应、台账更新写死，不靠每次重新发明（P-22） |
| `live-verifier` 的「不读文档」 | V-01 |
| `rework-guard` 的四道闸 | W 系列 / P-15（作品集版：CMS、3D、新页面、新语言的"真的需要吗"） |
| `next/font/google` 禁令 | B-02 |
| settings.json 把 deploy / env / push 设为 ask | R-05：生产只走 Git 集成一条路 |

维护：踩到新的坑 → **当天**写进对应工件（表 / agent / skill），不是写进说明文档。
记忆的写法 → [memory/README.md](memory/README.md)
