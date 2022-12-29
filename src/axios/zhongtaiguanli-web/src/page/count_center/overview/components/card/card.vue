<template>
  <div class="card" v-loading="loading">
    <div class="head">
      <div class="title">
        <div class="text">{{ title }}</div>
        <el-tooltip class="desc" effect="dark" v-if="!!desc" placement="right">
          <div slot="content" class="tooltip-content" v-html="desc"></div>
          <i class="el-icon-info"></i>
        </el-tooltip>
      </div>
      <div class="rt">
        <div class="tt">
          <span class="tt-item" v-for="(item, index) in tips" :key="index">{{
            item
          }}</span>
        </div>
        <div class="form" v-if="option.length && title != '渠道日新增Top5'">
          <div class="select">
            <el-radio-group
              v-model="selected"
              @change="selectChange"
              size="mini"
            >
              <el-radio-button
                v-for="item in option"
                :key="item.label"
                :label="item.value"
                :value="item.value"
                >{{ item.label }}</el-radio-button
              >
            </el-radio-group>
          </div>
        </div>
        <div class="form" v-if="title == '渠道日新增Top5'">
          <div class="select">
            <el-select v-model="selectdate" @change="selectChange">
              <el-option
                v-for="item in option"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div class="contrast" v-if="ratio.date">
      <div class="head">
        <div class="date">
          <span class="key">{{ ratio.date.key }}</span>
          <span class="value">{{ ratio.date.value }}</span>
        </div>
        <div class="two">
          <span class="key">{{ ratio.two.key }}</span>
          <span class="value">{{ ratio.two.value }}</span>
        </div>
      </div>
      <div class="item-list">
        <div class="item" :class="upOrDwon(ratio.ratio.status)">
          <span class="key">环比</span>
          <span class="value">{{ ratio.ratio.value }}</span>
        </div>
        <div class="item" :class="upOrDwon(ratio.weekRatio.status)">
          <span class="key">周同比</span>
          <span class="value">{{ ratio.weekRatio.value }}</span>
        </div>
        <div class="item" :class="upOrDwon(ratio.monthRatio.status)">
          <span class="key">月同比</span>
          <span class="value">{{ ratio.monthRatio.value }}</span>
        </div>
      </div>
    </div>
    <div class="chart">
      <component
        :is="component"
        :propsData="chartData"
        v-if="chartData.requestEnd"
        :echartsProp="echartsProp"
      ></component>
    </div>
  </div>
</template>

<script>
import { upOrDwon } from "../../utils";
export default {
  props: {
    title: String,
    tips: {
      type: Array,
      default: () => [],
    },
    option: {
      type: Array,
      default: () => [],
    },
    echartsProp: {
      type: Object,
      default: () => {},
    },
    request: {
      type: Function,
      default: () => {},
    },
    desc: {
      type: String,
      default: "",
    },
    component: Object,
  },
  data() {
    return {
      upOrDwon,
      loading: true,
      ratio: {},
      selected: "1",
      chartData: {},
      selectdate:7
    };
  },
  mounted() {
    if (this.title == "渠道日新增Top5" && this.option.length) {
      this.selected = this.option[0].value;
    }
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      let select = this.option.length ? this.selected : null;
      let date =
        this.option.length && this.title == "渠道日新增Top5"
          ? this.option[this.selectdate - 1].label
          : null;
/*       this.selectdate = date */
      this.request({ select, date }).then((res) => {
        let { echarts, ratio } = res[1];
        if (res[2] == 1) {
          if (!echarts) {
            return;
          }
          this.chartData = echarts;
          if (ratio) {
            this.ratio = ratio;
          }
          this.chartData.requestEnd = true;
          this.loading = false;
        }
      });
    },
    selectChange() {
      this.chartData = {};
      console.log(this.selected);
      console.log(this.selectdate);
      this.getData();
    },
  },
};
</script>

<style lang='scss' scoped>
h3,
p {
  margin: 0;
  padding: 0;
}

.card {
  min-width: 480px;
  // max-width: 480px;
  min-height: 270px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
  border-radius: 4px;
  padding: 15px;
}

.head {
  display: flex;

  .title {
    display: flex;
    align-items: center;

    .text {
      font-size: 15px;
    }

    .desc {
      margin-left: 10px;
    }
  }

  .rt {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .tt {
      font-size: 14px;
      color: #9fa2a7;

      .tt-item {
        margin-right: 10px;
      }
    }

    .form {
      /deep/ .select {
        .el-input {
          width: 110px;
        }

        .el-input__inner,
        .el-input__icon {
          height: 20px;
          line-height: 20px;
        }
      }
    }
  }
}

.contrast {
  font-size: 14px;
  margin-top: 25px;
  padding-left: 11px;

  .head {
    display: flex;
    align-items: center;

    .date {
      margin-right: 45px;
      color: #232528;
    }

    .two {
      .key {
        font-size: 14px;
        color: #5a5c60;
        margin-right: 10px;
      }

      .value {
        font-size: 24px;
      }
    }
  }

  .item-list {
    margin-top: 15px;
    display: flex;
    flex-wrap: wrap;

    .item {
      margin-right: 45px;

      .key {
        color: #8d929c;
        margin-right: 11px;
      }

      .value {
        color: #385bf1;
      }

      &:nth-child(4n + 1) {
        margin-bottom: 20px;
      }
    }

    .up {
      .value {
        color: #ea5454;
      }
    }
  }
}

.chart {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>