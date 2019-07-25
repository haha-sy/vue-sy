import Vue from 'vue'
// 引入路由router
import Router from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
import Welcome from '../views/Home/Welcome'
import Users from '../views/Home/Users'
import Rights from '../views/Home/Power/Rights'
import Rloes from '../views/Home/Power/Roles'
import Categories from '../views/Home/Goods/categories'
import Params from '../views/Home/Goods/params'
import GoodsList from '../views/Home/Goods/list'
import Add from '../views/Home/Goods/Add'
import Order from '../views/Home/Order'

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
                },
                {
                    path: '/rights',
                    component: Rights
                },
                {
                    path: '/roles',
                    component: Rloes
                },
                {
                    path: '/categories',
                    component: Categories
                },
                {
                    path: '/params',
                    component: Params
                },
                {
                    path: '/goods',
                    component: GoodsList
                },
                {
                    path: '/goods/add',
                    component: Add
                },
                {
                    path: '/orders',
                    component: Order
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