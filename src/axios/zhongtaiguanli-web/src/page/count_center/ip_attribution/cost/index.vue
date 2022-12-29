<template>
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="时间" prop="time">
          <dataPicker :datevalue.sync="searchForm.time"></dataPicker>
        </el-form-item>
      </el-col>
    </FilterLayout>

    <CountLayout
      :option="countData.data"
      :loading="countData.loading"
      :countInfoArr="countData.totalInfo"
      type="newMix"
    >
      <div class="component_title mrg_btn" slot="title">趋势对比</div>
      <template #option>
        <el-col :md="5" :sm="8">
          <el-form-item label="指标">
            <el-select
              v-model="select_data"
              placeholder="请选择"
              @change="changeComparisonKey"
              :popper-append-to-body="false"
            >
              <el-option
                :disabled="v.id == select_data_copy"
                v-for="(v, i) in targetList"
                :key="i"
                :label="v.title"
                :value="v.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="2" :sm="8">
          <el-checkbox
            style="margin-left: 20px"
            v-model="checked"
            @change="changeCheck"
            >指标对比</el-checkbox
          >
        </el-col>
        <el-col :md="5" :sm="8" v-if="checked">
          <el-form-item label="对比指标">
            <el-select
              v-model="select_data_copy"
              placeholder="请选择"
              @change="changeComparisonKeyCopy"
              :popper-append-to-body="false"
            >
              <el-option
                :disabled="v.id == select_data"
                v-for="(v, i) in targetList"
                :key="i"
                :label="v.title"
                :value="v.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </template>
      <template #extras> </template>
    </CountLayout>

    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      :params="searchForm"
      author="liuqiang"
      :leadOut="true"
      leadApi="Operation/lists"
      alignStyle="center"
      @sizeChange="onSizeChange"
      @pageChange="onPageChange"
    >
    </TableLayout>
  </div>
</template>

<script>
import moment from "moment";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import CountLayout from "@/layout/count";

export default {
  components: {
    FilterLayout,
    TableLayout,
    CountLayout,
  },
  data() {
    return {
      select_data: 1,
      select_data_copy: "",
      checked: false,
      targetList: [],
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
      countData: {
        data: {},
        totalInfo: [],
        loading: false,
      },
      searchForm: {
        time: [
          moment().subtract(30, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
      },
      numKeyArr: ["appid_active", "total_cost"],
      column: [
        {
          prop: "date",
          label: "日期",
        },
        {
          prop: "appid_active",
          label: "日活",
        },
        {
          prop: "total_cost",
          label: "应用运维总成本",
        },
        {
          prop: "project_one_active_cost",
          label: "千人日活成本（应用）",
        },
        {
          prop: "ali_cost",
          label: "阿里云成本",
        },
        {
          prop: "huawei_cost",
          label: "华为云成本",
        },
        {
          prop: "tx_cost",
          label: "腾讯云成本",
        },
        {
          prop: "other_cost",
          label: "其他运维成本",
        },
        {
          prop: "zhongtai_total_cost",
          label: "中台运维成本",
        },
        {
          prop: "zhongtai_one_active_cost",
          label: "千人日活成本（中台）",
        },
      ],
      count_data: {},
      count_data_copy: {},
      count_xAxisData: [],
      count_total: "",
      count_avg: "",
      count_total_copy: "",
      count_avg_copy: "",
    };
  },
  mounted() {
    this.fetchList();
    this.getfetchList();
  },
  methods: {
    async fetchList() {
      const { searchForm, tableOpt } = this;

      this.tableData.loading = true;

      const [err, res] = await this.$http.post("Operation/lists", {
        ...tableOpt,

        timeStart: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });

      this.tableData.loading = false;

      if (err) return;

      const { data, currentPage, total, total_avg, total_sum } = res;
      data.forEach((item) => {
        for (const key in item) {
          if (this.numKeyArr.indexOf(key) >= 0 && item[key]) {
            item[key] = parseFloat(item[key]).toLocaleString();
          }
        }
        item.date = moment(item.date).format("YYYY-MM-DD");
      });
      for (const key in total_sum) {
        if (this.numKeyArr.indexOf(key) >= 0 && total_sum[key]) {
          total_sum[key] = parseFloat(total_sum[key]).toLocaleString();
        }
      }
      for (const key in total_avg) {
        if (this.numKeyArr.indexOf(key) >= 0 && total_avg[key]) {
          total_avg[key] = parseFloat(total_avg[key]).toLocaleString();
        }
      }
      let all = {};
      let mean = {};
      this.column.forEach((item) => {
        all[item.prop] = total_sum[item.prop];
        mean[item.prop] = total_avg[item.prop];
      });
      all.date = "总值";
      mean.date = "均值";
      this.tableData.data = [all, mean, ...data];
      this.tableData.currentPage = currentPage;
      this.tableData.total = total;
      this.sumList = total_sum;
      this.avgList = total_avg;
    },
    async fetchCount(val) {
      let valData = "";
      this.targetList.forEach((item) => {
        if (item.id == val) {
          valData = item.filed;
        }
      });
      const [err, res] = await this.$http.post("Operation/TheLineChart", {
        timeStart: this.searchForm["time"][0],
        timeEnd: this.searchForm["time"][1],
        target_id: this.select_data,
      });
      if (err) return;
      const { list, avg, total } = res;
      let xAxisData = [];
      let newList = list.map((item) => {
        return item[valData];
      });
      const _data = {
        data: newList,
        name: "日活",
        type: "line",
      };
      list.forEach((item) => {
        xAxisData.push(moment(item.date).format("YYYY-MM-DD"));
      });
      let yAxis = [
        {
          type: "value",
          name: "日活",
          min: 0,
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
        },
      ];
      this.count_data = _data;
      this.count_xAxisData = xAxisData;
      this.countData.data = {
        legendData: [_data],
        xAxisData: xAxisData,
        data: [_data],
        yAxis,
        formatter: (res) => {
          let html = `${res[0].axisValueLabel}<br/>`;
          res.forEach((v) => {
            html += `${v.marker}${v.seriesName}：${
              this.numKeyArr.indexOf(v.seriesName) >= 0
                ? parseFloat(v.value).toLocaleString()
                : v.value
            }<br/>`;
          });
          return html;
        },
      };
      this.countData.totalInfo = [
        {
          name: "日活",
          total,
          avg,
        },
      ];
    },
    async getfetchList() {
      const [err, res] = await this.$http.post("Operation/targetList");
      if (err) return;
      this.targetList = res;
      this.select_data = 1;
      this.fetchCount(1);
    },
    onSubmit() {
      this.tableOpt.currentPage = 1;
      this.fetchList();
      if (this.checked) {
        this.changeComparisonKey(this.select_data);
        this.changeComparisonKeyCopy(this.select_data_copy);
      } else {
        this.changeComparisonKey(this.select_data);
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
    async changeComparisonKey(val) {
      let filData = this.targetList.filter((item) => {
        return val == item.id;
      });
      let filData_copy = this.targetList.filter((item) => {
        return this.select_data_copy == item.id;
      });

      let valData = "";
      this.targetList.forEach((item) => {
        if (item.id == val) {
          valData = item.filed;
        }
      });
      const [err, res] = await this.$http.post("Operation/TheLineChart", {
        timeStart: this.searchForm["time"][0],
        timeEnd: this.searchForm["time"][1],
        target_id: this.select_data,
      });
      if (err) return;
      const { list, total, avg } = res;
      let xAxisData = [];
      let newList = list.map((item) => {
        return item[valData];
      });
      const _data = {
        data: newList,
        name: filData[0].title,
        type: "line",
      };
      list.forEach((item) => {
        xAxisData.push(moment(item.date).format("YYYY-MM-DD"));
      });
      let yAxis = this.checked
        ? [
            {
              type: "value",
              name: filData[0].title,
              min: 0,
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
            },
            {
              type: "value",
              name: filData_copy[0].title,
              min: 0,
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
            },
          ]
        : [
            {
              type: "value",
              name: filData[0].title,
              min: 0,
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
            },
          ];
      this.count_data = _data;
      this.count_xAxisData = xAxisData;
      this.count_total = total;
      this.count_avg = avg;
      this.countData.data = {
        legendData: this.checked ? [_data, this.count_data_copy] : [_data],
        xAxisData: xAxisData,
        data: this.checked ? [_data, this.count_data_copy] : [_data],
        yAxis,
        formatter: (res) => {
          let html = `${res[0].axisValueLabel}<br/>`;
          res.forEach((v) => {
            html += `${v.marker}${v.seriesName}：${
              this.numKeyArr.indexOf(v.seriesName) >= 0
                ? parseFloat(v.value).toLocaleString()
                : v.value
            }<br/>`;
          });
          return html;
        },
      };
      this.checked
        ? (this.countData.totalInfo = [
            {
              name: filData[0].title,
              total,
              avg,
            },
            {
              name: filData_copy[0].title,
              total: this.count_total_copy,
              avg: this.count_avg_copy,
            },
          ])
        : (this.countData.totalInfo = [
            {
              name: filData[0].title,
              total,
              avg,
            },
          ]);
    },
    async changeComparisonKeyCopy(val) {
      let filData = this.targetList.filter((item) => {
        return val == item.id;
      });
      let filData_copy = this.targetList.filter((item) => {
        return this.select_data == item.id;
      });
      let valData = "";
      this.targetList.forEach((item) => {
        if (item.id == val) {
          valData = item.filed;
        }
      });
      const [err, res] = await this.$http.post("Operation/TheLineChart", {
        timeStart: this.searchForm["time"][0],
        timeEnd: this.searchForm["time"][1],
        target_id: this.select_data_copy,
      });
      if (err) return;
      const { list, total, avg } = res;
      this.count_total_copy = total;
      this.count_avg_copy = avg;
      let xAxisData = [];
      let newList = list.map((item) => {
        return item[valData];
      });
      const _data = {
        data: newList,
        name: filData[0].title,
        type: "line",
      };
      list.forEach((item) => {
        xAxisData.push(moment(item.date).format("YYYY-MM-DD"));
      });
      let yAxis = [
        {
          type: "value",
          name: filData_copy[0].title,
          min: 0,
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
        },
        {
          type: "value",
          name: filData[0].title,
          min: 0,
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
        },
      ];
      this.count_data_copy = _data;
      this.countData.data = {
        legendData: [this.count_data, _data],
        xAxisData: xAxisData,
        data: [this.count_data, _data],
        yAxis,
        formatter: (res) => {
          let html = `${res[0].axisValueLabel}<br/>`;
          res.forEach((v) => {
            html += `${v.marker}${v.seriesName}：${
              this.numKeyArr.indexOf(v.seriesName) >= 0
                ? parseFloat(v.value).toLocaleString()
                : v.value
            }<br/>`;
          });
          return html;
        },
      };
      this.countData.totalInfo = [
        {
          name: filData_copy[0].title,
          total: this.count_total,
          avg: this.count_avg,
        },
        {
          name: filData[0].title,
          total,
          avg,
        },
      ];
    },
    changeCheck(val) {
      this.select_data_copy = "";
    },
  },
};
</script>

<style lang="less" scoped>
.component_title {
  padding-left: 20px;
  font-weight: bold;
  background: #fff;
}
.mrg_btn {
  margin-bottom: 20px;
}
/deep/.count-wrap .count-option {
  line-height: 40px;
}
</style>