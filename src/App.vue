<template>
  <div class="min-vh-100 bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100">
    <header class="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div class="container px-4 py-4">
        <div class="d-flex align-items-center justify-center gap-3">
          <span class="text-3xl">💎</span>
          <h1 class="text-2xl font-bold text-gray-800">DNF手游源石合成模拟器</h1>
          <span class="text-3xl">💎</span>
        </div>
        <p class="text-center text-gray-500 mt-1">模拟源石合成，预测合成结果</p>
      </div>
    </header>

    <main class="container px-4 py-8">
      <div class="row g-6">
        <div class="col-lg-4">
          <StoneConfigPanel title="源石A" v-model="stoneA" />
        </div>

        <div class="col-lg-4 d-flex flex-column justify-center">
          <div class="text-center">
            <div class="text-4xl mb-4">⚡</div>
            <button
              @click="handleSynthesize"
              :disabled="!canSynthesize || isBatchRunning"
              class="btn btn-lg px-8 py-3 rounded-lg font-bold transition-all duration-200"
              :class="canSynthesize && !isBatchRunning ? 'bg-yellow-200 text-black hover:bg-yellow-300 shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
            >
              {{ isAnimating ? '合成中...' : '开始合成' }}
            </button>

            <div class="mt-4">
              <select
                v-model="batchCount"
                class="form-select form-select-sm mb-2"
                :disabled="!canSynthesize || isBatchRunning"
                style="width: 160px; margin: 0 auto;"
              >
                <option :value="5">批量合成 5 次</option>
                <option :value="10">批量合成 10 次</option>
                <option :value="20">批量合成 20 次</option>
                <option :value="50">批量合成 50 次</option>
                <option :value="100">批量合成 100 次</option>
              </select>
              <button
                @click="handleBatchSynthesize"
                :disabled="!canSynthesize || isBatchRunning"
                class="btn btn-lg px-8 py-3 rounded-lg font-bold transition-all duration-200"
                :class="canSynthesize && !isBatchRunning ? 'bg-yellow-200 text-black hover:bg-yellow-300 shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
              >
                {{ isBatchRunning ? `${batchProgress}/${batchCount}` : '开始批量合成' }}
              </button>
            </div>

            <p class="text-gray-600 mt-4 text-sm">
              合成规则：将A、B两个源石的词条以不放回原则抽取，<br/>抽取数量等于源石A的词条数
            </p>
          </div>
        </div>

        <div class="col-lg-4">
          <StoneConfigPanel title="源石B" v-model="stoneB" />
        </div>
      </div>

      <div class="row mt-8">
        <div class="col-lg-8">
          <div v-if="isAnimating" class="text-center py-8">
            <div class="spinner-border text-yellow-400" style="width: 4rem; height: 4rem;" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-gray-600 mt-4">正在计算合成结果...</p>
          </div>
          <SynthesisResult v-else :result="synthesisResult" />
        </div>
        <div class="col-lg-4">
          <SynthesisStats :stats="stats" />
        </div>
      </div>

      <div class="row mt-8">
        <div class="col-lg-12">
          <div class="card bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
            <div class="card-header bg-gray-50 text-gray-800">
              <h4 class="card-title mb-0">合成概率规则</h4>
            </div>
            <div class="card-body text-gray-700">
              <div class="row">
                <div class="col-md-6">
                  <h5 class="text-yellow-600 mb-2">同品级合成</h5>
                  <p>两个源石品级相同时，所有词条概率均等</p>
                </div>
                <div class="col-md-6">
                  <h5 class="text-yellow-600 mb-2">不同品级合成</h5>
                  <ul class="list-unstyled text-sm">
                    <li>史诗+神器：史诗词条 22.22%，神器词条 6.37%</li>
                    <li>史诗+稀有：史诗词条 22.89%，稀有词条 4.21%</li>
                    <li>神器+稀有：神器词条 23.57%，稀有词条 14.64%</li>
                  </ul>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t border-gray-200">
                <h5 class="text-yellow-600 mb-2">源石品级说明</h5>
                <div class="row">
                  <div class="col-md-4">
                    <span class="badge bg-yellow-400 text-black">史诗</span>
                    <span class="text-gray-600 ml-2">4个词条</span>
                  </div>
                  <div class="col-md-4">
                    <span class="badge bg-pink-400 text-white">神器</span>
                    <span class="text-gray-600 ml-2">3个词条</span>
                  </div>
                  <div class="col-md-4">
                    <span class="badge bg-purple-500 text-white">稀有</span>
                    <span class="text-gray-600 ml-2">2个词条</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="bg-white/80 border-t border-gray-200 mt-auto">
      <div class="container px-4 py-4">
        <p class="text-center text-gray-500 text-sm">DNF手游源石合成模拟器 © 2026</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import StoneConfigPanel from './components/StoneConfigPanel.vue'
import SynthesisResult from './components/SynthesisResult.vue'
import SynthesisStats from './components/SynthesisStats.vue'
import { synthesize } from './utils/synthesis'

const stoneA = ref({ grade: '', crownCount: 0 })
const stoneB = ref({ grade: '', crownCount: 0 })
const synthesisResult = ref(null)
const isAnimating = ref(false)

const batchCount = ref(5)
const isBatchRunning = ref(false)
const batchProgress = ref(0)

const stats = ref({
  total: 0,
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0
})

const canSynthesize = computed(() => {
  return stoneA.value.grade && stoneB.value.grade
})

const resetStats = () => {
  stats.value = {
    total: 0,
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0
  }
}

watch(
  [stoneA, stoneB],
  () => {
    resetStats()
    synthesisResult.value = null
  },
  { deep: true }
)

const handleSynthesize = () => {
  if (!canSynthesize.value) return
  
  isAnimating.value = true
  
  setTimeout(() => {
    const result = synthesize(stoneA.value, stoneB.value)
    synthesisResult.value = result
    
    const crownCount = result.entries.filter(e => e.isCrown).length
    stats.value.total++
    stats.value[crownCount]++
    
    isAnimating.value = false
  }, 100)
}

const handleBatchSynthesize = () => {
  if (!canSynthesize.value || isBatchRunning.value) return
  
  isBatchRunning.value = true
  batchProgress.value = 0
  
  const runBatch = () => {
    if (batchProgress.value >= batchCount.value) {
      isBatchRunning.value = false
      return
    }
    
    const result = synthesize(stoneA.value, stoneB.value)
    const crownCount = result.entries.filter(e => e.isCrown).length
    stats.value.total++
    stats.value[crownCount]++
    
    batchProgress.value++
    
    requestAnimationFrame(runBatch)
  }
  
  runBatch()
}
</script>

<style>
.bg-gradient-to-br {
  background: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.from-gray-50 {
  --tw-gradient-from: #f9fafb;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-via, var(--tw-gradient-from)), var(--tw-gradient-to, rgba(249, 250, 251, 0));
}

.via-purple-50 {
  --tw-gradient-via: #f5f3ff;
}

.to-gray-100 {
  --tw-gradient-to: #f3f4f6;
}

.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

.shadow-yellow-500\/30 {
  box-shadow: 0 0 20px rgba(234, 179, 8, 0.3);
}
</style>
