<template >
  <div>
    <el-tooltip
      class="item"
      effect="dark"
      content="导出指定tab的表格数据"
      placement="bottom"
      v-if="leadoutList"
    >
      <el-button
        type="primary"
        @click="onLeadOutApi"
        :loading="loading"
        icon="el-icon-download"
        v-if="api"
      >
        导出
      </el-button>
    </el-tooltip>
    <el-button
      type="primary"
      @click="onLeadOutApi"
      :loading="loading"
      icon="el-icon-download"
      v-if="api && !leadoutList"
    >
      导出
    </el-button>
    <el-button
      type="primary"
      @click="onLeadOut"
      :loading="loading"
      icon="el-icon-download"
      v-if="!api"
      >导出</el-button
    >
  </div>
</template >

<script >
import moment from "moment";
import { mapState } from "vuex";
import store from "store2";
import FormatJson from "@/util/lead-out/FormatJson";
import { export_json_to_excel } from "@/util/lead-out/Export2Excel";
import { getName } from "@/util/vuexGennerator/util";

export default {
  name: "lead-out",
  props: {
    name: {
      type: String,
    },
    paramsType: {
      type: Number,
    },
    column: {
      type: Array,
    },
    params: {
      type: Object,
    },
    api: {
      type: String,
    },
    channelFlag: {
      type: Boolean,
      default: false,
    },
    childList: {
      type: Boolean,
      default: false,
    },
    leadoutList: {
      type: Boolean,
      default: false,
    },
    videoFlag: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState({
      appArr: (state) => state.app.data,
    }),
  },
  methods: {
    async onLeadOut() {
      const { column, params, name } = this;
      const funcName = getName(name || this.$route.name, "lead");

      if (!column.length) return;
      this.loading = true;
      const [err, res] = await this.$store.dispatch(funcName, {
        ...params,
        isDownload: 1,
        channel:
          Array.isArray(params["channel"]) &&
          params["channel"].length > 0 &&
          this.channelFlag == false
            ? params["channel"].join(",")
            : !Array.isArray(params["channel"]) && this.channelFlag == false
            ? params["channel"]
            : params["channel"] && this.channelFlag
            ? params["channel"]
            : "",
        timeBegin: params["time"][0],
        timeEnd: params["time"][1],
        res: params.res ? params.res.join(",") : "",
        adCate: params.adCate ? params.adCate.join(",") : "",
        adTypes: params.adTypes ? params.adTypes.join(",") : "",
        appIds: params.appIds ? params.appIds.join(",") : "",
        positionIds: params.positionIds ? params.positionIds.join(",") : "",
        version: Array.isArray(params.version)
          ? params.version.join(",")
          : params.version,
        navCate: 2,
      });

      this.loading = false;

      if (err) {
        this.$notify.error({
          title: "导出提示",
          message: err,
        });
        return;
      }
      const data = res["list"];

      if (!data || !data.length) {
        this.$notify.error({
          title: "导出提示",
          message: "未查询到数据，请更换搜索条件重新查询",
        });
        return;
      }

      let app = this.$route.query.appId;
      let currentApp = {};
      let appName = "";
      let appSystem = "";

      if (app) {
        currentApp = this.appArr.filter((v) => v.id === app)[0];
        appName = currentApp["title"];
        appSystem = currentApp["system"] === "1" ? "-安卓" : "-苹果-";
      }

      const menu = this.$route.meta.name;
      const start = params["time"][0];
      const end = params["time"][1];
      const tHeader = column.map((v) => v.label);
      const filter = column.map((v) => v.prop);

      const _data = FormatJson(filter, data);
      export_json_to_excel(
        tHeader,
        _data,
        `${app ? appName + appSystem + "-" : ""}${menu}-${start}-${end}`
      );
    },
    async onLeadOutApi() {
      const { column, params, api } = this;
      if (!column.length) return;
      this.loading = true;
      const [err, res] = await this.$http.post(api, {
        ...params,
        isDownload: 1,
        channel:
          Array.isArray(params["channel"]) &&
          params["channel"].length > 0 &&
          this.channelFlag == false
            ? params["channel"].join(",")
            : !Array.isArray(params["channel"]) && this.channelFlag == false
            ? params["channel"]
            : params["channel"] && this.channelFlag
            ? params["channel"]
            : "",
        timeStart: params.time && params["time"][0] ? params["time"][0] : "",
        timeBegin: params.time && params["time"][0] ? params["time"][0] : "",
        timeEnd: params.time && params["time"][1] ? params["time"][1] : "",
        res: params.res ? params.res.join(",") : "",
        adCate: params.adCate ? params.adCate.join(",") : "",
        adTypes: params.adTypes ? params.adTypes.join(",") : "",
        appIds: params.appIds ? params.appIds.join(",") : "",
        positionIds: params.positionIds ? params.positionIds.join(",") : "",
        version: Array.isArray(params.version)
          ? params.version.join(",")
          : params.version,
        navCate: 2,
        type: this.paramsType || params.type,
      });

      this.loading = false;

      if (err) {
        this.$notify.error({
          title: "导出提示",
          message: err,
        });
        return;
      }

      console.log(res);
      const data = res["list"];

      if (!data || !data.length) {
        this.$notify.error({
          title: "导出提示",
          message: "未查询到数据，请更换搜索条件重新查询",
        });
        return;
      }

      let app = this.$route.query.appId;
      let currentApp = {};
      let appName = "";
      let appSystem = "";

      if (app) {
        currentApp = this.appArr.filter((v) => v.id === app)[0];
        appName = currentApp["title"];
        appSystem = currentApp["system"] === "1" ? "-安卓" : "-苹果-";
      }

      const menu = this.$route.meta.name;
      const start = params["time"] ? params["time"][0] : "";
      const end = params["time"] ? params["time"][1] : "";
      const tHeader = column.map((v) => v.label);
      const filter = column.map((v) => v.prop);
      column.forEach(item=>{
        if(item.prop == 'week'){
          data.forEach(_item=>{
            _item.week = moment(_item.date).format("dddd");
          })
        }
      })
      if (this.videoFlag) {
        filter.unshift("material_id");
        filter.unshift("date");
      }
      if (this.videoFlag) {
        tHeader.unshift("ID");
        tHeader.unshift("创建时间");
      }
      for (const i of data) {
        for (const key in i) {
          /** 因为id过长，到处Excel的时候会被识别为数字，加上逗号变为字符串 */
          if (key == "transcation_no") {
            i[key] = "," + i[key];
          }
          // 处理项目原始订单v1，全部订单导出字段
          if (key == "app_title") {
            i[key] = i[key].split("_")[0];
          }
        }
      }
      const _data = FormatJson(filter, data);
      console.log(tHeader,filter,_data)
      export_json_to_excel(
        tHeader,
        _data,
        `${app ? appName + appSystem + "-" : ""}${menu}${
          start ? "-" + start : ""
        }${end ? "-" + end : ""}`
      );
    },
  },
};
</script >

<style lang = "less" scoped >
.count-wrap {
  background-color: #fff;
  margin-top: 20px;
  padding: 30px 0;
  .count-option {
    /deep/ .el-col {
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
</style >
