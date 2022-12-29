<template>
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="时间" prop="time">
          <dataPicker :datevalue.sync="searchForm.time"></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="收入渠道" prop="res">
          <el-select v-model="searchForm.res" placeholder="全部收入渠道" :popper-append-to-body="false" multiple
            :multiple-limit="10" filterable>
            <el-option v-for="(v, i) in resource" :key="i" :label="v.title" :value="v.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="广告类型" prop="adCate">
          <el-select v-model="searchForm.adCate" placeholder="全部广告类型" :popper-append-to-body="false" multiple
            :multiple-limit="10" filterable>
            <el-option v-for="(v, i) in ad_cate" :key="i" :label="v.title" :value="v.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="APP" prop="appIds">
          <el-select v-model="searchForm.appIds" placeholder="全部APP" :popper-append-to-body="false" multiple
            :multiple-limit="10" filterable @change="changeApp()">
            <el-option v-for="(v, i) in apps" :key="i" :label="v.title" :value="v.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="广告位" prop="positionIds">
          <el-select v-model="searchForm.positionIds" placeholder="全部广告位" :popper-append-to-body="false" multiple
            :multiple-limit="10" filterable @change="changePosition()">
            <el-option v-for="(v, i) in positions" :key="i" :label="v.title" :value="v.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-button slot="ggwgl" @click="goAdsense"> 广告位关联 </el-button>
    </FilterLayout>
    <div class="showlist">
      <div class="show-item">
        <div class="title">请求:</div>
        <div class="content">
          <div class="count">{{ tableData.sumArr.request_th }}</div>
          <div class="rate" :style="getcolors(tableData.sumArr.request_th_rate)">
            {{ tableData.sumArr.request_th_rate }}
          </div>
        </div>
      </div>
      <div class="show-item">
        <div class="title">展示:</div>
        <div class="content">
          <div class="count">{{ tableData.sumArr.show_th }}</div>
          <div class="rate" :style="getcolors(tableData.sumArr.show_th_rate)">
            {{ tableData.sumArr.show_th_rate }}
          </div>
        </div>
      </div>
      <div class="show-item">
        <div class="title">点击:</div>
        <div class="content">
          <div class="count">{{ tableData.sumArr.click_th }}</div>
          <div class="rate" :style="getcolors(tableData.sumArr.click_th_rate)">
            {{ tableData.sumArr.click_th_rate }}
          </div>
        </div>
      </div>
      <div class="show-item">
        <div class="title">收入:</div>
        <div class="content">
          <div class="count">{{ tableData.sumArr.cost }}</div>
          <div class="rate" :style="getcolors(tableData.sumArr.cost_rate)">
            {{ tableData.sumArr.cost_rate }}
          </div>
        </div>
      </div>
      <div class="show-item">
        <div class="title">CPM:</div>
        <div class="content">
          <div class="count">{{ tableData.sumArr.cpm }}</div>
          <div class="rate" :style="getcolors(tableData.sumArr.cpm_rate)">
            {{ tableData.sumArr.cpm_rate }}
          </div>
        </div>
      </div>
      <div class="show-item">
        <div class="title">CPC:</div>
        <div class="content">
          <div class="count">{{ tableData.sumArr.cpc }}</div>
          <div class="rate" :style="getcolors(tableData.sumArr.cpc_rate)">
            {{ tableData.sumArr.cpc_rate }}
          </div>
        </div>
      </div>
      <div class="show-item">
        <div class="title">CTR:</div>
        <div class="content">
          <div class="count">{{ tableData.sumArr.ctr }}</div>
          <div class="rate" :style="getcolors(tableData.sumArr.ctr_rate)">
            {{ tableData.sumArr.ctr_rate }}
          </div>
        </div>
      </div>
    </div>
    <TableLayout :column="column" :data="tableData.data" :total="tableData.total" :loading="tableData.loading"
      :currentPage="tableOpt.currentPage" :params="searchForm" :leadOut="true" @sizeChange="onSizeChange"
      @pageChange="onPageChange" @sortChange="onSortChange">
      <div slot="table-option">
        <el-checkbox style="margin-left: 20px" v-model="flexFlag" @input="changeTableList">冻结维度项
        </el-checkbox>
      </div>
    </TableLayout>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";
import { mapActions, mapState } from "vuex";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import { pickerOptions, timeTypeOption } from "@/config/option";

export default {
  components: {
    FilterLayout,
    TableLayout,
  },
  data() {
    return {
      flexFlag: false,
      select: "1",
      searchForm: {
        time: [
          moment().subtract(1, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
        adTypes: [],
        positionIds: [],
        appIds: [],
        res: [],
        channel: [],
        adCate: [],
      },
      vipOptions: [
        {
          label: "否",
          value: 0,
          disabled: false,
        },
        {
          label: "是",
          value: 1,
          disabled: false,
        },
      ],

      column: [
        {
          label: "ID",
          prop: "id",
          allowFixed: true // 是否允許固定操作
        },
        {
          label: "时间",
          prop: "date",
          sortable: "custom",
          allowFixed: true // 是否允許固定操作
        },
        {
          label: "APP",
          prop: "bu_app_id",
          allowFixed: true // 是否允許固定操作
        },

        {
          label: "广告位",
          prop: "bu_adpositionid_name",
          allowFixed: true // 是否允許固定操作
        },
        {
          label: "广告类型",
          prop: "bu_adtypemine_name",
          allowFixed: true // 是否允許固定操作
        },
        {
          label: "广告名称",
          prop: "title",
          allowFixed: true // 是否允許固定操作
        },
        {
          label: "收入渠道",
          prop: "channel_income",
          allowFixed: true // 是否允許固定操作
        },
        {
          label: "日活",
          prop: "active",
        },
        {
          label: "启动",
          prop: "times",
        },
        {
          label: "收入",
          prop: "cost",
          sortable: "custom",
        },
        {
          label: "请求量（本地）",
          prop: "ad_pull_num",
          sortable: "custom",
        },
        {
          label: "下发成功(本地)",
          prop: "request",
          sortable: "custom",
        },
        {
          label: "展示量(本地)",
          prop: "show",
          sortable: "custom",
        },
        {
          label: "点击量(本地)",
          prop: "click",
          sortable: "custom",
        },
        {
          label: "请求量(三方)",
          prop: "request_th",
          sortable: "custom",
        },
        {
          label: "请求占比",
          prop: "request_th_rate",
        },
        {
          label: "下发成功（三方）",
          prop: "return_count_th",
          sortable: "custom",
        },
        {
          label: "展示量(三方)",
          prop: "show_th",
          sortable: "custom",
        },
        {
          label: "展示量占比",
          prop: "show_th_rate",
        },
        {
          label: "点击量(三方)",
          prop: "click_th",
          sortable: "custom",
        },
        {
          label: "填充率",
          prop: "GFR",
          sortable: "custom",
        },
        {
          label: "展示（三方）/请求（本地）",
          prop: "show_pull",
          sortable: "custom",
        },
        {
          label: "展示率",
          prop: "show_rate",
          sortable: "custom",
        },
        {
          label: "CPM",
          prop: "cpm",
          sortable: "custom",
        },
        {
          label: "CPC",
          prop: "cpc",
          sortable: "custom",
        },
        {
          label: "CTR",
          prop: "ctr",
          sortable: "custom",
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      countBar: {},
      pickerOptions,
      sort: {
        prop: "",
        order: "",
      },
    };
  },
  mounted() {
    this.fetchList();
    this.fetchCount();
    this.getAdApp();
    this.getAdCate();
    this.getResource();
  },
  computed: {
    ...mapState({
      positions: (state) => state.position.data,
      apps: (state) => state.ad_app.data,
      adTypes: (state) => state.ad_types.data,
      resource: (state) => state.resource.data,
      ad_cate: (state) => state.ad_cate.data,
      tableData: (state) => state.ad_index.list,
      count: (state) => state.ad_index.count.data,
      countLoading: (state) => state.ad_index.count.loading,
    }),
    countData() {
      const { count } = this;
      if (!count || !Object.keys(count).length) {
        return {
          legendData: [],
          xAxisData: [],
          data: [],
          yName: "单",
        };
      }

      const { date, list } = count;

      const xAxisData = date;
      const legendData = Object.keys(list);
      const data = _.values(list);

      return {
        legendData,
        xAxisData,
        data,
        yName: "单",
      };
    },
    countBarData() {
      const { countBar } = this;

      if (!countBar || !Object.keys(countBar).length) {
        return {
          tooltip: {
            trigger: "axis",
            borderRadius: 6,
          },
          xAxis: [],
          yAxis: [],
          series: [],
          legend: [],
        };
      }

      const { list } = countBar;
      const xAxisData = ["新增", "注册", "下单", "支付成功", "退单  "];
      const data = _.values(list).map((v) => v.data);
      const _data = data && data.length ? data[0] : [];
      return {
        tooltip: {
          trigger: "axis",
          borderRadius: 6,
          formatter: (name) => {
            const order = name[0];
            const cover = name[1];
            const orderCount = order.data;
            const coverCount = (
              (cover.data / _data[cover["dataIndex"] - 1]) *
              100
            ).toFixed(0);
            if (!cover["dataIndex"]) {
              return `订单数: ${orderCount}`;
            }

            return `订单数: ${orderCount}<br>转化率: ${coverCount !== "NAN" ? coverCount : 0
              }%`;
          },
        },
        legend: {
          data: ["订单数", "转化率"],
        },
        xAxis: [
          {
            type: "category",
            data: xAxisData,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            name: "订单数",
          },
          {
            type: "value",
            scale: true,
            name: "转化率",
            show: false,
          },
        ],
        series: [
          {
            name: "订单数",
            type: "bar",
            barWidth: "60%",
            data: _data,
          },
          {
            name: "转化率",
            type: "line",
            data: _data,
          },
        ],
      };
    },
    timeTypeConfig() {
      const { time } = this.searchForm;
      return timeTypeOption(time);
    },
  },
  methods: {
    ...mapActions([
      "getAdIndexList",
      "getAdIndexCount",
      "getAdApp",
      "getPosition",
      "getAdTypes",
      "getAdCate",
      "getResource",
    ]),
    changeTableList(e) {
      this.column.forEach(el => {
        el.fixed = (el.allowFixed && e) ? 'left' : ''
      })
    },
    getcolors(num) {
      if (num !== undefined) {
        num = num + "";
        return {
          color: num.indexOf("-") == -1 ? "#f56c6c" : "#67c23a",
        };
      }
    },
    changeApp() {
      this.getPosition({
        appIds: this.searchForm.appIds.join(","),
        timeBegin: this.searchForm["time"][0],
        timeEnd: this.searchForm["time"][1],
      });
    },
    changePosition() {
      this.getAdTypes({
        positionIds: this.searchForm.positionIds.join(","),
      });
    },
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
    onSortChange(data) {
      const { prop, order } = data;

      this.sort = { prop, order };

      this.tableOpt.currentPage = 1;
      this.fetchList();
    },
    onSelectChange() {
      this.fetchCount();
    },
    async fetchList() {
      const { searchForm, tableOpt, sort } = this;
      const [err, res] = await this.getAdIndexList({
        ...searchForm,
        ...tableOpt,
        ...sort,
        navCate: 2,
        adTypes: searchForm["adTypes"].join(","),
        positionIds: searchForm["positionIds"].join(","),
        appIds: searchForm["appIds"].join(","),
        res: searchForm["res"].join(","),
        adCate: searchForm["adCate"].join(","),
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });
      if (err) {
        return;
      }
    },
    async fetchCount() {
      const { searchForm, select } = this;
      const [err, res] = await this.getAdIndexCount({
        ...searchForm,
        select,
        navCate: 1,
        adTypes: searchForm["adTypes"].join(","),
        positionIds: searchForm["positionIds"].join(","),
        appIds: searchForm["appIds"].join(","),
        res: searchForm["res"].join(","),
        adCate: searchForm["adCate"].join(","),
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });

      if (err) {
        return;
      }
    },
    goAdsense() {
      console.log(1);
      this.$router.push({
        path: "/business_center/ad_index/adsense",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.showlist {
  display: flex;
  align-items: center;
  height: 90px;
  padding: 20px 10px;
  margin-top: 20px;
  background-color: #fff;

  .show-item {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    line-height: 1;
    padding: 0 10px;

    &:not(:last-child) {
      border-right: 1px solid #eee;
    }

    .title {
      width: 100%;
      text-align: center;
      font-size: 16px;
      color: #000;
    }

    .content {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .count {
        font-size: 16px;
        color: #666;
      }

      .rate {
        font-size: 13px;
      }
    }
  }
}
</style>