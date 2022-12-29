<template>
  <div>
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
export default {
  components: {
    TableLayout,
  },
  props: {
    requestObj: {
      type: Object,
    },
  },
  data() {
    return {
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
      column: [
        {
          label: "文案",
          prop: "title",
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
        "Material_Info/materialAdvertising",
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
      }
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  overflow: auto;
}
</style>