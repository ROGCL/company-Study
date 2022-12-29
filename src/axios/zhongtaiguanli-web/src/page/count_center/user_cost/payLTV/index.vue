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
      <!-- <el-col :md="6" :sm="12">
        <el-form-item label="LT" prop="timeType">
          <el-select
            v-model="searchForm.select"
            placeholder="请选择时间刻度"
            :popper-append-to-body="false"
          >
            <el-option
              :key="i"
              :label="v.label"
              :value="v.value"
              :disabled="v.disabled"
              v-for="(v, i) in LTList"
            />
          </el-select>
        </el-form-item>
      </el-col> -->
    </FilterLayout>
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
          <el-form-item label="LTV">
            <el-select
              v-model="searchForm.select"
              placeholder="请选择LTV"
              :popper-append-to-body="false"
              @change="onSelectChange"
            >
              <el-option
                :key="i"
                :label="v.label"
                :value="v.value"
                :disabled="v.disabled"
                v-for="(v, i) in LTList"
              />
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
          v-if="channelFlag"
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
      :leadOut="true"
      @sizeChange="onSizeChange"
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
      searchForm: {
        time: [
          moment().subtract(2, "M").format("YYYY-MM-DD"),
          moment().subtract(1, "M").format("YYYY-MM-DD"),
        ],
        channel: [],
        select: 1,
      },
      LTList: [
        {
          label: "1天LTV",
          value: 1,
        },
        {
          label: "2天LTV",
          value: 2,
        },
        {
          label: "3天LTV",
          value: 3,
        },
        {
          label: "4天LTV",
          value: 4,
        },
        {
          label: "5天LTV",
          value: 5,
        },
        {
          label: "6天LTV",
          value: 6,
        },
        {
          label: "7天LTV",
          value: 7,
        },
        {
          label: "14天LTV",
          value: 8,
        },
        {
          label: "30天LTV",
          value: 9,
        },
        {
          label: "60天LTV",
          value: 10,
        },
        {
          label: "90天LTV",
          value: 11,
        },
        {
          label: "180天LTV",
          value: 12,
        },
      ],
      column: [
        {
          prop: "date",
          label: "日期",
        },
        {
          prop: "day1",
          label: "1天LTV",
        },
        {
          prop: "day2",
          label: "2天LTV",
        },
        {
          prop: "day3",
          label: "3天LTV",
        },
        {
          prop: "day4",
          label: "4天LTV",
        },
        {
          prop: "day5",
          label: "5天LTV",
        },
        {
          prop: "day6",
          label: "6天LTV",
        },
        {
          prop: "day7",
          label: "7天LTV",
        },
        {
          prop: "day14",
          label: "14天LTV",
        },
        {
          prop: "day30",
          label: "30天LTV",
        },
        {
          prop: "day60",
          label: "60天LTV",
        },
        {
          prop: "day90",
          label: "90天LTV",
        },
        {
          prop: "day180",
          label: "180天LTV",
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      pickerOptions,
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
      tableData: (state) => {
        let data = state.user_life_cost_pay.list.data;
        const filterData = data.map((item) => {
          const obj = {};
          for (const key in item) {
            obj[key] = item[key];
            // if (key != "date") {
            //   obj[key] = item[key] != 0 ? item[key] : "";
            // } else {
            //   obj[key] = item[key];
            // }
          }
          return obj;
        });
        data.forEach((item, index) => {
          data[index] = filterData[index];
        });
        return state.user_life_cost_pay.list;
      },
      count: (state) => state.user_life_cost_pay.count.data,
      countLoading: (state) => state.user_life_cost_pay.count.loading,
    }),
    countData() {
      const { count } = this;

      if (!count || !Object.keys(count).length) {
        return {
          legendData: [],
          xAxisData: [],
          data: [],
          yName: "元",
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
          yName: "元",
        };
      } else {
        const xAxisData = date;
        const legendData = Object.keys(list);
        const data = _.values(list);

        return {
          legendData,
          xAxisData,
          data,
          yName: "元",
        };
      }
    },
    timeTypeConfig() {
      const { time } = this.searchForm;

      return timeTypeOption(time);
    },
  },
  methods: {
    ...mapActions(["getUserLifeCostPayList", "getUserLifeCostPayCount"]),

    async getCount2() {
      this.countLoading2 = true;
      const { searchForm } = this;
      const [err, res] = await this.$http.post("User_Statistics/payLTV", {
        ...searchForm,
        select: searchForm.select,
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
        navCate: 6,
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
          yName: "元",
          formatter: (res) => {
            return res + "元";
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
          yName: "元",
          formatter: (res) => {
            return res + "元";
          },
        };
      }
    },
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

      const [err, res] = await this.getUserLifeCostPayList({
        ...searchForm,
        ...tableOpt,
        navCate: 2,
        channel: searchForm["channel"].join(","),
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });

      if (err) return;
    },
    async fetchCount() {
      const { searchForm } = this;

      const [err, res] = await this.getUserLifeCostPayCount({
        ...searchForm,
        select: searchForm.select,
        navCate: 5,
        channel: searchForm["channel"].join(","),
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });

      if (err) return;
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-cascader__search-input {
  min-width: 10px;
}
</style>
