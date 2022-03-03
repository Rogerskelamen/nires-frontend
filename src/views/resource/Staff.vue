<template>
  <div>
    <!-- this is staff page -->

    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">
        <i class="el-icon-s-home"></i>
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>人事管理</el-breadcrumb-item>
      <el-breadcrumb-item>人员处理</el-breadcrumb-item>
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
          <el-col :span="4" :offset="11">
            <el-link type="primary" icon="el-icon-plus" size="default" @click="addStaff">新增快速入口</el-link>
          </el-col>
        </el-row>
      </div>
      <!-- card body -->

      <el-table :data="staffList" border stripe>
        <el-table-column
          type="index"
          align="center"
          label="#">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          width="">
        </el-table-column>
        <el-table-column
          label="性别"
          align="center"
          width="80">
          <template slot-scope="scope">
            {{ scope.row.gender === 1 ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="age"
          label="年龄"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="department"
          label="部门"
          align="center"
          width="">
        </el-table-column>
        <el-table-column
          prop="position"
          label="岗位"
          align="center"
          width="">
        </el-table-column>
        <el-table-column
          label="月薪"
          align="center"
          width="">
          <template slot-scope="scope">
            {{ scope.row.baseSalary + scope.row.alterSalary }}
          </template>
        </el-table-column>
        <el-table-column
          prop="contact"
          label="联系方式"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="editStaff(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteStaff(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="totalStaff">
      </el-pagination>
    </el-card>

    <!-- 添加一个员工 -->
    <el-dialog
      title="快速添加一个员工"
      :visible.sync="addStaffVisible"
      width="30%"
      :before-close="handleClose">
      <!-- <div></div> -->
      <el-form status-icon :model="addStaffForm" ref="addStaffFormRef" :rules="addStaffRule" label-width="80px" :inline="false" size="medium">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addStaffForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="addStaffForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            v-model="addStaffForm.birthday"
            type="date"
            placeholder="选择出生日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select @change="getPositions" v-model="addStaffForm.department" placeholder="请选择部门">
            <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="position">
          <el-select v-model="addStaffForm.position" placeholder="请选择部门">
            <el-option v-for="item in positions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="薪水加成" prop="alterSalary">
          <el-input v-model.number="addStaffForm.alterSalary"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="addStaffForm.contact"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addStaffVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStaffSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑员工信息 -->
    <el-dialog
      title="更改员工基本信息"
      :visible.sync="editStaffVisible"
      width="30%"
      :before-close="handleClose">
      <!-- <div></div> -->
      <el-form status-icon :model="editStaffForm" ref="editStaffFormRef" :rules="editStaffRule" label-width="80px" :inline="false" size="medium">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editStaffForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="editStaffForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            v-model="editStaffForm.birthday"
            type="date"
            placeholder="选择出生日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="editStaffForm.contact"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editStaffVisible = false">取 消</el-button>
        <el-button type="primary" @click="editStaffSubmit">确 定</el-button>
      </div>
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
      staffList: [],

      departments: [],
      positions: [],

      searchVal: '',
      selectType: '',

      addStaffRule: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        birthday: [
          { type: 'date', required: true, message: '请选择生日', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入部门', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '请输入岗位', trigger: 'blur' }
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
      editStaffRule: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        birthday: [
          { type: 'date', required: true, message: '请选择生日', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系方式(手机号)', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },

      addStaffForm: {},
      editStaffForm: {},

      pageSize: 8,
      currentPage: 1,
      totalStaff: 0,

      addStaffVisible: false,
      editStaffVisible: false
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

    async addStaff () {
      this.addStaffForm = {
        name: '',
        gender: 1,
        birthday: 0,
        department: '',
        position: '',
        alterSalary: 0,
        contact: ''
      }
      const { data: res } = await this.$http.get(`dep`)
      if (!res.success) return this.$message.error(res.msg)
      // console.log(res)
      this.departments = res.data
      this.addStaffVisible = true
    },

    addStaffSubmit () {
      this.$refs.addStaffFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            `staff/add`,
            {
              name: this.addStaffForm.name,
              gender: this.addStaffForm.gender,
              birthday: this.addStaffForm.birthday.getTime(),
              depId: this.addStaffForm.department,
              positionId: this.addStaffForm.position,
              alterSalary: this.addStaffForm.alterSalary,
              contact: this.addStaffForm.contact
            }
          )
          if (!res.success) return this.$message.error(res.msg)
          // console.log('id = ' + res.data)
          this.$message.success('添加成功')
          this.addStaffVisible = false
          this.getStaffList(this.currentPage)
        }
      })
    },

    editStaff (staff) {
      this.editStaffForm = {
        id: staff.id,
        name: staff.name,
        gender: staff.gender,
        birthday: staff.birthday,
        contact: staff.contact
      }
      this.editStaffVisible = true
    },

    editStaffSubmit () {
      this.$refs.editStaffFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            `staff/edit`,
            this.editStaffForm
          )
          if (!res.success) return this.$message.error(res.msg)
          console.log('id = ' + res.data)
          this.$message.success('修改成功')
          this.getStaffList()
          this.editStaffVisible = false
        }
      })
    },

    deleteStaff (id) {
      this.$confirm('此操作将删除该员工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.get(`staff/delete/${id}`)
        if (!res.success) return this.$message.error(res.msg)
        console.log('id = ' + res.data)
        this.$message.success('删除成功')
        this.getStaffList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    handleCurrentChange (val) {
      // console.log(val)
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
  margin: 12px;
}
</style>
