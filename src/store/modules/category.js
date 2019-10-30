import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
export default {
  namespaced: true,
  state: {
    categories: [],
    visible: false,
    title: '添加栏目信息',
    loading: false,
    allCategories: []
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
    refreshCategories(state, categories) {
      state.categories = categories
    },
    loadParentId(state, allCategories) {
      state.allCategories = allCategories
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
    // async findAllCategories(context){
    //     context.commit("beginLoading");
    //     let response = await request.get('/category/findAll');
    //     context.commit('refreshCategories',response.data)
    //     setTimeout(()=>{
    //         context.commit("endLoading");
    //     },500)
    // },
    // 分页加载数据
    async queryFindCategories(context, params) {
      context.commit('beginLoading')
      const response = await post('/category/query', params)
      context.commit('refreshCategories', response.data)
      setTimeout(() => {
        context.commit('endLoading')
      }, 300)
    },

    // 保存或更新数据
    async saveOrUpdateCategory(context, payload) {
      const response = await post('/category/saveOrUpdate', payload)
      context.dispatch('queryFindCategories', context.state.categories)
      context.commit('closeModal')
      return response
    },
    // 删除
    async deleteCategoryById(context, id) {
      const response = await request.get('/category/deleteById?id=' + id)
      context.dispatch('queryFindCategories', context.state.categories)
      return response
    },
    // 批量删除
    async batchDeleteCategories(context, ids) {
      const response = await post_array('/category/batchDelete', { ids })
      context.dispatch('queryFindCategories', context.state.categories)
      return response
    },
    // 下拉框加载父栏目
    async selectParentId(context) {
      const response = await request.get('/category/findAll')
      context.commit('loadParentId', response.data)
      return response
    }
  }
}
