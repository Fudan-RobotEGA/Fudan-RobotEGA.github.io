---
title: Fudan-RobotEGA 全组织数据分析报告
tags:
  - 电控
  - 分析报告
  - EGAdapter
  - RoboMaster
createTime: 2026/05/01 17:00:00
permalink: /article/repo-analysis-2026/
---

# Fudan-RobotEGA 全组织数据分析报告

> **v3.1 精确版 (全分支修正)** | 数据采集: 2026-05-01
>
> 本报告对 GitHub Contributors API 仅统计默认分支的系统性低估问题进行了修正,对全部 39 个多分支仓库逐分支统计 commit 数。同时纳入非组织成员贡献者和匿名贡献者别名合并。

---

## 组织规模

复旦大学星云EGA战队 (Fudan-RobotEGA) GitHub 组织拥有 **72 个仓库** (68 私有, 4 公开) 和 **42 名成员**。

| 指标 | 数值 |
|------|------|
| 仓库总数 | 72 |
| 组织成员 | 42 |
| 全组织总提交数 | **4,959** |
| 总磁盘占用 | 2829.6 MB |
| 代码总量 | 526.4 MB |

赛季分布: 2025 (9), 过渡期 (11), **2026 (52)**。

## 活跃度

- 🟢 30天内活跃: **29** 个仓库
- 🟡 30-90天: **13** 个仓库
- 🔴 超过90天: **30** 个仓库

## 贡献者排行 Top 15 (全分支修正)

| # | 贡献者 | 总Commits | 原创Commits | 仓库数 | 身份 |
|---|--------|----------|------------|--------|------|
| 1 | JAHNAN00 | 2199 | 994 | 12 |  |
| 2 | Hrmys3 | 446 | 117 | 11 |  |
| 3 | shangtianxuanniao | 437 | 194 | 9 |  |
| 4 | teleaki | 408 | 222 | 13 |  |
| 5 | LemonServer | 197 | 156 | 8 |  |
| 6 | Beecheer | 195 | 137 | 16 |  |
| 7 | xinruilee04 | 150 | 141 | 12 |  |
| 8 | Breeze-by | 121 | 101 | 16 |  |
| 9 | lucky-sharon | 115 | 46 | 5 | [non-org] |
| 10 | chushanxiaodaoshi | 101 | 98 | 12 |  |
| 11 | Co1con | 86 | 73 | 7 |  |
| 12 | pyrosucrose | 77 | 59 | 7 |  |
| 13 | ClearWei | 69 | 69 | 2 |  |
| 14 | zlm-ega | 65 | 26 | 5 | [non-org] |
| 15 | littlef111 | 38 | 38 | 3 |  |

> Hrmys3 从修正前的 91 升至 **446** (+355),原因是其主力开发在 `gimbal_refactor` 等非默认分支上。

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

## 机器人类型覆盖

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

核心框架 **EGAdapter_MC02** (2199 commits) 被 7 个仓库 fork,是组织全部嵌入式项目的基石。

## 关键发现

1. **JAHNAN00** 是核心框架贡献者 (2199 commits),占全组织总提交的 44%
2. **Hrmys3** 被严重低估: 修正后从第 8 名跃升至第 2 名 (91 → 446)
3. **C 语言** 占 76.91%,C++ 12.21% — 典型嵌入式开发特征
4. **30** 个仓库超过 90 天未更新
5. 多个仓库的主力开发在非默认分支,建议统一
6. 4 名非组织成员贡献者需确认身份

## 可视化版本

[点击查看交互式可视化报告](/report-visual.html) (含 11 张 ECharts 图表)

---

> 完整版报告 (含 72 个仓库卡片) 存档于工作区 `docs/tasks/26-0501-full-org-scan/step7_report/full_report.md`
