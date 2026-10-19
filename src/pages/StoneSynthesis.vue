<template>
  <PageLayout title="源石合成模拟器" icon="💎" subtitle="模拟源石合成，预测合成结果">
      <div class="row g-4">
        <div class="col-lg-4">
          <StoneConfigPanel title="源石A" v-model="stoneA" :disabled="isBatchRunning" />
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
          <StoneConfigPanel title="源石B" v-model="stoneB" :disabled="isBatchRunning" />
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
          <SynthesisStats :stats="stats" @reset="handleResetStats" />
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
                  <p class="small mb-3">两个源石品级相同时，所有剩余词条被抽到的机会均等。</p>

                  <h5 class="text-warning mb-2">抽取方式</h5>
                  <p class="small mb-2">
                    每次从当前剩余词条中抽取一条，<strong>抽走即不放回</strong>，
                    因此前一条抽走后，剩余词条的权重比例会重新计算。
                  </p>
                </div>
                <div class="col-md-6">
                  <h5 class="text-warning mb-2">不同品级合成</h5>
                  <p class="small mb-2">
                    每条词条被抽到的机会与<strong>它的品级权重</strong>成正比。权重如下：
                  </p>
                  <ul class="list-unstyled small mb-3">
                    <li v-for="rule in crossGradeTexts" :key="rule.key">{{ rule.text }}</li>
                  </ul>
                  <p class="small mb-0">
                    权重不是成品概率：某品级最终出现几条，还要看该品级共有多少条词条参与抽取。
                  </p>
                </div>
              </div>
              <div class="border-top border-secondary-subtle mt-3 pt-3 small">
                <p class="mb-1">
                  <strong>结果条数</strong>：等于源石 A 的词条数（史诗 4 条 / 神器 3 条 / 稀有 2 条）。
                </p>
                <p class="mb-0">
                  <strong>最终品级</strong>：与源石 A 相同。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  </PageLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import PageLayout from '../components/PageLayout.vue'
import StoneConfigPanel from '../components/StoneConfigPanel.vue'
import SynthesisResult from '../components/SynthesisResult.vue'
import SynthesisStats from '../components/SynthesisStats.vue'
import { synthesize } from '../utils/synthesis'
import { crossGradeProbabilityTexts } from '../constants/stoneData'

const crossGradeTexts = crossGradeProbabilityTexts()

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

// 手动重置：清空统计与上一次的合成结果，配置保持不变
const handleResetStats = () => {
  if (isBatchRunning.value) return
  resetStats()
  synthesisResult.value = null
  batchProgress.value = 0
}

watch(
  [stoneA, stoneB],
  () => {
    // 批量进行中配置已被锁定，此处若仍被触发只会让统计口径错乱，故直接忽略
    if (isBatchRunning.value) return
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
