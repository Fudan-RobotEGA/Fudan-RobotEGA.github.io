<template>
  <section class="panel">
    <p class="eyebrow">404</p>
    <h1>页面不存在</h1>
    <p>你访问的页面已被移动或暂未创建。</p>
    <RouterLink class="text-link" to="/">返回首页</RouterLink>
  </section>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>
