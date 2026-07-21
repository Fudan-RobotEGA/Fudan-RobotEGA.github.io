<template>
  <section class="home-hero ega-hero">
    <div class="ega-hero-slides" aria-hidden="true">
      <div
        v-for="(image, index) in backgroundImages"
        :key="image"
        class="ega-hero-slide"
        :class="{ 'is-active': index === activeBackgroundIndex }"
        :style="{ backgroundImage: `url('${image}')` }"
      ></div>
    </div>
    <div class="ega-hero-grid" aria-hidden="true"></div>
    <div class="ega-hero-orbit" aria-hidden="true"></div>

    <div class="ega-hero-inner">
      <div class="ega-hero-copy">
        <p class="eyebrow ega-eyebrow">EGA ROBOTICS TEAM</p>
        <div class="ega-slogan-lockup" aria-label="筚路蓝缕，以启山林">
          <img src="/ega-slogan/白_透明底_星云EGA机器人战队_裁切.png" alt="星云 EGA" />
        </div>
        <p>{{ site.slogan }}</p>
        <div class="hero-actions">
          <RouterLink class="ega-button-primary" to="/about">了解战队 <span>→</span></RouterLink>
          <RouterLink class="ega-button-secondary" to="/robots">查看星云机甲 <span>→</span></RouterLink>
        </div>
      </div>

      <div class="ega-hero-status" aria-label="战队状态信息">
        <span>FUDAN UNIVERSITY</span>
        <span>ROBOTICS TEAM</span>
        <span>ROBOMASTER</span>
        <span>OPEN SOURCE</span>
      </div>
    </div>
  </section>

  <section class="ega-home-section ega-intro-section">
    <div class="section-wrap ega-intro-layout">
      <article class="ega-intro-card ega-intro-card-large">
        <p class="eyebrow">ABOUT EGA</p>
        <h2>{{ site.name }}</h2>
        <p>{{ site.description }}</p>
        <RouterLink class="ega-text-link" to="/about">阅读战队介绍 <span>→</span></RouterLink>
      </article>

      <article v-for="item in abilities" :key="item.title" class="ega-intro-card">
        <span class="ega-card-index">{{ item.icon }}</span>
        <h3>{{ item.title }}</h3>
        <p>{{ item.text }}</p>
      </article>
    </div>
  </section>

  <section class="ega-home-section ega-robot-section">
    <div class="section-wrap">
      <div class="ega-section-heading">
        <div>
          <p class="eyebrow">ROBOT ARCHIVE</p>
          <h2>星云机甲</h2>
        </div>
        <RouterLink class="ega-text-link" to="/robots" aria-label="查看全部星云机甲">
          查看全部 <span>→</span>
        </RouterLink>
      </div>

      <div class="ega-robot-grid">
        <RouterLink
          v-for="robot in featuredRobots"
          :key="robot.slug"
          class="ega-robot-card"
          :to="`/robots/${encodeURIComponent(robot.slug)}`"
          :aria-label="`查看机甲：${robot.title}`"
        >
          <img :src="robot.cover" :alt="robot.title" loading="lazy" />
          <div class="ega-robot-card-body">
            <p class="meta">{{ robot.season }} 赛季 · {{ robot.role }}</p>
            <h3>{{ robot.title }}</h3>
            <p>{{ robot.summary }}</p>
            <div class="chip-list compact">
              <span v-for="tag in robot.tags.slice(0, 3)" :key="`${robot.slug}-${tag}`" class="chip">
                {{ tag }}
              </span>
            </div>
          </div>
          <span class="ega-card-arrow" aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </div>
  </section>

  <section class="ega-home-section ega-battlescope-section" aria-labelledby="battlescope-home-title">
    <div class="section-wrap">
      <div class="ega-section-heading">
        <div>
          <p class="eyebrow">TRAINING REVIEW</p>
          <h2 id="battlescope-home-title">赛训复盘平台</h2>
        </div>
        <a class="ega-text-link" href="/rm-battlescope/" aria-label="打开赛训复盘平台">
          打开平台 <span>→</span>
        </a>
      </div>

      <a class="ega-battlescope-feature" href="/rm-battlescope/">
        <div class="ega-battlescope-copy">
          <h3>RM BattleScope</h3>
          <p>把 RMUC 2026 比赛数据转化为赛局趋势、交战态势、强队对标和操作表现。</p>
          <span class="ega-card-inline-link">打开完整在线版 <span aria-hidden="true">→</span></span>
        </div>
        <div class="ega-battlescope-metrics" aria-label="BattleScope 在线数据范围">
          <span><strong>17</strong><small>复旦比赛</small></span>
          <span><strong>4</strong><small>分析模块</small></span>
          <span><strong>5</strong><small>对标比赛</small></span>
        </div>
      </a>
    </div>
  </section>

  <section class="ega-home-section ega-docs-section">
    <div class="section-wrap">
      <div class="ega-section-heading">
        <div>
          <p class="eyebrow">OPEN DOCS</p>
          <h2>开源文档</h2>
        </div>
        <RouterLink class="ega-text-link" to="/open-docs" aria-label="查看全部开源文档">
          查看全部 <span>→</span>
        </RouterLink>
      </div>

      <div class="ega-docs-grid">
        <article class="ega-docs-panel">
          <p class="eyebrow">KNOWLEDGE BASE</p>
          <p class="ega-docs-lead">记录工程过程，而不只展示结果。把文档当作研发链路的一部分，持续迭代。</p>
          <RouterLink class="ega-button-primary" to="/open-docs">进入开源文档 <span>→</span></RouterLink>
        </article>

        <RouterLink
          v-for="doc in featuredDocs"
          :key="doc.slug"
          class="ega-doc-card"
          :to="`/open-docs/${encodeURIComponent(doc.slug)}`"
          :aria-label="`查看文档：${doc.title}`"
        >
          <p class="meta">{{ formatDate(doc.date) }}</p>
          <h3>{{ doc.title }}</h3>
          <p>{{ doc.excerpt }}</p>
          <div class="chip-list compact">
            <span v-for="tag in doc.tags.slice(0, 3)" :key="`${doc.slug}-${tag}`" class="chip">#{{ tag }}</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>

  <section class="ega-home-section ega-contact-strip">
    <div class="section-wrap ega-contact-inner">
      <p>赞助合作 / 招新咨询 / 技术交流</p>
      <RouterLink class="ega-button-secondary dark" to="/contact">联系我们 <span>→</span></RouterLink>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { RouterLink } from "vue-router";
import site from "../content/site.json";
import { getAllDocs } from "../lib/docs";
import { getAllRobots } from "../lib/robots";

const backgroundImages = [
  "/backgrounds/1780330346651.jpg",
  "/backgrounds/1780330543725.jpg",
  "/backgrounds/1780330564980.jpg",
  "/backgrounds/1780330739627.jpg",
  "/backgrounds/1780330754442.jpg",
  "/backgrounds/1780330764779.jpg",
  "/backgrounds/1780331457769.jpg",
  "/backgrounds/mmexport5135ba6edf4f7997db2ce0e115f3ee4e_1780436638387.jpeg",
];

const activeBackgroundIndex = ref(0);
let backgroundTimer;

onMounted(() => {
  backgroundTimer = window.setInterval(() => {
    activeBackgroundIndex.value = (activeBackgroundIndex.value + 1) % backgroundImages.length;
  }, 6200);
});

onUnmounted(() => {
  window.clearInterval(backgroundTimer);
});

const abilities = [
  { icon: "ME", title: "机械结构", text: "围绕机器人机构设计、加工装配与可靠性迭代。" },
  { icon: "EC", title: "嵌入式电控", text: "建设整车控制、通信、传感器与调试体系。" },
  { icon: "AI", title: "视觉算法", text: "沉淀识别、定位、预测、导航与赛场策略能力。" },
  { icon: "OS", title: "开源文档", text: "整理技术资产，持续建设开源说明与团队文档。" },
];

const featuredRobots = getAllRobots().slice(0, 3);
const featuredDocs = getAllDocs()
  .filter((doc) => !doc.slug.includes("placeholder") && doc.slug !== "template")
  .slice(0, 3);

const formatDate = (value) => (value ? value.toString().slice(0, 10) : "未设置日期");
</script>
