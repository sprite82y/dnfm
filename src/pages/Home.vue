<template>
  <div class="min-vh-100 bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100">
    <header class="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div class="container px-4 py-4">
        <div class="d-flex align-items-center justify-center gap-3">
          <span class="text-3xl">🔧</span>
          <h1 class="text-2xl font-bold text-gray-800">工具集</h1>
          <span class="text-3xl">🔧</span>
        </div>
        <p class="text-center text-gray-500 mt-1">实用工具集合，提升工作效率</p>
      </div>
    </header>

    <main class="container px-4 py-8">
      <div class="row g-6">
        <div
          v-for="tool in tools"
          :key="tool.id"
          class="col-lg-4 col-md-6"
        >
          <router-link
            :to="tool.path"
            class="card h-100 shadow-sm hover-shadow transition-all duration-200 text-decoration-none group"
          >
            <div class="card-body">
              <div class="icon-box mb-4 group-hover:scale-110 transition-transform duration-200">
                <span class="text-4xl">{{ tool.icon }}</span>
              </div>
              <h3 class="card-title h5 font-semibold text-gray-800">{{ tool.name }}</h3>
              <p class="card-text text-sm text-gray-500">{{ tool.description }}</p>
            </div>
            <div class="card-footer bg-transparent border-top">
              <span class="text-primary text-sm font-medium">开始使用 →</span>
            </div>
          </router-link>
        </div>
      </div>
    </main>

    <footer class="bg-white/80 border-t border-gray-200 mt-auto">
      <div class="container px-4 py-4">
        <p class="text-center text-gray-500 text-sm">工具集 © 2026</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tools = ref([
  {
    id: 1,
    name: 'DNF手游源石合成',
    description: '模拟源石合成，预测合成结果，统计皇冠词条概率',
    icon: '💎',
    path: '/stone-synthesis'
  },
  {
    id: 2,
    name: '团武属强伤害提升',
    description: '根据属强、提升属强、基础白字计算伤害提升率',
    icon: '⚔️',
    path: '/damage-calculator'
  }
])
</script>

<style scoped>
.hover-shadow:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.icon-box {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e7f3ff;
  border-radius: 16px;
}

.group:hover .icon-box {
  background-color: #ede9fe;
}
</style>
