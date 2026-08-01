<template>
  <div class="min-vh-100 bg-gradient">
    <header class="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div class="container px-4 py-4">
        <div class="text-center">
          <h1 class="fs-3 fw-bold text-dark">⚔️ DNF手游工具集 ⚔️</h1>
          <p class="text-muted mt-2">为勇士们打造的实用工具</p>
        </div>
      </div>
    </header>

    <main class="container px-4 py-8">
      <div class="row g-6">
        <div class="col-lg-6">
          <router-link to="/stone-synthesis" class="text-decoration-none">
            <div class="card bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm hover-shadow-lg transition-all duration-200 cursor-pointer">
              <div class="card-body text-center py-8">
                <div class="fs-1 mb-4">💎</div>
                <h3 class="fs-xl fw-bold text-dark">源石合成模拟器</h3>
                <p class="text-muted mt-2">模拟源石合成过程，预测合成结果和皇冠词条概率</p>
                <div class="mt-4">
                  <span class="badge bg-warning text-dark">合成</span>
                  <span class="badge bg-purple text-white">概率</span>
                  <span class="badge bg-pink text-white">词条</span>
                </div>
              </div>
            </div>
          </router-link>
        </div>

        <div class="col-lg-6">
          <router-link to="/damage-calculator" class="text-decoration-none">
            <div class="card bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm hover-shadow-lg transition-all duration-200 cursor-pointer">
              <div class="card-body text-center py-8">
                <div class="fs-1 mb-4">⚔️</div>
                <h3 class="fs-xl fw-bold text-dark">团武属强伤害提升计算</h3>
                <p class="text-muted mt-2">根据属强提升计算伤害提升率，优化装备搭配</p>
                <div class="mt-4">
                  <span class="badge bg-danger text-white">伤害</span>
                  <span class="badge bg-primary text-white">属强</span>
                  <span class="badge bg-success text-white">计算</span>
                </div>
              </div>
            </div>
          </router-link>
        </div>

        <div class="col-lg-6">
          <router-link to="/box-simulator" class="text-decoration-none">
            <div class="card bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm hover-shadow-lg transition-all duration-200 cursor-pointer">
              <div class="card-body text-center py-8">
                <div class="fs-1 mb-4">📦</div>
                <h3 class="fs-xl fw-bold text-dark">超武盒子模拟器</h3>
                <p class="text-muted mt-2">模拟开启超武盒子，预测获得太古龙晶等物品</p>
                <div class="mt-4">
                  <span class="badge bg-warning text-dark">盒子</span>
                  <span class="badge bg-orange text-white">龙晶</span>
                  <span class="badge bg-success text-white">雷焰</span>
                </div>
              </div>
            </div>
          </router-link>
        </div>

        <div class="col-lg-6">
          <router-link to="/amplify-simulator" class="text-decoration-none">
            <div class="card bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm hover-shadow-lg transition-all duration-200 cursor-pointer">
              <div class="card-body text-center py-8">
                <div class="fs-1 mb-4">🔧</div>
                <h3 class="fs-xl fw-bold text-dark">增幅模拟器</h3>
                <p class="text-muted mt-2">模拟装备增幅，预测矛盾消耗和失败风险</p>
                <div class="mt-4">
                  <span class="badge bg-danger text-white">增幅</span>
                  <span class="badge bg-warning text-dark">矛盾</span>
                  <span class="badge bg-primary text-white">胚子</span>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <div class="row mt-8">
        <div class="col-lg-12">
          <div class="card bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
            <div class="card-header bg-light text-dark">
              <h4 class="card-title mb-0">使用说明</h4>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <h5 class="text-primary mb-2">源石合成模拟器</h5>
                  <ul class="list-unstyled text-sm text-muted d-flex flex-column gap-1">
                    <li>• 选择两个源石的品级和皇冠词条数</li>
                    <li>• 点击合成按钮模拟合成过程</li>
                    <li>• 支持批量合成统计结果分布</li>
                    <li>• 查看不同词条组合的概率分布</li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <h5 class="text-primary mb-2">伤害计算器</h5>
                  <ul class="list-unstyled text-sm text-muted d-flex flex-column gap-1">
                    <li>• 输入当前属强和提升的属强数值</li>
                    <li>• 设置基础白字数值</li>
                    <li>• 自动计算团武白字和最终伤害提升</li>
                    <li>• 支持多条计算记录对比</li>
                  </ul>
                </div>
              </div>
              <div class="row mt-4">
                <div class="col-md-6">
                  <h5 class="text-primary mb-2">超武盒子模拟器</h5>
                  <ul class="list-unstyled text-sm text-muted d-flex flex-column gap-1">
                    <li>• 选择开启盒子数量（100/200/500/1000/10000）</li>
                    <li>• 模拟开启过程，汇总获得物品</li>
                    <li>• 统计累计获得的太古龙晶、龙之雷焰等</li>
                    <li>• 查看物品概率说明</li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <h5 class="text-primary mb-2">增幅模拟器</h5>
                  <ul class="list-unstyled text-sm text-muted d-flex flex-column gap-1">
                    <li>• 获取武器/非武器胚子</li>
                    <li>• 单独增幅或一键增幅到+10</li>
                    <li>• 失败规则：5-7级-1，8-10级-3，11级起损坏</li>
                    <li>• 统计总消耗、损坏数量和平均成功率</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="bg-white/80 border-t border-gray-200 mt-auto">
      <div class="container px-4 py-4">
        <p class="text-center text-muted text-sm">工具集 © 2026</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
.hover-shadow-lg:hover {
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
}
</style>
