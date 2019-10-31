<template>
  <div id="wapper">
    <div style="margin-bottom:10px" />

    <el-row>
      <el-col :span="20">
        <el-form :inline="true">
          <el-form-item label="姓名">
            <el-input placeholder="关键字查询" clearable />
          </el-form-item>
          <el-form-item><div>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </div></el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-button type="danger" @click="checkmore">批量审核</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="waiters"
      style="width: 100%"
      size="mini"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column prop="id" label="编号" />
      <el-table-column prop="realname" label="姓名" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="password" label="密码" />
      <el-table-column prop="telephone" label="电话" />
      <el-table-column prop="idCard" label="身份证" />
      <el-table-column prop="bankCard" label="银行卡" />
      <el-table-column prop="registerTime" label="注册时间" />
      <el-table-column label="操作" align="center">
        <template v-slot:default="scope">
          <!-- 如何传递参数给点击函数 -->
          <el-button size="mini" type="text" circle @click="check(scope.row.id)">审核</el-button>
          <el-button size="mini" type="text" circle @click="detail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      waiterIds: []
    }
  },
  computed: {
    ...mapState('waiter', ['waiters', 'loading'])
    // ...mapGetters('waiter',['']),
  },
  created() {
    this.loadDatewaiter()
  },
  methods: {
    // ...mapMutations('waiter',['']),
    ...mapActions('waiter', ['loadDatewaiter']),
    onSubmit() {
      console.log('查询')
    },
    check(param) {
      // 如何跳到审核模块的员工审核
      this.$router.push({
        path: '/waiter/Check',
        query: { id: param }
      })
    },
    detail(param) {
      this.$router.push({
        path: '/waiter/Details',
        query: { id: param }
      })
    },
    handleSelectionChange(val) {
      // map属性：map()方法可以创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果
      this.waiterIds = val.map((item) => item.id)
    },
    checkmore() {
      console.log('批量审核')
    }
  }
}
</script>

<style scoped>

</style>
