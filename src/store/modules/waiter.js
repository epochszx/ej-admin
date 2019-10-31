import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
export default {
  // 保证main.js中的modules模块命名不会起冲突；调用不会出错；
  namespaced: true,
  state: {
    waiters: [],
    loading: false
  },
  getters: {

  },
  mutations: {
    refreshdata(state, waiters) {
      state.waiters = waiters
    },
    // 加载条
    beginLoading(state) {
      state.loading = true
    },
    endLoading(state) {
      state.loading = false
    }
  },
  actions: {
    async loadDatewaiter({ commit }) {
      commit('beginLoading')
      const response = await request.get('/waiter/findAll')
      commit('refreshdata', response.data)
      setTimeout(() => {
        commit('endLoading')
      }, 300)
    }
  }
}
