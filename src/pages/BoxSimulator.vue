<template>
  <div class="min-vh-100 bg-gradient">
    <header class="glass-card border-bottom border-secondary-subtle shadow-sm">
      <div class="container px-4 py-4">
        <div class="d-flex align-items-center justify-content-between">
          <router-link to="/" class="d-flex align-items-center gap-2 text-muted hover-text-dark text-decoration-none">
            <span>← 返回</span>
          </router-link>
          <div class="d-flex align-items-center gap-3">
            <span class="fs-3">📦</span>
            <h1 class="fs-2 fw-bold text-dark">超武盒子模拟器</h1>
            <span class="fs-3">📦</span>
          </div>
          <div style="width: 4rem;"></div>
        </div>
        <p class="text-center text-muted mt-1">模拟开启超武盒子，预测获得物品</p>
      </div>
    </header>

    <main class="container px-4 py-5">
      <div class="card shadow-lg border-2 border-orange mb-4">
        <div class="card-header bg-orange text-white text-center py-4">
          <h2 class="card-title fs-5 fw-bold">开启盒子</h2>
        </div>
        <div class="card-body">
          <div class="row justify-content-center align-items-center">
            <div class="col-md-6">
              <label class="form-label text-secondary fw-bold mb-2">选择盒子数量</label>
              <select
                v-model="boxCount"
                class="form-select form-select-lg"
                :disabled="isOpening"
              >
                <option :value="100">开启 100 个盒子</option>
                <option :value="200">开启 200 个盒子</option>
                <option :value="500">开启 500 个盒子</option>
                <option :value="1000">开启 1000 个盒子</option>
                <option :value="10000">开启 10000 个盒子</option>
              </select>
            </div>
            <div class="col-md-6">
              <button
                @click="openBoxes"
                :disabled="isOpening"
                class="btn btn-lg w-100 rounded-3 fw-bold transition-all"
                :class="isOpening ? 'bg-secondary text-muted cursor-not-allowed' : 'bg-warning text-dark hover-bg-warning shadow-lg'"
              >
                {{ isOpening ? `${progress}/${boxCount}` : '开始开启' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-lg-6">
          <div class="card shadow-lg border-2 border-purple h-100">
            <div class="card-header bg-purple text-white text-center py-3">
              <h3 class="card-title fs-6 fw-bold">本次开启结果</h3>
            </div>
            <div class="card-body">
              <div v-if="!hasCurrentResult" class="text-center text-muted py-4">
                点击"开始开启"按钮查看结果
              </div>
              <div v-else class="row">
                <div class="col-md-6 mb-2">
                  <div class="bg-warning-subtle rounded-3 p-2">
                    <h5 class="text-warning-emphasis fw-bold small mb-1">太古龙晶</h5>
                    <p class="fs-4 fw-bold text-warning-emphasis">{{ currentResults.太古龙晶 }}</p>
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="bg-success-subtle rounded-3 p-2">
                    <h5 class="text-success-emphasis fw-bold small mb-1">龙之雷焰</h5>
                    <p class="fs-4 fw-bold text-success-emphasis">{{ currentResults.龙之雷焰 }}</p>
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="bg-info-subtle rounded-3 p-2">
                    <h5 class="text-info-emphasis fw-bold small mb-1">矛盾的结晶体</h5>
                    <p class="fs-4 fw-bold text-info-emphasis">{{ currentResults.矛盾的结晶体 }}</p>
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="bg-secondary-subtle rounded-3 p-2">
                    <h5 class="text-secondary-emphasis fw-bold small mb-1">深渊-调律之痕</h5>
                    <p class="fs-4 fw-bold text-secondary-emphasis">{{ currentResults.深渊调律之痕 }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-6">
          <div class="card shadow-lg border-2 border-primary h-100">
            <div class="card-header bg-primary text-white text-center py-3">
              <h3 class="card-title fs-6 fw-bold">📊 累计统计</h3>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <span class="fw-bold text-dark small">累计开启盒子：</span>
                <span class="text-primary fw-bold fs-5">{{ totalBoxes }}</span>
                <span class="text-dark small"> 个</span>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-2">
                  <div class="bg-warning-subtle rounded-3 p-2">
                    <h5 class="text-warning-emphasis fw-bold small mb-1">太古龙晶</h5>
                    <p class="fs-4 fw-bold text-warning-emphasis">{{ stats.太古龙晶 }}</p>
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="bg-success-subtle rounded-3 p-2">
                    <h5 class="text-success-emphasis fw-bold small mb-1">龙之雷焰</h5>
                    <p class="fs-4 fw-bold text-success-emphasis">{{ stats.龙之雷焰 }}</p>
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="bg-info-subtle rounded-3 p-2">
                    <h5 class="text-info-emphasis fw-bold small mb-1">矛盾的结晶体</h5>
                    <p class="fs-4 fw-bold text-info-emphasis">{{ stats.矛盾的结晶体 }}</p>
                  </div>
                </div>
                <div class="col-md-6 mb-2">
                  <div class="bg-secondary-subtle rounded-3 p-2">
                    <h5 class="text-secondary-emphasis fw-bold small mb-1">深渊-调律之痕</h5>
                    <p class="fs-4 fw-bold text-secondary-emphasis">{{ stats.深渊调律之痕 }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-lg border-2 border-secondary">
        <div class="card-header bg-secondary text-white text-center py-4">
          <h3 class="card-title fs-5 fw-bold">物品概率说明</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <h5 class="text-warning mb-2">太古龙晶</h5>
              <ul class="list-unstyled small">
                <li>太古龙晶*10：0.0010%</li>
                <li>太古龙晶*8：0.0018%</li>
                <li>太古龙晶*6：0.0032%</li>
                <li>太古龙晶*4：0.0053%</li>
                <li>太古龙晶*2：0.0101%</li>
              </ul>
            </div>
            <div class="col-md-6">
              <h5 class="text-success mb-2">龙之雷焰</h5>
              <ul class="list-unstyled small">
                <li>龙之雷焰*10：0.15%</li>
                <li>龙之雷焰*8：0.65%</li>
                <li>龙之雷焰*6：1.8%</li>
                <li>龙之雷焰*4：3.5%</li>
                <li>龙之雷焰*2：9.25%</li>
              </ul>
            </div>
            <div class="col-md-6">
              <h5 class="text-info mb-2">其他物品</h5>
              <ul class="list-unstyled small">
                <li>矛盾的结晶体*1：10%</li>
                <li>深渊-调律之痕*5：74.6286%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const boxCount = ref(100)
const isOpening = ref(false)
const progress = ref(0)
const currentResults = reactive({
  太古龙晶: 0,
  龙之雷焰: 0,
  矛盾的结晶体: 0,
  深渊调律之痕: 0
})
const totalBoxes = ref(0)

const hasCurrentResult = () => {
  return currentResults.太古龙晶 > 0 || 
         currentResults.龙之雷焰 > 0 || 
         currentResults.矛盾的结晶体 > 0 || 
         currentResults.深渊调律之痕 > 0
}

const stats = reactive({
  太古龙晶: 0,
  龙之雷焰: 0,
  矛盾的结晶体: 0,
  深渊调律之痕: 0
})

const ITEMS = [
  { name: '太古龙晶', amount: 10, probability: 0.0010 },
  { name: '太古龙晶', amount: 8, probability: 0.0018 },
  { name: '太古龙晶', amount: 6, probability: 0.0032 },
  { name: '太古龙晶', amount: 4, probability: 0.0053 },
  { name: '太古龙晶', amount: 2, probability: 0.0101 },
  { name: '龙之雷焰', amount: 10, probability: 0.15 },
  { name: '龙之雷焰', amount: 8, probability: 0.65 },
  { name: '龙之雷焰', amount: 6, probability: 1.8 },
  { name: '龙之雷焰', amount: 4, probability: 3.5 },
  { name: '龙之雷焰', amount: 2, probability: 9.25 },
  { name: '矛盾的结晶体', amount: 1, probability: 10 },
  { name: '深渊-调律之痕', amount: 5, probability: 74.6286 }
]

const openBox = () => {
  const random = Math.random() * 100
  let cumulative = 0
  
  for (const item of ITEMS) {
    cumulative += item.probability
    if (random <= cumulative) {
      return { ...item, displayName: `${item.name}*${item.amount}` }
    }
  }
  
  return ITEMS[ITEMS.length - 1]
}

const openBoxes = async () => {
  isOpening.value = true
  progress.value = 0
  
  currentResults.太古龙晶 = 0
  currentResults.龙之雷焰 = 0
  currentResults.矛盾的结晶体 = 0
  currentResults.深渊调律之痕 = 0
  
  const batchSize = 50
  const totalBatches = Math.ceil(boxCount.value / batchSize)
  
  for (let batch = 0; batch < totalBatches; batch++) {
    const start = batch * batchSize
    const end = Math.min(start + batchSize, boxCount.value)
    
    for (let i = start; i < end; i++) {
      const result = openBox()
      
      if (result.name === '太古龙晶') {
        currentResults.太古龙晶 += result.amount
        stats.太古龙晶 += result.amount
      } else if (result.name === '龙之雷焰') {
        currentResults.龙之雷焰 += result.amount
        stats.龙之雷焰 += result.amount
      } else if (result.name === '矛盾的结晶体') {
        currentResults.矛盾的结晶体 += result.amount
        stats.矛盾的结晶体 += result.amount
      } else if (result.name === '深渊-调律之痕') {
        currentResults.深渊调律之痕 += result.amount
        stats.深渊调律之痕 += result.amount
      }
    }
    
    progress.value = end
    await new Promise(resolve => requestAnimationFrame(resolve))
  }
  
  totalBoxes.value += boxCount.value
  isOpening.value = false
}
</script>

<style scoped>
.fs-xl {
  font-size: 1.5rem;
}

.hover-bg-warning:hover {
  background-color: #f59e0b;
}
</style>
