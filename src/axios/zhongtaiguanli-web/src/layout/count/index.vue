<template>
  <div class="count-wrap">
    <slot name="title"></slot>
    <div class="count-option">
      <el-form :inline="true">
        <el-row>
          <slot name="option"></slot>
          <div class="cetent">
            <slot name="cetent"></slot>
          </div>
        </el-row>
      </el-form>
      <div class="extra">
        <slot name="extra">
          <div v-if="Object.keys(countInfo).length" class="tag">
            <div class="tag-item">
              <div class="name">{{ countShow }}</div>
              <div class="value">{{ countInfo.total }}</div>
            </div>
            <div class="tag-item">
              <div class="name">平均:</div>
              <div class="value">{{ countInfo.avg }}</div>
            </div>
          </div>
        </slot>
      </div>
      <div class="extra">
        <slot name="extras">
          <div
            v-if="countInfoArr.length <= 2 && countInfoArr.length"
            class="tags"
          >
            <div
              v-for="(item, index) in countInfoArr"
              :key="index"
              style="display: flex"
            >
              <div class="tag-item" style="font-weight: bolder">
                {{ item.name }}：
              </div>
              <div class="tag-item">
                <div class="name">合计</div>
                <!-- <div class="value">{{ parseFloat(item.total).toLocaleString() }}</div> -->
                <div class="value">
                  {{ item.total | countInfoFilters(item) }}
                </div>
              </div>
              <div class="tag-item">
                <div class="name">均值:</div>
                <div class="value">{{ item.avg | countInfoFilters(item) }}</div>
              </div>
            </div>
          </div>
          <div
            v-if="countInfoArr.length > 2 && countInfoArr.length"
            class="tags"
          >
            <div
              v-for="(item, index) in countInfoArr.slice(0, 2)"
              :key="index"
              style="display: flex"
            >
              <div class="tag-item" style="font-weight: bolder">
                {{ item.name }}：
              </div>
              <div class="tag-item">
                <div class="name">合计</div>
                <div class="value">
                  {{ item.total | countInfoFilters(item) }}
                </div>
              </div>
              <div class="tag-item">
                <div class="name">均值:</div>
                <div class="value">{{ item.avg | countInfoFilters(item) }}</div>
              </div>
            </div>
            <el-dropdown style="z-index: 9999">
              <span class="el-dropdown-link">
                详情<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in countInfoArr.slice(2)"
                  :key="index"
                >
                  {{ item.name }}： 合计{{
                    item.total | countInfoFilters(item)
                  }}，均值 {{ item.avg | countInfoFilters(item) }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </slot>
      </div>
    </div>
    <div ref="count" style="width: 100%; height: 400px"></div>
    <slot name="option-two"></slot>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";
export default {
  name: "countLayout",
  props: {
    type: {
      validator: function (value) {
        return ["line", "bar", "newBar", "mix", "newMix"].indexOf(value) !== -1;
      },
      default: "line",
    },
    option: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    countInfo: {
      type: Object,
      default: () => ({}),
    },
    countInfoArr: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      countShow: "合计:",
      $count: null,
    };
  },
  mounted() {
    this.$count = this.$echarts.init(this.$refs.count);

    window.onresize = () => {
      this.$count && this.$count.resize();
    };

    if (this.type === "bar") {
      this.drawBarCount();
      return;
    }

    if (this.type === "newBar") {
      this.drawNewBarCount();
      return;
    }

    if (this.type === "mix") {
      this.drawMixCount();
      return;
    }
    if (this.type === "newMix") {
      this.drawNewMixCount();
    }

    this.drawCount();
  },
  watch: {
    option(opt) {
      if (this.type === "bar") {
        this.drawBarCount(opt);
        return;
      }

      if (this.type === "newBar") {
        this.drawNewBarCount(opt);
        return;
      }

      if (this.type === "mix") {
        this.drawMixCount();
        return;
      }
      if (this.type === "newMix") {
        this.drawNewMixCount();
        return;
      }

      this.drawCount(opt);
    },
    loading(val) {
      val ? this.$count.showLoading() : this.$count.hideLoading();
    },
  },
  filters: {
    countInfoFilters(val, item) {
      // 因为toLocaleString默认是保留3位小数，使用此方法动态获取小数点位数并做保留，小数点后有多少就保留多少
      let arr = _.cloneDeep(val+'').split(".");
      if (item.hasPercentSign) {
        return parseFloat(val).toLocaleString() + "%";
      } else {
        return parseFloat(val).toLocaleString("zh", {
          minimumFractionDigits: arr.length > 1 ? arr[1].length : 0,
        });
      }
    },
  },
  methods: {
    drawCount(opt = this.option) {
      const {
        editData,
        legendData = [],
        xAxisData = [],
        data = [],
        yName = "",
        yScale = false,
        formatter = (f) => f,
        xName = "",
      } = opt;
      if (yName === "百分比") {
        this.countShow = "";
      } else {
        this.countShow = "合计:";
      }
      const { type } = this;
      let _data;
      if (editData) {
        let list = [];
        for (let key in data) {
          let arr = {};
          arr.name = key;
          arr.data = [];
          for (let j in data[key]) {
            arr.data.push(data[key][j]);
          }
          list.push(arr);
        }
        _data = list.map((v) => {
          return {
            name: v.name,
            type: type,
            symbolSize: "7",
            smooth: true,
            showAllSymbol: true,
            hoverAnimation: false,
            data: v.data.map((_v, _i) => {
              const week = xAxisData ? moment(String(_v.date)).format("E") : 0;
              return {
                value: String(_v.value),
                cycle: _v.cycle,
                rate: _v.rate,
                symbol: week === "6" || week === "7" ? "circle" : "emptyCircle",
              };
            }),
          };
        });
      } else {
        _data = data.map((v) => {
          return {
            name: v.name,
            type: type,
            symbolSize: "7",
            smooth: true,
            showAllSymbol: true,
            hoverAnimation: false,
            data: v.data.map((_v, _i) => {
              const week = xAxisData ? moment(xAxisData[_i]).format("E") : 0;
              return {
                value: _v,
                symbol: week === "6" || week === "7" ? "circle" : "emptyCircle",
              };
            }),
          };
        });
      }
      this.$count.clear();
      this.$count.setOption({
        tooltip: {
          trigger: "axis",
          borderRadius: 6,
          formatter: (data) => {
            // let rs = `${moment(data[0].name).format('YYYY-MM-DD')}<br/>`;
            let rs = `${data[0].name} <br/>`;
            data.length &&
              data.forEach((v) => {
                let cunt = yName === "百分比" ? "%" : "";
                let text =
                  v.data.rate === undefined
                    ? ""
                    : `同比：${v.data.rate}% 环比：${v.data.cycle}% <br/>`;
                rs += editData
                  ? v["seriesName"] +
                    ": " +
                    formatter(v["value"]) +
                    cunt +
                    "<br>" +
                    text
                  : v["seriesName"] + ": " + formatter(v["value"]) + "<br>";
              });
            return rs;
          },
        },
        noDataLoadingOption: {
          text: "暂无数据",
          effect: "bubble",
          effectOption: {
            effect: {
              n: 0,
            },
          },
        },
        legend: {
          data: legendData,
        },
        grid: {
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          name: xName,
          data: xAxisData,
          axisLabel: {
            fontSize: 12,
            color: "#8C8C8C",
          },
        },
        yAxis: {
          type: "value",
          name: yName,
          scale: yScale,
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          axisLabel: {
            fontSize: 13,
            color: "#8C8C8C",
            padding: [0, 10, 0, 0],
            formatter: (v) => {
              let cunt = yName === "百分比" ? "%" : "";
              return formatter && formatter(v) + cunt;
            },
          },
        },
        series: _data,
      });
    },
    drawBarCount(opt = this.option) {
      const {
        xAxis = [],
        yAxis = [],
        series = [],
        legend = [],
        tooltip = {
          trigger: "axis",
          borderRadius: 6,
        },
      } = opt;
      this.$count.clear();
      this.$count.setOption({
        color: ["#3398DB"],
        tooltip,
        legend,
        grid: {
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis,
        yAxis,
        series,
      });
    },
    drawNewBarCount(opt = this.option) {
      const {
        legendData = [],
        xAxisData = [],
        data = [],
        yName = "",
        allName = "合计",
        yScale = false,
        formatter = (res) => {
          if (res.length) {
            let html = `${res[0].axisValueLabel}<br/>`;
            let all = 0;

            res.forEach((v) => {
              all += Number(v.value);
              all = Number(all.toFixed(2));
              html += `${v.marker}${v.seriesName}：${v.value}<br/>`;
            });
            if (allName) {
              return html + `${allName}：${all.toFixed(2)}<br/>`;
            } else {
              return html;
            }
          }

          return "";
        },
      } = opt;

      let _data = data.map((item) => ({
        type: "bar",
        stack: "two",
        name: item.name,
        data: item.data,
        label: item.showlabel
          ? {
              normal: {
                show: true,
                position: "top",
                textStyle: {
                  color: "#000",
                },
              },
            }
          : "",
      }));

      this.$count.clear();
      this.$count.setOption({
        tooltip: {
          trigger: "axis",
          borderRadius: 6,
          axisPointer: {
            type: "shadow",
          },
          formatter: (data) => {
            return formatter(data);
          },
        },
        legend: {
          data: legendData,
        },
        grid: {
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: xAxisData,
          axisLabel: {
            fontSize: 12,
            color: "#8C8C8C",
          },
        },
        yAxis: {
          type: "value",
          name: yName,
          scale: yScale,
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          axisLabel: {
            fontSize: 13,
            color: "#8C8C8C",
            padding: [0, 10, 0, 0],
          },
        },
        color: ["#5291EC", "#16C06F", "#FFC706", "#8267DB", "#FF6573"],
        series: _data,
      });
    },
    drawMixCount(opt = this.option) {
      const {
        legendData = [],
        xAxisData = [],
        data = [],
        yAxis = {},
        formatter = (res) => {
          if (res.length) {
            let html = `${res[0].axisValueLabel}<br/>`;
            let all = 0;

            res.forEach((v) => {
              all += Number(v.value);
              html += `${v.marker}${v.seriesName}：${v.value}<br/>`;
            });

            return html + `合计：${all}<br/>`;
          }

          return "";
        },
      } = opt;

      this.$count.clear();
      this.$count.setOption({
        tooltip: {
          trigger: "axis",
          borderRadius: 6,
          axisPointer: {
            type: "shadow",
          },
          formatter: (data) => {
            return formatter(data);
          },
        },
        legend: {
          data: legendData,
        },
        grid: {
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: xAxisData,
          axisLabel: {
            fontSize: 12,
            color: "#8C8C8C",
          },
        },
        yAxis: yAxis,
        color: ["#5291EC", "#FFC706", "#8267DB", "#16C06F", "#FF6573"],
        series: data,
      });
    },
    drawNewMixCount(opt = this.option) {
      const {
        legendData = [],
        xAxisData = [],
        data = [],
        yAxis = {},
        formatter = (res) => {
          return "";
        },
      } = opt;
      console.log(data);
      formatter;
      let colorList = ["#FF981F", "#5291ec"];
      let _data;
      _data = data.map((v, i) => {
        return {
          name: v.name,
          type: "line",
          symbolSize: "7",
          smooth: true,
          showAllSymbol: true,
          hoverAnimation: false,
          yAxisIndex: v.yAxisIndex,
          data: v.data.map((_v, _i) => {
            const week = xAxisData ? moment(xAxisData[_i]).format("E") : 0;
            return {
              value: _v,
              symbol: week === "6" || week === "7" ? "circle" : "emptyCircle",
            };
          }),
          itemStyle:
            data.length == 1
              ? {
                  color: "#FF981F",
                }
              : data.length == 2
              ? { color: colorList[i] }
              : {},
        };
      });
      console.log(_data);
      this.$count.clear();
      console.log(xAxisData,yAxis);
      this.$count.setOption({
        tooltip: {
          trigger: "axis",
          formatter: (data) => {
            return formatter(data);
          },
        },
        legend: {
          data: legendData,
        },
        grid: {
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: xAxisData,
          axisLabel: {
            fontSize: 12,
            color: "#8C8C8C",
          },
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: yAxis,
        color: ["#FFC706", "#5291EC", "#8267DB", "#16C06F", "#FF6573"],
        series: _data,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.count-wrap {
  background-color: #fff;
  margin-top: 20px;
  padding: 20px 0;

  .count-option {
    position: relative;
    min-height: 40px;
    margin-bottom: 30px;

    .cetent {
      display: flex;
      position: absolute;
      width: 300px;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    .extra {
      position: absolute;
      right: 20px;
      top: 0;
      font-size: 12px;
      text-align: right;
      display: flex;
      align-items: center;

      .tag {
        display: flex;
        align-items: center;

        .tag-item + .tag-item {
          margin-left: 4px;
        }

        .tag-item {
          display: flex;
          align-items: center;

          .name {
            font-weight: bold;
            margin-right: 2px;
            font-size: 14px;
          }
        }
      }

      .tags {
        position: absolute;
        bottom: -110px;
        right: 0;
        min-width: 460px;

        .tag-item + .tag-item {
          margin-left: 4px;
        }

        .tag-item {
          display: flex;
          align-items: center;

          .name {
            font-weight: bold;
            margin-right: 2px;
            font-size: 14px;
          }
        }
      }
    }

    /deep/.el-col {
      .el-form-item {
        width: 100%;
        display: flex;
        padding: 0 20px;

        .el-form-item__content {
          flex: 1;
          text-align: left;

          .el-select {
            width: 100%;
          }

          .el-range-editor.el-input__inner {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
