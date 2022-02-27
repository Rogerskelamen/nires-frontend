import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
import './plugins/slider-verify'
import axios from './plugins/axios'
import store from './store'

import '@/assets/css/global.css'

Vue.config.productionTip = false

Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
