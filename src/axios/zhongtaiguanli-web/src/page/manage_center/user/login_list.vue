<template >
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="5" :sm="12">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" />
        </el-form-item>
      </el-col>
      <el-col :md="5" :sm="12">
        <el-form-item label="筛选" prop="search">
          <el-input
            v-model="searchForm.search"
            placeholder="请输入账号/手机号/插件ID"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="筛选时间">
          <dataPicker :datevalue.sync="time"></dataPicker>
        </el-form-item>
      </el-col>
    </FilterLayout>

    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      @pageChange="onPageChange"
      @sizeChange="onSizeChange"
      :tablePagination="3"
    >
      <template #table-option>
        <el-button :type="signn === 'noOverSignn' ? 'primary' : ''" @click="aaa"
          >未处理</el-button
        >
        <el-button :type="signn === 'overSignn' ? 'primary' : ''" @click="bbb"
          >已处理</el-button
        >
      </template>
      <template #option="row" class="btn_flex">
        <el-button
          @click="refuseLogin(row)"
          type="danger"
          size="small"
          v-if="status === 1"
          >拒绝授权</el-button
        >
        <el-button
          @click="agreeLogin(row)"
          type="primary"
          size="small"
          v-if="status === 1"
          style="margin-left: 10px"
          >同意授权</el-button
        >
        <span v-if="status === 3 && row.row.status == 2" style="color:#ff4949">拒绝授权</span>
        <span v-if="status === 3 && row.row.status == 3" style="color:#13ce66">同意授权</span>
      </template>
    </TableLayout>
  </div>
</template >

<script >
import moment from "moment";
import axios from "@/util/axios";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";

export default {
  name: "home",
  components: {
    FilterLayout,
    TableLayout,
  },
  data() {
    return {
      signn: "noOverSignn",
      status: 1,
      searchForm: {
        name: "",
        search: "",
      },
      time: [
        moment().subtract(30, "d").format("YYYY-MM-DD"),
        moment().subtract(0, "d").format("YYYY-MM-DD"),
      ],
      tableData: {
        data: [],
        total: 0,
        currentPage: 1,
        pageSize: 10,
        loading: false,
      },
      column: [
        {
          prop: "name",
          label: "账号",
        },
        {
          prop: "realname",
          label: "真实姓名",
        },
        {
          prop: "phone",
          label: "手机号",
        },
        {
          prop: "mac_no",
          label: "插件ID",
        },
        {
          prop: "add_time",
          label: "发起时间",
        },
        {
          prop: "option",
          label: "操作",
          width: "300px",
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      showDelete: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.tableData.loading = true;
      const { searchForm, tableOpt } = this;
      const [err, res] = await this.$http.post("admin/user_check_list", {
        ...searchForm,
        ...tableOpt,
        startDate: this.time[0],
        endDate: this.time[1],
        status: this.status,
      });
      this.tableData.loading = false;
      if (err) {
        return;
      }
      res.data.forEach((item) => {
        item.add_time = moment(Number(item.add_time) * 1000).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      });
      this.tableData.data = res.data;
      this.tableData.total = res.total;
      this.tableData.currentPage = res.currentPage;
      this.tableData.pageSize = res.pageSize;
    },
    onSubmit(res) {
      this.tableOpt.currentPage = 1;
      this.fetchData(true);
    },
    onPageChange(current) {
      this.tableOpt.currentPage = current;
      this.fetchData();
    },
    onSizeChange(current) {
      this.tableOpt.pageSize = current;
      this.fetchData();
    },
    aaa() {
      this.signn = "noOverSignn";
      this.status = 1;
      this.fetchData();
    },
    bbb() {
      this.signn = "overSignn";
      this.status = 3;
      this.fetchData();
    },
    onClickDropdown(command, data) {
      if (command === "reset") {
        this.onReset(data);
      }

      if (command === "delete") {
        this.onDelete(data);
      }
    },
    onLinkTo(data, url) {
      const { row } = data;
      this["UPDATE_BREADCRUMB"](
        `<span style="font-size:15px">操作对象：${row.name}</span>`
      );
      this.$router.push({
        path: url,
        query: { id: row.id },
      });
    },
    refuseLogin(data) {
      const { row } = data;
      this.$confirm("确认拒绝这条授权请求？", "提示")
        .then(async (_) => {
          const { id } = row;
          const [err, res] = await this.$http.post("admin/user_check", {
            id,
            status: 2,
          });

          if (err) {
            this.$message({
              showClose: true,
              message: err,
              type: "error",
            });
            return;
          }

          this.$message({
            showClose: true,
            message: "已拒绝",
            type: "success",
          });

          this.onSubmit();
        })
        .catch((_) => {});
    },
    agreeLogin(data) {
      const { row } = data;
      this.$confirm("确认授权该请求？", "提示")
        .then(async (_) => {
          const { id } = row;
          const [err, res] = await this.$http.post("admin/user_check", {
            id,
            status: 3,
          });

          if (err) {
            this.$message({
              showClose: true,
              message: err,
              type: "error",
            });
            return;
          }
          this.$message({
            showClose: true,
            message: "授权成功",
            type: "success",
          });
          this.onSubmit();
        })
        .catch((_) => {});
    },
  },
};
</script >

<style lang = "less" scoped >
/deep/.cell {
  width: 290px;
}
/deep/.el-table__body {
  width: 100%;
  // 使表格兼容safari，不错位
  table-layout: fixed !important;
}
.el-button + .el-button {
  margin: 0;
}
</style >
