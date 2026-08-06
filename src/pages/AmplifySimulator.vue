<template>
  <div class="min-vh-100 bg-gradient">
    <header class="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div class="container px-4 py-4">
        <div class="d-flex align-items-center justify-between">
          <router-link to="/" class="d-flex align-items-center gap-2 text-muted hover:text-dark text-decoration-none">
            <span>← 返回</span>
          </router-link>
          <div class="d-flex align-items-center gap-3">
            <span class="fs-3">🔧</span>
            <h1 class="fs-2 fw-bold text-dark">增幅模拟器</h1>
            <span class="fs-3">🔧</span>
          </div>
          <div class="w-16"></div>
        </div>
        <p class="text-center text-muted mt-1">模拟增幅过程，预测消耗和成功率</p>
      </div>
    </header>

    <main class="container px-4 py-8">
      <div class="card shadow-lg border-2 border-danger mb-6">
        <div class="card-header bg-danger text-white text-center py-3">
          <h2 class="card-title text-lg fw-bold">获取胚子</h2>
        </div>
        <div class="card-body">
          <div class="d-flex flex-wrap justify-content-center gap-3">
            <button
              class="btn btn-lg rounded-lg fw-bold transition-all duration-200 bg-warning text-dark hover-bg-warning shadow-lg"
              data-bs-toggle="modal"
              data-bs-target="#getEmblemModal"
            >
              📦 批量获取胚子
            </button>
            <button
              @click="quickAddEmbryon('武器')"
              class="btn btn-lg rounded-lg fw-bold transition-all duration-200 bg-warning text-dark hover-bg-warning shadow-lg"
            >
              ⚔️ 武器+1
            </button>
            <button
              @click="quickAddEmbryon('非武器')"
              class="btn btn-lg rounded-lg fw-bold transition-all duration-200 bg-info text-white shadow-lg"
            >
              🛡️ 非武器+1
            </button>
          </div>
        </div>
      </div>

      <div class="card shadow-lg border-2 border-primary mb-6">
        <div class="card-header bg-primary text-white text-center py-3">
          <h3 class="card-title text-lg fw-bold">胚子列表</h3>
        </div>
        <div class="card-body">
          <div v-if="embryons.length === 0" class="text-center text-muted py-8">
            请先点击"获取胚子"按钮获取胚子
          </div>
          <div v-else class="overflow-x-auto">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>类型</th>
                  <th>等级</th>
                  <th>矛盾消耗</th>
                  <th>幸运符消耗</th>
                  <th>失败次数</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(embryon, index) in embryons" :key="embryon.id" :class="embryon.broken ? 'table-danger' : ''">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <span class="badge" :class="embryon.type === '武器' ? 'bg-warning text-dark' : 'bg-info text-white'">
                      {{ embryon.type }}
                    </span>
                  </td>
                  <td class="fw-bold" :class="getLevelColor(embryon.level)">{{ embryon.broken ? '已损坏' : `+${embryon.level}` }}</td>
                  <td class="text-secondary fw-bold">{{ embryon.contradictionCost }}</td>
                  <td class="text-primary fw-bold">{{ embryon.luckyCharmCost }}</td>
                  <td class="text-danger fw-bold">{{ embryon.failCount }}</td>
                  <td>
                    <span v-if="embryon.broken" class="badge bg-danger text-white">已损坏</span>
                    <span v-else class="badge bg-success text-white">正常</span>
                  </td>
                  <td>
                    <button
                      v-if="!embryon.broken"
                      @click="selectEmbryon(embryon)"
                      class="btn btn-sm btn-success"
                    >
                      选择
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="selectedEmbryon" class="card shadow-lg border-2 border-warning mb-6">
        <div class="card-header bg-warning text-dark text-center py-3">
          <h3 class="card-title text-lg fw-bold">
            增幅操作 - {{ selectedEmbryon.type }} +{{ selectedEmbryon.level }}
          </h3>
        </div>
        <div class="card-body">
          <div class="row align-items-center mb-4">
            <div class="col-md-6">
              <div class="alert alert-info mb-0">
                <div class="mb-2">
                  <span class="fw-bold">目标等级：</span>
                  <span class="text-warning fw-bold fs-xl">+{{ nextLevel }}</span>
                </div>
                <div class="mb-2">
                  <span class="fw-bold">成功概率：</span>
                  <span class="text-success fw-bold">{{ currentSuccessRate }}%</span>
                </div>
                <div class="mb-2">
                  <span class="fw-bold">矛盾消耗：</span>
                  <span class="text-secondary fw-bold">{{ currentContradictionCost }}</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <span class="fw-bold">幸运符消耗：</span>
                  <span class="text-primary fw-bold">{{ currentLuckyCharmCost }}</span>
                  <div v-if="currentSuccessRate < 100" class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="useLuckyCharm"
                      id="useLuckyCharm"
                    />
                    <label class="form-check-label" for="useLuckyCharm">
                      使用（+5%成功率）
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex flex-column gap-2">
                <div class="d-flex align-items-center gap-2">
                  <button
                    @click="doAmplify"
                    :disabled="selectedEmbryon.broken"
                    class="btn btn-lg rounded-lg fw-bold transition-all duration-200 flex-grow-1 shadow-lg"
                    :class="selectedEmbryon.broken ? 'bg-secondary text-muted cursor-not-allowed' : 'bg-warning text-dark hover-bg-warning'"
                  >
                    ⚡ 增幅
                  </button>
                  <span v-if="selectedEmbryon.broken" class="text-danger fw-bold">胚子已损坏</span>
                </div>
                <div>
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <button
                      @click="doAutoAmplify10"
                      :disabled="selectedEmbryon.broken"
                      class="btn btn-lg rounded-lg fw-bold transition-all duration-200 shadow-lg w-100"
                      :class="selectedEmbryon.broken ? 'bg-secondary text-muted cursor-not-allowed' : 'bg-success text-white'"
                    >
                      🔥 一键增幅到+10
                    </button>
                  </div>
                  <div v-if="auto10Result" class="alert alert-success text-center py-2 mb-0">
                    <small>
                      消耗矛盾：<span class="fw-bold">{{ auto10Result.contradiction }}</span>，
                      幸运符：<span class="fw-bold">{{ auto10Result.luckyCharm }}</span>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-lg border-2 border-secondary mb-6">
        <div class="card-header bg-secondary text-white text-center py-3">
          <h3 class="card-title text-lg fw-bold">📊 汇总统计</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-3 mb-3">
              <div class="bg-secondary/10 rounded-lg p-3">
                <h5 class="text-secondary fw-bold mb-2">矛盾总消耗</h5>
                <p class="fs-2 fw-bold text-secondary">{{ totalContradiction }}</p>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="bg-primary/10 rounded-lg p-3">
                <h5 class="text-primary fw-bold mb-2">幸运符总消耗</h5>
                <p class="fs-2 fw-bold text-primary">{{ totalLuckyCharm }}</p>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="bg-danger/10 rounded-lg p-3">
                <h5 class="text-danger fw-bold mb-2">损坏胚子数</h5>
                <p class="fs-2 fw-bold text-danger">{{ brokenCount }}</p>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="bg-success/10 rounded-lg p-3">
                <h5 class="text-success fw-bold mb-2">平均成功率</h5>
                <p class="fs-2 fw-bold text-success">{{ avgSuccessRate }}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-lg border-2 border-secondary">
        <div class="card-header bg-secondary text-white text-center py-3">
          <h3 class="card-title text-lg fw-bold">增幅概率说明</h3>
        </div>
        <div class="card-body">
          <div class="overflow-x-auto">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>目标等级</th>
                  <th>概率</th>
                  <th>武器矛盾消耗</th>
                  <th>非武器矛盾消耗</th>
                  <th>幸运符数量</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(rule, idx) in AMPLIFY_RULES" :key="idx">
                  <td class="fw-bold" :class="getLevelColor(rule.level)">+{{ rule.level }}</td>
                  <td class="fw-bold" :class="rule.rate < 50 ? 'text-danger' : rule.rate < 80 ? 'text-warning' : 'text-success'">
                    {{ rule.rate }}%
                  </td>
                  <td class="text-secondary fw-bold">{{ rule.weaponContradiction }}</td>
                  <td class="text-secondary fw-bold">{{ rule.nonWeaponContradiction }}</td>
                  <td class="text-primary fw-bold">{{ rule.luckyCharm || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4 text-muted text-sm">
            <p class="mb-1">📌 失败规则：</p>
            <p class="mb-1">• 目标等级 5~7：失败等级 -1</p>
            <p class="mb-1">• 目标等级 8~10：失败等级 -3</p>
            <p>• 目标等级 11+：失败胚子直接损坏</p>
          </div>
        </div>
      </div>
    </main>

    <!-- 弹框 -->
    <div class="modal fade" id="getEmblemModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-light">
            <h5 class="modal-title fw-bold">获取胚子</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-bold">武器胚子数量</label>
              <input
                type="number"
                v-model="weaponCount"
                min="1"
                class="form-control"
                placeholder="请输入武器胚子数量"
              />
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">非武器胚子数量</label>
              <input
                type="number"
                v-model="nonWeaponCount"
                min="1"
                class="form-control"
                placeholder="请输入非武器胚子数量"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button
              type="button"
              class="btn btn-warning text-dark fw-bold"
              data-bs-dismiss="modal"
              @click="confirmGetEmbryons"
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const AMPLIFY_RULES = [
  { level: 1, rate: 100, weaponContradiction: 35, nonWeaponContradiction: 26, luckyCharm: 0 },
  { level: 2, rate: 100, weaponContradiction: 53, nonWeaponContradiction: 39, luckyCharm: 0 },
  { level: 3, rate: 100, weaponContradiction: 73, nonWeaponContradiction: 54, luckyCharm: 0 },
  { level: 4, rate: 100, weaponContradiction: 97, nonWeaponContradiction: 72, luckyCharm: 0 },
  { level: 5, rate: 80, weaponContradiction: 126, nonWeaponContradiction: 94, luckyCharm: 1 },
  { level: 6, rate: 70, weaponContradiction: 164, nonWeaponContradiction: 123, luckyCharm: 1 },
  { level: 7, rate: 60, weaponContradiction: 203, nonWeaponContradiction: 152, luckyCharm: 1 },
  { level: 8, rate: 70, weaponContradiction: 280, nonWeaponContradiction: 210, luckyCharm: 1 },
  { level: 9, rate: 60, weaponContradiction: 357, nonWeaponContradiction: 267, luckyCharm: 1 },
  { level: 10, rate: 50, weaponContradiction: 472, nonWeaponContradiction: 354, luckyCharm: 1 },
  { level: 11, rate: 40, weaponContradiction: 587, nonWeaponContradiction: 440, luckyCharm: 2 },
  { level: 12, rate: 30, weaponContradiction: 646, nonWeaponContradiction: 484, luckyCharm: 2 }
]

const MAX_LEVEL = 12

let idSeed = 0

const weaponCount = ref(1)
const nonWeaponCount = ref(1)
const embryons = ref([])
const selectedEmbryon = ref(null)
const useLuckyCharm = ref(true)
const auto10Result = ref(null)

// 历史统计用
const totalAttempts = ref(0)
const totalSuccess = ref(0)

const confirmGetEmbryons = () => {
  for (let i = 0; i < (weaponCount.value || 0); i++) {
    embryons.value.push(createEmbryon('武器'))
  }
  for (let i = 0; i < (nonWeaponCount.value || 0); i++) {
    embryons.value.push(createEmbryon('非武器'))
  }
  weaponCount.value = 1
  nonWeaponCount.value = 1
  auto10Result.value = null
}

const createEmbryon = (type) => {
  return {
    id: ++idSeed,
    type,
    level: 0,
    contradictionCost: 0,
    luckyCharmCost: 0,
    failCount: 0,
    broken: false
  }
}

const getLevelColor = (level) => {
  if (level >= 11) return 'text-warning fw-bold'
  if (level >= 8) return 'text-success fw-bold'
  if (level >= 5) return 'text-primary fw-bold'
  return 'text-dark'
}

const selectEmbryon = (embryon) => {
  selectedEmbryon.value = embryon
  auto10Result.value = null
}

const quickAddEmbryon = (type) => {
  embryons.value.push(createEmbryon(type))
  auto10Result.value = null
}

const getRule = (targetLevel, type) => {
  const rule = AMPLIFY_RULES.find(r => r.level === targetLevel)
  if (!rule) return null
  const contradiction = type === '武器' ? rule.weaponContradiction : rule.nonWeaponContradiction
  return {
    rate: rule.rate,
    contradiction,
    luckyCharm: rule.luckyCharm || 0
  }
}

const nextLevel = computed(() => {
  if (!selectedEmbryon.value) return 0
  return Math.min(selectedEmbryon.value.level + 1, MAX_LEVEL)
})

const currentRule = computed(() => {
  if (!selectedEmbryon.value) return null
  const nL = Math.min(selectedEmbryon.value.level + 1, MAX_LEVEL)
  return getRule(nL, selectedEmbryon.value.type)
})

const currentSuccessRate = computed(() => {
  if (!currentRule.value) return 0
  let rate = currentRule.value.rate
  if (useLuckyCharm.value && rate < 100) rate = Math.min(100, rate + 5)
  return rate
})

const currentContradictionCost = computed(() => currentRule.value?.contradiction ?? 0)
const currentLuckyCharmCost = computed(() => {
  if (!currentRule.value) return 0
  if (currentRule.value.rate >= 100) return 0
  return useLuckyCharm.value ? currentRule.value.luckyCharm : 0
})

const totalContradiction = computed(() => embryons.value.reduce((s, e) => s + e.contradictionCost, 0))
const totalLuckyCharm = computed(() => embryons.value.reduce((s, e) => s + e.luckyCharmCost, 0))
const brokenCount = computed(() => embryons.value.filter(e => e.broken).length)
const avgSuccessRate = computed(() => {
  if (totalAttempts.value === 0) return '0.00'
  return ((totalSuccess.value / totalAttempts.value) * 100).toFixed(2)
})

const doOneAmplify = (embryon, lucky) => {
  if (embryon.broken) return false
  const targetLevel = embryon.level + 1
  if (targetLevel > MAX_LEVEL) return false
  const rule = getRule(targetLevel, embryon.type)
  if (!rule) return false

  let rate = rule.rate
  const charmUsed = (rate < 100 && lucky) ? rule.luckyCharm : 0
  if (charmUsed > 0) rate = Math.min(100, rate + 5)

  embryon.contradictionCost += rule.contradiction
  embryon.luckyCharmCost += charmUsed
  totalAttempts.value++

  const roll = Math.random() * 100
  if (roll <= rate) {
    embryon.level++
    totalSuccess.value++
    return true
  } else {
    embryon.failCount++
    if (targetLevel >= 11) {
      embryon.broken = true
    } else if (targetLevel >= 8) {
      embryon.level = Math.max(0, embryon.level - 3)
    } else if (targetLevel >= 5) {
      embryon.level = Math.max(0, embryon.level - 1)
    }
    return false
  }
}

const doAmplify = () => {
  if (!selectedEmbryon.value || selectedEmbryon.value.broken) return
  const embryon = selectedEmbryon.value
  if (embryon.level >= MAX_LEVEL) return
  doOneAmplify(embryon, useLuckyCharm.value)
  auto10Result.value = null
}

const doAutoAmplify10 = () => {
  if (!selectedEmbryon.value || selectedEmbryon.value.broken) return
  const embryon = selectedEmbryon.value
  if (embryon.level >= 10) return

  const startCost = { c: embryon.contradictionCost, l: embryon.luckyCharmCost }

  while (embryon.level < 10 && !embryon.broken) {
    doOneAmplify(embryon, true)
  }

  auto10Result.value = {
    contradiction: embryon.contradictionCost - startCost.c,
    luckyCharm: embryon.luckyCharmCost - startCost.l
  }
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
