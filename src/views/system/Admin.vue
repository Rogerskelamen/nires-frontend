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
            <el-button type="success" class="shadow" size="medium" @click="addAdmin">添加账号</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 账号展示 -->
      <el-row :gutter="20">
        <el-col :span="8" :offset="0" v-for="(item, index) in adminList" :key="index">
          <el-card shadow="always" style="margin-bottom: 15px;" :body-style="{ padding: '20px' }">
            <el-descriptions :title="item.username" direction="vertical" :column="3">
              <el-descriptions-item label="真实姓名">{{ item.realName }}</el-descriptions-item>
              <el-descriptions-item label="基本操作">
                <el-button type="primary" size="small" @click="changePwd(item.id)">修改密码</el-button>
              </el-descriptions-item>
              <el-descriptions-item label="危险区域">
                <el-button type="danger" size="small" @click="deleteAdmin(item.id)">删除账号</el-button>
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

      <el-form :model="addForm" status-icon ref="addFormRef" :rules="addFormRule" label-width="80px" size="normal">
        <el-form-item label="账号名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="addForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input show-password v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input show-password v-model="addForm.confirmPwd"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAdminVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAdminSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改密码"
      :visible.sync="changePwdVisible"
      width="30%"
      :before-close="handleClose">

      <el-form :model="changePwdForm" status-icon ref="changePwdFormRef" :rules="changePwdFormRule" label-width="80px" size="normal">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input show-password v-model="changePwdForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input show-password v-model="changePwdForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input show-password v-model="changePwdForm.confirmPwd"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="changePwdVisible = false">取 消</el-button>
        <el-button type="primary" @click="changePwdSubmit">确 定</el-button>
      </div>
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

    const changePwdCheck = (rule, value, callback) => {
      if (value !== this.changePwdForm.newPassword) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }

    return {
      // 管理员列表
      adminList: [],

      addAdminVisible: false,
      changePwdVisible: false,

      addForm: {
        username: '',
        realName: '',
        password: '',
        confirmPwd: ''
      },

      addFormRule: {
        username: [
          { required: true, message: '请输入账号名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度需大于6位', trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: passwordCheck, trigger: 'blur' }
        ]
      },

      changePwdForm: {
        id: '',
        oldPassword: '',
        newPassword: '',
        confirmPwd: ''
      },

      changePwdFormRule: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度需大于6位', trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: changePwdCheck, trigger: 'blur' }
        ]
      }
    }
  },

  created () {
    this.getAllAdmin()
  },

  methods: {
    async getAllAdmin () {
      const { data: res } = await this.$http.get(`admins`)
      console.log(res)
      if (!res.success) return this.$message.error(res.msg)
      this.adminList = res.data
    },

    addAdmin () {
      this.addForm = {
        username: '',
        realName: '',
        password: '',
        confirmPwd: ''
      }
      this.addAdminVisible = true
    },

    // 提交添加用户表单
    addAdminSubmit () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post(
            `admins/add`,
            {
              username: this.addForm.username,
              realName: this.addForm.realName,
              password: this.addForm.password
            }
          )
          if (!res.success) return this.$message.error(res.msg)
          console.log('id = ' + res.data)
          this.$message.success('添加账号成功')
          this.addAdminVisible = false
          this.getAllAdmin()
        }
      })
    },

    // 修改密码
    changePwd (id) {
      this.changePwdForm = {
        id: id,
        oldPassword: '',
        newPassword: '',
        confirmPwd: ''
      }
      this.changePwdVisible = true
    },

    // 修改密码提交
    changePwdSubmit () {
      this.$refs.changePwdFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post(
            `admins/pwd`,
            {
              id: this.changePwdForm.id,
              oldPassword: this.changePwdForm.oldPassword,
              newPassword: this.changePwdForm.newPassword
            }
          )
          if (!res.success) return this.$message.error(res.msg)
          console.log('id = ' + res.data)
          this.$message.success('修改密码成功')
          this.changePwdVisible = false
        }
      })
    },

    // 删除账号
    deleteAdmin (id) {
      this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (this.adminList.length <= 1) return this.$message.error('您不能删除最后一个管理员账号')
        const { data: res } = await this.$http.get(`admins/delete/${id}`)
        if (!res.success) return this.$message.error(res.msg)
        console.log('id = ' + res.data)
        this.$message.success('已删除该账号')
        this.getAllAdmin()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
</style>
