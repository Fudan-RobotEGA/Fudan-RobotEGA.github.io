<script setup lang="ts">
import { ref, computed } from 'vue'

type Member = {
  name: string
  college: string
  avatar: string
}

type GroupKey = 'advisor' | 'ec' | 'algo' | 'mech'

type YearData = Record<GroupKey, Member[]>

// 可在此处补充更多赛年数据
const years = ref<string[]>(['2025', '2024'])
const currentYear = ref<string>(years.value[0])

const membersByYear = ref<Record<string, YearData>>({
  '2025': {
    advisor: [
      { name: '张三', college: '信息科学与工程学院', avatar: '/plume.svg' },
    ],
    ec: [
      { name: '李四', college: '信息科学与工程学院', avatar: '/plume.svg' },
    ],
    algo: [
      { name: '王五', college: '计算机科学技术学院', avatar: '/plume.svg' },
    ],
    mech: [
      { name: '赵六', college: '工程与应用技术研究院', avatar: '/plume.svg' },
    ],
  },
  '2024': {
    advisor: [
      { name: '张老师', college: '信息科学与工程学院', avatar: '/plume.svg' },
    ],
    ec: [
      { name: '陈电', college: '信息科学与工程学院', avatar: '/plume.svg' },
    ],
    algo: [
      { name: '孙算', college: '计算机科学技术学院', avatar: '/plume.svg' },
    ],
    mech: [
      { name: '周机', college: '工程与应用技术研究院', avatar: '/plume.svg' },
    ],
  },
})

const grouped = computed(() => membersByYear.value[currentYear.value])

function onChangeYear(y: string) {
  currentYear.value = y
}
</script>

<template>
  <div class="team-members">
    <div class="tm-header">
      <h1 class="tm-title">战队成员</h1>
      <div class="tm-year-switcher">
        <label class="tm-year-label">赛年</label>
        <select class="tm-year-select" :value="currentYear" @change="onChangeYear(($event.target as HTMLSelectElement).value)">
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
    </div>

    <section class="tm-section">
      <h2 class="tm-section-title">指导老师</h2>
      <div class="tm-grid">
        <div v-for="m in grouped.advisor" :key="m.name" class="tm-card">
          <img class="tm-avatar" :src="m.avatar" :alt="m.name" />
          <div class="tm-name">{{ m.name }}</div>
          <div class="tm-college">{{ m.college }}</div>
        </div>
      </div>
    </section>

    <section class="tm-section">
      <h2 class="tm-section-title">电控组</h2>
      <div class="tm-grid">
        <div v-for="m in grouped.ec" :key="m.name" class="tm-card">
          <img class="tm-avatar" :src="m.avatar" :alt="m.name" />
          <div class="tm-name">{{ m.name }}</div>
          <div class="tm-college">{{ m.college }}</div>
        </div>
      </div>
    </section>

    <section class="tm-section">
      <h2 class="tm-section-title">算法组</h2>
      <div class="tm-grid">
        <div v-for="m in grouped.algo" :key="m.name" class="tm-card">
          <img class="tm-avatar" :src="m.avatar" :alt="m.name" />
          <div class="tm-name">{{ m.name }}</div>
          <div class="tm-college">{{ m.college }}</div>
        </div>
      </div>
    </section>

    <section class="tm-section">
      <h2 class="tm-section-title">机械组</h2>
      <div class="tm-grid">
        <div v-for="m in grouped.mech" :key="m.name" class="tm-card">
          <img class="tm-avatar" :src="m.avatar" :alt="m.name" />
          <div class="tm-name">{{ m.name }}</div>
          <div class="tm-college">{{ m.college }}</div>
        </div>
      </div>
    </section>
  </div>
  
</template>

<style scoped>
.team-members {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.tm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.tm-title {
  margin: 0;
  font-size: 28px;
  line-height: 32px;
}

.tm-year-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tm-year-label {
  color: var(--vp-c-text-2);
}

.tm-year-select {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border, #e5e7eb);
  background: var(--vp-c-bg-elv, #fff);
  color: var(--vp-c-text-1, #1f2937);
}

.tm-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tm-section-title {
  margin: 0;
  font-size: 20px;
}

.tm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.tm-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 10px;
  background: var(--vp-c-bg-elv, #fff);
  border: 1px solid var(--vp-c-border, #e5e7eb);
  border-radius: 12px;
}

.tm-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--vp-c-bg-alt, #f6f6f7);
}

.tm-name {
  font-weight: 600;
}

.tm-college {
  color: var(--vp-c-text-2);
  font-size: 12px;
}
</style>


