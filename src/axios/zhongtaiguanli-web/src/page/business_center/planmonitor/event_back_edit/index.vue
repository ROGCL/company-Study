<template>
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="5" :sm="12">
        <el-form-item label="筛选" prop="account_name">
          <el-input v-model="searchForm.account_name" placeholder="渠道号" />
        </el-form-item>
      </el-col>
      <el-col :md="5" :sm="12">
        <el-form-item label="App名称" prop="app_id">
          <SelectApp v-model="searchForm.app_id"></SelectApp>
        </el-form-item>
      </el-col>
      <el-col :md="5" :sm="12">
        <el-form-item label="广告平台" prop="platform">
          <el-select
            v-model="searchForm.platform"
            filterable
            clearable
            multiple
            collapse-tags
            :popper-append-to-body="false"
            placeholder="请选择"
          >
            <el-option
              v-for="item in platform"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-button slot="ggwgl" type="primary" @click="openPassback"
        >批量回传控制</el-button
      >
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
      <template #system="row">{{ row.row.system | formatSystem }}</template>
      <template #time_update="row">{{
        $moment(parseInt(row.row.time_update * 1000)).format(
          "YYYY-MM-DD HH:mm:ss"
        )
      }}</template>
      <template #option="row">
        <el-button size="small" @click="onShowEdit(row.row)"
          >编辑回传</el-button
        >
        <el-switch
          slot="reference"
          @change="onConfirm(row.row)"
          :value="row.row.status == 1 ? true : false"
          inactive-color="#ff4949"
          active-color="#13ce66"
          style="margin-left: 15px"
        ></el-switch>
      </template>
    </TableLayout>
    <el-dialog :title="editFormTitle" :visible.sync="showEditForm">
      <el-form label-width="0px">
        <el-form-item>
          <el-switch
            active-text="回传激活设备"
            v-model="editForm.active"
          ></el-switch>
          <span class="hcbl_title" style="margin-left: 58px"
            >回传比例
            <el-input
              class="back-money"
              :min="0"
              :max="100"
              type="number"
              v-model="editForm.a"
              @input="changeNum"
              @blur="
                editForm.a === ''
                  ? (editForm.a = 100)
                  : (editForm.a = editForm.a)
              "
            />%
          </span>
        </el-form-item>
        <el-form-item>
          <el-switch
            active-text="回传次日留存设备"
            v-model="editForm.keep"
          ></el-switch>
          <span class="hcbl_title" style="margin-left: 30px"
            >回传比例
            <el-input
              class="back-money"
              :min="0"
              :max="100"
              type="number"
              v-model="editForm.b"
              @input="changeNum2"
              @blur="
                editForm.b === ''
                  ? (editForm.b = 100)
                  : (editForm.b = editForm.b)
              "
            />%
          </span>
        </el-form-item>
        <el-form-item>
          <el-switch
            active-text="回传付费设备"
            v-model="editForm.pay"
          ></el-switch>
          <span class="hcbl_title" style="margin-left: 58px"
            >回传比例
            <el-input
              class="back-money"
              :min="0"
              :max="100"
              type="number"
              v-model="editForm.c"
              @input="changeNum3"
              @blur="
                editForm.c === ''
                  ? (editForm.c = 100)
                  : (editForm.c = editForm.c)
              "
            />%
          </span>
          <div v-show="editForm.pay" class="form-item-child">
            <div style="padding: 10px 0">
              <span class="hcbl_title">
                <span class="hcbl_title" style="margin-right: 14px"
                  >自定义回传时间</span
                >
                <el-input
                  class="back-money"
                  :min="1"
                  type="number"
                  v-model="editForm.d"
                  @input="changeTimeNum"
                />
                <el-select
                  class="back-money"
                  v-model="editForm.time"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </span>
            </div>
            <div>
              <span class="hcbl_title" style="margin-right: 28px"
                >订单金额大于</span
              >
              <el-input
                class="back-money"
                type="number"
                v-model="editForm.pay_money"
              />元时回传
            </div>
            <div style="padding-top: 10px">
              <span class="hcbl_title">回传订单金额比例</span>
              <el-input
                class="back-money"
                type="number"
                v-model="editForm.pay_detail"
                @input="changePayDetail"
              />
              %
              <span class="title">比例为0时表示不回传订单金额</span>
            </div>
          </div>
          <div v-if="flag">
            <el-switch
              active-text="回传关键行为"
              v-model="editForm.action"
            ></el-switch>
            <span class="hcbl_title" style="margin-left: 58px"
              >回传比例
              <el-input
                class="back-money"
                :min="0"
                :max="100"
                type="number"
                v-model="editForm.actionNum"
                @input="changeActionNum"
                @blur="
                  editForm.actionNum === ''
                    ? (editForm.actionNum = 100)
                    : (editForm.actionNum = editForm.actionNum)
                "
              />%
            </span>
            <div v-if="editForm.action" style="padding: 10px 0">
              <span class="hcbl_title form-item-child">
                <span class="hcbl_title" style="margin-right: 14px"
                  >自定义回传时间</span
                >
                <el-input
                  class="back-money"
                  :min="1"
                  type="number"
                  v-model="editForm.action_timeNum"
                  @input="changeActionTime"
                />
                <el-select
                  class="back-money"
                  v-model="editForm.action_time"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </span>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditForm = false">取 消</el-button>
        <el-button type="primary" @click="onEdit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="批量回传控制"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
      width="600px"
    >
      <el-form
        :model="passback"
        style="text-align: center; padding: 0 25px"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item
          label-width="100px"
          label="选择应用："
          style="display: inline-block"
          prop="appid"
        >
          <el-select
            v-model="passback.appid"
            placeholder="请选择应用"
            filterable
          >
            <el-option
              v-for="item in apps"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="origin">
          <el-input
            type="textarea"
            :rows="10"
            placeholder="填入需批量操作的渠道，渠道间用回车隔开"
            v-model="passback.origin"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <div style="display: flex; justify-content: space-around">
            <el-button type="primary" @click="batchOff(1)">批量开</el-button>
            <el-button type="danger" @click="batchOff(0)">批量关</el-button>
          </div>
        </el-form-item>
        <el-form-item v-if="errInfo">
          <el-input
            type="textarea"
            :rows="10"
            placeholder="填入需批量操作的渠道，渠道间用（;）隔开"
            v-model="errInfo"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { pickerOptions } from "@/config/option";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import SelectApp from "@/component/select-app";
import { mapState } from "vuex";
import { formatSystem } from "@/util/filters";
import moment from "moment";

export default {
  name: "home",
  components: {
    FilterLayout,
    TableLayout,
    SelectApp,
  },
  computed: {
    ...mapState({
      App: (state) => state.app.data,
    }),
  },
  data() {
    return {
      ceshi: true,
      pickerOptions,
      searchForm: {
        account_name: "",
        platform: "",
        app_id: "",
        time: [],
      },
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
          prop: "platform",
          label: "广告平台名称",
        },
        {
          prop: "channel",
          label: "渠道号",
        },
        {
          prop: "option",
          label: "操作",
        },
      ],
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
      showEditForm: false,
      editFormTitle: "",
      platform: [],
      editForm: {
        id: "",
        active: false,
        keep: false,
        keep_today: false,
        pay: false,
        pay_today: false,
        pay_money: 0,
        pay_detail: 0,
        a: 0, //回传付费设备
        b: 0, //自定义回传时间
        c: 0, //订单金额
        d: 1, //金额比例
        action: false,
        actionNum: 0,
        action_timeNum: 0,
        time: "day",
        action_time: "day",
      },
      options: [
        {
          value: "day",
          label: "日",
        },
        {
          value: "hour",
          label: "小时",
        },
      ],
      dialogVisible: false,
      apps: [],
      passback: {
        appid: "",
        origin: "",
      },
      errInfo: "",
      rules: {
        appid: [{ required: true, message: "请选择应用", trigger: "change" }],
        origin: [{ required: true, message: "请填写渠道", trigger: "change" }],
      },
      queryAppId: "",
    };
  },
  mounted() {
    if (this.$route.query.channel && this.$route.query.appid) {
      this.$nextTick(() => {
        this.searchForm.account_name = this.$route.query.channel;
        this.searchForm.app_id = this.$route.query.appid;
        this.onSubmit();
      });
    } else {
      this.fetchPlatform();
      this.fetchData();
    }
  },
  methods: {
    async fetchPlatform() {
      const [err, res] = await this.$http.post("Invest_Config/get", {
        cate: 10,
      });

      if (err) return;

      this.platform = res;
    },
    async fetchData() {
      const { searchForm, tableOpt } = this;

      this.tableData.loading = true;

      const [err, res] = await this.$http.post(
        "Invest_Config/backControlList",
        {
          ...searchForm,
          ...tableOpt,
          timeBegin: this.searchForm.time[0],
          timeEnd: this.searchForm.time[1],
          cate: 10,
        }
      );

      this.tableData.loading = false;

      if (err) return;

      const { list, currentPage, total } = res;
      this.tableData.data = list;
      this.tableData.currentPage = currentPage;
      this.tableData.total = total;
      if (this.$route.query.channel && this.$route.query.appid) {
         this.onShowEdit(this.tableData.data[0]);
      }
    },
    onSubmit() {
      this.tableOpt.currentPage = 1;
      this.fetchData();
    },
    onPageChange(current) {
      this.tableOpt.currentPage = current;
      this.fetchData();
    },
    onSizeChange(current) {
      this.tableOpt.pageSize = current;
      this.fetchData();
    },
    onShowEdit(data) {
      const { title, system, platform, back_control, id } = data;
      this.editFormTitle = `${title}(${formatSystem(system)})-${platform}`;
      this.showEditForm = true;
      if (
        platform.indexOf("巨量引擎") !== -1 ||
        platform.indexOf("磁力引擎") !== -1
      ) {
        this.flag = true;
        this.editForm.action = back_control.callback_behaviour?!!back_control.callback_behaviour.on:"";
        this.editForm.actionNum = back_control.callback_behaviour?back_control.callback_behaviour.scale:"";
        this.editForm.action_timeNum =
          back_control.callback_behaviour?back_control.callback_behaviour.custom_back_time.value:"";
        this.editForm.action_time =
          back_control.callback_behaviour?back_control.callback_behaviour.custom_back_time.unit:"";
      } else {
        this.flag = false;
      }
      this.editForm.id = id;
      this.editForm.active = !!back_control.back_active.on;
      this.editForm.keep = !!back_control.back_keep.on;
      this.editForm.pay = !!back_control.back_pay.on;
      this.editForm.pay_today = !!back_control.back_pay.today;
      this.editForm.pay_detail = back_control.back_pay.pay_detail;
      this.editForm.pay_money = back_control.back_pay.pay_fee;
      this.editForm.a = back_control.back_active.scale;
      this.editForm.b = back_control.back_keep.scale;
      this.editForm.c = back_control.back_pay.scale;
      this.editForm.d = back_control.back_pay.custom_back_time.value;
      this.editForm.time = back_control.back_pay.custom_back_time.unit;
    },
    async onEdit() {
      const {
        id,
        active,
        keep,
        pay,
        pay_money,
        pay_detail,
        a,
        b,
        c,
        d,
        time,
        action,
        actionNum,
        action_timeNum,
        action_time,
      } = this.editForm;

      if (!id) return;

      const [err, res] = await this.$http.post(
        "Invest_Config/editBackControl",
        {
          id: id,
          back_active: {
            on: active ? 1 : 0,
            scale: a,
          },
          back_keep: {
            on: keep ? 1 : 0,
            scale: b,
          },
          back_pay: {
            on: pay ? 1 : 0,
            scale: c,
            pay_fee: Number(pay_money).toFixed(2),
            pay_detail: pay_detail,
            custom_back_time: {
              unit: time,
              value: d,
            },
          },

          callback_behaviour: this.flag && this.editForm.action !== ""
            ? {
                on: action ? 1 : 0,
                scale: actionNum,
                custom_back_time: {
                  unit: action_time,
                  value: action_timeNum,
                },
              }
            : "",
        }
      );

      if (err) {
        this.$message.error("编辑失败");

        return;
      }

      this.$message.success("编辑成功");

      this.showEditForm = false;
      this.fetchData();
    },
    formatPut(code) {
      switch (String(code)) {
        case "":
          return "全部";
        case "1":
          return "是";
        case "2":
          return "否";
        default:
          return "未知";
      }
    },
    changeNum(data) {
      if (data > 100) {
        this.editForm.a = 100;
      }
      if (data < 0) {
        this.editForm.a = 0;
      }
      console.log(data);
    },
    changeNum2(data) {
      if (data > 100) {
        this.editForm.b = 100;
      }
      if (data < 0) {
        this.editForm.b = 0;
      }
    },
    changeNum3(data) {
      if (data > 100) {
        this.editForm.c = 100;
      }
      if (data < 0) {
        this.editForm.c = 0;
      }
    },
    changeActionNum(data) {
      if (data > 100) {
        this.editForm.actionNum = 100;
      }
      if (data < 0) {
        this.editForm.actionNum = 0;
      }
    },
    changeTimeNum(data) {
      if (data < 0) {
        this.editForm.d = 0;
      }
      this.editForm.d = data.replace(/[^\d]/g, "");
    },
    changeActionTime(data) {
      if (data < 0) {
        this.editForm.action_timeNum = 0;
      }
      this.editForm.action_timeNum = data.replace(/[^\d]/g, "");
    },
    changePayDetail(data) {
      console.log(data);
      if (data < 0) {
        this.editForm.pay_detail = 0;
        return;
      }
      if (data > 100) {
        this.editForm.pay_detail = 100;
        return;
      }
      this.editForm.pay_detail = data.replace(/[^\d]/g, "");
    },
    async onConfirm(row) {
      const [err, res] = await this.$http.post(
        "Invest_Config/batchBackControl",
        {
          appid: row.appid,
          origin: [row.channel],
          switch: row.status == "1" ? 0 : 1,
        }
      );
      if (res.length == 0) {
        this.$message({
          message: "保存成功",
          type: "success",
        });
      }
      this.fetchData();
    },
    async openPassback() {
      this.dialogVisible = true;
      const [err, res] = await this.$http.post("System/roleBtree");
      if (err) return;
      this.department_id = res.tree;
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
      let apps = [];
      res.tree.forEach((item) => {
        item.node.forEach((_item) => {
          _item.node.forEach((__item) => {
            apps.push(...__item.node);
          });
        });
      });
      this.apps = apps;
    },
    batchOff(val) {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          const [err, res] = await this.$http.post(
            "Invest_Config/batchBackControl",
            {
              appid: this.passback.appid,
              origin: this.passback.origin.split("\n"),
              switch: val,
            }
          );
          if (err) {
            return;
          }
          if (res.length) {
            this.$message.error("保存失败,请确认渠道");
            if (res.length == 1) {
              this.errInfo = res.join("");
            } else {
              this.errInfo = res.join("\n");
            }
          } else {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.errInfo = "";
            this.$refs["ruleForm"].resetFields();
            this.dialogVisible = false;
            this.fetchData();
            this.errInfo = "";
          }
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.errInfo = "";
      this.$refs["ruleForm"].resetFields();
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.form-item-child {
  padding-left: 20px;
}

/deep/.back-money {
  width: 100px;
  margin: 0 10px;
}

.hcbl_title {
  display: inline-block;
}

.title {
  display: inline-block;
  margin-left: 20px;
  font-size: 12px;
  color: #aaaaaa;
}
</style>
