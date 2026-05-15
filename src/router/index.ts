import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
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
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
    {
      path: '/admin/dashboard',
      name: 'Admin Dashboard',
      component: () => import('../views/AdminDashboard.vue'),
      meta: {
        title: 'Admin Dashboard',
        role : 'admin',
      },
    },
    {
      path: '/kasir/dashboard',
      name: 'Kasir Dashboard',
      component: () => import('../views/KasirDashboard.vue'),
      meta: {
        title: 'Kasir Dashboard',
        role : 'kasir',
      },
    },
    {
      path: '/admin/settings',
      name: ' Pengaturan',
      component: () => import('../views/Pages/Admin/Settings.vue'),
      meta: {
        title: 'Admin Settings',
        role : 'admin',
      },
    }
  ],
})

const publicPages = ['/signin', '/signup', '/error-404']

router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title || 'TailAdmin'} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
  const token = localStorage.getItem('token')
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !token) {
    return next({ path: '/signin' })
  }

  if ((to.path === '/signin' || to.path === '/signup') && token) {
    const role = localStorage.getItem('role')
    const redirectPath = role === 'admin' ? '/admin/dashboard' : role === 'kasir' ? '/kasir/dashboard' : '/'
    return next({ path: redirectPath })
  }

  next()
})

export default router
