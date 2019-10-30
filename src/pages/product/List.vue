<template>
  <div id="wapper">
    <div style="margin-bottom:10px" />

    <el-form :inline="true">
      <el-form-item label="名称">
        <el-input v-model="param.name" placeholder="关键字查询" clearable />
      </el-form-item>
      <el-form-item><div>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </div></el-form-item>
    </el-form>

    <el-table :data="products.list" style="width: 100%" size="mini">
      <el-table-column prop="id" label="编号" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="status" label="货存" />
      <el-table-column prop="categoryId" label="具体事务id" />
      <el-table-column label="操作" align="center">
        <template v-slot:default="scope">
          <!-- 如何传递参数给点击函数 -->
          <el-button size="mini" type="text" circle @click="detailshandler(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top:10px;margin-bottom:10px;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="products.total"
        :page-size="param.pageSize"
        :current-page="param.page+1"
        @current-change="changepage"
      />
    </div>

  </div>
</template>
<script>

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      param: {
        page: 0,
        pageSize: 8
      }
    }
  },
  computed: {
    ...mapState('product', ['products'])
    // ...mapGetters('waiter',['']),
  },
  created() {
    this.onSubmit()
  },
  methods: {
    // ...mapMutations('waiter',['']),
    ...mapActions('product', ['reloadDatequery']),
    onSubmit() {
      console.log('查询')
    },
    detailshandler(param) {
      console.log(param)
      this.$router.push({
        path: '/product/Details',
        query: { id: param }
      })
    },
    onSubmit() {
      this.reloadDatequery(this.param).then((response) => {
      })
    },
    changepage(page) {
      this.param.page = page - 1
      this.onSubmit()
    }
  }

}
</script>

<style scoped>

</style>
