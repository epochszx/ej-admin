import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
export default {
  namespaced: true,
  state: {
    orderlist: [],
    order_unpay: [],
    order_unsend: [],
    order_unReceive: [],
    order_unService: [],
    order_unConfirm: [],
    order_finish: [],
    visible: false,
    title: '添加订单信息',
    loading: false,
    waiters: [],
    orderDetails: []

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
    refreshOrders(state, orderlist) {
      state.orderlist = orderlist
    },
    unPayOrder(state, order_unpay) {
      const a = order_unpay.filter((item) => {
        return item.status === '待支付'
      })
      state.order_unpay = a
    },
    unSendOrder(state, order_unsend) {
      const a = order_unsend.filter((item) => {
        return item.status === '待派单'
      })
      state.order_unsend = a
    },
    unReceiveOrder(state, order_unReceive) {
      const a = order_unReceive.filter((item) => {
        return item.status === '待接单'
      })
      state.order_unReceive = a
    },
    unServiceOrder(state, order_unService) {
      const a = order_unService.filter((item) => {
        return item.status === '待服务'
      })
      state.order_unService = a
    },
    unConfirmOrder(state, order_unConfirm) {
      const a = order_unConfirm.filter((item) => {
        return item.status === '待确认'
      })
      state.order_unConfirm = a
    },
    finishOrder(state, order_finish) {
      const a = order_finish.filter((item) => {
        return item.status === '已完成'
      })
      state.order_finish = a
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
    },
    findWaiter(state, waiters) {
      state.waiters = waiters
    },
    // 订单id详情
    orderDetails(state, orderDetails) {
      state.orderDetails = orderDetails
    }
  },
  actions: {
    // 所有订单
    async findAllOrders(context) {
      // 1.ajax查询
      context.commit('beginLoading')
      const response = await request.get('/order/findAll')
      // 将查询到的结果更新到state中
      context.commit('refreshOrders', response.data)
      setTimeout(() => {
        context.commit('endLoading')
      }, 300)
    },
    // 下拉框
    async selectWaiter(context) {
      const response = await request.get('/waiter/findAll')
      context.commit('findWaiter', response.data)
    },
    // 未支付
    async unPayOrders(context) {
      const response = await request.get('/order/findAll')
      context.commit('unPayOrder', response.data)
    },
    // 待派单
    async unSendOrders(context) {
      const response = await request.get('/order/findAll')
      context.commit('unSendOrder', response.data)
    },
    // 待接单
    async unReceiveOrders(context) {
      const response = await request.get('/order/findAll')
      context.commit('unReceiveOrder', response.data)
    },
    // 未服务
    async unServiceOrders(context) {
      const response = await request.get('/order/findAll')
      context.commit('unServiceOrder', response.data)
    },
    // 待确认
    async unConfirmOrders(context) {
      const response = await request.get('/order/findAll')
      context.commit('unConfirmOrder', response.data)
    },
    // 已完成
    async finishOrders(context) {
      const response = await request.get('/order/findAll')
      context.commit('finishOrder', response.data)
    },
    // 派单
    async sendOrdersHandler(context, params) {
      const response = await request.get('/order/sendOrder?waiterId=' + params.waiterId + '&orderId=' + params.id)
      context.dispatch('findAllOrders')
      context.dispatch('unSendOrders')
      context.dispatch('unReceiveOrders')
      context.commit('closeModal')
      return response
    },
    // 接单
    async receiveOrderHandler(context, params) {
      const response = await request.get('/order/takeOrder?orderId=' + params)
      context.dispatch('unReceiveOrders')
      context.dispatch('unServiceOrders')
      return response
    },
    // 完成服务订单
    async finishOrderHandler(context, params) {
      const response = await request.get('/order/serviceCompleteOrder?orderId=' + params)
      context.dispatch('unServiceOrders')
      context.dispatch('unConfirmOrders')
      return response
    },
    // 确认
    async confirmOrderHandler(context, params) {
      const response = await request.get('/order/confirmOrder?orderId=' + params)
      context.dispatch('unConfirmOrders')
      context.dispatch('finishOrders')
      return response
    },
    // 拒绝
    async rejectOrderHandler(context, params) {
      const response = await request.get('/order/rejectOrder?orderId=' + params)
      context.dispatch('unConfirmOrders')
      context.dispatch('unSendOrders')
      return response
    },

    // 根据订单id拿到产品id
    async toProductId(context, id) {
      const response = await request.get('/order/getOrderLinesByOrderId?orderId=' + id)
      context.commit('orderDetails', response.data)
      return response
    }
  }
}
