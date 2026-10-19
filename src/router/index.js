import { createRouter, createWebHashHistory } from 'vue-router'

// 站点名，路由标题统一拼在它后面
const SITE_TITLE = 'DNF手游工具集'

// meta.title 同时用于浏览器标签标题和页面语义，避免多个页面共用同一标题
const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { title: null }, // 首页直接用站点名
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/stone-synthesis',
    name: 'StoneSynthesis',
    meta: { title: '源石合成模拟器' },
    component: () => import('../pages/StoneSynthesis.vue')
  },
  {
    path: '/damage-calculator',
    name: 'DamageCalculator',
    meta: { title: '团武属强伤害提升计算' },
    component: () => import('../pages/DamageCalculator.vue')
  },
  {
    path: '/box-simulator',
    name: 'BoxSimulator',
    meta: { title: '超武盒子模拟器' },
    component: () => import('../pages/BoxSimulator.vue')
  },
  {
    path: '/amplify-simulator',
    name: 'AmplifySimulator',
    meta: { title: '增幅模拟器' },
    component: () => import('../pages/AmplifySimulator.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 切换页面时回到顶部；浏览器前进/后退时恢复原位置
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

router.afterEach((to) => {
  const title = to.meta?.title
  document.title = title ? `${title} - ${SITE_TITLE}` : SITE_TITLE
})

export default router
