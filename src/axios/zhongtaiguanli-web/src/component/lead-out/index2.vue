<template >
  <!-- 此组件参照刘强的方法来封装 -->
  <el-button
    type="primary"
    @click="onLeadOutApi"
    :loading="loading"
    icon="el-icon-download"
    v-if="api"
    >导出</el-button
  >
  <el-button
    type="primary"
    @click="onLeadOut"
    :loading="loading"
    icon="el-icon-download"
    v-else
    >导出</el-button
  >
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
        appSystem = currentApp["system"] === "1" ? "-安卓" : "[苹果]";
      }

      const menu = this.$route.meta.name;
      const start = params["time"][0];
      const end = params["time"][1];
      const tHeader = column.map((v) => v.label);
      const filter = column.map((v) => v.prop);
      const _data = FormatJson(filter, data);

      export_json_to_excel(tHeader, _data, `${menu}-${start}-${end}`);
    },
    async onLeadOutApi() {
      const { column, params, api } = this;
      let params_data = {
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
        ...params,
      }
      this.loading = true;
      const [err, res] = await this.$http.post(api, params_data);
      if (err) return;

      let total_page = res.total_page || res.last_page;
      let arr = [];
      if (res.data) {
        arr.push(...res.data);
      } else {
        arr.push(...res.list);
      }
      // 分页导出 
      if (total_page > 0) {
        for (let index = 1; index < total_page; index++) {
          const [err, res] = await this.$http.post(api, { ...params_data, currentPage: index + 1, });
          if (res.data) {
            arr.push(...res.data);
          } else {
            arr.push(...res.list);
          }
        }
      }
      this.loading = false;
      if (err) {
        this.$notify.error({
          title: "导出提示",
          message: err,
        });
        return;
      }
      const data = arr;

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
      if (app && !params.app_id) {
        currentApp = this.appArr.filter((v) => v.id === app)[0];
        appName = currentApp["title"];
        appSystem = currentApp["system"] === "1" ? "-安卓" : "[苹果]";
      }

      const menu = params.leadeOutType == 2 ? '流量助推数据' : this.$route.meta.name;
      const start = params.timeStart;
      const end = params.timeEnd;
      let tHeader = column.map((v) => v.label);
      let filter = column.map((v) => v.prop);
      column.forEach(item=>{
        if(item.prop == 'week'){
          data.forEach(_item=>{
            _item.week = moment(_item.date).format("dddd");
          })
        }
      })

      if (params.leadeOutType == 1) {
        /** tHeader 数据整理*/
        const darenidx = tHeader.indexOf("达人信息");
        if (darenidx > -1) {
          tHeader.splice(darenidx, 1, "达人昵称", "达人ID");
        }

        /** filter 数据整理*/
        const darenidx2 = filter.indexOf("self_custom");
        if (darenidx2 > -1) {
          filter.splice(darenidx2, 1, "author_name", "author_id");
        }

        /** 整理视频链接 */
        const darenidx3 = filter.indexOf("video");
        if (darenidx3 > -1) {
          filter.splice(darenidx3, 1, "video_url");
        }

        /** data 数据整理*/

        // 需要保留整数
        let integer_arr = ['device_new', 'order_user', 'order_user_pay', 'show', 'click', 'play', 'comment', 'like', 'share']
        // 需要处理百分比
        let percent_arr = ['order_rate', 'order_pay_rate', 'add_pay_rate', 'total_income_roi', 'ctr', 'cvr', 'five_s_play_rate', 'finish_rate', 'play_rate', 'neg_rate', 'neu_rate', 'pos_rate','pvr']
        // 不需要格式化数据的字段
        let notFormatarr_of_id = [
          'ad_id','author_id','order_id'
        ]

        for (const i of data) {
          for (const key in i) {
            /** 因为id过长，到处Excel的时候会被识别为数字，加上逗号变为字符串 */
            if (notFormatarr_of_id.indexOf(key) > -1) {
              i[key] = "," + i[key];
            }
            // 处理项目原始订单v1，全部订单导出字段
            if (key == "app_title") {
              i[key] = i[key].split("_")[0];
            }
            if (integer_arr.indexOf(key) > -1) {
              i[key] = i[key] ? Math.floor(i[key]).toLocaleString() : 0;
            } else if (percent_arr.indexOf(key) > -1) {
              i[key] = i[key] ? `${(i[key] * 100).toFixed(2)}%` : '0.00%';
            } else if ((Number(i[key])  || Number(i[key]) == 0) && notFormatarr_of_id.indexOf(key) == -1 ) {
              i[key] = i[key] ? `${parseFloat((i[key] * 1).toFixed(2)).toLocaleString()}` : '0.00';
            }
          }
        }



      } else if (params.leadeOutType == 2) {
        /** tHeader 数据整理*/
        const darenidx = tHeader.indexOf("达人信息");
        if (darenidx > -1) {
          tHeader.splice(darenidx, 1, "达人昵称", "达人ID");
        }

        /** filter 数据整理*/
        const darenidx2 = filter.indexOf("author_name");
        if (darenidx2 > -1) {
          filter.splice(darenidx2, 1, "author_name", "author_id");
        }


        // 需要乘以100再加上%
        let multiply100_arr = [
          'total_roi',
          'played3s_percent', 'order_rate', 'activate_pay_rate', 'pay_ok_rate', 'play_percent', 'action_percent','fnum_day1',
         'fnum_day2','fnum_day3','fnum_day7','roi1','roi2','roi3','roi4','roi5','roi6','roi7','roi14','roi30','roi60','roi90',
        'roi180','roi365','new_day2','new_day3','new_day7','new_day30']
        // 保留整数
      let notFormatarr = [
         'device_new', 'conversion', 'order_num', 'order_pay_num', 'view', 'action', 'click', 'play', 'comment', 'admire'
      ]
      // id 不需要任何处理
      let notFormatarr_of_id = ['ad_id', 'campaign_id', 'author_id', 'supplement_order_id', 'order_id',"avatar_uri",
        'date']

        for (const i of data) {
          for (const key in i) {
            /** 因为id过长，到处Excel的时候会被识别为数字，加上逗号变为字符串 */
            if (notFormatarr_of_id.indexOf(key)>-1) {
              i[key] = "," + i[key];
            }
            if (key == 'new_add_arpu') {
              // 特殊字段保留4位
              i[key] = i[key] ? `${parseFloat((i[key] * 1).toFixed(4)).toLocaleString()}` : 0;
            } else if (multiply100_arr.indexOf(key) > -1) {
              // 百分比乘以100 保留两位
              i[key] = i[key] ? `${parseFloat((i[key] * 100).toFixed(2)).toLocaleString()}%` : '0.00%';
            } else if ((Number(i[key]) || Number(i[key]) == 0) && notFormatarr.indexOf(key) == -1 && notFormatarr_of_id.indexOf(key) == -1) {
              // 无特殊要求保留两位
              i[key] = i[key] ? `${parseFloat((i[key] * 1).toFixed(2)).toLocaleString()}` : '0.00';
            }else if((Number(i[key]) || Number(i[key]) == 0) && notFormatarr.indexOf(key) > -1){
              // 向下取整
              i[key] = i[key] ? Math.floor(i[key]).toLocaleString() : 0
            }
          }
        }
      } else if (params.leadeOutType == 3) {
        tHeader.splice(12, 4)
        filter.splice(12, 4)
        let arr = []
        let tHeader_new = []
        data.forEach((item, index) => {
          item.move_goods_info.forEach((_item, _index) => {
            item['goods_name_' + (_index + 1)] = _item.goods_name
            item['cycle_' + (_index + 1)] = _item.cycle
            item['number_' + (_index + 1)] = _item.number
            tHeader_new.push({
              prop: 'goods_name_' + (_index + 1),
              label: `第${_index + 1}次迁移套餐名称`
            })
            tHeader_new.push({
              prop: 'number_' + (_index + 1),
              label: `第${_index + 1}次迁移套餐用户数`
            })
            tHeader_new.push({
              prop: 'cycle_' + (_index + 1),
              label: `第${_index + 1}次迁移占比`
            })
          })
        })
        let map = new Map();
        for (let item of tHeader_new) {
          if (!map.has(item.prop)) {
            map.set(item.prop, item);
          };
        };
        arr = [...map.values()];
        arr.forEach(item => {
          tHeader.push(item.label)
          filter.push(item.prop)
        })
        console.log(tHeader, filter)
      } else if (params.leadeOutType == 4){
        //关键行为ID
        //需要转为两位小数百分比
        let percent_arr = ["yield_rate","yield_rate_3","yield_rate_6","yield_rate_12","yield_rate_gt_12","keep_rate","income_roi_1","income_ad_roi_1","income_order_roi_1","income_roi_3","income_roi_7","income_roi_14","income_roi_30","income_roi_60"]
        //需要转为整数
        let numKeyArr = ["device_new","hours_24","callback_num","no_callback_num","event_success_num","hours_3","hours_6","hours_12","gt_12"]
        // 需要转为保留四位数的表格列
        let fourNumArr = ["arpu_1","arpu_ad_1","arpu_order_1",""]
        // 需要转为小数保存后两位
        let sumKeyArr = ["real_cost","duration_avg","event_cost","activate_cost","income_1","income_ad_1","income_order_1","income_3","income_7","income_14","income_30","income_60"]
        for (const i of data) {
          for (const key in i) {
            //保留两位小数
            if (percent_arr.indexOf(key) > -1) {
              i[key] = i[key] ? `${(i[key] * 100).toFixed(2)}%` : '0.00%';
            }
            //转为整数
            if (numKeyArr.indexOf(key) > -1) {
              i[key] = i[key] ? parseFloat(i[key]).toLocaleString() : "0"
            }
            //保留四位数
            if (fourNumArr.indexOf(key) > -1) {
              i[key] = i[key] ? (i[key] * 1).toFixed(4) : "0.0000"
            }
            //保留2位数
            if (sumKeyArr.indexOf(key) > -1) {
              i[key] = i[key] ? (i[key] * 1).toFixed(2) : "0.00"
            }
            if (key == "duration_avg") {
              i["duration_avg"] = i["duration_avg"] ? (i["duration_avg"]/60/60).toFixed(2) : "0.00"
            }
          }
        }
      }

      const _data = FormatJson(filter, data);
      export_json_to_excel(
        tHeader,
        _data,
        `${menu}${start ? "-" + start : ""}${end ? "-" + end : ""}`
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
