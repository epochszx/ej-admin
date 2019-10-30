<template>
  <div id="wapper">
    <div style="margin-bottom:10px" />
    <el-row>
      <el-col :span="20">
        <el-form :inline="true">
          <el-form-item label="名称">
            <el-input v-model="param.name" placeholder="关键字查询" clearable />
          </el-form-item>
          <el-form-item><div>
            <el-form-item>
              <el-button type="primary" @click="inquireHandler">查询</el-button>
            </el-form-item>
          </div></el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addHandler">添加</el-button>
        <el-button type="danger" @click="deletemoreHandler">批量删除</el-button>
      </el-col>
    </el-row>
    <el-table :data="products.list" style="width: 100%" size="mini">
      <el-table-column prop="id" label="编号" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="categoryId" label="所属栏目id" />
      <el-table-column label="操作" align="center">
        <template v-slot:default="scope">
          <!-- 如何传递参数给点击函数 -->
          <el-button size="mini" type="text" circle @click="detailsHandler(scope.row.id)">详情</el-button>
          <el-button size="mini" type="text" circle @click="updataHandler(scope.row)">修改</el-button>
          <el-button size="mini" type="text" circle @click="deleteHandler(scope.row.id)">删除</el-button>
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

    <!-- model -->
    <el-dialog title="产品详细信息" :visible.sync="dialogFormVisible" :before-close="hidemodel" @close="closeHandler">
      {{ product }}
      <el-form ref="productsref" :model="product" :rules="rules">
        <el-form-item label="产品名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="product.name" />
        </el-form-item>
        <el-form-item label="产品价钱" prop="price" :label-width="formLabelWidth">
          <el-input v-model="product.price" />
        </el-form-item>
        <el-form-item label="产品描述" :label-width="formLabelWidth">
          <el-input v-model="product.description" type="textarea" :rows="2" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="产品id" prop="categoryId" :label-width="formLabelWidth">
          <el-select v-model="product.categoryId" placeholder="请选择类型">
            <!-- 一定要绑定key值，否则将报错 -->
            <el-option v-for="item in allCategories" :key="item.id" :value="item.id" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品照片上传" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action="http://134.175.154.93:6677/file/upload"
            :on-success="uploadsuccessHandler"
            :before-remove="deleteuploadHandker"
            :file-list="fileList"
            :limit="1"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hidemodel">取 消</el-button>
        <el-button type="primary" @click="submitModal">确 定</el-button>
      </div>
    </el-dialog>

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
      },
      formLabelWidth: '120px',
      product: {},
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '选择产品id', trigger: 'blur' }
        ]
      },
      fileList: []
    }
  },
  computed: {
    ...mapState('product', ['dialogFormVisible', 'products']),
    ...mapState('category', ['allCategories'])
    // ...mapGetters('waiter',['']),
  },
  created() {
    this.inquireHandler()
    // 加载下拉框
    this.selectParentId()
  },
  methods: {
    ...mapMutations('product', ['hidemodel', 'showmodel']),
    ...mapActions('product', ['reloadDatequery', 'saveOrUpdateproduct', 'deleteupload', 'deleteById']),
    ...mapActions('category', ['selectParentId']),
    // 跳转详情页面
    detailsHandler(param) {
      console.log(param)
      this.$router.push({
        path: '/product/Details',
        query: { id: param }
      })
    },
    // 刷新查询按钮事件
    inquireHandler() {
      this.reloadDatequery(this.param).then((response) => {
      })
    },
    // 页面分页函数
    changepage(page) {
      this.param.page = page - 1
      this.inquireHandler()
    },
    // 添加
    addHandler() {
      this.product = {}
      this.showmodel()
    },
    // 监测model框关闭时表单清空函数
    closeHandler() {
      // 使用element-ui中的表单，人家给定的方法。
      this.$refs.productsref.resetFields()
      // 将上传文件的上次信息给清空；
      this.fileList.pop()
    },
    // 表单提交事件
    submitModal() {
      // $refs是ref的rules的所有集合，Productref是指定的，validata是ref中的一个方法，valid是方法调用的结果，它们是配合使用。
      this.$refs.productsref.validate((valid) => {
        if (valid) {
          this.saveOrUpdateproduct(this.product).then((response) => {
            // 数据刷新
            this.inquireHandler()
            this.$message({ message: response.statusText, type: 'success' })
          }).catch((error) => {
            this.$message.error('错误信息：' + error)
          })
        } else {
          return false
        }
      })
    },
    // 修改函数
    updataHandler(product) {
      this.product = product
      // 更改上传的文件
      // console.log(product.photo)
      if (product.photo != null) {
        this.fileList.push({ name: '当前图片', url: 'product.photo' })
      } else {
        this.fileList.push({ name: '没有图片', url: '' })
      }
      this.showmodel()
    },
    // 上传函数
    uploadsuccessHandler(response) {
      if (response.status === 200) {
        const id = response.data.id
        const photo = 'http://134.175.154.93:8888/group1/' + id
        this.product.photo = photo
        // 将数据和表单上的{{}}实现数据同时改变；
        this.product = Object.assign({}, this.product)
      } else {
        this.$message.error('文件上传失败')
      }
    },
    // 删除上传文件的函数
    deleteuploadHandker(file) {
      console.log(file.uid)
      this.deleteupload(file.uid).then(() => {
        console.log(response)
      })
    },
    // 批量删除信息
    deletemoerHandler() {

    },
    deleteHandler(id) {
      this.deleteById(id).then((response) => {
        // 数据刷新
        this.inquireHandler()
        this.$message({ message: response.statusText, type: 'success' })
      })
    }
  }
}
</script>

<style scoped>

</style>
