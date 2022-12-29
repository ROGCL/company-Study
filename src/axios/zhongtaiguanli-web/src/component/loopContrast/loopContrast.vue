<template>
  <div class="loopContrast" :style="style">
    <div class="top">
      <h2 class="title">{{ title }} 数据总览</h2>
      <el-tooltip class="item" effect="dark" placement="right" v-if="tooltip">
        <div slot="content" class="tooltip-content">
          <p>不同时间刻度下同比和环比的定义</p>
          <p>
            天：环比=(昨天 - 前天) / 前天 * 100%； 同比=(昨天 - 上周同天) /
            上周同天 * 100%
          </p>
          <p>
            周：环比=(上自然周 - 上上自然周) / 上上自然周 * 100%；
            同比=(上自然周 - 三周前的自然周) / 三周前的自然周* 100%
          </p>
          <p>
            月：环比=(上个自然月 - 上上自然月) / 上上自然月 * 100%；
            同比=(本年上个自然月 - 去年同期自然月 ) / 去年同期自然月 * 100%
          </p>
          <p>
            季度：环比=(上个季度 - 上上季度) / 上上季度 * 100%；
            同比=(本年上个季度 - 去年同期季度 ) / 去年同期季度 * 100%
          </p>
        </div>
        <i class="el-icon-info"></i>
      </el-tooltip>
    </div>
    <div class="middle">
      <p class="channel">渠道：{{ channelFilter }}</p>
      <p class="date">时间：{{ date }}</p>
    </div>
    <div class="list-wrap">
      <div class="list" v-for="(item, index) in list" :key="index">
        <div class="left">
          <h3 class="title">{{ item.title }}</h3>
          <p class="num">{{ item.this }}</p>
        </div>
        <div class="right">
          <div class="rate">
            同比：
            <p class="tt-wrap" :class="upOrDown(item.rate).class">
              <i v-text="upOrDown(item.rate).icon"></i>
              <span>{{ item.rate }}%</span>
            </p>
          </div>
          <div class="cycle">
            环比：
            <p class="tt-wrap" :class="upOrDown(item.cycle).class">
              <i v-text="upOrDown(item.cycle).icon"></i>
              <span>{{ item.cycle }}%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "loopContrast",
  props: {
    styleList: {
      type: Array,
      default: () => [],
    },
    tooltip: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: "",
    },
    channel: {
      type: [String, Array],
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      defaultStyle: {},
    };
  },
  created() {
    this.bindStyle();
  },
  methods: {
    bindStyle() {
      this.defaultStyle = {
        border: " 1px solid #ddd",
      };
    },
    upOrDown(num) {
      if (num > 0) {
        return {
          icon: "↑",
          class: "up",
        };
      } else {
        return {
          icon: "↓",
          class: "down",
        };
      }
    },
  },
  computed: {
    style() {
      let style = "";
      for (const key in this.defaultStyle) {
        this.styleList.forEach((item) => {
          if (this.defaultStyle[item]) {
            style += `${key}: ${this.defaultStyle[key]}`;
          }
        });
      }
      return style;
    },
    channelFilter() {
      return this.channel instanceof Array
        ? this.channel.join(",")
        : this.channel;
    },
  },
};
</script>

<style lang='scss' scoped>
* {
  margin: 0;
}

.loopContrast {
  background-color: #fff;
  padding: 20px;
  margin: 20px 0;
  .top {
    display: flex;
    align-items: center;
    .title {
      font-size: 18px;
      margin-right: 10px;
    }
  }
  .middle {
    margin: 10px 0;
    font-size: 14px;
    .date {
      margin-bottom: 20px;
    }
  }
  .list-wrap {
    display: flex;
    flex-wrap: wrap;
    .list {
      display: flex;
      width: 25%;
      &:nth-child() {
        justify-content: center;
      }
      margin-bottom: 20px;
      .title {
        font-size: 16px;
      }
      .left,
      .right {
        height: 50px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: center;
        .num {
          font-size: 18px;
        }
      }
      .left {
        margin-right: 10px;
      }
      .right {
        font-size: 16px;
        .rate,
        .cycle {
          display: flex;
        }
        i {
          margin-right: 5px;
        }
        .up {
          color: #ff1a4c;
        }
        .down {
          color: #44f436;
        }
      }
    }
  }
}
</style>