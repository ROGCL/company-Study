<template>
  <div style="min-height:400px;width:100%" class="box">
    <!-- <slot name="option"></slot> -->
    <el-row type="flex" justify="space-between" :gutter="30">
      <el-col :xl="12" :lg="24">
        <div class="bgfff">广告转化漏斗</div>
        <div id="funnel" style="background:#fff;height:400px"></div>
      </el-col>
      <el-col :xl="12" :lg="24">
        <div class="bgfff">付费转化漏斗图</div>
        <div id="twoFunnel" style="background:#fff;height:400px"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    option: {
      type: Object,
      default: function () {
        return {}
      },
    },
    twoOption: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  data() {
    return {
      chart: null,
      twoChatr: null,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.chart = echarts.init(document.getElementById('funnel'))
      this.twoChatr = echarts.init(document.getElementById('twoFunnel'))
      this.chart.showLoading()
      this.twoChatr.showLoading()
    },
  },
  watch: {
    option(newVal) {
      // this.chart.clear();
      this.chart.setOption(newVal)
      newVal.loading ? this.chart.showLoading() : this.chart.hideLoading()
    },
    twoOption(newVal) {
      this.twoChatr.setOption(newVal)
      newVal.loading ? this.twoChatr.showLoading() : this.twoChatr.hideLoading()
    },
  },
}
</script>

<style lang="less" scoped>
.box {
  margin: 0 0 20px 0;
}
.flex {
  height: 50px;
  width: 100%;
  padding: 10px 0;
  font-weight: bold;
  display: flex;
  justify-content: space-around;
  background: #fff;
}
.bgfff {
  background: #fff;
  padding: 15px;
  font-weight: bold;
}
</style>