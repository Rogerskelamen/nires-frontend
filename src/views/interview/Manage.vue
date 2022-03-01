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

    <!-- 面试计划 -->
    <el-card class="interview-plan" shadow="always">
      <div slot="header">
        <span>面试计划</span>
        <el-link type="primary">More<i class="el-icon-view el-icon--right"></i></el-link>
      </div>
      <!-- card body -->
      <!-- 计划数据展示 -->
      <el-row :gutter="20">
        <el-col :span="12" v-for="(item, index) in interviewPlans" :key="index">
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
                <el-tooltip content="编辑" placement="top">
                  <el-button type="primary" size="small" icon="el-icon-edit" @click="editPlan(item)"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button type="danger" size="small" icon="el-icon-delete" @click="deletePlan(item.id)"></el-button>
                </el-tooltip>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-divider></el-divider>

    <!-- 面试记录 -->
    <el-card class="interview-record" shadow="always">
      <div slot="header">
        <span>面试记录</span>
        <el-link type="primary">More<i class="el-icon-view el-icon--right"></i></el-link>
      </div>
      <!-- card body -->
      <!-- 计划数据展示 -->
      <el-row :gutter="20">
        <el-col :span="12" v-for="(item, index) in interviewRecords" :key="index">
          <el-card shadow="always" style="margin-bottom: 15px;">
            <el-descriptions direction="vertical" :column="4" border>
              <el-descriptions-item label="面试人">{{ item.interviewee }}</el-descriptions-item>
              <el-descriptions-item label="面试官">{{ item.interviewer }}</el-descriptions-item>
              <el-descriptions-item label="意向部门">{{ item.department }}</el-descriptions-item>
              <el-descriptions-item label="意向岗位">{{ item.position }}</el-descriptions-item>
              <el-descriptions-item label="时间">
                {{ toTimeString(item.date) }}
              </el-descriptions-item>
              <el-descriptions-item label="联系方式">
                <el-tag size="small">tel</el-tag>
                {{ item.contact }}
              </el-descriptions-item>
              <el-descriptions-item label="是否通过">
                <el-tag v-show="item.isPassed === 1" size="small">已录用</el-tag>
                <el-tag v-show="item.isPassed === 2" type="info" size="small">未通过</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="操作">
                <el-tooltip content="删除" placement="top">
                  <el-button type="danger" size="small" icon="el-icon-delete" @click="deletePlan(item.id)"></el-button>
                </el-tooltip>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <!-- 增加面试 -->
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

    <!-- 编辑面试计划 -->
    <el-dialog
      title="编辑面试计划"
      :visible.sync="editInterviewVisible"
      width="30%"
      :before-close="handleClose">
      <!-- <span></span> -->
      <el-form :model="editInterview" status-icon ref="editInterviewFormRef" :rules="editFormRule" label-width="80px" size="normal">
        <el-form-item label="面试官" prop="interviewer">
          <el-input v-model="editInterview.interviewer"></el-input>
        </el-form-item>
        <el-form-item label="面试时间" prop="date">
          <el-date-picker
            v-model="editInterview.date"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="意向部门" prop="department">
          <el-input v-model="editInterview.department"></el-input>
        </el-form-item>
        <el-form-item label="意向岗位" prop="position">
          <el-input v-model="editInterview.position"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editInterviewVisible = false">取 消</el-button>
        <el-button type="primary" @click="editInterviewSubmit">确 认</el-button>
      </span>
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
      interviewPlans: [],
      interviewRecords: [],

      addInterviewForm: {
        interviewee: '',
        interviewer: '',
        date: '',
        department: '',
        position: '',
        contact: ''
      },

      editInterview: {},

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

      editFormRule: {
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
        ]
      },

      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '明天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }]
      },

      addInterviewVisible: false,
      editInterviewVisible: false
    }
  },

  created () {
    this.getAllPlans()
    this.getAllRecords()
  },

  methods: {
    async getAllPlans () {
      const { data: res } = await this.$http.post(`interviews`, {})
      if (!res.success) return this.$message.error(res.msg)
      this.interviewPlans = res.data
      console.log(res)
    },

    async getAllRecords () {
      const { data: res } = await this.$http.post(`interviews/records`, {})
      if (!res.success) return this.$message.error(res.msg)
      this.interviewRecords = res.data
      console.log(res)
    },

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

    // 添加面试提交
    addInterviewSubmit () {
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
          this.getAllPlans()
        }
      })
    },

    editPlan (plan) {
      this.editInterview = {
        id: plan.id,
        interviewer: plan.interviewer,
        date: plan.date,
        department: plan.department,
        position: plan.position
      }
      this.editInterviewVisible = true
    },

    editInterviewSubmit () {
      this.$refs.editInterviewFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            `interviews/edit`,
            this.editInterview
          )
          if (!res.success) return this.$message.error(res.msg)
          console.log('id = ' + res.data)
          this.$message.success('修改成功')
          this.editInterviewVisible = false
          this.getAllPlans()
        }
      })
    },

    deletePlan (id) {
      this.$confirm('此操作将删除该面试计划, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.get(`interviews/${id}`)
        if (!res.success) return this.$message.error(res.msg)
        console.log('id = ' + res.data)
        this.$message.success('删除成功')
        this.getAllPlans()
        this.getAllRecords()
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
.text-add {
  font-size: 20px;

  .el-button {
    padding: 5px;
    font-size: 18px;
  }
}

.interview-plan {
  margin-top: 10px;

  .el-link {
    font-size: 16px;
    float: right;
  }
}
.interview-record {
  .el-link {
    font-size: 16px;
    float: right;
  }
}
</style>
