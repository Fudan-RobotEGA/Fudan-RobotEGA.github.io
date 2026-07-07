<template>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink class="brand" to="/">
        <img src="/ega-logo/ega透明底白.png" alt="星云 EGA" class="brand-logo" />
        <span class="brand-text">
          <strong>{{ site.shortName }}</strong>
          <small>{{ site.englishName }}</small>
        </span>
      </RouterLink>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="site-navigation"
        aria-label="展开导航菜单"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav id="site-navigation" class="main-nav" :class="{ 'is-open': isMenuOpen }">
        <RouterLink to="/" active-class="is-active">首页</RouterLink>
        <RouterLink to="/about" active-class="is-active">关于战队</RouterLink>
        <RouterLink to="/robots" active-class="is-active">星云机甲</RouterLink>
        <RouterLink to="/open-docs" active-class="is-active">开源文档</RouterLink>
        <RouterLink to="/contact" active-class="is-active">联系我们</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { useRoute } from "vue-router";
import site from "../content/site.json";

const route = useRoute();
const isMenuOpen = ref(false);

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false;
  },
);
</script>
