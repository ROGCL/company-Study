<template>
  <div>
    <el-select
      v-model="selcetVal"
      placeholder="请选择"
      @change="getMaterialVideoData"
    >
      <el-option
        v-for="item in selectList"
        :key="item.index"
        :label="item.desc"
        :value="item.index"
      >
      </el-option>
    </el-select>
    <CountLayout
      :key="num"
      :loading="countLoading"
      :option="CountLayoutOption"
      type="newBar"
      style="width: 1000px"
    ></CountLayout>
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      @sortChange="onSortChange"
      alignStyle="center"
    >
    </TableLayout>
  </div>
</template>

<script>
import TableLayout from "@/layout/table";
import CountLayout from "@/layout/count";

export default {
  components: {
    TableLayout,
    CountLayout,
  },
  props: {
    requestObj: {
      type: Object,
    },
    subNum: {
      type: Number,
    },
  },
  data() {
    return {
      selcetVal: "cost",
      selectList: [],
      num: 1,
      listData: {},
      CountLayoutOption: {},
      countLoading: false,
      tableData: {
        data: [],
        total: 0,
        currentPage: 1,
        pageSize: 10,
        loading: false,
      },
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      nameArr: ["点击率%", "转化率%"],
      column: [
        {
          label: "账号",
          prop: "account_name",
          width: "350",
        },
        {
          label: "总花费",
          prop: "cost",
          sortable: "custom",
        },
        {
          label: "曝光数",
          prop: "show",
          sortable: "custom",
        },
        {
          label: "点击数",
          prop: "click",
          sortable: "custom",
        },
        {
          label: "点击率",
          prop: "ctr",
          sortable: "custom",
        },
        {
          label: "转化数",
          prop: "convert",
          sortable: "custom",
        },
        {
          label: "转化成本",
          prop: "convert_cost",
          sortable: "custom",
        },
        {
          label: "转化率",
          prop: "convert_rate",
          sortable: "custom",
        },
        {
          label: "平均千次展示费用",
          prop: "cpm",
          sortable: "custom",
        },
        {
          label: "平均点击成本",
          prop: "avg_click_cost",
          sortable: "custom",
        },
      ],
      keyArr: ["convert_rate", "ctr"],
      numKeyArr: [
        "cost",
        "show",
        "click",
        "convert",
        "convert_cost",
        "cpm",
        "avg_click_cost",
      ],
      sort: {
        order: "",
        field: "",
      },
    };
  },
  methods: {
    async getMaterialSite() {
      this.tableData.loading = true;
      const { sort } = this;

      const [err, res] = await this.$http.post(
        "Material_Info/materialAdvertiser",
        {
          advertiser_id: this.requestObj.advertiser_id,
          material_id: this.requestObj.material_id,
          time_start: this.requestObj.time_start,
          time_end: this.requestObj.time_end,
          ...sort,
        }
      );
      if (err) {
        this.tableData.loading = false;
        return;
      }
      this.tableData.loading = false;
      let { list } = res;
      list.forEach((item) => {
        for (const key in item) {
          if (this.keyArr.indexOf(key) >= 0 && item[key]) {
            item[key] = (item[key] * 100).toFixed(2) + "%";
          }
          if (this.numKeyArr.indexOf(key) >= 0 && item[key]) {
            item[key] = parseFloat(item[key]).toLocaleString();
          }
        }
      });
      this.tableData.data = list;
    },
    async getMaterialVideoData() {
      this.num += 1;
      this.countLoading = true;
      console.log(this.requestObj);
      const [err, res] = await this.$http.post(
        "Material_Info/materialSearchHistogram",
        {
          advertiser_id: this.requestObj.advertiser_id,
          material_id: this.requestObj.material_id,
          time_start: this.requestObj.time_start,
          time_end: this.requestObj.time_end,
          index: this.selcetVal,
        }
      );
      if (err) {
        this.countLoading = false;
        return;
      }
      console.log(res);
      this.listData = res;
      let date = res.list.map((item) => {
        return item.x;
      });
      let arr = [];
      res.list.forEach((item) => {
        arr.push(item.y);
      });
      let name = "";
      this.selectList.forEach((item) => {
        if (item.index == this.selcetVal) {
          name = item.desc;
        }
      });
      let data = [];
      data.push({
        data: arr,
        name,
        type: "line",
      });
      this.countLoading = false;
      const _data = data.map((item) => {
        return {
          ...item,
        };
      });
      let yAxis = [
        {
          type: "value",
          name: "",
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
        },
      ];
      this.CountLayoutOption = {
        legendData: data,
        xAxisData: date,
        data: _data,
        yAxis: yAxis,
        formatter: (res) => {
          let html = `${res[0].axisValueLabel}<br/>`;
          res.forEach((v) => {
            html += `${v.marker}${v.seriesName}：${
              this.nameArr.indexOf(v.seriesName) >= 0
                ? (v.value * 100).toFixed(2) + "%"
                : parseFloat(v.value).toLocaleString()
            }<br/>`;
          });
          return html;
        },
      };
    },
    async getIndex() {
      const [err, res] = await this.$http.post(
        "Material_Info/materialSearchIndex",
        {
          advertiser_id: this.requestObj.advertiser_id,
          material_id: this.requestObj.material_id,
          time_start: this.requestObj.time_start,
          time_end: this.requestObj.time_end,
        }
      );
      if (err) {
        return;
      }
      this.selectList = res.list;
    },
    onSortChange(data) {
      const { prop } = data;
      let order = data.order;
      if (order === "ascending") {
        this.sort.order = "asc";
      }
      if (order === "descending") {
        this.sort.order = "desc";
      }
      this.sort.field = prop;
      this.getMaterialSite();
    },
  },
  watch: {
    requestObj(val) {
      if (val) {
        this.getMaterialSite();
        this.getIndex();
        this.getMaterialVideoData();
      }
    },
    subNum(val) {
      this.getMaterialVideoData();
    },
  },
};
</script>

<style lang="less" scoped>
</style>