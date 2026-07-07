<template>
  <section class="page-head">
    <p class="eyebrow ega-eyebrow">OPEN DOCS</p>
    <h1>开源文档</h1>
    <p>收录开源项目说明、技术文档、代码库分析、赛事复盘、团建活动与团队资料。</p>
  </section>

  <section class="panel search-panel">
    <form class="search-form" @submit.prevent>
      <div class="search-bar-wrap">
        <span class="search-icon" aria-hidden="true"></span>
        <div class="search-input-wrap">
          <input v-model.trim="keyword" type="search" placeholder="搜索文档标题或摘要" />
        </div>
      </div>
    </form>
  </section>

  <section class="panel filter-panel filter-panel-soft" v-if="tagOptions.length">
    <details class="collapsible-filter-bar">
      <summary><span class="filter-bar-main">按标签筛选</span></summary>
      <div class="filter-expanded-content">
        <div class="filter-block">
          <p class="filter-title">标签</p>
          <div class="soft-chip-list">
            <button class="soft-chip" :class="{ active: !activeTag }" type="button" @click="activeTag = ''">全部</button>
            <button v-for="tag in tagOptions" :key="tag" class="soft-chip" :class="{ active: activeTag === tag }" type="button" @click="activeTag = tag">{{ tag }}</button>
          </div>
        </div>
      </div>
    </details>
  </section>

  <section class="document-list">
    <article v-for="doc in filteredDocs" :key="doc.slug" class="panel document-card">
      <RouterLink class="document-card-link" :to="`/open-docs/${encodeURIComponent(doc.slug)}`" :aria-label="`查看文档：${doc.title}`" />
      <div class="document-card-top">
        <p class="meta">{{ formatDate(doc.date) }}</p>
        <span v-if="doc.sticky" class="sticky-badge">置顶</span>
      </div>
      <h2><span class="document-title-text">{{ doc.title }}</span></h2>
      <p>{{ doc.excerpt }}</p>
      <div class="meta-group">
        <span v-for="tag in doc.tags" :key="`${doc.slug}-${tag}`" class="chip">#{{ tag }}</span>
      </div>
    </article>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { getAllDocs } from "../lib/docs";

const docs = getAllDocs();
const activeTag = ref("");
const keyword = ref("");

const tagOptions = [...new Set(docs.flatMap((doc) => doc.tags))].sort();

const filteredDocs = computed(() =>
  docs.filter((doc) => {
    if (activeTag.value && !doc.tags.includes(activeTag.value)) return false;
    if (!keyword.value) return true;
    const needle = keyword.value.toLowerCase();
    return doc.title.toLowerCase().includes(needle) || doc.excerpt.toLowerCase().includes(needle);
  }),
);

const formatDate = (value) => (value ? value.toString().slice(0, 10) : "未设置日期");
</script>
