<template>
  <RouterLink
    class="card-button floating-back-button icon-only-button"
    :to="to"
    :aria-label="label"
    :title="label"
    :style="{ bottom: `${bottomOffset}px` }"
  >
    <svg class="floating-back-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M10 7L5 12L10 17M6 12H15C18.3137 12 21 14.6863 21 18V19"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
    </svg>
  </RouterLink>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});

const bottomOffset = ref(24);

const updateOffset = () => {
  const footer = document.querySelector(".site-footer");
  const viewportHeight = window.innerHeight;
  const baseOffset = viewportHeight <= 640 ? 16 : 24;

  if (!footer) {
    bottomOffset.value = baseOffset;
    return;
  }

  const footerRect = footer.getBoundingClientRect();
  const overlap = viewportHeight - footerRect.top;

  bottomOffset.value = overlap > 0 ? overlap + 12 : baseOffset;
};

onMounted(() => {
  updateOffset();
  window.addEventListener("scroll", updateOffset, { passive: true });
  window.addEventListener("resize", updateOffset);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateOffset);
  window.removeEventListener("resize", updateOffset);
});
</script>
