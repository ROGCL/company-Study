<template >
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="时间" prop="time">
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
          <el-select v-model="searchForm.select" placeholder="请选择时间刻度" :popper-append-to-body="false">
            <el-option :key="i" :label="v.label" :value="v.value" :disabled="v.disabled" v-for="(v, i) in LTList" />
          </el-select>
        </el-form-item>
      </el-col> -->
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
      @pageChange="onPageChange"
      @sizeChange="onSizeChange"
      :cellStyle="cellStyle"
    ></TableLayout>
  </div>
</template >

<script >
import moment from "moment";
import _ from "lodash";
import { mapState, mapActions } from "vuex";
import FilterLayout from "@/layout/form";
import CountLayout from "@/layout/count";
import TableLayout from "@/layout/table";
import { pickerOptions, timeTypeOption } from "@/config/option";
import SelectChannel from "@/component/select-channel";
import store from "store2";
let customTableIndex = [];
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
        select: 7,
      },
      LTList: [
        {
          label: "7天LTV",
          value: 7,
        },
        {
          label: "14天LTV",
          value: 14,
        },
        {
          label: "30天LTV",
          value: 30,
        },
        {
          label: "60天LTV",
          value: 60,
        },
        {
          label: "90天LTV",
          value: 90,
        },
        {
          label: "180天LTV",
          value: 180,
        },
        {
          label: "365天LTV",
          value: 365,
        },
      ],
      column: [
        {
          prop: "date",
          label: "日期",
        },
        {
          prop: "day7",
          label: "7日LTV",
        },
        {
          prop: "day14",
          label: "14日LTV",
        },
        {
          prop: "day30",
          label: "30日LTV",
        },
        {
          prop: "day60",
          label: "60日LTV",
        },
        {
          prop: "day90",
          label: "90日LTV",
        },
        {
          prop: "day180",
          label: "180日LTV",
        },
        {
          prop: "day365",
          label: "365日LTV",
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      pickerOptions,
      allOrinfo: 1,
      allOrinfo2: 1,
      channelFlag:false,
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
      tableData: (state) => {
        customTableIndex = [];
        // 目标时间 = date + dayLTV; 例如: 20201217 + 7日LTV = 20201224
        // 如果目标时间大于当前时间 则让其字体颜色为#ededed
        let targetDate;
        let currentDate = moment().format("YYYY-MM-DD");
        state.user_life_cost.list.data.map((item, index) => {
          let i = -1;
          for (let key in item) {
            i++;
            if (key != "date") {
              targetDate = moment(item.date)
                .add(key.split("day")[1], "days")
                .format("YYYY-MM-DD");
              if (moment(currentDate).isBefore(targetDate)) {
                customTableIndex.push({
                  column: index,
                  row: i,
                  color: true,
                });
              }
            } else {
              customTableIndex.push({
                column: index,
                row: i,
                color: false,
              });
            }
          }
        });
        return state.user_life_cost.list;
      },
      count: (state) => state.user_life_cost.count.data,
      countLoading: (state) => state.user_life_cost.count.loading,
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
    ...mapActions(["getUserLifeCostList", "getUserLifeCostCount"]),

    async getCount2() {
      this.countLoading2 = true;
      const { searchForm } = this;
      const [err, res] = await this.$http.post("User_Statistics/allLTV", {
        ...searchForm,
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
        select: searchForm.select,
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
        this.channelFlag = true
      }else{
        this.channelFlag = false
        this.vAllOrinfo = 1
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
      this.fetchList();
    },
    onAllChange2() {
      this.getCount2();
    },
    async fetchList() {
      const { searchForm, tableOpt } = this;
      const [err, res] = await this.getUserLifeCostList({
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
      const { searchForm } = this;

      const [err, res] = await this.getUserLifeCostCount({
        ...searchForm,
        select: searchForm.select,
        navCate: 5,
        channel: searchForm["channel"].join(","),
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });

      if (err) {
        return;
      }
    },
    cellStyle({ columnIndex, rowIndex }) {
      for (let i = 0; i < customTableIndex.length; i++) {
        let { column, row, color } = customTableIndex[i];
        if (columnIndex == row && rowIndex == column && color) {
          return "color: #ededed";
        }
      }
    },
  },
};
</script >

<style lang="less" scoped>
/deep/ .el-cascader__search-input {
  min-width: 10px;
}
</style>
