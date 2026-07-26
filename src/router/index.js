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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
