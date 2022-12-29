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
      <el-col :md="7" :sm="12">
        <el-form-item label="渠道" prop="channel">
          <SelectChannel v-model="searchForm.channel"></SelectChannel>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <CountLayout
      :option="countData.data"
      :loading="countData.loading"
      :countInfo="countData.totalInfo"
    >
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
        <el-col :md="6" :sm="12">
          <el-form-item label="筛选项">
            <el-select
              v-model="select"
              placeholder="请选择筛选项"
              :popper-append-to-body="false"
              @change="onSelectChange"
            >
              <el-option
                :key="i"
                :label="item.label"
                :value="item.value"
                v-for="(item, i) in selectOption"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </template>
    </CountLayout>
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      :params="searchForm"
      :leadOut="true"
      leadApi="Order_Statistics/deviceAvgIncome"
      @sizeChange="onSizeChange"
      @pageChange="onPageChange"
    >
      <template #day1="row">{{ row.row.day1 | formatZero }}</template>
      <template #day2="row">{{ row.row.day2 | formatZero }}</template>
      <template #day3="row">{{ row.row.day3 | formatZero }}</template>
      <template #day4="row">{{ row.row.day4 | formatZero }}</template>
      <template #day5="row">{{ row.row.day5 | formatZero }}</template>
      <template #day6="row">{{ row.row.day6 | formatZero }}</template>
      <template #day7="row">{{ row.row.day7 | formatZero }}</template>
      <template #day14="row">{{ row.row.day14 | formatZero }}</template>
      <template #day30="row">{{ row.row.day30 | formatZero }}</template>
      <template #day60="row">{{ row.row.day60 | formatZero }}</template>
      <template #day90="row">{{ row.row.day90 | formatZero }}</template>
      <template #day365="row">{{ row.row.day365 | formatZero }}</template>
    </TableLayout>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";
import FilterLayout from "@/layout/form";
import CountLayout from "@/layout/count";
import TableLayout from "@/layout/table";
import { pickerOptions } from "@/config/option";
import SelectChannel from "@/component/select-channel";

export default {
  components: {
    FilterLayout,
    TableLayout,
    CountLayout,
    SelectChannel,
  },
  data() {
    return {
      select: "1",
      column: [
        {
          prop: "date",
          label: "日期",
        },
        {
          prop: "device_new",
          label: "新增设备",
        },
        {
          prop: "day1",
          label: "1日",
        },
        {
          prop: "day2",
          label: "2日",
        },
        {
          prop: "day3",
          label: "3日",
        },
        {
          prop: "day4",
          label: "4日",
        },
        {
          prop: "day5",
          label: "5日",
        },
        {
          prop: "day6",
          label: "6日",
        },
        {
          prop: "day7",
          label: "7日",
        },
        {
          prop: "day14",
          label: "14日",
        },
        {
          prop: "day30",
          label: "30日",
        },
        {
          prop: "day60",
          label: "60日",
        },
        {
          prop: "day90",
          label: "90日",
        },
        {
          prop: "day365",
          label: "365日",
        },
      ],
      selectOption: [
        {
          label: "1日平均收入订单",
          value: "1",
        },
        {
          label: "2日平均收入订单",
          value: "2",
        },
        {
          label: "3日平均收入订单",
          value: "3",
        },
        {
          label: "4日平均收入订单",
          value: "4",
        },
        {
          label: "5日平均收入订单",
          value: "5",
        },
        {
          label: "6日平均收入订单",
          value: "6",
        },
        {
          label: "7日平均收入订单",
          value: "7",
        },
        {
          label: "14日平均收入订单",
          value: "14",
        },
        {
          label: "30日平均收入订单",
          value: "30",
        },
        {
          label: "60日平均收入订单",
          value: "60",
        },
        {
          label: "90日平均收入订单",
          value: "90",
        },
        {
          label: "365日平均收入订单",
          value: "365",
        },
      ],
      searchForm: {
        time: [
          moment().subtract(30, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
        channel: [],
      },
      allOrinfo: 1,
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      tableData: {
        data: [],
        total: 0,
        loading: false,
        currentPage: 1,
        pageSize: 10,
      },
      pickerOptions: {
        ...pickerOptions,
        disabledDate: (val) => {
          return !moment(val).isBetween(moment().subtract(10, "y"), moment());
        },
      },
      countData: {
        data: {},
        totalInfo: {},
        loading: false,
      },
    };
  },
  mounted() {
    this.fetchList();
    this.fetchCount();
  },
  filters: {
    formatZero(val) {
      if (val === 0) return "";

      return val;
    },
  },
  methods: {
    onSubmit() {
      this.tableOpt.currentPage = 1;
      if (this.searchForm.channel.length) {
        this.channelFlag = true;
      } else {
        this.channelFlag = false;
        this.vAllOrinfo = 1;
      }
      this.fetchList();
      this.fetchCount();
    },
    onPageChange(current) {
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

      this.tableData.loading = true;

      const [err, res] = await this.$http.post(
        "Order_Statistics/deviceAvgIncome",
        {
          ...searchForm,
          ...tableOpt,
          navCate: 2,
          channel: searchForm["channel"].join(","),
          timeBegin: searchForm["time"][0],
          timeEnd: searchForm["time"][1],
        }
      );

      this.tableData.loading = false;

      if (err) return;

      const { list, currentPage, total } = res;

      this.tableData.data = list;
      this.tableData.currentPage = currentPage;
      this.tableData.total = total;
    },
    onAllChange() {
      this.fetchCount();
    },
    async fetchCount() {
      const { searchForm, select } = this;

      this.countData.loading = true;

      const [err, res] = await this.$http.post(
        "Order_Statistics/deviceAvgIncome",
        {
          ...searchForm,
          select,
          navCate: 1,
          channel: searchForm["channel"].join(","),
          timeBegin: searchForm["time"][0],
          timeEnd: searchForm["time"][1],
        }
      );

      this.countData.loading = false;

      if (err) {
        this.countData.data = {
          legendData: [],
          xAxisData: [],
          data: [],
          yName: "天",
        };
        return;
      }

      if (!res || !Object.keys(res).length) {
        this.countData.data = {
          legendData: [],
          xAxisData: [],
          data: [],
          yName: "天",
        };
        return;
      }

      const { date, list, totalInfo, listAll } = res;
      if (this.allOrinfo == 1 && searchForm["channel"].length > 0) {
        const xAxisData = date;
        const legendData = Object.keys(listAll);
        const data = _.values(listAll);

        this.countData.totalInfo = totalInfo;
        this.countData.data = {
          legendData,
          xAxisData,
          data,
          yName: "天",
        };
      } else {
        const xAxisData = date;
        const legendData = Object.keys(list);
        const data = _.values(list);

        this.countData.totalInfo = totalInfo;
        this.countData.data = {
          legendData,
          xAxisData,
          data,
          yName: "天",
        };
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-cascader__search-input {
  min-width: 10px;
}
</style>
