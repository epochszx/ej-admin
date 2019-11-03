<template>
  <div class="customerDetails">
    <div>
      <el-button type="text" @click="backHandler">返回</el-button>
    </div>
    <div>
      <el-tabs v-model="activeName">
        <!-- 地址信息 -->
        <el-tab-pane label="地址信息" name="first">
          <el-row>
            <el-button type="primary" @click="toAddHandler">添加</el-button>
          </el-row>
          <!-- 表格 -->
          <el-table ref="multipleTable" size="small" :data="address" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" />
            <el-table-column prop="id" label="编号" />
            <el-table-column prop="province" label="省份" />
            <el-table-column prop="city" label="城市" />
            <el-table-column prop="area" label="地区" />
            <el-table-column prop="telephone" label="电话" />
            <el-table-column prop="customerId" label="顾客编号" />
            <el-table-column label="操作">
              <template #default="record">
                <!-- 修改按钮 -->
                <a href="" style="margin-right:10px;color:#409eff" @click.prevent="updateHandler(record.row)">
                  <i class="el-icon-edit" />
                </a>
                <!-- 删除 -->
                <a href="" style="margin-right:10px;color:#F56C6C" @click.prevent="deleteHandler(record.row.id)">
                  <i class="el-icon-delete" />
                </a>
              </template>
            </el-table-column>
          </el-table>
          <!--模态框 -->
          <el-dialog title="添加地址信息" :visible.sync="visible" width="50%" :before-close="closeModal">
            <el-form ref="ruleForm" :inline="true" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm-inline">
              <el-form-item label="省份" prop="province">
                <el-input v-model="ruleForm.province" />
              </el-form-item>
              <el-form-item label="城市" prop="city">
                <el-input v-model="ruleForm.city" autocomplete="off" />
              </el-form-item>
              <el-form-item label="地区" prop="area">
                <el-input v-model="ruleForm.area" />
              </el-form-item>
              <el-form-item label="地址" prop="address">
                <el-input v-model="ruleForm.address" />
              </el-form-item>
              <el-form-item label="电话" prop="telephone">
                <el-input v-model.number="ruleForm.telephone" />
              </el-form-item>
              <el-form-item label="顾客" prop="customerId">
                <el-select v-model="ruleForm.customerId" disabled>
                  <el-option v-for="customer in customers" :key="customer.id" :label="customer.id" :value="customer.id" />
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="closeModal">取 消</el-button>
              <el-button type="primary" @click="submitHandle">确 定</el-button>
            </span>
          </el-dialog>
        </el-tab-pane>
        <!-- /地址信息 -->
        <!-- 订单信息 -->
        <el-tab-pane label="订单信息" name="second">
          <!-- 表格 -->
          <div>
            <el-table ref="multipleTable" size="small" :data="orders" tooltip-effect="dark" style="width: 100%">
              <el-table-column type="selection" />
              <el-table-column prop="id" label="订单编号" />
              <el-table-column prop="customer.realname" label="顾客姓名" />
              <el-table-column prop="waiter.realname" label="员工姓名" />
              <el-table-column prop="address.address" label="地址" />
              <el-table-column label="订单时间" width="300" align="center">
                <template #default="record">
                  <i class="el-icon-time" />
                  <span>{{ dateParse(record.row.orderTime) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    var checkTelephone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      setTimeout(() => {
        // if (!Number.isInteger(value)) {
        //     callback(new Error('请输入数字值'));
        // } else {
        // 正则表达式验证手机号
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
        if (!myreg.test(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
        // }
      }, 200)
    }
    return {
      activeName: 'first',
      ruleForm: {
      },
      rules: {
        province: [
          { required: true, message: '请输入省份', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        telephone: [
          { validator: checkTelephone, required: true, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('address', ['address', 'visible', 'customers']),
    ...mapState('orderCustomer', ['orders'])
  },
  created() {
    this.refreshPage()
    this.customerSelect()
    this.refreshOrderPage()
  },
  methods: {
    ...mapMutations('address', ['showModal', 'closeModal']),

    ...mapActions('address', ['findByCustomerId', 'saveOrUpdateAddress', 'customerSelect', 'deleteAddressById']),
    ...mapActions('orderCustomer', ['orderFindByCustomerId']),
    // 普通方法
    // 日期时间方法
    dateParse(dataString) {
      if (dataString) {
        const date = new Date(dataString)
        const Y = date.getFullYear() + '-'
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
        const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
        const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
        const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
        return Y + M + D + h + m + s
      } else {
        return ''
      }
    },
    // 返回
    backHandler() {
      // this.$router.push("/customer")
      this.$router.go(-1)
    },
    // 刷新页面
    refreshPage() {
      // 获取customerid
      const id = this.$route.query.id
      this.findByCustomerId(id)
    },
    refreshOrderPage() {
      const id = this.$route.query.id
      this.orderFindByCustomerId(id)
    },
    // 添加按钮打开模态框
    toAddHandler() {
      this.ruleForm = {}
      const id = this.$route.query.id
      this.ruleForm.customerId = id
      this.showModal()
    },
    // 模态框表单提交
    submitHandle() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const promise = this.saveOrUpdateAddress(this.ruleForm)
          promise.then(() => {
            this.findByCustomerId(this.ruleForm.customerId)
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改
    updateHandler(address) {
      this.ruleForm = address
      this.showModal()
    },
    // 删除
    deleteHandler(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteAddressById(id)
          .then(() => {
            this.refreshPage()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }

}
</script>

