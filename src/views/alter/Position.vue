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
            <el-descriptions class="margin-top" :title="item.name" :column="2">
              <template slot="extra">
                <el-tooltip class="item" effect="dark" content="调整岗位" placement="top">
                  <el-button type="primary" @click="alterPosition(item.id)" size="mini" icon="el-icon-edit" circle></el-button>
                </el-tooltip>
                <el-button type="danger" @click="alterSalary(item.id)" plain size="small">加薪</el-button>
              </template>
              <el-descriptions-item label="联系方式" :span="2">{{ item.contact }}</el-descriptions-item>
              <el-descriptions-item label="部门">{{ item.department }}</el-descriptions-item>
              <el-descriptions-item label="岗位">{{ item.position }}</el-descriptions-item>
              <el-descriptions-item label="基本工资">{{ item.baseSalary }}</el-descriptions-item>
              <el-descriptions-item label="总工资">{{ item.baseSalary + item.alterSalary }}</el-descriptions-item>
              <el-descriptions-item label="加成工资占比" :span="2">
                <el-progress :percentage="parseInt((item.alterSalary / item.baseSalary) * 100)"></el-progress>
                <!-- <el-progress :percentage="50"></el-progress> -->
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
        :total="totalStaff">
      </el-pagination>
    </el-card>

    <!-- 调整岗位 -->
    <el-dialog
      title="调整岗位"
      :visible.sync="alterPositionVisible"
      width="30%"
      :before-close="handleClose">
      <!-- <div></div> -->
      <el-form status-icon :model="alterPositionForm" ref="alterPositionFormRef" :rules="alterPositionRule" label-width="80px" :inline="false" size="medium">
        <el-form-item label="部门" prop="depId">
          <el-select @change="getPositions" v-model="alterPositionForm.depId" placeholder="请选择部门">
            <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="positionId">
          <el-select v-model="alterPositionForm.positionId" placeholder="请选择部门">
            <el-option v-for="item in positions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="alterPositionVisible = false">取 消</el-button>
        <el-button type="primary" @click="alterPositionSubmit">确 定</el-button>
      </div>
    </el-dialog>
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

      alterPositionVisible: false,

      alterPositionForm: {},

      alterPositionRule: {
        depId: [
          { required: true, message: '请输入部门', trigger: 'blur' }
        ],
        positionId: [
          { required: true, message: '请输入岗位', trigger: 'blur' }
        ]
      },

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
      const depId = this.alterPositionForm.depId
      this.alterPositionForm.positionId = ''
      const { data: res } = await this.$http.get(`position/${depId}`)
      if (!res.success) return this.$message.error(res.msg)
      // console.log(res)
      this.positions = res.data
    },

    async alterPosition (id) {
      this.alterPositionForm = {
        id: id,
        depId: '',
        positionId: ''
      }
      const { data: res } = await this.$http.get(`dep`)
      if (!res.success) return this.$message.error(res.msg)
      // console.log(res)
      this.departments = res.data
      this.alterPositionVisible = true
    },

    alterPositionSubmit () {
      this.$refs.alterPositionFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(`staff/alter/position`, this.alterPositionForm)
          if (!res.success) return this.$message.error(res.msg)
          console.log('id = ' + res.data)
          this.$message.success('变更成功')
          this.getStaffList()
          this.alterPositionVisible = false
        }
      })
    },

    alterSalary (id) {
      this.$prompt('请输入加成薪水', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[0-9]*$/,
        inputErrorMessage: '请输入数值'
      }).then(async val => {
        if (val.value === null) return this.$message.error('输入不能为空')
        const { data: res } = await this.$http.get(`staff/alter/salary?id=${id}&salary=${val.value}`)
        if (!res.success) return this.$message.error(res.msg)
        console.log(res)
        this.$message.success('更改成功')
        this.getStaffList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
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

.el-progress /deep/ .el-progress-bar__outer {
  width: 150px;
}
.el-progress /deep/ .el-progress__text {
  transform: translateX(25px);
}
</style>
