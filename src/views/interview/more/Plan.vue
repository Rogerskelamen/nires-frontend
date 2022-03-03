<template>
  <div>
    <!-- this is plan page -->
    <el-page-header @back="goBack" content="面试计划详情"></el-page-header>

    <el-card class="interview-plan" shadow="always">
      <div slot="header">
        <span>面试计划</span>
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

      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="totalPlan">
      </el-pagination>
    </el-card>

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
          <el-select @change="getPositionsEdit" v-model="editInterview.department" placeholder="请选择部门">
            <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="意向岗位" prop="position">
          <el-select v-model="editInterview.position" placeholder="请选择部门">
            <el-option v-for="item in positions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
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
    return {
      interviewPlans: [],

      editInterview: {},

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

      currentPage: 1,
      pageSize: 4,
      totalPlan: 0,

      departments: [],
      positions: [],
      editInterviewVisible: false
    }
  },

  created () {
    this.getAllPlans()
  },

  methods: {
    async getAllPlans () {
      const { data: res } = await this.$http.post(
        `interviews`,
        {
          page: this.currentPage,
          pageSize: this.pageSize
        }
      )
      if (!res.success) return this.$message.error(res.msg)
      this.interviewPlans = res.data.interviewVoList
      this.totalPlan = res.data.total
      // console.log(res)
    },

    async getPositionsEdit () {
      const depId = this.editInterview.department
      this.editInterview.position = ''
      const { data: res } = await this.$http.get(`position/${depId}`)
      if (!res.success) return this.$message.error(res.msg)
      console.log(res)
      this.positions = res.data
    },

    async editPlan (plan) {
      this.editInterview = {
        id: plan.id,
        interviewer: plan.interviewer,
        date: plan.date,
        department: '',
        position: ''
      }
      const { data: res } = await this.$http.get(`dep`)
      if (!res.success) return this.$message.error(res.msg)
      // console.log(res)
      this.departments = res.data
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    goBack () {
      this.$router.push('/interview/manage')
    },

    handleCurrentChange (val) {
      this.currentPage = val
      this.getAllPlans()
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
.interview-plan {
  margin-top: 15px;
}

.el-pagination {
  float: right;
  margin-bottom: 12px;
}
</style>
