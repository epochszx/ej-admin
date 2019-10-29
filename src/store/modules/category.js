import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
export default {
  // 保证main.js中的modules模块命名不会起冲突；调用不会出错；
  namespaced: true,
  state: {
    categories: []
  },
  getters: {

  },
  mutations: {
    refreshdata(state, categories) {
      state.categories = categories
    }
  },
  actions: {
    async reloadDatequery({ commit }, param) {
      const response = await post('/category/query', param)
      commit('refreshdata', response.data)
    }
  }
}
