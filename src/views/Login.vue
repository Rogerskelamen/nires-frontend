<template>
  <div id="login">
    <!-- this is login page -->
    <h2 style="font-size: 28px;">Sign in to Nires</h2>

    <el-card>
      <el-form
        :model="loginForm"
        ref="loginFormRef"
        label-width="180px"
        :inline="false"
        label-position="top"
        size="large">
        <el-form-item label="您的账号" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="您的密码" prop="password">
          <el-input v-model="loginForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <ul class="bottom-bar">
      <li>
        <span>Focus my <a target="_blank" href="https://rokelamen.top">Blog</a></span>
      </li>
      <li>
        <span>Star me on <a target="_blank" href="https://github.com/Rogerskelamen/nires-frontend">GitHub</a></span>
      </li>
    </ul>

    <!-- 滑动验证 -->
    <div v-show="verifyVisible" id="modal-overlay">
      <slider-verify class="verify"
        :is-show-self.sync="isShowSelf"
        @close="closeVerify"
        @success="loginSubmit"
      ></slider-verify>
    </div>
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

      verifyVisible: false,
      isShowSelf: false
    }
  },

  methods: {
    login () {
      // 如果两者任一为空，则不能登录
      if (this.loginForm.username === '' || this.loginForm.password === '') {
        return this.$message.error('请输入账号和密码')
      }
      this.isShowSelf = true
      this.verifyVisible = true
    },

    loginSubmit () {
      // 延迟0.5s再登录
      setTimeout(async () => {
        const { data: res } = await this.$http.post(
          `login`,
          this.loginForm
        )
        if (!res.success) {
          this.verifyVisible = false
          return this.$message.error(res.msg)
        }
        window.sessionStorage.setItem('token', res.data.token)
        window.sessionStorage.setItem('admin', res.data.realName)
        this.$message.success('登录成功')
        this.$router.push('/home')
      }, 500)
    },

    resetForm () {
      this.$refs.loginFormRef.resetFields()
    },

    closeVerify () {
      this.verifyVisible = false
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

  #modal-overlay {
    position: absolute;
    left: 0px;  /*如果 left和top不设置为0，边框会有白边 */
    top: 0px;
    width: 100%;
    height: 100%;
    text-align: center;
    z-index: 1000;
    background-color: rgba(51, 51, 51, 0.5);

    .verify /deep/ #slider-verify {
      margin: 160px auto;
      background-color: #fff;
    }
  }
}
</style>
