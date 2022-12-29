<template>
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="时间" prop="time">
          <!-- <el-date-picker
            v-model="searchForm.time"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :append-to-body="false"
            unlink-panels
          /> -->
          <dataPicker :datevalue.sync="searchForm.time"></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="7" :sm="24">
        <el-form-item label="渠道" prop="channel" style="max-height: 50px">
          <SelectChannel v-model="searchForm.channel"></SelectChannel>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="5" :sm="24">
        <el-form-item label="时间刻度" prop="timeType">
          <el-radio-group v-model="searchForm.timeType">
            <el-radio-button
              v-for="(v, i) in timeTypeConfig"
              :key="i"
              :disabled="v.disabled"
              :label="v.value"
              >{{ v.label }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <CountLayout :option="countData" :loading="countLoading">
      <template #cetent>
        <el-radio-group
          v-model="allOrinfo"
          @change="onAllChange"
          v-if="channelFlag"
        >
          <el-radio-button :label="1">汇总走势</el-radio-button>
          <el-radio-button :label="2">明细走势</el-radio-button>
        </el-radio-group>
      </template>
      <template #option>
        <el-col :md="12" :lg="6" :sm="24">
          <el-form-item label="筛选项">
            <el-select
              v-model="select"
              placeholder="请选择筛选项"
              :popper-append-to-body="false"
              @change="onSelectChange"
            >
              <el-option
                :key="i"
                :label="v.label"
                :value="v.value"
                v-for="(v, i) in columnSelect"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </template>
      <template #extra>
        <div>平均：</div>
        <div>
          {{ (count.totalInfo && count.totalInfo.avg) | formatPercentage }}
        </div>
      </template>
    </CountLayout>
    <el-table
      :data="sumTable"
      border
      :show-header="false"
      style="width: 100%"
      v-loading="tableData.loading"
    >
      <el-table-column
        :prop="item"
        v-for="item in Object.keys(sumTable[0])"
        :key="item"
      ></el-table-column>
    </el-table>
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      :params="searchForm"
      :leadOut="true"
      @pageChange="onPageChange"
      @sizeChange="onSizeChange"
      :cellStyle="cellStyle"
    ></TableLayout>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";
import { mapState, mapActions, mapMutations } from "vuex";
import FilterLayout from "@/layout/form";
import CountLayout from "@/layout/count";
import TableLayout from "@/layout/table";
import { pickerOptions, timeTypeOption } from "@/config/option";
import { User_Statistics_activeKeep } from "@/config/api/index";
import SelectChannel from "@/component/select-channel";

let arr = [];
export default {
  name: "home",
  components: {
    FilterLayout,
    TableLayout,
    CountLayout,
    SelectChannel,
  },
  data() {
    return {
      select: "2",
      searchForm: {
        time: [
          moment().subtract(30, "d").format("YYYY-MM-DD"),
          moment().subtract(2, "d").format("YYYY-MM-DD"),
        ],
        channel: [],
        timeType: 1,
      },
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      pickerOptions,
      sumTable: [{}, {}],
      column: [],
      allOrinfo: 1,
      channelFlag: false,
    };
  },
  mounted() {
    this.fetchList();
    this.fetchCount();
    this.average();
  },
  computed: {
    ...mapState({
      channel: (state) => state.channel.data,
      app_version: (state) => state.app_version.data,
      tableData: (state) => {
        arr = [];
        let obj = state.active_user_keep.list.data;
        obj.forEach((item, index) => {
          let i = -1;
          for (let key in item) {
            i++;
            if (key != "date" && key != "device_new") {
              arr.push({
                column: index,
                row: i,
                count: parseFloat(item[key]),
              });
            } else {
              arr.push({
                column: index,
                row: i,
                count: null,
              });
            }
          }
        });

        arr = arr.map((item) => {
          switch (true) {
            case item.count > 100:
              item.count = 0;
              break;
            case item.count >= 80:
              item.count = 1;
              break;
            case item.count >= 60:
              item.count = 0.8;
              break;
            case item.count >= 40:
              item.count = 0.6;
              break;
            case item.count >= 20:
              item.count = 0.4;
              break;
            case item.count > 0:
              item.count = 0.2;
              break;
          }
          return {
            row: item.row,
            column: item.column,
            count: item.count,
          };
        });
        const filterData = state.active_user_keep.list.data.map((item) => {
          const obj = {};
          for (const key in item) {
            if (key != "date" && key != "device_new") {
              obj[key] = parseFloat(item[key]) > 0 ? item[key] : "";
            } else {
              obj[key] = item[key];
            }
          }
          return obj;
        });

        for (const key in state.active_user_keep.list.data) {
          state.active_user_keep.list.data[key] = filterData[key];
        }

        return state.active_user_keep.list;
      },
      count: (state) => state.active_user_keep.count.data,
      countLoading: (state) => state.active_user_keep.count.loading,
    }),
    countData() {
      const { count } = this;

      if (!count || !Object.keys(count).length) {
        return {
          legendData: [],
          xAxisData: [],
          data: [],
        };
      }

      const { date, list, listAll } = count;

      if (this.allOrinfo == 1 && this.searchForm.channel.length > 0) {
        const xAxisData = date;
        const legendData = Object.keys(listAll);
        const data = _.values(listAll);
        return {
          legendData,
          xAxisData,
          data,
          formatter: (v) => {
            if (this.select !== "0") {
              return (Number(v) * 100).toFixed(2) + "%";
            }
            return v;
          },
        };
      } else {
        const xAxisData = date;
        const legendData = Object.keys(list);
        const data = _.values(list);
        return {
          legendData,
          xAxisData,
          data,
          formatter: (v) => {
            if (this.select !== "0") {
              return (Number(v) * 100).toFixed(2) + "%";
            }
            return v;
          },
        };
      }
    },
    timeTypeConfig() {
      const { time } = this.searchForm;

      return timeTypeOption(time);
    },
    columnSelect() {
      const {
        tableData: {
          query: { timeType },
        },
      } = this;
      let unit = "日";

      switch (parseInt(timeType)) {
        case 1:
          unit = "日";
          break;
        case 2:
          unit = "周";
          break;
        case 3:
          unit = "月";
          break;
        default:
          unit = "日";
      }
      return [
        {
          prop: "day2",
          label: "次" + unit + "留存",
          value: "2",
        },
        {
          prop: "day3",
          label: "3" + unit + "留存",
          value: "3",
        },
        {
          prop: "day4",
          label: "4" + unit + "留存",
          value: "4",
        },
        {
          prop: "day5",
          label: "5" + unit + "留存",
          value: "5",
        },
        {
          prop: "day6",
          label: "6" + unit + "留存",
          value: "6",
        },
        {
          prop: "day7",
          label: "7" + unit + "留存",
          value: "7",
        },
      ];
    },
  },
  methods: {
    ...mapActions(["getActiveUserKeepList", "getActiveUserKeepCount"]),
    onSubmit(res) {
      this.tableOpt.currentPage = 1;
      this.fetchList();
      this.fetchCount();
      this.average();
      if (this.searchForm.channel.length) {
        this.channelFlag = true;
      } else {
        this.channelFlag = false;
        this.vAllOrinfo = 1;
      }
    },
    onPageChange(current) {
      arr = [];
      this.tableOpt.currentPage = current;
      this.fetchList();
    },
    onSizeChange(current) {
      this.tableOpt.pageSize = current;
      this.fetchList();
    },
    onSelectChange() {
      this.fetchCount();
    },
    async fetchList() {
      const { searchForm, tableOpt } = this;

      const [err, res] = await this.getActiveUserKeepList({
        ...searchForm,
        ...tableOpt,
        navCate: 2,
        channel: searchForm["channel"].join(","),
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });

      if (err) {
        return;
      }
      let unit = 0;
      const data = Object.keys(res.title);
      this.column = [];
      for (let i in data) {
        this.column.push({
          prop: data[i],
          label: res.title[data[i]],
        });
      }
    },
    async fetchCount() {
      const { searchForm, select } = this;
      const [err, res] = await this.getActiveUserKeepCount({
        ...searchForm,
        select,
        navCate: 1,
        channel: searchForm["channel"].join(","),
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });

      if (err) {
        return;
      }
    },
    average() {
      const { searchForm, select } = this;
      User_Statistics_activeKeep({
        ...searchForm,
        select,
        navCate: 6,
        channel: searchForm["channel"].join(","),
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      }).then((res) => {
        if (res[2] == 1) {
          this.sumTable = [];
          this.sumTable[0] = res[1].title;
          this.sumTable[1] = res[1].avg;
          console.log(this.sumTable);
        }
      });
    },
    cellStyle({ row, column, columnIndex, rowIndex }) {
      for (let i = 0; i < arr.length; i++) {
        let { column, row, count } = arr[i];
        if (columnIndex == row && rowIndex == column && count) {
          return `background: rgb(52, 127, 239, ${count})`;
        }
      }
    },
    onAllChange() {
      this.average();
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-cascader__search-input {
  min-width: 10px;
}
</style>
