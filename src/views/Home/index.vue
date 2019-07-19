<template>
<el-container class="home">
  <!-- 头部区域 -->
  <el-header>
    <div>
      <img src="./heima.png" alt="">
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="loginout">退出</el-button>
  </el-header>
  <!-- 页面主体内容区域 -->
  <el-container>
    <!-- 左侧边栏 -->
    <el-aside :width="width">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409fff"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      :default-active="activePath"
      >
      <el-submenu :index="menu.id+''" v-for="menu in menus" :key="menu.id">
        <!-- 一级菜单 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="icons[menu.id]"></i>
          <!-- 文字 -->
          <span>{{menu.authName}}</span>
        </template>
       <el-menu-item :index="'/'+subMenu.path" v-for="subMenu in menu.children" :key="subMenu.id" @click="saveNavState('/'+subMenu.path)">
         <!-- 二级菜单 -->
         <template slot="title">
           <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文字 -->
          <span>{{subMenu.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <!--右侧内容主体区域 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>
<script>
export default {
  data: () => ({
    // 左侧菜单数据
    menus: [],
    // 一级菜单的图标
    icons: {
      '125': 'iconfont icon-users',
      '103': 'iconfont icon-tijikongjian',
      '101': 'iconfont icon-shangpin',
      '102': 'iconfont icon-danju',
      '145': 'iconfont icon-baobiao'
    },
    // 是否折叠
    isCollapse: false,
    // 被激活的链接地址
    activePath: ''
  }),
  created () {
    this.getMenus()
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods: {
    // 点击退出按钮删除token值并且返回到登录页面
    loginout () {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenus () {
      const { data: { data, meta } } = await this.$http.get('menus')
      if (meta.status !== 200) return this.$message.error('meta.msg')
      // console.log(data)
      this.menus = data
    },
    // 点击按钮，切换菜单的折叠与打开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
  // 保存链接的激活状态
    saveNavState(activePath) {
      // console.log(activePath)
      sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
  // 点击左侧边栏宽度的变化
  computed: {
    width () {
      return this.isCollapse ? '64px' : '200px'
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .toggle-button {
      background-color: #4a5064;
      font-size: 10px;
      text-align: center;
      line-height: 24px;
      color: #fff;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
    .iconfont {
      margin-right: 10px;
    }
    .el-menu {
      border-right: 0;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
