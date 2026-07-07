<template>
  <section class="page-head robots-stream-head">
    <p class="eyebrow ega-eyebrow">EGA ROBOT STREAM</p>
    <h1>星云机甲</h1>
    <p>集中展示战队各机组的赛季信息、阶段状态与技术关键词，持续记录机器人研发脉络。</p>

    <div class="robots-stream-meta">
      <span>共 {{ robots.length }} 个机组</span>
      <span>覆盖 {{ seasonCount }} 个赛季</span>
    </div>
  </section>

  <section class="robots-stream-shell">
    <div class="robots-stream-columns" :style="{ '--stream-columns': String(columnCount) }">
      <div v-for="(column, columnIndex) in columns" :key="`column-${columnIndex}`" class="robots-stream-column">
        <RouterLink
          v-for="robot in column"
          :key="robot.slug"
          class="robot-stream-card"
          :class="{
            'is-entering-down': recentlyLoadedSlugs.has(robot.slug) && loadDirection === 'down',
            'is-entering-up': recentlyLoadedSlugs.has(robot.slug) && loadDirection === 'up',
          }"
          :to="`/robots/${encodeURIComponent(robot.slug)}`"
          :aria-label="`查看机甲：${robot.title}`"
        >
          <div class="robot-stream-cover-wrap">
            <img
              :src="robot.cover"
              :alt="robot.title"
              loading="lazy"
              class="robot-stream-cover"
              :style="robot.coverPosition ? { objectPosition: robot.coverPosition } : undefined"
            />
            <span class="robot-stream-season">{{ robot.season }}</span>
          </div>

          <div class="robot-stream-body">
            <div class="robot-stream-topline">
              <span class="robot-stream-role">{{ robot.role }}</span>
              <span class="robot-stream-status">{{ robot.status }}</span>
            </div>

            <h2>{{ robot.title }}</h2>
            <p>{{ robot.summary }}</p>

            <div class="chip-list compact robot-stream-tags">
              <span v-for="tag in robot.tags.slice(0, 5)" :key="`${robot.slug}-${tag}`" class="chip">{{ tag }}</span>
            </div>

            <span class="robot-stream-link">查看详情 <span aria-hidden="true">→</span></span>
          </div>
        </RouterLink>
      </div>
    </div>

    <div ref="sentinelRef" class="robots-stream-loader" aria-hidden="true">
      <span v-if="renderedRobots.length < robots.length">正在加载更多机组</span>
      <span v-else>已展示全部机组</span>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { getAllRobots } from "../lib/robots";

const robots = getAllRobots();
const seasonCount = new Set(robots.map((robot) => robot.season)).size;

const renderedRobots = ref(robots.slice(0, 8));
const recentlyLoadedSlugs = ref(new Set());
const sentinelRef = ref(null);
const viewportWidth = ref(typeof window === "undefined" ? 1280 : window.innerWidth);
const isLoadingMore = ref(false);
const loadDirection = ref("down");

const columnCount = computed(() => {
  if (viewportWidth.value <= 560) return 1;
  if (viewportWidth.value <= 760) return 2;
  if (viewportWidth.value <= 1080) return 3;
  return 4;
});

const batchSize = computed(() => columnCount.value * 2);

const columns = computed(() => {
  const buckets = Array.from({ length: columnCount.value }, () => []);
  renderedRobots.value.forEach((robot, index) => {
    buckets[index % columnCount.value].push(robot);
  });
  return buckets;
});

let observer;
let loadingTimer;
let clearAnimationTimer;
let lastScrollY = 0;

const updateViewportWidth = () => {
  viewportWidth.value = window.innerWidth;
};

const updateScrollDirection = () => {
  const currentScrollY = window.scrollY;
  loadDirection.value = currentScrollY < lastScrollY ? "up" : "down";
  lastScrollY = currentScrollY;
};

const markRecentlyLoaded = (items) => {
  recentlyLoadedSlugs.value = new Set(items.map((item) => item.slug));
  window.clearTimeout(clearAnimationTimer);
  clearAnimationTimer = window.setTimeout(() => {
    recentlyLoadedSlugs.value = new Set();
  }, 520);
};

const loadMore = () => {
  if (isLoadingMore.value || renderedRobots.value.length >= robots.length) return;

  isLoadingMore.value = true;
  loadingTimer = window.setTimeout(() => {
    const nextItems = robots.slice(renderedRobots.value.length, renderedRobots.value.length + batchSize.value);
    renderedRobots.value = renderedRobots.value.concat(nextItems);
    markRecentlyLoaded(nextItems);
    isLoadingMore.value = false;
  }, 220);
};

onMounted(() => {
  lastScrollY = window.scrollY;
  window.addEventListener("resize", updateViewportWidth, { passive: true });
  window.addEventListener("scroll", updateScrollDirection, { passive: true });

  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadMore();
      }
    },
    {
      rootMargin: "420px 0px",
    },
  );

  if (sentinelRef.value) {
    observer.observe(sentinelRef.value);
  }
});

onBeforeUnmount(() => {
  observer?.disconnect();
  window.clearTimeout(loadingTimer);
  window.clearTimeout(clearAnimationTimer);
  window.removeEventListener("resize", updateViewportWidth);
  window.removeEventListener("scroll", updateScrollDirection);
});
</script>
