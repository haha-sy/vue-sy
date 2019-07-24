<template>
  <div class="categories">
       <!-- 面包屑导航区域 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片试图区域 -->
  <el-card>
    <!-- 按钮区域 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="showAddDialog">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <tree-table
    class="treeTable"
    :data="categoriesList"
    :columns="columns"
    :selection-type="false"
    :expand-type="false"
    show-index
    index-text="#"
    border
    :show-row-hover="false"
    >
    <!-- 是否有效 -->
    <template slot="isOk" slot-scope="scope">
      <i class="el-icon-success" style="color: lightgreen" v-if="scope.row.cat_deleted === false"></i>
      <i class="el-icon-error" style="color: red" v-else></i>
    </template>
    <!-- 排序 -->
    <template slot="order" slot-scope="scope">
      <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
      <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
      <el-tag type="warning" size="mini" v-else>三级</el-tag>
    </template>
    <!-- 操作 -->
    <template slot="opt" slot-scope="scope">
      <el-button type="primary" icon="el-icon-edit" size="mini"
      @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cat_id)">删除</el-button>
    </template>
    </tree-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>

  <!-- 添加分类的对话框 -->
  <el-dialog
    title="添加分类"
    :visible.sync="addCateDialogVisible"
    width="50%"
    @close="addCateDialogClosed"
    >
    <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFormRef" label-width="80px">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类">
    <el-cascader
    expand-trigger="hover"
    v-model="selectedKeys"
    :options="parantCateList"
    :props="cascaderProps"
    @change="parentCateChanged"
    clearable
    ></el-cascader>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addCateDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addCate">确 定</el-button>
    </span>
  </el-dialog>

  <!-- 编辑分类的对话框 -->
  <el-dialog
    title="修改分类"
    :visible.sync="editCateDialogVisible"
    width="50%"
    @close="editCateDialogClosed"
    >
   <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="editForm.cat_name"></el-input>
  </el-form-item>
   </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editCateDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editCate">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>
<script>
export default {
  data: () => ({
    // 查询条件
    queryInfo: {
      type: 3,
      pagenum: 1,
      pagesize: 5
    },
    // 商品分类的数据列表，默认为空
    categoriesList: [],
    // 总数据总条数
    total: 0,
    columns: [
      // 为table指定列的定义
      {
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        // 表示将当前定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'isOk'

      },
      {
        label: '排序',
        // 表示将当前定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'order'

      },
      {
        label: '操作',
        // 表示将当前定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'opt'
      }
    ],
    // 控制添加分类的显示与隐藏
    addCateDialogVisible: false,
    // 添加分类表单的数据对象
    addCateForm: {
      // 将要添加的分类名称
      cat_name: '',
      // 父级分类的id
      cat_pid: 0,
      // 分类的等级，默认要添加的就是一级分类
      cat_level: 0
    },
    // 添加分类表单的验证规则对象
    addCateRules: {
      cat_name: [
         { required: true, message: '请输入分类名称', trigger: 'blur' }
      ]
    },
    // 父级分类的列表
    parantCateList: [],
    // 指定级联选择器的配置对象
    cascaderProps: {
      value: 'cat_id',
      label: 'cat_name',
      children: 'children'
    },
    // 选中的父级分类的id数组
    selectedKeys: [],
    // 控制编辑对话框的展示与隐藏
    editCateDialogVisible: false,
    // 编辑分类表单的数据对象
    editForm: {
      cat_id: '',
      cat_name: ''
    },
    // 编辑分类的表单验证规则
    editFormRules: {
      cat_name: [
      { required: true, message: '请输入分类名称', trigger: 'blur' }
      ]
    }

  }),
  created() {
    this.getCategories()
  },
  methods: {
    // 获取商品分类的数据
    async getCategories() {
      const { data: { data, meta } } = await this.$http.get('categories', { params: this.queryInfo })
      if (meta.status !== 200) return this.$message.error(meta.msg)
      console.log(data)
      this.categoriesList = data.result
      this.total = data.total
    },
    // 监听 pagesize 的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCategories()
    },
    // 监听 pagenum 的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCategories()
    },
    // 点击按钮，展示添加分类的对话框
    showAddDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 再展示出对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: { data, meta } } = await this.$http.get('categories', { params: { type: 2 } })
      if (meta.status !== 200) return this.$message.error(meta.msg)
      // console.log(data)
      this.parantCateList = data
      console.log(this.parantCateList)
    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      console.log(this.selectedKeys)
      // 如果 selectedkeys 数组中的 length > 0, 就证明选中了父级分类， 反之， 就没有选中父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的 id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return false
      } else {
         // 父级分类的 id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击分类，添加新的分类
    addCate() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: { meta } } = await this.$http.post('categories', this.addCateForm)
        if (meta.status !== 201) return this.$message.error(meta.msg)
        this.$message.success(meta.msg)
        this.getCategories()
        this.addCateDialogVisible = false
      })
    },
    // 监听添加分类对话框的关闭事件，点击取消，重置表单
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
     },
    //  展示编辑对话框
    async showEditDialog(catId) {
      // console.log(catId)
      const { data: { data, meta } } = await this.$http.get('categories/' + catId)
      console.log(data)
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.editForm = data
      this.editCateDialogVisible = true
    },
    // 监听编辑对话框的关闭事件，点击取消，重置表单
    editCateDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，修改分类
    editCate() {
       this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: { meta } } = await this.$http.put(`categories/${this.editForm.cat_id}`, { cat_name: this.editForm.cat_name })
        if (meta.status !== 200) return this.$message.error(meta.msg)
        this.$message.success(meta.msg)
        this.getCategories()
        this.editCateDialogVisible = false
      })
    },
    // 点击删除按钮事件
    async removeCate(catId) {
      try {
        await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const { data: { meta } } = await this.$http.delete('categories/' + catId)
        if (meta.status !== 200) return this.$message.error(meta.msg)
        this.$message.success(meta.msg)
        this.getCategories()
      } catch (err) {
        this.$message.info('已取消删除')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.treeTable {
  margin: 15px 0;
}

.el-cascader {
  width: 100%;
}
</style>
