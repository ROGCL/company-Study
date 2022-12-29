<template>
  <div class="bar1">
    <div :id="id" style="width: 100%; height: 270px"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  props: ["propsData", "echartsProp"],
  mounted() {
    let { inverse } = this.echartsProp;
    let { yAxis, series } = this.propsData;

    let yAxisData = yAxis.data;

    let seriesData = series.data;
    var myChart = echarts.init(document.getElementById(this.id));
    // 指定图表的配置项和数据
    var option = {
      backgroundColor: "#fff",
      tooltip: {
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        top: 17,
        bottom: 47,
        x:130
      },
      yAxis: {
        type: "category",
        data: yAxisData,
        inverse: inverse, //使y轴翻转
        axisTick: {
          lineStyle: {
            opacity: "0",
          },
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          // 坐标轴刻度标签换行处理
          formatter: function (params) {
            var newParamsName = ""; // 最终拼接成的字符串
            var paramsNameNumber = params.length; // 实际标签的个数
            var provideNumber = 18; // 每行能显示的字的个数
            var rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
            /**
             * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
             */
            // 条件等同于rowNumber>1
            if (paramsNameNumber > provideNumber) {
              /** 循环每一行,p表示行 */
              for (var p = 0; p < rowNumber; p++) {
                var tempStr = ""; // 表示每一次截取的字符串
                var start = p * provideNumber; // 开始截取的位置
                var end = start + provideNumber; // 结束截取的位置
                // 此处特殊处理最后一行的索引值
                if (p == rowNumber - 1) {
                  // 最后一次不换行
                  tempStr = params.substring(start, paramsNameNumber);
                } else {
                  // 每一次拼接字符串并换行
                  tempStr = params.substring(start, end) + "\n";
                }
                newParamsName += tempStr; // 最终拼成的字符串
              }
            } else {
              // 将旧标签的值赋给新标签
              newParamsName = params;
            }
            //将最终的字符串返回
            return newParamsName;
          },
        },
      },
      xAxis: {
        show: false,
        type: "value",
      },
      series: [
        {
          barWidth: "18",
          data: seriesData,
          type: "bar",
          label: {
            show: true,
            position: "right",
          },
          itemStyle: {
            color: "#FAAB4E",
          },
        },
      ],
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  },
  computed: {
    id() {
      return Math.random();
    },
  },
};
</script>

<style scoped>
.bar1 {
  overflow: hidden;
}
</style>