<template>
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="时间" prop="time">
          <dataPicker :datevalue.sync="searchForm.time"></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="12">
        <el-form-item label="渠道" prop="time">
          <SelectChannel v-model="searchForm.channel"></SelectChannel>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <!--  -->
    <CountLayout
      :option="countData"
      :loading="countLoading"
      :countInfo="count.totalInfo || {}"
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
              <el-option label="7日LT" value="6" />
              <el-option label="14日LT" value="7" />
              <el-option label="30日LT" value="8" />
              <el-option label="60日LT" value="9" />
              <el-option label="90日LT" value="12" />
              <el-option label="120日LT" value="10" />
              <el-option label="365日LT" value="11" />
            </el-select>
          </el-form-item>
        </el-col>
      </template>
    </CountLayout>
    <!-- 用户生命周期价值  -->
    <CountLayout :option="countData2" :loading="countLoading2">
      <template #cetent>
        <el-radio-group
          v-model="allOrinfo2"
          @change="onAllChange2"
          v-if="searchForm.channel.length"
        >
          <el-radio-button :label="1">汇总走势</el-radio-button>
          <el-radio-button :label="2">明细走势</el-radio-button>
        </el-radio-group>
      </template>
    </CountLayout>
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      :params="searchForm"
      @sizeChange="onSizeChange"
      :leadOut="true"
      @pageChange="onPageChange"
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
import { pickerOptions, timeTypeOption } from "@/config/option";
import SelectChannel from "@/component/select-channel";
import store from "store2";
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
      countLoading2: false,
      countData2: {},
      select: "6",
      searchForm: {
        time: [
          moment().subtract(30, "d").format("YYYY-MM-DD"),
          moment().subtract(2, "d").format("YYYY-MM-DD"),
        ],
        channel: [],
        version: "",
        timeType: 1,
      },
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      pickerOptions: {
        ...pickerOptions,
        disabledDate: (val) => {
          return !moment(val).isBetween(moment().subtract(10, "y"), moment());
        },
      },
      allOrinfo: 1,
      allOrinfo2: 1,
      channelFlag: false,
    };
  },
  mounted() {
    this.fetchList();
    this.fetchCount();
    this.getCount2();
  },
  computed: {
    ...mapState({
      channel: (state) => state.channel.data,
      tableData: (state) => state.keep_lt.list,
      count: (state) => state.keep_lt.count.data,
      countLoading: (state) => state.keep_lt.count.loading,
    }),
    countData() {
      const { count, select } = this;
      if (!count || !Object.keys(count).length) {
        return {
          legendData: [],
          xAxisData: [],
          data: [],
          yName: "天",
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
          yName: "天",
        };
      } else {
        const xAxisData = date;
        const legendData = Object.keys(list);
        const data = _.values(list);

        return {
          legendData,
          xAxisData,
          data,
          yName: "天",
        };
      }
    },
    timeTypeConfig() {
      const { time } = this.searchForm;

      return timeTypeOption(time);
    },
    column() {
      return [
        {
          prop: "date",
          label: "日期",
        },
        {
          prop: "reg",
          label: "新增用户（设备）",
        },
        {
          prop: "day1",
          label: "2日LT",
        },
        {
          prop: "day2",
          label: "3日LT",
        },
        {
          prop: "day3",
          label: "4日LT",
        },
        {
          prop: "day4",
          label: "5日LT",
        },
        {
          prop: "day5",
          label: "6日LT",
        },
        {
          prop: "day6",
          label: "7日LT",
        },
        {
          prop: "day7",
          label: "14日LT",
        },
        {
          prop: "day8",
          label: "30日LT",
        },
        {
          prop: "day9",
          label: "60日LT",
        },
        {
          prop: "day12",
          label: "90日LT",
        },
        {
          prop: "day10",
          label: "120日LT",
        },
        {
          prop: "day11",
          label: "365日LT",
        },
      ];
    },
  },
  methods: {
    ...mapActions(["getKeepLtList", "getKeepLtCount"]),
    onSubmit(res) {
      this.tableOpt.currentPage = 1;
      this.fetchList();
      this.fetchCount();
      this.getCount2();
      if (this.searchForm.channel.length) {
        this.channelFlag = true;
      } else {
        this.channelFlag = false;
        this.vAllOrinfo = 1;
      }
    },
    async getCount2() {
      this.countLoading2 = true;
      const { searchForm, select } = this;
      const [err, res] = await this.$http.post("User_Statistics/keepLT", {
        ...searchForm,
        select,
        navCate: 6,
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
        channel: searchForm["channel"].join(","),
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });
      this.countLoading2 = false;
      if (err) {
        return;
      }

      if (this.allOrinfo2 == 1 && this.searchForm.channel.length > 0) {
        const xAxisData = res.date;
        const legendData = Object.keys(res.listAll);
        const data = _.values(res.listAll);
        this.countData2 = {
          legendData,
          xAxisData,
          data,
          yName: "天",
          formatter: (res) => {
            return res + "天";
          },
        };
      } else {
        const xAxisData = res.date;
        const legendData = Object.keys(res.list);
        const data = _.values(res.list);
        this.countData2 = {
          legendData,
          xAxisData,
          data,
          yName: "天",
          formatter: (res) => {
            return res + "天";
          },
        };
      }
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
    onAllChange() {
      this.countData();
    },
    onAllChange2() {
      this.getCount2();
    },
    async fetchList() {
      const { searchForm, tableOpt } = this;

      const [err, res] = await this.getKeepLtList({
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

      const [err, res] = await this.getKeepLtCount({
        ...searchForm,
        select,
        navCate: 5,
        channel: searchForm["channel"].join(","),
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });

      if (err) {
        return;
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-cascader__search-input {
  min-width: 10px;
}

/deep/.el-form-item {
  width: 330px;
}
</style>
