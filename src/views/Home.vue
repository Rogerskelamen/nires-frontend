<template>
  <div id="home">
    <!-- this is home page -->

    <el-container>

      <el-aside :width="isCollapse ? '64px' : '270px'">

        <div v-if="!isCollapse">
          <h2 class="logo" @click="goHome">
            Nires
          </h2>
        </div>
        <div v-if="isCollapse" class="home-icon">
          <i class="el-icon-house" @click="goHome"></i>
        </div>
        <el-menu
          :router="true"
          :default-active="activePath"
          :collapse-transition="false"
          :collapse="isCollapse"
          :unique-opened="false"
          background-color="#33495f"
          text-color="#fff"
          active-text-color="#12b7f5">
            <!-- 一级菜单 -->
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <!-- 一级菜单的模版区域 -->
              <template slot="title">
                <!-- Icon -->
                <i :class="iconsObject[item.id]"></i>
                <!-- Paragraph -->
                <span>&nbsp;&nbsp;&nbsp;&nbsp;{{ item.name }}</span>
              </template>

              <!-- 二级菜单 -->
              <el-menu-item
              @click="setActivePath(subItem.path)"
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
        <el-header class="shadow">
          <el-row class="top-bar" :gutter="0">
            <el-col class="fold-menu" :span="12" :offset="0">
              <i v-show="!isCollapse" class="fold-icon el-icon-s-fold transition-box" @click="foldMenu"></i>
              <i v-show="isCollapse" class="fold-icon el-icon-s-unfold transition-box" @click="foldMenu"></i>
              <span style="font-size: 22px;">&nbsp;&nbsp;&nbsp;&nbsp;人事管理系统</span>
            </el-col>

            <el-col class="user-place" :span="12" :offset="0">
              <i class="el-icon-user-solid"></i>
              <el-dropdown>
                <span class="el-dropdown-link">
                  {{ adminName }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
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
import { mapState, mapMutations } from 'vuex'

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
        2: 'el-icon-user',
        3: 'el-icon-bell',
        4: 'el-icon-setting'
      },

      // 是否折叠
      isCollapse: false,

      // 管理员姓名存储
      adminName: ''
    }
  },
  computed: {
    ...mapState(['activePath'])
  },

  created () {
    this.adminName = window.sessionStorage.getItem('admin')
  },

  methods: {
    ...mapMutations(['setActivePath', 'rmActivePath']),

    goHome () {
      this.rmActivePath()
      this.$router.push('/home').catch(() => {})
    },

    // 登出
    async logout () {
      const token = window.sessionStorage.getItem('token')
      const { data: res } = await this.$http.get(`logout/${token}`)
      if (!res.success) return this.$message.error(res.msg)
      window.sessionStorage.clear()
      this.$message.success('登出成功')
      this.$router.push('/')
    },

    // 折叠菜单
    foldMenu () {
      this.isCollapse = !this.isCollapse
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
      transition: width 0.3s;

      .logo {
        text-align: center;
        color: #fff;
        font-family: 'Courier New', Courier, monospace;
        font-size: 28px;
        cursor: pointer;
      }
      .logo:hover {
        text-shadow: 4px 5px 12px #000;
      }

      .home-icon {
        height: 56px;
        cursor: pointer;
        padding: 0 20px;
        text-align: center;
        line-height: 56px;

        i {
          font-size: 18px;
        }
      }
      .home-icon:hover {
        background-color: rgb(41, 58, 76);
      }

      .el-menu {
        border-right: none;
        font-weight: bold;
      }
      i {
        color: #fff;
      }
    }

    .right-main {
      .el-header {
        background-color: rgb(238, 238, 238);
        z-index: 1;

        .top-bar {
          height: 100%;

          .fold-menu {
            height: 100%;
            display: flex;
            align-items: center;

            .fold-icon {
              cursor: pointer;
              font-size: 36px;
            }
          }

          .user-place {
            font-size: 28px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: end;

            .el-dropdown-link {
              cursor: pointer;
              font-size: 16px;
              font-weight: bold;
            }
            .el-dropdown-link:hover {
              color: #0c57b9;
            }
            .el-icon-arrow-down {
              font-size: 12px;
            }
          }
        }

      }
    }
  }
}
</style>
