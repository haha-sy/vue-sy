<template>
  <div class="roles">
      <!-- 面包屑导航区域 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
        <el-table :data="roles" border stripe>
          <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['bdborder','vcenter', {btborder: i1===0}]">
                  <el-col :span="5">
                    <el-tag  closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="['vcenter',{btborder: i2 !== 0}]">
                      <el-col :span="6">
                        <el-tag type="success"  closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                         <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="18">
                        <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="290px">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
              </template>
            </el-table-column>
        </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRIghtDialogVisible"
      width="50%"
      @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRIghtDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data: () => ({
    roles: [],
    // 控制分配权限的显示与隐藏
    setRIghtDialogVisible: false,
    // 所有权限的数据
    rightslist: [],
    // 树形控件的绑定对象
    treeProps: {
      label: 'authName',
      children: 'children'
    },
    // 默认选中的节点ID值数组
    defKeys: [],
    // 当前即将分配权限的角色id
    roleId: ''
  }),
  created() {
    this.getRoles()
  },
  methods: {
    // 获取所有角色列表
    async getRoles() {
      const { data: { data, meta } } = await this.$http.get('roles')
      if (meta.status !== 200) return this.$messapxge.error(meta.msg)
      this.roles = data
      // console.log(this.roles)
    },
  // 根据ID删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提醒用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('取消了删除！')
        }

       const { data: { data, meta } } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

       if (meta.status !== 200) return this.$message.error(meta.msg)

       role.children = data
    },
    // 展示分配权限的对话框
    async showSetRightDialog (role) {
      this.roleId = role.id
    // 获取所有权限的数据
      const { data: { data, meta } } = await this.$http.get('rights/tree')
      if (meta.status !== 200) return this.$message.error(meta.msg)

      this.rightslist = data
      // console.log(this.rightslist)
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)

      this.setRIghtDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defkeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children属性， 则属于三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击权限分配角色
     async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idStr = keys.join(',')

      const { data: { data, meta } } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })

      if (meta.status !== 200) return this.$message.error(meta.msg)

      this.$message.success(meta.msg)
      this.getRoles()
      this.setRIghtDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 8px;
}
.bdborder {
  border-bottom: 1px solid #eee;
}
.btborder {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
