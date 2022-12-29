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
      <el-col :md="12" :lg="7" :sm="24" style="max-height: 50px">
        <el-form-item label="渠道" prop="channel">
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
      :countInfo="countInfo"
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
        <el-col :md="12" :sm="12">
          <el-form-item label="筛选项">
            <el-radio-group v-model="select" @change="onSelectChange">
              <el-radio-button
                v-for="(v, i) in selectOption"
                :key="i"
                :label="v.value"
                >{{ v.label }}</el-radio-button
              >
            </el-radio-group>
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
import _ from "lodash";
import { mapState, mapActions } from "vuex";
import FilterLayout from "@/layout/form";
import CountLayout from "@/layout/count";
import TableLayout from "@/layout/table";
import { pickerOptions, timeTypeOption } from "@/config/option";
import { Behavior_Statistics_useTime } from "@/config/api/index";
import chartHeaderLoop from "@/component/loopContrast/chartHeaderLoop";
import SelectChannel from "@/component/select-channel";

export default {
  components: {
    FilterLayout,
    TableLayout,
    CountLayout,
    chartHeaderLoop,
    SelectChannel,
  },
  data() {
    return {
      select: "1",
      selectOption: [
        {
          label: "单次使用时长",
          value: "1",
        },
        {
          label: "人均使用时长",
          value: "2",
        },
      ],
      countLoading: false,
      searchForm: {
        time: [
          moment().subtract(30, "d").format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD"),
        ],
        channel: [],
        version: "",
        timeType: 1,
      },
      column: [
        {
          prop: "date",
          label: "日期",
        },
        {
          prop: "open_day",
          label: "日均使用时长（秒）",
        },
        {
          prop: "open_one",
          label: "单次使用时长（秒）",
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      loopData: {},
      countInfo: {},
      CountLayoutOption: {},
      pickerOptions,
      allOrinfo: 1,
    };
  },
  mounted() {
    this.countData();
    this.fetchList();
  },
  computed: {
    ...mapState({
      channel: (state) => state.channel.data,
      app_version: (state) => state.app_version.data,
      tableData: (state) => state.duration_of_use.list,
    }),
    timeTypeConfig() {
      const { time } = this.searchForm;

      return timeTypeOption(time);
    },
  },
  methods: {
    ...mapActions(["getDurationOfUseList", "getDurationOfUseCount"]),
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

      const [err, res] = await this.getDurationOfUseList({
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
      const { count, select, searchForm } = this;

      this.countLoading = true;
      Behavior_Statistics_useTime({
        ...searchForm,
        channel: searchForm["channel"] ? searchForm["channel"].join(",") : "",
        navCate: 5,
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
        select,
      }).then((res) => {
        let { date, list, totalInfo, listAll } = res[1];
        if (this.allOrinfo == 1 && searchForm["channel"].length > 0) {
          this.countInfo = totalInfo;
          this.countLoading = false;
          this.CountLayoutOption = {
            legendData: Object.keys(listAll),
            xAxisData: date,
            data: listAll,
            yName: "秒",
            editData: true,
          };
        } else {
          this.countInfo = totalInfo;
          this.countLoading = false;
          this.CountLayoutOption = {
            legendData: Object.keys(list),
            xAxisData: date,
            data: list,
            yName: "秒",
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
