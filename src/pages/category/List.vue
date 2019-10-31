<template>
  <div class="category">
    <!-- 按钮 -->
    <el-row>
      <el-col :span="20">
        <el-form :inline="true">
          <el-form-item label="栏目名称">
            <el-input v-model="params.name" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchHandle">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="toAddHandler">添加</el-button>
        <el-button type="danger" @click="batchDeleteHandler">批量删除</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <div>
      <el-table ref="multipleTable" v-loading="loading" size="small" :data="categories.list" tooltip-effect="dark" style="width: 100%" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" />
        <el-table-column prop="id" label="编号" />
        <el-table-column prop="name" label="服务名称" />
        <el-table-column prop="num" label="服务编号" />
        <el-table-column prop="icon" label="服务图标">
          <template #default="record">
            <img :src="record.row.icon" alt="无图片">
          </template>
        </el-table-column>
        <el-table-column prop="parentId" label="父栏目" />
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
    </div>
    <!-- 分页 -->
    <el-pagination
      layout="prev, pager, next"
      :page-size="params.pageSize"
      :current-page="params.page+1"
      :total="categories.total"
      @current-change="pageChangeHandle"
    />
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" width="50%" :before-close="closeModal">
      <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        {{ ruleForm }}

        <el-form-item label="栏目名称" prop="name">
          <el-input v-model="ruleForm.name" minlength="2" maxlength="8" show-word-limit />
        </el-form-item>
        <el-form-item label="栏目编号" prop="num">
          <el-input v-model.number="ruleForm.num" />
        </el-form-item>
        <el-form-item label="栏目图标" prop="icon">
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
        <el-form-item label="父栏目" prop="parentId">
          <el-select v-model="ruleForm.parentId" placeholder="请选择">
            <el-option v-for="parentId in allCategories" :key="parentId.id" :label="parentId.realname" :value="parentId.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModal">取 消</el-button>
        <el-button type="primary" @click="submitHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      ids: [],
      params: {
        page: 0,
        pageSize: 5
      },
      ruleForm: {
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      },
      fileList: []

    }
  },
  computed: {
    ...mapState('category', ['categories', 'visible', 'title', 'loading', 'allCategories'])
  },
  created() {
    this.queryFindCategories(this.params)
    // this.findAllCategories();
    this.selectParentId()
  },
  methods: {
    // 打开关闭模态框
    ...mapMutations('category', ['showModal', 'closeModal', 'setTitle']),
    // 重载数据
    ...mapActions('category', ['queryFindCategories', 'saveOrUpdateCategory', 'deleteCategoryById', 'batchDeleteCategories', 'selectParentId']),

    // 普通方法
    // 分页按钮
    pageChangeHandle(page) {
      this.params.page = page - 1
      this.queryFindCategories(this.params)
    },

    // 添加按钮打开模态框
    toAddHandler() {
      this.ruleForm = {}
      this.showModal()
    },
    dialogCloseHandler() {
      this.$refs.ruleForm.resetFields()
    },
    // 模态框表单提交
    submitHandle() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const promise = this.saveOrUpdateCategory(this.ruleForm)
          promise.then(() => {
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
    updateHandler(category) {
      this.ruleForm = category
      this.setTitle('修改栏目信息')
      if (category.icon != null) {
        this.fileList.push({ name: '当前图片', url: 'category.icon' })
      } else {
        this.fileList.push({ name: '没有图片', url: '' })
      }
      this.showModal()
    },
    // 删除
    deleteHandler(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteCategoryById(id)
          .then(() => {
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
    },
    // 批量删除
    batchDeleteHandler() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.batchDeleteCategories(this.ids)
          .then(() => {
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
    },
    // 获取表格id
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id)
    },
    // 详情页面
    detailsHandler(category) {
      // this.$router.push('/categoryDetails')
      this.$router.push({
        path: '/category/details',
        query: { id: category.id }
      })
    },
    // 查询按钮
    searchHandle() {
      this.queryFindCategories(this.params)
    },
    // 上传函数
    uploadsuccessHandler(response) {
      console.log(response)
      if (response.status === 200) {
        const id = response.data.id
        const icon = 'http://134.175.154.93:8888/group1/' + id
        // 手动绑定图标
        this.ruleForm.icon = icon
        // 将数据和表单上的{{}}实现数据同时改变；
        this.ruleForm = Object.assign({}, this.ruleForm)
      } else {
        this.$message.error('文件上传失败')
      }
    },
    // 删除上传文件
    deleteuploadHandker() {}
  }
}
</script>

