<template>
  <div>
    <!-- this is record page -->
    <el-page-header @back="goBack" content="面试记录详情"></el-page-header>

    <el-card class="interview-record" shadow="always">
      <div slot="header">
        <span>面试记录</span>
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
                  <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteRecord(item.id)"></el-button>
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
        :total="totalRecord">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { toTimeString } from '@/utils/time.js'

export default {
  data () {
    return {
      interviewRecords: [],

      currentPage: 1,
      pageSize: 4,
      totalRecord: 0
    }
  },

  created () {
    this.getAllRecords()
  },

  methods: {
    async getAllRecords () {
      const { data: res } = await this.$http.post(
        `interviews/records`,
        {
          page: this.currentPage,
          pageSize: this.pageSize
        }
      )
      if (!res.success) return this.$message.error(res.msg)
      this.interviewRecords = res.data.interviewVoList
      this.totalRecord = res.data.total
      console.log(res)
    },

    deleteRecord (id) {
      this.$confirm('此操作将删除该面试计划, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.get(`interviews/${id}`)
        if (!res.success) return this.$message.error(res.msg)
        console.log('id = ' + res.data)
        this.$message.success('删除成功')
        this.getAllRecords()
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
      this.getAllRecords()
    },

    toTimeString (time) {
      return toTimeString(time)
    }
  }
}
</script>

<style lang="less" scoped>
.interview-record {
  margin-top: 15px;
}

.el-pagination {
  float: right;
  margin-bottom: 12px;
}
</style>
