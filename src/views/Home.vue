<template>
  <div id="home">
    <!-- this is home page -->

    <el-container>

      <el-aside width="270px">

        <div>
          <h2 class="logo" @click="goHome">Nires</h2>
        </div>
        <el-menu
          :router="true"
          :collapse-transition="true"
          :collapse="isCollapse"
          :unique-opened="false"
          background-color="#33495f"
          text-color="#fff"
          active-text-color="#409eff">
            <!-- 一级菜单 -->
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <!-- 一级菜单的模版区域 -->
              <template slot="title">
                <!-- Icon -->
                &nbsp;&nbsp;&nbsp;&nbsp;
                <i :class="iconsObject[item.id]"></i>
                <!-- Paragraph -->
                <span>&nbsp;&nbsp;&nbsp;&nbsp;{{ item.name }}</span>
              </template>

              <!-- 二级菜单 -->
              <el-menu-item
              @click="saveNavState('/' + subItem.path)"
              v-for="subItem in item.children"
              :index="subItem.path"
              :key="subItem.id">
                <template slot="title">
                  <!-- Icon -->
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <i class="el-icon-menu"></i>
                  <!-- Paragraph -->
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;{{ subItem.name }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
        </el-menu>
      </el-aside>

      <el-container class="right-main">
        <el-header type="">
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">sdf</el-col>
            <el-col class="user-place" :span="12" :offset="0">
              <i class="el-icon-user-solid"></i>
              <el-dropdown>
                <span class="el-dropdown-link">
                  下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>黄金糕</el-dropdown-item>
                  <el-dropdown-item>狮子头</el-dropdown-item>
                  <el-dropdown-item>螺蛳粉</el-dropdown-item>
                  <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                  <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <!-- Main content -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuList: [{
        id: '1',
        name: '招聘管理',
        children: [{
          id: '11',
          name: '面试管理',
          path: '/interview/manage'
        }, {
          id: '12',
          name: '面试处理',
          path: '/interview/handle'
        }]
      }, {
        id: '2',
        name: '人事管理',
        children: [{
          id: '21',
          name: '部门管理',
          path: '/resource/department'
        }, {
          id: '22',
          name: '人员管理',
          path: '/resource/staff'
        }]
      }, {
        id: '3',
        name: '人事变动',
        children: [{
          id: '31',
          name: '职薪管理',
          path: '/alter/position'
        }, {
          id: '32',
          name: '离职管理',
          path: '/alter/transfer'
        }]
      }, {
        id: '4',
        name: '系统管理',
        children: [{
          id: '41',
          name: '用户管理',
          path: '/system/admin'
        }]
      }],
      iconsObject: {
        1: 'el-icon-edit-outline',
        2: 'el-icon-tickets',
        3: 'el-icon-bell',
        4: 'el-icon-setting'
      },

      // 是否折叠
      isCollapse: false
    }
  },
  methods: {
    goHome () {
      this.$router.push('/home').catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
#home {
  height: 100vh;

  .el-container {
    height: 100%;

    .el-aside {
      background-color: #33495f;

      .logo {
        text-align: center;
        color: #fff;
        font-family: 'Courier New', Courier, monospace;
        font-size: 28px;
        cursor: pointer;
      }

      .el-menu {
        border-right: none;
      }
      i {
        color: #fff;
      }
    }

    .right-main {
      .el-header {
        background-color: rgb(238, 238, 238);

        .el-dropdown-link {
          cursor: pointer;
        }
        .el-dropdown-link:hover {
          color: #0c57b9;
        }
        .el-icon-arrow-down {
          font-size: 12px;
        }

        .user-place {
          font-size: 27px;
        }
      }
    }
  }
}
</style>
