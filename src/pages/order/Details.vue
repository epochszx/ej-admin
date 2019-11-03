<template>
  <div class="orderDetails">
    <el-row>
      <el-button type="text" @click="backHandle">返回</el-button>
    </el-row>
    <el-table
      :data="orderDetails"
      style="width: 100%"
      size="small"
    >
      <el-table-column
        prop="id"
        label="编号"
        width="180"
      />
      <el-table-column
        prop="number"
        label="数量"
        width="180"
      />
      <el-table-column
        prop="price"
        label="价格/元"
      />
      <el-table-column
        prop="productId"
        label="产品id"
      />
      <el-table-column
        prop="orderId"
        label="订单编号"
      />
    </el-table>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState('order', ['orderDetails'])
  },
  created() {
    const id = this.$route.query.id
    this.toProductId(id)
  },
  methods: {
    ...mapActions('order', ['toProductId']),
    // 返回上一级按钮
    backHandle() {
      this.$router.go(-1)
    }
  }
}
</script>

<style>

</style>
