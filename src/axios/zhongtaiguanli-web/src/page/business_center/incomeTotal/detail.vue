<template>
  <div class="home">
    <FilterLayout v-model="form" @onSubmit="search">
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="筛选时间">
          <!-- <el-date-picker
            v-model="form.time"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :popper-append-to-body="false"
            unlink-panels
          /> -->
          <dataPicker :datevalue.sync="form.time"></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="类型">
          <el-radio-group v-model="form.type">
            <el-radio-button
              v-for="(v, i) in types"
              :key="i"
              :label="v.value"
              >{{ v.label }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col
        :md="12"
        :lg="6"
        :sm="24"
        v-if="this.form.type === '2' || this.form.type === '3'"
      >
        <el-form-item label="次级">
          <el-select
            v-model="selectValue"
            placeholder="请选择"
            :disabled="disabledSelect"
            filterable
          >
            <el-option
              v-for="item in newOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24" v-if="this.form.type === '4'">
        <el-form-item label="APP名称">
          <SelectApp v-model="selectValue" Multiple="true" />
        </el-form-item>
      </el-col>
      <template #btn-option>
        <el-button class="downDataToExcel" type="primary" @click="exportExcel"
          >导出</el-button
        >
      </template>
    </FilterLayout>
    <div
      class="table-custom"
      v-loading="!tableDataOne.reload"
      v-if="!showIncomeList"
    >
      <el-table
        :data="tableDataOne.body"
        border
        style="width: 100%"
        id="out-table"
        ref="myTable"
      >
        <el-table-column
          prop="date"
          label="日期"
          min-width="90px"
          fixed
        ></el-table-column>
        <el-table-column label="整体合计" header-align="center">
          <el-table-column
            prop="all_all_income"
            label="总收入"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="all_order_price_pay"
            label="订单收入"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="all_order_price_pay_per"
            label="占比"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="all_ad_cost"
            label="广告收入"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="all_ad_cost_per"
            label="占比"
            min-width="90px"
          ></el-table-column>
          <el-table-column prop="all_device_new" label="新增"></el-table-column>
          <el-table-column
            prop="all_device_active"
            label="日活"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="all_arpu"
            label="ARPU值"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="all_advert_arpu"
            label="广告ARPU"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="all_order_arpu"
            label="订单ARPU"
            min-width="90px"
          ></el-table-column>
        </el-table-column>
        <el-table-column label="iOS" header-align="center">
          <el-table-column
            prop="ios_all_income"
            label="总收入"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="ios_order_price_pay"
            label="订单收入"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="ios_order_price_pay_per"
            label="占比"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="ios_ad_cost"
            label="广告收入"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="ios_ad_cost_per"
            label="占比"
            min-width="90px"
          ></el-table-column>
          <el-table-column prop="ios_device_new" label="新增"></el-table-column>
          <el-table-column
            prop="ios_device_active"
            label="日活"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="ios_arpu"
            label="ARPU值"
            min-width="90px"
          ></el-table-column>
           <el-table-column
            prop="ios_advert_arpu"
            label="广告ARPU"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="ios_order_arpu"
            label="订单ARPU"
            min-width="90px"
          ></el-table-column>
        </el-table-column>
        <el-table-column label="Android" header-align="center">
          <el-table-column
            prop="android_all_income"
            label="总收入"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="android_order_price_pay"
            label="订单收入"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="android_order_price_pay_per"
            label="占比"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="android_ad_cost"
            label="广告收入"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="android_ad_cost_per"
            label="占比"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="android_device_new"
            label="新增"
          ></el-table-column>
          <el-table-column
            prop="android_device_active"
            label="日活"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="android_arpu"
            label="ARPU值"
            min-width="90px"
          ></el-table-column>
           <el-table-column
            prop="android_advert_arpu"
            label="广告ARPU"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="android_order_arpu"
            label="订单ARPU"
            min-width="90px"
          ></el-table-column>
        </el-table-column>
        <el-table-column label="小程序" header-align="center">
          <el-table-column
            prop="applets_all_income"
            label="总收入"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="applets_order_price_pay"
            label="订单收入"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="applets_order_price_pay_per"
            label="占比"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="applets_ad_cost"
            label="广告收入"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="applets_ad_cost_per"
            label="占比"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="applets_device_new"
            label="新增"
          ></el-table-column>
          <el-table-column
            prop="applets_device_active"
            label="日活"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="applets_arpu"
            label="ARPU值"
            min-width="90px"
          ></el-table-column>
           <el-table-column
            prop="applets_advert_arpu"
            label="广告ARPU"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="applets_order_arpu"
            label="订单ARPU"
            min-width="90px"
          ></el-table-column>
        </el-table-column>
        <el-table-column label="抖音小程序" header-align="center">
          <el-table-column
            prop="xcx_all_income"
            label="总收入"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="xcx_order_price_pay"
            label="订单收入"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="xcx_order_price_pay_per"
            label="占比"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="xcx_ad_cost"
            label="广告收入"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="xcx_ad_cost_per"
            label="占比"
            min-width="90px"
          ></el-table-column>
          <el-table-column prop="xcx_device_new" label="新增"></el-table-column>
          <el-table-column
            prop="xcx_device_active"
            label="日活"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="xcx_arpu"
            label="ARPU值"
            min-width="90px"
          ></el-table-column>
           <el-table-column
            prop="xcx_advert_arpu"
            label="广告ARPU"
            min-width="90px"
          ></el-table-column>
          <el-table-column
            prop="xcx_order_arpu"
            label="订单ARPU"
            min-width="90px"
          ></el-table-column>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination-custom"
        background
        layout="total,sizes, prev, pager, next, jumper"
        :total="tableDataOne.total"
        @current-change="tableOneOnChangePage"
        @size-change="onSizeChange"
      ></el-pagination>
    </div>
    <div
      class="table-custom"
      v-loading="!tableDataTow.reload"
      v-if="showIncomeList"
    >
      <el-table
        :data="body"
        border
        style="width: 100%"
        id="out-table-tow"
        ref="myTable"
      >
        <el-table-column
          :label="item.label"
          class="tb-edit"
          :key="index + 'table'"
          v-for="(item, index) in hd"
          width="120px"
          :fixed="index === 0"
        >
          <template slot-scope="scope">
            <input
              type="text"
              style="width: 88px"
              v-model="body[scope.$index][item.prop]"
              @blur="
                inputBlur(
                  {
                    id: item.id,
                    rowIndex: item.prop,
                    columnIndex: scope.$index,
                  },
                  $event
                )
              "
              v-if="item.edit && !exportStatus"
            />
            <p v-else>{{ body[scope.$index][item.prop] }}</p>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination-custom"
        background
        layout="total,sizes, prev, pager, next, jumper"
        :total="tableDataTow.total"
        @current-change="tableTowOnChangePage"
        @size-change="onSizeChangeTwo"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { pickerOptions } from "@/config/option";
import FilterLayout from "@/layout/form";
import moment from "moment";
import {
  Group_Manage_index,
  Apartment_Manage_index,
  System_apps,
  income_index,
  income_saveAd,
} from "@/config/api/index";
import tocsv from "@/util/tocsv";
import SelectApp from "@/component/select-app";

export default {
  components: {
    FilterLayout,
    SelectApp,
  },
  data() {
    return {
      pickerOptions,
      form: {
        time: [
          moment().subtract(30, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
        timeType: "1",
        type: "1",
        group_id: "",
        apartment_id: "",
        appid: "",
      },
      timeDimension: [
        {
          value: "1",
          label: "天",
        },
      ],
      options: {
        project: [],
        department: [],
        apps: [],
      },
      tableDataOne: {
        list: [],
        total: 0,
        reload: false,
        currentPage: 1,
      },
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      selectValue: "",
      tableDataTow: {
        header: [],
        body: [],
        total: 0,
        reload: true,
        currentPage: 1,
      },
      tableOptTow: {
        currentPage: 1,
        pageSize: 10,
      },
      hd: [],
      body: [],
      exportStatus: false,
      types: [
        {
          value: "1",
          label: "总和",
        },
        {
          value: "3",
          label: "部门",
        },
        {
          value: "2",
          label: "项目组",
        },
        {
          value: "4",
          label: "App",
        },
      ],
    };
  },
  created() {
    this.getSelectData();
    this.getChannelList();
  },
  mounted() {
    window.onresize = () => {
      // myTable是表格的ref属性值
      if (this.$refs.myTable && this.$refs.myTable.doLayout) {
        console.log(1);
        this.$refs.myTable.doLayout();
      }
    };
  },
  methods: {
    getSelectData() {
      let params = { pageSize: 500 };
      Group_Manage_index(params).then((res) => {
        this.options.project = reFormat({
          arr: res[1].list,
          label: "title",
          value: "id",
        });
      });
      Apartment_Manage_index(params).then((res) => {
        this.options.department = reFormat({
          arr: res[1].list,
          label: "title",
          value: "id",
        });
      });
      System_apps().then((res) => {
        this.options.apps = res[1].map((app) => {
          return {
            label: `${app.title} - ${checkSystem(app.system)}`,
            value: app.id,
          };
        });
      });

      function reFormat({ arr, label, value }) {
        return arr.map((item) => {
          return {
            label: item[label],
            value: item[value],
          };
        });
      }

      function checkSystem(system) {
        return system == "1" ? "安卓" : "苹果";
      }
    },

    getChannelList() {
      const { tableOpt } = this;
      this.tableDataOne.reload = false;
      let params = {
        ...this.form,
        timeBegin: this.form.time[0],
        timeEnd: this.form.time[1],
        ...tableOpt,
      };
      let type = {
        1: "android_",
        2: "ios_",
        3: "applets_",
        4: "xcx_",
        all: "all_",
      };
      return income_index(params).then((res) => {
        if (!res[1]) {
          this.$message.error(res[0].msg);
          this.tableDataOne.reload = true;
          return;
        }
        let { list, total } = res[1];
        this.tableDataOne.total = total;
        this.tableDataOne.body = list.map((item) => {
          let data = {};
          for (const key in item) {
            if (key !== "date") {
              for (const child_key in item[key]) {
                let name = type[key] + child_key;
                data[name] = item[key][child_key];
              }
            } else {
              data["date"] = item[key];
            }
          }
          return data;
        });
        this.tableDataOne.reload = true;
      });
    },
    getIncomeList() {
      this.tableDataTow.reload = false;
      const { tableOptTow } = this;
      let params = {
        ...this.form,
        timeBegin: this.form.time[0],
        timeEnd: this.form.time[1],
        ...tableOptTow,
      };
      return income_index({ ...params, type: 4 }).then((res) => {
        let { headers, list, total } = res[1];
        this.tableDataTow.header = headers.map((item, index) => {
          return {
            fixed: index == 0 && tableOptTow.pageSize == 10,
            ...item,
            index: String(index),
          };
        });
        this.tableDataTow.total = total;
        this.tableDataTow.body = list;
        this.tableDataTow.reload = true;
        let header = headers.map((item, index) => {
          return {
            label: item.index_name,
            edit: item.edit == 1,
            id: item.id,
            prop: String(index),
          };
        });
        let data = list.map((item, index) => {
          let obj = {};
          for (let i = 0; i < item.length; i++) {
            obj[i] = item[i];
          }
          return obj;
        });
        this.hd = header;
        this.body = data;
      });
    },
    tableOneOnChangePage(current) {
      this.tableOpt.currentPage = current;
      this.getChannelList();
    },
    onSizeChange(current) {
      this.tableOpt.pageSize = current;
      this.getChannelList();
    },
    tableTowOnChangePage(current) {
      this.tableOptTow.currentPage = current;
      this.getIncomeList();
    },
    onSizeChangeTwo(current) {
      this.tableOptTow.pageSize = current;
      this.getIncomeList();
    },
    inputBlur({ id, rowIndex, columnIndex }, e) {
      let value;
      if (e.target.value.indexOf(",") != -1) {
        let arr = e.target.value.split(",");
        value = arr[0] + arr[1];
      } else {
        value = e.target.value;
      }
      this.body[columnIndex][rowIndex] = value;
      let params = {
        appid: this.form.appid,
        id,
        cost: value,
        date: this.body[columnIndex][0],
      };
      this.tableDataTow.reload = false;
      income_saveAd(params).then((res) => {
        if (res[2] == 1) {
          this.$message({
            showClose: true,
            message: res[3],
            type: "success",
          });
          this.tableDataTow.reload = true;
          this.$set(this.body, columnIndex, res[1].list);
        } else {
          this.$message.error(res[0]);
        }
      });
    },
    search() {
      this.tableOpt.currentPage = 1;
      let { form, selectValue } = this;
      switch (form.type) {
        case "2":
          this.form.group_id = selectValue;
          break;
        case "3":
          this.form.apartment_id = selectValue;
          break;
        case "4":
          this.form.appid = selectValue;
          this.getIncomeList();
          break;
      }
      if (form.type != "4") {
        this.getChannelList();
      }
    },
    exportExcel() {
      // todo 先查询再导出
      let method, dom;
      switch (this.form.type) {
        case "4":
          method = this.getIncomeList;
          dom = "#out-table-tow";
          this.exportStatus = true;
          break;
        default:
          method = this.getChannelList;
          dom = "#out-table";
          break;
      }
      method(500, 1).then(() => {
        this.exportStatus = false;
        let { time, type } = this.form;
        let selectKey = (function () {
          switch (type) {
            case "1":
              return "总和";
            case "2":
              return "项目组";
            case "3":
              return "部门";
            case "4":
              return "App";
          }
        })();
        let seleteValue;
        try {
          seleteValue =
            type == "1"
              ? "总和"
              : this.newOptions.filter(
                  (item) => item.value == this.selectValue
                )[0].label;
        } catch (error) {
          seleteValue = type == "1" ? "总和" : "全部";
        }
        tocsv(dom, `${time[0]}-${time[1]}-收入-${selectKey}-${seleteValue}`);
      });
    },
  },
  watch: {
    "form.type"(newValue) {
      this.selectValue = "";
    },
  },
  computed: {
    disabledSelect() {
      return this.form.type == "1";
    },
    newOptions() {
      switch (this.form.type) {
        case "2":
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectValue = this.options.project[0].value;
          return this.options.project;
        case "3":
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectValue = this.options.department[0].value;
          return this.options.department;
        case "4":
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.selectValue = this.options.apps[0].value;
          return this.options.apps;
        default:
          return null;
      }
    },
    showIncomeList() {
      return this.form.type == 4;
    },
  },
  updated() {
    // myTable是表格的ref属性值
    if (this.$refs.myTable && this.$refs.myTable.doLayout) {
      this.$refs.myTable.doLayout();
    }
  },
};
</script>

<style lang='less' scoped>
/deep/.el-table th.gutter {
  display: table-cell !important;
}
</style>