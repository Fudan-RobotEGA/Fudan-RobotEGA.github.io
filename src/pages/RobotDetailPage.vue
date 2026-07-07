<template>
  <section v-if="robot" class="panel detail-head">
    <p class="eyebrow">ROBOT DETAIL</p>
    <h1>{{ robot.title }}</h1>
    <p class="meta">{{ robot.season }} 赛季 · {{ robot.role }} · {{ robot.status }}</p>
    <p>{{ robot.summary }}</p>
    <div class="chip-list compact">
      <span v-for="tag in robot.tags" :key="tag" class="chip">{{ tag }}</span>
    </div>
  </section>

  <section v-if="robot && rendered" class="panel article-page">
    <div class="markdown-body" v-html="rendered"></div>
  </section>

  <section v-if="robot && !rendered" class="panel">
    <h2>资料整理中</h2>
    <p>这台机组的详细介绍正在整理中，相关设计记录、系统方案与赛场信息将陆续发布。</p>
  </section>

  <FloatingBackButton v-if="robot" to="/robots" label="返回星云机甲" />

  <section v-else class="panel">
    <h1>机甲不存在</h1>
    <RouterLink class="card-button" to="/robots">返回星云机甲</RouterLink>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import FloatingBackButton from "../components/FloatingBackButton.vue";
import { resolveRobotAssetPath } from "../lib/contentAssets";
import { getRobotBySlug, getRobotMarkdownBySlug } from "../lib/robots";
import { renderMarkdown } from "../lib/markdown";

const route = useRoute();
const robot = computed(() => getRobotBySlug(decodeURIComponent(String(route.params.slug || ""))));
const rendered = computed(() =>
  robot.value ? renderMarkdown(getRobotMarkdownBySlug(robot.value.slug), resolveRobotAssetPath) : "",
);
</script>
