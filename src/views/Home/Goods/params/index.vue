<template>
  <div class="params">
     <!-- 面包屑导航区域 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>参数列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片试图 -->
  <el-card>
    <!-- 警告区域 -->
    <el-alert show-icon title="注意: 只允许为第三级分类设置相关参数" type="warning" :closable="false">
  </el-alert>
  <!-- 选择商品分类区域 -->
  <el-row class="cat_opt">
    <el-col>
      <span>选择商品分类: </span>
      <!-- 选择商品分类的级联选择框 -->
     <el-cascader
     expand-trigger="hover"
    v-model="selectedCateKeys"
    :options="cates"
    :props="cateProps"
    @change="handleChange"></el-cascader>
    </el-col>
  </el-row>

  <!-- tab 页签区域 -->
   <el-tabs v-model="activeName" @tab-click="handleTabClick">
     <!-- 添加动态参数的面板 -->
    <el-tab-pane label="动态参数" name="many">
      <!-- 添加参数的按钮 -->
      <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
      <!-- 动态参数表格 -->
      <el-table :data="manyTableDate" border stripe>
        <!-- 展示列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handelClosed(index, scope.row)">{{item}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-tab-pane>
     <!-- 添加静态属性的面板 -->
    <el-tab-pane label="静态属性" name="only">
       <!-- 添加属性的按钮 -->
      <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
      <!-- 静态属性表格 -->
      <el-table :data="onlyTableDate" border stripe>
        <!-- 展示列 -->
       <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handelClosed(index, scope.row)">{{item}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-tab-pane>
  </el-tabs>
  </el-card>

  <!-- 添加参数的对话框 -->
  <el-dialog
    :title="'添加' + titleText "
    :visible.sync="addDialogVisible"
    width="50%"
    @close="addDialogClosed"
    >
    <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFormRef" label-width="100px" >
    <el-form-item :label="titleText" prop="attr_name">
      <el-input v-model="addCateForm.attr_name"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addParams">确 定</el-button>
    </span>
  </el-dialog>

  <!-- 修改参数的对话框 -->
  <el-dialog
    :title="'修改' + titleText "
    :visible.sync="editDialogVisible"
    width="50%"
    @close="editDialogClosed"
    >
    <el-form :model="editCateForm" :rules="editCateRules" ref="editCateFormRef" label-width="100px" >
    <el-form-item :label="titleText" prop="attr_name">
      <el-input v-model="editCateForm.attr_name"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editParams">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>
<script>
export default {
  data: () => ({
    // 商品分类列表
    cates: [],
    // 级联选择框的配置对象
    cateProps: {
      value: 'cat_id',
      label: 'cat_name',
      children: 'children'
    },
    // 级联选择框双向绑定到的数组
    selectedCateKeys: [],
    // 被激活的页签的名称
    activeName: 'many',
    // 动态参数的数据
    manyTableDate: [],
    // 静态属性的数据
    onlyTableDate: [],
    // 控制添加参数、添加属性对话框的显示与隐藏
    addDialogVisible: false,
    // 添加参数的表单数据对象
    addCateForm: {
      attr_name: ''
    },
    // 添加表单验证规则对象
    addCateRules: {
      attr_name: [
          { required: true, message: '请输入动态参数', trigger: 'blur' }
      ]
    },
    // 控制修改对话框的显示与隐藏
    editDialogVisible: false,
    // 修改参数的表单数据对象
    editCateForm: {
      attr_name: ''
    },
    // 修改表单验证规则对象
    editCateRules: {
      attr_name: [
         { required: true, message: '请输入动态参数', trigger: 'blur' }
      ]
    }
  }),
  created() {
    this.getCates()
  },
  methods: {
    async getCates() {
      const { data: { data, meta } } = await this.$http.get('categories')
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.cates = data
    },
     // 选择级联框选中项变化，会触发着个函数
    handleChange() {
      this.getParamsDate()
    },
    //  tab 页签点击事件的处理函数
    handleTabClick() {
      console.log(this.activeName)
      this.getParamsDate()
    },
    // 获取参数的列表数据
    async getParamsDate() {
      // 证明选择的不是三级分类
    if (this.selectedCateKeys.length !== 3) {
      this.selectedCateKeys = []
      this.manyTableDate = []
      this.onlyTableDate = []
      return
    }
    // 证明是三级分类
    console.log(this.selectedCateKeys)
    // 根据所选分类的id和当前所属的面板，获取对应的参数
    const { data: { data, meta } } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })

    if (meta.status !== 200) return this.$message.error(meta.msg)

    // console.log(data)
    data.forEach(item => {
      item.attr_vals = item.attr_vals
       ? item.attr_vals.split(' ') : []
      //  控制文本框的显示与隐藏
       item.inputVisible = false
      //  文本框中输入的值
       item.inputValue = ''
    })
    console.log(data)
    if (this.activeName === 'many') {
      this.manyTableDate = data
    } else {
      this.onlyTableDate = data
      }
    },
    // 监听对话框的关闭事件
    addDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
    },
    // 点击按钮， 添加参数
    addParams() {
       this.$refs.addCateFormRef.validate(async valid => {
        //  console.log(valid)
        if (!valid) return

        const { data: { meta } } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addCateForm.attr_name,
          attr_sel: this.activeName
        })

        if (meta.status !== 201) return this.$message.error(meta.msg)

        this.$message.success(meta.msg)
        this.getParamsDate()
        this.addDialogVisible = false
       })
    },
    // 点击按钮。展示编辑的对话框
      async showEditDialog(attrId) {
        // console.log(attr_id)
        // 查询当前参数的信息
        const { data: { data, meta } } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, {
          params: { attr_sel: this.activeName }
        })
        if (meta.status !== 200) return this.$message.error(meta.msg)
        this.editCateForm = data
        // console.log(this.editCateForm)
        this.editDialogVisible = true
      },
      // 监听修改对话框的关闭事件
      editDialogClosed() {
        this.$refs.editCateFormRef.resetFields()
      },
      // 点击按钮， 修改参数
      editParams() {
        this.$refs.editCateFormRef.validate(async valid => {
          if (!valid) return
          const { data: { meta } } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editCateForm.attr_id}`, {
            attr_name: this.editCateForm.attr_name,
            attr_sel: this.activeName
          })

          if (meta.status !== 200) return this.$message.error(meta.msg)

          this.$message.success(meta.msg)
          this.getParamsDate()
          this.editDialogVisible = false
        })
      },
      // 根据id删除对应的参数
     async removeParams(attrId) {
        try {
         await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const { data: { meta } } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)

        if (meta.status !== 200) return this.$message.error(meta.msg)

        this.$message.success(meta.msg)
        this.getParamsDate()
        } catch (err) {
          this.$message.info('已取消删除')
        }
      },
      // 文本框失去焦点或者按下enter键会触发的函数
       handleInputConfirm(row) {
        // console.log('ok')
        if (row.inputValue.trim().length === 0) {
          row.inputValue = ''
          row.inputVisible = false
          return
        }
        // 如果没有return 证明文本框有内容
        row.attr_vals.push(row.inputValue.trim())
          row.inputValue = ''
          row.inputVisible = false
          this.saveAttrVals(row)
    },
    async saveAttrVals(row) {
         // 发送请求
        const { data: { meta } } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join('')
        })
        if (meta.status !== 200) return this.$message.error(meta.msg)
        this.$message.success(meta.msg)
    },
    // 点击按钮，展示输入文本框
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获取焦点
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
    },
    handelClosed(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    }

  },
  computed: {
    // 如果按钮需要被禁用，则返回true， 否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中三级分类的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态计算标题文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
        return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
