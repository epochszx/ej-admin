<template>
  <div class="orderDetails">
    <el-row>
      <el-button type="text" @click="backHandle">返回</el-button>
    </el-row>

  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  created: {

  },
  methods: {

    // 返回上一级按钮
    backHandle() {
      this.$router.go(-1)
    }
  }
}
</script>

<style>

</style>
