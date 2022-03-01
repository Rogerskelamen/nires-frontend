<template>
  <div>
    <!-- this is department page -->

    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">
        <i class="el-icon-s-home"></i>
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>人事管理</el-breadcrumb-item>
      <el-breadcrumb-item>部门管理</el-breadcrumb-item>
    </el-breadcrumb>

    <p class="text-add">
      立即新建一个部门?
      <el-button type="success" size="large" @click="addDepartment">Click Me</el-button>
    </p>

  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },

  methods: {
    addDepartment () {
      this.$prompt('请输入部门名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '请输入部门名称'
      }).then(async value => {

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消添加'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.text-add {
  font-size: 20px;

  .el-button {
    padding: 5px;
    font-size: 18px;
  }
}
</style>
