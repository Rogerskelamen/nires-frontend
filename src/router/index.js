import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/home/dashboard',
    component: Home,
    children: [{
      path: '/home/dashboard',
      component: () => import('@/views/DashBoard.vue')
    },
    {
      path: '/interview/manage',
      component: () => import('@/views/interview/Manage.vue')
    },
    {
      path: '/interview/handle',
      component: () => import('@/views/interview/Handle.vue')
    },
    {
      path: '/resource/department',
      component: () => import('@/views/resource/Department.vue')
    },
    {
      path: '/resource/staff',
      component: () => import('@/views/resource/Staff.vue')
    },
    {
      path: '/alter/position',
      component: () => import('@/views/alter/Position.vue')
    },
    {
      path: '/alter/transfer',
      component: () => import('@/views/alter/Transfer.vue')
    },
    {
      path: '/system/admin',
      component: () => import('@/views/system/Admin.vue')
    }]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }

  // 没有token就返回到登录页面
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
