---
title: Fudan-RobotEGA 组织与 RM2026 英雄舵轮仓库全面分析报告
tags:
  - 电控
  - 分析报告
  - EGAdapter
  - RoboMaster
createTime: 2026/05/01 17:00:00
permalink: /article/repo-analysis-2026/
---

# Fudan-RobotEGA 组织数据分析报告 (v3.0 精确版)

> 数据采集: 2026-05-01 | 数据来源: GitHub API (72 仓库, 42 成员全量采集)

---

## 组织规模

复旦大学星云EGA战队 (Fudan-RobotEGA) GitHub 组织目前拥有 **72 个仓库**（68 私有, 4 公开）和 **42 名成员**。仓库总磁盘占用 2829.6 MB,代码量 526.4 MB。

赛季分布: 2025 (9), 2025/2026 过渡 (11), 2026 (52)。2026 赛季仓库占比最大,反映团队活跃开发状态。

## 活跃度

- 🟢 30天内活跃: **29** 个仓库
- 🟡 30-90天: **13** 个仓库
- 🔴 超过90天: **30** 个仓库

## 核心贡献者 Top 10

| 成员 | 总Commits | 原创Commits | 参与仓库数 |
|------|----------|------------|----------|
| JAHNAN00 | 2197 | 994 | 12 |
| teleaki | 383 | 197 | 13 |
| shangtianxuanniao | 378 | 171 | 9 |
| LemonServer | 184 | 143 | 8 |
| Beecheer | 158 | 100 | 16 |
| xinruilee04 | 139 | 137 | 12 |
| Breeze-by | 121 | 101 | 16 |
| Hrmys3 | 91 | 65 | 11 |
| chushanxiaodaoshi | 80 | 77 | 12 |
| Co1con | 76 | 66 | 7 |

> 注: "原创 Commits" 排除 Fork 仓库的基线提交，仅计算非 fork 仓库中的贡献。

## 语言分布

| 语言 | 占比 |
|------|------|
| C | 76.91% |
| C++ | 12.21% |
| Makefile | 5.63% |
| CMake | 2.03% |
| Python | 1.12% |
| HTML | 0.98% |
| JavaScript | 0.35% |
| Shell | 0.31% |

## 机器人覆盖

- **General**: 26 个仓库
- **Sentry**: 18 个仓库
- **Infantry**: 15 个仓库
- **Hero**: 10 个仓库
- **WheelLegged**: 8 个仓库
- **Engineer**: 3 个仓库
- **TransformableInfantry**: 3 个仓库
- **Drone**: 2 个仓库
- **OmniSteer**: 2 个仓库
- **Dart**: 1 个仓库

## 框架体系

核心框架 **EGAdapter_MC02** (510 commits) 是组织的模板仓库，被 7 个仓库 fork:

- RM2026_Hero_SwerveDrive
- RM2026_TransformableInfantry
- RM2026_OmniandSteer_New
- RM2026_EGAdapter_WheelLeg_Hero
- RM2026_EGAdapter_WheelLegged_Chassis
- RM2026_Transformable_Infantry
- 2026_EGAIM_wheeled_leg

## 关键发现

1. **JAHNAN00** 是核心框架贡献者,贡献了 2197 次提交（原创 994 次）
2. **EGAdapter_MC02** 是组织核心框架,被 7 个仓库 fork
3. **C 语言** 占主导地位 (76.91%),C++ 其次 (12.21%)——典型嵌入式开发特征
4. **30** 个仓库超过 90 天未更新,建议归档 2025 赛季遗留仓库
5. **64** 个仓库缺少 License

## 可视化版本

👉 **[点击查看交互式可视化报告](/report-visual.html)**（含 11 张图表）

---

> 数据采集方法: GitHub REST API 全量采集 (72 仓库 × 5 端点 + 42 成员详情，共 ~560 次 API 调用)
>
> 完整版报告 (含 72 个仓库卡片) 存档于工作区 `docs/tasks/26-0501-full-org-scan/step7_report/full_report.md`
