import Vue from 'vue'
import Vuex from 'vuex'
import db from 'common/localstorage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // JSESSIONID:getCookie("userToken") ? getCookie("userToken") : ''
    token:db.get("token"),
    user_info:db.get("USER")
  },
  getters: {
    emitCookie(state){
      return state.token
    }
  },
  mutations: {
    saveToken(state,payload){
      state.token = payload
    },
    saveUser(state,payload){
      state.user_info = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
