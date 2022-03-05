<template>
  <div id="dashboard">
    <!-- this is DashBoard -->
    <div class="giant-screen shadow">
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
            <span class="greeting">您好, {{ adminName}}</span>
            <span class="subtitle">今天是{{ date }}, 祝您今天工作愉快</span>
        </el-col>
        <el-col :span="12" :offset="0"></el-col>
      </el-row>
      <el-divider direction="horizontal" content-position="center"></el-divider>
    </div>

    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <el-card class="bar-charts">
          <div id="bar"></div>
        </el-card>
      </el-col>
      <el-col :span="12" :offset="0">
        <el-card class="pie-charts">
          <div id="pie"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'

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
  },

  mounted () {
    this.drawBar()
  },

  methods: {
    drawBar () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('bar'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '近一个月的应招情况'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      })
    }
  }
}
</script>

<style lang="less" scoped>
.giant-screen {
  height: 220px;
  box-sizing: border-box;
  padding: 30px;
  border-radius: 4px;
  background-color: #e9ecef;

  .greeting {
    display: block;
    margin-top: 30px;
    margin-bottom: 10px;
    font-weight: 300;
    font-size: 48px;
  }

  .subtitle {
    font-size: 20px;
    font-style: italic;
  }
}

.bar-charts, .pie-charts {
  height: 400px;
  margin-top: 20px;

  #bar, #pie {
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
