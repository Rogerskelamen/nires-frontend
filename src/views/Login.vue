<template>
  <div id="login">
    <!-- this is login page -->
    <h2 style="font-size: 28px;">Sign in to Nires</h2>

    <el-card>
      <el-form
        :model="loginForm"
        ref="loginFormRef"
        :rules="loginFormRule"
        label-width="180px"
        :inline="false"
        label-position="top"
        size="large">
        <el-form-item label="您的账号" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="您的密码" prop="username">
          <el-input v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <ul class="bottom-bar">
      <li>
        <span>Focus my <a href="https://rokelamen.top">Blog</a></span>
      </li>
      <li>
        <span>Star me on <a href="https://github.com/Rogerskelamen/nires-frontend">GitHub</a></span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },

      // 表单验证规则
      loginFormRule: {

      }
    }
  },
  methods: {
    login () {
      this.$router.push('/home')
    }
  }
}
</script>

<style lang="less" scoped>
#login {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background: linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('https://gitee.com/rogerskelamen/mdpic/raw/master/img/txrpic-10556739.png');
  background-repeat: no-repeat;
  background-size: cover;

  .el-card {
    padding: 10px;
    width: 360px;
  }

  .el-form-item /deep/ label {
    font-size: 18px;
  }

  .bottom-bar {
    margin-top: 100px;
    display: flex;
    width: 300px;
    justify-content: space-around;
  }
}
</style>
