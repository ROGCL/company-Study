<template>
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="时间" prop="time">
          <dataPicker :datevalue.sync="searchForm.time"></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="7" :sm="24">
        <el-form-item label="渠道" prop="channel" style="max-height: 50px">
          <SelectChannel v-model="searchForm.channel"></SelectChannel>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="版本号" prop="channel">
          <el-select
            v-model="searchForm.version"
            placeholder="所有版本"
            :popper-append-to-body="false"
            filterable
          >
            <el-option label="全部" value />
            <el-option
              v-for="(v, i) in app_version"
              :key="i"
              :label="v"
              :value="v"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="5" :sm="24">
        <el-form-item label="付费类型" prop="type">
          <el-select
            v-model="searchForm.type"
            placeholder="所有版本"
            :popper-append-to-body="false"
            filterable
          >
            <el-option
              v-for="(v, i) in payment_type_list"
              :key="i"
              :label="v.label"
              :value="v.value"
            />
          </el-select>
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
                v-for="(v, i) in column.slice(1)"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </template>
      <template #cetent>
        <el-radio-group
          v-model="allOrinfo"
          @change="onAllChange"
          v-show="channelFlag"
        >
          <el-radio-button :label="1">汇总走势</el-radio-button>
          <el-radio-button :label="2">明细走势</el-radio-button>
        </el-radio-group>
      </template>
      <template #extra>
        <div>平均：</div>
        <div v-if="select == 0">
          {{ count.totalInfo && count.totalInfo.avg }}
        </div>
        <div v-else>
          {{ (count.totalInfo && count.totalInfo.avg) | formatPercentage }}
        </div>
      </template>
    </CountLayout>
    <el-table
      :data="sumTable"
      border
      :show-header="false"
      style="width: 100%"
      v-loading="averageloading"
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
      :params="leadOutParams"
      :leadOut="true"
      leadApi="User_Statistics/orderKeepFirst"
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
import SelectChannel from "@/component/select-channel";

let table_arr = [];
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
      select: 2,
      searchForm: {
        time: [
          moment().subtract(30, "d").format("YYYY-MM-DD"),
          moment().subtract(2, "d").format("YYYY-MM-DD"),
        ],
        channel: [],
        version: "",
        type: "1",
        timeType: 1,
      },
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      payment_type_list: [
        {
          label: "全部",
          value: "1",
        },
        {
          label: "会员付费",
          value: "2",
        },
        {
          label: "其他付费",
          value: "3",
        },
      ],
      pickerOptions,
      allOrinfo: 1,
      sumTable: [{}, {}],
      column: [],
      count: {},
      countLoading: false,
      averageloading: false,
      countData: {
        legendData: [],
        xAxisData: [],
        data: [],
      },
      tableData: {
        data: [],
        total: 0,
        loading: false,
      },
      channelFlag: false,
    };
  },
  mounted() {
    this.average(); // 平均数据
    this.getlinechart(); // 获取折线图数据
    this.gettabledata(); // 获取数据表格
  },
  computed: {
    ...mapState({
      app_version: (state) => state.app_version.data,
    }),

    timeTypeConfig() {
      const { time } = this.searchForm;
      return timeTypeOption(time);
    },
    leadOutParams() {
      return {
        ...this.searchForm,
        select: this.select,
      };
    },
  },
  methods: {
    onSubmit(res) {
      this.tableOpt.currentPage = 1;
      this.average();
      this.getlinechart(); // 获取折线图数据
      this.gettabledata(); // 获取数据表格
      if (this.searchForm.channel.length) {
        this.channelFlag = true;
      } else {
        this.channelFlag = false;
        this.vAllOrinfo = 1;
      }
    },
    onPageChange(current) {
      // arr = [];
      this.tableOpt.currentPage = current;
      this.gettabledata(); // 获取数据表格
    },
    onSizeChange(current) {
      this.tableOpt.pageSize = current;
      this.gettabledata();
    },
    onSelectChange() {
      this.getlinechart(); // 获取折线图数据
    },

    async average() {
      this.averageloading = true;
      const { searchForm, select } = this;
      const [err, res] = await this.$http.post(
        "User_Statistics/orderKeepFirst",
        {
          ...searchForm,
          select,
          navCate: 6,
          channel: searchForm["channel"].join(","),
          timeBegin: searchForm["time"][0],
          timeEnd: searchForm["time"][1],
        }
      );
      if (err) return;
      this.sumTable = [{}, {}];
      this.averageloading = false;
      this.sumTable[0] = res.title;
      this.sumTable[1] = res.avg;
    },

    async getlinechart() {
      this.countLoading = true;
      const { searchForm, select } = this;
      const [err, res] = await this.$http.post(
        "User_Statistics/orderKeepFirst",
        {
          ...searchForm,
          select,
          navCate: 1,
          channel: searchForm["channel"].join(","),
          timeBegin: searchForm["time"][0],
          timeEnd: searchForm["time"][1],
        }
      );
      this.countLoading = false;
      if (err) return;
      this.count = res.totalInfo;
      const { date, list, listAll } = res;
      if (this.allOrinfo == 1 && this.searchForm.channel.length > 0) {
        const xAxisData = date;
        const legendData = Object.keys(listAll);
        const data = _.values(listAll);
        this.countData = {
          legendData,
          xAxisData,
          data,
          formatter: (v) => {
            if (this.select !== 1) {
              return (Number(v) * 100).toFixed(2) + "%";
            }
            return v;
          },
        };
      } else {
        const xAxisData = date;
        const legendData = Object.keys(list);
        const data = _.values(list);
        this.countData = {
          legendData,
          xAxisData,
          data,
          formatter: (v) => {
            if (this.select !== 1) {
              return (Number(v) * 100).toFixed(2) + "%";
            }
            return v;
          },
        };
      }
    },
    async gettabledata() {
      this.tableData.loading = true;
      const { searchForm, select, tableOpt } = this;
      const [err, res] = await this.$http.post(
        "User_Statistics/orderKeepFirst",
        {
          ...searchForm,
          ...tableOpt,
          select,
          navCate: 2,
          channel: searchForm["channel"].join(","),
          timeBegin: searchForm["time"][0],
          timeEnd: searchForm["time"][1],
        }
      );
      if (err) return;
      let arr = [];
      let i = -1;
      for (const key in res.title) {
        i++;
        let obj = {
          label: res.title[key],
          prop: key,
          value: i,
        };
        arr.push(obj);
      }
      this.column = arr;
      // 整理table数据
      table_arr = [];
      let obj = res.list;
      obj.forEach((item, index) => {
        let i = -1;
        for (let key in item) {
          i++;
          if (key != "date" && key != "day1") {
            table_arr.push({
              column: index,
              row: i,
              count: parseFloat(item[key]),
            });
          } else {
            table_arr.push({
              column: index,
              row: i,
              count: null,
            });
          }
        }
      });
      table_arr = table_arr.map((item) => {
        if (item.count > 0 && item.count <= 19.99) {
          item.count = 0.2;
        }
        if (item.count > 19.99 && item.count <= 39.99) {
          item.count = 0.4;
        }
        if (item.count > 39.99 && item.count <= 59.99) {
          item.count = 0.6;
        }
        if (item.count > 59.99 && item.count <= 79.99) {
          item.count = 0.8;
        }
        if (item.count > 79.99 && item.count <= 99.99) {
          item.count = 1;
        }
        return {
          row: item.row,
          column: item.column,
          count: item.count,
        };
      });
      const filterData = res.list.map((item) => {
        const obj = {};
        for (const key in item) {
          if (key != "date" && key != "day1") {
            obj[key] = parseFloat(item[key]) > 0 ? item[key] : "";
          } else {
            obj[key] = item[key];
          }
        }
        return obj;
      });

      for (const key in res.list) {
        res.list[key] = filterData[key];
      }

      this.tableData.loading = false;
      this.tableData.total = res.total;
      this.tableData.data = res.list;
    },
    cellStyle({ row, column, columnIndex, rowIndex }) {
      for (let i = 0; i < table_arr.length; i++) {
        let { column, row, count } = table_arr[i];
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

<style lang="scss" scoped>
/deep/ .el-cascader__search-input {
  min-width: 10px;
}
</style>
