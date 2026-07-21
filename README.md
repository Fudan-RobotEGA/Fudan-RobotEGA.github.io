# 复旦大学星云 EGA 机器人战队官网

这是复旦大学星云 EGA 机器人战队的官方网站源码，包含战队介绍、机器人展示、开源文档以及 RM BattleScope 赛训复盘平台。

- 官网：<https://fudan-robotega.github.io/>
- BattleScope：<https://fudan-robotega.github.io/rm-battlescope/>
- 源码分支：`docs`
- 部署分支：`main`（由 GitHub Actions 自动生成，请勿直接修改）

## 使用 BattleScope

BattleScope 将 RMUC 2026 区域赛数据整理为可在浏览器中查看的静态复盘页面，当前提供：

- **赛局总览**：经济、伤害转化和步哨兵火力覆盖；
- **交战态势**：交火点、死亡点、建筑血量、地面压制和移动功率；
- **强队对标**：站位策略、阶段收益、异常片段和官方录像同步；
- **操作表现**：按操作位统计生存、火力、移动与协同表现。

BattleScope 在线版提供复旦大学 17 局专题分析和 5 场强队对标比赛，以 GitHub Pages 静态快照形式发布。本地 `fudan-rm-battlescope` Python 工具仍保留完整的数据分析能力。

分析结果用于赛后定位值得复核的片段，不应脱离官方录像直接作为操作评价或因果结论。

## 本地运行官网

环境要求：

- Node.js 20 或更新版本；
- pnpm 8（部署工作流使用的版本）。

```powershell
git clone https://github.com/Fudan-RobotEGA/Fudan-RobotEGA.github.io.git
Set-Location Fudan-RobotEGA.github.io
git switch docs
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

开发服务器启动后，按照终端显示的地址在浏览器中访问。生产构建与本地预览：

```powershell
pnpm build
pnpm preview
```

项目没有单独的 `test`、`lint` 或 `typecheck` 命令；提交前至少应完成生产构建和关键页面浏览检查。

## 目录结构

```text
├─ src/                         Vue 官网源码
│  ├─ pages/                    首页、战队、机器人和文档页面
│  └─ content/                  战队、机器人、文档及联系信息
├─ public/                      构建时原样复制的静态资源
│  ├─ battlescope/              BattleScope 主体和专题分析 JSON
│  └─ rm-battlescope/           BattleScope 官网兼容入口
├─ .github/workflows/           自动构建与部署配置
├─ vite.config.js               Vite 配置
└─ package.json                 依赖与开发命令
```

## 更新 BattleScope 静态快照

BattleScope 的分析器、SQLite 数据库和网站仓库建议采用以下同级目录：

```text
code/
├─ Data_analyzer/
│  └─ fudan-rm-battlescope/
└─ Fudan-RobotEGA.github.io/
```

更新前先验证分析器：

```powershell
Set-Location ..\Data_analyzer\fudan-rm-battlescope
.\.conda\envs\rmuc2026\python.exe -m unittest discover -s tests -v
```

静态发布内容位于 `public/battlescope/`：

| 内容 | 网站位置 |
| --- | --- |
| BattleScope 首页 | `public/battlescope/index.html` |
| 四个专题分析页 | `public/battlescope/analysis/*/index.html` |
| 专题分析数据 | `public/battlescope/api/*.json` |
| 主题、队徽和场地图 | `public/battlescope/assets/` |
| 官网兼容入口 | `public/rm-battlescope/index.html` |

更新静态页面时必须保留以下约束：

- 所有静态资源使用 `/battlescope/assets/`；
- 专题数据使用 `/battlescope/api/*.json`；
- 分析页使用 `/battlescope/analysis/.../`；
- 在线页面不得请求 `/api/jobs` 或 `/api/analysis/*`；
- `/rm-battlescope/` 和 `/battlescope/` 两个入口保持一致；
- SQLite 数据库、分析器源码和临时输出不得复制到网站仓库。

完成同步后执行：

```powershell
Set-Location ..\..\Fudan-RobotEGA.github.io
pnpm build
git diff --check
git status --short
```

还应在本地预览中检查：首页入口、四个分析模块、交战地图筛选、官方录像跳转以及桌面和窄屏布局。

## 提交与部署

日常修改提交到 `docs` 分支：

```powershell
git switch docs
git pull --ff-only origin docs
git add <修改的文件>
git commit -m "说明本次修改"
git push origin docs
```

推送后，`.github/workflows/deploy-docs.yml` 会使用 Node.js 20 和 pnpm 8 构建网站，并将 `dist/` 自动发布到 `main` 分支。不要在 `main` 分支手工修改生成文件。

## 常见问题

### BattleScope 页面可以打开，但没有分析数据

检查页面请求是否指向 `/battlescope/api/*.json`，并确认对应 JSON 已进入生产构建的 `dist/battlescope/api/`。

### 刷新 Vue 子页面后显示 404

生产构建会将 `index.html` 同步为 `404.html`，交由 Vue Router 处理路径。请先确认使用的是最新构建产物，而不是直接上传源码目录。

### 修改后线上没有更新

确认修改已推送到 `docs`，再检查 GitHub Actions 的“构建并部署站点”任务。部署任务成功后，浏览器缓存仍可能需要通过强制刷新清除。
