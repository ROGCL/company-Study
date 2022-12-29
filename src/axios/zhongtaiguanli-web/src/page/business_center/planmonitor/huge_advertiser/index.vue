<template>
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="6" :sm="12">
        <el-form-item label="广告主ID" prop="account_id">
          <el-input
            v-model="searchForm.account_id"
            placeholder="请输入广告主ID"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="App名称" prop="app_id">
          <!-- <SelectApp v-model="searchForm.app_id"></SelectApp> -->
          <SelectCustomize :value="searchForm.app_id" :data="apps" />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="渠道号" prop="channel">
          <el-input v-model="searchForm.channel" placeholder="请输入渠道号" />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="状态" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      :params="searchForm"
      @sizeChange="onSizeChange"
      @pageChange="onPageChange"
    >
      <template #system="row">{{ row.row.system | formatSystem }}</template>
      <template #option="scope">
        <el-popconfirm
          @confirm="onConfirm(scope.row.id)"
          :title="
            scope.row.status == 1
              ? '是否确认关闭该账户？（账户关闭后，将停止拉取账户数据）'
              : '是否确认开启该账户？（账户开启后，将拉取账户数据）'
          "
        >
          <el-switch
            slot="reference"
            :value="scope.row.status == 1 ? true : false"
            inactive-color="#ff4949"
          ></el-switch>
        </el-popconfirm>
        <span
          class="mg-left"
          :style="
            scope.row.status == 1 ? ' color: #1890ff;' : ' color: #ff4949;'
          "
          >{{ scope.row.status == 1 ? "开启" : "关闭" }}</span
        >
      </template>
    </TableLayout>
  </div>
</template>

<script>
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import SelectApp from "@/component/select-app";
import store from "store2";
import SelectCustomize from "@/component/select-customize";
export default {
  components: {
    FilterLayout,
    TableLayout,
    SelectApp,
    SelectCustomize,
  },
  data() {
    return {
      select: "1",
      apps: [],
      column: [
        {
          prop: "appid",
          label: "APPID",
        },
        {
          prop: "system",
          label: "系统",
        },
        {
          prop: "title",
          label: "APP名称",
        },
        {
          prop: "account_id",
          label: "广告主ID",
        },
        {
          prop: "account_name",
          label: "账户名以及渠道号",
        },
        {
          prop: "channel",
          label: "渠道号",
        },
        {
          prop: "proceeds_user",
          label: "收款户名",
        },
        {
          prop: "option",
          label: "操作",
        },
      ],
      options: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "1",
          label: "开启",
        },
        {
          value: "0",
          label: "关闭",
        },
      ],
      searchForm: {
        account_id: "",
        // app_id: '',
        app_id: {
          appInfo: [],
        },
        account_name: "",
        channel: "",
        cate: 1,
        status: "",
      },
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
    };
  },
  mounted() {
    this.fetchList();
    this.getRoleBtree(); // 获取应用和项目
  },
  methods: {
    // 获取筛选项表单数据
    async getRoleBtree() {
      const [err, res] = await this.$http.post("System/roleBtree", {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
      });
      if (err) return;
      let apps = [];
      let article_id_arr = [];
      res.list.forEach((item) => {
        if (item.title == "项目") {
          article_id_arr = item.node;
        }
        if (item.title == "应用") {
          item.node.forEach((_item) => {
            if (_item.system == "1") {
              _item.title = _item.title + "_Android";
            } else if (_item.system == "2") {
              _item.title = _item.title + "_IOS";
            } else if (_item.system == "3") {
              _item.title = _item.title + "_微信小程序";
            }
          });
          apps = item.node;
        }
      });
      // this.apps_default = apps;
      this.apps = apps;
      // this.article_id = article_id_arr;
    },
    onSubmit() {
      this.tableOpt.currentPage = 1;
      this.fetchList();
    },
    onPageChange(current) {
      this.tableOpt.currentPage = current;
      this.fetchList();
    },
    onSizeChange(current) {
      this.tableOpt.pageSize = current;
      this.fetchList();
    },
    async fetchList() {
      const { searchForm, tableOpt } = this;

      this.tableData.loading = true;

      const [err, res] = await this.$http.post("Invest_Config/index", {
        ...searchForm,
        ...tableOpt,
        navCate: 2,
        app_id: this.searchForm.app_id.appInfo,
      });

      this.tableData.loading = false;

      if (err) return;

      const { list, currentPage, total } = res;

      this.tableData.data = list;
      this.tableData.currentPage = currentPage;
      this.tableData.total = total;
    },
    async onConfirm(id) {
      const res = await this.$http.post("Invest_Config/auditPull", {
        id,
      });
      if (res[2] == 1) {
        this.$message({
          message: res[3],
          type: "success",
        });
        this.fetchList();
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .app-control {
  width: 100%;
}

.tip {
  width: 100%;
  color: #999;
  font-size: 12px;
  text-align: center;
}
.mg-left {
  margin-left: 6px;
}
</style>