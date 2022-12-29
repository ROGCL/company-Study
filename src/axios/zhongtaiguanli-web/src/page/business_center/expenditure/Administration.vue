<template>
  <div class="Administration">
    <div class="filter-custom">
      <el-form inline>
        <el-col :md="6" :sm="12">
          <el-form-item label="应用">
            <SelectApp v-model="form.appId"></SelectApp>
          </el-form-item>
        </el-col>
        <el-col :md="6" :sm="12">
        <el-form-item label="渠道">
          <el-input v-model="form.channel" placeholder="请输入渠道"></el-input>
        </el-form-item>
        </el-col>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onShowAddFrom()">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="delData" v-if="indexFlag !== -1"
            >删除渠道</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-custom" v-loading="tableLoading">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          prop="system"
          label="系统"
          width="100"
        ></el-table-column>
        <el-table-column prop="title" label="App名称"></el-table-column>
        <el-table-column prop="classify" label="渠道分类"></el-table-column>
        <el-table-column
          prop="invest_channel"
          label="平台名称"
        ></el-table-column>
        <el-table-column prop="channels" label="渠道号"></el-table-column>
        <el-table-column fixed="right" label="编辑" width="200">
          <template slot-scope="scope">
            <el-button
              class="mg-rig"
              type="text"
              size="small"
              @click="onShowAddFrom(scope.row)"
              >新增渠道号</el-button
            >
            <el-popconfirm
              @confirm="onConfirm(scope.row)"
              :title="
                scope.row.show == 1
                  ? '是否确认隐藏该渠道？'
                  : '是否确认显示该渠道？'
              "
            >
              <el-switch
                slot="reference"
                :value="scope.row.show == 1 ? true : false"
                inactive-color="#ff4949"
              ></el-switch>
            </el-popconfirm>
            <span
              class="mg-left"
              :style="
                scope.row.show == 1 ? ' color: #1890ff;' : ' color: #ff4949;'
              "
              >{{ scope.row.show == 1 ? "显示" : "隐藏" }}</span
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="onSizeChange"
        @current-change="onPageChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog title="新增支出渠道" :visible.sync="addVisible">
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="80px"
        :rules="addRules"
        class="custom-form"
      >
        <el-form-item label="App名称" prop="appId">
          <SelectApp
            v-model="addForm.appId"
            :haveAll="false"
            :disabled="editStatus"
          ></SelectApp>
        </el-form-item>
        <el-form-item label="渠道分类" prop="classify_id">
          <el-select
            v-model="addForm.classify_id"
            placeholder="请选择渠道分类"
            filterable
            :disabled="editStatus"
            @change="fetchCannel"
          >
            <el-option
              v-for="(v, i) in channelKindList"
              :key="i"
              :label="v.title"
              :value="v.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="平台名称" prop="invest_channel_id">
          <el-select
            v-model="addForm.invest_channel_id"
            placeholder="请选择平台名称（先选择渠道分类）"
            filterable
            :disabled="!addForm.classify_id || editStatus"
          >
            <el-option
              v-for="(v, i) in channelList"
              :key="i"
              :label="v.title"
              :value="v.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道号" prop="channels">
          <el-select
            v-model="addForm.channels"
            placeholder="请选择渠道号"
            multiple
            filterable
          >
            <el-option
              v-for="(v, i) in channelNoList"
              :key="i"
              :label="v"
              :value="v"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAdd">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="删除渠道"
      :visible.sync="delVisible"
      width="800px"
      :close-on-click-modal="false"
      class="del_dialog"
      @close="closeDialog"
    >
      <!-- <div class="cxBtn">
        <el-button type="primary" @click="queryDelTable">查询</el-button>
      </div> -->
      <el-form
        :model="delForm"
        label-width="120px"
        class="custom-form"
        ref="delForm"
      >
        <el-form-item label="填写渠道" prop="channel">
          <el-cascader
            v-model="delForm.channel"
            :options="fetchOptions"
            :props="myProps"
            filterable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="选择应用" prop="appId">
          <el-select
            v-model="delForm.appId"
            filterable
            placeholder="请选择App"
            @change="getCurrentAppIcon"
          >
            <template #prefix>
              <span class="iconfont" :class="currentAppIcon"> </span>
            </template>
            <el-option
              v-for="item in Apps"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left" :class="item.icon"></span>
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所需删除表">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            v-if="delTableList.length"
            >全选</el-checkbox
          >
          <el-checkbox-group
            v-model="delForm.platform"
            @change="changeDelTabelList"
          >
            <el-checkbox
              :label="item.id"
              v-for="item in delTableList"
              :key="item.id"
            >
              {{ item.title }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryDelTable">查询</el-button>
          <el-popover
            placement="bottom"
            width="160"
            v-model="delChannelBtn"
            v-if="delForm.platform.length"
            style="margin-left: 60px"
          >
            <p>确定删除该渠道？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="delChannelBtn = false"
                >取消</el-button
              >
              <el-button type="primary" size="mini" @click="delChannel"
                >确定</el-button
              >
            </div>
            <el-button type="danger" slot="reference">删除</el-button>
          </el-popover>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  Invest_Statistics_investChannelList,
  Invest_Statistics_updateChannelShow,
} from "@/config/api/index";
import SelectApp from "@/component/select-app";
import filterapp from "@/component/filterapp/filterapp";
import store from "store2";
import { System_apps } from "@/config/api/index";
import { getAppIcon } from "@/component/filterapp/util.js";

export default {
  components: {
    SelectApp,
    filterapp,
  },
  data() {
    return {
      delVisible: false,
      form: {
        appId: "",
        channel:"",
      },
      Apps: [],
      currentAppIcon: "",
      timeDimension: [
        {
          value: "1",
          label: "天",
        },
      ],
      tableData: [],
      tableLoading: true,
      currentAppName: "",
      addForm: {
        appId: "",
        classify_id: "",
        invest_channel_id: "",
        channels: [],
      },
      channelList: [],
      channelNoList: [],
      channelKindList: [],
      addRules: {
        appId: [{ required: true, message: "请选择APP" }],
        classify_id: [{ required: true, message: "请选择渠道分类" }],
        invest_channel_id: [{ required: true, message: "请选择渠道名称" }],
        channels: [{ required: true, message: "请选择渠道号" }],
      },
      addVisible: false,
      editStatus: false,
      delForm: {
        channel: "",
        appId: "",
        platform: [],
      },
      appidInfo: {
        appInfo: [],
      },
      apps: [],
      fetchOptions: [],
      delTableList: [],
      myProps: {
        value: "id",
        label: "title",
        children: "channels",
      },
      delChannelBtn: false,
      delTbaleArr: [],
      indexFlag: -1,
      checkAll: false,
      isIndeterminate: true,
      currentPage: "1",
      pageSize: "10",
      total: "",
    };
  },
  created() {
    this.getList();
    this.fetchCannelKind();
    this.fetchCannel();
  },
  mounted() {
    let arr = store.get("menu");
    this.indexFlag = arr.indexOf("145");
  },
  watch: {
    "addForm.appId": function (val) {
      this.addForm.channels = [];
      this.fetchCannelNo(val);
    },
  },
  methods: {
    getList() {
      this.tableLoading = true;
      const { currentPage, pageSize } = this;
      Invest_Statistics_investChannelList({
        ...this.form,
        currentPage,
        pageSize,
      }).then((res) => {
        console.log(res);
        this.tableData = res[1].list;
        this.total = res[1].total;
        this.tableLoading = false;
      });
    },
    search() {
      this.currentPage = 1;
      this.getList();
    },
    onConfirm({ id }) {
      Invest_Statistics_updateChannelShow({ id }).then((res) => {
        if (res[2] == 1) {
          this.$message({
            type: "success",
            message: res[3],
          });
          this.getList();
        } else {
          this.$message.error(res[0]);
        }
      });
    },
    async fetchCannel(val) {
      this.addForm.invest_channel_id = "";

      const [err, res] = await this.$http.post(
        "Invest_Statistics/invest_channels",
        {
          classify_id: val,
        }
      );

      if (err) return;

      this.channelList = res;
    },
    async fetchCannelNo(appId) {
      if (!appId) return;

      const [err, res] = await this.$http.post("App/getChannel", { appId });

      if (err) return;
      let arr = [];
      res.forEach((item) => {
        item.channels.forEach((_item) => {
          if (_item) {
            arr.push(_item);
          }
        });
      });
      this.channelNoList = arr;
    },
    async fetchCannelKind(appId) {
      const [err, res] = await this.$http.post("Invest_Statistics/classify", {
        appId,
      });

      if (err) return;

      this.channelKindList = res;
    },
    onAdd() {
      this.$refs["addForm"].validate(async (valid, data) => {
        if (!valid) {
          return false;
        }

        const [err, res] = await this.$http.post(
          this.editStatus
            ? "Invest_Statistics/addInvestChannel"
            : "Invest_Statistics/store_invest_channel",
          {
            ...this.addForm,
            channels: this.addForm.channels.join(","),
          }
        );

        if (err) return;

        this.$message({
          message: "已添加广告主与APP关联",
          type: "success",
        });

        this.addVisible = false;
        this.getList();
      });
    },
    onShowAddFrom(data = {}) {
      this.addVisible = true;

      if (!Object.keys(data).length) {
        this.editStatus = false;
        this.addForm = {
          id: "",
          appId: "",
          classify_id: "",
          invest_channel_id: "",
          channels: [],
        };
        return;
      }

      this.addForm = {
        id: data.id,
        appId: data.appid,
        classify_id: data.classify_id,
        invest_channel_id: data.invest_channel_id,
        channels: [],
      };
      this.editStatus = true;
    },
    delData() {
      this.delVisible = true;
      this.getRoleBtree();
      this.fetchChannel();
      this.getApps();
    },
    async getChannelChain() {
      const [err, res] = await this.$http.post("Ip/getChannelChain", {
        appId,
      });

      if (err) return;

      this.channelKindList = res;
    },
    async fetchChannel() {
      const [err, res] = await this.$http.post("income/getChannel");

      if (err) return;
      let arr = res.map((item) => {
        return {
          title: item.title,
          id: item.id,
          channels: item.channels.map((_item) => {
            return {
              title: _item,
              id: _item,
            };
          }),
        };
      });
      this.fetchOptions = arr;
    },
    async getRoleBtree() {
      const [err, res] = await this.$http.post("System/roleBtree", {});

      if (err) return;
      res.list.forEach((item) => {
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
        }
      });
      this.apps = res.list[3].node;
    },
    changeAppid(val) {
      this.delForm.appId = val.appInfo;
      console.log(this.delForm);
    },
    submitDelData() {
      console.log(this.delForm);
    },
    async queryDelTable() {
      const { delForm } = this;
      const [err, res] = await this.$http.post("Ip/getChannelChain", {
        channel: delForm.channel[1],
        appId: delForm.appId,
      });
      if (err) {
        this.delTableList = [];
        return;
      }
      this.delTbaleArr = res;
      let arr = [];
      res.forEach((item) => {
        if (item.id) {
          arr.push({ id: item.id, title: item.title });
        }
      });
      if (!arr.length) {
        this.delTableList = [];
        this.$message.error("没有所属表");
      } else {
        this.delTableList = arr;
      }
    },
    handleCheckAllChange(val) {
      let arr = this.delTableList.map((item) => {
        return item.id;
      });
      this.delForm.platform = val ? arr : [];
      this.isIndeterminate = false;
    },
    changeDelTabelList(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.delTableList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.delTableList.length;
    },
    async delChannel() {
      const { delForm } = this;
      let obj = {};
      this.delTbaleArr.forEach((item) => {
        delForm.platform.forEach((_item) => {
          if (item.id == _item) {
            obj[item.key_name] = _item;
          }
        });
      });
      const [err, res] = await this.$http.post("Ip/delChannelChain", {
        channel: delForm.channel[1],
        appId: delForm.appId,
        ...obj,
      });
      if (err) return;
      this.$message({
        message: "删除成功",
        type: "success",
      });
      this.delForm.channel = "";
      this.delForm.appId = "";
      this.delForm.platform = [];
      this.delTableList = [];
      this.currentAppIcon = "";
      this.delChannelBtn = false;
      this.delVisible = false;
    },
    closeDialog() {
      this.delForm.channel = "";
      this.delForm.appId = "";
      this.delForm.platform = [];
      this.delTableList = [];
      this.currentAppIcon = "";
      this.delChannelBtn = false;
      this.delVisible = false;
    },
    getApps() {
      System_apps().then((res) => {
        this.Apps = res[1].map(({ id, title, system }) => {
          return {
            value: id,
            label: title,
            icon: getAppIcon(system),
            systemName: system == "1" ? "安卓" : "苹果",
          };
        });
      });
    },
    getCurrentAppIcon(data) {
      console.log(data);
      this.currentAppIcon = this.Apps.filter(
        ({ value }) => data == value
      )[0].icon;
    },
    checkSystem(system) {
      return system == "1" ? "安卓" : "苹果";
    },
    onPageChange(current) {
      this.currentPage = current;
      this.getList();
    },
    onSizeChange(current) {
      this.pageSize = current;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.custom-form {
  .el-select {
    width: 100% !important;
  }
}
.mg-rig {
  margin-right: 10px;
}
.mg-left {
  margin-left: 6px;
}
.del_dialog {
  /deep/.el-input__inner {
    width: 220px;
  }
  /deep/.custom-form .el-select {
    width: 220px !important;
  }
}
.cxBtn {
  padding: 0 50px;
  display: flex;
  justify-content: right;
}
</style>
