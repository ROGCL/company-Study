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
      <el-col :md="12" :lg="7" :sm="24">
        <el-form-item label="渠道" prop="channel">
          <SelectChannel v-model="searchForm.channel" multi></SelectChannel>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="版本号" prop="version">
          <!-- <el-select
            v-model="searchForm.version"
            placeholder="所有版本"
            multiple
            :popper-append-to-body="false"
            filterable
          >
            <el-option
              v-for="(v, i) in app_version"
              :key="i"
              :label="v"
              :value="v"
            />
          </el-select> -->
          <SelectCustomize
            :value="app_version_info"
            @changeScope="changeAppVersion"
            :data="app_version_data"
          />
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
      <template #title>
        <div class="count_title">日期新增趋势</div>
      </template>
      <template #cetent>
        <el-radio-group
          v-model="allOrinfo"
          @change="countData"
          v-if="channelFlag"
        >
          <el-radio-button :label="1">汇总走势</el-radio-button>
          <el-radio-button :label="2">明细走势</el-radio-button>
        </el-radio-group>
      </template>
      <template #option>
        <el-col :md="6" :sm="6">
          <el-form-item label="筛选项">
            <el-radio-group v-model="select" @change="countData">
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
    <CountLayout
      :option="versionLayoutOption"
      :loading="versionLoading"
      :countInfo="versionInfo"
    >
      <template #title>
        <div class="count_title">版本新增趋势</div>
      </template>
      <template #cetent>
        <el-radio-group
          v-model="vAllOrinfo"
          @change="versionData"
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
    >
      <template #proportion="row">{{
        row.row.proportion | formatPercentage
      }}</template>
    </TableLayout>
  </div>
</template>

<script>
import moment from "moment";
import { mapState, mapActions } from "vuex";
import FilterLayout from "@/layout/form";
import CountLayout from "@/layout/count";
import TableLayout from "@/layout/table";
import { pickerOptions, timeTypeOption } from "@/config/option";
import { User_Statistics_download } from "@/config/api/index";
import SelectChannel from "@/component/select-channel";
import SelectCustomize from "@/component/select-customize";

export default {
  name: "home",
  components: {
    FilterLayout,
    TableLayout,
    CountLayout,
    SelectChannel,
    SelectCustomize,
  },
  data() {
    return {
      app_version_info: {
        appInfo: [],
      },
      select: "2",
      selectOption: [
        {
          label: "买量数",
          value: "1",
        },
        {
          label: "激活数",
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
        timeType: 1,
        version: [],
      },
      app_version_data: [],
      column: [
        {
          prop: "date",
          label: "日期",
        },
        {
          prop: "new_device",
          label: "新增激活设备",
        },
        {
          prop: "num_download",
          label: "买量数",
        },
        {
          prop: "proportion",
          label: "买量占比",
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      countInfo: {},
      CountLayoutOption: {},
      versionLayoutOption: {},
      versionInfo: {},
      versionLoading: false,
      pickerOptions,
      allOrinfo: 1,
      vAllOrinfo: 1,
      app_version: [],
      channelFlag: false,
    };
  },
  mounted() {
    this.countData();
    this.fetchList();
    this.getVersion();
    this.versionData();
  },
  computed: {
    ...mapState({
      tableData: (state) => state.down_active.list,
    }),
    timeTypeConfig() {
      const { time } = this.searchForm;

      return timeTypeOption(time);
    },
  },
  methods: {
    ...mapActions(["getDownActiveList", "getDownActiveCount"]),
    onSubmit(res) {
      this.tableOpt.currentPage = 1;
      this.fetchList();
      this.countData();
      this.versionData();
      if (this.searchForm.channel.length) {
        this.channelFlag = true;
      } else {
        this.channelFlag = false;
        this.vAllOrinfo = 1;
      }
    },
    changeAppVersion(val) {
      this.searchForm.version = val.appInfo;
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
    onAllChange() {
      this.countData();
    },
    // 获取渠道号
    async getVersion() {
      const [err, res] = await this.$http.post("App/getVersionV2");
      if (err) {
        return;
      }
      let arr = [];
      res.forEach((item) => {
        arr.push({
          title: item,
          id: item,
        });
      });
      console.log(arr);
      this.app_version_data = arr;
    },
    // 获取表格数据
    async fetchList() {
      const { searchForm, tableOpt } = this;

      const [err, res] = await this.getDownActiveList({
        ...searchForm,
        ...tableOpt,
        navCate: 2,
        channel: searchForm["channel"].join(","),
        version: searchForm["version"].join(","),
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });

      if (err) {
        return;
      }
    },
    // 生成时间排序Echarts
    countData() {
      const { select, searchForm } = this;
      this.countLoading = true;
      User_Statistics_download({
        ...searchForm,
        channel: searchForm["channel"].join(","),
        version: searchForm["version"].join(","),
        navCate: 5,
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
        select,
      }).then((res) => {
        let { date = {}, list = {}, totalInfo = {}, listAll = {} } = res[1];
        if (this.allOrinfo == 1 && searchForm["channel"].length > 0) {
          this.countInfo = totalInfo;
          this.countLoading = false;
          this.CountLayoutOption = {
            legendData: Object.keys(listAll),
            xAxisData: date,
            data: listAll,
            yName: "人",
            xName: "时间",
            editData: true,
          };
        } else {
          this.countInfo = totalInfo;
          this.countLoading = false;
          this.CountLayoutOption = {
            legendData: Object.keys(list),
            xAxisData: date,
            data: list,
            yName: "人",
            xName: "时间",
            editData: true,
          };
        }
      });
    },
    // 生成版本号排序Echarts
    async versionData() {
      const { select, searchForm } = this;
      this.versionLoading = true;
      const [err, res] = await this.$http.post("User_Statistics/download", {
        ...searchForm,
        channel: searchForm["channel"].join(","),
        version: searchForm["version"].join(","),
        navCate: 6,
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });
      if (err) {
        return;
      }
      console.log(res);
      let { date = {}, list = {}, totalInfo = {}, listAll = {} } = res;
      if (this.vAllOrinfo == 1 && searchForm["channel"].length > 0) {
        this.versionInfo = totalInfo;
        this.versionLoading = false;
        this.versionLayoutOption = {
          legendData: Object.keys(listAll),
          xAxisData: date,
          data: listAll,
          yName: "人",
          xName: "版本号",
          editData: true,
        };
      } else {
        this.versionInfo = totalInfo;
        this.versionLoading = false;
        this.versionLayoutOption = {
          legendData: Object.keys(list),
          xAxisData: date,
          data: list,
          yName: "人",
          xName: "版本号",
          editData: true,
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
.count_title {
  font-weight: bolder;
  font-size: 18px;
  padding: 0 0 10px 10px;
}
</style>
