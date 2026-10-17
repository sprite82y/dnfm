<template>
  <div class="min-vh-100 bg-gradient">
    <header class="glass-card border-bottom border-secondary-subtle shadow-sm">
      <div class="container px-4 py-4">
        <div class="d-flex align-items-center justify-content-between">
          <router-link to="/" class="d-flex align-items-center gap-2 text-muted hover-text-dark text-decoration-none">
            <span>← 返回</span>
          </router-link>
          <div class="d-flex align-items-center gap-3">
            <span class="fs-3">⚔️</span>
            <h1 class="fs-2 fw-bold text-dark">团武属强伤害提升计算</h1>
            <span class="fs-3">⚔️</span>
          </div>
          <div style="width: 4rem;"></div>
        </div>
        <p class="text-center text-muted mt-1">计算属强提升带来的伤害提升率</p>
      </div>
    </header>

    <main class="container px-4 py-5">
      <div class="row g-4">
        <div class="col-lg-4">
          <div class="card glass-card border border-secondary-subtle shadow-sm">
            <div class="card-header bg-light text-dark">
              <h4 class="card-title mb-0">输入参数</h4>
            </div>
            <div class="card-body">
              <div class="mb-4">
                <label class="form-label">当前属强</label>
                <input
                  v-model.number="inputData.currentAttr"
                  type="number"
                  class="form-control"
                  placeholder="请输入当前属强"
                />
              </div>
              <div class="mb-4">
                <label class="form-label">提升属强</label>
                <input
                  v-model.number="inputData.attrIncrease"
                  type="number"
                  class="form-control"
                  placeholder="请输入提升的属强"
                />
              </div>
              <div class="mb-4">
                <label class="form-label">基础白字</label>
                <input
                  v-model.number="inputData.baseWhite"
                  type="number"
                  class="form-control"
                  placeholder="请输入基础白字"
                />
              </div>
              <div class="d-flex gap-3">
                <button
                  @click="calculate"
                  :disabled="!canCalculate"
                  class="btn btn-lg flex-grow-1 rounded-3 fw-bold transition-all"
                  :class="canCalculate ? 'bg-warning text-dark hover-bg-warning shadow-lg' : 'bg-secondary text-muted cursor-not-allowed'"
                >
                  计算
                </button>
                <div v-if="lastResult !== null" class="flex-shrink-0 d-flex align-items-center justify-content-center px-4 bg-success text-white rounded-3">
                  <span class="fw-bold">{{ formatPercent(lastResult) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-8">
          <div class="card glass-card border border-secondary-subtle shadow-sm">
            <div class="card-header bg-light text-dark">
              <h4 class="card-title mb-0">计算结果</h4>
            </div>
            <div class="card-body">
              <div v-if="results.length === 0" class="text-center py-5">
                <div class="fs-3 mb-2">📊</div>
                <p class="text-muted">点击计算后显示结果</p>
              </div>
              <div v-else class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>属强</th>
                      <th>增伤</th>
                      <th>属强提升</th>
                      <th>属强总伤提升</th>
                      <th>基础白字</th>
                      <th>团武白字1</th>
                      <th>团武白字2</th>
                      <th>白字总伤加成</th>
                      <th>最终加成</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(result, index) in results" :key="index">
                      <td>{{ result.currentAttr }}</td>
                      <td>{{ formatPercent(result.damageIncrease) }}</td>
                      <td>{{ result.attrIncrease }}</td>
                      <td>{{ formatPercent(result.attrTotalDamageIncrease) }}</td>
                      <td>{{ result.baseWhite }}</td>
                      <td>{{ result.groupWeaponWhite1.toFixed(2) }}</td>
                      <td>{{ result.groupWeaponWhite2.toFixed(2) }}</td>
                      <td>{{ formatPercent(result.whiteDamageIncrease) }}</td>
                      <td>{{ formatPercent(result.finalIncrease) }}</td>
                      <td>
                        <button @click="removeResult(index)" class="btn btn-sm btn-danger">删除</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-lg-12">
          <div class="card glass-card border border-secondary-subtle shadow-sm">
            <div class="card-header bg-light text-dark">
              <h4 class="card-title mb-0">计算公式说明</h4>
            </div>
            <div class="card-body text-secondary">
              <div class="row">
                <div class="col-md-6">
                  <ul class="list-unstyled small d-flex flex-column gap-2">
                    <li><strong>增伤</strong> = 0.05 + 属强 / 220</li>
                    <li><strong>属强总伤提升</strong> = (1.05 + (属强+属强提升)/220) / (1+增伤) - 1</li>
                    <li><strong>团武白字1</strong> = 12 × (1 + 增伤)</li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <ul class="list-unstyled small d-flex flex-column gap-2">
                    <li><strong>团武白字2</strong> = 12 × (1.05 + (属强+属强提升)/220)</li>
                    <li><strong>白字总伤加成</strong> = (100+基础白字+团武白字2) / (100+基础白字+团武白字1) - 1</li>
                    <li><strong>最终加成</strong> = (1+属强总伤提升) × (1+白字总伤加成) - 1</li>
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
import { ref, computed } from 'vue'

const inputData = ref({
  currentAttr: null,
  attrIncrease: null,
  baseWhite: 166
})

const results = ref([])
const lastResult = ref(null)

const canCalculate = computed(() => {
  return inputData.value.currentAttr !== null && 
         inputData.value.attrIncrease !== null &&
         inputData.value.baseWhite !== null
})

const formatPercent = (value) => {
  return (value * 100).toFixed(2) + '%'
}

const calculate = () => {
  if (!canCalculate.value) return

  const { currentAttr, attrIncrease, baseWhite } = inputData.value

  const damageIncrease = 0.05 + currentAttr / 220
  const attrTotalDamageIncrease = (1.05 + (currentAttr + attrIncrease) / 220) / (1 + damageIncrease) - 1
  const groupWeaponWhite1 = 12 * (1 + damageIncrease)
  const groupWeaponWhite2 = 12 * (1.05 + (currentAttr + attrIncrease) / 220)
  const whiteDamageIncrease = (100 + baseWhite + groupWeaponWhite2) / (100 + baseWhite + groupWeaponWhite1) - 1
  const finalIncrease = (1 + attrTotalDamageIncrease) * (1 + whiteDamageIncrease) - 1

  const result = {
    currentAttr,
    damageIncrease,
    attrIncrease,
    attrTotalDamageIncrease,
    baseWhite,
    groupWeaponWhite1,
    groupWeaponWhite2,
    whiteDamageIncrease,
    finalIncrease
  }

  const exists = results.value.some(r => 
    r.currentAttr === currentAttr &&
    r.attrIncrease === attrIncrease &&
    r.baseWhite === baseWhite
  )

  lastResult.value = finalIncrease
  if (!exists) {
    results.value.unshift(result)
  }
}

const removeResult = (index) => {
  results.value.splice(index, 1)
}
</script>

<style scoped>
.hover-bg-warning:hover {
  background-color: #f59e0b;
}
</style>
