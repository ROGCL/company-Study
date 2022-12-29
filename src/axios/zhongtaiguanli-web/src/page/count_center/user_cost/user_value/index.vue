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
      <el-col :md="5" :sm="12">
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
    <CountLayout
      :option="CountLayoutOption"
      :loading="countLoading"
      :countInfo="totalInfo"
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
              v-model="select.value"
              placeholder="请选择筛选项"
              @change="onSelectChange"
            >
              <el-option
                v-for="(v, i) in selectOption"
                :key="i"
                :label="v.label"
                :value="v.value"
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
      @sizeChange="onSizeChange"
      @pageChange="onPageChange"
    ></TableLayout>
  </div>
</template>

<script>
import moment from "moment";
import { mapState, mapActions } from "vuex";
import FilterLayout from "@/layout/form";
import CountLayout from "@/layout/count";
import TableLayout from "@/layout/table";
import { pickerOptions, timeTypeOption } from "@/config/option";
import { User_Statistics_userValue } from "@/config/api/index";
import chartHeaderLoop from "@/component/loopContrast/chartHeaderLoop";
import SelectChannel from "@/component/select-channel";

export default {
  name: "home",
  components: {
    FilterLayout,
    TableLayout,
    CountLayout,
    chartHeaderLoop,
    SelectChannel,
  },
  data() {
    return {
      select: {
        label: "单用户价值",
        value: "1",
      },
      selectOption: [
        {
          label: "单用户价值",
          value: "1",
        },
        {
          label: "单付费用户价值",
          value: "2",
        },
        {
          label: "会员价值",
          value: "3",
        },
        {
          label: "广告价值",
          value: "4",
        },
        {
          label: "新用户价值",
          value: "5",
        },
        {
          label: "新用户会员价值",
          value: "6",
        },
        {
          label: "新用户广告价值",
          value: "7",
        },
      ],
      countLoading: false,
      searchForm: {
        time: [
          moment().subtract(30, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
        channel: [],
        timeType: 1,
      },
      column: [
        {
          prop: "date",
          label: "日期",
        },
        {
          prop: "pay_user_per",
          label: "单付费用户价值(元)",
        },
        {
          prop: "user_per",
          label: "单用户价值(元)",
        },
        {
          prop: "order_per",
          label: "会员价值(元)",
        },
        {
          prop: "advert_per",
          label: "广告价值(元)",
        },
        {
          prop: "new_user_value",
          label: "新用户价值",
        },
        {
          prop: "new_user_value_order",
          label: "新用户会员价值",
        },
        {
          prop: "new_user_value_advert",
          label: "新用户广告价值",
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      totalInfo: {},
      CountLayoutOption: {},
      pickerOptions,
      allOrinfo: 1,
      channelFlag: false,
    };
  },
  mounted() {
    this.countData();
    this.fetchList();
  },
  computed: {
    ...mapState({
      channel: (state) => state.channel.data,
      tableData: (state) => state.user_value.list,
    }),
    timeTypeConfig() {
      const { time } = this.searchForm;

      return timeTypeOption(time);
    },
  },
  methods: {
    ...mapActions(["getUserValueList", "getUserValueCount"]),
    onSubmit(res) {
      this.tableOpt.currentPage = 1;
      this.fetchList();
      this.countData();
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
      this.countData();
    },
    async fetchList() {
      const { searchForm, tableOpt } = this;

      const [err, res] = await this.getUserValueList({
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
    onAllChange() {
      this.countData();
    },
    countData() {
      const { select, searchForm } = this;

      this.countLoading = true;
      User_Statistics_userValue({
        ...searchForm,
        channel: searchForm["channel"] ? searchForm["channel"].join(",") : "",
        navCate: 5,
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
        select: select.value,
      }).then((res) => {
        let { date, list, totalInfo, listAll } = res[1];
        this.countLoading = false;
        this.totalInfo = totalInfo;

        if (this.allOrinfo == 1 && searchForm["channel"].length > 0) {
          this.CountLayoutOption = {
            legendData: Object.keys(listAll),
            xAxisData: date,
            data: listAll,
            yName: "元",
            editData: true,
          };
        } else {
          this.CountLayoutOption = {
            legendData: Object.keys(list),
            xAxisData: date,
            data: list,
            yName: "元",
            editData: true,
          };
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-cascader__search-input {
  min-width: 10px;
}
</style>
