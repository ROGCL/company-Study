<template>
  <div class="parent">
    <el-button type="primary" style="margin: 20px 0" @click="delAll"
      >批量删除</el-button
    >
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      :stripe="false"
      @selection-change="handleSelectionChange"
      v-loading="logding"
    >
      <el-table-column type="selection" align="center" width="55">
      </el-table-column>
      <el-table-column prop="realname" align="center" label="通知人员">
        <template slot-scope="scope">
          <span v-if="scope.row.realname">{{ scope.row.realname }}</span>
          <el-select v-else v-model="scope.row.admin" filterable>
            <el-option
              v-for="item in adminList"
              :key="item.id"
              :value="item.id"
              :label="item.realname"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="appInfo"
        align="center"
        label="关联应用"
        width="250"
      >
        <template slot-scope="scope">
          <div class="flex">
            <Selectucg
              :value="scope.row"
              @changeScope="changeScope"
            ></Selectucg>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="email" align="center" label="邮件通知">
        <template slot-scope="scope">
          <el-switch
            v-if="scope.row.realname"
            @change="changeBtn(scope.row)"
            v-model="scope.row.status"
          ></el-switch>
          <el-switch v-else v-model="scope.row.status"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            slot="reference"
            class="el-icon-delete"
            type="text"
            style="font-size: 18px; margin-left: 20px"
            v-if="scope.row.realname && !scope.row.flag"
            :key="num"
            @click="deleteOption(scope.row)"
          ></el-button>
          <span
            v-if="!scope.row.realname || scope.row.flag"
            class="el-icon-success"
            @click="sendOption(scope.row)"
            style="
              padding-left: 20px;
              font-size: 18px;
              cursor: pointer;
              line-height: 66px;
            "
            :key="num"
          ></span>
        </template>
      </el-table-column>
    </el-table>
    <div class="add">
      <div @click="addList">
        <span
          class="el-icon-circle-plus-outline"
          style="font-size: 36px"
        ></span>
        <div style="color: #02a7f0">新增通知</div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "store2";
import { mapState } from "vuex";
import Selectucg from "@/component/select-ucg";
export default {
  components: {
    Selectucg,
  },
  data() {
    return {
      tableData: [],
      adminList: [],
      num: 0,
      visible: false,
      logding: false,
    };
  },
  methods: {
    addList() {
      let arr = [
        {
          realname: "",
          appInfo: [],
          status: true,
        },
      ];
      this.tableData.push(arr);
    },
    async getAdmin() {
      const [err, res] = await this.$http.post("Admin/getAllAdmin", {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
      });
      if (err || !res) return;
      this.adminList = res;
    },
    async userList() {
      this.logding = true;
      const [err, res] = await this.$http.post("Other/index", {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
      });
      if (err || !res) {
        this.logding = false;
        return;
      }
      this.tableData = res;
      this.logding = false;
    },
    deleteOption(row) {
      this.$confirm("确认删除当前信息？").then(async (_) => {
        const [err, res] = await this.$http.post("Other/delete", {
          admin_id: [row.admin_id],
        });
        if (err) return;
        this.visible = false;
        this.userList();
      });
    },
    async sendOption(row) {
      if (row.admin && row.appInfo.length) {
        const [err, res] = await this.$http.post("Other/save", {
          appIds: row.appInfo,
          admin_id: row.admin,
          status: row.status ? 1 : 0,
        });
        if (err) return;
        row.flag = false;
        this.userList();
      }
      if (row.admin_id && row.appInfo.length) {
        const [err, res] = await this.$http.post("Other/save", {
          appIds: row.appInfo,
          admin_id: row.admin_id,
        });
        if (err) return;
        row.flag = false;
        this.userList();
      }
    },
    changeOption(val) {
      console.log(val);
      let arr = [];
      val.flag = true;
      this.App.forEach((item) => {
        val.appInfo.forEach((_item) => {
          if (item.id == _item) {
            arr.push(item);
          }
        });
      });
      val.optionList = arr;
    },
    initOption(val) {
      let arr = [];
      this.App.forEach((item) => {
        val.appInfo.forEach((_item) => {
          if (item.id == _item) {
            arr.push(item);
          }
        });
      });
      val.optionList = arr;
    },
    delOption(id, row) {
      let arr = row.optionList.filter(function (item) {
        return item.id != id;
      });
      row.appInfo = arr.map((item) => {
        return item.id;
      });
      row.optionList = arr;
    },
    cleanOption(row) {
      row.appInfo = [];
      row.optionList = [];
    },
    AllOption(row) {
      let appInfo = [];
      let optionList = [];
      this.App.forEach((item) => {
        appInfo.push(item.id);
        optionList.push(item);
      });
      row.appInfo = appInfo;
      row.optionList = optionList;
    },
    changOption(row) {
      let arr = [];
      this.App.forEach((item) => {
        if (item.title.indexOf(row.input) != -1) {
          arr.push(item);
        }
      });
      if (arr.length) {
        row.app = arr;
      } else {
        row.app = "";
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    changeScope(val) {
      this.num += 1;
    },
    async delAll() {
      let admin_id = this.multipleSelection.map((item) => {
        return item.admin_id;
      });
      if (admin_id.length == 0) {
        return;
      }
      this.$confirm("确认删除当前信息？").then(async (_) => {
        const [err, res] = await this.$http.post("Other/delete", {
          admin_id,
        });
        if (err) return;
        this.userList();
      });
    },
    async changeBtn(val) {
      this.$confirm("确定更改当前邮箱通知？").then(async (_) => {
        const [err, res] = await this.$http.post("Other/emailOnOff", {
          admin_id: val.admin_id,
        });
        if (err) {
          return;
        }
        if (err) return;
        this.visible = false;
        this.userList();
      }).catch((_)=>{
        val.status = !val.status
      })
    },
  },
  mounted() {
    this.userList();
    this.getAdmin();
  },
  computed: {
    ...mapState({
      App: (state) => state.app.data,
    }),
  },
};
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  justify-content: space-between;
  line-height: 66px;
}
.parent {
  width: 50%;
}
.add {
  text-align: center;
  margin-top: 20px;
  cursor: pointer;
}
/deep/ .el-table {
  border: 0;
  th,
  tr,
  td {
    border: 0;
    background-color: #fff;
  }
  &::before {
    height: 0px;
  }
  &::after {
    width: 0;
  }

  .el-table__fixed:before {
    height: 0;
  }
}
.left_title {
  font-size: 14px;
  display: flex;
  justify-content: space-around;
  line-height: 40px;
}
.option_child {
  width: 200px;
  .option_child_card {
    .del_option {
      cursor: pointer;
    }
    display: flex;
    justify-content: space-between;
    background: rgb(240, 240, 240);
    padding: 15px 10px;
    margin: 10px;
    border-radius: 10px;
  }
  .title {
    font-size: 14px;
    display: flex;
    justify-content: space-around;

    line-height: 40px;
  }
}
</style>