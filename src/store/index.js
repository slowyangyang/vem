import Vue from 'vue'
import Vuex from 'vuex'
import db from 'common/localstorage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
      state.token = payload.token
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
