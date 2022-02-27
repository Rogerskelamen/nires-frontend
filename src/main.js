import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
import './plugins/slider-verify'
import axios from './plugins/axios'

import '@/assets/css/global.css'
import store from './store'

Vue.config.productionTip = false

Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
