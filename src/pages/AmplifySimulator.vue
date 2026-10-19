<template>
  <PageLayout title="增幅模拟器" icon="🔧" subtitle="模拟增幅过程，预测消耗和成功率">
      <div class="card shadow-lg border-2 border-danger mb-4">
        <div class="card-header bg-danger text-white text-center py-3">
          <h2 class="card-title fs-5 fw-bold">获取胚子</h2>
        </div>
        <div class="card-body">
          <div class="d-flex flex-wrap justify-content-center gap-3">
            <button
              class="btn btn-lg rounded-3 fw-bold transition-all bg-warning text-dark hover-bg-warning shadow-lg"
              data-bs-toggle="modal"
              data-bs-target="#getEmblemModal"
            >
              📦 批量获取胚子
            </button>
            <button
              @click="quickAddEmbryon('武器')"
              class="btn btn-lg rounded-3 fw-bold transition-all bg-warning text-dark hover-bg-warning shadow-lg"
            >
              ⚔️ 武器+1
            </button>
            <button
              @click="quickAddEmbryon('非武器')"
              class="btn btn-lg rounded-3 fw-bold transition-all bg-info text-white shadow-lg"
            >
              🛡️ 非武器+1
            </button>
          </div>
        </div>
      </div>

      <div class="card shadow-lg border-2 border-primary mb-4">
        <div class="card-header bg-primary text-white text-center py-3 position-relative">
          <h3 class="card-title fs-5 fw-bold mb-0">胚子列表</h3>
          <button
            v-if="embryons.length > 0"
            type="button"
            class="btn btn-sm btn-light position-absolute top-50 end-0 translate-middle-y me-3"
            @click="resetAll"
          >
            清空并重置统计
          </button>
        </div>
        <div class="card-body">
          <div v-if="embryons.length === 0" class="text-center text-muted py-5">
            请先点击"获取胚子"按钮获取胚子
          </div>
          <div v-else class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">序号</th>
                  <th scope="col">类型</th>
                  <th scope="col">等级</th>
                  <th scope="col">矛盾消耗</th>
                  <th scope="col">幸运符消耗</th>
                  <th scope="col">失败次数</th>
                  <th scope="col">状态</th>
                  <th scope="col">操作</th>
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

      <div v-if="selectedEmbryon" class="card shadow-lg border-2 border-warning mb-4">
        <div class="card-header bg-warning text-dark text-center py-3">
          <h3 class="card-title fs-5 fw-bold">
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
                      使用（+{{ LUCKY_CHARM_BONUS }}%成功率）
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
                    class="btn btn-lg rounded-3 fw-bold transition-all flex-grow-1 shadow-lg"
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
                      class="btn btn-lg rounded-3 fw-bold transition-all shadow-lg w-100"
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

      <div class="card shadow-lg border-2 border-secondary mb-4">
        <div class="card-header bg-secondary text-white text-center py-3">
          <h3 class="card-title fs-5 fw-bold">📊 汇总统计</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-3 mb-3">
              <div class="bg-secondary-subtle rounded-3 p-3">
                <h5 class="text-secondary-emphasis fw-bold mb-2">矛盾总消耗</h5>
                <p class="fs-2 fw-bold text-secondary-emphasis">{{ totalContradiction }}</p>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="bg-primary-subtle rounded-3 p-3">
                <h5 class="text-primary-emphasis fw-bold mb-2">幸运符总消耗</h5>
                <p class="fs-2 fw-bold text-primary-emphasis">{{ totalLuckyCharm }}</p>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="bg-danger-subtle rounded-3 p-3">
                <h5 class="text-danger-emphasis fw-bold mb-2">损坏胚子数</h5>
                <p class="fs-2 fw-bold text-danger-emphasis">{{ brokenCount }}</p>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="bg-success-subtle rounded-3 p-3">
                <h5 class="text-success-emphasis fw-bold mb-2">平均成功率</h5>
                <p class="fs-2 fw-bold text-success-emphasis">{{ avgSuccessRate }}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-lg border-2 border-secondary">
        <div class="card-header bg-secondary text-white text-center py-3">
          <h3 class="card-title fs-5 fw-bold">增幅概率说明</h3>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">目标等级</th>
                  <th scope="col">概率</th>
                  <th scope="col">武器矛盾消耗</th>
                  <th scope="col">非武器矛盾消耗</th>
                  <th scope="col">幸运符数量</th>
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
          <div class="mt-4 text-muted small">
            <p class="mb-1">📌 失败规则：</p>
            <p v-for="rule in failureRules" :key="rule.range" class="mb-1">
              • 目标等级 {{ rule.range }}：{{ rule.label }}
            </p>
          </div>
        </div>
      </div>
      <template #overlay>

    <!-- 通知 Toast（祝贺/勉励共用） -->
    <div class="toast-container position-fixed top-50 start-50 translate-middle p-3" style="z-index: 9999;">
      <div
        ref="toastEl"
        class="toast align-items-center border-0"
        :class="toastType === 'celebration' ? 'text-white bg-success' : 'text-dark bg-warning'"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body fs-5 fw-bold text-center w-100 py-3">
            {{ toastMessage }}
          </div>
          <button
            type="button"
            class="btn-close me-2 m-auto"
            :class="toastType === 'celebration' ? 'btn-close-white' : ''"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>

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
              <label class="form-label fw-bold" for="weaponCount">武器胚子数量</label>
              <input
                id="weaponCount"
                type="number"
                v-model.number="weaponCount"
                :min="1"
                :max="MAX_EMBRYON_COUNT"
                class="form-control"
                placeholder="请输入武器胚子数量"
              />
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold" for="nonWeaponCount">非武器胚子数量</label>
              <input
                id="nonWeaponCount"
                type="number"
                v-model.number="nonWeaponCount"
                :min="1"
                :max="MAX_EMBRYON_COUNT"
                class="form-control"
                placeholder="请输入非武器胚子数量"
              />
              <div class="form-text">
                每种类型最多 {{ MAX_EMBRYON_COUNT }} 个，单次最多新增 {{ MAX_EMBRYON_COUNT * 2 }} 个
              </div>
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
      </template>
  </PageLayout>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import PageLayout from '../components/PageLayout.vue'
import { Toast } from 'bootstrap'
import {
  AMPLIFY_RULES,
  MAX_LEVEL,
  LUCKY_CHARM_BONUS,
  getFailureRule,
  failureRuleSummaries
} from '../constants/amplifyData'

const failureRules = failureRuleSummaries()

let idSeed = 0

// 单次可获取的每种胚子数量上限，避免误输入六位数导致表格渲染卡死页面
const MAX_EMBRYON_COUNT = 200

const weaponCount = ref(1)
const nonWeaponCount = ref(1)
const embryons = ref([])
const selectedEmbryon = ref(null)
const useLuckyCharm = ref(true)
const auto10Result = ref(null)
const toastMessage = ref('')
const toastType = ref('celebration')
const toastEl = ref(null)

// 历史统计用
const totalAttempts = ref(0)
const totalSuccess = ref(0)

// 把输入值收敛到 1~MAX_EMBRYON_COUNT 的整数
const clampCount = (value) => {
  const n = Math.floor(Number(value))
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.min(n, MAX_EMBRYON_COUNT)
}

const confirmGetEmbryons = () => {
  const weapon = clampCount(weaponCount.value)
  const nonWeapon = clampCount(nonWeaponCount.value)
  for (let i = 0; i < weapon; i++) {
    embryons.value.push(createEmbryon('武器'))
  }
  for (let i = 0; i < nonWeapon; i++) {
    embryons.value.push(createEmbryon('非武器'))
  }
  weaponCount.value = 1
  nonWeaponCount.value = 1
  auto10Result.value = null
}

// 清空胚子并归零全部统计，便于对比两轮模拟结果
const resetAll = () => {
  embryons.value = []
  selectedEmbryon.value = null
  auto10Result.value = null
  totalAttempts.value = 0
  totalSuccess.value = 0
}

const createEmbryon = (type) => {
  return {
    id: ++idSeed,
    type,
    level: 0,
    contradictionCost: 0,
    luckyCharmCost: 0,
    failCount: 0,
    broken: false,
    encourageShown: false
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

const CELEBRATION_MESSAGES = {
  10: '恭喜勇士增幅10连成，拯救阿拉德的重任就交给你了！',
  11: '恭喜勇士增幅11连成！你是天选之人，阿拉德的希望！',
  12: '恭喜勇士增幅12连成满级！传说中的增幅之神就是你！'
}

const showToast = (message, type = 'celebration') => {
  toastType.value = type
  toastMessage.value = message
  nextTick(() => {
    if (toastEl.value) {
      const toast = new Toast(toastEl.value, { delay: 4000 })
      toast.show()
    }
  })
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
  if (useLuckyCharm.value && rate < 100) rate = Math.min(100, rate + LUCKY_CHARM_BONUS)
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
  if (charmUsed > 0) rate = Math.min(100, rate + LUCKY_CHARM_BONUS)

  embryon.contradictionCost += rule.contradiction
  embryon.luckyCharmCost += charmUsed
  totalAttempts.value++

  const roll = Math.random() * 100
  if (roll <= rate) {
    embryon.level++
    totalSuccess.value++
    if (embryon.level >= 10 && embryon.failCount === 0) {
      showToast(CELEBRATION_MESSAGES[embryon.level] || `恭喜勇士增幅${embryon.level}连成！`, 'celebration')
    }
    if (embryon.level === 10 && embryon.contradictionCost >= 10000 && !embryon.encourageShown) {
      embryon.encourageShown = true
      showToast(`💪 勇士增幅到10已消耗${embryon.contradictionCost.toLocaleString()}个矛盾！坚持下去，光辉就在前方！`, 'encourage')
    }
    return true
  } else {
    embryon.failCount++
    const failure = getFailureRule(targetLevel)
    if (failure.action === 'break') {
      embryon.broken = true
    } else if (failure.action === 'down') {
      embryon.level = Math.max(0, embryon.level - failure.amount)
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
</style>
