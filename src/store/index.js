import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAuthenticated:localStorage.getItem('isAuthenticated') ? localStorage.getItem('isAuthenticated') : ''
  },
  mutations: {
    saveToken(state,payload){
      state.isAuthenticated = payload.isAuthenticated
    }
  },
  actions: {
  },
  modules: {
  }
})
