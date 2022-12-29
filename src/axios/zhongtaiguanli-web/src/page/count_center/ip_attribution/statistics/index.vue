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
          <SelectOriginChannel
            v-model="searchForm.channel"
          ></SelectOriginChannel>
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
          v-if="searchForm.channel.length"
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
      leadApi="Ip/ipStatics"
      @pageChange="onPageChange"
    ></TableLayout>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";
import FilterLayout from "@/layout/form";
import CountLayout from "@/layout/count";
import TableLayout from "@/layout/table";
import { pickerOptions } from "@/config/option";
import SelectOriginChannel from "@/component/select-origin-channel";

export default {
  components: {
    FilterLayout,
    TableLayout,
    CountLayout,
    SelectOriginChannel,
  },
  data() {
    return {
      select: 1,
      allOrinfo: 1,
      column: [
        {
          prop: "date",
          label: "日期",
        },
        {
          prop: "today_pv",
          label: "浏览量PV",
        },
        {
          prop: "today_uv",
          label: "独立访客UV",
        },
        {
          prop: "device_new",
          label: "归因新增",
        },
        {
          prop: "device_active",
          label: "归因活跃",
        },
      ],
      selectOption: [
        {
          label: "归因新增",
          value: 1,
        },
        {
          label: "归因活跃",
          value: 2,
        },
        {
          label: "浏览量PV",
          value: 3,
        },
        {
          label: "独立访客UV",
          value: 4,
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
    if (this.$route.query.origin) {
      this.searchForm.channel = [this.$route.query.origin];
    }

    this.fetchList();
    this.fetchCount();
  },
  methods: {
    onSubmit() {
      this.tableOpt.currentPage = 1;
      this.fetchList();
      this.fetchCount();
    },
    onPageChange(current) {
      this.tableOpt.currentPage = current;
      this.fetchList();
    },
    onSelectChange() {
      this.fetchCount();
    },
    async fetchList() {
      const { searchForm, tableOpt } = this;

      this.tableData.loading = true;

      const [err, res] = await this.$http.post("Ip/ipStatics", {
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

      const [err, res] = await this.$http.post("Ip/ipStatics", {
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
        };
        return;
      }

      if (!res || !Object.keys(res).length) {
        this.countData.data = {
          legendData: [],
          xAxisData: [],
          data: [],
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
        };
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-cascader__search-input{
  min-width: 10px;
}
</style>