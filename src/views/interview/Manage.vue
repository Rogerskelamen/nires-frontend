<template>
  <div>
    <!-- this is interview manage page -->

    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">
        <i class="el-icon-s-home"></i>
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>招聘管理</el-breadcrumb-item>
      <el-breadcrumb-item>面试管理</el-breadcrumb-item>
    </el-breadcrumb>

    <p class="text-add">
      快速创建一个面试?
      <el-button type="success" size="large" @click="addInterview">Click Me</el-button>
    </p>

    <el-dialog
      title="添加面试"
      :visible.sync="addInterviewVisible"
      width="30%"
      :before-close="handleClose">
      <!-- <span></span> -->
      <el-form :model="addInterviewForm" status-icon ref="addInterviewFormRef" :rules="addFormRule" label-width="80px" size="normal">
        <el-form-item label="待面试人" prop="interviewee">
          <el-input v-model="addInterviewForm.interviewee"></el-input>
        </el-form-item>
        <el-form-item label="面试官" prop="interviewer">
          <el-input v-model="addInterviewForm.interviewer"></el-input>
        </el-form-item>
        <el-form-item label="面试时间" prop="date">
          <el-date-picker
            v-model="addInterviewForm.date"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="意向部门" prop="department">
          <el-input v-model="addInterviewForm.department"></el-input>
        </el-form-item>
        <el-form-item label="意向岗位" prop="position">
          <el-input v-model="addInterviewForm.position"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="addInterviewForm.contact"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addInterviewVisible = false">取 消</el-button>
        <el-button type="primary" @click="addInterviewSubmit">确 认</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
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
      addInterviewForm: {
        interviewee: '',
        interviewer: '',
        date: '',
        department: '',
        position: '',
        contact: ''
      },

      addFormRule: {
        interviewee: [
          { required: true, message: '请输入待面试人', trigger: 'blur' }
        ],
        interviewer: [
          { required: true, message: '请输入面试官', trigger: 'blur' }
        ],
        date: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入意向部门', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '请输入意向岗位', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系方式(手机号)', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },

      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }]
      },

      addInterviewVisible: false
    }
  },

  methods: {
    addInterview () {
      this.addInterviewVisible = true
      this.addInterviewForm = {
        interviewee: '',
        interviewer: '',
        date: '',
        department: '',
        position: '',
        contact: ''
      }
    },

    addInterviewSubmit () {
      // console.log(this.addInterviewForm)
      // console.log(this.addInterviewForm.date.getTime())
      this.$refs.addInterviewFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            `interviews/add`,
            {
              interviewee: this.addInterviewForm.interviewee,
              interviewer: this.addInterviewForm.interviewer,
              date: this.addInterviewForm.date.getTime(),
              department: this.addInterviewForm.department,
              position: this.addInterviewForm.position,
              contact: this.addInterviewForm.contact
            }
          )
          if (!res.success) return this.$message.error(res.msg)
          console.log('id = ' + res.data)
          this.$message.success('添加成功')
          this.addInterviewVisible = false
        }
      })
    },

    handleClose (done) {
      done()
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
