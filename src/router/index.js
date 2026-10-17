import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/stone-synthesis',
    name: 'StoneSynthesis',
    component: () => import('../pages/StoneSynthesis.vue')
  },
  {
    path: '/damage-calculator',
    name: 'DamageCalculator',
    component: () => import('../pages/DamageCalculator.vue')
  },
  {
    path: '/box-simulator',
    name: 'BoxSimulator',
    component: () => import('../pages/BoxSimulator.vue')
  },
  {
    path: '/amplify-simulator',
    name: 'AmplifySimulator',
    component: () => import('../pages/AmplifySimulator.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
