<template>
   <div class="users">
     <!-- 面包屑导航区域 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片试图区域 -->
<el-card>
  <!-- 搜索 -->
  <el-row :gutter="20">
    <el-col :span='8'>
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsers">
        <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
  </el-input>
    </el-col>
    <!-- 添加 -->
    <el-col :span='4'>
      <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
    </el-col>
  </el-row>
  <!-- 用户列表区域 -->
  <el-table :data="users" border stripe>
    <el-table-column type="index"></el-table-column>
    <el-table-column label="姓名" prop="username"></el-table-column>
    <el-table-column label="邮箱" prop="email"></el-table-column>
    <el-table-column label="电话" prop="mobile"></el-table-column>
    <el-table-column label="角色" prop="role_name"></el-table-column>
    <el-table-column label="状态" prop="mg_state">
      <!-- 使用作用域插槽的方式传递数据给父组件，然后通过父组件控制子组件 -->
      <template slot-scope="scope">
        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作"  width="173px">
      <template slot-scope="scope">
        <!-- 修改按钮 -->
        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
        <!-- 删除按钮 -->
        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        <!-- 分配角色按钮 -->
        <el-tooltip class="item" content="分配角色" placement="top" :enterable="false">
          <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页区域 -->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<!-- 添加用户对话框 -->
<el-dialog
  title="添加用户"
  width="50%"
  :visible.sync="addDialogVisible" @close="clearDialogVisible">
  <!-- 对话框主体内容区域 -->
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机号" prop="mobile">
    <el-input v-model="addForm.mobile" maxlength="11"></el-input>
  </el-form-item>
  </el-form>
  <!-- 对话框底步区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUsers">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      users: [],
    total: 0,
    // 获取用户列表的参数对象
    queryInfo: {
      query: '',
      pagenum: 1,
      pagesize: 2
    },
    addDialogVisible: false,
    addForm: {
      username: '',
      password: '',
      email: '',
      mobile: ''
    },
    addFormRules: {
       username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
       ],
       password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
       ],
       email: [
         { required: true, message: '请输入邮箱', trigger: 'blur' },
         { validator: checkEmail, trigger: 'blur' }
       ],
       mobile: [
         { required: true, message: '请输入手机号', trigger: 'blur' },
         { validator: checkMobile, trigger: 'blur' }
       ]
      }
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
   async getUsers() {
      const { data: { data, meta } } = await this.$http.get('users', { params: this.queryInfo })
      console.log(data)
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.users = data.users
      this.total = data.total
    },
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUsers()
    },
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagesize = newPage
      this.getUsers()
    },
    // 修改状态
   async userStateChange(userinfo) {
      // console.log(userinfo)
      const { data: { meta } } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error(meta.msg)
      }
      this.$message.success(meta.msg)
    },
    // 点击关闭按钮重置表单
    clearDialogVisible() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUsers() {
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 可以发起用户添加的网络请求
       const { data: { data, meta } } = await this.$http.post('users', this.addForm)
       console.log(data)
       if (meta.status !== 201) return this.$message.error(meta.msg)
        this.$message.success(meta.msg)
        this.addDialogVisible = false
        this.getUsers()
      })
    }
  }
 }
</script>
<style >
</style>
