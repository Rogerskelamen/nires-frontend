<template>
  <div>
    <!-- this is position page -->

    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">
        <i class="el-icon-s-home"></i>
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>人事变动</el-breadcrumb-item>
      <el-breadcrumb-item>职薪管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="show-staff" shadow="always">
      <div slot="header">
        <el-row class="title-bar" :gutter="20">
          <el-col :span="2" :offset="0">
            <span>员工列表</span>
          </el-col>
          <el-col :span="7" :offset="0">
            <el-input placeholder="请输入内容" v-model="searchVal" class="input-with-select">
              <el-select v-model="selectType" slot="prepend" placeholder="请选择">
                <el-option label="姓名" value="1"></el-option>
                <el-option label="部门名称" value="2"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="searchByType"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>

      <!-- card body -->
      <el-row :gutter="20">
        <el-col v-for="item in staffList" :key="item.id" :span="12" :offset="0">
          <el-card style="margin-bottom: 15px;">
            <el-descriptions class="margin-top" title="无边框列表" :column="3" :size="size">
              <template slot="extra">
                <el-button type="primary" size="small">操作</el-button>
              </template>
              <el-descriptions-item label="用户名">{{ item.name }}</el-descriptions-item>
              <el-descriptions-item label="手机号">{{ item.contact }}</el-descriptions-item>
              <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
              <el-descriptions-item label="备注">
                <el-tag size="small">学校</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>

      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="totalStaff">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchVal: '',
      selectType: '',
      staffList: [],

      departments: [],
      positions: [],

      currentPage: 1,
      pageSize: 6,
      totalStaff: 0
    }
  },

  created () {
    this.getStaffList()
  },

  methods: {
    async getStaffList () {
      if (this.selectType === '1') {
        const { data: res } = await this.$http.post(
          `staff/searchname?name=${this.searchVal}`,
          {
            page: this.currentPage,
            pageSize: this.pageSize
          }
        )
        if (!res.success) return this.$message.error(res.msg)
        console.log(res)
        this.staffList = res.data.staffVoList
        this.totalStaff = res.data.total
      } else if (this.selectType === '2') {
        const { data: res } = await this.$http.post(
          `staff/searchdep?depname=${this.searchVal}`,
          {
            page: this.currentPage,
            pageSize: this.pageSize
          }
        )
        if (!res.success) return this.$message.error(res.msg)
        console.log(res)
        this.staffList = res.data.staffVoList
        this.totalStaff = res.data.total
      } else {
        const { data: res } = await this.$http.post(
          `staff`,
          {
            page: this.currentPage,
            pageSize: this.pageSize
          }
        )
        if (!res.success) return this.$message.error(res.msg)
        console.log(res)
        this.staffList = res.data.staffVoList
        this.totalStaff = res.data.total
      }
    },

    searchByType () {
      this.currentPage = 1
      if (this.selectType === '') return this.$message.error('请选择筛选类型')
      this.getStaffList()
    },

    async getPositions () {
      const depId = this.addStaffForm.department
      this.addStaffForm.position = ''
      const { data: res } = await this.$http.get(`position/${depId}`)
      if (!res.success) return this.$message.error(res.msg)
      console.log(res)
      this.positions = res.data
    },

    handleCurrentChange (val) {
      this.currentPage = val
      this.getStaffList()
    },

    handleClose (done) {
      done()
    }
  }
}
</script>

<style lang="less" scoped>
.show-staff {
  margin-top: 20px;

  .title-bar {
    display: flex;
    align-items: center;

    .el-select /deep/ input {
      width: 100px;
    }

    .el-link {
      float: right;
    }
  }
}

.el-pagination {
  float: right;
  margin-bottom: 12px;
}
</style>
