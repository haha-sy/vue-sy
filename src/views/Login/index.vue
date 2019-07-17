<template>
<div class="login-container">
  <div class="login-box">
    <!-- 登录头像区域 -->
    <div class="avatar-box">
      <img src="./logo.png" alt="">
    </div>
    <!-- 登录表单区域 -->
    <div class="form-box">
      <el-form label-width="0px" :model="loginFrom" :rules="loginRules" ref="loginRef">
        <!-- 用户名 -->
      <el-form-item prop="username">
      <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-user"></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
      <el-input v-model="loginFrom.password" prefix-icon="iconfont icon-3702mima"></el-input>
      </el-form-item>
      <!-- 按钮区域 -->
      <el-form-item class="btn-box">
        <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="loginReset">重置</el-button>
      </el-form-item>
      </el-form>
    </div>
  </div>
</div>
</template>
<script>
export default {
  data: () => ({
    loginFrom: {
      username: 'admin',
      password: '123456'
    },
    loginRules: {
      username: [
        { required: true, message: '请输入登录名称', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur' }
      ]
    }
  }),
  methods: {
    // 点击重置按钮，重置登录表单
    loginReset () {
      // console.log(this)
      this.$refs.loginRef.resetFields()
      this.loginFrom.username = this.loginFrom.password = ''
    },

    login () {
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return
        const { data: { data, meta } } = await this.$http.post('login', this.loginFrom)
        // console.log(data)
        if (meta.status !== 200) return this.$message.error('登录错误')
        this.$message.success('登录成功')
        sessionStorage.setItem('token', data.token)
        this.$router.push('/Home')
      })
    }
  }
}
</script>
<style lang= "less" scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;
  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .avatar-box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .form-box {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .btn-box {
        text-align: right;
      }
    }
  }
}
</style>
