import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
export default {
  // 保证main.js中的modules模块命名不会起冲突；调用不会出错；
  namespaced: true,
  state: {
    products: [],
    product: {},
    dialogFormVisible: false,
    title: '',
    loading: false
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
    },
    changetitle(state, title) {
      state.title = title
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
    // 分页查询
    async reloadDatequery({ commit }, param) {
      commit('beginLoading')
      const response = await post('/product/query', param)
      commit('refreshdata', response.data)
      setTimeout(() => {
        commit('endLoading')
      }, 300)
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
    async deleteupload(context, id) {
      const response = await request.get('/file/deleteById?id=' + id)
      return response
    },
    // 根据id删除产品信息
    async deleteById(context, id) {
      const response = await request.get('/product/deleteById?id=' + id)
      return response
    },
    // 批量删除产品信息
    async deletemore(context, ids) {
      const response = await post_array('/product/batchDelete', { ids })
      console.log(response)
      return response
    }
  }
}
