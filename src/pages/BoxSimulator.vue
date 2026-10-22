<template>
  <PageLayout title="超武盒子模拟器" icon="📦" subtitle="模拟开启超武盒子，预测获得物品">
      <div class="card shadow-lg border-2 app-border-orange mb-4">
        <div class="card-header app-bg-orange text-white text-center py-4">
          <h2 class="card-title fs-5 fw-bold">开启盒子</h2>
        </div>
        <div class="card-body">
          <div class="row justify-content-center align-items-center">
            <div class="col-md-6">
              <label class="form-label text-secondary fw-bold mb-2" for="boxCount">选择盒子数量</label>
              <select
                id="boxCount"
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
                <div v-for="item in BOX_STAT_ITEMS" :key="item.name" class="col-md-6 mb-2">
                  <div class="rounded-3 p-2" :class="item.cardClass">
                    <h5 class="fw-bold small mb-1" :class="item.textClass">{{ item.name }}</h5>
                    <p class="fs-4 fw-bold mb-0" :class="item.textClass">{{ currentResults[item.name] }}</p>
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
              <div class="mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div>
                  <span class="fw-bold text-dark small">累计开启盒子：</span>
                  <span class="text-primary fw-bold fs-5">{{ totalBoxes }}</span>
                  <span class="text-dark small"> 个</span>
                </div>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary"
                  :disabled="isOpening || !hasAnyStats"
                  @click="resetStats"
                >
                  重置累计统计
                </button>
              </div>
              <div class="row">
                <div v-for="item in BOX_STAT_ITEMS" :key="item.name" class="col-md-6 mb-2">
                  <div class="rounded-3 p-2" :class="item.cardClass">
                    <h5 class="fw-bold small mb-1" :class="item.textClass">{{ item.name }}</h5>
                    <p class="fs-4 fw-bold mb-0" :class="item.textClass">{{ stats[item.name] }}</p>
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
import { BOX_ITEMS, BOX_ITEM_GROUPS, BOX_COUNT_OPTIONS, BOX_STAT_ITEMS } from '../constants/boxData'

const boxCount = ref(BOX_COUNT_OPTIONS[0])
const boxCountOptions = BOX_COUNT_OPTIONS
const isOpening = ref(false)
const progress = ref(0)

// 统计对象按 BOX_STAT_ITEMS 动态初始化：
// 新增掉落物只要改 constants/boxData.js，页面不再逐项硬编码物品名
const createEmptyStats = () =>
  Object.fromEntries(BOX_STAT_ITEMS.map(item => [item.name, 0]))

const currentResults = reactive(createEmptyStats())
const stats = reactive(createEmptyStats())
const totalBoxes = ref(0)

const hasCurrentResult = computed(() =>
  BOX_STAT_ITEMS.some(item => currentResults[item.name] > 0)
)

// 累计统计是否已有数据（决定"重置"按钮是否可点）
const hasAnyStats = computed(() =>
  totalBoxes.value > 0 || BOX_STAT_ITEMS.some(item => stats[item.name] > 0)
)

const resetStats = () => {
  if (isOpening.value) return
  totalBoxes.value = 0
  for (const item of BOX_STAT_ITEMS) {
    stats[item.name] = 0
    currentResults[item.name] = 0
  }
  progress.value = 0
}

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
      return item
    }
  }

  // 浮点累加可能略小于 random（概率合计恰好 100），兜底返回最后一项
  return ITEMS[ITEMS.length - 1]
}

const openBoxes = async () => {
  if (isOpening.value) return
  isOpening.value = true
  progress.value = 0
  
  for (const item of BOX_STAT_ITEMS) {
    currentResults[item.name] = 0
  }
  
  const batchSize = 50
  const totalBatches = Math.ceil(boxCount.value / batchSize)
  
  try {
    for (let batch = 0; batch < totalBatches; batch++) {
      const start = batch * batchSize
      const end = Math.min(start + batchSize, boxCount.value)
      
      for (let i = start; i < end; i++) {
        const result = openBox()
        // 按物品名动态累加：BOX_ITEMS 新增物品会自动计入，
        // 不会再出现"开了盒子但统计里没有"的静默丢数据
        currentResults[result.name] = (currentResults[result.name] || 0) + result.amount
        stats[result.name] = (stats[result.name] || 0) + result.amount
      }
      
      progress.value = end
      // 每批结束就结算盒子数，中途异常时统计与累计数仍能对上
      totalBoxes.value += end - start
      await new Promise(resolve => requestAnimationFrame(resolve))
    }
  } finally {
    // 任何异常都要解除锁定，否则按钮永久停在"开启中"
    isOpening.value = false
  }
}
</script>
