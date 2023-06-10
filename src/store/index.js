import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userId: '',
    roleId: '',
    roleName: '',
    permissionList: []
  },
  mutations: {
    resetUserInfo(state) {
      state.userId = ""
      state.roleId = ""
      state.roleName = ""
      state.permissionList = []
    },
    addUserInfo(state, user) {
      state.userId = user.userId
      state.roleId = user.roleId
      state.roleName = user.roleName
      state.permissionList = user.permissionList
    }
  },
  actions: {
    getUserInfo(context, user) {
      context.commit('addUserInfo', user)
    }
  },
  getters: {
    userId(state) {
      return state.userId
    }
  }
})

export default store
