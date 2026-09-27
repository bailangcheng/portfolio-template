# Memory

位置：`~/.claude/projects/<project>/memory/`（按项目隔离）。

## ★ 铁律：记不变的东西，不记状态

```markdown
✅ "Vercel project: <name> / team: <slug>"                 （不变）
✅ "怎么查部署：`npx vercel ls <project>`"                 （方法不变）
✅ "环境变量的'已设置'和'有效'是两回事"                    （原理不变）
❌ "Resend 域名已认证"                                    （★ 状态 —— 会腐烂）
❌ "生产已部署最新版"                                     （★ 状态）
```

状态一旦写进记忆，就会被当成事实读，然后出事（LESSONS.md V-01）。

## 格式

```markdown
---
name: <short-kebab-case-slug>
description: <一句话，用于召回时判断相关性>
metadata:
  type: user | feedback | project | reference
---

<事实本身>

**Why:** <为什么记这条 —— 没有 Why 的规则不会被遵守>

**How to apply:** <具体怎么做>
```

写完在 `MEMORY.md` 加一行索引：`- [标题](file.md) — 一句话钩子`

### 不要记的
- 仓库本身就有的（代码结构、CLAUDE.md、DESIGN.md 里已有的）
- 只对当前对话有意义的
- ★ 状态

## 种子（[seeds/](seeds/)）

```bash
cp harness/memory/seeds/*.md ~/.claude/projects/<project>/memory/
# 然后在该目录的 MEMORY.md 里各加一行索引
```

| 文件 | 一句话 |
|------|--------|
| [feedback-verify-infra-live.md](seeds/feedback-verify-infra-live.md) | 部署・域名・邮件的事实必须实查，不读文档（V-01） |
| [project-shell-encoding-trap.md](seeds/project-shell-encoding-trap.md) | Windows Git Bash + curl 传非 ASCII 会乱码 → 用 Node fetch（测试三语表单时必踩） |

放哪层的判据：**「这句话在下个项目还成立吗？」成立 → 全局 `~/.claude/CLAUDE.md`，不成立 → 项目记忆。**
⚠️ 别把项目内容（颜色、class 名、目录）放全局 —— 会污染之后的每个项目（W-07）。
