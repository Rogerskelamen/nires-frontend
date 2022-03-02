<template>
  <div>
    <!-- this is interview handle page -->

    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">
        <i class="el-icon-s-home"></i>
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>招聘管理</el-breadcrumb-item>
      <el-breadcrumb-item>面试处理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 面试记录 -->
    <el-card class="interview-record" shadow="always" style="margin-top: 20px;">
      <div class="tip">
        现在还有<el-tag type="primary" size="mini">{{ interviewAssess.length }}</el-tag>条数据需要处理
        <span v-show="interviewAssess.length === 0">Well Done!</span>
      </div>
      <!-- card body -->
      <!-- 计划数据展示 -->
      <el-row :gutter="20">
        <el-col :span="12" v-for="(item, index) in interviewAssess" :key="index">
          <el-card shadow="always" style="margin-bottom: 15px;">
            <el-descriptions direction="vertical" :column="4" border>
              <el-descriptions-item label="面试人">{{ item.interviewee }}</el-descriptions-item>
              <el-descriptions-item label="面试官">{{ item.interviewer }}</el-descriptions-item>
              <el-descriptions-item label="意向部门">{{ item.department }}</el-descriptions-item>
              <el-descriptions-item label="意向岗位">{{ item.position }}</el-descriptions-item>
              <el-descriptions-item label="时间">
                {{ toTimeString(item.date) }}
              </el-descriptions-item>
              <el-descriptions-item label="联系方式" :span="2">
                <el-tag size="small">tel</el-tag>
                {{ item.contact }}
              </el-descriptions-item>
              <el-descriptions-item label="操作">
                <el-tooltip content="录用" placement="top">
                  <el-button type="success" size="small" @click="hirePerson(item)">hire</el-button>
                </el-tooltip>
                <el-tooltip content="未通过" placement="top">
                  <el-button type="danger" size="small" @click="passPerson(item.id)">pass</el-button>
                </el-tooltip>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加员工信息 -->
    <el-dialog
      title="员工信息入档"
      :visible.sync="addEmpVisible"
      width="30%"
      :before-close="handleClose">
      <!-- <div></div> -->
      <el-form :model="addEmpForm" status-icon ref="addEmpFormRef" :rules="addEmpRule" label-width="80px" size="normal">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addEmpForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="addEmpForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            v-model="addEmpForm.birthday"
            type="date"
            placeholder="选择出生日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="薪水加成" prop="alterSalary">
          <el-input v-model.number="addEmpForm.alterSalary"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="addEmpForm.contact"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addEmpVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEmpSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { toTimeString } from '@/utils/time.js'

export default {
  data () {
    // 验证手机号格式
    const checkPhone = (rule, value, callback) => {
      const regPhone = /^[1][3,4,5,7,8][0-9]{9}$/

      if (regPhone.test(value)) {
        return callback()
      }

      callback(new Error('请输入正确的手机号格式'))
    }

    return {
      interviewAssess: [],

      addEmpRule: {
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        birthday: [
          { type: 'date', required: true, message: '请选择生日', trigger: 'blur' }
        ],
        alterSalary: [
          { required: true, message: '请定义加成薪水', trigger: 'blur' },
          { type: 'number', message: '薪水加成必须为数字值(单位元)' }
        ],
        contact: [
          { required: true, message: '请输入联系方式(手机号)', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },

      addEmpForm: {},

      addEmpVisible: false
    }
  },

  created () {
    this.getAllInterviews()
  },

  methods: {
    async getAllInterviews () {
      const { data: res } = await this.$http.get(`interviews/assess`)
      if (!res.success) return this.$message.error(res.msg)
      this.interviewAssess = res.data
      console.log(res)
    },

    hirePerson (interview) {
      this.addEmpForm = {
        interviewId: interview.id,
        name: interview.interviewee,
        gender: 1,
        birthday: 0,
        alterSalary: 0,
        contact: interview.contact
      }
      this.addEmpVisible = true
    },

    async addEmpSubmit () {
      console.log(this.addEmpForm.birthday.getTime())
      const { data: res } = await this.$http.post(
        `staff/interview`,
        {
          interviewId: this.addEmpForm.interviewId,
          name: this.addEmpForm.name,
          gender: this.addEmpForm.gender,
          birthday: this.addEmpForm.birthday.getTime(),
          alterSalary: this.addEmpForm.alterSalary,
          contact: this.addEmpForm.contact
        }
      )
      if (!res.success) return this.$message.error(res.msg)
      const { data: res2 } = await this.$http.get(`interviews/pass/${this.addEmpForm.interviewId}/1`)
      if (!res2.success) return this.$message.error(res2.msg)
      // console.log('id = ' + res.data)
      this.$message.success('已录用该员工')
      this.addEmpVisible = false
      this.getAllInterviews()
    },

    passPerson (id) {
      this.$confirm('此操作将不再录用该应聘人员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.get(`interviews/pass/${id}/2`)
        if (!res.success) return this.$message.error(res.msg)
        // console.log('id = ' + res.data)
        this.$message.success('已设为不通过')
        this.getAllInterviews()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    handleClose (done) {
      done()
    },

    toTimeString (time) {
      return toTimeString(time)
    }
  }
}
</script>

<style lang="less" scoped>
.tip {
  font-size: 20px;
  margin-bottom: 12px;
  font-style: italic;
}
</style>
