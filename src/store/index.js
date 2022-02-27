import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activePath: ''
  },
  mutations: {
    setActivePath (state, val) {
      state.activePath = val
    },
    rmActivePath (state) {
      state.activePath = ''
    }
  },
  actions: {
  },
  modules: {
  }
})
