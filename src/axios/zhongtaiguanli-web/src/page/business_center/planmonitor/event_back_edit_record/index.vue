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
      <el-col :md="5" :sm="12">
        <el-form-item label="筛选时间">
          <!-- <el-date-picker
            v-model="searchForm.time"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :popper-append-to-body="false"
            unlink-panels
          /> -->
          <dataPicker :datevalue.sync="searchForm.time"></dataPicker>
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
      <template #system="row">{{ row.row.system | formatSystem }}</template>
      <template #time_add="row">{{
        $moment(row.row.time_add).format("YYYY-MM-DD HH:mm")
      }}</template>
      <template #option="row">
        <el-button size="small" @click="onShowEdit(row.row)"
          >查看记录</el-button
        >
      </template>
    </TableLayout>
    <el-dialog :title="recordFormTitle" :visible.sync="showRecordForm">
      <div class="compared">
        <div class="compared-item">
          <div class="compared-title">修改前</div>
          <el-form label-width="0px">
            <el-form-item>
              <el-switch
                active-text="回传激活设备"
                v-model="beforeForm.active"
                disabled
              ></el-switch>
              <span class="hcbl_title" style="margin-left: 58px"
                >回传比例
                <el-input
                  class="back-money"
                  :min="0"
                  :max="100"
                  type="number"
                  v-model="beforeForm.a"
                  disabled
                />%
              </span>
            </el-form-item>
            <el-form-item>
              <el-switch
                active-text="回传次日留存设备"
                v-model="beforeForm.keep"
                disabled
              ></el-switch>
              <span class="hcbl_title" style="margin-left: 30px"
                >回传比例
                <el-input
                  class="back-money"
                  :min="0"
                  :max="100"
                  type="number"
                  v-model="beforeForm.b"
                  disabled
                />%
              </span>
            </el-form-item>
            <el-form-item>
              <el-switch
                active-text="回传付费设备"
                v-model="beforeForm.pay"
                disabled
              ></el-switch>
              <span class="hcbl_title" style="margin-left: 58px"
                >回传比例
                <el-input
                  class="back-money"
                  :min="0"
                  :max="100"
                  type="number"
                  v-model="beforeForm.c"
                  disabled
                />%
              </span>
              <div v-show="beforeForm.pay" class="form-item-child">
                <div style="padding: 10px 0">
                  <span class="hcbl_title">
                    <span class="hcbl_title" style="margin-right: 14px"
                      >自定义回传时间</span
                    >
                    <el-input
                      class="back-money"
                      :min="1"
                      type="number"
                      v-model="beforeForm.d"
                      disabled
                    />
                    <el-select
                      class="back-money"
                      disabled
                      v-model="beforeForm.time"
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
                    disabled
                    v-model="beforeForm.pay_money"
                  />元时回传
                </div>
                <div style="padding-top: 10px">
                  <span class="hcbl_title">回传订单金额比例</span>
                  <el-input
                    class="back-money"
                    type="number"
                    v-model="beforeForm.pay_detail"
                    disabled
                  />
                  %
                </div>
              </div>
            </el-form-item>
            <div v-if="flag">
              <el-switch
                active-text="回传关键行为"
                v-model="beforeForm.action"
                disabled
              ></el-switch>
              <span class="hcbl_title" style="margin-left: 58px"
                >回传比例
                <el-input
                  class="back-money"
                  :min="0"
                  :max="100"
                  type="number"
                  disabled
                  v-model="beforeForm.actionNum"
                  @input="changeActionNum"
                  @blur="
                    beforeForm.actionNum === ''
                      ? (beforeForm.actionNum = 100)
                      : (beforeForm.actionNum = beforeForm.actionNum)
                  "
                />%
              </span>
              <div v-if="beforeForm.action" style="padding: 10px 0">
                <span class="hcbl_title form-item-child">
                  <span class="hcbl_title" style="margin-right: 14px"
                    >自定义回传时间</span
                  >
                  <el-input
                    class="back-money"
                    :min="1"
                    type="number"
                    v-model="beforeForm.action_timeNum"
                    @input="changeActionTime"
                    disabled
                  />
                  <el-select
                    class="back-money"
                    v-model="beforeForm.action_time"
                    placeholder="请选择"
                    disabled
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
          </el-form>
        </div>
        <div class="compared-item">
          <div class="compared-title">修改后</div>
          <el-form label-width="0px">
            <el-form-item>
              <el-switch
                active-text="回传激活设备"
                v-model="afterForm.active"
                disabled
              ></el-switch>
              <span class="hcbl_title" style="margin-left: 58px"
                >回传比例
                <el-input
                  class="back-money"
                  :min="0"
                  :max="100"
                  type="number"
                  v-model="afterForm.a"
                  disabled
                />%
              </span>
            </el-form-item>
            <el-form-item>
              <el-switch
                active-text="回传次日留存设备"
                v-model="afterForm.keep"
                disabled
              ></el-switch>
              <span class="hcbl_title" style="margin-left: 30px"
                >回传比例
                <el-input
                  class="back-money"
                  :min="0"
                  :max="100"
                  type="number"
                  v-model="afterForm.b"
                  disabled
                />%
              </span>
            </el-form-item>
            <el-form-item>
              <el-switch
                active-text="回传付费设备"
                v-model="afterForm.pay"
                disabled
              ></el-switch>
              <span class="hcbl_title" style="margin-left: 58px"
                >回传比例
                <el-input
                  class="back-money"
                  :min="0"
                  :max="100"
                  type="number"
                  v-model="afterForm.c"
                  disabled
                />%
              </span>
              <div v-show="afterForm.pay" class="form-item-child">
                <div style="padding: 10px 0">
                  <span class="hcbl_title">
                    <span class="hcbl_title" style="margin-right: 14px"
                      >自定义回传时间</span
                    >
                    <el-input
                      class="back-money"
                      :min="1"
                      type="number"
                      v-model="afterForm.d"
                      disabled
                    />
                    <el-select
                      class="back-money"
                      disabled
                      v-model="afterForm.time"
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
                    disabled
                    v-model="afterForm.pay_money"
                  />元时回传
                </div>
                <div style="padding-top: 10px">
                  <span class="hcbl_title">回传订单金额比例</span>
                  <el-input
                    class="back-money"
                    type="number"
                    v-model="afterForm.pay_detail"
                    disabled
                  />
                  %
                </div>
              </div>
            </el-form-item>
            <div v-if="flag">
              <el-switch
                active-text="回传关键行为"
                v-model="afterForm.action"
                disabled
              ></el-switch>
              <span class="hcbl_title form-item-child" style="margin-left: 58px"
                >回传比例
                <el-input
                  class="back-money"
                  disabled
                  :min="0"
                  :max="100"
                  type="number"
                  v-model="afterForm.actionNum"
                  @input="changeActionNum"
                  @blur="
                    afterForm.actionNum === ''
                      ? (afterForm.actionNum = 100)
                      : (afterForm.actionNum = afterForm.actionNum)
                  "
                />%
              </span>
              <div v-if="afterForm.action" style="padding: 10px 0">
                <span class="hcbl_title form-item-child">
                  <span class="hcbl_title" style="margin-right: 14px"
                    >自定义回传时间</span
                  >
                  <el-input
                    class="back-money"
                    :min="1"
                    type="number"
                    disabled
                    v-model="afterForm.action_timeNum"
                    @input="changeActionTime"
                  />
                  <el-select
                    class="back-money"
                    v-model="afterForm.action_time"
                    placeholder="请选择"
                    disabled
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
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showRecordForm = false"
          >确 定</el-button
        >
      </div>
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
      pickerOptions,
      searchForm: {
        account_name: "",
        platform: "",
        app_id: "",
        time: [],
      },
      column: [
        {
          prop: "time_add",
          label: "操作时间",
        },
        {
          prop: "realname",
          label: "操作人",
        },
        {
          prop: "name",
          label: "账号",
        },
        {
          prop: "appid",
          label: "APPID",
        },
        {
          prop: "title",
          label: "APP名称",
        },
        {
          prop: "platform",
          label: "广告平台",
        },
        {
          prop: "origin",
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
      showRecordForm: false,
      recordFormTitle: "",
      platform: [],
      beforeForm: {
        id: "",
        active: false,
        keep: false,
        keep_today: false,
        pay: false,
        pay_today: false,
        pay_money: 0,
        pay_detail: 0,
        a: 0,
        b: 0,
        c: 0,
        d: 1,
        time: "day",
        action: false,
        actionNum: 0,
        action_timeNum: 0,
        time: "day",
        action_time: "day",
      },
      afterForm: {
        id: "",
        active: false,
        keep: false,
        keep_today: false,
        pay: false,
        pay_today: false,
        pay_money: 0,
        pay_detail: 0,
        a: 0,
        b: 0,
        c: 0,
        d: 1,
        time: "day",
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
    };
  },
  mounted() {
    this.fetchPlatform();
    this.fetchData();
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

      const [err, res] = await this.$http.post("Invest_Config/backControlLog", {
        ...searchForm,
        ...tableOpt,
        timeBegin: this.searchForm.time[0],
        timeEnd: this.searchForm.time[1],
      });

      this.tableData.loading = false;

      if (err) return;

      const { list, currentPage, total } = res;

      this.tableData.data = list;
      this.tableData.currentPage = currentPage;
      this.tableData.total = total;
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
      const { title, system, platform, befor_change, after_change } = data;

      this.recordFormTitle = `${title}(${formatSystem(system)})-${platform}`;
      if (
        platform.indexOf("巨量引擎") !== -1 ||
        platform.indexOf("磁力引擎") !== -1
      ) {
          this.flag = true;

        if (befor_change.callback_behaviour) {
          this.beforeForm.action = !!befor_change.callback_behaviour.on;
          this.beforeForm.actionNum = befor_change.callback_behaviour.scale;
          this.beforeForm.action_timeNum =
            befor_change.callback_behaviour.custom_back_time.value;
          this.beforeForm.action_time =
            befor_change.callback_behaviour.custom_back_time.unit;
        }
        if(after_change.callback_behaviour){

          this.afterForm.action = !!after_change.callback_behaviour.on;
          this.afterForm.actionNum = after_change.callback_behaviour.scale;
          this.afterForm.action_timeNum =
            after_change.callback_behaviour.custom_back_time.value;
          this.afterForm.action_time =
            after_change.callback_behaviour.custom_back_time.unit;
        }
      } else {
        this.flag = false;
      }
      // 修改前
      this.beforeForm.active = !!befor_change.back_active.on;
      this.beforeForm.keep = !!befor_change.back_keep.on;
      this.beforeForm.pay = !!befor_change.back_pay.on;
      this.beforeForm.pay_today = !!befor_change.back_pay.today;
      this.beforeForm.pay_detail = befor_change.back_pay.pay_detail;
      this.beforeForm.pay_money = befor_change.back_pay.pay_fee;
      this.beforeForm.a = befor_change.back_active.scale;
      this.beforeForm.b = befor_change.back_keep.scale;
      this.beforeForm.c = befor_change.back_pay.scale;
      this.beforeForm.d = befor_change.back_pay.custom_back_time.value;
      // 修改后
      this.afterForm.active = !!after_change.back_active.on;
      this.afterForm.keep = !!after_change.back_keep.on;
      this.afterForm.pay = !!after_change.back_pay.on;
      this.afterForm.pay_today = !!after_change.back_pay.today;
      this.afterForm.pay_detail = after_change.back_pay.pay_detail;
      this.afterForm.pay_money = after_change.back_pay.pay_fee;
      this.afterForm.a = after_change.back_active.scale;
      this.afterForm.b = after_change.back_keep.scale;
      this.afterForm.c = after_change.back_pay.scale;
      this.afterForm.d = after_change.back_pay.custom_back_time.value;

      this.showRecordForm = true;
    },
    async onEdit() {
      const { id, active, keep, pay, pay_today, pay_money } = this.beforeForm;

      if (!id) return;

      const [err, res] = await this.$http.post(
        "Invest_Config/editBackControl",
        {
          id: id,
          back_active: {
            on: active ? 1 : 0,
          },
          back_keep: {
            on: keep ? 1 : 0,
          },
          back_pay: {
            on: pay ? 1 : 0,
            today: pay_today ? 1 : 0,
            pay_fee: Number(pay_money).toFixed(2),
          },
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
  },
};
</script>

<style lang="less" scoped>
.compared {
  display: flex;
  align-items: center;
  .compared-item {
    flex: 1;
    .compared-title {
      font-size: 18px;
      margin-bottom: 15px;
    }
    /deep/.el-form {
      width: 100%;
    }
  }
}
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
