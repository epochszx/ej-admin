<template>
  <div class="productDetails">
    <h2>产品详情</h2>
    <el-button size="small" type="primary" @click="backHandler">返回</el-button>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="product" size="mini">
        <el-table :data="product">
          <el-table-column prop="id" label="编号" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="price" label="价格" />
          <el-table-column prop="status" label="状态" />
          <el-table-column prop="categoryId" label="类型id" />
          <el-table-column prop="category.id" label="类型id" />
          <el-table-column prop="category.name" label="类型名称" />
          <el-table-column prop="category.num" label="类型数量" />
          <el-table-column prop="category.icon" label="类型图标">
            <template #default="record">
              <img :src="record.row.category.icon" alt="">
            </template>
          </el-table-column>
          <el-table-column prop="category.parentId" label="类型的父级id" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      activeName: 'product'
    }
  },
  created() {
    // console.log(this.$route)
    const id = this.$route.query.id
    this.findByproductsId(id)
  },
  computed: {
    ...mapState('product', ['product'])
  },
  methods: {
    ...mapActions('product', ['findByproductsId']),
    backHandler() {
      this.$router.go(-1)
    }
  }

}
</script>
<style scoped>

</style>
