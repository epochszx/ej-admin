<template>
  <div class="order">
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="所有订单" name="first">
          <!-- 表格 -->
          <div>
            <el-table ref="multipleTable" v-loading="loading" size="small" :data="orders" tooltip-effect="dark" style="width: 100%" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="handleSelectionChange">
              <el-table-column type="selection" />
              <el-table-column prop="id" label="编号" width="100" />
              <el-table-column label="订单时间" width="300" align="center">
                <template #default="record">
                  <i class="el-icon-time" />
                  <span>{{ dateParse(record.row.orderTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="total" label="订单量" />
              <el-table-column prop="status" label="状态" />
              <el-table-column prop="customerId" label="customerId" />
              <el-table-column prop="waiterId" label="waiterId" />
              <el-table-column prop="addressId" label="addressId" />
              <el-table-column label="操作">
                <template #default="record">
                  <!-- 详情 -->
                  <el-button size="small" type="text" @click="detailsHandler(record.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 模态框 -->
          <div>
            <el-dialog :title="title" :visible.sync="visible" width="50%" :before-close="closeModal" @close="dialogCloseHandler">
              <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
                <el-form-item label="姓名" prop="realname">
                  <el-input v-model="ruleForm.realname" minlength="2" maxlength="8" show-word-limit />
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="closeModal">取 消</el-button>
                <el-button type="primary" @click="submitHandle">确 定</el-button>
              </div>
            </el-dialog>
          </div>
        </el-tab-pane>
        <el-tab-pane label="待支付" name="second">
          <!-- 表格 -->
          <div>
            <el-table ref="multipleTable" v-loading="loading" size="small" :data="order_unpay" tooltip-effect="dark" style="width: 100%" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="handleSelectionChange">
              <el-table-column type="selection" />
              <el-table-column prop="id" label="编号" width="100" />
              <el-table-column label="订单时间" width="300" align="center">
                <template #default="record">
                  <i class="el-icon-time" />
                  <span>{{ dateParse(record.row.orderTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="total" label="订单量" />
              <el-table-column prop="status" label="状态" />
              <el-table-column prop="customerId" label="customerId" />
              <el-table-column prop="waiterId" label="waiterId" />
              <el-table-column prop="addressId" label="addressId" />
              <el-table-column label="操作">
                <template #default="record">
                  <!-- 详情 -->
                  <el-button size="small" type="text" @click="detailsHandler(record.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="待派单" name="third">
          <!-- 表格 -->
          <div>
            <el-table ref="multipleTable" v-loading="loading" size="small" :data="order_unsend" tooltip-effect="dark" style="width: 100%" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="handleSelectionChange">
              <el-table-column type="selection" />
              <el-table-column prop="id" label="编号" width="100" />
              <el-table-column label="订单时间" width="300" align="center">
                <template #default="record">
                  <i class="el-icon-time" />
                  <span>{{ dateParse(record.row.orderTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="total" label="订单量" />
              <el-table-column prop="status" label="状态" />
              <el-table-column prop="customerId" label="customerId" />
              <el-table-column prop="waiterId" label="waiterId" />
              <el-table-column prop="addressId" label="addressId" />
              <el-table-column label="操作">
                <template #default="record">
                  <!-- 详情 -->
                  <el-button size="small" type="text" @click="sendOrderHandler(record.row)">派单</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 模态框 -->
          <div>
            <el-dialog :title="title" :visible.sync="visible" width="50%" :before-close="closeModal" @close="dialogCloseHandler">
              <el-form ref="ruleForm" :model="sendOrder" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
                <el-form-item label="订单编号" prop="orderId">
                  <el-input v-model="sendOrder.id" show-word-limit />
                </el-form-item>
                <el-form-item label="查询员工" prop="waiterId">
                  <el-select v-model="sendOrder.waiterId" placeholder="请选择">
                    <el-option v-for="waiter in waiters" :key="waiter.id" :label="waiter.realname" :value="waiter.id" />
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="closeModal">取 消</el-button>
                <el-button type="primary" @click="submitSendOrder">派单</el-button>
              </div>
            </el-dialog>
          </div>
        </el-tab-pane>
        <el-tab-pane label="待接单" name="fourth">
          <!-- 表格 -->
          <div>
            <el-table ref="multipleTable" v-loading="loading" size="small" :data="order_unReceive" tooltip-effect="dark" style="width: 100%" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="handleSelectionChange">
              <el-table-column type="selection" />
              <el-table-column prop="id" label="编号" width="100" />
              <el-table-column label="订单时间" width="300" align="center">
                <template #default="record">
                  <i class="el-icon-time" />
                  <span>{{ dateParse(record.row.orderTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="total" label="订单量" />
              <el-table-column prop="status" label="状态" />
              <el-table-column prop="customerId" label="customerId" />
              <el-table-column prop="waiterId" label="waiterId" />
              <el-table-column prop="addressId" label="addressId" />
              <el-table-column label="操作">
                <template #default="record">
                  <!-- 详情 -->
                  <el-button size="small" type="text" @click="receiveHandler(record.row.id)">接单</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="待服务" name="fifth">
          <!-- 表格 -->
          <div>
            <el-table ref="multipleTable" v-loading="loading" size="small" :data="order_unService" tooltip-effect="dark" style="width: 100%" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="handleSelectionChange">
              <el-table-column type="selection" />
              <el-table-column prop="id" label="编号" width="100" />
              <el-table-column label="订单时间" width="300" align="center">
                <template #default="record">
                  <i class="el-icon-time" />
                  <span>{{ dateParse(record.row.orderTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="total" label="订单量" />
              <el-table-column prop="status" label="状态" />
              <el-table-column prop="customerId" label="customerId" />
              <el-table-column prop="waiterId" label="waiterId" />
              <el-table-column prop="addressId" label="addressId" />
              <el-table-column label="操作">
                <template #default="record">
                  <!-- 详情 -->
                  <el-button size="small" type="text" @click="finishHandler(record.row.id)">完成订单</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="待确认" name="sixth">
          <!-- 表格 -->
          <div>
            <el-table ref="multipleTable" v-loading="loading" size="small" :data="order_unConfirm" tooltip-effect="dark" style="width: 100%" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="handleSelectionChange">
              <el-table-column type="selection" />
              <el-table-column prop="id" label="编号" width="100" />
              <el-table-column label="订单时间" width="300" align="center">
                <template #default="record">
                  <i class="el-icon-time" />
                  <span>{{ dateParse(record.row.orderTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="total" label="订单量" />
              <el-table-column prop="status" label="状态" />
              <el-table-column prop="customerId" label="customerId" />
              <el-table-column prop="waiterId" label="waiterId" />
              <el-table-column prop="addressId" label="addressId" />
              <el-table-column label="操作">
                <template #default="record">
                  <!-- 详情 -->
                  <el-button size="small" type="text" @click="confirmHandler(record.row.id)">确认</el-button>
                  <el-button size="small" type="text" @click="rejectHandler(record.row.id)">拒绝</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已完成" name="seventh">
          <!-- 表格 -->
          <div>
            <el-table ref="multipleTable" v-loading="loading" size="small" :data="order_finish" tooltip-effect="dark" style="width: 100%" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="handleSelectionChange">
              <el-table-column type="selection" />
              <el-table-column prop="id" label="编号" width="100" />
              <el-table-column label="订单时间" width="300" align="center">
                <template #default="record">
                  <i class="el-icon-time" />
                  <span>{{ dateParse(record.row.orderTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="total" label="订单量" />
              <el-table-column prop="status" label="状态" />
              <el-table-column prop="customerId" label="customerId" />
              <el-table-column prop="waiterId" label="waiterId" />
              <el-table-column prop="addressId" label="addressId" />
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
    return {
      ids: [],
      activeName: 'first',
      // params:{
      //         page:0,
      //         pageSize:5,
      //     },
      ruleForm: {},
      sendOrder: {
        id: '',
        waiterId: ''
      },
      rules: {
        realname: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      }

    }
  },
  computed: {
    ...mapState('order', ['orders', 'order_unsend', 'order_unpay', 'order_unReceive', 'order_unService', 'order_unConfirm', 'order_finish', 'visible', 'title', 'loading', 'waiters'])
  },
  created() {
    this.findAllOrders()
    this.unSendOrders()
    this.unReceiveOrders()
    this.unServiceOrders()
    this.unConfirmOrders()
    this.finishOrders()
    this.selectWaiter()
  },
  methods: {
    // 分发动作,提交突变
    // showModal(){
    //    return this.$store.commit("showmodal");
    // }
    // 打开关闭模态框
    ...mapMutations('order', ['showModal', 'closeModal', 'setTitle']),
    // 重载数据
    ...mapActions('order', ['findAllOrders', 'unSendOrders', 'unPayOrders', 'unReceiveOrders', 'unServiceOrders', 'unConfirmOrders', 'finishOrders', 'saveOrUpdateOrder', 'selectWaiter', 'sendOrdersHandler', 'receiveOrderHandler', 'finishOrderHandler',, 'confirmOrderHandler', 'rejectOrderHandler']),
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
    // 重置模态框
    dialogCloseHandler() {
      this.$refs.ruleForm.resetFields()
    },
    // 模态框表单提交
    submitHandle() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const promise = this.saveOrUpdateOrder(this.ruleForm)
          promise.then(() => {
            this.$message({
              type: 'success',
              message: '派单成功!'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改
    updateHandler(order) {
      this.sendOrder = order
      this.setTitle('修改订单信息')
      this.showModal()
    },
    // 获取表格id
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id)
    },
    // 详情页面
    detailsHandler(order) {
      // this.$router.push('/orderDetails')
      this.$router.push({
        path: '/order/details',
        query: { id: order.id }
      })
    },
    // 打开派单模态框
    sendOrderHandler(order) {
      this.sendOrder = order
      this.showModal()
    },
    // 派单提交按钮
    submitSendOrder() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const promise = this.sendOrdersHandler(this.sendOrder)
          promise.then(() => {
            this.$message({
              type: 'success',
              message: '派单成功!'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 接单
    receiveHandler(orderId) {
      const promise = this.receiveOrderHandler(orderId)
      promise.then(() => {
        this.$message({
          type: 'success',
          message: '接单成功!'
        })
      })
    },
    // 完成服务订单
    finishHandler(orderId) {
      const promise = this.finishOrderHandler(orderId)
      promise.then(() => {
        this.$message({
          type: 'success',
          message: '订单完成!'
        })
      })
    },
    // 确认
    confirmHandler(orderId) {
      const promise = this.confirmOrderHandler(orderId)
      promise.then(() => {
        this.$message({
          type: 'success',
          message: '订单已确认!'
        })
      })
    },
    // 拒绝
    rejectHandler(orderId) {
      const promise = this.rejectOrderHandler(orderId)
      promise.then(() => {
        this.$message({
          type: 'success',
          message: '订单已拒绝'
        })
      })
    }
  }
}
</script>

