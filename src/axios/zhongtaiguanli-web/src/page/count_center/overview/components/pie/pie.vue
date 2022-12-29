<template>
  <div class="pie">
    <div :id="id" style="width: 100%;height:270px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: ['propsData'],
  mounted() {
    let { legend, series } = this.propsData
    let legendData = legend.data.map((item) => {
      return {
        name: item,
        icon: 'circle',
      }
    })
    let seriesData = series.data.map((item, index) => {
      switch (index) {
        case 1:
          item.itemStyle = {
            color: '#FFAA46',
          }
          break
        case 2:
          item.itemStyle = {
            color: '#F35B5B',
          }
      }
      return item
    })
    var myChart = echarts.init(document.getElementById(this.id))
    // 指定图表的配置项和数据
    var option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: '5%',
        data: legendData,
      },
      backgroundColor: '#fff',
      series: [
        {
          type: 'pie',
          radius: ['45%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'inner',
            formatter: ({ percent }) => {
              return percent > 0 ? `${percent}%` : ''
            },
            fontSize: 12,
          },
          emphasis: {
            label: {
              show: true,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: true,
          },
          data: seriesData,
        },
      ],
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
.pie {
  overflow: hidden;
}
</style>