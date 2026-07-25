<template>
  <div class="card shadow-lg border-2" :class="gradeBorderClass">
    <div class="card-header text-center py-4" :class="[gradeBgClass, result ? 'text-white' : 'text-gray-700']">
      <h3 class="card-title mb-1">合成结果</h3>
      <p class="card-subtitle">{{ result?.grade || '未合成' }}源石</p>
    </div>
    <div class="card-body">
      <div v-if="result" class="text-center mb-4">
        <div class="text-6xl mb-3">💎</div>
        <div class="d-flex justify-content-center gap-4 text-sm">
          <span class="badge bg-info">
            皇冠词条: {{ crownCount }}
          </span>
          <span class="badge bg-secondary">
            普通词条: {{ normalCount }}
          </span>
        </div>
      </div>

      <div v-if="result" class="mt-4">
        <label class="form-label">合成后词条</label>
        <ul class="list-group">
          <li
            v-for="(entry, index) in result.entries"
            :key="index"
            class="list-group-item d-flex align-items-center justify-content-between mb-2"
            :class="entry.isCrown ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 border-2' : 'bg-white'"
          >
            <span class="d-flex align-items-center gap-3">
              <span v-if="entry.isCrown" class="text-3xl">👑</span>
              <span class="font-medium">{{ entry.isCrown ? '皇冠' : '普通' }}</span>
              <span class="text-xs text-muted">来源: {{ entry.source === 'A' ? '源石A' : '源石B' }}</span>
            </span>
            <span class="badge" :class="entry.isCrown ? 'bg-yellow-500 text-white' : 'bg-gray-400 text-white'">
              {{ index + 1 }}
            </span>
          </li>
        </ul>
      </div>

      <div v-else class="text-center py-8">
        <div class="text-4xl mb-3">🔮</div>
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
  if (!props.result) return 'bg-gray-200'
  const grade = props.result.grade
  if (grade === '史诗') return 'bg-purple-600'
  if (grade === '神器') return 'bg-orange-500'
  if (grade === '稀有') return 'bg-blue-500'
  return 'bg-gray-500'
})

const gradeBorderClass = computed(() => {
  if (!props.result) return 'border-gray-300'
  const grade = props.result.grade
  if (grade === '史诗') return 'border-purple-500'
  if (grade === '神器') return 'border-orange-400'
  if (grade === '稀有') return 'border-blue-400'
  return 'border-gray-300'
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

<style scoped>
.bg-gradient-to-r {
  background: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-yellow-50 {
  --tw-gradient-from: #fefce8;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(254, 252, 232, 0));
}

.to-amber-50 {
  --tw-gradient-to: #fffbeb;
}

.border-yellow-300 {
  border-color: #fcd34d;
}

.bg-purple-600 {
  background-color: #7c3aed;
}

.bg-orange-500 {
  background-color: #f97316;
}

.bg-blue-500 {
  background-color: #3b82f6;
}

.border-purple-500 {
  border-color: #a855f7;
}

.border-orange-400 {
  border-color: #fb923c;
}

.border-blue-400 {
  border-color: #60a5fa;
}

.bg-yellow-500 {
  background-color: #eab308;
}
</style>
