import Vue from 'vue'
import Vuex from 'vuex'
import {getCookie} from 'common/utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cookie:getCookie("userToken") ? getCookie("userToken") : ''
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
