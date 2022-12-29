<template>
  <div id="box">
    <div class="box">
      <div class="title">
        <span :class="{ active: leftSelect === data1.length }" @click="selectAll(data1)">显示字段</span>
        <span>{{ leftSelect ? leftSelect : 0 }}/{{ data1.length }}</span>
      </div>

      <!-- <div class="search_parent">
      <div class="search_div">
        <input class="search_input" v-model="sourceData" :class="heightLight ? 'search_input_focus' : ''" type="text" @focus="heightLight=true" @blur="heightLight=false" placeholder="">
      </div>
      </div>-->

      <div @drop="dropPub($event, 2)" @dragover.prevent class="left">
        <div @drag="ondrag" @dragstart="dragstart($event, item)" @dragend="dragend" draggable="true" class="hover-color"
          :class="{ active: item.isSelect }" v-on:click="hanldleClick(data1, item.field_id)"
          v-for="item in changeSourceData" :key="item.field_id">
          {{ item.value }}
        </div>
      </div>
    </div>

    <div class="middle">
      <div v-on:click="moveItem(data2, data1, 'left')" :class="{ active: rightSelect > 0 }">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div v-on:click="moveItem(data1, data2, 'right')" :class="{ active: leftSelect > 0 }">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>

    <div class="box">
      <div class="title">
        <span :class="{ active: rightSelect === data2.length }" @click="selectAll(data2)">隐藏字段</span>
        <span>{{ rightSelect ? rightSelect : 0 }}/{{ data2.length }}</span>
      </div>

      <!-- <div class="search_parent">
      <div class="search_div">
        <input class="search_input" v-model="targetData" :class="heightLight1 ? 'search_input_focus' : ''" @focus="heightLight1=true" @blur="heightLight1=false" type="text" placeholder="请输入课件级别/编号">
      </div>
      </div>-->

      <div @drop="dropPub($event, 1)" @dragover.prevent class="right">
        <div class="hover-color" @drag="ondrag" @dragstart="dragstart($event, item)" @dragend="dragend" draggable="true"
          :class="{ active: item.isSelect }" v-on:click="hanldleClick(data2, item.field_id)"
          v-for="item in changeTargetData" :key="item.field_id">
          {{ item.value }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    sourceL: {
      type: Array,
    },
    targetR: {
      type: Array,
      default: function () {
        return [];
      },
    },
    changeData: {
      type: String,
    },
    huiyuanType: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      heightLight: false,
      heightLight1: false,
      data1: [],
      data2: [],
      target: {
        y: "",
        field_id: "",
      },
      sourceData: "",
      targetData: "",
      changeSourceData: [],
      changeTargetData: [],
      showField: [
        {
          field_id: 0,
          value: "新增",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 1,
          value: "活跃",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 2,
          value: "启动",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 3,
          value: "买量",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 4,
          value: "收入",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 5,
          value: "支出",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 6,
          value: "毛利",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 7,
          value: "毛利率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 8,
          value: "首日ROI",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 9,
          value: "ARPU值",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 10,
          value: "会员ARPU",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 11,
          value: "广告ARPU",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 12,
          value: "买量CPI",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 13,
          value: "商店CPI",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 14,
          value: "信息流CPI",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 15,
          value: "百度CPI",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 16,
          value: "人均启动频次",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 17,
          value: "新增活跃比",
          sort: 0,
        },
        {
          field_id: 18,
          value: "买量新增比",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 19,
          value: "新增用户次留",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 20,
          value: "活跃用户次留",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 21,
          value: "订单收入",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 22,
          value: "订单收入占比",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 23,
          value: "广告收入",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 24,
          value: "广告收入占比",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 25,
          value: "商店支出",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 26,
          value: "商店支出占比",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 27,
          value: "信息流支出",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 28,
          value: "信息流支出占比",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 29,
          value: "百度支出",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 30,
          value: "百度支出占比",
          sort: 0,
          isSelect: false,
        },
      ],
      adverShowField: [
        {
          field_id: 31,
          value: "广告收入",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 49,
          value: "占总收入占比",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 32,
          value: "占广告收入占比",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 33,
          value: "广告ARPU",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 34,
          value: "ECPM",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 35,
          value: "CTR",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 36,
          value: "CPC",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 37,
          value: "填充率",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 38,
          value: "展示率",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 39,
          value: "人均广告次数",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 40,
          value: "次均广告次数",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 41,
          value: "请求数（本地）",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 42,
          value: "下发数（本地）",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 43,
          value: "展示数（本地）",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 44,
          value: "点击数（本地）",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 45,
          value: "请求数（第三方）",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 46,
          value: "下发数（第三方）",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 47,
          value: "展示数（第三方）",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 48,
          value: "点击数（第三方）",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 50,
          value: "人均广告请求频次",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 51,
          value: "次均广告请求频次",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 52,
          value: "现位置人均请求频次",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 53,
          value: "现位置人均展示频次",
          sort: "0",
          isSelect: false,
        },
      ],
      sourceShowField: [
        {
          field_id: 0,
          value: "总花费",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 1,
          value: "曝光数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 2,
          value: "点击数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 3,
          value: "点击率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 4,
          value: "平均点击单价",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 5,
          value: "平均千次展现费用",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 6,
          value: "安卓下载开始数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 7,
          value: "安卓下载开始成本",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 8,
          value: "安卓下载开始率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 9,
          value: "安卓下载完成数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 10,
          value: "安卓下载完成成本",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 11,
          value: "安卓下载完成率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 12,
          value: "安卓安装完成数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 13,
          value: "安卓安装完成成本",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 14,
          value: "安卓安装完成率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 15,
          value: "激活数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 16,
          value: "激活成本",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 17,
          value: "激活率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 18,
          value: "首次付费次数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 19,
          value: "首次付费成本",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 20,
          value: "首次付费率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 21,
          value: "99%进度播放数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 22,
          value: "99%进度播放率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 23,
          value: "25%进度播放数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 24,
          value: "25%进度播放率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 25,
          value: "50%进度播放数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 26,
          value: "50%进度播放率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 27,
          value: "75%进度播放数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 28,
          value: "75%进度播放率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 29,
          value: "播放10s数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 30,
          value: "播放10s率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 31,
          value: "播放2s数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 32,
          value: "播放2s率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 33,
          value: "播放3s数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 34,
          value: "播放3s率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 35,
          value: "播放5s率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 36,
          value: "总播放时长(单位s)",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 37,
          value: "播放完成数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 38,
          value: "总播放数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 39,
          value: "播放完成率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 40,
          value: "点赞数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 41,
          value: "评论数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 42,
          value: "分享数",
          sort: 0,
          isSelect: false,
        },
      ],
      sourceShowField2: [
        {
          field_id: 0,
          value: "总花费",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 1,
          value: "曝光数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 2,
          value: "点击数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 3,
          value: "点击率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 4,
          value: "平均点击单价",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 5,
          value: "平均千次展现费用",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 6,
          value: "安卓下载开始数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 7,
          value: "安卓下载开始成本",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 8,
          value: "安卓下载开始率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 9,
          value: "安卓下载完成数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 10,
          value: "安卓下载完成成本",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 11,
          value: "安卓下载完成率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 15,
          value: "激活数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 16,
          value: "激活成本",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 17,
          value: "激活率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 18,
          value: "首次付费次数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 28,
          value: "75%进度播放率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 30,
          value: "播放10s率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 32,
          value: "播放2s率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 34,
          value: "播放3s率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 35,
          value: "播放5s率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 39,
          value: "播放完成率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 19,
          value: "首次付费成本",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 20,
          value: "首次付费率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 40,
          value: "点赞数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 41,
          value: "评论数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 42,
          value: "分享数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 43,
          value: "次留数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 44,
          value: "次留成本",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 45,
          value: "次留率",
          sort: 0,
          isSelect: false,
        },
      ],
      sourceShowField3: [
        {
          field_id: 1,
          value: "新增",
          sort: "28",
          isSelect: false,
        },
        {
          field_id: 55,
          value: "实际消耗",
          sort: "27",
          isSelect: false,
        },
        {
          field_id: 2,
          value: "账面消耗",
          sort: "27",
          isSelect: false,
        },
        {
          field_id: 56,
          value: "返点金额",
          sort: "27",
          isSelect: false,
        },
        {
          field_id: 3,
          value: "激活成本",
          sort: "26",
          isSelect: false,
        },
        {
          field_id: 4,
          value: "下单数",
          sort: "25",
          isSelect: false,
        },
        {
          field_id: 5,
          value: "下单率",
          sort: "24",
          isSelect: false,
        },
        {
          field_id: 6,
          value: "支付成功数",
          sort: "23",
          isSelect: false,
        },
        {
          field_id: 7,
          value: "支付成功率",
          sort: "22",
          isSelect: false,
        },
        {
          field_id: 8,
          value: "付费成本",
          sort: "21",
          isSelect: false,
        },
        {
          field_id: 9,
          value: "激活付费率",
          sort: "20",
          isSelect: false,
        },
        {
          field_id: 10,
          value: "总收入",
          sort: "19",
          isSelect: false,
        },
        {
          field_id: 11,
          value: "总收入ROI",
          sort: "18",
          isSelect: false,
        },
        {
          field_id: 12,
          value: "订单收入",
          sort: "17",
          isSelect: false,
        },
        {
          field_id: 29,
          value: "广告收入",
          sort: "16",
          isSelect: false,
        },
        {
          field_id: 13,
          value: "客单价",
          sort: "15",
          isSelect: false,
        },
        {
          field_id: 14,
          value: "组件曝光",
          sort: "14",
          isSelect: false,
        },
        {
          field_id: 15,
          value: "组件点击",
          sort: "13",
          isSelect: false,
        },
        {
          field_id: 16,
          value: "点击率",
          sort: "12",
          isSelect: false,
        },
        {
          field_id: 17,
          value: "点击激活率",
          sort: "11",
          isSelect: false,
        },
        {
          field_id: 18,
          value: "ecpm",
          sort: "10",
          isSelect: false,
        },
        {
          field_id: 28,
          value: "播放量",
          sort: "9",
          isSelect: false,
        },
        {
          field_id: 19,
          value: "有效播放率",
          sort: "8",
          isSelect: false,
        },
        {
          field_id: 20,
          value: "完播率",
          sort: "7",
          isSelect: false,
        },
        {
          field_id: 21,
          value: "平均播放率",
          sort: "6",
          isSelect: false,
        },
        {
          field_id: 22,
          value: "负向评论率",
          sort: "5",
          isSelect: false,
        },
        {
          field_id: 23,
          value: "中立评论率",
          sort: "4",
          isSelect: false,
        },
        {
          field_id: 24,
          value: "正向评论率",
          sort: "3",
          isSelect: false,
        },
        {
          field_id: 25,
          value: "评论量",
          sort: "2",
          isSelect: false,
        },
        {
          field_id: 26,
          value: "点赞量",
          sort: "1",
          isSelect: false,
        },
        {
          field_id: 27,
          value: "分享量",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 58,
          value: "cpc",
          sort: "0",
          isSelect: false,
        },
        {
          field_id: 59,
          value: "组件ecpm",
          sort: "0",
          isSelect: false,
        },
      ],
      huiyuan1: [
        {
          field_id: 50,
          value: "总充值金额",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 51,
          value: "新用户充值金额",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 52,
          value: "老用户充值金额",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 57,
          value: "新用户充值金额占比",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 58,
          value: "老用户充值金额占比",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 59,
          value: "总arpu",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 60,
          value: "总付费率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 61,
          value: "客单价",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 62,
          value: "会员页到达率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 63,
          value: "会员下单率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 64,
          value: "支付成功率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 56,
          value: "日活",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 65,
          value: "会员页uv",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 53,
          value: "下单uv",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 54,
          value: "支付成功uv",
          sort: 0,
          isSelect: false,
        },
      ],
      huiyuan2: [
        {
          field_id: 57,
          value: "新用户充值金额占比",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 51,
          value: "新用户充值金额",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 59,
          value: "新用户arpu",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 60,
          value: "新用户付费率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 68,
          value: "新用户会员价值",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 61,
          value: "新用户客单价",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 69,
          value: "激活注册率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 62,
          value: "会员页到达率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 63,
          value: "会员下单率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 64,
          value: "支付成功率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 55,
          value: "新增",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 65,
          value: "新用户会员页uv",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 53,
          value: "新用户下单uv",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 54,
          value: "新用户支付成功uv",
          sort: 0,
          isSelect: false,
        },
      ],
      huiyuan3: [
        {
          field_id: 58,
          value: "老用户充值金额占比",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 52,
          value: "老用户充值金额",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 59,
          value: "老用户arpu",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 60,
          value: "老用户付费率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 68,
          value: "老用户会员价值",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 61,
          value: "老用户客单价",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 62,
          value: "老用户会员页到达率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 63,
          value: "老用户会员下单率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 64,
          value: "老用户支付成功率",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 67,
          value: "老用户数",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 65,
          value: "老用户会员页uv",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 53,
          value: "老用户下单uv",
          sort: 0,
          isSelect: false,
        },
        {
          field_id: 54,
          value: "老用户支付成功uv",
          sort: 0,
          isSelect: false,
        },
      ],
    };
  },
  mounted() {
    this.data1 = this.sourceL;
    this.data2 = this.targetR;
    // conosle.log(this.targetR)
    this.changeSourceData = this.data1;
    this.changeTargetData = this.data2;
  },
  watch: {
    data2() {
      this.changeTargetData = this.data2;
    },
    sourceData(val) {
      let emptyArr = [];
      if (val) {
        // val = val.toLowerCase()
        for (let i = 0; i < this.data1.length; i++) {
          if (this.data1[i].value.indexOf(val) != -1) {
            emptyArr.push(this.data1[i]);
          }
        }
        this.changeSourceData = emptyArr;
      } else {
        this.changeSourceData = this.data1;
      }
    },
    targetData(val) {
      let emptyArr = [];
      if (val) {
        // val = val.toLowerCase()
        for (let i = 0; i < this.data2.length; i++) {
          if (this.data2[i].value.indexOf(val) != -1) {
            emptyArr.push(this.data2[i]);
          }
        }
        this.changeTargetData = emptyArr;
      } else {
        this.changeTargetData = this.data2;
      }
    },
  },
  methods: {
    ondrag(event) {
      this.target.y = event.y;
    },
    dropPub(event, type) {
      if (type == 1) {
        this.drop(event, this.data1, this.data2);
      } else {
        this.drop(event, this.data2, this.data1);
      }
    },
    drop(event, handle, target) {
      let field_id = event.dataTransfer.getData("field_id");
      handle.forEach((item, index) => {
        if (item.field_id == field_id) {
          let temp = handle.splice(index, 1);
          temp[0].isSelect = false;
          target.push(temp[0]);
        }
      });
      this.resort(event, target);
    },
    resort(event, target) {
      let eles = event.currentTarget.children;
      for (let i = 0; i < target.length; i++) {
        if (target[i].field_id == this.target.field_id) {
          target[i].y = this.target.y;
        } else {
          target[i].y = eles[i].getBoundingClientRect().y;
        }
      }
      for (let i = 0; i < target.length - 1; i++) {
        for (let j = 0; j < target.length - i - 1; j++) {
          if (target[j].y > target[j + 1].y) {
            let swap = target[j];
            target[j] = target[j + 1];
            target[j + 1] = swap;
          }
        }
      }
      this.$forceUpdate();
    },
    dragstart(event, item) {
      this.target.field_id = item.field_id;
      event.dataTransfer.setData("field_id", item.field_id);
    },
    dragend(event) {
      event.dataTransfer.clearData();
    },
    hanldleClick(data, field_id) {
      data.forEach((element) => {
        if (element.field_id == field_id) {
          element.isSelect = !element.isSelect;
        }
      });
    },
    moveItem(handle, target, type) {
      let temp = handle.filter((item) => {
        return item.isSelect == true;
      });
      if (temp.length <= 0) return false;
      temp.forEach((item) => {
        let index = handle.indexOf(item);
        handle.splice(index, 1);
        item.isSelect = false;
        target.push(item);
      });
      console.log('\x1b[34m%s\x1b[0m', 'index.vue line:1425 object', handle,target);
      let hidden = type == 'left' ? handle : target
      let show = type == 'left' ?  target : handle
      this.$emit('moveItem',{show,hidden})
    },
    selectAll(data) {
      let isSelectAll = data.every((item) => {
        return item.isSelect == true;
      });
      data.forEach((item) => {
        if (isSelectAll) {
          item.isSelect = false;
        } else {
          item.isSelect = true;
        }
      });
    },
    dataReturn() {
      let show = this.data1.map((item) => {
        return item.field_id;
      });
      let hidden = this.data2.map((item) => {
        return item.field_id;
      });
      return {
        show,
        hidden,
      };
    },
    initData() {
      this.data1 = [...this.showField];
      this.data2 = [];
      // conosle.log(this.targetR)
      this.changeSourceData = this.data1;
      this.changeTargetData = this.data2;
    },
    advertInitData() {
      this.data1 = [...this.adverShowField];
      this.data2 = [];
      // conosle.log(this.targetR)
      this.changeSourceData = this.data1;
      this.changeTargetData = this.data2;
    },
    sourceMaterial() {
      if (this.changeData == 1) {
        this.data1 = [...this.sourceShowField];
      } else if (this.changeData == 5) {
        this.data1 = [...this.sourceShowField2];
      }
      this.data2 = [];
      // conosle.log(this.targetR)
      this.changeSourceData = this.data1;
      this.changeTargetData = this.data2;
    },
    /**
     * 投放数据运营重置字段
     */
    toufangyunying() {
      this.data1 = [...this.sourceShowField3];
      this.data2 = [];
      // conosle.log(this.targetR)
      this.changeSourceData = this.data1;
      this.changeTargetData = this.data2;
    },
    /* 
      会员付费
    */
    huiyuan() {
      if (this.huiyuanType == 1) {
        this.data1 = [...this.huiyuan1];
      } else if (this.huiyuanType == 2) {
        this.data1 = [...this.huiyuan2];
      } else if (this.huiyuanType == 3) {
        this.data1 = [...this.huiyuan3];
      }
      this.data2 = [];
      this.changeSourceData = this.data1;
      this.changeTargetData = this.data2;
    },
  },
  computed: {
    leftSelect() {
      if (this.data1.length === 0) return false;
      let arr = this.data1.filter((item) => {
        return item.isSelect == true;
      });
      return arr.length;
    },
    rightSelect() {
      if (this.data2.length == 0) return false;
      let arr = this.data2.filter((item) => {
        return item.isSelect == true;
      });
      return arr.length;
    },
  },
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}

#box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  border: 1px solid rgb(235, 238, 245);
}

.box .title {
  font-size: 14px;
  box-sizing: border-box;
  padding-right: 10px;
  display: flex;
  justify-content: space-between;
  height: 40px;
  line-height: 40px;
  background: #f5f7fa;
}

.box .title span:first-child {
  display: inline-block;
  background: #f5f7fa;
  background-image: url(./img/check-box-outline-blank.png);
  background-repeat: no-repeat;
  background-position: 10px center;
  background-size: 20px 20px;
  padding-left: 35px;
  cursor: pointer;
}

.box .title span:first-child.active {
  background-image: url(./img/check_box.png);
}

.left,
.right {
  width: 300px;
  height: 400px;
  padding: 5px 0;
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: hidden;
}

.left>div,
.right>div {
  cursor: pointer;
  text-align: left;
  background-image: url(./img/check-box-outline-blank.png);
  background-repeat: no-repeat;
  background-position: 10px center;
  background-size: 20px 20px;
  font-size: 14px;
  padding-left: 35px;
  padding-top: 5px;
  padding-bottom: 5px;
}

.left>div.active,
.right>div.active {
  background-image: url(./img/check_box.png);
}

.left>div.hover-color:hover,
.right>div.hover-color:hover {
  color: rgb(64, 158, 255);
}

.middle {
  margin: 0 40px;
}

.middle>div {
  margin: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 86px;
  height: 30px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid #cccccc;
  font-size: 12px;
  color: #c0c4cc;
}

.middle>div.active {
  background-color: #409eff;
  border-color: #409eff;
  color: #ffffff;
}

.search_parent {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.search_input {
  width: 150px;
  height: 10px;
  border-radius: 50px;
  border: 1px solid #ccc;
  outline: none;
  padding: 10px 0px 10px 10px;
  font-size: 14px;
}

.search_input_focus {
  border: 1px solid #409eff;
}

::-webkit-input-placeholder {

  color: rgb(192, 196, 204);
}

:-moz-placeholder {

  color: rgb(192, 196, 204);
}

::-moz-placeholder {

  color: rgb(192, 196, 204);
}

:-ms-input-placeholder {

  color: rgb(192, 196, 204);
}
</style>
