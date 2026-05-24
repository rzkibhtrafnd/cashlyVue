import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      redirect: '/signin',
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
        requiresAuth: true,
      },
    },
    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
        guestOnly: true,
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
        guestOnly: true,
      },
    },
    {
      path: '/admin/dashboard',
      name: 'Admin Dashboard',
      component: () => import('../views/AdminDashboard.vue'),
      meta: {
        title: 'Admin Dashboard',
        role: 'admin',
        requiresAuth: true,
      },
    },
    {
      path: '/kasir/dashboard',
      name: 'Kasir Dashboard',
      component: () => import('../views/KasirDashboard.vue'),
      meta: {
        title: 'Kasir Dashboard',
        role: 'kasir',
        requiresAuth: true,
      },
    },
    {
      path: '/admin/settings',
      name: ' Pengaturan',
      component: () => import('../views/Pages/Admin/Settings/Index.vue'),
      meta: {
        title: 'Admin Settings',
        role: 'admin',
        requiresAuth: true,
      },
    },
    {
      path: '/admin/users',
      name: 'User Management',
      component: () => import('../views/Pages/Admin/Users/Index.vue'),
      meta: {
        title: 'User Management',
        role: 'admin',
        requiresAuth: true,
      },
    },
    {
      path: '/admin/categories',
      name: 'Categories',
      component: () => import('../views/Pages/Admin/Categories/Index.vue'),
      meta: {
        title: 'Kategori Produk',
        role: 'admin',
        requiresAuth: true,
      },
    },
    {
      path: '/products',
      name: 'Products',
      component: () => import('../views/Pages/Admin/Products/Index.vue'),
      meta: {
        title: 'Manajemen Produk',
        requiresAuth: true,
      },
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: () => import('../views/Pages/Admin/Transactions/Index.vue'),
      meta: { 
        title: 'Kasir / Transaksi', 
        requiresAuth: true 
      },
    },
    {
      path: '/recent-transactions',
      name: 'Riwayat Transactions',
      component: () => import('../views/Pages/Admin/RecentTransactions/Index.vue'),
      meta: { 
        title: 'Riwayat Transaksi', 
        requiresAuth: true 
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/error-404'
    }
  ],
})

let lastNavigationTime = 0
const THROTTLE_DELAY = 300

router.beforeEach((to, from, next) => {
  const now = Date.now()
  if (now - lastNavigationTime < THROTTLE_DELAY) {
    console.warn('Navigasi diblokir sementara karena terlalu cepat (Throttle)')
    return next(false)
  }
  lastNavigationTime = now

  document.title = `${to.meta.title} Cashly`
  
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    return next({ path: '/signin' })
  }

  if (to.matched.some(record => record.meta.guestOnly) && token) {
    if (role === 'admin') return next({ path: '/admin/dashboard' })
    if (role === 'kasir') return next({ path: '/kasir/dashboard' })
    return next({ path: '/signin' })
  }

  if (to.meta.role && to.meta.role !== role) {
    if (role === 'kasir') return next({ path: '/kasir/dashboard' })
    if (role === 'admin') return next({ path: '/admin/dashboard' })
    return next({ path: '/signin' })
  }

  return next()
})

export default router