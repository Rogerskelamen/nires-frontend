<template>
  <div id="admin">
    <!-- this is Admin page -->

    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">
        <i class="el-icon-s-home"></i>
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体内容 -->
    <el-card style="margin-top: 20px;">
      <div slot="header">
        <el-row style="display: flex;align-items: center;" :gutter="20">
          <el-col :span="12" :offset="0">
            <h3 id="title">账号管理</h3>
          </el-col>
          <el-col type="flex" align="right" :span="12" :offset="0">
            <el-button type="success" size="medium" @click="addAdmin">添加账号</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 账号展示 -->
      <el-row :gutter="20">
        <el-col :span="8" :offset="0">
          <el-card shadow="always" :body-style="{ padding: '20px' }">
            <el-descriptions title="老李" direction="vertical" :column="3">
              <el-descriptions-item label="真实姓名">aaa</el-descriptions-item>
              <el-descriptions-item label="基本操作">
                <!-- <el-tag size="small">更改</el-tag> -->
                <el-button type="primary" size="small" @click="changePwd()">修改密码</el-button>
              </el-descriptions-item>
              <el-descriptions-item label="危险区域">
                <el-button type="danger" size="small" @click="deleteAdmin()">删除账号</el-button>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-card shadow="always" :body-style="{ padding: '20px' }">
            <el-descriptions title="老李" direction="vertical" :column="3">
              <el-descriptions-item label="真实姓名">aaa</el-descriptions-item>
              <el-descriptions-item label="基本操作">
                <!-- <el-tag size="small">更改</el-tag> -->
                <el-button type="primary" size="small" @click="changePwd()">修改密码</el-button>
              </el-descriptions-item>
              <el-descriptions-item label="危险区域">
                <el-button type="danger" size="small" @click="deleteAdmin()">删除账号</el-button>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="8" :offset="0">
          <el-card shadow="always" :body-style="{ padding: '20px' }">
            <el-descriptions title="老李" direction="vertical" :column="3">
              <el-descriptions-item label="真实姓名">aaa</el-descriptions-item>
              <el-descriptions-item label="基本操作">
                <!-- <el-tag size="small">更改</el-tag> -->
                <el-button type="primary" size="small" @click="changePwd()">修改密码</el-button>
              </el-descriptions-item>
              <el-descriptions-item label="危险区域">
                <el-button type="danger" size="small" @click="deleteAdmin()">删除账号</el-button>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>

    </el-card>

    <el-dialog
      title="添加新管理员"
      :visible.sync="addAdminVisible"
      width="30%"
      :before-close="handleClose">
      <!-- <span>这是一段信息</span> -->
      <el-form :model="addForm" status-icon ref="addFormRef" :rules="addFormRule" label-width="80px" size="normal">
        <el-form-item label="账号名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="addForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input v-model="addForm.confirmPwd"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAdminVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAdminSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    const passwordCheck = (rule, value, callback) => {
      if (value !== this.addForm.password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }

    return {
      addAdminVisible: false,

      addForm: {
        username: '',
        realName: '',
        password: '',
        confirmPwd: ''
      },

      addFormRule: {
        username: [
          { required: true, message: '请输入账号名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: passwordCheck, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    addAdmin () {
      this.addForm = {
        username: '',
        realName: '',
        password: '',
        confirmPwd: ''
      }
      this.addAdminVisible = true
    },

    addAdminSubmit () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {

          this.addAdminVisible = false
        }
      })
    },

    changePwd () {

    },

    deleteAdmin () {

    },

    handleClose (done) {
      done()
    }
  }
}
</script>

<style lang="less" scoped>
#title {
  margin: 0;
}

// .el-form-item /deep/ label {
//   font-size: 18px;
// }
</style>
