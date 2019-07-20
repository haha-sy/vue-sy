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
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
        <!-- 删除按钮 -->
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
        <!-- 分配角色按钮 -->
        <el-tooltip class="item" content="分配角色" placement="top" :enterable="false">
          <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
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
  :visible.sync="addDialogVisible" @close="clearDialogClosed">
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

<!-- 编辑用户对话框 -->
<el-dialog
  title="编辑用户"
  width="50%"
  :visible.sync="editDialogVisible" @close="editDialogClosed" >
  <!-- 对话框主体内容区域 -->
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机号" prop="mobile">
    <el-input v-model="editForm.mobile" maxlength="11"></el-input>
  </el-form-item>
  </el-form>
  <!-- 对话框底步区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUsers">确 定</el-button>
  </span>
</el-dialog>

<!-- 分配角色的对话框 -->
  <el-dialog
    title="分配角色"
    :visible.sync="setRoleDialogVisible"
    width="50%"
    @close="setRoleDialogClosed">
    <div>
      <p>当前的用户: {{userInfo.username}}</p>
      <p>当前的角色: {{userInfo.role_name}}</p>
      <p>分配新角色:
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="setRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
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
    // 控制添加用户对话框的显示与隐藏
    addDialogVisible: false,
    // 控制编辑用户对话框的显示与隐藏
    editDialogVisible: false,
    // 添加用户表单数据
    addForm: {
      username: '',
      password: '',
      email: '',
      mobile: ''
    },
    // 查询到用户的信息对象
    editForm: {

    },
  // 添加用户表单的验证规则对象
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
      },
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
         { required: true, message: '请输入邮箱', trigger: 'blur' },
         { validator: checkEmail, trigger: 'blur' }
       ],
       mobile: [
         { required: true, message: '请输入手机号', trigger: 'blur' },
         { validator: checkMobile, trigger: 'blur' }
       ]
      },
      // 分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的额角色id值
      selectedRoleId: ''
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
    // 点击关闭按钮重置添加表单
    clearDialogClosed() {
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
    },
    // 展示编辑用户的对话框
   async showEditDialog(id) {
      const { data: { data, meta } } = await this.$http.get('users/' + id)
      console.log(data)
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.editForm = data
      this.editDialogVisible = true
    },
    // 点击关闭按钮重置编辑表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    editUsers() {
        this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: { data, meta } } = await this.$http.put('users/' + this.editForm.id, this.editForm)
        console.log(data)
        if (meta.status !== 200) return this.$message.error(meta.msg)
        this.$message.success(meta.msg)
        this.editDialogVisible = false
        this.getUsers()
      })
    },
    // 根据id删除对应的用户信息
   async removeUserById(id) {
      try {
        await this.$confirm('此操作将永久删除用户名, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const { data: { data, meta } } = await this.$http.delete('users/' + id)
        console.log(data)
        if (meta.status !== 200) return this.$message.error(meta.msg)
        this.$message.success(meta.msg)
        this.getUsers()
      } catch (err) {
        this.$message.info('已取消删除')
      }
    },
    // 展示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo

      // 在展示对话框之前获取所有的角色列表
      const { data: { data, meta } } = await this.$http.get('roles')
      if (meta.status !== 200) return this.$message.error(meta.msg)

      this.rolesList = data
      console.log(this.rolesList)
      this.setRoleDialogVisible = true
    },
    // 点击确定，分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }

      const { data: { data, meta } } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })

      if (meta.status !== 200) return this.$message.error(meta.msg)

      this.$message.success(meta.msg)
      this.getUsers()
      this.setRoleDialogVisible = false
    },
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
 }
</script>
<style >
</style>
