import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login'
import Home from './views/Home'

Vue.use(Router)

const router = new Router({
    routes: [{
            path: '/',
            redirect: '/login'

        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/home',
            component: Home
        }
    ]
})

router.beforeEach((to, from, next) => {
    // 1、登录不拦截
    // 2、非登录值 token 页面拦截
    if (to.path === '/login') return next()
    const tokenStr = sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router
