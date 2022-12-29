<template>
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="12" :sm="12" :lg="6">
        <el-form-item label="渠道名/域名">
          <el-input
            v-model="searchForm.search"
            placeholder="搜索渠道名称/域名"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :md="12" :sm="12" :lg="6">
        <el-form-item label="渠道">
          <SelectChannel v-model="searchForm.channel"></SelectChannel>
        </el-form-item>
      </el-col>
      <el-col :md="12" :sm="12" :lg="6">
        <el-form-item label="渠道负责人">
          <el-select
            v-model="searchForm.admin_id"
            filterable
            placeholder="全选"
            :clearable="true"
            :multiple="true"
          >
            <el-option
              v-for="item in SadminUserList"
              :key="item.id"
              :label="item.realname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="12" :sm="12" :lg="6">
        <el-form-item label="投放方式">
          <el-select v-model="searchForm.system_create" placeholder="默认全部">
            <el-option
              v-for="item in FilterOps"
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
      @pageChange="onPageChange"
      @sizeChange="onSizeChange"
      @sortChange="onSortChange"
    >
      <template #table-option>
        <el-button type="primary" @click="onShowAdd" style="margin-bottom: 20px"
          >新增投放统计</el-button
        >
      </template>
      <template #day="scope">
        <div>今天</div>
        <div>累计</div>
      </template>
      <template #system_create="scope">{{
        scope.row.system_create | formatPlatform
      }}</template>
      <template #device_new_all="scope">
        <div>{{ scope.row.device_new | formatUnit }}</div>
        <div>{{ scope.row.device_new_all | formatUnit }}</div>
      </template>
      <template #statistics="scope">
        <div>总收入：{{ scope.row.all_income_recycling | formatnum }}</div>
        <div>订单：{{ scope.row.order_income_recycling | formatnum }}</div>
        <div>广告：{{ scope.row.ad_income_recycling | formatnum }}</div>
      </template>
      <template #option="scope">
        <el-button
          type="text"
          size="small"
          @click="getCode(scope.row)"
          v-if="
            scope.row.system_create == 0 ||
            scope.row.system_create == 18 ||
            scope.row.system_create == 3
          "
          >获取代码</el-button
        >
        <template v-else>
          <!-- <el-button @click="onLinkMore(scope.row)" type="text" size="small">查看</el-button> -->
          <el-button type="text" size="small" @click="getURL(scope.row)"
            >获取URL</el-button
          >

          <el-button
            v-if=" scaleArr.indexOf(scope.row.system_create) !== -1"
            type="text"
            size="small"
            @click="openRebate(scope.row)"
            >返点比例</el-button
          >
          <el-button
            v-if="moneyArr.indexOf(scope.row.system_create) !== -1"
            type="text"
            size="small"
            @click="openConsume(scope.row)"
            >消耗金额</el-button
          >
          <el-button
            v-if="scope.row.system_create == 8 || scope.row.system_create == 9"
            type="text"
            size="small"
            @click="changeData(scope.row)"
            >修改</el-button
          >
          <el-button
            v-else
            type="text"
            size="small"
            @click="changeDataOne(scope.row)"
            >修改</el-button
          >
        </template>
        <el-button
          v-if="scope.row.system_create == 0 || scope.row.system_create == 18"
          type="text"
          size="small"
          @click="changeDataOne(scope.row)"
          >修改
        </el-button>
      </template>
    </TableLayout>
    <!-- dialog -->
    <el-dialog
      title="新增"
      :visible.sync="showAdd"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addForm"
        label-width="120px"
        ref="addForm"
        :rules="addFormRules"
      >
        <el-form-item label="投放方式" required>
          <el-select
            v-model="addForm.system_create"
            placeholder="请选择"
            style="width: 240px"
            @change="otherPlatformListchange"
          >
            <el-option
              v-for="item in otherPlatformList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="订单类型"
          required
          v-if="addForm.system_create == 9"
        >
          <el-select
            v-model="addForm.order_type"
            placeholder="请选择"
            style="width: 240px"
            @change="orderTypeChange"
          >
            <el-option label="传播任务" value="1"></el-option>
            <el-option label="投稿任务" value="2"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="addForm.system_create !== ''">
          <el-form-item
            label="落地页域名"
            v-if="addForm.system_create == 0 || addForm.system_create == 18"
            required
          >
            <el-input
              v-model="addForm.domain"
              style="width: 240px"
              placeholder="单行输入"
            ></el-input>
            <div class="tips">
              <p>可输入如下4种域名形式：</p>
              <p>1. 主域名（如：https://www.baidu.com）</p>
              <p>2. 二级域名（如：sub.baidu.com）</p>
              <p>3. 子目录（如：https://www.baidu.com/sub）</p>
              <p>4. wap站域名（如：wap.baidu.com)</p>
            </div>
          </el-form-item>
          <el-form-item label="渠道名称" prop="title">
            <el-input
              v-model="addForm.title"
              style="width: 240px"
              :placeholder="
                addForm.system_create == 0 || addForm.system_create == 18
                  ? '用于标识落地页'
                  : '用于标识第三方投放平台'
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="渠道号" prop="origin">
            <el-input
              v-model="addForm.origin"
              style="width: 240px"
              :placeholder="
                addForm.system_create == 0 || addForm.system_create == 18
                  ? '与落地页apk渠道号一致'
                  : '与在该广告平台投放的包名一致'
              "
              @blur="onBlur"
              :onkeyup="Onkeyup"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="akey" required v-show="addForm.system_create == '16'">
                        <el-input v-model="addForm.akey" style="width: 240px" placeholder="请输入akey" @blur="ratioBlur">
                        </el-input>
                    </el-form-item> -->
          <el-form-item label="返点比例" v-show="ratio_show">
            <el-input
              v-model="addForm.ratio"
              style="width: 240px"
              placeholder="请输入返点比例"
              @blur="ratioBlur"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>

          <el-form-item label="生效日期" v-show="ratio_show">
            <el-date-picker
              v-model="addForm.date"
              type="date"
              style="width: 240px"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发布时间" v-if="xt_send_time_show">
            <el-date-picker
              v-model="addForm.send_time"
              type="date"
              style="width: 240px"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="是否监测链接双端共用"
            label-width="200px"
            v-if="xt_ios_android_lisiten_show"
          >
            <el-radio-group v-model="is_lisiten">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="监测链接共用应用"
            label-width="200px"
            v-if="is_lisiten == 1 && xt_ios_android_lisiten_show"
          >
            <el-select
              v-model="addForm.lisiten_appid"
              placeholder="请选择"
              style="width: 240px"
              @change="lisitenAppidChange"
            >
              <el-option
                v-for="item in lisitenApp"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="渠道负责人" prop="admin_id">
            <el-select
              v-model="addForm.admin_id"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in adminUserList"
                :key="item.id"
                :label="item.realname"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input
              type="textarea"
              style="width: 240px"
              :rows="3"
              maxlength="32"
              show-word-limit
              v-model="addForm.note"
              @input="testareaChange($event)"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="关键行为名称"
            :prop="addForm.event_id ? 'event_name' : 'event_nameNo'"
            v-if="cl_jl_flag"
          >
            <el-input
              v-model="addForm.event_name"
              style="width: 240px"
            ></el-input>
          </el-form-item>
          <el-form-item label="关键行为ID" v-if="cl_jl_flag">
            <el-input
              v-model="addForm.event_id"
              style="width: 240px"
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div
        v-if="addSpecialShow && addForm.system_create != '15'"
        style="margin-left: 45px"
      >
        <p>*添加后需要获取代码去第三方配置监测链接</p>
        <p>*该渠道下所有所有归因来的投放计划会自动记录</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false">取 消</el-button>
        <template>
          <el-button type="primary" @click="onNextSpecial" v-if="specialStep"
            >下一步</el-button
          >
          <el-button type="primary" @click="onAdd" v-else>确 定</el-button>
        </template>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showchangeData"
      title="修改信息"
      :close-on-click-modal="false"
    >
      <div v-loading="fullscreenLoading"></div>
      <el-form
        :model="changeForm"
        label-width="120px"
        ref="changeForm"
        v-if="!fullscreenLoading"
        :rules="changeRules"
      >
        <el-form-item label="收款账户">
          <el-input
            v-model="changeForm.proceeds_user"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item :label="changeSystemCreate == 8 ? '订单ID' : '任务ID'">
          <el-input
            v-model="changeForm.ad_id"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="changeSystemCreate == 8 ? '订单名称' : '任务名称'"
        >
          <el-input
            v-model="changeForm.ad_name"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="渠道负责人">
          <el-select
            v-model="changeForm.admin_id"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in adminUserList"
              :key="item.id"
              :label="item.realname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人生效时间">
          <el-date-picker
            v-model="changeForm.admin_date"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input
            type="textarea"
            style="width: 240px"
            :rows="3"
            maxlength="32"
            show-word-limit
            v-model="changeForm.note"
            @input="testareaChange($event)"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showchangeData = false">取 消</el-button>

        <el-button type="primary" @click="onChangeData">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="showchangeDataOne"
      title="修改信息"
      :close-on-click-modal="false"
      @close="dataOneDown"
    >
      <div v-loading="fullscreenLoadingOne"></div>
      <el-form
        :model="changeFormOne"
        label-width="120px"
        ref="changeFormOne"
        v-if="!fullscreenLoadingOne"
        :rules="changeFormOneRules"
      >
        <el-form-item label="渠道负责人">
          <el-select
            v-model="changeFormOne.admin_id"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in adminUserList"
              :key="item.id"
              :label="item.realname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="akey" v-if="akeyFlag">
          <el-input
            v-model="changeFormOne.akey"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="token" v-if="tokenlag">
          <el-input
            v-model="changeFormOne.access_token"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人生效时间">
          <el-date-picker
            v-model="changeFormOne.admin_date"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input
            type="textarea"
            style="width: 240px"
            :rows="3"
            maxlength="32"
            show-word-limit
            v-model="changeFormOne.note"
            @input="testareaChange($event)"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="关键行为名称"
          :prop="changeFormOne.event_id ? 'event_name' : 'event_nameNo'"
          v-if="edit_jl_cl_flag"
        >
          <el-input
            v-model="changeFormOne.event_name"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="关键行为ID" v-if="edit_jl_cl_flag">
          <el-input
            v-model="changeFormOne.event_id"
            style="width: 240px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showchangeDataOne = false">取 消</el-button>

        <el-button type="primary" @click="onChangeDataOne">确 定</el-button>
      </div>
    </el-dialog>
    <get-code ref="getCode"></get-code>
    <get-url ref="getUrl" :url="connectUrl"></get-url>
    <rebateRatio ref="rebateRatio"></rebateRatio>
    <Consume ref="consume"></Consume>
  </div>
</template>

<script>
import {
  Ip_originList,
  Ip_updateLandingPage,
  Ip_addLandingPage,
} from "@/config/api/index";
import getCode from "./component/getcode";
import getUrl from "./component/geturl";
import rebateRatio from "./component/rebate_ratio";
import Consume from "./component/consume";
import store from "store2";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import { otherPlatformList, getConnectUrl } from "./utils";
import SelectChannel from "@/component/select-channel";
import { Loading } from "element-ui";
const changeOrigin = (rule, value, callback) => {
  if (value) {
    if (/[ ]|[\u4E00-\u9FA5]/g.test(value)) {
      callback(new Error("不能输入汉字与空格，请检查"));
    }
  } else {
    callback();
  }
};
export default {
  name: "ip_attribution_admin",
  components: {
    getCode,
    getUrl,
    FilterLayout,
    SelectChannel,
    TableLayout,
    rebateRatio,
    Consume,
  },
  data() {
    return {
      sort: {
        prop: "",
        order: "",
      },
      orderType: "", // 表单的订单类型
      admin_id: "",
      changeSystemCreate: "",
      searchForm: {
        search: "",
        channel: [],
        admin_id: [],
        system_create: "99", // todo
        currentPage: 1,
      },
      addFormRules: {
        title: [{ required: true, message: "请输入渠道名称", trigger: "blur" }],
        origin: [
          { required: true, message: "请输入渠道号", trigger: "blur" },
          { validator: changeOrigin, trigger: "blur" },
        ],
        event_id: [
          { required: true, message: "请填写关键行为ID", trigger: "change" },
        ],
        event_idNo: [{ required: false }],
        event_name: [
          { required: true, message: "请填写关键行为名称", trigger: "change" },
        ],
        event_nameNo: [{ required: false }],
      },
      xt_ios_android_lisiten_show: false,
      xt_send_time_show: false,
      ratio_show: true,
      is_lisiten: "2",
      lisitenApp: [],
      roleTree: {},
      column: [
        {
          prop: "system_create",
          label: "投放方式",
        },
        {
          prop: "title",
          label: "渠道名称",
        },
        {
          prop: "origin",
          label: "渠道",
        },
        {
          prop: "admin_name",
          label: "渠道负责人",
        },
        {
          prop: "event_id",
          label: "关键行为ID",
          width: 100,
        },
        {
          prop: "event_name",
          label: "关键行为名称",
          width: 150,
        },
        {
          prop: "note",
          label: "备注",
          width: 200,
        },
        {
          prop: "day",
          label: "日期",
        },
        {
          prop: "device_new_all",
          label: "归因新增",
          sortable: "custom",
        },
        {
          prop: "statistics",
          label: "收入统计",
        },
        {
          prop: "time_add",
          label: "添加时间",
        },
        {
          prop: "option",
          label: "操作",
          width: 180,
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
      options: [],
      FilterOps: [
        {
          label: "全部",
          value: "99",
        },
        ...otherPlatformList,
        {
          label: "内部换量",
          value: "3",
        },
      ],
      showAdd: false,
      addForm: {
        domain: "",
        title: "",
        origin: "",
        system_create: "",
        lisiten_appid: "",
        lisiten_app_system: "",
        send_time: "",
        ratio: "",
        date: "",
        admin_id: "",
        akey: "",
        order_type: "",
        event_id: "",
        event_name: "",
        note: "",
      },
      showchangeData: false,
      changeForm: {
        proceeds_user: "",
        ad_id: "",
        ad_name: "",
        admin_id: "",
        channel: "",
        platform: "",
        admin_date: "",
        note: "",
      },
      changeRules: {
        proceeds_user: [{ required: true, message: "请填写收款账户" }],
        ad_id: [{ required: true, message: "请填写订单ID" }],
        ad_name: [{ required: true, message: "请填写计划名称" }],
      },
      changeFormOne: {
        admin_id: "",
        channel: "",
        platform: "",
        akey: "",
        access_token: "",
        admin_date: "",
        event_id: "",
        event_name: "",
        note: "",
      },
      changeFormOneRules: {
        event_id: [
          { required: true, message: "请填写关键行为ID", trigger: "change" },
        ],
        event_name: [
          { required: true, message: "请填写关键行为名称", trigger: "change" },
        ],
        event_nameNo: [{ required: false }],
      },
      otherPlatformList,
      addSpecialShow: false,
      connectUrl: "",
      specialStep: false,
      fullscreenLoading: false,
      showchangeDataOne: false,
      fullscreenLoadingOne: false,
      cl_jl_flag: false,
      edit_jl_cl_flag: false,
      adminUserList: [],
      SadminUserList: [],
      akeyFlag: false,
      tokenlag: false,
      moneyArr: ["8", "14", "11", "17", "9"], //显示消耗金额的平台
      scaleArr: ["1", "4", "5", "2", "6", "7", "12", "13", "16", "15"], //显示返点比例的平台
    };
  },
  created() {
    this.fetchList();
    this.originList();
    this.getRoleBtree();
  },
  mounted() {
    this.admin_id = JSON.parse(localStorage.getItem("user")).id;
    this.getAdmin();
  },
  watch: {
    "addForm.system_create"(newvalue) {
      const specialWay = [1, 2, 4, 5, 8, 9, 16];

      if (newvalue == 1) {
        this.addForm.domain = "";
      }

      this.addForm.origin = "";

      this.specialStep = !!specialWay.find((v) => v == newvalue);
      this.addSpecialShow = this.outPlatform(newvalue);
    },
  },
  filters: {
    formatPlatform(val) {
      if (!val) return "--";

      const platform = [
        ...otherPlatformList,
        {
          label: "内部换量",
          value: "3",
        },
      ];

      const current = platform.find((v) => v.value == val);

      if (current) return current.label;

      return "--";
    },
    formatnum(val) {
      let res = val.toString().replace(/\d+/, function (n) {
        // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
          return $1 + ",";
        });
      });
      return res;
    },
  },
  methods: {
    orderTypeChange(e) {
      if (e == 1) {
        this.specialStep = true;
      } else {
        this.specialStep = false;
      }
    },
    // 打开弹窗
    onShowAdd() {
      this.showAdd = true;
      this.addForm = {
        domain: "",
        title: "",
        origin: "",
        system_create: "",
        lisiten_appid: "",
        lisiten_app_system: "",
        send_time: "",
        ratio: "",
        date: "",
        admin_id: "",
        akey: "",
        event_id: "",
        event_name: "",
        note: "",
      };

      this.$nextTick(() => {
        this.addSpecialShow = false;
      });
    },
    // 查看
    onLinkMore({ origin, system_create }) {
      this.$router.push({
        path:
          system_create == "3"
            ? "/count_center/ip_attribution/inside"
            : "/count_center/ip_attribution/statistics",
        query: {
          origin,
        },
      });
    },
    ratioBlur(e) {
      const val = e.target.value;
      var reg = /^\d+(?=\.{0,1}\d+$|$)/;
      if (!reg.test(val)) {
        this.addForm.ratio = "";
      }
    },
    lisitenAppidChange(e) {
      const idx = this.lisitenApp.findIndex((el) => el.id == e);
      if (idx > -1) {
        this.addForm.lisiten_app_system = this.lisitenApp[idx].system;
      }
    },
    otherPlatformListchange(e) {
      this.addForm.domain = "";
      this.addForm.title = "";
      this.addForm.origin = "";
      this.addForm.lisiten_appid = "";
      this.addForm.lisiten_app_system = "";
      this.addForm.send_time = "";
      this.addForm.ratio = "";
      this.addForm.date = "";
      this.addForm.admin_id = "";
      this.addForm.akey = "";
      this.addForm.order_type = "";
      this.addForm.event_id = "";
      this.addForm.event_name = "";
      this.addForm.note = "";
      this.is_lisiten = "2";
      let xt_arr = [8, 9, 14, 11, 17, 18, 19]; //展示双端链接
      let not_ratio_arr = ["0", 8, 14, 11, 9, 15, 17, 18, 19]; // 这几个id不展示返点比例
      this.ratio_show = not_ratio_arr.indexOf(e) > -1 ? false : true;
      // this.xt_send_time_show = e == 8 || e == 9; // 星图任务传播和快手聚星
      this.xt_ios_android_lisiten_show = xt_arr.indexOf(e) > -1 ? true : false;
      this.cl_jl_flag = e == 1 || e == 5; //巨量引擎 磁力引擎
      const appId = this.$route.query.appId;
      // 获取共用应用
      const { tree } = this.roleTree;
      let sharedApp = {};
      let appid_system = "";
      tree.forEach((department_el) => {
        department_el.node.forEach((group_el) => {
          group_el.node.forEach((project_el) => {
            project_el.node.forEach((app_el) => {
              if (app_el.id == appId) {
                sharedApp = project_el; // 获取当前app同一项目组下的app
                appid_system = app_el.system; //查看当前app是什么端
              }
            });
          });
        });
      });
      let arr = [];
      sharedApp.node.forEach((el) => {
        if (el.system != appid_system) {
          arr.push(el);
        }
      });
      this.lisitenApp = arr;
      this.addForm.order_type = this.addForm.system_create == 9 ? "1" : "";
      this.addForm.admin_id = this.admin_id;
    },
    // 获取app部门分组
    async getRoleBtree() {
      const [err, res] = await this.$http.post("System/roleBtree", {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
      });
      if (err) return;
      this.roleTree = res;
    },
    // 获取负责人列表
    async getAdmin() {
      const [err, res] = await this.$http.post("Admin/getAdmin");
      if (err) return;
      this.adminUserList = res;
      this.SadminUserList = res;
    },
    // 获取代码
    getCode(data) {
      this.$refs.getCode.$data.dialogVisible = true;
      this.$refs.getCode.$data.data = data;
    },
    openRebate(origin) {
      this.$refs.rebateRatio.$data.info = origin;
      this.$refs.rebateRatio.getRebatesInfo();
    },
    openConsume(origin) {
      this.$refs.consume.$data.info = origin;
      this.$refs.consume.getRebatesInfo();
    },
    // 获取URL
    getURL({
      system_create,
      origin,
      lisiten_appid,
      lisiten_app_system,
      appid,
    }) {
      const { id, system } = this.$store.getters.getCurrentApp(
        this.$route.query.appId
      );
      let temp_system = system;
      if (lisiten_app_system && lisiten_appid) {
        if (lisiten_app_system == "1") {
          temp_system = "2";
        } else if (lisiten_app_system == "2") {
          temp_system = "1";
        }
      }

      const connectUrl = getConnectUrl({
        appid: appid,
        origin,
        system_create,
        system: temp_system,
        system2: lisiten_app_system,
        appid2: lisiten_appid,
      });

      if (!connectUrl) {
        return this.$message.error("获取参数错误，请刷新后重试！");
      }

      this.connectUrl = connectUrl;
      if (system_create == "15") {
        this.connectUrl = "";
      }
      this.$refs.getUrl.$data.dialogVisible = true;
    },
    // 开始或停止
    ruing({ id, status }) {
      let operate = status == 0 ? "start" : "close";
      Ip_updateLandingPage({ id, operate }).then((res) => {
        if (res[2] == 1) {
          this.$message({
            message: res[3],
            type: "success",
          });
          this.landingPageList();
        }
      });
    },
    // 删除
    onRemove(id) {
      let operate = "delete";
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        Ip_updateLandingPage({ id, operate }).then((res) => {
          if (res[2] == 1) {
            this.$message({
              message: res[3],
              type: "success",
            });
            this.landingPageList();
          }
        });
      });
    },
    onBlur(e) {
      this.addForm.origin = e.target.value.toUpperCase();
    },
    Onkeyup() {
      /* this.addForm.origin = addForm.origin.replace(/[ ]|[\u4E00-\u9FA5]/g, ""); */
    },
    async onAdd() {
      let { title, origin, system_create, lisiten_appid, ratio, date } = this.addForm;
      if (
        !title ||
        !origin ||
        !system_create ||
        (this.is_lisiten == "1" && !lisiten_appid) ||
        (ratio && !date) ||
        (!ratio && date)
      ) {
        this.$message({
          message: "请填写完整信息",
          type: "warning",
        });

        return;
      }
      let errorMessage = "";
      this.$refs.addForm.validateField(["origin"], (errorMessage) => {
        if (err) {
          errorMessage = errorMessage;
        }
      });
      if (errorMessage) {
        return;
      }
      this.addForm.origin = this.ToCDB(this.addForm.origin);
      if ([1, 4, 5, 8].indexOf(this.addForm.system_create) !== -1) {
        Ip_addLandingPage({
          ...this.addForm,
          origin: this.addForm.origin.toUpperCase(),
        }).then((res) => {
          if (res.length === 1) {
            this.$message.error(res[0]);
          } else if (res[2] === 1) {
            this.$message({
              message: res[3],
              type: "success",
            });

            this.showAdd = false;
            this.searchForm.search = "";
            this.searchForm.channel = [];
            this.searchForm.admin_id = [];
            this.originList();
            this.tableOpt.currentPage = 1;
            this.fetchList();
          }
        });
      } else if (
        [1, 4, 5, 8].indexOf(this.addForm.system_create) === -1 &&
        this.addForm.system_create != 0 &&
        this.addForm.system_create != 18
      ) {
        let [res, err] = await this.$http.post("Ip/addLandingInvestChannel", {
          loginId: store.get("user")["id"],
          loginToken: store.get("loginToken"),
          ...this.addForm,
          origin: this.addForm.origin.toUpperCase(),
        });

        if (err) return;

        this.showAdd = false;
        this.searchForm.search = "";
        this.searchForm.channel = [];
        this.searchForm.admin_id = [];
        this.originList();
        this.tableOpt.currentPage = 1;
        this.fetchList();
      }
      if (this.addForm.system_create == 0) {
        let [res, err] = await this.$http.post("Ip/addLandingPage", {
          loginId: store.get("user")["id"],
          loginToken: store.get("loginToken"),
          ...this.addForm,
          origin: this.addForm.origin.toUpperCase(),
        });

        if (err) return;

        this.showAdd = false;
        this.searchForm.search = "";
        this.searchForm.channel = [];
        this.searchForm.admin_id = [];
        this.originList();
        this.tableOpt.currentPage = 1;
        this.fetchList();
      }
      if (this.addForm.system_create == 18) {
        let [res, err] = await this.$http.post("Ip/addLandingInvestChannel", {
          ...this.addForm,
          origin: this.addForm.origin.toUpperCase(),
        });

        if (err) return;

        this.showAdd = false;
        this.searchForm.search = "";
        this.searchForm.channel = [];
        this.searchForm.admin_id = [];
        this.originList();
        this.tableOpt.currentPage = 1;
        this.fetchList();
      }
    },
    // 获取来源
    originList() {
      Ip_originList({ type: 99 }).then((res) => {
        this.options = res[1].map((item) => {
          return {
            label: item,
            value: item,
          };
        });
        this.options.unshift({
          label: "全部",
          value: "",
        });
      });
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
      const { searchForm, tableOpt, sort } = this;

      this.tableData.loading = true;

      const [err, res] = await this.$http.post("Ip/landingPageList", {
        ...searchForm,
        ...tableOpt,
        ...sort,
        channel: this.searchForm.channel.join(","),
      });

      this.tableData.loading = false;

      if (err) return;

      const { list, currentPage, total } = res;

      this.tableData.data = list;
      this.tableData.currentPage = currentPage;
      this.tableData.total = total;
    },
    onNextSpecial() {
      let {
        title,
        origin,
        system_create,
        lisiten_appid,
        ratio,
        date,
        lisiten_app_system,
        send_time,
        order_type,
        event_id,
        event_name,
        note,
        admin_id,
      } = this.addForm;
      if (system_create == 9 && !order_type) {
        this.$message({
          message: "请选择订单类型",
          type: "warning",
        });

        return;
      }
      if (
        !title ||
        !origin ||
        !system_create ||
        (this.is_lisiten == 1 && !lisiten_appid) ||
        (ratio && !date) ||
        (!ratio && date)
      ) {
        this.$message({
          message: "请填写完整信息",
          type: "warning",
        });

        return;
      }
      if ((!event_name && !event_id) || (event_name && event_id)) {
      } else {
        this.$refs.addForm.validate((v, i) => {});
        this.$message({
          message: "请填写完整信息",
          type: "warning",
        });
        return;
      }
      let errorMessage = "";
      this.$refs.addForm.validateField(["origin"], (errorMessage) => {
        if (err) {
          errorMessage = errorMessage;
        }
      });
      if (errorMessage) {
        return;
      }

      origin = this.ToCDB(origin);

      let appName = this.$store.getters.getCurrentApp(
        this.$route.query.appId
      ).title;
      if (system_create === 8) {
        this.$router.push({
          path: "/count_center/ip_attribution/web_admin/add_xingtu",
          query: {
            title,
            origin,
            system_create,
            lisiten_appid,
            lisiten_app_system,
            send_time,
            appName,
            note,
            admin_id
          },
        });
        return;
      }

      if (system_create === 4) {
        this.$router.push({
          path: "/count_center/ip_attribution/web_admin/add_baidu",
          query: {
            title,
            origin,
            system_create,
            appName,
            ratio,
            date,
            note,
            admin_id
          },
        });
        return;
      }

      if (system_create == 2) {
        this.$router.push({
          path: "/count_center/ip_attribution/web_admin/add_tengxun",
          query: {
            title,
            origin,
            system_create,
            appName,
            ratio,
            date,
            note,
            admin_id
          },
        });
        return;
      }

      if (system_create == 9) {
        this.$router.push({
          path: "/count_center/ip_attribution/web_admin/add_kuaishou",
          query: {
            title,
            origin,
            system_create,
            appName,
            lisiten_appid,
            lisiten_app_system,
            send_time,
            note,
            admin_id
          },
        });
        return;
      }

      this.$router.push({
        path: "/count_center/ip_attribution/web_admin/add_special",
        query: {
          title,
          origin,
          system_create,
          lisiten_appid,
          lisiten_app_system,
          appName,
          date,
          ratio,
          event_id,
          event_name,
          note,
          admin_id
        },
      });
    },
    outPlatform(val) {
      const list = this.otherPlatformList.find((v) => v.value == val);

      return list;
    },
    // 修改当前星图用户名与ID
    async changeData(val) {
      this.changeSystemCreate = val.system_create;
      this.fullscreenLoading = true;
      const [err, res] = await this.$http.post("Ip/queryAdvertiser", {
        appId: val.appid,
        channel: val.origin,
        platform: val.system_create,
      });
      if (err) {
        return;
      }
      this.getAdmin();
      this.fullscreenLoading = false;
      if (res && res.id) {
        this.$nextTick(() => {
          this.changeForm.proceeds_user = res.proceeds_user;
          this.changeForm.ad_id = res.ad_id;
          this.changeForm.ad_name = res.ad_name;
          this.changeForm.id = res.id;
          this.changeForm.appId = val.appid;
          this.changeForm.admin_id = res.admin_id;
          this.changeForm.channel = res.channel;
          this.changeForm.platform = res.platform;
          this.changeForm.admin_date = res.admin_date || "";
          this.changeForm.note = res.note || "";
        });
        this.showchangeData = true;
      } else {
        this.$message.error("未查询到相应的配置信息！");
      }
    },
    async changeDataOne(val) {
      this.fullscreenLoadingOne = true;
      this.tableData.loading = true;
      const [err, res] = await this.$http.post("Ip/queryAdvertiser", {
        appId: val.appid,
        channel: val.origin,
        platform: val.system_create,
      });
      this.akeyFlag = val.system_create === "16" ? true : false;
      this.tokenlag = val.system_create === "16" ? true : false;
      this.edit_jl_cl_flag = val.system_create == 1 || val.system_create == 5;
      if (err) {
        return;
      }
      this.getAdmin();
      this.tableData.loading = false;
      this.fullscreenLoadingOne = false;
      this.showchangeDataOne = true;
      this.$nextTick(() => {
        this.changeFormOne.admin_id = res.admin_id == 0 ? "" : res.admin_id;
        this.changeFormOne.channel = val.origin;
        this.changeFormOne.platform = val.system_create;
        this.changeFormOne.akey = res.akey;
        this.changeFormOne.access_token = res.access_token;
        this.changeFormOne.admin_date = res.admin_date || "";
        this.changeFormOne.event_id = res.event_id || "";
        this.changeFormOne.event_name = res.event_name || "";
        this.changeFormOne.note = res.note || "";
      });
    },
    onChangeData() {
      this.$refs.changeForm.validate(async (v, i) => {
        if (v) {
          const [err, res] = await this.$http.post("Ip/editAdvertiser", {
            ...this.changeForm,
          });
          if (err) {
            return;
          }
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.showchangeData = false;
          this.changeForm = {
            proceeds_user: "",
            ad_id: "",
            ad_name: "",
            admin_id: "",
            channel: "",
            platform: "",
            admin_date: "",
            note: "",
          };
          this.fetchList();
        } else {
          return;
        }
      });
    },
    async onChangeDataOne() {
      this.$refs.changeFormOne.validate(async (v, i) => {
        if (v) {
          const [err, res] = await this.$http.post("Ip/editAdvertiser", {
            ...this.changeFormOne,
          });
          if (err) {
            return;
          }
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.dataOneDown(); // 初始化弹窗的数据
          this.fetchList();
        } else {
          return;
        }
      });
    },
    dataOneDown() {
      this.showchangeDataOne = false;
      this.akeyFlag = false;
      this.tokenlag = false;
      this.changeFormOne = {
        admin_id: "",
        channel: "",
        platform: "",
        akey: "",
        access_token: "",
        admin_date: "",
        event_id: "",
        event_name: "",
        note: "",
      };
    },
    onSortChange(data) {
      const { prop, order } = data;
      this.sort = { prop, order };
      this.tableOpt.currentPage = 1;
      this.fetchList();
    },
    testareaChange(e) {
      this.$forceUpdate(e);
    },
    ToCDB(str) {
      let tmp = "";
      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) == 12288) {
          tmp += String.fromCharCode(str.charCodeAt(i) - 12256);
          continue;
        }
        if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
          tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
        } else {
          tmp += String.fromCharCode(str.charCodeAt(i));
        }
      }
      return tmp;
    },
  },
};
</script>

<style lang="scss" scoped>
.filter {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;

  .label {
    margin-right: 12px;
    font-size: 14px;
  }
}

.table {
  padding: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .downDataToExcel {
    margin-bottom: 20px;
  }

  .pagination {
    margin: 20px;
  }
}

.el-range-editor,
.el-select {
  margin-right: 20px;
}
</style>
