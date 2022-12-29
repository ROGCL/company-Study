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
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="渠道" prop="channel">
          <SelectChannel v-model="searchForm.channel"></SelectChannel>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <CountLayout
      :option="countData.data"
      :loading="countData.loading"
      :countInfo="countData.totalInfo"
      type="newBar"
    >
    </CountLayout>
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
    ></TableLayout>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";
import { mapState, mapActions } from "vuex";
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
      selectOption: [
        {
          label: "投放金额",
          value: "1",
        },
      ],
      searchForm: {
        time: [
          moment().subtract(30, "d").format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD"),
        ],
        channel: [],
      },
      column: [
        {
          prop: "date",
          label: "日期",
        },
        {
          prop: "num_invest",
          label: "投放总金额（元）",
        },
        {
          prop: "cpd",
          label: "商店CPD（元）",
        },
        {
          prop: "fd",
          label: "信息流（元）",
        },
        {
          prop: "jx",
          label: "聚星",
        },
        {
          prop: "xt",
          label: "星图",
        },
        {
          prop: "other",
          label: "其他（元）",
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      countData: {
        data: {},
        totalInfo: {},
        loading: false,
      },
      pickerOptions,
    };
  },
  mounted() {
    this.fetchList();
    this.fetchCount();
  },
  computed: {
    ...mapState({
      channel: (state) => state.channel.data,
      tableData: (state) => state.put_in_data_count.list,
      count: (state) => state.put_in_data_count.count.data,
      countLoading: (state) => state.put_in_data_count.count.loading,
    }),
  },
  methods: {
    ...mapActions(["getPutInDataCountList", "getPutInDataCountCount"]),
    onSubmit(res) {
      this.tableOpt.currentPage = 1;
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

      const [err, res] = await this.getPutInDataCountList({
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
    },
    async fetchCount() {
      const { searchForm, select } = this;

      this.countData.loading = true;

      const [err, res] = await this.getPutInDataCountCount({
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
          yName: "元",
        };
        return;
      }

      let { date, data, totalInfo = {} } = res;

      this.countData.totalInfo = totalInfo;
      this.countData.data = {
        legendData: data,
        xAxisData: date,
        data,
        yName: "元",
      };
    },
  },
};
</script>

<style lang="less" scoped>
</style>