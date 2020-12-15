import Vue from 'vue'
import Vuex from 'vuex'
import {getCookie} from 'common/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    JSESSIONID:getCookie("userToken") ? getCookie("userToken") : ''
  },
  getters: {
    emitCookie(state){
      return state.JSESSIONID
    }
  },
  mutations: {
    saveCookie(state,payload){
      state.cookie = payload.cookie
    }
  },
  actions: {
  },
  modules: {
  }
})
