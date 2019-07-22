import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import './plugins/element.js'
import './assets/css/base.less'
import '../fonts/iconfont.css'
import './api'
import TreeTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')