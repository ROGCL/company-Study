<template>
  <div class="bar2">
    <div :id="id" style="width: 100%;height:200px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: ['propsData', 'echartsProp'],
  mounted() {
    let { yAxis, series } = this.propsData
    let xAxisData = yAxis.data
    let seriesData = series.data.map(({ name, data, type }, index) => {
      return {
        name,
        data,
        type,
        stack: index === 2 ? '' : '1',
        barWidth: 20,
        yAxisIndex: index === 2 ? 1 : 0,
      }
    })
    var myChart = echarts.init(document.getElementById(this.id))
    // 指定图表的配置项和数据
    var option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        top: 0,
        bottom: 20,
      },
      yAxis: [
        {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: '#fff',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#AEB6C1',
            },
          },
        },
        {
          type: 'value',
          axisLabel: {
            formatter: '{value} %',
          },
          splitLine: {
            lineStyle: {
              color: '#fff',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#AEB6C1',
            },
          },
        },
      ],
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisTick: {
          lineStyle: {
            opacity: '0',
          },
        },
        axisLine: {
          show: false,
        },
      },
      color: ['#5291EC', '#16C06F', '#FFC706', '#8267DB', '#FF6573'],
      series: seriesData,
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  computed: {
    id() {
      return Math.random()
    },
  },
}
</script>

<style scoped>
.bar2 {
  overflow: hidden;
}
</style>