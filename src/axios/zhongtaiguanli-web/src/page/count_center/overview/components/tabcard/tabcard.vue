<template>
  <div class="tabcard">
    <div class="tab-list">
      <div
        class="tab-item"
        v-for="(tab, index) in tabData"
        :class="{ selected: currentTab == index }"
        :key="index"
        @click="onSelected(index, tab.id)"
      >
        <p class="title">{{ tab.title }}</p>
        <div class="fiexed-text" v-show="index == 0">实时数据</div>
        <div class="main">
          <p class="today">
            <span>{{ tab.data.today.title }}</span>
            <span class="value">{{ tab.data.today.value }}</span>
          </p>
          <p class="yesterday">
            <span>{{ tab.data.yesterday.title }}</span>
            <span class="value">{{ tab.data.yesterday.value }}</span>
          </p>
          <p class="ratio">
            <span>{{ tab.data.ratio.title }}</span>
            <span class="value" :class="upOrDwon(tab.data.status)">
              {{ tab.data.ratio.value }}
              <i class="iconfont" :class="upOrDwonIcon(tab.data.status)"></i>
            </span>
          </p>
        </div>
      </div>
    </div>
    <div class="chart">
      <div class="filter">
        <el-select
          v-model="select"
          placeholder="请选择"
          class="select"
          @change="selectChange"
          :disabled="selectDisabled"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          type="dates"
          :picker-options="pickerOptions"
          v-model="dates"
          value-format="yyyyMMdd"
          :clearable="false"
          placeholder="选择日期"
          prefix-icon="el-icon-plus"
          class="picker"
          :disabled="disabled"
          @change="pickerChange"
          v-if="name == 'basic'"
        ></el-date-picker>
        <el-date-picker
          type="dates"
          :picker-options="pickerOptions"
          v-model="dates"
          value-format="yyyyMMdd"
          :clearable="false"
          placeholder="选择日期"
          prefix-icon="el-icon-plus"
          class="picker"
          :disabled="disabled"
          @change="pickerChange"
          v-if="name == 'income'"
        ></el-date-picker>
      </div>
      <div class="line" v-loading="loading">
        <div id="chart" style="width: 100%; height: 280px"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { upOrDwon, upOrDwonIcon } from "../../utils";
import echarts from "echarts";
import moment from "moment";
export default {
  props: {
    name: {
      type: String,
      default: "basic",
    },
    tabData: [Array, Object],
    options: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: () => {},
    },
    request: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      getChartDataFlag:false, // 图表是否正在请求，防止重复
      currentTab: 0,
      upOrDwonIcon,
      upOrDwon,
      loading: true,
      select: this.tabData[0].select || this.name === "income" ? "4" : "1",
      dates: [],
      settingId: this.tabData[0].id,
      myChart: null,
      selectDisabled: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  mounted() {
    this.getChartData();

    window.onresize = () => {
      this.myChart.resize();
    };
  },
  beforeDestroy() {
    if (this.myChart) {
      echarts.dispose(this.myChart);
      this.myChart = null;
    }

    window.onresize = null;
  },
  methods: {
    getChartData() {
      // 防止重复请求
      if(this.getChartDataFlag) return
      this.getChartDataFlag = true
      let form = {
        select: this.select,
        settingId: this.settingId,
      };
      if (this.name == "basic") {
        form.dates = this.dates;
      }
      if (this.name == "income") {
        form.dates = this.dates;
      }
      if (this.myChart) {
        this.myChart.showLoading({
          text: "请稍等...",
          color: "rgba(250, 171, 78, 1)",
        });
        this.myChart.clear();
      }

      this.$emit("appChange");
      this.request(form).then((res) => {
        this.$emit("onChangeAppSelect");
        this.getChartDataFlag = false
        if (res[2] == 1) {
          let { series, xAxis } = res[1];
          this.loading = false;
          this.initChart(series, xAxis);
          this.selectDisabled = false;
        }
      }).catch(err=>{
        this.getChartDataFlag = false
      });
    },
    onSelected(index, id) {
      this.currentTab = index;
      this.settingId = id;
      this.select = this.tabData[0].select || "1";
      this.dates = [];
      this.getChartData();
      this.$emit("onSwitchTab", index);
    },
    pickerChange(e) {
      const MAX_NUMBER = 5; // 最多可以选择几个时间
      let len = this.dates.length;
      if (len > MAX_NUMBER) {
        this.dates.sort().splice(5, len - MAX_NUMBER);
        this.$message({
          message: "最多只能选5个时间",
          type: "warning",
        });
      }
      this.getChartData();
    },
    selectChange() {
      this.selectDisabled = true;
      this.dates = [];
      this.getChartData();
    },
    initChart(series, xAxis) {
      let seriesData = series.map(({ name, data }, index) => {
        if (series.length > 1) {
          if (name == moment().format("YYYYMMDD")) {
            return {
              name,
              type: "line",
              itemStyle: {
                color: "#f06a23",
              },
              lineStyle: {
                type: "solid",
              },
              symbolSize: "0",
              smooth: true,
              showAllSymbol: true,
              data: data.map((item, index) => {
                const week = xAxis
                  ? moment(String(xAxis.data[index])).format("E")
                  : 0;
                return {
                  value: data[index],
                  symbol:
                    week === "6" || week === "7" ? "circle" : "emptyCircle",
                };
              }),
              areaStyle: {
                color: "#f99629",
              },
            };
          } else {
            return {
              name,
              type: "line",
              lineStyle: {
                type: "dashed",
              },
              symbolSize: "0",
              smooth: true,
              showAllSymbol: true,
              data: data.map((item, index) => {
                const week = xAxis
                  ? moment(String(xAxis.data[index])).format("E")
                  : 0;
                return {
                  value: data[index],
                  symbol:
                    week === "6" || week === "7" ? "circle" : "emptyCircle",
                };
              }),
            };
          }
        } else {
          return {
            name,
            type: "line",
            lineStyle: {
              type: "solid",
            },
            symbolSize: 7,
            symbol: "circle",
            data: data.map((item, index) => {
              let week = xAxis
                ? moment(String(xAxis.data[index])).format("E")
                : 0;
              return {
                value: data[index],
                symbol: week === "6" || week === "7" ? "circle" : "emptyCircle",
              };
            }),
          };
        }
      });
      this.myChart = echarts.init(document.getElementById("chart"));
      // 指定图表的配置项和数据
      var option = {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: 55,
          right: 55,
          width: "auto",
        },
        xAxis: {
          type: "category",
          data: xAxis.data,
          boundaryGap: false,
          axisTick: {
            lineStyle: {
              opacity: "0",
            },
          },
          axisLine: {
            lineStyle: {
              color: "#AEB6C1",
            },
          },
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          axisLine: {
            lineStyle: {
              color: "#AEB6C1",
            },
          },
          axisTick: {
            lineStyle: {
              opacity: "0",
            },
          },
        },
        series: seriesData,
      };

      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option);
      this.myChart.hideLoading();
    },
  },
  watch: {
    $route(to, from) {
      if (to.name === "overview_basic_basic") {
        setTimeout(() => {
          this.getChartData();
        }, 500);
      }
    },
  },
  computed: {
    disabled() {
      return this.select != this.options[0].value;
    },
    title() {
      let basic = ["今日", "昨日"];
      let income = ["昨日", "前日"];
      return this.name == "basic" ? basic : income;
    },
  },
};
</script>

<style lang='scss' scoped>
@import url("https://at.alicdn.com/t/font_2045734_4911j3gnbvk.css");
p {
  margin: 0;
}

.tabcard {
  display: flex;
  flex-direction: column;
}

.tab-list {
  display: flex;
  margin-bottom: 20px;

  .tab-item {
    width: 312px;
    margin-right: 12px;
    font-size: 14px;
    padding: 15px;
    border-radius: 4px;
    border: 1px solid #ebebeb;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      background: #fff7ed;
      border: 1px solid #ffc580;
    }
    .fiexed-text {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 12px;
    }
    .title {
      font-size: 16px;
    }

    .main {
      width: 100%;
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .iconfont {
        font-size: 22px;
      }

      .value {
        margin-left: 8px;
      }

      .today {
        .value {
          font-size: 24px;
        }
      }

      .yesterday {
        .value {
          font-size: 16px;
        }
      }
      .ratio {
        .value {
          font-size: 14px;
        }
        .up {
          color: #ea5454;
        }
        .down {
          color: #17bf5e;
        }
      }
    }
  }
}

.chart {
  /deep/ .filter {
    .el-input {
      width: 130px;
    }
    display: flex;
    .select {
      margin-right: 20px;
    }
    .picker {
      font-size: 12px;
    }
  }
}

.tab-list {
  .selected {
    background: linear-gradient(134deg, #f99629 0%, #f06a23 100%) !important;
    border: none !important;
    color: #fff;
    .main {
      .value {
        color: #fff !important;
      }
    }
  }
}
</style>