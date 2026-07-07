<template>
  <div class="about-page-bg">
    <section class="about-hero">
      <div class="about-hero-grid" aria-hidden="true"></div>
      <div class="about-hero-inner">
        <div class="about-hero-copy">
          <p class="eyebrow ega-eyebrow">ABOUT EGA</p>
          <p class="about-hero-kicker">EGA Robotics Team</p>
          <h1 class="about-hero-name">{{ about.heroName }}</h1>
          <p class="about-hero-summary">{{ about.heroSummary }}</p>

          <div class="about-hero-metrics" aria-label="战队概览">
            <article v-for="metric in aboutMetrics" :key="metric.label" class="about-metric-card">
              <span>{{ metric.label }}</span>
              <strong>{{ metric.value }}</strong>
            </article>
          </div>
        </div>

        <aside class="about-hero-panel">
          <p class="eyebrow">TEAM PROFILE</p>
          <div class="about-highlight-card" v-if="about.introHighlight">
            <p>{{ site.slogan }}</p>
          </div>

          <div class="about-hero-points">
            <div>
              <span>赛道</span>
              <strong>RoboMaster</strong>
            </div>
            <div>
              <span>定位</span>
              <strong>学生机器人工程战队</strong>
            </div>
            <div>
              <span>精神来源</span>
              <strong>{{ about.origin.motto }}</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <section class="ega-about-section about-story-section">
      <div class="section-wrap about-story-grid">
        <div class="about-section-rail">
          <p class="eyebrow">EST. 2024</p>
          <h2>{{ about.origin.title }}</h2>
        </div>

        <div class="about-story-stack">
          <article class="about-origin-card">
            <div class="about-card-topline">
              <span>ORIGIN</span>
              <span>{{ about.origin.mottoSource }}</span>
            </div>
            <div class="about-culture-quote">{{ about.origin.motto }}</div>
            <p v-for="paragraph in about.origin.paragraphs" :key="paragraph">{{ paragraph }}</p>
          </article>

          <article v-for="item in about.culture" :key="item.quote" class="about-culture-card">
            <div class="about-card-topline">
              <span>MOTTO</span>
              <span>{{ item.source }}</span>
            </div>
            <div class="about-culture-quote">{{ item.quote }}</div>
            <p>{{ item.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="ega-about-section about-naming-section">
      <div class="section-wrap">
        <div class="about-naming-shell">
          <div class="about-naming-copy">
            <p class="eyebrow">ROBOT SYSTEM</p>
            <h2>{{ about.naming.title }}</h2>
            <p>{{ about.naming.intro }}</p>
          </div>

          <div class="about-naming-visual">
            <img src="/about-naming.png" alt="北斗七星命名体系" class="about-naming-img" loading="lazy" />
          </div>
        </div>

        <div class="about-stars-grid">
          <article v-for="star in about.naming.stars" :key="star.name" class="about-star-card">
            <div class="about-star-header">
              <span class="about-star-name">{{ star.name }}</span>
              <span class="about-star-alias">{{ star.alias }}</span>
            </div>
            <h3>{{ star.robot }}</h3>
            <p>{{ star.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="ega-home-section about-directions-section">
      <div class="section-wrap">
        <div class="ega-section-heading">
          <div>
            <p class="eyebrow">DIRECTIONS</p>
            <h2>技术方向</h2>
            <p class="about-directions-summary">围绕完整机器人系统建设，覆盖从结构、控制到感知与团队协作的主要链路。</p>
          </div>
        </div>

        <div class="about-directions-grid">
          <article v-for="item in about.directions" :key="item.title" class="about-direction-card">
            <div class="about-direction-head">
              <span class="about-direction-index">{{ item.title.slice(0, 2) }}</span>
              <h3>{{ item.title }}</h3>
            </div>
            <p>{{ item.text }}</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import about from "../content/team/about.json";
import site from "../content/site.json";

const aboutMetrics = [
  { label: "建立时间", value: "2024" },
  { label: "技术方向", value: `${about.directions.length} 个` },
  { label: "机组体系", value: `${about.naming.stars.length} 个` },
  { label: "核心赛道", value: "RoboMaster" },
];
</script>
