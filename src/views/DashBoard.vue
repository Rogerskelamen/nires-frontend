<template>
  <div>
    <!-- this is DashBoard -->
    <div class="giant-screen shadow">
      <span class="greeting">您好, {{ adminName}}</span>
      今天是{{ date }}
      <el-divider direction="horizontal" content-position="center"></el-divider>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },

  computed: {
    adminName () {
      return window.sessionStorage.getItem('admin')
    },
    date () {
      var date = new Date()
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    }
  }
}
</script>

<style lang="less" scoped>
.giant-screen {
  width: 100vw - 300px;
  height: 200px;
  box-sizing: border-box;
  padding: 30px;
  border-radius: 4px;
  background-color: #e9ecef;

  .greeting {
    display: block;
    margin-top: 30px;
    margin-bottom: 10px;
    font-size: 2.5em;
  }
}
</style>
