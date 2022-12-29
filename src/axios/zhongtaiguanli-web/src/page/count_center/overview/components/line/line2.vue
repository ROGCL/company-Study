<template>
  <div class="lin2">
    <div :id="id" style="width: 100%;height:280px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import moment from 'moment'

export default {
  props: ['propsData'],
  data() {
    return {
      charts: null,
    }
  },
  beforeDestroy() {
    if (this.echarts) {
      echarts.dispose(this.echarts)
      this.echarts = null
    }
  },
  mounted() {
    let { xAxis, series } = this.propsData
    let legend = []
    let seriesData = series.map(({ name, data }, index) => {
      legend.push(name)
      let newData = []
      for (let i = 0; i < xAxis.data.length; i++) {
        let item = xAxis.data[i]
        let week = moment(String(item)).format('E')
        newData.push({
          value: data[i],
          symbol: week === '6' || week === '7' ? 'circle' : 'emptyCircle',
          symbolSize: week === '6' || week === '7' ? 6 : 0,
        })
      }
      let color = ''
      switch (index) {
        case 0:
          color = '#D667BD'
          break
        case 1:
          color = '#4CCBD5'
          break
        case 2:
          color = '#90BA61'
          break
        case 3:
          color = '#385BF1'
          break
        case 4:
          color = '#FF981F'
          break
      }
      return {
        name,
        type: 'line',
        data: newData,
        itemStyle: {
          color,
        },
        // symbol: 'circle'
      }
    })
    this.echarts = echarts.init(document.getElementById(this.id))
    // 指定图表的配置项和数据
    var option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: legend,
        bottom: -5,
      },
      grid: {
        top: '10%',
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxis.data,
        boundaryGap: false,
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
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
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
      series: seriesData,
    }
    // 使用刚指定的配置项和数据显示图表。
    this.echarts .setOption(option)
  },
  computed: {
    id() {
      return Math.random()
    },
  },
}
</script>

<style scoped>
.lin2 {
  overflow: hidden;
}
</style>