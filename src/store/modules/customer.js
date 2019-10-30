import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
export default {
  namespaced: true,
  state: {
    customers: [],
    visible: false,
    title: '添加顾客信息',
    loading: false
  },
  getters: {

  },
  mutations: {
    showModal(state) {
      state.visible = true
    },
    closeModal(state) {
      state.visible = false
    },
    refreshCustomers(state, customers) {
      state.customers = customers
    },
    // 更新模态框标题
    setTitle(state, title) {
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
    // 加载数据
    // context是一个与store对象解构相似的对象，包含了commit、dispatch、getters、state
    async findAllCustomers(context) {
      // 1.ajax查询
      context.commit('beginLoading')
      const response = await request.get('/customer/findAll')
      // 将查询到的结果更新到state中
      context.commit('refreshCustomers', response.data)
      setTimeout(() => {
        context.commit('endLoading')
      }, 300)
    },
    // 分页加载数据
    // async queryFindCustomers(context, params) {
    //   context.commit('beginLoading')
    //   const response = await post('/customer/query', params)
    //   context.commit('refreshCustomers', response.data)
    //   setTimeout(() => {
    //     context.commit('endLoading')
    //   }, 300)
    // },

    // 保存或更新数据
    // payload载荷为顾客信息
    // context可解构成{commit,dispatch}
    async saveOrUpdateCustomer(context, payload) {
      const response = await post('/customer/saveOrUpdate', payload)
      context.dispatch('findAllCustomers')
      context.commit('closeModal')
      return response
    },
    // 删除
    async deleteCustomerById(context, id) {
      const response = await request.get('/customer/deleteById?id=' + id)
      context.dispatch('findAllCustomers')
      return response
    },
    // 批量删除
    async batchDeleteCustomers(context, ids) {
      const response = await post_array('/customer/batchDelete', { ids })
      context.dispatch('findAllCustomers')
      return response
    }
  }
}
