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
                  <el-button type="success" size="small" @click="hirePerson(item.id)">hire</el-button>
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
      width="width"
      :before-close="handleClose">
      <!-- <div></div> -->
      <el-form :model="addEmpForm" status-icon ref="editInterviewFormRef" :rules="editFormRule" label-width="80px" size="normal">
        <el-form-item label="面试官" prop="interviewer">
          <el-input v-model="addEmpForm.interviewer"></el-input>
        </el-form-item>
        <el-form-item label="面试时间" prop="date">
          <el-date-picker
            v-model="addEmpForm.date"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="意向部门" prop="department">
          <el-input v-model="addEmpForm.department"></el-input>
        </el-form-item>
        <el-form-item label="意向岗位" prop="position">
          <el-input v-model="addEmpForm.position"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addEmpVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEmpVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { toTimeString } from '@/utils/time.js'

export default {
  data () {
    return {
      interviewAssess: [],

      addEmpForm: {

      },

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

    hirePerson (id) {
      this.addEmpVisible = true
    },

    passPerson (id) {
      this.$confirm('此操作将不再录用该应聘人员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.get(`interviews/pass/${id}/2`)
        if (!res.success) return this.$message.error(res.msg)
        console.log('id = ' + res.data)
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
