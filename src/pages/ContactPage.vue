<template>
  <section class="page-head">
    <p class="eyebrow ega-eyebrow">CONTACT</p>
    <h1>{{ contact.title }}</h1>
    <p>{{ contact.summary }}</p>
  </section>

  <section class="ega-home-section">
    <div class="section-wrap">
      <div class="ega-intro-layout">
        <article v-for="channel in contact.channels" :key="channel.title" class="ega-intro-card">
          <span class="ega-card-index">{{ channel.title.slice(0, 2) }}</span>
          <h3>{{ channel.title }}</h3>
          <p>{{ channel.description }}</p>
          <a class="ega-text-link" :href="`mailto:${channel.email}`">{{ channel.email }} →</a>
        </article>
      </div>
    </div>
  </section>

  <section class="ega-home-section" v-if="contact.links.length">
    <div class="section-wrap">
      <div class="timeline-panel panel">
        <h2>公开链接</h2>
        <ul class="list">
          <li v-for="link in contact.links" :key="link.name">
            {{ link.name }}：<a :href="link.url" target="_blank" rel="noreferrer">{{ link.url }}</a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import contact from "../content/contact.json";
</script>
