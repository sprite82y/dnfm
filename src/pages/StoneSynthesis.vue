<template>
  <div class="min-vh-100 bg-gradient">
    <header class="glass-card border-bottom border-secondary-subtle shadow-sm">
      <div class="container px-4 py-4">
        <div class="d-flex align-items-center justify-content-between">
          <router-link to="/" class="d-flex align-items-center gap-2 text-muted hover-text-dark text-decoration-none">
            <span>← 返回</span>
          </router-link>
          <div class="d-flex align-items-center gap-3">
            <span class="fs-3">💎</span>
            <h1 class="fs-2 fw-bold text-dark">源石合成模拟器</h1>
            <span class="fs-3">💎</span>
          </div>
          <div style="width: 4rem;"></div>
        </div>
        <p class="text-center text-muted mt-1">模拟源石合成，预测合成结果</p>
      </div>
    </header>

    <main class="container px-4 py-5">
      <div class="row g-4">
        <div class="col-lg-4">
          <StoneConfigPanel title="源石A" v-model="stoneA" />
        </div>

        <div class="col-lg-4 d-flex flex-column justify-content-center">
          <div class="text-center">
            <div class="fs-4 mb-4">⚡</div>
            <button
              @click="handleSynthesize"
              :disabled="!canSynthesize || isBatchRunning"
              class="btn btn-lg px-5 py-3 rounded-3 fw-bold transition-all"
              :class="canSynthesize && !isBatchRunning ? 'bg-warning text-dark hover-bg-warning shadow-lg' : 'bg-secondary text-muted cursor-not-allowed'"
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
                <option :value="10">批量合成 10 次</option>
                <option :value="50">批量合成 50 次</option>
                <option :value="100">批量合成 100 次</option>
                <option :value="500">批量合成 500 次</option>
                <option :value="1000">批量合成 1000 次</option>
              </select>
              <button
                @click="handleBatchSynthesize"
                :disabled="!canSynthesize || isBatchRunning"
                class="btn btn-lg px-5 py-3 rounded-3 fw-bold transition-all"
                :class="canSynthesize && !isBatchRunning ? 'bg-warning text-dark hover-bg-warning shadow-lg' : 'bg-secondary text-muted cursor-not-allowed'"
              >
                {{ isBatchRunning ? `${batchProgress}/${batchCount}` : '开始批量合成' }}
              </button>
            </div>

            <p class="text-muted mt-4 small">
              合成规则：源石A为主源石，源石B为待合成源石
            </p>
          </div>
        </div>

        <div class="col-lg-4">
          <StoneConfigPanel title="源石B" v-model="stoneB" />
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-lg-8">
          <div v-if="isAnimating" class="text-center py-5">
            <div class="spinner-border text-warning" style="width: 4rem; height: 4rem;" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted mt-4">正在计算合成结果...</p>
          </div>
          <SynthesisResult v-else :result="synthesisResult" />
        </div>
        <div class="col-lg-4">
          <SynthesisStats :stats="stats" />
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-lg-12">
          <div class="card glass-card border border-secondary-subtle shadow-sm">
            <div class="card-header bg-light text-dark">
              <h4 class="card-title mb-0">合成概率规则</h4>
            </div>
            <div class="card-body text-secondary">
              <div class="row">
                <div class="col-md-6">
                  <h5 class="text-warning mb-2">同品级合成</h5>
                  <p>两个源石品级相同时，所有词条概率均等</p>
                </div>
                <div class="col-md-6">
                  <h5 class="text-warning mb-2">不同品级合成</h5>
                  <ul class="list-unstyled small">
                    <li>史诗+神器：史诗词条 20.22%，神器词条 6.37%</li>
                    <li>史诗+稀有：史诗词条 22.89%，稀有词条 4.21%</li>
                    <li>神器+稀有：神器词条 23.57%，稀有词条 14.64%</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="glass-card border-top border-secondary-subtle mt-auto">
      <div class="container px-4 py-4">
        <p class="text-center text-muted small">工具集 © 2026</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import StoneConfigPanel from '../components/StoneConfigPanel.vue'
import SynthesisResult from '../components/SynthesisResult.vue'
import SynthesisStats from '../components/SynthesisStats.vue'
import { synthesize } from '../utils/synthesis'

const stoneA = ref({ grade: '', crownCount: 0 })
const stoneB = ref({ grade: '', crownCount: 0 })
const synthesisResult = ref(null)
const isAnimating = ref(false)

const batchCount = ref(10)
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
  
  const batchSize = 50
  
  const runBatch = () => {
    if (batchProgress.value >= batchCount.value) {
      isBatchRunning.value = false
      return
    }
    
    const start = batchProgress.value
    const end = Math.min(start + batchSize, batchCount.value)
    
    for (let i = start; i < end; i++) {
      const result = synthesize(stoneA.value, stoneB.value)
      const crownCount = result.entries.filter(e => e.isCrown).length
      stats.value.total++
      stats.value[crownCount]++
    }
    
    batchProgress.value = end
    
    requestAnimationFrame(runBatch)
  }
  
  runBatch()
}
</script>

<style scoped>
.hover-bg-warning:hover {
  background-color: #f59e0b;
}
</style>
