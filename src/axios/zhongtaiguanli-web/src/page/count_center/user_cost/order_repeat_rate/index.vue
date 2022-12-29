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
    <CountLayout :option="countData.data" :loading="countData.loading">
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
      <template #extra>
        <div>
          <b>平均值:</b>
        </div>
        <div>{{ countData.totalInfo.avg | formatPercentage }}</div>
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
      leadApi="Order_Statistics/secondRate"
      @pageChange="onPageChange"
      @sizeChange="onSizeChange"
    >
      <template #day1_snum="row">{{
        row.row.day1_snum | formatPercentage
      }}</template>
      <template #day2_snum="row">{{
        row.row.day2_snum | formatPercentage
      }}</template>
      <template #day3_snum="row">{{
        row.row.day3_snum | formatPercentage
      }}</template>
      <template #day4_snum="row">{{
        row.row.day4_snum | formatPercentage
      }}</template>
      <template #day5_snum="row">{{
        row.row.day5_snum | formatPercentage
      }}</template>
      <template #day6_snum="row">{{
        row.row.day6_snum | formatPercentage
      }}</template>
      <template #day7_snum="row">{{
        row.row.day7_snum | formatPercentage
      }}</template>
      <template #day14_snum="row">{{
        row.row.day14_snum | formatPercentage
      }}</template>
      <template #day30_snum="row">{{
        row.row.day30_snum | formatPercentage
      }}</template>
      <template #day60_snum="row">{{
        row.row.day60_snum | formatPercentage
      }}</template>
      <template #day90_snum="row">{{
        row.row.day90_snum | formatPercentage
      }}</template>
      <template #day365_snum="row">{{
        row.row.day365_snum | formatPercentage
      }}</template>
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
import { formatPercentage } from "@/util/filters";
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
      allOrinfo: 1,
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
          prop: "day1_snum",
          label: "1日",
        },
        {
          prop: "day2_snum",
          label: "2日",
        },
        {
          prop: "day3_snum",
          label: "3日",
        },
        {
          prop: "day4_snum",
          label: "4日",
        },
        {
          prop: "day5_snum",
          label: "5日",
        },
        {
          prop: "day6_snum",
          label: "6日",
        },
        {
          prop: "day7_snum",
          label: "7日",
        },
        {
          prop: "day14_snum",
          label: "14日",
        },
        {
          prop: "day30_snum",
          label: "30日",
        },
        {
          prop: "day60_snum",
          label: "60日",
        },
        {
          prop: "day90_snum",
          label: "90日",
        },
        {
          prop: "day365_snum",
          label: "365日",
        },
      ],
      selectOption: [
        {
          label: "1日复购完成率",
          value: "1",
        },
        {
          label: "2日复购完成率",
          value: "2",
        },
        {
          label: "3日复购完成率",
          value: "3",
        },
        {
          label: "4日复购完成率",
          value: "4",
        },
        {
          label: "5日复购完成率",
          value: "5",
        },
        {
          label: "6日复购完成率",
          value: "6",
        },
        {
          label: "7日复购完成率",
          value: "7",
        },
        {
          label: "14日复购完成率",
          value: "14",
        },
        {
          label: "30日复购完成率",
          value: "30",
        },
        {
          label: "60日复购完成率",
          value: "60",
        },
        {
          label: "90日复购完成率",
          value: "90",
        },
        {
          label: "365日复购完成率",
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

      const [err, res] = await this.$http.post("Order_Statistics/secondRate", {
        ...searchForm,
        ...tableOpt,
        navCate: 2,
        channel: searchForm["channel"].join(","),
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });

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

      const [err, res] = await this.$http.post("Order_Statistics/secondRate", {
        ...searchForm,
        select,
        navCate: 1,
        channel: searchForm["channel"].join(","),
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });

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

      let { date, list, totalInfo, listAll } = res;
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
          formatter: (res) => {
            return formatPercentage(res);
          },
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
          formatter: (res) => {
            return formatPercentage(res);
          },
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
