<template >
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="5" :sm="12">
        <el-form-item label="App名称" prop="appId">
          <SelectApp v-model="searchForm.appId"></SelectApp>
        </el-form-item>
      </el-col>
      <el-col :md="5" :sm="12">
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="searchForm.realname" placeholder="请输入姓名" />
        </el-form-item>
      </el-col>
      <el-col :md="5" :sm="12">
        <el-form-item label="筛选" prop="search">
          <el-input
            v-model="searchForm.search"
            placeholder="请输入账号/邮箱/手机号"
          />
        </el-form-item>
      </el-col>
      <el-col :md="5" :sm="12">
        <el-form-item label="筛选身份" prop="isAdmin">
          <el-select
            v-model="searchForm.isAdmin"
            :popper-append-to-body="false"
            placeholder="请选择"
          >
            <el-option label="全部" value></el-option>
            <el-option label="管理员" value="2"></el-option>
            <el-option label="普通用户" value="3"></el-option>
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
      @sizeChange="onSizeChange"
      @pageChange="onPageChange"
    >
      <template #table-option>
        <el-button type="danger" icon="el-icon-plus" @click="onAdd"
          >添加</el-button
        >
        <el-badge
          :value="CountNoCheck"
          class="item"
          style="margin-left: 20px"
          v-if="CountNoCheck && indexFlag !== -1"
        >
          <el-button type="primary" @click="onLogin_list"
            >登录授权管理</el-button
          >
        </el-badge>
        <el-button
          v-if="!CountNoCheck && indexFlag !== -1"
          style="margin-left: 20px"
          type="primary"
          @click="onLogin_list"
          >登录授权管理</el-button
        >
      </template>
      <template #manage_level="row">{{
        formatLevel(row.row.manage_level)
      }}</template>
      <template #option="row" class="btn_flex">
        <el-button-group style="display: flex; justify-content: space-between">
          <el-button
            @click="onLinkTo(row, '/manage_center/user_manage/edit_auth')"
            type="primary"
            size="small"
            icon="el-icon-edit"
            >权限分配</el-button
          >
          <el-dropdown
            split-button
            type="primary"
            @click="onLinkTo(row, '/manage_center/user_manage/edit')"
            icon="el-icon-edit"
            @command="onClickDropdown($event, row)"
          >
            修改信息
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="reset">重置密码</el-dropdown-item>
              <el-dropdown-item command="login" v-if="indexFlag !== -1"
                >登录管理</el-dropdown-item
              >
              <el-dropdown-item command="delete">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-button-group>
      </template>
    </TableLayout>
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <div class="login_info_btn">
        <span style="padding-right: 30px">登录时需插件校验</span>
        <el-switch
          v-model="login_flag"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="changeBtn"
          active-text="开"
          inactive-text="关"
        >
          >
        </el-switch>
      </div>
      <div style="margin-top: 20px">
        <div style="padding: 5px 0">已授权插件：</div>
        <div style="padding: 0px 10px; background: rgb(242 242 242)">
          <div
            v-for="(item, index) in UserAuthMacList"
            :key="index"
            style="
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
            "
          >
            <span>{{ item.mac_no }}</span>
            <el-button size="mini" @click="deleteLogin(item)">删除</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template >

<script >
import store from "store2";
import { mapState, mapActions, mapMutations } from "vuex";
import axios from "@/util/axios";
import { api } from "@/config/api";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import SelectApp from "@/component/select-app";

export default {
  name: "home",
  components: {
    FilterLayout,
    TableLayout,
    SelectApp,
  },
  data() {
    return {
      indexFlag: -1,
      CountNoCheck: 0,
      UserAuthMacList: [],
      user_id: "",
      dialogVisible: false,
      searchForm: {
        appId: "",
        search: "",
        realname: "",
        isAdmin: "",
      },
      admin_id: "",
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
          prop: "email",
          label: "邮箱",
        },
        {
          prop: "from_user",
          label: "添加账号",
        },
        {
          prop: "manage_level",
          label: "身份",
          width: "120px",
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
      login_flag: true,
    };
  },
  mounted() {
    this.fetchData();
    let arr = store.get("menu");
    this.indexFlag = arr.indexOf("144");
    this.getCountNoCheck();
    this.admin_id = JSON.parse(localStorage.getItem("user")).id;
  },
  computed: {
    ...mapState({
      tableData: (state) => state.user_manage.list,
      App: (state) => state.app.data,
    }),
  },
  beforeDestroy() {
    this["REMOVE_BREADCRUMB"]();
  },
  methods: {
    ...mapMutations(["UPDATE_USER", "UPDATE_BREADCRUMB", "REMOVE_BREADCRUMB"]),
    ...mapActions(["getUserManageList", "removeUserManage"]),
    async fetchData() {
      const { searchForm, tableOpt } = this;
      const [err, res] = await this.getUserManageList({
        ...searchForm,
        ...tableOpt,
      });

      if (err) {
        return;
      }
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
    onAdd() {
      this.$router.push("/manage_center/user_manage/add");
    },
    onLogin_list() {
      this.$router.push("/manage_center/user_manage/login_list");
    },
    onClickDropdown(command, data) {
      if (command === "reset") {
        this.onReset(data);
      }

      if (command === "delete") {
        this.onDelete(data);
      }
      if (command === "login") {
        this.onLoginInfo(data);
      }
    },
    onLinkTo(data, url) {
      const { row } = data;
      this["UPDATE_BREADCRUMB"](
        `<span style="font-size:15px">操作对象：${row.realname}</span>`
      );
      this.$router.push({
        path: url,
        query: { id: row.id },
      });
    },
    onDelete(data) {
      const { row } = data;
      this.$confirm("确认删除该账号？", "提示")
        .then(async (_) => {
          const { id } = row;
          const [err, res] = await this.removeUserManage({ adminId: id });

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
            message: "删除成功",
            type: "success",
          });

          this.onSubmit();
          thMac;
        })
        .catch((_) => {});
    },
    onLoginInfo(data) {
      console.log(data);
      this.login_flag = data.row.is_check === "1" ? true : false;
      this.user_id = data.row.id;
      this.dialogVisible = true;
      this.getUserAuthMac();
    },
    async getCountNoCheck() {
      const [err, res] = await this.$http.post("admin/count_no_check");
      if (err) {
        return;
      }
      console.log(res);
      this.CountNoCheck = res.count;
    },
    async getUserAuthMac() {
      const [err, res] = await this.$http.post("admin/user_auth_mac", {
        user_id: this.user_id,
      });
      if (err) {
        return;
      }
      console.log(res.list);
      this.UserAuthMacList = res.list;
    },
    async changeBtn(val) {
      console.log(val);
      this.$confirm("确定更改当前用户插件校验状态？")
        .then(async (_) => {
          const [err, res] = await this.$http.post("admin/mac_open", {
            user_id: this.user_id,
            is_check: this.login_flag ? "1" : "0",
          });
          if (err) return;
          this.fetchData();
        })
        .catch((_) => {
          this.login_flag = !this.login_flag;
        });
    },
    deleteLogin(data) {
      this.$confirm("确认删除该授权插件？", "提示")
        .then(async (_) => {
          const [err, res] = await this.$http.post("admin/del_mac", {
            mac_no: data.mac_no,
            id: data.id,
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
            message: "删除成功",
            type: "success",
          });
          this.getUserAuthMac();
        })
        .catch((_) => {});
    },
    onReset(data) {
      const { row } = data;
      this.$confirm("确认重置该账号密码？", "提示")
        .then(async (_) => {
          const { id } = row;
          const [err, res] = await axios.post(api.User.resetPwd, {
            adminId: id,
          });

          if (err) {
            this.$message({
              showClose: true,
              message: err,
              type: "error",
            });
            return;
          }
          if (row.id == this.admin_id) {
            this.$router.push("/login");
            this.$router.push({
              path: "/login",
            });
          }

          this.$message({
            showClose: true,
            message: "重置成功，密码重置为 " + res,
            type: "success",
            duration: 0,
          });
        })
        .catch((_) => {});
    },
    formatLevel(val) {
      switch (String(val)) {
        case "":
          return "--";
        case "2":
          return "管理员";
        case "3":
          return "普通用户";
      }
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
.login_info_btn {
  display: flex;
  align-content: center;
}
</style >
