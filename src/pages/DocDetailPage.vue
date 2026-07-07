<template>
  <article v-if="doc" class="panel article-page">
    <p class="meta">{{ doc.date || "未设置日期" }}</p>
    <h1>{{ doc.title }}</h1>
    <div class="meta-group">
      <span v-for="tag in doc.tags" :key="`tag-${tag}`" class="chip">#{{ tag }}</span>
    </div>
    <div class="markdown-body" v-html="rendered"></div>
  </article>

  <FloatingBackButton v-if="doc" to="/open-docs" label="返回开源文档" />

  <section v-else class="panel">
    <h1>文档不存在</h1>
    <RouterLink class="card-button" to="/open-docs">返回开源文档</RouterLink>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import FloatingBackButton from "../components/FloatingBackButton.vue";
import { resolveDocAssetPath } from "../lib/contentAssets";
import { getDocBySlug } from "../lib/docs";
import { renderMarkdown } from "../lib/markdown";

const route = useRoute();
const doc = computed(() => getDocBySlug(decodeURIComponent(String(route.params.slug || ""))));
const rendered = computed(() => (doc.value ? renderMarkdown(doc.value.content, resolveDocAssetPath) : ""));
</script>
