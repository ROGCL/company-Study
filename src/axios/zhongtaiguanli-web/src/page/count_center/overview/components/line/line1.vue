<template>
  <div class="line1">
    <div :id="id" style="width: 100%;height:270px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import moment from 'moment'

export default {
  props: ['propsData'],
  beforeDestroy() {
    if (this.echarts) {
      echarts.dispose(this.echarts)
      this.echarts = null
    }
  },
  data() {
    return {
      charts: null,
    }
  },
  mounted() {
    let { xAxis, series } = this.propsData
    let xAxisData = xAxis.data
    let seriesData = series.map(({ name, data }) => {
      let newData = []
      for (let i = 0; i < xAxisData.length; i++) {
        let item = xAxisData[i]
        let week = moment(String(item)).format('E')
        newData.push({
          value: data[i],
          symbol: week === '6' || week === '7' ? 'circle' : 'emptyCircle',
          symbolSize: week === '6' || week === '7' ? 6 : 0,
        })
      }
      return {
        name,
        data: newData,
        type: 'line',
      }
    })
    this.echarts = echarts.init(document.getElementById(this.id))
    // 指定图表的配置项和数据
    var option = {
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        top: 37,
        bottom: 47,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        boundaryGap: false,
        axisTick: {
          lineStyle: {
            opacity: '0',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#AEB6C1',
          },
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#AEB6C1',
          },
        },
        axisTick: {
          lineStyle: {
            opacity: '0',
          },
        },
      },
      color: '#FF981F',
      series: seriesData,
    }

    // 使用刚指定的配置项和数据显示图表。
    this.echarts.setOption(option)
  },
  computed: {
    id() {
      return Math.random()
    },
  },
}
</script>

<style scoped>
.line1 {
  overflow: hidden;
}
</style>