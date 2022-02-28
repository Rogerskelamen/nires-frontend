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
      <div class="tip">现在还有<el-tag type="primary" size="mini">{{ interviewAssess.length }}</el-tag>条数据需要处理</div>
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
                <el-tooltip content="删除" placement="top">
                  <el-button type="danger" size="small" icon="el-icon-delete" @click="deletePlan(item.id)"></el-button>
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
  </div>
</template>

<script>
import { toTimeString } from '@/utils/time.js'

export default {
  data () {
    return {
      interviewAssess: []
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
