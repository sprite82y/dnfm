<template>
  <div class="card bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
    <div class="card-header bg-gray-50 text-gray-800">
      <h4 class="card-title mb-0">📊 合成统计</h4>
    </div>
    <div class="card-body">
      <div class="text-center mb-4">
        <div class="text-3xl font-bold text-primary">{{ stats.total }}</div>
        <div class="text-gray-500 text-sm">总合成次数</div>
      </div>

      <div class="space-y-3">
        <div v-for="crown in [0, 1, 2, 3, 4]" :key="crown" class="flex items-center gap-3">
          <div class="flex-shrink-0">
            <span class="text-xl">{{ crown === 0 ? '○' : '👑'.repeat(crown) }}</span>
          </div>
          <div class="flex-grow">
            <div class="d-flex justify-between mb-1">
              <span class="text-sm font-medium text-gray-700">{{ crown }}皇冠</span>
              <span class="text-sm text-gray-600">{{ stats[crown] }}次 ({{ getPercentage(crown) }}%)</span>
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

      <div v-if="stats.total > 0" class="mt-4 pt-4 border-t border-gray-200">
        <div class="text-center text-sm text-gray-500">
          平均皇冠数: <span class="font-bold text-gray-700">{{ getAverage().toFixed(2) }}</span>
        </div>
      </div>

      <div v-else class="text-center py-4">
        <div class="text-3xl mb-2">📈</div>
        <p class="text-gray-500 text-sm">开始合成后将显示统计数据</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stats: {
    type: Object,
    default: () => ({
      total: 0,
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0
    })
  }
})

const getPercentage = (crown) => {
  if (props.stats.total === 0) return 0
  return ((props.stats[crown] / props.stats.total) * 100).toFixed(1)
}

const getAverage = () => {
  if (props.stats.total === 0) return 0
  let sum = 0
  for (let i = 0; i <= 4; i++) {
    sum += i * props.stats[i]
  }
  return sum / props.stats.total
}

const getBarClass = (crown) => {
  const classes = {
    0: 'bg-gray-400',
    1: 'bg-blue-400',
    2: 'bg-green-400',
    3: 'bg-yellow-400',
    4: 'bg-purple-500'
  }
  return classes[crown] || 'bg-gray-400'
}
</script>
