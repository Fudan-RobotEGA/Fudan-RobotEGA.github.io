---
title: Fudan-RobotEGA 全组织数据分析报告
date: 2026-05-01
tags:
  - 电控
  - 分析报告
  - EGAdapter
  - RoboMaster
categories:
  - 开源项目分析
createTime: 2026/05/01 17:00:00
permalink: /article/repo-analysis-2026/
---

# Fudan-RobotEGA 全组织数据分析报告

> 数据采集: 2026-05-01 | 72 仓库 · 42 成员 · 全分支统计 · SHA 全组织去重 · User Code 精确过滤
>
> [可视化版本 (13 张交互图表)](/report-visual.html)

---

## 扫描后新增项目

### RM BattleScope

面向操作手、指挥和赛训人员的 RMUC 2026 赛后复盘工具。它将区域赛数据整理为赛局总览、交战态势、强队对标、操作表现和单局交互回放，帮助战队结合比赛录像定位经济转化、火力覆盖、站位与协同问题。

<iframe src="/battlescope/" title="RM BattleScope 完整静态在线版" loading="lazy" style="width:100%;height:720px;border:1px solid #30363d;border-radius:12px;background:#0d1117"></iframe>

[全屏打开 BattleScope](/battlescope/)

> BattleScope 于本报告统计日期之后加入，未计入下方 2026-05-01 的 72 仓库及代码量统计。

---

## 1. 组织概况

| 项目 | 数值 |
|------|------|
| 组织 | Fudan-RobotEGA (复旦大学星云EGA战队) |
| 仓库 | **72** (68 私有, 4 公开) |
| 成员 | **42** 人 |
| 唯一 Commit (SHA去重) | **2,130** |
| User Code Additions | **287,138** 行 |
| 当前代码行数 | **1,125,744** 行 |
| 代码体积 | 526.4 MB |
| 磁盘占用 | 2829.6 MB |

### 赛季分布

- **2025**: 9
- **2025/2026**: 11
- **2026**: 52

### 成员列表

| # | 用户名 | 姓名 | 公开仓库 | 加入 GitHub |
|---|--------|------|---------|-----------|
| 1 | ClearWei | Clear | 11 | 2014-04-21 |
| 2 | MaxwellHuang2015 | Maxwell_Huang | 10 | 2015-02-26 |
| 3 | thhos | Tingkai Hu | 2 | 2020-02-19 |
| 4 | Phospheneser | Joshua | 31 | 2020-09-21 |
| 5 | Leannnnnnn | Linn.Li | 13 | 2021-04-04 |
| 6 | JAHNAN00 | An Zhang | 7 | 2021-07-19 |
| 7 | SadMei | Mei | 7 | 2022-04-17 |
| 8 | 1234056 | Zhang Haoyue | 6 | 2022-08-12 |
| 9 | Ryaxwn7 | - | 7 | 2023-02-25 |
| 10 | Co1con | Serein | 2 | 2023-03-22 |
| 11 | dawncity1104 | - | 3 | 2023-04-24 |
| 12 | Breeze-by | Breeze | 2 | 2023-05-08 |
| 13 | juiceooorange | RXC | 3 | 2023-05-23 |
| 14 | xinruilee04 | lee llx | 0 | 2023-05-25 |
| 15 | teleaki | TeleAki | 4 | 2023-08-30 |
| 16 | LemonServer | 顾立涛 | 2 | 2023-10-06 |
| 17 | ssssssqy | Shi Qingyun | 4 | 2023-10-15 |
| 18 | Demian1789 | - | 0 | 2024-03-05 |
| 19 | Beecheer | - | 2 | 2024-06-14 |
| 20 | xiaohuiwang000 | Wang Xiaohui | 10 | 2024-06-27 |
| 21 | knotraveller | knotraveller | 4 | 2024-10-10 |
| 22 | me-speaker | speaker | 2 | 2024-12-21 |
| 23 | DuanMou-0603 | Djs | 5 | 2025-01-02 |
| 24 | Bazi8888 | - | 3 | 2025-01-07 |
| 25 | shangtianxuanniao | - | 0 | 2025-02-01 |
| 26 | chushanxiaodaoshi | - | 5 | 2025-02-15 |
| 27 | pyrosucrose | - | 1 | 2025-03-04 |
| 28 | YYZ-XeF6 | Yizhi Yao | 1 | 2025-03-05 |
| 29 | wx2450 | - | 3 | 2025-03-27 |
| 30 | sudo-meteoric-shower | - | 0 | 2025-05-16 |
| 31 | TANG200612120026 | - | 1 | 2025-05-25 |
| 32 | chen0000-sudo | - | 0 | 2025-06-11 |
| 33 | Hrmys3 | - | 7 | 2025-07-01 |
| 34 | littlef111 | - | 2 | 2025-07-02 |
| 35 | yly-true | - | 2 | 2025-09-19 |
| 36 | En-cke | - | 1 | 2025-09-28 |
| 37 | WANGJ-miao | wangj | 11 | 2025-10-05 |
| 38 | Dreamingiv | - | 0 | 2025-12-15 |
| 39 | jessica070413 | - | 1 | 2025-12-15 |
| 40 | Zhang-Meng-111 | - | 3 | 2025-12-17 |
| 41 | koisheeeep | koisheep | 0 | 2026-01-18 |
| 42 | Phi11111 | - | 0 | 2026-02-28 |

## 2. 全局统计

### 2.1 仓库活跃度

🟢 30天: **29** | 🟡 30-90天: **13** | 🔴 >90天: **30**

| # | 仓库 | 最后推送 | 距今 | 状态 | Commits | 贡献者 | 分支 | 详情 |
|---|------|---------|------|------|---------|--------|------|------|
| 1 | Fudan-RobotEGA.github.io | 2026-05-01 | -1d | 🟢 | 1 | 1 | 2 | [→](/repos/Fudan-RobotEGA.github.io.html) |
| 2 | RM2026_EGAdapter_WheelLeg_Hero | 2026-05-01 | -1d | 🟢 | 123 | 8 | 3 | [→](/repos/RM2026_EGAdapter_WheelLeg_Hero.html) |
| 3 | 2026_Gimbal_Sky | 2026-04-30 | 0d | 🟢 | 15 | 3 | 2 | [→](/repos/2026_Gimbal_Sky.html) |
| 4 | RM2026_Hero_SwerveDrive | 2026-04-30 | 0d | 🟢 | 665 | 10 | 6 | [→](/repos/RM2026_Hero_SwerveDrive.html) |
| 5 | 2026_EGAIM_sentry_ros2 | 2026-04-30 | 0d | 🟢 | 12 | 3 | 1 | [→](/repos/2026_EGAIM_sentry_ros2.html) |
| 6 | RM26_QtClient | 2026-04-29 | 1d | 🟢 | 67 | 1 | 9 | [→](/repos/RM26_QtClient.html) |
| 7 | miao_machine_learning_wheelleg_infantry | 2026-04-29 | 1d | 🟢 | 27 | 1 | 3 | [→](/repos/miao_machine_learning_wheelleg_infantry.html) |
| 8 | RM2026_WheelLegged_Gimbal | 2026-04-29 | 1d | 🟢 | 66 | 3 | 2 | [→](/repos/RM2026_WheelLegged_Gimbal.html) |
| 9 | RM2026_Transformable_Infantry | 2026-04-29 | 1d | 🟢 | 393 | 7 | 3 | [→](/repos/RM2026_Transformable_Infantry.html) |
| 10 | RM2026_Sentry_Nav_UC | 2026-04-29 | 1d | 🟢 | 11 | 1 | 2 | [→](/repos/RM2026_Sentry_Nav_UC.html) |
| 11 | RM2026_EngineerRobot | 2026-04-28 | 2d | 🟢 | 58 | 2 | 4 | [→](/repos/RM2026_EngineerRobot.html) |
| 12 | 2026_Missile_Chassis | 2026-04-27 | 3d | 🟢 | 24 | 2 | 1 | [→](/repos/2026_Missile_Chassis.html) |
| 13 | 2026_Laser_Gimble | 2026-04-27 | 3d | 🟢 | 19 | 2 | 1 | [→](/repos/2026_Laser_Gimble.html) |
| 14 | RM2026_TransformableInfantry | 2026-04-21 | 9d | 🟢 | 501 | 11 | 4 | [→](/repos/RM2026_TransformableInfantry.html) |
| 15 | RM2026_Waves_Analyze | 2026-04-19 | 11d | 🟢 | 18 | 1 | 2 | [→](/repos/RM2026_Waves_Analyze.html) |
| 16 | rl_sim2sim_lqr_raspberrypi | 2026-04-19 | 11d | 🟢 | 4 | 1 | 2 | [→](/repos/rl_sim2sim_lqr_raspberrypi.html) |
| 17 | RM2026_NAV_Sentry_UL | 2026-04-18 | 12d | 🟢 | 40 | 1 | 4 | [→](/repos/RM2026_NAV_Sentry_UL.html) |
| 18 | 2026_EGAIM | 2026-04-16 | 14d | 🟢 | 53 | 3 | 3 | [→](/repos/2026_EGAIM.html) |
| 19 | OnmiandSteer | 2026-04-14 | 16d | 🟢 | 348 | 6 | 2 | [→](/repos/OnmiandSteer.html) |
| 20 | 2026_HERO_UC | 2026-04-14 | 16d | 🟢 | 6 | 1 | 1 | [→](/repos/2026_HERO_UC.html) |
| 21 | EGAdapter_MC02 | 2026-04-13 | 17d | 🟢 | 515 | 11 | 3 | [→](/repos/EGAdapter_MC02.html) |
| 22 | 2026_EGAIM_wheeled_leg | 2026-04-13 | 17d | 🟢 | 49 | 3 | 1 | [→](/repos/2026_EGAIM_wheeled_leg.html) |
| 23 | 2026_EGAIM_autobuff | 2026-04-13 | 17d | 🟢 | 7 | 2 | 1 | [→](/repos/2026_EGAIM_autobuff.html) |
| 24 | AITools | 2026-04-12 | 18d | 🟢 | 2 | 1 | 1 | [→](/repos/AITools.html) |
| 25 | RM2026_EGARadar_develop | 2026-04-10 | 20d | 🟢 | 29 | 3 | 2 | [→](/repos/RM2026_EGARadar_develop.html) |
| 26 | EGAdapter_lib | 2026-04-07 | 23d | 🟢 | 25 | 1 | 1 | [→](/repos/EGAdapter_lib.html) |
| 27 | 2026_Gimbal_SentryFromInfantry | 2026-04-04 | 26d | 🟢 | 35 | 2 | 2 | [→](/repos/2026_Gimbal_SentryFromInfantry.html) |
| 28 | 26UL_Sentry_Chassis | 2026-04-03 | 27d | 🟢 | 2 | 1 | 2 | [→](/repos/26UL_Sentry_Chassis.html) |
| 29 | Raspberrypi_deployment | 2026-04-01 | 29d | 🟢 | 4 | 1 | 1 | [→](/repos/Raspberrypi_deployment.html) |
| 30 | 2026_AUTOAIM_HERO | 2026-03-30 | 31d | 🟡 | 81 | 5 | 2 | [→](/repos/2026_AUTOAIM_HERO.html) |
| 31 | 2026_INFANTRY_TO_SENTRY_CHASSIS | 2026-03-22 | 39d | 🟡 | 2 | 1 | 1 | [→](/repos/2026_INFANTRY_TO_SENTRY_CHASSIS.html) |
| 32 | RM2026_EGAdapter_WheelLegged_Chassis | 2026-03-19 | 42d | 🟡 | 8 | 1 | 4 | [→](/repos/RM2026_EGAdapter_WheelLegged_Chassis.html) |
| 33 | RM2026_PowerRune | 2026-03-19 | 42d | 🟡 | 4 | 1 | 1 | [→](/repos/RM2026_PowerRune.html) |
| 34 | RM2026_OmniandSteer_New | 2026-03-15 | 46d | 🟡 | 548 | 10 | 4 | [→](/repos/RM2026_OmniandSteer_New.html) |
| 35 | 2026_EGAIM_sentry | 2026-03-15 | 46d | 🟡 | 2 | 2 | 2 | [→](/repos/2026_EGAIM_sentry.html) |
| 36 | RM2026_UL_Sentry_Driver | 2026-03-06 | 55d | 🟡 | 1 | 1 | 4 | [→](/repos/RM2026_UL_Sentry_Driver.html) |
| 37 | RM2026_RoboticArm_ROS2 | 2026-02-27 | 62d | 🟡 | 4 | 1 | 1 | [→](/repos/RM2026_RoboticArm_ROS2.html) |
| 38 | 2026_infantry_Wheellegged_Chassis_RL_v0 | 2026-02-25 | 64d | 🟡 | 23 | 1 | 3 | [→](/repos/2026_infantry_Wheellegged_Chassis_RL_v0.html) |
| 39 | RM2026_TinyRos2 | 2026-02-21 | 68d | 🟡 | 22 | 1 | 1 | [→](/repos/RM2026_TinyRos2.html) |
| 40 | TransformableInfantry | 2026-02-04 | 85d | 🟡 | 506 | 10 | 3 | [→](/repos/TransformableInfantry.html) |
| 41 | RM2026_EGAdapter_mc02_base | 2026-02-02 | 87d | 🟡 | 44 | 4 | 3 | [→](/repos/RM2026_EGAdapter_mc02_base.html) |
| 42 | RM2026_EGAdapter_Cboard_base | 2026-02-02 | 87d | 🟡 | 16 | 4 | 3 | [→](/repos/RM2026_EGAdapter_Cboard_base.html) |
| 43 | 2025_Chassis_Hero_Infantry_Sentry | 2026-01-27 | 93d | 🔴 | 49 | 3 | 2 | [→](/repos/2025_Chassis_Hero_Infantry_Sentry.html) |
| 44 | 2026_Autoaim_Infantry | 2026-01-24 | 96d | 🔴 | 3 | 2 | 1 | [→](/repos/2026_Autoaim_Infantry.html) |
| 45 | 2026_NAV_sentry | 2026-01-19 | 101d | 🔴 | 4 | 1 | 1 | [→](/repos/2026_NAV_sentry.html) |
| 46 | RM2026_WheelLegged_Chassis | 2026-01-18 | 102d | 🔴 | 111 | 2 | 5 | [→](/repos/RM2026_WheelLegged_Chassis.html) |
| 47 | RM2026_Swerve_Chassis | 2026-01-18 | 102d | 🔴 | 19 | 1 | 1 | [→](/repos/RM2026_Swerve_Chassis.html) |
| 48 | RM2026_Drone_Gimbal | 2026-01-13 | 107d | 🔴 | 0 | 0 | 0 | [→](/repos/RM2026_Drone_Gimbal.html) |
| 49 | RM2026_WheelDog_chassis | 2026-01-10 | 110d | 🔴 | 36 | 1 | 4 | [→](/repos/RM2026_WheelDog_chassis.html) |
| 50 | 2026_Chassis_Infantry_TinyCake | 2026-01-08 | 112d | 🔴 | 10 | 1 | 1 | [→](/repos/2026_Chassis_Infantry_TinyCake.html) |
| 51 | RM2026_RoboticArm | 2026-01-08 | 112d | 🔴 | 3 | 1 | 2 | [→](/repos/RM2026_RoboticArm.html) |
| 52 | LK4005Driver | 2026-01-02 | 118d | 🔴 | 6 | 1 | 1 | [→](/repos/LK4005Driver.html) |
| 53 | 2026_Gimbal_Infantry | 2025-12-19 | 132d | 🔴 | 10 | 2 | 1 | [→](/repos/2026_Gimbal_Infantry.html) |
| 54 | IMU | 2025-12-15 | 136d | 🔴 | 7 | 2 | 2 | [→](/repos/IMU.html) |
| 55 | EGA-code-style | 2025-11-27 | 154d | 🔴 | 4 | 2 | 1 | [→](/repos/EGA-code-style.html) |
| 56 | wheel_legged_gym_ega | 2025-11-27 | 154d | 🔴 | 15 | 1 | 1 | [→](/repos/wheel_legged_gym_ega.html) |
| 57 | EGA_ChassisExample | 2025-11-12 | 169d | 🔴 | 12 | 3 | 1 | [→](/repos/EGA_ChassisExample.html) |
| 58 | EGA_GimbalExample | 2025-11-12 | 169d | 🔴 | 13 | 3 | 2 | [→](/repos/EGA_GimbalExample.html) |
| 59 | Chassis_Mecanum | 2025-11-07 | 174d | 🔴 | 1 | 1 | 2 | [→](/repos/Chassis_Mecanum.html) |
| 60 | RM2026_Gimbal_SixFricHero | 2025-11-05 | 176d | 🔴 | 160 | 6 | 7 | [→](/repos/RM2026_Gimbal_SixFricHero.html) |
| 61 | 2026_DMmc02BSP_ALL | 2025-07-28 | 276d | 🔴 | 5 | 1 | 1 | [→](/repos/2026_DMmc02BSP_ALL.html) |
| 62 | 2026_Autoaim_Sentry_Hero_Infantry | 2025-07-27 | 277d | 🔴 | 2 | 2 | 4 | [→](/repos/2026_Autoaim_Sentry_Hero_Infantry.html) |
| 63 | 2025_autoaim_sentry_infantry_hero | 2025-07-21 | 283d | 🔴 | 3 | 2 | 1 | [→](/repos/2025_autoaim_sentry_infantry_hero.html) |
| 64 | 2025_Gimbal_Infantry | 2025-06-23 | 311d | 🔴 | 42 | 5 | 2 | [→](/repos/2025_Gimbal_Infantry.html) |
| 65 | 2025_SuperCap_Hero_Infantry_Sentry | 2025-04-29 | 366d | 🔴 | 6 | 1 | 1 | [→](/repos/2025_SuperCap_Hero_Infantry_Sentry.html) |
| 66 | 2025_NAV_Sentry | 2025-04-25 | 370d | 🔴 | 2 | 1 | 1 | [→](/repos/2025_NAV_Sentry.html) |
| 67 | 2026_navigation_Sentry_ws | 2025-04-25 | 370d | 🔴 | 0 | 0 | 0 | [→](/repos/2026_navigation_Sentry_ws.html) |
| 68 | SMC_Cpp | 2025-04-21 | 374d | 🔴 | 2 | 1 | 1 | [→](/repos/SMC_Cpp.html) |
| 69 | 2025_Gimbal_Hero | 2025-03-29 | 397d | 🔴 | 14 | 1 | 1 | [→](/repos/2025_Gimbal_Hero.html) |
| 70 | 2025_Gimbalright_Sentry | 2025-03-28 | 398d | 🔴 | 13 | 3 | 1 | [→](/repos/2025_Gimbalright_Sentry.html) |
| 71 | 2025_Gimbalyaw_Sentry | 2025-03-28 | 398d | 🔴 | 14 | 2 | 1 | [→](/repos/2025_Gimbalyaw_Sentry.html) |
| 72 | 2025_Gimballeft_Sentry | 2025-03-28 | 398d | 🔴 | 13 | 3 | 1 | [→](/repos/2025_Gimballeft_Sentry.html) |

### 2.2 贡献者统一排行 (Commits + 行数同口径)

> 同一 SHA 跨仓库/分支只计一次。仅统计触及 User Code 路径的 commit。>3000 行/commit 视为批量导入。

| # | 贡献者 | 唯一Commits | Code Add | Code Del | Net | Code Commits | 批量导入 | 仓库 | 身份 |
|---|--------|-----------|----------|----------|-----|-------------|---------|------|------|
| 1 | shangtianxuanniao | 345 | 18,632 | 10,328 | +8,304 | 343 | 268,590 | 7 |  |
| 2 | Hrmys3 | 294 | 34,562 | 24,990 | +9,572 | 293 | 19,455 | 7 |  |
| 3 | JAHNAN00 | 289 | 46,279 | 39,830 | +6,449 | 286 | 25,270 | 9 |  |
| 4 | teleaki | 145 | 11,910 | 9,571 | +2,339 | 144 | 18,567 | 9 |  |
| 5 | xinruilee04 | 128 | 12,240 | 6,022 | +6,218 | 123 | 90,588 | 12 |  |
| 6 | Beecheer | 111 | 27,577 | 11,577 | +16,000 | 104 | 64,925 | 8 |  |
| 7 | chushanxiaodaoshi | 97 | 16,193 | 9,258 | +6,935 | 91 | 136,709 | 8 |  |
| 8 | pyrosucrose | 91 | 19,819 | 14,048 | +5,771 | 83 | 80,268 | 9 |  |
| 9 | Co1con | 89 | 22,433 | 34,215 | -11,782 | 83 | 163,534 | 8 |  |
| 10 | konichan-7 | 77 | 3,228 | 1,720 | +1,508 | 77 | - | 1 | [non-org] |
| 11 | LemonServer | 71 | 9,224 | 3,230 | +5,994 | 66 | 1,021,785 | 8 |  |
| 12 | Breeze-by | 59 | 8,411 | 4,370 | +4,041 | 56 | 19,685 | 7 |  |
| 13 | jessica070413 | 48 | 4,538 | 2,903 | +1,635 | 45 | 12,925 | 4 |  |
| 14 | yly-true | 46 | 11,600 | 27,494 | -15,894 | 35 | 335,624 | 5 |  |
| 15 | fishyu | 36 | 1,427 | 649 | +778 | 36 | - | 1 | [non-org] |
| 16 | littlef111 | 27 | 6,609 | 897 | +5,712 | 24 | 15,319 | 4 |  |
| 17 | ega-rog | 22 | 5,541 | 56,815 | -51,274 | 20 | 67,286 | 1 | [non-org] |
| 18 | wx2450 | 19 | 506 | 270 | +236 | 14 | 74,591 | 5 |  |
| 19 | WANGJ-miao | 17 | 1,458 | 2,196 | -738 | 16 | 133,833 | 3 |  |
| 20 | chen0000-sudo | 16 | 2,786 | 2,893 | -107 | 14 | 7,081 | 3 |  |
| 21 | ssssssqy | 10 | 5,832 | 9,535 | -3,703 | 9 | 90,837 | 4 |  |
| 22 | XiaoYoung | 10 | 213 | 237 | -24 | 10 | - | 1 | [non-org] |
| 23 | juiceooorange | 9 | 433 | 469 | -36 | 8 | 20,618 | 2 |  |
| 24 | leanusli | 9 | 1,256 | 7,077 | -5,821 | 8 | 5,874 | 1 | [non-org] |
| 25 | SadMei | 8 | 2,211 | 5,182 | -2,971 | 8 | - | 5 |  |
| 26 | jinnes06 | 8 | 1,743 | 2 | +1,741 | 7 | 7,172 | 1 | [non-org] |
| 27 | jinnes | 6 | 1,042 | 86 | +956 | 5 | 19,603 | 1 | [non-org] |
| 28 | zlm-ega | 5 | 407 | 19 | +388 | 5 | - | 1 | [non-org] |
| 29 | Dreamingiv | 5 | 287 | 333 | -46 | 5 | - | 1 |  |
| 30 | thhos | 5 | 2,330 | 33,455 | -31,125 | 4 | 3,263 | 1 |  |
| 31 | 你的名字 | 4 | 1,999 | 406 | +1,593 | 3 | 46,516 | 1 | [non-org] |
| 32 | dawncity1104 | 4 | 64 | 118 | -54 | 2 | 22,691 | 1 |  |
| 33 | YYZ-XeF6 | 3 | 39 | 8 | +31 | 3 | - | 2 |  |
| 34 | WithBreeze | 3 | 186 | 62 | +124 | 3 | - | 1 | [non-org] |
| 35 | Phospheneser | 2 | 213 | 1 | +212 | 2 | - | 2 |  |
| 36 | En-cke | 2 | 2 | 2 | +0 | 2 | - | 1 |  |
| 37 | zaraaa | 2 | 1,991 | 16 | +1,975 | 2 | - | 2 | [non-org] |
| 38 | ClearWei | 2 | 524 | 0 | +524 | 2 | - | 1 |  |
| 39 | zfw-scut | 2 | 581 | 164 | +417 | 1 | 15,260 | 1 | [non-org] |
| 40 | Za892961012 | 1 | 1 | 1 | +0 | 1 | - | 1 | [non-org] |
| 41 | RXC | 1 | 0 | 0 | +0 | 0 | 21,885 | 1 | [non-org] |
| 42 | me-speaker | 1 | 0 | 0 | +0 | 0 | 88,685 | 1 |  |
| 43 | Leannnnnnn | 1 | 811 | 0 | +811 | 1 | - | 1 |  |

### 2.3 语言分布

总量: **551,989,198** 字节 (526.4 MB)

| 语言 | 字节数 | 占比 | 仓库数 |
|------|--------|------|--------|
| C | 424,549,675 | 76.91% | 45 |
| C++ | 67,386,626 | 12.21% | 10 |
| Makefile | 31,083,617 | 5.63% | 4 |
| CMake | 11,204,113 | 2.03% | 0 |
| Python | 6,158,893 | 1.12% | 4 |
| HTML | 5,406,964 | 0.98% | 1 |
| JavaScript | 1,944,762 | 0.35% | 0 |
| Shell | 1,709,653 | 0.31% | 0 |
| Assembly | 1,231,077 | 0.22% | 0 |
| Linker Script | 468,051 | 0.08% | 0 |
| PowerShell | 285,359 | 0.05% | 0 |
| MATLAB | 178,173 | 0.03% | 1 |
| CSS | 157,819 | 0.03% | 0 |
| Cuda | 51,118 | 0.01% | 0 |
| TypeScript | 50,482 | 0.01% | 0 |
| QML | 47,142 | 0.01% | 0 |
| Rust | 45,974 | 0.01% | 0 |
| Meson | 20,508 | 0.0% | 0 |
| Batchfile | 5,525 | 0.0% | 0 |
| Dockerfile | 3,667 | 0.0% | 0 |

### 2.4 仓库规模与代码行数

| # | 仓库 | 大小(MB) | 当前代码行数 | User Code Add | 详情 |
|---|------|---------|-----------|--------------|------|
| 1 | RM26_QtClient | 682.5 | 0 | 0 | [→](/repos/RM26_QtClient.html) |
| 2 | RM2026_EGARadar_develop | 272.7 | 31,630 | 6,583 | [→](/repos/RM2026_EGARadar_develop.html) |
| 3 | RM2026_Sentry_Nav_UC | 237.0 | 71,597 | 2,669 | [→](/repos/RM2026_Sentry_Nav_UC.html) |
| 4 | RM2026_NAV_Sentry_UL | 202.1 | 71,741 | 4,923 | [→](/repos/RM2026_NAV_Sentry_UL.html) |
| 5 | 2026_AUTOAIM_HERO | 142.6 | 2,106 | 7,624 | [→](/repos/2026_AUTOAIM_HERO.html) |
| 6 | 2026_EGAIM | 126.8 | 1,965 | 2,065 | [→](/repos/2026_EGAIM.html) |
| 7 | 2026_EGAIM_wheeled_leg | 126.8 | 1,978 | 2,076 | [→](/repos/2026_EGAIM_wheeled_leg.html) |
| 8 | 2026_infantry_Wheellegged_Chassis_RL_v0 | 124.7 | 28,927 | 12,400 | [→](/repos/2026_infantry_Wheellegged_Chassis_RL_v0.html) |
| 9 | 2026_HERO_UC | 120.9 | 43,245 | 727 | [→](/repos/2026_HERO_UC.html) |
| 10 | 2026_EGAIM_sentry | 117.9 | 1,974 | 1,974 | [→](/repos/2026_EGAIM_sentry.html) |
| 11 | 2026_EGAIM_sentry_ros2 | 96.5 | 2,162 | 2,307 | [→](/repos/2026_EGAIM_sentry_ros2.html) |
| 12 | 2026_Autoaim_Infantry | 96.5 | 1,841 | 1,841 | [→](/repos/2026_Autoaim_Infantry.html) |
| 13 | 2026_NAV_sentry | 66.9 | 51,033 | 627 | [→](/repos/2026_NAV_sentry.html) |
| 14 | rl_sim2sim_lqr_raspberrypi | 41.6 | 14,573 | 2,683 | [→](/repos/rl_sim2sim_lqr_raspberrypi.html) |
| 15 | miao_machine_learning_wheelleg_infantry | 33.7 | 22,179 | 7,465 | [→](/repos/miao_machine_learning_wheelleg_infantry.html) |
| 16 | RM2026_EGAdapter_WheelLeg_Hero | 30.3 | 33,635 | 11,005 | [→](/repos/RM2026_EGAdapter_WheelLeg_Hero.html) |
| 17 | EGAdapter_lib | 19.0 | 107 | 413 | [→](/repos/EGAdapter_lib.html) |
| 18 | RM2026_WheelLegged_Gimbal | 17.2 | 21,722 | 5,048 | [→](/repos/RM2026_WheelLegged_Gimbal.html) |
| 19 | RM2026_WheelLegged_Chassis | 16.0 | 20,125 | 16,676 | [→](/repos/RM2026_WheelLegged_Chassis.html) |
| 20 | 2025_SuperCap_Hero_Infantry_Sentry | 14.9 | 0 | 6 | [→](/repos/2025_SuperCap_Hero_Infantry_Sentry.html) |

### 2.5 时间线

| 月份 | 新建 | 累计 |
|------|------|------|
| 2024-11 | 1 | 1 |
| 2025-01 | 3 | 4 |
| 2025-02 | 2 | 6 |
| 2025-03 | 2 | 8 |
| 2025-04 | 4 | 12 |
| 2025-06 | 1 | 13 |
| 2025-07 | 1 | 14 |
| 2025-09 | 3 | 17 |
| 2025-10 | 7 | 24 |
| 2025-11 | 6 | 30 |
| 2025-12 | 7 | 37 |
| 2026-01 | 9 | 46 |
| 2026-02 | 6 | 52 |
| 2026-03 | 11 | 63 |
| 2026-04 | 9 | 72 |

## 3. 框架体系与 Fork 链

```
EGAdapter_MC02
  ├── RM2026_Hero_SwerveDrive
  ├── RM2026_TransformableInfantry
  └── RM2026_OmniandSteer_New
RM2026_EGAdapter_Cboard_base
  └── RM2026_EGAdapter_WheelLegged_Chassis
RM2026_EGAdapter_mc02_base
  └── RM2026_EGAdapter_WheelLeg_Hero
2026_EGAIM
  └── 2026_EGAIM_wheeled_leg
OnmiandSteer
  └── RM2026_Transformable_Infantry
```

## 4. 机器人矩阵

### General (26)

| 仓库 | 领域 | 赛季 | Commits | 详情 |
|------|------|------|---------|------|
| EGAdapter_MC02 | 框架 | 2025/2026 | 515 | [→](/repos/EGAdapter_MC02.html) |
| RM26_QtClient | 工具 | 2025/2026 | 67 | [→](/repos/RM26_QtClient.html) |
| 2026_EGAIM | 自瞄 | 2026 | 53 | [→](/repos/2026_EGAIM.html) |
| 2026_EGAIM_wheeled_leg | 自瞄 | 2026 | 49 | [→](/repos/2026_EGAIM_wheeled_leg.html) |
| RM2026_EGAdapter_mc02_base | 框架 | 2026 | 44 | [→](/repos/RM2026_EGAdapter_mc02_base.html) |
| RM2026_EGARadar_develop | 工具 | 2026 | 29 | [→](/repos/RM2026_EGARadar_develop.html) |
| EGAdapter_lib | 框架 | 2026 | 25 | [→](/repos/EGAdapter_lib.html) |
| RM2026_TinyRos2 | 工具 | 2026 | 22 | [→](/repos/RM2026_TinyRos2.html) |
| 2026_Laser_Gimble | 嵌入式 | 2026 | 19 | [→](/repos/2026_Laser_Gimble.html) |
| RM2026_Swerve_Chassis | 底盘 | 2026 | 19 | [→](/repos/RM2026_Swerve_Chassis.html) |
| RM2026_Waves_Analyze | 工具 | 2026 | 18 | [→](/repos/RM2026_Waves_Analyze.html) |
| RM2026_EGAdapter_Cboard_base | 框架 | 2026 | 16 | [→](/repos/RM2026_EGAdapter_Cboard_base.html) |
| EGA_GimbalExample | 框架, 云台 | 2025/2026 | 13 | [→](/repos/EGA_GimbalExample.html) |
| EGA_ChassisExample | 框架, 底盘 | 2025/2026 | 12 | [→](/repos/EGA_ChassisExample.html) |
| IMU | 嵌入式 | 2025/2026 | 7 | [→](/repos/IMU.html) |
| 2026_EGAIM_autobuff | 自瞄 | 2026 | 7 | [→](/repos/2026_EGAIM_autobuff.html) |
| LK4005Driver | 嵌入式 | 2025/2026 | 6 | [→](/repos/LK4005Driver.html) |
| 2026_DMmc02BSP_ALL | 框架 | 2026 | 5 | [→](/repos/2026_DMmc02BSP_ALL.html) |
| EGA-code-style | 其他 | 2025/2026 | 4 | [→](/repos/EGA-code-style.html) |
| RM2026_PowerRune | 嵌入式 | 2026 | 4 | [→](/repos/RM2026_PowerRune.html) |
| Raspberrypi_deployment | 上位机/算法 | 2026 | 4 | [→](/repos/Raspberrypi_deployment.html) |
| rl_sim2sim_lqr_raspberrypi | RL | 2026 | 4 | [→](/repos/rl_sim2sim_lqr_raspberrypi.html) |
| SMC_Cpp | 嵌入式 | 2025/2026 | 2 | [→](/repos/SMC_Cpp.html) |
| AITools | 工具 | 2026 | 2 | [→](/repos/AITools.html) |
| Fudan-RobotEGA.github.io | 网站 | 2025/2026 | 1 | [→](/repos/Fudan-RobotEGA.github.io.html) |
| Chassis_Mecanum | 底盘 | 2025/2026 | 1 | [→](/repos/Chassis_Mecanum.html) |

### Sentry (18)

| 仓库 | 领域 | 赛季 | Commits | 详情 |
|------|------|------|---------|------|
| 2025_Chassis_Hero_Infantry_Sentry | 底盘 | 2025 | 49 | [→](/repos/2025_Chassis_Hero_Infantry_Sentry.html) |
| RM2026_NAV_Sentry_UL | 导航 | 2026 | 40 | [→](/repos/RM2026_NAV_Sentry_UL.html) |
| 2026_Gimbal_SentryFromInfantry | 云台 | 2026 | 35 | [→](/repos/2026_Gimbal_SentryFromInfantry.html) |
| 2025_Gimbalyaw_Sentry | 云台 | 2025 | 14 | [→](/repos/2025_Gimbalyaw_Sentry.html) |
| 2025_Gimbalright_Sentry | 云台 | 2025 | 13 | [→](/repos/2025_Gimbalright_Sentry.html) |
| 2025_Gimballeft_Sentry | 云台 | 2025 | 13 | [→](/repos/2025_Gimballeft_Sentry.html) |
| 2026_EGAIM_sentry_ros2 | 自瞄, 工具 | 2026 | 12 | [→](/repos/2026_EGAIM_sentry_ros2.html) |
| RM2026_Sentry_Nav_UC | 导航 | 2026 | 11 | [→](/repos/RM2026_Sentry_Nav_UC.html) |
| 2025_SuperCap_Hero_Infantry_Sentry | 超级电容 | 2025 | 6 | [→](/repos/2025_SuperCap_Hero_Infantry_Sentry.html) |
| 2026_NAV_sentry | 导航 | 2026 | 4 | [→](/repos/2026_NAV_sentry.html) |
| 2025_autoaim_sentry_infantry_hero | 自瞄 | 2025 | 3 | [→](/repos/2025_autoaim_sentry_infantry_hero.html) |
| 2025_NAV_Sentry | 导航 | 2025 | 2 | [→](/repos/2025_NAV_Sentry.html) |
| 2026_Autoaim_Sentry_Hero_Infantry | 自瞄 | 2026 | 2 | [→](/repos/2026_Autoaim_Sentry_Hero_Infantry.html) |
| 2026_EGAIM_sentry | 自瞄 | 2026 | 2 | [→](/repos/2026_EGAIM_sentry.html) |
| 2026_INFANTRY_TO_SENTRY_CHASSIS | 底盘 | 2026 | 2 | [→](/repos/2026_INFANTRY_TO_SENTRY_CHASSIS.html) |
| 26UL_Sentry_Chassis | 底盘 | 2026 | 2 | [→](/repos/26UL_Sentry_Chassis.html) |
| RM2026_UL_Sentry_Driver | 嵌入式 | 2026 | 1 | [→](/repos/RM2026_UL_Sentry_Driver.html) |
| 2026_navigation_Sentry_ws | 导航 | 2026 | 0 | [→](/repos/2026_navigation_Sentry_ws.html) |

### Infantry (15)

| 仓库 | 领域 | 赛季 | Commits | 详情 |
|------|------|------|---------|------|
| TransformableInfantry | 嵌入式 | 2026 | 506 | [→](/repos/TransformableInfantry.html) |
| RM2026_TransformableInfantry | 其他 | 2026 | 501 | [→](/repos/RM2026_TransformableInfantry.html) |
| RM2026_Transformable_Infantry | 嵌入式 | 2026 | 393 | [→](/repos/RM2026_Transformable_Infantry.html) |
| 2025_Chassis_Hero_Infantry_Sentry | 底盘 | 2025 | 49 | [→](/repos/2025_Chassis_Hero_Infantry_Sentry.html) |
| 2025_Gimbal_Infantry | 云台 | 2025 | 42 | [→](/repos/2025_Gimbal_Infantry.html) |
| 2026_Gimbal_SentryFromInfantry | 云台 | 2026 | 35 | [→](/repos/2026_Gimbal_SentryFromInfantry.html) |
| miao_machine_learning_wheelleg_infantry | 嵌入式 | 2026 | 27 | [→](/repos/miao_machine_learning_wheelleg_infantry.html) |
| 2026_infantry_Wheellegged_Chassis_RL_v0 | 底盘, RL | 2026 | 23 | [→](/repos/2026_infantry_Wheellegged_Chassis_RL_v0.html) |
| 2026_Gimbal_Infantry | 云台 | 2026 | 10 | [→](/repos/2026_Gimbal_Infantry.html) |
| 2026_Chassis_Infantry_TinyCake | 底盘 | 2026 | 10 | [→](/repos/2026_Chassis_Infantry_TinyCake.html) |
| 2025_SuperCap_Hero_Infantry_Sentry | 超级电容 | 2025 | 6 | [→](/repos/2025_SuperCap_Hero_Infantry_Sentry.html) |
| 2025_autoaim_sentry_infantry_hero | 自瞄 | 2025 | 3 | [→](/repos/2025_autoaim_sentry_infantry_hero.html) |
| 2026_Autoaim_Infantry | 自瞄 | 2026 | 3 | [→](/repos/2026_Autoaim_Infantry.html) |
| 2026_Autoaim_Sentry_Hero_Infantry | 自瞄 | 2026 | 2 | [→](/repos/2026_Autoaim_Sentry_Hero_Infantry.html) |
| 2026_INFANTRY_TO_SENTRY_CHASSIS | 底盘 | 2026 | 2 | [→](/repos/2026_INFANTRY_TO_SENTRY_CHASSIS.html) |

### Hero (10)

| 仓库 | 领域 | 赛季 | Commits | 详情 |
|------|------|------|---------|------|
| RM2026_Hero_SwerveDrive | 嵌入式 | 2026 | 665 | [→](/repos/RM2026_Hero_SwerveDrive.html) |
| RM2026_Gimbal_SixFricHero | 云台, 发射 | 2026 | 160 | [→](/repos/RM2026_Gimbal_SixFricHero.html) |
| RM2026_EGAdapter_WheelLeg_Hero | 框架 | 2026 | 123 | [→](/repos/RM2026_EGAdapter_WheelLeg_Hero.html) |
| 2026_AUTOAIM_HERO | 自瞄 | 2026 | 81 | [→](/repos/2026_AUTOAIM_HERO.html) |
| 2025_Chassis_Hero_Infantry_Sentry | 底盘 | 2025 | 49 | [→](/repos/2025_Chassis_Hero_Infantry_Sentry.html) |
| 2025_Gimbal_Hero | 云台 | 2025 | 14 | [→](/repos/2025_Gimbal_Hero.html) |
| 2025_SuperCap_Hero_Infantry_Sentry | 超级电容 | 2025 | 6 | [→](/repos/2025_SuperCap_Hero_Infantry_Sentry.html) |
| 2026_HERO_UC | 嵌入式 | 2026 | 6 | [→](/repos/2026_HERO_UC.html) |
| 2025_autoaim_sentry_infantry_hero | 自瞄 | 2025 | 3 | [→](/repos/2025_autoaim_sentry_infantry_hero.html) |
| 2026_Autoaim_Sentry_Hero_Infantry | 自瞄 | 2026 | 2 | [→](/repos/2026_Autoaim_Sentry_Hero_Infantry.html) |

### WheelLegged (8)

| 仓库 | 领域 | 赛季 | Commits | 详情 |
|------|------|------|---------|------|
| RM2026_EGAdapter_WheelLeg_Hero | 框架 | 2026 | 123 | [→](/repos/RM2026_EGAdapter_WheelLeg_Hero.html) |
| RM2026_WheelLegged_Chassis | 底盘 | 2026 | 111 | [→](/repos/RM2026_WheelLegged_Chassis.html) |
| RM2026_WheelLegged_Gimbal | 云台 | 2026 | 66 | [→](/repos/RM2026_WheelLegged_Gimbal.html) |
| RM2026_WheelDog_chassis | 底盘 | 2026 | 36 | [→](/repos/RM2026_WheelDog_chassis.html) |
| miao_machine_learning_wheelleg_infantry | 嵌入式 | 2026 | 27 | [→](/repos/miao_machine_learning_wheelleg_infantry.html) |
| 2026_infantry_Wheellegged_Chassis_RL_v0 | 底盘, RL | 2026 | 23 | [→](/repos/2026_infantry_Wheellegged_Chassis_RL_v0.html) |
| wheel_legged_gym_ega | 上位机/算法 | 2025/2026 | 15 | [→](/repos/wheel_legged_gym_ega.html) |
| RM2026_EGAdapter_WheelLegged_Chassis | 框架, 底盘 | 2026 | 8 | [→](/repos/RM2026_EGAdapter_WheelLegged_Chassis.html) |

### Engineer (3)

| 仓库 | 领域 | 赛季 | Commits | 详情 |
|------|------|------|---------|------|
| RM2026_EngineerRobot | 嵌入式 | 2026 | 58 | [→](/repos/RM2026_EngineerRobot.html) |
| RM2026_RoboticArm_ROS2 | 工具 | 2026 | 4 | [→](/repos/RM2026_RoboticArm_ROS2.html) |
| RM2026_RoboticArm | 嵌入式 | 2026 | 3 | [→](/repos/RM2026_RoboticArm.html) |

### TransformableInfantry (3)

| 仓库 | 领域 | 赛季 | Commits | 详情 |
|------|------|------|---------|------|
| TransformableInfantry | 嵌入式 | 2026 | 506 | [→](/repos/TransformableInfantry.html) |
| RM2026_TransformableInfantry | 其他 | 2026 | 501 | [→](/repos/RM2026_TransformableInfantry.html) |
| RM2026_Transformable_Infantry | 嵌入式 | 2026 | 393 | [→](/repos/RM2026_Transformable_Infantry.html) |

### Drone (2)

| 仓库 | 领域 | 赛季 | Commits | 详情 |
|------|------|------|---------|------|
| 2026_Gimbal_Sky | 云台 | 2026 | 15 | [→](/repos/2026_Gimbal_Sky.html) |
| RM2026_Drone_Gimbal | 云台 | 2026 | 0 | [→](/repos/RM2026_Drone_Gimbal.html) |

### OmniSteer (2)

| 仓库 | 领域 | 赛季 | Commits | 详情 |
|------|------|------|---------|------|
| RM2026_OmniandSteer_New | 其他 | 2026 | 548 | [→](/repos/RM2026_OmniandSteer_New.html) |
| OnmiandSteer | 嵌入式 | 2026 | 348 | [→](/repos/OnmiandSteer.html) |

### Dart (1)

| 仓库 | 领域 | 赛季 | Commits | 详情 |
|------|------|------|---------|------|
| 2026_Missile_Chassis | 底盘 | 2026 | 24 | [→](/repos/2026_Missile_Chassis.html) |

## 5. 代码质量

| 指标 | 达标 | 比例 |
|------|------|------|
| 有描述 | 58/72 | 81% |
| 有 License | 8/72 | 11% |
| 多贡献者 | 40/72 | 56% |

## 6. 全部仓库一览

### 2025 (9)

| 仓库 | 语言 | 代码行数 | Commits | 贡献者 | 状态 | 详情 |
|------|------|---------|---------|--------|------|------|
| 2025_Chassis_Hero_Infantry_Sentry | C | 6,635 | 49 | 3 | 🔴 | [→](/repos/2025_Chassis_Hero_Infantry_Sentry.html) |
| 2025_Gimbal_Infantry | C | 19,120 | 42 | 5 | 🔴 | [→](/repos/2025_Gimbal_Infantry.html) |
| 2025_Gimbalyaw_Sentry | C | 21,017 | 14 | 2 | 🔴 | [→](/repos/2025_Gimbalyaw_Sentry.html) |
| 2025_Gimbal_Hero | C | 21,857 | 14 | 1 | 🔴 | [→](/repos/2025_Gimbal_Hero.html) |
| 2025_Gimbalright_Sentry | C | 21,425 | 13 | 3 | 🔴 | [→](/repos/2025_Gimbalright_Sentry.html) |
| 2025_Gimballeft_Sentry | C | 21,404 | 13 | 3 | 🔴 | [→](/repos/2025_Gimballeft_Sentry.html) |
| 2025_SuperCap_Hero_Infantry_Sentry | C | 0 | 6 | 1 | 🔴 | [→](/repos/2025_SuperCap_Hero_Infantry_Sentry.html) |
| 2025_autoaim_sentry_infantry_hero | C++ | 73,276 | 3 | 2 | 🔴 | [→](/repos/2025_autoaim_sentry_infantry_hero.html) |
| 2025_NAV_Sentry | Makefile | 33,481 | 2 | 1 | 🔴 | [→](/repos/2025_NAV_Sentry.html) |

### 2025/2026 (11)

| 仓库 | 语言 | 代码行数 | Commits | 贡献者 | 状态 | 详情 |
|------|------|---------|---------|--------|------|------|
| EGAdapter_MC02 | C | 19,688 | 515 | 11 | 🟢 | [→](/repos/EGAdapter_MC02.html) |
| RM26_QtClient | C++ | 0 | 67 | 1 | 🟢 | [→](/repos/RM26_QtClient.html) |
| wheel_legged_gym_ega | Python | 7,194 | 15 | 1 | 🔴 | [→](/repos/wheel_legged_gym_ega.html) |
| EGA_GimbalExample | C | 24,412 | 13 | 3 | 🔴 | [→](/repos/EGA_GimbalExample.html) |
| EGA_ChassisExample | C | 1,778 | 12 | 3 | 🔴 | [→](/repos/EGA_ChassisExample.html) |
| IMU | C | 739 | 7 | 2 | 🔴 | [→](/repos/IMU.html) |
| LK4005Driver | C | 17,299 | 6 | 1 | 🔴 | [→](/repos/LK4005Driver.html) |
| EGA-code-style | - | 0 | 4 | 2 | 🔴 | [→](/repos/EGA-code-style.html) |
| SMC_Cpp | C++ | 112 | 2 | 1 | 🔴 | [→](/repos/SMC_Cpp.html) |
| Fudan-RobotEGA.github.io | HTML | 117 | 1 | 1 | 🟢 | [→](/repos/Fudan-RobotEGA.github.io.html) |
| Chassis_Mecanum | - | 0 | 1 | 1 | 🔴 | [→](/repos/Chassis_Mecanum.html) |

### 2026 (52)

| 仓库 | 语言 | 代码行数 | Commits | 贡献者 | 状态 | 详情 |
|------|------|---------|---------|--------|------|------|
| RM2026_Hero_SwerveDrive⑂ | C | 11,978 | 665 | 10 | 🟢 | [→](/repos/RM2026_Hero_SwerveDrive.html) |
| RM2026_OmniandSteer_New⑂ | - | 11,978 | 548 | 10 | 🟡 | [→](/repos/RM2026_OmniandSteer_New.html) |
| TransformableInfantry | C | 11,978 | 506 | 10 | 🟡 | [→](/repos/TransformableInfantry.html) |
| RM2026_TransformableInfantry⑂ | - | 13,927 | 501 | 11 | 🟢 | [→](/repos/RM2026_TransformableInfantry.html) |
| RM2026_Transformable_Infantry⑂ | C | 16,615 | 393 | 7 | 🟢 | [→](/repos/RM2026_Transformable_Infantry.html) |
| OnmiandSteer | C | 17,051 | 348 | 6 | 🟢 | [→](/repos/OnmiandSteer.html) |
| RM2026_Gimbal_SixFricHero | C | 9,241 | 160 | 6 | 🔴 | [→](/repos/RM2026_Gimbal_SixFricHero.html) |
| RM2026_EGAdapter_WheelLeg_Hero⑂ | C | 33,635 | 123 | 8 | 🟢 | [→](/repos/RM2026_EGAdapter_WheelLeg_Hero.html) |
| RM2026_WheelLegged_Chassis | C | 20,125 | 111 | 2 | 🔴 | [→](/repos/RM2026_WheelLegged_Chassis.html) |
| 2026_AUTOAIM_HERO | C++ | 2,106 | 81 | 5 | 🟡 | [→](/repos/2026_AUTOAIM_HERO.html) |
| RM2026_WheelLegged_Gimbal | C | 21,722 | 66 | 3 | 🟢 | [→](/repos/RM2026_WheelLegged_Gimbal.html) |
| RM2026_EngineerRobot | C++ | 8,850 | 58 | 2 | 🟢 | [→](/repos/RM2026_EngineerRobot.html) |
| 2026_EGAIM | C | 1,965 | 53 | 3 | 🟢 | [→](/repos/2026_EGAIM.html) |
| 2026_EGAIM_wheeled_leg⑂ | C | 1,978 | 49 | 3 | 🟢 | [→](/repos/2026_EGAIM_wheeled_leg.html) |
| RM2026_EGAdapter_mc02_base | C | 11,080 | 44 | 4 | 🟡 | [→](/repos/RM2026_EGAdapter_mc02_base.html) |
| RM2026_NAV_Sentry_UL | Makefile | 71,741 | 40 | 1 | 🟢 | [→](/repos/RM2026_NAV_Sentry_UL.html) |
| RM2026_WheelDog_chassis | C | 3,957 | 36 | 1 | 🔴 | [→](/repos/RM2026_WheelDog_chassis.html) |
| 2026_Gimbal_SentryFromInfantry | C | 20,282 | 35 | 2 | 🟢 | [→](/repos/2026_Gimbal_SentryFromInfantry.html) |
| RM2026_EGARadar_develop | Python | 31,630 | 29 | 3 | 🟢 | [→](/repos/RM2026_EGARadar_develop.html) |
| miao_machine_learning_wheelleg_infantry | C | 22,179 | 27 | 1 | 🟢 | [→](/repos/miao_machine_learning_wheelleg_infantry.html) |
| EGAdapter_lib | C | 107 | 25 | 1 | 🟢 | [→](/repos/EGAdapter_lib.html) |
| 2026_Missile_Chassis | C | 10,823 | 24 | 2 | 🟢 | [→](/repos/2026_Missile_Chassis.html) |
| 2026_infantry_Wheellegged_Chassis_RL_v0 | C++ | 28,927 | 23 | 1 | 🟡 | [→](/repos/2026_infantry_Wheellegged_Chassis_RL_v0.html) |
| RM2026_TinyRos2 | C++ | 125 | 22 | 1 | 🟡 | [→](/repos/RM2026_TinyRos2.html) |
| 2026_Laser_Gimble | C | 5,854 | 19 | 2 | 🟢 | [→](/repos/2026_Laser_Gimble.html) |
| RM2026_Swerve_Chassis | C | 6,133 | 19 | 1 | 🔴 | [→](/repos/RM2026_Swerve_Chassis.html) |
| RM2026_Waves_Analyze | MATLAB | 2,543 | 18 | 1 | 🟢 | [→](/repos/RM2026_Waves_Analyze.html) |
| RM2026_EGAdapter_Cboard_base | C | 10,193 | 16 | 4 | 🟡 | [→](/repos/RM2026_EGAdapter_Cboard_base.html) |
| 2026_Gimbal_Sky | C | 34,029 | 15 | 3 | 🟢 | [→](/repos/2026_Gimbal_Sky.html) |
| 2026_EGAIM_sentry_ros2 | C | 2,162 | 12 | 3 | 🟢 | [→](/repos/2026_EGAIM_sentry_ros2.html) |
| RM2026_Sentry_Nav_UC | Makefile | 71,597 | 11 | 1 | 🟢 | [→](/repos/RM2026_Sentry_Nav_UC.html) |
| 2026_Gimbal_Infantry | C | 19,403 | 10 | 2 | 🔴 | [→](/repos/2026_Gimbal_Infantry.html) |
| 2026_Chassis_Infantry_TinyCake | C | 6,294 | 10 | 1 | 🔴 | [→](/repos/2026_Chassis_Infantry_TinyCake.html) |
| RM2026_EGAdapter_WheelLegged_Chassis⑂ | C | 13,384 | 8 | 1 | 🟡 | [→](/repos/RM2026_EGAdapter_WheelLegged_Chassis.html) |
| 2026_EGAIM_autobuff | C++ | 16,259 | 7 | 2 | 🟢 | [→](/repos/2026_EGAIM_autobuff.html) |
| 2026_HERO_UC | C | 43,245 | 6 | 1 | 🟢 | [→](/repos/2026_HERO_UC.html) |
| 2026_DMmc02BSP_ALL | C | 990 | 5 | 1 | 🔴 | [→](/repos/2026_DMmc02BSP_ALL.html) |
| 2026_NAV_sentry | Makefile | 51,033 | 4 | 1 | 🔴 | [→](/repos/2026_NAV_sentry.html) |
| RM2026_RoboticArm_ROS2 | C++ | 17,072 | 4 | 1 | 🟡 | [→](/repos/RM2026_RoboticArm_ROS2.html) |
| RM2026_PowerRune | C | 24,042 | 4 | 1 | 🟡 | [→](/repos/RM2026_PowerRune.html) |
| Raspberrypi_deployment | Python | 249 | 4 | 1 | 🟢 | [→](/repos/Raspberrypi_deployment.html) |
| rl_sim2sim_lqr_raspberrypi | Python | 14,573 | 4 | 1 | 🟢 | [→](/repos/rl_sim2sim_lqr_raspberrypi.html) |
| 2026_Autoaim_Infantry | C | 1,841 | 3 | 2 | 🔴 | [→](/repos/2026_Autoaim_Infantry.html) |
| RM2026_RoboticArm | C | 8,979 | 3 | 1 | 🔴 | [→](/repos/RM2026_RoboticArm.html) |
| 2026_Autoaim_Sentry_Hero_Infantry | C++ | 73,276 | 2 | 2 | 🔴 | [→](/repos/2026_Autoaim_Sentry_Hero_Infantry.html) |
| 2026_EGAIM_sentry | C | 1,974 | 2 | 2 | 🟡 | [→](/repos/2026_EGAIM_sentry.html) |
| 2026_INFANTRY_TO_SENTRY_CHASSIS | C | 6,622 | 2 | 1 | 🟡 | [→](/repos/2026_INFANTRY_TO_SENTRY_CHASSIS.html) |
| 26UL_Sentry_Chassis | C | 6,681 | 2 | 1 | 🟢 | [→](/repos/26UL_Sentry_Chassis.html) |
| AITools | - | 0 | 2 | 1 | 🟢 | [→](/repos/AITools.html) |
| RM2026_UL_Sentry_Driver | C | 13,762 | 1 | 1 | 🟡 | [→](/repos/RM2026_UL_Sentry_Driver.html) |
| 2026_navigation_Sentry_ws | - | 0 | 0 | 0 | 🔴 | [→](/repos/2026_navigation_Sentry_ws.html) |
| RM2026_Drone_Gimbal | - | 0 | 0 | 0 | 🔴 | [→](/repos/RM2026_Drone_Gimbal.html) |

## 7. 问题与建议

1. **License 缺失**: 64/72
2. **低活跃**: 30 个 >90 天未更新
3. **单贡献者**: 32 个仓库
4. **默认分支不一致**: 多个仓库主力开发在非默认分支
5. **描述缺失**: 14 个

## 附录

- 全量 clone 70 个仓库 + `git log --all --no-merges --numstat`
- 路径过滤: 53 个 `User/`, 部分 `src/`, 3 个 exclude SDK, 14 个全量
- SHA 全组织一次性去重: 同一 commit 跨仓库/分支只计一次 commit 和一次行数
- 批量导入: >3000 行/commit 单独标注
- 匿名合并: jingw0206-miao→WANGJ-miao, yly→yly-true, YYZ_XeF6_→YYZ-XeF6, linn_li→Leannnnnnn

---
> [可视化](/report-visual.html) · 2026-05-01
