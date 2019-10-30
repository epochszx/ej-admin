import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
export default {
  namespaced: true,
  state: {
    orders: [],
    visible: false
  },
  mutations: {
    refreshOrders(state, orders) {
      state.orders = orders
    },
    refreshCustomers(state, customers) {
      state.customers = customers
    }
  },
  actions: {
    // 根据顾客id加载订单信息
    async orderFindByCustomerId(context, id) {
      const response = await request.get('/order/query?customerId=' + id)

      context.commit('refreshOrders', response.data)
    }
  }
}
