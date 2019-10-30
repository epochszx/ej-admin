import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
export default {
  namespaced: true,
  state: {
    address: [],
    customers: [],
    visible: false
  },
  mutations: {
    refreshAddress(state, address) {
      state.address = address
    },
    refreshCustomers(state, customers) {
      state.customers = customers
    },
    showModal(state) {
      state.visible = true
    },
    closeModal(state) {
      state.visible = false
    }
  },
  actions: {
    // 根据顾客id加载地址信息
    async findByCustomerId(context, id) {
      const response = await request.get('/address/findByCustomerId?id=' + id)
      context.commit('refreshAddress', response.data)
    },
    // 修改
    async  saveOrUpdateAddress(context, payload) {
      const response = await post('/address/saveOrUpdate', payload)
      context.commit('closeModal')
      return response
    },
    // 顾客下拉框
    async customerSelect(context) {
      const response = await request.get('/customer/findAll')
      context.commit('refreshCustomers', response.data)
    },
    // 删除
    async deleteAddressById(context, id) {
      const response = await request.get('/address/deleteById?id=' + id)
      return response
    }
  }
}
