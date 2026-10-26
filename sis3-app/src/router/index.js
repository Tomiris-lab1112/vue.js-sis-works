import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../pages/HomePage.vue'),
  },
  {
    path: '/products',
    component: () => import('../pages/ProductsPage.vue'),
  },
  {
    path: '/products/:id',
    component: () => import('../pages/ProductDetailsPage.vue'),
  },
  {
  path: '/manage',
  component: () => import('../pages/ManageProductsPage.vue'),
  meta: { requiresAuth: true },
  },
  {
    path: '/login',
    component: () => import('../pages/LoginPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../pages/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach((to) => {
  const loggedIn = localStorage.getItem('isLoggedIn') === 'true'

  if (to.meta.requiresAuth && !loggedIn) {
    return '/login'
  }
})
export default router
