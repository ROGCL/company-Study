<template>
  <div>
    <!-- 筛选项 -->
    <FilterLayout
      v-model="searchForm"
      @onSubmit="onSubmit"
      width="100px"
      ref="myForm"
      :key="formNum"
    >
      <div class="component_title2">筛选项</div>
      <el-col :md="6" :lg="6" :sm="12">
        <el-form-item label="创建日期">
          <!-- searchForm.pay_time.length || searchForm.activate_time.length -->
          <dataPicker
            :clearFlag="searchForm.pay_time.length || searchForm.activate_time.length"
            :datevalue.sync="searchForm.create_time"
            @change="create_timeChange"
          ></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="6" :lg="6" :sm="12">
        <el-form-item label="支付日期">
          <!-- searchForm.create_time.length || searchForm.activate_time.length -->
          <dataPicker
            :clearFlag="searchForm.create_time.length || searchForm.activate_time.length"
            :datevalue.sync="searchForm.pay_time"
            @change="create_timeChange"
          ></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="6" :lg="6" :sm="12">
        <el-form-item label="激活日期">
          <!-- searchForm.create_time.length || searchForm.pay_time.length -->
          <dataPicker
            :clearFlag="searchForm.create_time.length || searchForm.pay_time.length"
            :datevalue.sync="searchForm.activate_time"
            @change="create_timeChange"
          ></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="筛选应用" prop="app_id">
          <SelectCustomize
            :value="appidInfo"
            @changeScope="changeAppid"
            :data="apps"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="筛选系统" prop="system">
          <SelectCustomize
            :value="systemInfo"
            @changeScope="changeSystem"
            :data="systemIds"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="归因渠道" prop="origin">
          <!-- <SelectCustomize
            :value="originInfo"
            @changeScope="changeorigin"
            :data="originIds"
          /> -->
          <SelectChannel
            v-model="searchForm.origin"
            :appId="searchForm.app_id"
          ></SelectChannel>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="支付状态" prop="is_pay">
          <SelectCustomize
            :value="is_payInfo"
            @changeScope="changeis_pay"
            :data="is_payIds"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="支付渠道" prop="channel">
          <!-- <SelectCustomize
            :value="channelInfo"
            @changeScope="changechannel"
            :data="channelIds"
          /> -->
          <SelectChannel
            v-model="searchForm.channel"
            :appId="searchForm.app_id"
          ></SelectChannel>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="用户ID" prop="uid">
          <el-input
            v-model="searchForm.uid"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="订单号" prop="ostr">
          <el-input
            v-model="searchForm.ostr"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="交易号" prop="transcation_no">
          <el-input
            v-model="searchForm.transcation_no"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="App版本号" prop="app_version">
          <SelectCustomize
            :value="app_versionInfo"
            @changeScope="changeapp_version"
            :data="app_versionIds"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="支付方式" prop="pay_way">
          <SelectCustomize
            :value="pay_wayInfo"
            @changeScope="changepay_way"
            :data="pay_wayIds"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="商品类型" prop="goods_title">
          <SelectCustomize
            :value="goods_titleInfo"
            @changeScope="changegoods_title"
            :data="goods_titleIds"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="订单类型" prop="order_cate">
          <!-- <SelectCustomize
            :value="order_cateInfo"
            @changeScope="changeorder_cate"
            :data="order_cateIds"
          /> -->
          <el-select
            v-model="searchForm.order_cate"
            placeholder="请选择"
            :popper-append-to-body="false"
            clearable
          >
            <el-option
              v-for="(v, i) in order_cateIds"
              :key="i"
              :label="v.title"
              :value="v.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="是否首单" prop="is_first">
          <SelectCustomize
            :value="is_firstInfo"
            @changeScope="changeis_first"
            :data="is_firstIds"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="购买路径" prop="form_path">
          <el-cascader
            v-if="showCascader"
            v-model="form_pathInfo"
            @change="changeform_path"
            :options="form_pathIds"
            :props="{
              multiple: true,
              value: 'id',
              label: 'title',
            }"
            filterable
            collapse-tags
            :disabled="form_pathFlag"
          ></el-cascader>
          <el-tooltip
            class="dark_item"
            effect="dark"
            placement="right-start"
            v-if="form_pathFlag"
          >
            <div
              slot="content"
              class="tooltip-content"
              v-html="'请选择单个应用解除禁用'"
            ></div>
            <i class="el-icon-info"></i>
          </el-tooltip>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label=" " prop="is_day">
          <el-checkbox v-model="is_day">激活付费精确到天</el-checkbox>
        </el-form-item>
      </el-col>
      <el-button @click="initFrom" slot="btn-option">重置筛选</el-button>
    </FilterLayout>
    <div class="dash_board">
      <div class="dash_board_card">
        <el-col
          :lg="6"
          :md="24"
          :sm="24"
          v-for="(v, i) in frontDashBoardData"
          :key="i"
        >
          <div class="box">
            <div class="title">{{ v.title }}</div>
            <div class="money">
              {{ parseFloat(v.value).toLocaleString() }}
            </div>
          </div>
        </el-col>
      </div>
    </div>
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      :params="myData"
      @pageChange="onPageChange"
      @sizeChange="onSizeChange"
      leadApi="income/orderList"
      :leadOut="true"
      :channelFlag="true"
      alignStyle="center"
      @sortChange="onSortChange"
      author="liuqiang"
    >
    </TableLayout>
  </div>
</template>

<script>
import moment from "moment";
import store from "store2";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import SelectCustomize from "@/component/select-customize";
import SelectChannel from "@/component/select-channel-huiyuan";

export default {
  components: {
    FilterLayout,
    SelectCustomize,
    TableLayout,
    SelectChannel,
  },
  data() {
    return {
      showCascader: 1,
      is_day: false,
      pay_timeFlag: true,
      activate_timeFlag: true,
      form_pathFlag: true,
      form_pathInfo: [],
      searchForm: {
        //筛选项
        order_cate: "",
        app_id: ["11"],
        system: [],
        origin: [],
        is_pay: ["1"],
        channel: [],
        uid: "",
        transcation_no: "",
        ostr: "",
        app_version: [],
        pay_way: [],
        goods_title: [],
        is_first: [],
        form_path: [],
        is_day: 1,
        pay_time: [],
        activate_time: [],
        create_time: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(0, "d").format("YYYY-MM-DD"),
        ],
      },
      column: [
        {
          label: "app",
          prop: "app_title",
        },
        {
          label: "app版本",
          prop: "app_version",
        },
        {
          prop: "system_title",
          label: "系统",
        },
        {
          prop: "uid",
          label: "用户ID",
        },
        {
          prop: "uuid",
          label: "设备唯一标识",
          width: 300,
        },
        {
          prop: "origin",
          label: "归因渠道",
          width: 260,
        },
        {
          prop: "channel",
          label: "支付渠道",
          width: 200,
        },
        {
          prop: "aid",
          label: "广告计划AID",
          width: 200,
        },
        {
          prop: "is_pay",
          label: "支付情况",
        },
        {
          prop: "pay_way",
          label: "支付方式",
          width: 120,
        },
        {
          prop: "goods_title",
          label: "商品名称",
          width: 150,
        },
        {
          prop: "order_cate",
          label: "订单类型",
        },
        {
          prop: "from_path",
          label: "购买路径",
          width: 180,
        },
        {
          prop: "is_first",
          label: "是否首单",
        },
        {
          prop: "ostr",
          label: "订单号",
          width: 280,
        },
        {
          prop: "transcation_no",
          label: "交易号",
          width: 280,
        },
        {
          prop: "create_date",
          label: "订单创建时间",
          sortable: "custom",
          width: 160,
        },
        {
          prop: "pay_time",
          label: "支付时间",
          sortable: "custom",
          width: 160,
        },
        {
          label: "激活日期",
          prop: "activate_time",
          sortable: "custom",
          width: 160,
        },
        {
          prop: "pay_fee",
          label: "支付金额",
          sortable: "custom",
        },
      ],
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
      apps: [],
      systemIds: [
        {
          id: "1",
          title: "Android",
        },
        {
          id: "2",
          title: "ios",
        },
        {
          id: "3",
          title: "小程序",
        },
      ],
      originIds: [],
      is_payIds: [
        {
          id: "1",
          title: "已支付",
        },
        {
          id: "0",
          title: "未支付",
        },
      ],
      channelIds: [],
      app_versionIds: [],
      pay_wayIds: [
        {
          id: "3",
          title: "Apple Pay",
        },
        {
          id: "2",
          title: "支付宝",
        },
        {
          id: "1",
          title: "微信",
        },
        {
          id: "4",
          title: "QQ支付",
        },
        {
          id: "5",
          title: "卡密支付",
        },
      ],
      order_cateIds: [
        {
          id: "",
          title: "全选",
        },
        {
          id: "1",
          title: "普通订单",
        },
        {
          id: "2",
          title: "订阅订单",
        },
        {
          id: "3",
          title: "其他",
        },
      ],
      is_firstIds: [
        {
          id: "1",
          title: "是",
        },
        {
          id: "0",
          title: "否",
        },
      ],
      form_pathIds: [],
      goods_titleIds: [],
      appidInfo: {
        appInfo:[]
      },
      systemInfo: {
        appInfo: [],
      },
      originInfo: {
        appInfo: [],
      },
      is_payInfo: {
        appInfo: ["1"],
        optionList: [
          {
            id: "1",
            title: "已支付",
          },
        ],
      },
      channelInfo: {
        appInfo: [],
      },
      app_versionInfo: {
        appInfo: [],
      },
      pay_wayInfo: {
        appInfo: [],
      },
      order_cateInfo: {
        appInfo: [],
      },
      is_firstInfo: {
        appInfo: [],
      },
      goods_titleInfo: {
        appInfo: [],
      },
      frontDashBoardData: [
        {
          value: "0",
          title: "订单金额",
        },
        {
          value: "0",
          title: "订单量",
        },
        {
          value: "0",
          title: "下单人数",
        },
        {
          value: "0",
          title: "客单价",
        },
      ],
      sort: {
        prop: "",
        order: "",
      },
      formNum: 1,
    };
  },
  mounted() {
    this.getReport();
    this.getRoleBtree();
    this.getVersion();
    this.getChannel();
    this.getOrderKanban();
    this.getOrderScreening();
  },
  methods: {
    onSortChange(data) {
      const { prop, order } = data;
      this.sort = { prop, order };
      this.tableOpt.currentPage = 1;
      this.getReport();
    },
    async getReport() {
      this.tableData.loading = true;
      this.is_day
        ? (this.searchForm.is_day = "1")
        : (this.searchForm.is_day = "0");
      const { searchForm, tableOpt, sort } = this;
      const [err, res] = await this.$http.post("income/orderList", {
        ...tableOpt,
        ...searchForm,
        ...sort,
      });
      this.tableData.loading = false;
      if (err) {
        this.tableData = {
          data: [],
          total: 0,
          currentPage: 1,
          pageSize: 10,
          loading: false,
        };
        return;
      }
      const { list, currentPage, total } = res;
      for (const i of list) {
        i.app_title = i.app_title ? i.app_title.split("_")[0] : "";
      }
      this.tableData.data = list;
      this.tableData.currentPage = currentPage;
      this.tableData.total = total;
    },
    create_timeChange(val) {
      this.getOrderScreening();
      this.getVersion();
    },
    changeAppid(val) {
      this.searchForm.app_id = val.appInfo;
      if (val.appInfo.length == 1) {
        this.form_pathFlag = false;
        this.getOrderScreening();
      } else {
        this.searchForm.from_path_one = [];
        this.searchForm.from_path_two = [];
        this.searchForm.from_path_three = [];
        this.form_pathFlag = true;
      }
      this.searchForm.origin = [];
      this.searchForm.channel = [];
      this.getVersion();
    },
    changeSystem(val) {
      this.searchForm.system = val.appInfo;
    },
    changeorigin(val) {
      this.searchForm.origin = val.appInfo;
    },
    changechannel(val) {
      this.searchForm.channel = val.appInfo;
    },
    changeis_pay(val) {
      this.searchForm.is_pay = val.appInfo;
    },
    changeapp_version(val) {
      this.searchForm.app_version = val.appInfo;
    },
    changepay_way(val) {
      this.searchForm.pay_way = val.appInfo;
    },
    changeform_path(val) {
      if (val.length == 0) {
        this.searchForm.from_path_one = [];
        this.searchForm.from_path_two = [];
        this.searchForm.from_path_three = [];
      } else {
        let arr = [[], [], []];
        val.forEach((item) => {
          item.forEach((_item, index) => {
            arr[index].push(_item);
          });
        });
        this.searchForm.from_path_one = arr[0];
        this.searchForm.from_path_two = arr[1];
        this.searchForm.from_path_three = arr[2];
      }
    },
    changeis_first(val) {
      this.searchForm.is_first = val.appInfo;
    },
    changegoods_title(val) {
      this.searchForm.goods_title = val.appInfo;
    },
    onPageChange(current) {
      this.tableOpt.currentPage = current;
      this.getReport();
    },
    onSizeChange(current) {
      this.tableOpt.pageSize = current;
      this.getReport();
    },
    async getRoleBtree() {
      const [err, res] = await this.$http.post("System/roleBtree", {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
      });
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
      this.departDatas = [
        ...res.list,
        { id: 1005, title: "系统", node: [...this.systemIds] },
      ];
      let group_id = [];
      res.tree.forEach((item) => {
        item.node.forEach((_item) => {
          group_id.push(_item);
        });
      });
      this.group_id = group_id;
      let apps = [];
      let article_id_arr = [];
      res.tree.forEach((item) => {
        item.node.forEach((_item) => {
          article_id_arr.push(..._item.node);
          _item.node.forEach((__item) => {
            apps.push(...__item.node);
          });
        });
      });
      this.apps = apps;
      console.log(apps);
      this.appidInfo = {
        appInfo: [this.apps[0].id],
        optionList: [
          this.apps[0]
        ],
      }
      this.article_id = article_id_arr;
    },
    onSubmit() {
      this.tableOpt.currentPage = 1;
      this.getReport();
      this.getOrderKanban();
    },
    async getVersion() {
      const { searchForm } = this;
      const [err, res] = await this.$http.post("income/versionChannel", {
        ...searchForm,
        appId: undefined,
      });
      if (err) {
        return;
      }
      this.app_versionInfo = {
        appInfo: [],
      };
      this.app_versionIds = res.list[0].children;
      this.searchForm.app_version = [];
    },
    async getChannel() {},
    async getOrderKanban() {
      const { searchForm } = this;
      const [err, res] = await this.$http.post("income/orderKanban", {
        ...searchForm,
        appId: undefined,
      });
      if (err) {
        return;
      }
      this.frontDashBoardData[0].value = res.order_cost;
      this.frontDashBoardData[1].value = res.order_num;
      this.frontDashBoardData[3].value = res.unit_price;
      this.frontDashBoardData[2].value = res.user_num;
    },
    async getOrderScreening() {
      this.goods_titleIds = [];
      this.goods_titleInfo.appInfo = [];
      this.searchForm.goods_title = [];
      const { searchForm } = this;
      const [err, res] = await this.$http.post("income/orderScreening", {
        ...searchForm,
        appId: undefined,
      });
      if (err) {
        return;
      }
      this.goods_titleIds = res.list[0].children;
      this.form_pathIds = res.list[1].children;
      this.showCascader += 1;
    },
    initFrom() {
      this.appidInfo.appInfo = [];
      this.systemInfo.appInfo = [];
      this.originInfo.appInfo = [];
      this.is_payInfo.appInfo = [];
      this.channelInfo.appInfo = [];
      this.app_versionInfo.appInfo = [];
      this.pay_wayInfo.appInfo = [];
      this.order_cateInfo.appInfo = [];
      this.goods_titleInfo.appInfo = [];
      this.is_firstInfo.appInfo = [];
      this.is_day = false;
      this.searchForm = {
        //筛选项
        order_cate: "",
        app_id: ["11"],
        system: [],
        origin: [],
        is_pay: ["1"],
        channel: [],
        uid: "",
        ostr: "",
        transcation_no: "",
        app_version: [],
        pay_way: [],
        goods_title: [],
        is_first: [],
        form_path: [],
        is_day: 1,
        /* pay_time: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
        activate_time: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ], */
      };
      this.searchForm.pay_time = [];
      this.searchForm.activate_time = [];
      this.searchForm.create_time = [
        moment().subtract(7, "d").format("YYYY-MM-DD"),
        moment().subtract(0, "d").format("YYYY-MM-DD"),
      ];
      this.formNum += 1;
    },
  },
  computed: {
    myData() {
      return {
        ...this.searchForm,
        leadeOutType: 1,
        currentPage: this.tableOpt.currentPage,
        pageSize: 5000,
      };
    },
  },
};
</script>

<style lang="less" scoped>
.component_title2 {
  background: #fff;
  padding: 1px 0 10px 15px;
  font-weight: bold;
}

.component_title {
  background: #fff;
  padding: 20px 0 10px 15px;
  font-weight: bold;
}

.dash_board {
  margin: 20px 0;
  background: #fff;
  min-height: 118px;

  .box {
    border-radius: 4px;
    border: 1px solid #ebebeb;
    text-align: center;
    padding: 20px 0;
    margin: 15px 7px;
    box-sizing: border-box;

    &:hover {
      background: #fff7ed;
      border: 1px solid #ffc580;
    }

    .title {
      font-size: 12px;
    }

    .money {
      font-size: 18px;
      font-weight: bold;
    }

    .up {
      color: #ea5454;
    }

    .down {
      color: #17bf5e;
    }

    .per {
      display: flex;
      justify-content: space-around;
      height: 40px;
      margin-top: 8px;

      div {
        vertical-align: middle;
        font-size: 12px;
        height: 25px;
      }
    }
  }
}

.dash_board_card {
  height: 100px;
}

.dark_item {
  position: absolute;
  top: 10px;
  right: -10px;
}
</style>
