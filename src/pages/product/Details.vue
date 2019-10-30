<template>
  <div class="productDetails">
    <h2>产品详情</h2>
    <el-button size="small" type="primary" @click="backHandler">返回</el-button>
    <el-tabs v-model="activeName">
      <!-- {{product}} -->
      <el-tab-pane label="基本信息" name="product" size="mini">
        <el-row :gutter="20">
          <el-col :span="6"><div class="grid-content bg-purple"><p><strong>产品编号：</strong>{{ product.id }}</p></div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"><p><strong>产品名称：</strong>{{ product.name }}</p></div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"><p><strong>产品价格：</strong>{{ product.price }}</p></div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"><p><strong>产品状态：</strong>{{ product.status }}</p></div></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6"><div class="grid-content bg-purple"><p><strong>产品描述：</strong>{{ product.description }}</p></div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"><p><strong>所属类型名称：</strong>{{ product.category.name }}</p></div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"><p><strong>所属类型id：</strong>{{ product.categoryId }}</p></div></el-col>
          <el-col :span="6"><div class="grid-content bg-purple"><p><strong>所属类型数量：</strong>{{ product.category.num }}</p></div></el-col>
        </el-row>
        <el-row>
          <el-col><strong>所属类型图标：</strong></el-col>
          <el-col><img :src="product.category.icon" alt=""></el-col>
          <el-col><strong>产品图片：</strong></el-col>
          <el-col><img :src="product.photo" alt=""></el-col>
        </el-row>
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
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
    text-align: center;
    line-height: 3em;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
