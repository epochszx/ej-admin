import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
export default {
  // 保证main.js中的modules模块命名不会起冲突；调用不会出错；
  namespaced: true,
  state: {
    products: [],
    product: {},
    dialogFormVisible: false
  },
  getters: {

  },
  mutations: {
    refreshdata(state, products) {
      state.products = products
    },
    refreshdataagain(state, product) {
      state.product = product
    },
    hidemodel(state) {
      state.dialogFormVisible = false
    },
    showmodel(state) {
      state.dialogFormVisible = true
    }
  },
  actions: {
    // 分页查询
    async reloadDatequery({ commit }, param) {
      const response = await post('/product/query', param)
      commit('refreshdata', response.data)
    },
    // 通过id查询产品信息
    async findByproductsId({ commit }, id) {
      const response = await request.get('/product/findById?id=' + id)
      commit('refreshdataagain', response.data)
    },
    // 保存或更新
    async saveOrUpdateproduct({ commit }, param) {
      const response = await post('/product/saveOrUpdate', param)
      commit('hidemodel')
      return response
    },
    // 删除上传的文件
    async deleteupload(id) {
      const response = await request.get('/file/deleteById?id=' + id)
      return response
    },
    // 根据id删除产品信息
    async deleteById(id) {
      const response = await request.get('/product/findByCategoryId?id=' + id)
      return response
    }
  }
}
