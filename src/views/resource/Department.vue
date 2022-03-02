<template>
  <div>
    <!-- this is department page -->

    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">
        <i class="el-icon-s-home"></i>
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>人事管理</el-breadcrumb-item>
      <el-breadcrumb-item>部门管理</el-breadcrumb-item>
    </el-breadcrumb>

    <p class="text-add">
      立即新建一个部门?
      <el-button type="success" size="large" @click="addDepartment">Click Me</el-button>
    </p>

    <!-- 部门和岗位的展示 -->
    <el-card>
      <el-collapse>
        <el-collapse-item v-for="item in depAndPosition" :key="item.id">
          <template slot="title">
            <span style="font-size: 20px;">{{ item.name }}</span>
            <el-button style="margin-left: 20px;" type="success" size="small" plain @click="addPosition(item.id)">添加岗位</el-button>
            <el-button
              style="margin-left: 30px;"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteDep(item.id)"
              circle>
            </el-button>
          </template>
            <el-table
              :data="item.positions"
              border
              stripe
              style="width: 60%">
              <el-table-column
                prop="name"
                label="职位名称"
                width="">
              </el-table-column>
              <el-table-column
                prop="baseSalary"
                label="基本薪水"
                width="">
              </el-table-column>
              <el-table-column
                label="操作"
                width="180">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="small"
                    @click="editPosition(scope.row)">
                    修改
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    @click="deletePosition(scope.row.id)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <!-- 添加岗位 -->
    <el-dialog
      title="添加岗位"
      :visible.sync="addPositionVisible"
      width="width"
      :before-close="handleClose">
      <!-- <div></div> -->
      <el-form status-icon :model="addPositionForm" ref="addPositionFormRef" :rules="addPositionRule" label-width="80px" :inline="false" size="normal">
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="addPositionForm.name"></el-input>
        </el-form-item>
        <el-form-item label="基本薪水" prop="baseSalary">
          <el-input v-model.number="addPositionForm.baseSalary"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addPositionVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPositionSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="修改岗位"
      :visible.sync="editPositionVisible"
      width="width"
      :before-close="handleClose">
      <!-- <div></div> -->
      <el-form :model="editPositionForm" ref="editPositionFormRef" :rules="addPositionRule" label-width="80px" :inline="false" size="normal">
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="editPositionForm.name"></el-input>
        </el-form-item>
        <el-form-item label="基本薪水" prop="baseSalary">
          <el-input v-model.number="editPositionForm.baseSalary"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editPositionVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPositionSubmit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      depAndPosition: [],

      addPositionForm: {},
      editPositionForm: {},

      addPositionRule: {
        name: [
          { required: true, message: '请输入职位名称', trigger: 'blur' }
        ],
        baseSalary: [
          { required: true, message: '请定义基本薪水', trigger: 'blur' },
          { type: 'number', message: '薪水必须为数字值(单位元)' }
        ]
      },

      addPositionVisible: false,
      editPositionVisible: false
    }
  },

  created () {
    this.getAllInfo()
  },

  methods: {
    async getAllInfo () {
      const { data: res } = await this.$http.get(`/dep/all`)
      if (!res.success) return this.$message.error(res.msg)
      console.log(res)
      this.depAndPosition = res.data
    },

    addDepartment () {
      this.$prompt('请输入部门名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '请输入部门名称'
      }).then(async val => {
        const { data: res } = await this.$http.get(`/dep/add/${val.value}`)
        if (!res.success) return this.$message.error(res.msg)
        console.log(res.data)
        this.$message.success('添加成功')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消添加'
        })
      })
    },

    deleteDep (id) {
      this.$confirm('此操作将一键删除部门和其所有岗位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.get(`dep/delete/${id}`)
        if (!res.success) return this.$message.error(res.msg)
        console.log('id = ' + res.data)
        this.$message.success('删除成功')
        this.getAllInfo()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    addPosition (id) {
      this.addPositionForm = {
        depId: id,
        name: '',
        baseSalary: ''
      }
      this.addPositionVisible = true
    },

    addPositionSubmit () {
      this.$refs.addPositionFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            `position/add`,
            this.addPositionForm
          )
          if (!res.success) return this.$message.error(res.msg)
          console.log('id = ' + res.data)
          this.$message.success('添加成功')
          this.addPositionVisible = false
          this.getAllInfo()
        }
      })
    },

    editPosition (position) {
      this.editPositionForm = {
        id: position.id,
        name: position.name,
        baseSalary: position.baseSalary
      }
      this.editPositionVisible = true
    },

    editPositionSubmit () {
      this.$refs.editPositionFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            `position/edit`,
            this.editPositionForm
          )
          if (!res.success) return this.$message.error(res.msg)
          console.log('id = ' + res.data)
          this.$message.success('修改成功')
          this.editPositionVisible = false
          this.getAllInfo()
        }
      })
    },

    deletePosition (id) {
      this.$confirm('此操作将删除该有岗位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.get(`position/delete/${id}`)
        if (!res.success) return this.$message.error(res.msg)
        console.log('id = ' + res.data)
        this.$message.success('删除成功')
        this.getAllInfo()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
