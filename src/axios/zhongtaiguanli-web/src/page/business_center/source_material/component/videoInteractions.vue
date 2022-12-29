<template>
  <div>
    <el-tabs
      v-model="activeList"
      @tab-click="getMaterialVideoData"
      tab-position="left"
      style="height: 800px"
    >
      <el-tab-pane
        v-for="(i, v) in infoList"
        :key="v"
        :label="i.account_name"
        :name="i.advertiser_id + ''"
      >
        <div class="box">
          <div style="padding: 100px 100px 0 100px">
            <el-tabs v-model="active" @tab-click="changeCount" type="card">
              <el-tab-pane
                v-for="(i, v) in tabsList"
                :key="v"
                :label="i.title"
                :name="i.value"
              >
              </el-tab-pane>
            </el-tabs>
          </div>
          <CountLayout
            :key="num"
            :loading="countLoading"
            :option="CountLayoutOption"
            type="newMix"
            style="width: 850px"
          ></CountLayout>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CountLayout from "@/layout/count";

export default {
  components: {
    CountLayout,
  },
  props: {
    videoInteractionsList: {
      type: Object,
    },
    requestObj: {
      type: Object,
    },
    subNum: {
      type: Number,
    },
  },
  data() {
    return {
      num: 1,
      listData: {},
      CountLayoutOption: {},
      countLoading: false,
      activeList: "",
      active: "click_cnt",
      insideValue: {},
      infoList: [],
      tabsList: [
        {
          title: "点击数",
          value: "click_cnt",
        },
        {
          title: "流失人数",
          value: "user_lose_cnt",
        },
        {
          title: "新增关注数",
          value: "dy_follow",
        },
        {
          title: "点赞数",
          value: "dy_like",
        },
        {
          title: "新增评论数",
          value: "dy_comment",
        },
      ],
    };
  },
  mounted() {},
  methods: {
    async getMaterialVideoData() {
      this.num += 1;
      this.countLoading = true;
      const [err, res] = await this.$http.post(
        "Material_Info/materialVideoData",
        {
          advertiser_id: this.activeList,
          material_id: this.requestObj.material_id,
          time_start: this.requestObj.time_start,
          time_end: this.requestObj.time_end,
        }
      );
      if (err) {
        this.countLoading = false;
        return;
      }
      this.listData = res;
      let date = res.list.map((item) => {
        return item.second;
      });
      let arr = [];
      res.list.forEach((item) => {
        for (const key in item) {
          if (this.active == key) {
            arr.push(item[key]);
          }
        }
      });
      let name = "";
      this.tabsList.forEach((item) => {
        if (item.value == this.active) {
          name = item.title;
        }
      });
      let data = [];
      data.push({
        data: arr,
        name,
        type: "line",
      });
      this.countLoading = false;
      const _data = data.map((item) => {
        return {
          ...item,
        };
      });
      let yAxis = [
        {
          type: "value",
          name: "",
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
        },
      ];
      this.CountLayoutOption = {
        legendData: data,
        xAxisData: date,
        data: _data,
        yAxis: yAxis,
        formatter: (res) => {
          this.$emit("changeVideoTime", res);
          let html = `${res[0].axisValueLabel}<br/>`;
          res.forEach((v) => {
            html += `${v.marker}${v.seriesName}：${v.value}<br/>`;
          });
          return html;
        },
      };
    },
    changeCount() {
      let res = this.listData;
      let date = res.list.map((item) => {
        return item.second;
      });
      let arr = [];
      res.list.forEach((item) => {
        for (const key in item) {
          if (this.active == key) {
            arr.push(item[key]);
          }
        }
      });
      let name = "";
      this.tabsList.forEach((item) => {
        if (item.value == this.active) {
          name = item.title;
        }
      });
      let data = [];
      data.push({
        data: arr,
        name,
        type: "line",
      });
      this.countLoading = false;
      const _data = data.map((item) => {
        return {
          ...item,
        };
      });
      let yAxis = [
        {
          type: "value",
          name: "",
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
        },
      ];
      this.CountLayoutOption = {
        legendData: data,
        xAxisData: date,
        data: _data,
        yAxis: yAxis,
        formatter: (res) => {
          let html = `${res[0].axisValueLabel}秒<br/>`;
          res.forEach((v) => {
            html += `${v.marker}${v.seriesName}：${v.value}<br/>`;
          });
          return html;
        },
      };
    },
  },
  watch: {
    videoInteractionsList(val) {
      if (val.list.length) {
        this.infoList = val.list;
      }
      this.activeList = val.list[0].advertiser_id + "";
      this.getMaterialVideoData();
    },
    subNum(val) {
      this.getMaterialVideoData();
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  overflow-x: scroll;
  width:100%
}
</style>