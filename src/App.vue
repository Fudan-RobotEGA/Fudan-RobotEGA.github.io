<template>
  <div class="app-shell">
    <SiteHeader />
    <main class="page-shell">
      <RouterView />
    </main>
    <footer class="site-footer">
      <span>© {{ year }} {{ site.footer }}</span>
      <span>{{ site.englishName }} · RoboMaster · Open Docs</span>
    </footer>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import SiteHeader from "./components/SiteHeader.vue";
import site from "./content/site.json";

const year = new Date().getFullYear();
</script>
