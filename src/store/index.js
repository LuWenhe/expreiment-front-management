import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    sonId: ''
  },
  mutations: {
    setSonId(state, sonId) {
      state.sonId = sonId
    }
  }
})

export default store
