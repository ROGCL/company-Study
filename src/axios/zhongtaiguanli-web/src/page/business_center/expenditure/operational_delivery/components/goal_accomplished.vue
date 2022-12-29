<template>
  <TableLayout :column="column2" :data="tableData.data" :total="tableData.total" :loading="tableData.loading"
    :currentPage="tableData.currentPage" :params="outPamrms" :leadOut="true" alignStyle="center" author="liuqiang"
    leadApi="Operate_Invest/targetFinishList" @pageChange="onPageChange" ref="TableLayout" @sortChange="onSortChange"
    :cellStyle="cellStyle" :headerCellStyle="cellStyle">
    <div class="component_title" slot="title">数据报表</div>

    <div slot="table-option" class="Tab_box">
      <div class="left_box">
        <el-checkbox style="margin-left: 20px" v-model="flexFlag" @input="changeTableList">冻结维度项
        </el-checkbox>
      </div>

    </div>
  </TableLayout>
</template>

<script>
import { Mydata } from "../mixins/index.js";
import TableLayout from "@/layout/table";
export default {
  mixins: [Mydata],
  components: {
    TableLayout,
  },
  data() {
    return {
      sortablevale: "",
      flexFlag: false,
      tableData: {
        data: [],
        total: 0,
        currentPage: 1,
        pageSize: 10,
        loading: false,
      },
    }
  },
  computed: {
    outPamrms() {
      return {
        platform: this.searchForm.platform,
        appid: this.formatSearch("appid"),
        admin_id: this.formatSearch("admin"),
        appid: this.formatSearch("appid"),
        is_download: 1,
        timeStart: this.searchForm.time[0] ? this.searchForm.time[0] : "",
        timeEnd: this.searchForm.time[1] ? this.searchForm.time[1] : "",
        order: this.sortablevale ? this.sortablevale : undefined
      };
    },
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.tableData.loading = true
      let params = {
        platform: this.searchForm.platform,
        timeStart: this.searchForm.time[0] ? this.searchForm.time[0] : "",
        timeEnd: this.searchForm.time[1] ? this.searchForm.time[1] : "",
        currentPage: this.tableData.currentPage,
        admin_id: this.formatSearch("admin"),
        appid: this.formatSearch("appid"),
        order: this.sortablevale ? this.sortablevale : undefined
      }
      const [err, res] = await this.$http.post('Operate_Invest/targetFinishList', params)
      this.tableData.loading = false
      if (err) return
      this.tableData.data = res.data
      this.tableData.total = Number(res.total_number) || 0
    },

    cellStyle({ rowIndex, columnIndex }) {
      let columnIndexs = [4, 5, 6, 10, 11, 12, 16, 17, 18]
      if (columnIndexs.includes(columnIndex)) {
        return 'background:#e6e6e6;'
      }
    },
    onSortChange(e) {
      const idx = this.column2.findIndex(el => el.prop == e.prop)
      let order = e.order == "descending" ? 'desc' : 'asc'
      if (idx>-1) {
        this.sortablevale = `${this.column2[idx].prop}:${order}`
        this.getList()
      }
    },
    // 维度固定
    changeTableList(e) {
      const fiexedArr = ['date_b', 'date_e', 'title', 'realname']
      this.column2.forEach((item, index) => {
        const idx = fiexedArr.indexOf(item.prop)
        if (idx > -1) {
          item.fixed = e ? 'left' : ''
        }
      })
    },
    onPageChange() {
      this.tableData.currentPage = val
      this.getList()
    }
  }
}
</script>

<style scoped>
.component_title {
    background: #fff;
    padding: 20px 0 10px 15px;
    font-weight: bold;
}
</style>