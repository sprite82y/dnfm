<template>
  <div class="card shadow-sm">
    <div class="card-header bg-light d-flex align-items-center justify-content-between">
      <h4 class="card-title mb-0">📊 合成统计</h4>
      <button
        v-if="stats.total > 0"
        type="button"
        class="btn btn-sm btn-outline-secondary"
        @click="emit('reset')"
      >
        重置
      </button>
    </div>
    <div class="card-body">
      <div class="text-center mb-4">
        <div class="fs-3 fw-bold text-primary">{{ stats.total }}</div>
        <div class="text-muted">总合成次数</div>
      </div>

      <div class="d-flex flex-column gap-3">
        <div v-for="crown in crownLevels" :key="crown" class="d-flex align-items-center gap-3">
          <div class="flex-shrink-0" style="width: 70px;">
            <span class="fs-4">{{ crown === 0 ? '○' : '👑'.repeat(crown) }}</span>
          </div>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between mb-1">
              <span class="text-muted">{{ crown }}皇冠</span>
              <span class="text-secondary">{{ stats[crown] }}次 ({{ getPercentage(crown) }}%)</span>
            </div>
            <div class="progress" style="height: 8px;">
              <div
                class="progress-bar"
                :class="getBarClass(crown)"
                :style="{ width: getPercentage(crown) + '%' }"
                role="progressbar"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="stats.total > 0" class="mt-4 pt-4 border-top border-secondary-subtle">
        <div class="text-center text-muted">
          平均皇冠数: <span class="fw-bold">{{ getAverage().toFixed(2) }}</span>
        </div>
      </div>

      <div v-else class="text-center py-4">
        <div class="fs-3 mb-2">📈</div>
        <p class="text-muted">开始合成后将显示统计数据</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MAX_ENTRY_COUNT } from '../constants/stoneData'

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({ total: 0 })
  }
})

const emit = defineEmits(['reset'])

// 皇冠档位由常量派生：最高词条数的品级决定上限，新增品级时自动适配
const crownLevels = Array.from({ length: MAX_ENTRY_COUNT + 1 }, (_, index) => index)

const getPercentage = (crown) => {
  if (props.stats.total === 0) return 0
  return (((props.stats[crown] || 0) / props.stats.total) * 100).toFixed(1)
}

const getAverage = () => {
  if (props.stats.total === 0) return 0
  let sum = 0
  for (const crown of crownLevels) {
    sum += crown * (props.stats[crown] || 0)
  }
  return sum / props.stats.total
}

const getBarClass = (crown) => {
  const classes = {
    0: 'bg-secondary',
    1: 'bg-primary',
    2: 'bg-success',
    3: 'bg-warning',
    4: 'app-bg-purple'
  }
  return classes[crown] || 'bg-secondary'
}
</script>
