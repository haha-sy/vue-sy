import Vue from 'vue'
// 引入路由router
import Router from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
import Welcome from '../views/Home/Welcome'
import Users from '../views/Home/Users'

// 注册路由
Vue.use(Router)

// 实例化路由对象
const router = new Router({
    // 定义路由规则
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
            component: Home,
            redirect: '/welcome',
            children: [{
                    path: '/welcome',
                    component: Welcome
                },
                {
                    path: '/users',
                    component: Users
                }
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    // 1、登录不拦截
    // 2、非登录值 token 页面拦截
    // 2.1、如果有token值就显示页面
    // 2.2、如果没有token值跳转到登录页面
    if (to.path === '/login') return next()
    const tokenStr = sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

// 将路由暴露出去
export default router
