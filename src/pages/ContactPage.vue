<template>
  <section class="page-head">
    <p class="eyebrow ega-eyebrow">CONTACT</p>
    <h1>{{ contact.title }}</h1>
    <p>{{ contact.summary }}</p>
  </section>

  <section v-if="contact.channels.length" class="ega-home-section">
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
            <span class="contact-link-label">
              <span class="contact-link-icon" aria-hidden="true" v-html="getLinkIcon(link.name)"></span>
              {{ link.name }}：
            </span>
            <a :href="link.url" target="_blank" rel="noreferrer">{{ link.url }}</a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import contact from "../content/contact.json";

const getLinkIcon = (name) => {
  if (name === "GitHub") {
    return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2.17c-3.2.7-3.88-1.35-3.88-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.52-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.39-5.25 5.68.41.35.77 1.03.77 2.08v3.08c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>';
  }

  if (name === "Bilibili") {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4.5 9.5 7M17 4.5 14.5 7"/><path d="M6.5 7.5h11A2.5 2.5 0 0 1 20 10v7A2.5 2.5 0 0 1 17.5 19.5h-11A2.5 2.5 0 0 1 4 17v-7a2.5 2.5 0 0 1 2.5-2.5Z"/><path d="M9.5 11.5v3M14.5 11.5v3"/><path d="M8.5 16.5h7"/></svg>';
  }

  return "";
};
</script>
