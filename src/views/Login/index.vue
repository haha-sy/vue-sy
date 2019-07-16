<template>
<div class="login-container">
  <div class="login-box">
    <div class="avatar-box">
      <img src="./logo.png" alt="">
    </div>
    <div class="form-box">
      <el-form label-width="0px" :model="loginFrom" :rules="loginRules" ref="loginRef">
      <el-form-item prop="username">
      <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-user"></el-input>
      </el-form-item>
      <el-form-item prop="password">
      <el-input v-model="loginFrom.password" prefix-icon="iconfont icon-3702mima"></el-input>
      </el-form-item>
      <el-form-item class="btn-box">
        <el-button type="primary">登录</el-button>
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
    loginReset () {
      // console.log(this)
      this.$refs.loginRef.resetFields()
      this.loginFrom.username = this.loginFrom.password = ''
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
