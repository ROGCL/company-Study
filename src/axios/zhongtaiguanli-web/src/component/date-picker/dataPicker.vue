<template>
  <div class="wrapper">
    <!-- 带有快捷方式 -->
    <template v-if="shortcutsFlag">
      <byted-range-picker
        v-model="time"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        :shortcuts="shortcutsR"
        editable
        :clearable="clearFlag"
        :transfer="true"
        :placeholder="['开始日期', '结束日期']"
        @change="emitOpertion"
      >
        <!-- $emit('update:datevalue', time) -->
      </byted-range-picker>
    </template>
    <!-- 无快捷方式 -->
    <template v-else>
      <byted-range-picker
        v-model="time"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        editable
        :clearable="clearFlag"
        :transfer="true"
        :placeholder="['开始日期', '结束日期']"
        @change="emitOpertion"
      >
        <!-- $emit('update:datevalue', time) -->
      </byted-range-picker>
    </template>
  </div>
</template>

<script>
import moment from "moment";
import dayjs from "dayjs";
export default {
  // props: ['datevalue'],
  props: {
    datevalue: { type: Array }, // 时间值 ['2021-02-01','2021-02-26']
    shortcutsFlag: {
      // 是否显示左侧快捷选择
      type: Boolean,
      default: true,
    },
    clearFlag: {
      type: null,
      default: false,
    },
    watch: {
      datevalue: {
        handler: function (newVal, oldVal) {
          this.time = newVal;
        },
        deep: true,
      },
    },
  },
  data() {
    return {
      time: this.datevalue,
      shortcutsR: [
        {
          text: "今天",
          onClick: () => {
            const now = new Date();
            const today = dayjs(now).format("YYYY-MM-DD");
            this.time = [today, today];
            this.emitOpertion();
          },
        },
        {
          text: "昨天",
          onClick: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
            const st = dayjs(start).format("YYYY-MM-DD");
            const en = dayjs(start).format("YYYY-MM-DD");
            this.time = [st, en];
            this.emitOpertion();
          },
        },
        {
          text: "近一周",
          onClick: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            const st = dayjs(start).format("YYYY-MM-DD");
            const en = dayjs(end).format("YYYY-MM-DD");
            this.time = [st, en];
            this.emitOpertion();
          },
        },
        {
          text: "近30天",
          onClick: () => {
            const end = new Date();
            const start = moment().subtract(1, "months").format("YYYY-MM-DD");
            const st = dayjs(start).format("YYYY-MM-DD");
            const en = dayjs(end).format("YYYY-MM-DD");
            this.time = [st, en];
            this.emitOpertion();
          },
        },
        {
          text: "近60天",
          onClick: () => {
            const start = moment().subtract(2, "months").format("YYYY-MM-DD");
            const end = moment().format("YYYY-MM-DD");
            this.time = [start, end];
            this.emitOpertion();
          },
        },
        {
          text: "近90天",
          onClick: () => {
            const start = moment().subtract(3, "months").format("YYYY-MM-DD");
            const end = moment().format("YYYY-MM-DD");
            this.time = [start, end];
            this.emitOpertion();
          },
        },
        {
          text: "本月",
          onClick: () => {
            const end = new Date();
            const years = end.getFullYear();
            const mouths = end.getMonth() + 1;
            const start = new Date(years + "-" + mouths + "-01");
            const st = dayjs(start).format("YYYY-MM-DD");
            const en = dayjs(end).format("YYYY-MM-DD");
            this.time = [st, en];
            this.emitOpertion();
          },
        },
        {
          text: "上个月",
          onClick: () => {
            const preMonth = moment().subtract(1, "months").endOf("month");
            const end = preMonth.format("YYYY-MM-DD");
            const start = preMonth.format("YYYY-MM-01");
            const st = dayjs(start).format("YYYY-MM-DD");
            const en = dayjs(end).format("YYYY-MM-DD");
            this.time = [st, en];
            this.emitOpertion();
          },
        },
      ],
    };
  },
  methods: {
    emitOpertion() {
      this.$emit("update:datevalue", this.time);
      this.$emit("change", this.time);
    },
  },
};
</script>

<style scoped>
.wrapper >>> .byted-range-picker {
  line-height: normal !important;
}
</style>