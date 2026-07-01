import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:(.*)',
    component: () => import ('../views/Home.vue')
  },
  {
    path: '/Create',
    component: () => import ('../views/CreatePage.vue')
  },
  // {
  //   path: '/folder/:id',
  //   component: () => import ('../components/PageBase.vue/index.js')
  // }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
