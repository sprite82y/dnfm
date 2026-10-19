<template>
  <PageLayout title="超武盒子模拟器" icon="📦" subtitle="模拟开启超武盒子，预测获得物品">
      <div class="card shadow-lg border-2 app-border-orange mb-4">
        <div class="card-header app-bg-orange text-white text-center py-4">
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
                <option v-for="count in boxCountOptions" :key="count" :value="count">
                  开启 {{ count }} 个盒子
                </option>
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
          <div class="card shadow-lg border-2 app-border-purple h-100">
            <div class="card-header app-bg-purple text-white text-center py-3">
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
            <div v-for="group in itemGroups" :key="group.title" class="col-md-6">
              <h5 class="mb-2" :class="group.headingClass">{{ group.title }}</h5>
              <ul class="list-unstyled small">
                <li v-for="item in group.items" :key="`${item.name}-${item.amount}`">
                  {{ item.name }}*{{ item.amount }}：{{ item.display }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  </PageLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import PageLayout from '../components/PageLayout.vue'
import { BOX_ITEMS, BOX_ITEM_GROUPS, BOX_COUNT_OPTIONS } from '../constants/boxData'

const boxCount = ref(BOX_COUNT_OPTIONS[0])
const boxCountOptions = BOX_COUNT_OPTIONS
const isOpening = ref(false)
const progress = ref(0)
const currentResults = reactive({
  太古龙晶: 0,
  龙之雷焰: 0,
  矛盾的结晶体: 0,
  深渊调律之痕: 0
})
const totalBoxes = ref(0)

const hasCurrentResult = computed(() => {
  return currentResults.太古龙晶 > 0 || 
         currentResults.龙之雷焰 > 0 || 
         currentResults.矛盾的结晶体 > 0 || 
         currentResults.深渊调律之痕 > 0
})

const stats = reactive({
  太古龙晶: 0,
  龙之雷焰: 0,
  矛盾的结晶体: 0,
  深渊调律之痕: 0
})

const ITEMS = BOX_ITEMS

// 概率说明表格的分组：除了显式分组的物品，其余归入"其他物品"
const computeItemGroups = () => {
  const named = BOX_ITEM_GROUPS.filter(group => group.itemName).map(group => group.itemName)
  return BOX_ITEM_GROUPS.map(group => ({
    title: group.title,
    headingClass: group.headingClass,
    items: group.itemName === null
      ? BOX_ITEMS.filter(item => !named.includes(item.name))
      : BOX_ITEMS.filter(item => item.name === group.itemName)
  }))
}

const itemGroups = computeItemGroups()

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
