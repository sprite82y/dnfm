<template>
  <div class="card shadow-lg border-2" :class="gradeBorderClass">
    <div class="card-header text-center py-4" :class="[gradeBgClass, result ? 'text-white' : 'text-secondary']">
      <h3 class="card-title mb-1">合成结果</h3>
      <p class="card-subtitle">{{ result?.grade || '未合成' }}源石</p>
    </div>
    <div class="card-body">
      <div v-if="result" class="text-center mb-4">
        <div class="fs-1 mb-3">💎</div>
        <div class="d-flex justify-content-center gap-4 small">
          <span class="badge bg-info">
            皇冠词条: {{ crownCount }}
          </span>
          <span class="badge bg-secondary">
            普通词条: {{ normalCount }}
          </span>
        </div>
      </div>

      <div v-if="result" class="mt-4">
        <div class="form-label">合成后词条</div>
        <ul class="list-group">
          <li
            v-for="(entry, index) in result.entries"
            :key="index"
            class="list-group-item d-flex align-items-center justify-content-between mb-2"
            :class="entry.isCrown ? 'crown-bg' : 'bg-white'"
          >
            <span class="d-flex align-items-center gap-3">
              <span v-if="entry.isCrown">👑</span>
              <span class="fw-medium">{{ entry.isCrown ? '皇冠' : '普通' }}</span>
              <span class="small text-muted">来源: {{ entry.source === 'A' ? '源石A' : '源石B' }}</span>
            </span>
            <span class="badge" :class="entry.isCrown ? 'bg-warning text-dark' : 'bg-secondary text-white'">
              {{ index + 1 }}
            </span>
          </li>
        </ul>
      </div>

      <div v-else class="text-center py-5">
        <div class="fs-4 mb-3">🔮</div>
        <p class="text-muted">请选择源石A和源石B后点击合成</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  result: {
    type: Object,
    default: null
  }
})

const gradeBgClass = computed(() => {
  if (!props.result) return 'bg-light'
  const grade = props.result.grade
  if (grade === '史诗') return 'app-bg-purple'
  if (grade === '神器') return 'app-bg-orange'
  if (grade === '稀有') return 'bg-primary'
  return 'bg-secondary'
})

const gradeBorderClass = computed(() => {
  if (!props.result) return 'border-secondary'
  const grade = props.result.grade
  if (grade === '史诗') return 'app-border-purple'
  if (grade === '神器') return 'app-border-orange'
  if (grade === '稀有') return 'border-primary'
  return 'border-secondary'
})

const crownCount = computed(() => {
  if (!props.result) return 0
  return props.result.entries.filter(e => e.isCrown).length
})

const normalCount = computed(() => {
  if (!props.result) return 0
  return props.result.entries.filter(e => !e.isCrown).length
})
</script>
