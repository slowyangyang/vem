import Vue from 'vue'
import Vuex from 'vuex'
import {getCookie} from 'common/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // JSESSIONID:getCookie("userToken") ? getCookie("userToken") : ''
    Authorization:localStorage.Authorization == undefined ? '' : JSON.parse(localStorage.Authorization)
  },
  getters: {
    emitCookie(state){
      return state.Authorization
    }
  },
  mutations: {
    saveCookie(state,payload){
      state.Authorization = payload.token
    }
  },
  actions: {
  },
  modules: {
  }
})
