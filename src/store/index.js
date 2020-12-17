import Vue from 'vue'
import Vuex from 'vuex'
import {getCookie} from 'common/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // JSESSIONID:getCookie("userToken") ? getCookie("userToken") : ''
    token:localStorage.token == undefined ? '' : JSON.parse(localStorage.token)
  },
  getters: {
    emitCookie(state){
      return state.token
    }
  },
  mutations: {
    saveToken(state,payload){
      state.token = payload.token
    }
  },
  actions: {
  },
  modules: {
  }
})
