import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
export default {
  // 保证main.js中的modules模块命名不会起冲突；调用不会出错；
  namespaced: true,
  state: {
    products: [],
    product: []
  },
  getters: {

  },
  mutations: {
    refreshdata(state, products) {
      state.products = products
    },
    refreshdataagain(state, product) {
      state.product = product
    }
  },
  actions: {
    async reloadDatequery({ commit }, param) {
      const response = await post('/product/query', param)
      commit('refreshdata', response.data)
    },
    async findByproductsId({ commit }, id) {
      const response = await request.get('/product/findById?id=' + id)
      const arr = []
      arr.push(response.data)
      commit('refreshdataagain', arr)
    }
  }
}
