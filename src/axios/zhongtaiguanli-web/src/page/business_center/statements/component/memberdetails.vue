<template>
  <div>
    <!-- 筛选项 -->
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit" width="100px" :mdSpan="6" :flexFlag="true">
      <div class="component_title2">筛选项</div>
      <el-col :md="6" :sm="12">
        <el-form-item label="筛选部门" prop="department_id">
          <SelectCustomize :value="departmentInfo" @changeScope="changeProjectTeam" @clearData="getOrderFiltrate"
            :data="department_id" />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="筛选项目组" prop="group_id">
          <SelectCustomize :value="groupIdInfo" @changeScope="changeApp" @clearData="getOrderFiltrate"
            :data="group_id" />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="筛选项目" prop="project">
          <SelectCustomize :value="projectInfo" @changeScope="changeArticle" @clearData="getOrderFiltrate"
            :data="article_id" />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="筛选应用" prop="appid">
          <SelectCustomize :value="appidInfo" @changeScope="changeAppid" @clearData="getOrderFiltrate" :data="apps" />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="筛选系统" prop="system">
          <SelectCustomize :value="systemInfo" @changeScope="changeSystem" :data="systemIds" />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="收入渠道" prop="income">
          <!-- <SelectCustomize
            :value="incomeInfo"
            :data="incomeIds"
            @changeScope="changeIncome"
            @clearData="changePay"
          /> -->
          <SelectChannel v-model="searchForm.channel" @input="changeIncome" :appId="searchForm.appid"></SelectChannel>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="是否首单" prop="income">
          <el-select v-model="searchForm.is_first" placeholder="请选择">
            <el-option v-for="item in ifirstorderIds" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="支付方式" prop="payment">
          <SelectCustomize :value="paymentInfo" :data="paymentIds" @changeScope="changePayment"
            @clearData="changePath" />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="购买路径" prop="form_path">
          <el-cascader v-model="form_pathInfo" @change="changeform_path" :options="form_pathIds" :props="{
            multiple: true,
            value: 'id',
            label: 'title',
          }" filterable collapse-tags :disabled="form_pathFlag"></el-cascader>
          <el-tooltip class="dark_item" effect="dark" placement="right-start" v-if="form_pathFlag">
            <div slot="content" class="tooltip-content" v-html="'请选择单个应用解除禁用'"></div>
            <i class="el-icon-info"></i>
          </el-tooltip>
        </el-form-item>
      </el-col>
      <el-col :md="6" :lg="6" :sm="12">
        <el-form-item label="筛选时间">
          <dataPicker :datevalue.sync="searchForm.time"></dataPicker>
        </el-form-item>
      </el-col>
      <el-button @click="initFrom" slot="btn-option">重置筛选</el-button>
    </FilterLayout>
    <!-- 会员付费表情况 -->
    <TableLayout :column="changeColumn1" :data="tableData2.data" :total="tableData2.total" :loading="tableData2.loading"
      :currentPage="tableOpt2.currentPage" :params="outPamrms" :paramsType="memberpayTypesActive" :leadOut="true" 
      :defaultSort="sort2" alignStyle="center" :leadoutList="true" leadApi="Business/orderPay" @pageChange="onPageChange2 "
      @sizeChange="onSizeChange2" @sortChange="onSortChange2" v-if="checkList.indexOf(42) >= 0">
      <div class="component_title" slot="title">
        会员付费情况表
        <el-tooltip class="item" effect="dark" placement="right-start">
          <div slot="content" class="tooltip-content" v-html="
            memberpayTypesActive == 1
              ? user_tooltiptext1
              : memberpayTypesActive == 2
                ? user_tooltiptext2
                : memberpayTypesActive == 3
                  ? user_tooltiptext3
                  : user_tooltiptext1
          "></div>
          <i class="el-icon-info"></i>
        </el-tooltip>
      </div>
      <div slot="table-option" class="Tab_box">
        <div class="left_box">
          <span class="font14">数据维度（多选）</span>
          <el-select v-model="group" placeholder="全部渠道" :popper-append-to-body="false" :reserve-keyword="true"
            filterable multiple collapse-tags @change="changeTable">
            <div class="check-all">
              <el-checkbox v-model="all" @input="changeDimensional">全部勾选</el-checkbox>
            </div>
            <el-option v-for="(v, i) in dimensionalData" :key="i" :value="v.value" :label="v.title" :disabled="
              group.length == 1 && group[0] == v.value ? true : false
            " />
          </el-select>
          <el-checkbox style="margin-left: 20px" v-model="memberflexFlag" @input="memberchangeTableList">冻结维度项
          </el-checkbox>
        </div>
        <TransferDialog :data1="paramDetailData.showField" :key="tabkey" :data2="paramDetailData.hiddenField"
          @paramSave="paramSave" @initData="initData" transferCard="huiyuan" ref="transfer"
          :postParams="customFieldParams" postApi="Business/paramDetail" @moveItem="moveItem"
          :huiyuanType="memberpayTypesActive">
          <div class="table-tabs" slot="navtabs">
            <span class="items" :class="memberpayTypesActiveTab == k.id ? 'active' : ''" v-for="k in memberpayTypes"
              :key="k.id" @click="memberpayTypeClickTabs(k.id)">
              {{ k.label }}
            </span>
          </div>
        </TransferDialog>
      </div>
      <!-- tabs -->
      <div class="table-tabs" slot="tabs">
        <span class="items" :class="memberpayTypesActive == k.id ? 'active' : ''" v-for="k in memberpayTypes"
          :key="k.id" @click="memberpayTypeClick(k.id)">
          {{ k.label }}
        </span>
      </div>
    </TableLayout>

    <!-- 订单套餐情况表 -->
    <TableLayout :column="changeColumn" tableType="multilLevelHeader" :childColumn="childColumn" :data="tableData.data"
      :total="tableData.total" :loading="tableData.loading" :currentPage="tableOpt.currentPage" :params="outPamrms"
      :paramsType="orderpackageActive" :leadOut="true" alignStyle="center" :leadoutList="true"
      leadApi="Business/orderPlan" :defaultSort="sort" @pageChange="onPageChange" @sizeChange="onSizeChange" @sortChange="onSortChange"
      v-if="checkList.indexOf(43) >= 0" :childList="true">
      <div class="component_title" slot="title">
        订单套餐情况表
        <el-tooltip class="item" effect="dark" placement="right-start">
          <div slot="content" class="tooltip-content" v-html="
            orderpackageActive == 1
              ? order_tooltiptext1
              : orderpackageActive == 2
                ? order_tooltiptext2
                : orderpackageActive == 3
                  ? order_tooltiptext3
                  : order_tooltiptext1
          "></div>
          <i class="el-icon-info"></i>
        </el-tooltip>
      </div>
      <div slot="table-option" class="Tab_box">
        <div class="left_box">
          <el-checkbox style="margin-left: 20px" v-model="orderflexFlag">冻结维度项</el-checkbox>
        </div>
      </div>
      <!-- tabs -->
      <div class="table-tabs" slot="tabs">
        <span class="items" :class="orderpackageActive == k.id ? 'active' : ''" v-for="k in orderpackageTypes"
          :key="k.id" @click="orderpackageTypeClick(k.id)">
          {{ k.label }}
        </span>
      </div>
    </TableLayout>
  </div>
</template>

<script>
import moment from "moment";
import store from "store2";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import SelectCustomize from "@/component/select-customize";
import TransferDialog from "@/layout/transferDialog";
import { Mydata } from "../mixins/memberdetails.js";
import SelectChannel from "@/component/select-channel-huiyuan";


export default {
  mixins: [Mydata],
  components: {
    FilterLayout,
    SelectCustomize,
    TableLayout,
    TransferDialog,
    SelectChannel,
  },
  props: {
    checkList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tabkey: 1,
      form_pathFlag: false,
      form_pathIds: [],
      form_pathInfo: [],
      searchForm: {
        //筛选项
        project: [],
        appid: [],
        system: [],
        department_id: [],
        group_id: [],
        is_first: "",
        origin: [],
        pay_way: [],
        from_path: [],
        time: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
      },
      tableData: {
        data: [],
        total: 0,
        currentPage: 1,
        pageSize: 10,
        loading: false,
      },
      tableOpt: {
        currentPage: 1,
      },
      tableData2: {
        data: [{}],
        total: 0,
        currentPage: 1,
        pageSize: 10,
        loading: false,
      },
      tableOpt2: {
        currentPage: 1,
      },
      memberpayTypesActive: 1,
      memberpayTypesActiveTab: 1,
      previousMemberpayTypesActiveTab: 1,
      orderpackageActive: 1,
      paramDetailData1: {},
      paramDetailData2: {},
      paramDetailData3: {},
      paramDetailDataList: {},
      orderpackageTypes: [
        {
          label: "整体订单占比情况",
          id: 1,
        },
        {
          label: "新用户订单占比情况",
          id: 2,
        },
        {
          label: "老用户订单占比情况",
          id: 3,
        },
      ],
      memberpayTypes: [
        {
          label: "整体会员付费情况",
          id: 1,
        },
        {
          label: "新用户付费情况",
          id: 2,
        },
        {
          label: "老用户付费情况",
          id: 3,
        },
      ],
      dimensionalData: [
        {
          title: "时间",
          value: 1000,
        },
        {
          title: "应用",
          value: 1004,
        },
        {
          title: "系统",
          value: 1005,
        },
        {
          title: "渠道",
          value: 1013,
        },
        {
          title: "支付方式",
          value: 1015,
        },
        {
          title: "订单路径",
          value: 1016,
        },
      ],
      group: [1000],
      department_id: [],
      group_id: [],
      article_id: [],
      apps: [],
      changeCheckList: [],
      incomeIds: [],
      paymentIds: [],
      fromPathIds: [],
      all: false,
      orderflexFlag: false,
      memberflexFlag: false,
      ifirstorderIds: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "1",
          label: "是",
        },
        {
          value: "0",
          label: "否",
        },
      ],
      paramDetailData: {
        showField: [],
        hiddenField: [],
      },
      incomevalue: "",
      departmentInfo: {
        appInfo: [],
      },
      groupIdInfo: {
        appInfo: [],
      },
      projectInfo: {
        appInfo: [],
      },
      appidInfo: {
        appInfo: [],
      },
      systemInfo: {
        appInfo: [],
      },
      incomeInfo: {
        appInfo: [],
      },
      paymentInfo: {
        appInfo: [],
      },
      fromPathInfo: {
        appInfo: [],
      },
      sort: {
        prop: "",
        order: "",
      },
      sort2: {
        prop: "",
        order: "",
      },
      sumList: [],
      avgList: [],
      sumList2: [],
      avgList2: [],
      transFlag: true,
    };
  },
  computed: {
    customFieldParams() {
      return {
        cate: 4,
        timeStart: this.searchForm["time"][0],
        timeEnd: this.searchForm["time"][1],
        third_cate: this.memberpayTypesActiveTab,
        appId: undefined
      }
    },
    outPamrms() {
      const { searchForm, group, tableOpt } = this;
      return {
        ...searchForm,
        ...tableOpt,
        group: group.sort(function (a, b) {
          return a - b;
        }),
      };
    },
    childColumn() {
      let column = [];
      let arr = JSON.parse(JSON.stringify(this.column));
      if (this.orderpackageActive == 2) {
        arr.forEach((item) => {
          if (item.label !== "") {
            item.children.map((_item) => {
              _item.label = "新用户" + _item.label;
              column.push(_item);
              return _item;
            });
          } else {
            item.children.map((_item) => {
              _item.label = _item.label;
              column.push(_item);
              return _item;
            });
          }
        });
      } else if (this.orderpackageActive == 3) {
        arr.forEach((item) => {
          if (item.label !== "") {
            item.children.map((_item) => {
              _item.label = "老用户" + _item.label;
              column.push(_item);
              return _item;
            });
          } else {
            item.children.map((_item) => {
              _item.label = _item.label;
              column.push(_item);
              return _item;
            });
          }
        });

        arr;
      } else {
        arr.forEach((item) => {
          item.children.forEach((_item) => {
            column.push(_item);
          });
        });
      }
      return column;
    },
    changeColumn() {
      let all = {};
      let mean = {};
      let arr = JSON.parse(JSON.stringify(this.column));
      arr.forEach((item) => {
        item.children.forEach((_item) => {
          all[_item.prop] = this.sumList[_item.prop];
          mean[_item.prop] = this.avgList[_item.prop];
          if (_item.prop == "date" || _item.prop == "week") {
            if (this.orderflexFlag) {
              item.fixed = "left";
            } else {
              item.fixed = false;
            }
          }
        });
      });
      all["date"] = "总计";
      mean["date"] = "均值";
      console.log(this.tableData.data[0]);
      if (this.tableData.data[0] && this.tableData.data[0]["date"] != "总计") {
        this.tableData.data = [all, mean, ...this.tableData.data];
      }
      if (this.orderpackageActive == 2) {
        arr.forEach((item) => {
          if (item.label !== "") {
            item.children.map((_item) => {
              _item.label = "新用户" + _item.label;
              return _item;
            });
          } else {
            item.children.map((_item) => {
              _item.label = "" + _item.label;
              return _item;
            });
          }
        });
        console.log(arr);
        return arr;
      } else if (this.orderpackageActive == 3) {
        arr.forEach((item) => {
          if (item.label !== "") {
            item.children.map((_item) => {
              _item.label = "老用户" + _item.label;
              return _item;
            })
          } else {
            item.children.map((_item) => {
              _item.label = "" + _item.label;
              return _item;
            });
          }
        });
        console.log(arr);
        return arr;
      } else {
        return arr;
      }
    },
    changeColumn1() {
      let column;
      if (this.memberpayTypesActive == 2) {
        column = this.column2;
      } else if (this.memberpayTypesActive == 3) {
        column = this.column3;
      } else {
        column = this.column1;
      }
      let arr = [];
      let columu = [
        {
          label: "时间",
          prop: "date",
          value: 1000,
        },
        {
          label: "应用",
          prop: "appid",
          value: 1004,
        },
        {
          label: "系统",
          prop: "system",
          value: 1005,
        },
        {
          label: "渠道",
          prop: "origin",
          value: 1013,
        },
        {
          label: "支付方式",
          prop: "pay_way",
          value: 1015,
        },
        {
          label: "订单路径",
          prop: "from_path",
          value: 1016,
        },
      ];
      let all = {};
      let mean = {};
      let weekFlag = false;
      if (this.group.length) {
        this.group.forEach((item) => {
          columu.forEach((_item) => {
            if (_item.value == item) {
              if (this.memberflexFlag) {
                _item.fixed = "left";
              } else {
                _item.fixed = "";
              }
              arr.push(_item);
            }
            if (_item.value == item && _item.prop == "date") {
              if (this.memberflexFlag) {
                arr.push({
                  label: "星期",
                  prop: "week",
                  fixed: "left",
                });
              } else {
                arr.push({
                  label: "星期",
                  prop: "week",
                });
              }
              weekFlag = true;
            }
            if (item == 1000) {
            }
          });
        });
      } else {
        arr = [...columu];
      }
      all[arr[0].prop] = "总计";
      mean[arr[0].prop] = "均值";
      this.paramDetailDataList.showField.forEach((item) => {
        column.forEach((_item) => {
          if (item.value == _item.label) {
            all[_item.prop] = this.sumList2[_item.prop];
            mean[_item.prop] = this.avgList2[_item.prop];
            arr.push({
              label: item.value,
              prop: _item.prop,
              sortable: _item.sortable,
            });
          }
        });
      });
      if (
        this.tableData2.data[0] &&
        this.tableData2.data[0][arr[0].prop] != "总计"
      ) {
        this.tableData2.data = [all, mean, ...this.tableData2.data];
      }
      this.tableData2.data.forEach((item) => {
        if (item.date != "总计" && item.date != "均值" && weekFlag) {
          item.week = moment(item.date).format("dddd");
        }
      });
      return arr;
    },
  },
  mounted() { },
  methods: {
    // 模板设置
    getDashboardSetting() {
      // this.getAdApp();
      // this.getParamList();
      // this.getDashboard();
      // this.funnelEach();
      // this.getOrderPlan();
      this.getParamDetail();
      this.getParamDetailForList()
      this.getRoleBtree();
      // this.fetchCount();
      this.getOrderFiltrate();
      this.getOrderPlan();
      this.getOrderPay();
      console.log(this.checkList, 666);
    },
    // 获取app部门分组
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
      this.article_id = article_id_arr;
    },
    initFrom() {
      this.departmentInfo.appInfo = [];
      this.groupIdInfo.appInfo = [];
      this.projectInfo.appInfo = [];
      this.appidInfo.appInfo = [];
      this.systemInfo.appInfo = [];
      this.incomeInfo.appInfo = [];
      this.paymentInfo.appInfo = [];
      this.fromPathInfo.appInfo = [];
      this.searchForm = {
        //筛选项
        project: [],
        appid: [],
        system: [],
        department_id: [],
        group_id: [],
        is_first: "",
        origin: [],
        pay_way: [],
        from_path: [],
        time: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
      };
    },
    onSubmit() {
      this.tableOpt.currentPage = 1;
      this.tableOpt2.currentPage = 1;
      this.getOrderPlan();
      this.getOrderPay();
    },
    changeProjectTeam(val) {
      this.searchForm.department_id = val.appInfo;
      this.searchForm.group_id = [];
      this.searchForm.appid = [];
      this.searchForm.project = [];
      this.searchForm.from_path = [];
      this.searchForm.pay_way = [];
      this.searchForm.origin = [];
      this.groupIdInfo.appInfo = [];
      this.projectInfo.appInfo = [];
      this.appidInfo.appInfo = [];
      this.incomeInfo.appInfo = [];
      this.paymentInfo.appInfo = [];
      this.fromPathInfo.appInfo = [];
      let group_id_arr = [];
      let apps_arr = [];
      let article_id_arr = [];
      this.searchForm.department_id.forEach((item) => {
        this.department_id.forEach((_item) => {
          if (item == _item.id) {
            group_id_arr = [..._item.node, ...group_id_arr];
            _item.node.forEach((__item) => {
              article_id_arr.push(...__item.node);
              __item.node.forEach((item_) => {
                apps_arr.push(...item_.node);
              });
            });
          }
        });
      });
      this.group_id = [...group_id_arr];
      this.article_id = [...article_id_arr];
      this.apps = apps_arr;
      if (!val.appInfo.length) {
        this.getRoleBtree();
      }
      if (val && val.appInfo.length == 0) {
        this.searchForm.department_id = [];
        return;
      }
      this.getOrderFiltrate();
    },
    // 改变app与部门
    changeApp(val) {
      this.searchForm.group_id = val.appInfo;
      this.searchForm.appid = [];
      this.searchForm.project = [];
      this.searchForm.from_path = [];
      this.searchForm.pay_way = [];
      this.searchForm.origin = [];
      this.projectInfo.appInfo = [];
      this.appidInfo.appInfo = [];
      this.incomeInfo.appInfo = [];
      this.paymentInfo.appInfo = [];
      this.fromPathInfo.appInfo = [];
      let apps_arr = [];
      let article_id_arr = [];
      if (this.searchForm.group_id.length) {
        this.searchForm.group_id.forEach((item) => {
          this.department_id.forEach((_item) => {
            _item.node.forEach((__item) => {
              if (item == __item.id) {
                article_id_arr.push(...__item.node);
                __item.node.forEach((item_) => {
                  apps_arr.push(...item_.node);
                });
              }
            });
          });
        });
      } else {
        this.group_id.forEach((item) => {
          this.department_id.forEach((_item) => {
            _item.node.forEach((__item) => {
              if (item.id == __item.id) {
                article_id_arr.push(...__item.node);
                __item.node.forEach((item_) => {
                  apps_arr.push(...item_.node);
                });
              }
            });
          });
        });
      }
      this.apps = apps_arr;
      this.article_id = [...article_id_arr];
      if (val && val.appInfo.length == 0) {
        this.searchForm.group_id = [];
        return;
      }
      this.getOrderFiltrate();
    },
    // 改变项目
    changeArticle(val) {
      this.searchForm.project = val.appInfo;
      this.searchForm.appid = [];
      this.searchForm.from_path = [];
      this.searchForm.pay_way = [];
      this.searchForm.origin = [];
      this.appidInfo.appInfo = [];
      this.incomeInfo.appInfo = [];
      this.paymentInfo.appInfo = [];
      this.fromPathInfo.appInfo = [];
      let apps_arr = [];
      if (this.searchForm.project.length) {
        this.searchForm.project.forEach((item) => {
          this.department_id.forEach((_item) => {
            _item.node.forEach((__item) => {
              __item.node.forEach((item_) => {
                if (item == item_.id) {
                  apps_arr.push(...item_.node);
                }
              });
            });
          });
        });
      } else {
        this.article_id.forEach((item) => {
          apps_arr.push(...item.node);
        });
      }

      this.apps = apps_arr;
      if (val && val.appInfo.length == 0) {
        this.searchForm.project = [];
        return;
      }
      this.getOrderFiltrate();
    },
    changeAppid(val) {
      this.searchForm.from_path = [];
      this.searchForm.pay_way = [];
      this.searchForm.origin = [];
      this.incomeInfo.appInfo = [];
      this.paymentInfo.appInfo = [];
      this.fromPathInfo.appInfo = [];
      this.searchForm.channel = [];
      this.searchForm.appid = val.appInfo;
      if (val.appInfo.length == 1) {
        this.form_pathFlag = false;
      } else {
        this.searchForm.from_path_one = []
        this.searchForm.from_path_two = []
        this.searchForm.from_path_three = []
        this.form_pathFlag = true;
      }
      if (val && val.appInfo.length == 0) {
        this.searchForm.appid = [];
        return;
      }
      this.getOrderFiltrate();
    },
    changeSystem(val) {
      this.searchForm.system = val.appInfo;
    },
    changeform_path(val) {
      if (val.length == 0) {
        this.searchForm.from_path_one = []
        this.searchForm.from_path_two = []
        this.searchForm.from_path_three = []
      } else {
        let arr = [[], [], []];
        val.forEach((item) => {
          item.forEach((_item, index) => {
            arr[index].push(_item);
          });
        });
        console.log(arr);
        this.searchForm.from_path_one = arr[0];
        this.searchForm.from_path_two = arr[1];
        this.searchForm.from_path_three = arr[2];
      }
    },
    // 获取支付方式 收入渠道
    async getOrderFiltrate() {
      const [err, res] = await this.$http.post("Business/orderFiltrate", {
        ...this.searchForm,
        timeStart: this.searchForm.time[0],
        timeEnd: this.searchForm.time[1],
        appId: undefined
      });
      if (err) {
        return;
      }
      res.forEach((item) => {
        if (item.id == 1013) {
          this.incomeIds = [...item.children];
        } else if (item.id == 1015) {
          this.paymentIds = [...item.children];
        } else if (item.id == 1016) {
          this.form_pathIds = [...item.children];
        }
      });
    },
    onPageChange(current) {
      this.tableOpt.currentPage = current;
      this.getOrderPlan();
    },
    onSizeChange(current) {
      this.tableOpt.pageSize = current;
      this.getOrderPlan();
    },
    onSortChange(data) {
      const { prop, order } = data;
      this.sort = { prop, order };
      this.tableOpt.currentPage = 1;
      this.getOrderPlan();
    },
    onPageChange2(current) {
      this.tableOpt2.currentPage = current;
      this.getOrderPay();
    },
    onSizeChange2(current) {
      this.tableOpt2.pageSize = current;
      this.getOrderPay();
    },
    onSortChange2(data) {
      console.log(data);
      const { prop, order } = data;
      this.sort2 = { prop, order };
      this.tableOpt2.currentPage = 1;
      this.getOrderPay();
    },
    async changeIncome(val) {
      this.searchForm.origin = val
      this.searchForm.from_path = [];
      this.searchForm.pay_way = [];
      this.paymentInfo.appInfo = [];
      this.fromPathInfo.appInfo = [];
      if (val && val.length == 0) {
        this.searchForm.origin = [];
        return;
      }
      const [err, res] = await this.$http.post("Business/orderFiltrate", {
        ...this.searchForm,
        timeStart: this.searchForm.time[0],
        timeEnd: this.searchForm.time[1],
        appId: undefined
      });
      if (err) {
        return;
      }
      res.forEach((item) => {
        if (item.id == 1015) {
          this.paymentIds = [...item.children];
        } else if (item.id == 1016) {
          this.fromPathIds = [...item.children];
        }
      });
    },
    async changePay(val) {
      this.searchForm.origin = [];
      this.searchForm.from_path = [];
      this.searchForm.pay_way = [];
      this.paymentInfo.appInfo = [];
      this.fromPathInfo.appInfo = [];
      const [err, res] = await this.$http.post("Business/orderFiltrate", {
        ...this.searchForm,
        timeStart: this.searchForm.time[0],
        timeEnd: this.searchForm.time[1],
        appId: undefined
      });
      if (err) {
        return;
      }
      res.forEach((item) => {
        if (item.id == 1015) {
          this.paymentIds = [...item.children];
        } else if (item.id == 1016) {
          this.fromPathIds = [...item.children];
        }
      });
    },
    async changePayment(val) {
      this.searchForm.pay_way = val.appInfo;
      this.searchForm.from_path = [];
      this.fromPathInfo.appInfo = [];
      if (val && val.appInfo.length == 0) {
        this.searchForm.pay_way = [];
        return;
      }
      const [err, res] = await this.$http.post("Business/orderFiltrate", {
        ...this.searchForm,
        timeStart: this.searchForm.time[0],
        timeEnd: this.searchForm.time[1],
        appId: undefined
      });
      if (err) {
        return;
      }
      res.forEach((item) => {
        if (item.id == 1016) {
          this.fromPathIds = [...item.children];
        }
      });
    },
    async changePath(val) {
      this.searchForm.pay_way = [];
      this.searchForm.from_path = [];
      this.fromPathInfo.appInfo = [];
      const [err, res] = await this.$http.post("Business/orderFiltrate", {
        ...this.searchForm,
        timeStart: this.searchForm.time[0],
        timeEnd: this.searchForm.time[1],
        appId: undefined
      });
      if (err) {
        return;
      }
      res.forEach((item) => {
        if (item.id == 1016) {
          this.fromPathIds = [...item.children];
        }
      });
    },
    changeFromPath(val) {
      this.searchForm.from_path = val.appInfo;
      if (val && val.appInfo.length == 0) {
        this.searchForm.from_path = [];
        return;
      }
    },
    // 获取订单套餐情况表数据
    async getOrderPlan() {
      this.tableData.loading = true;
      const { searchForm, group, tableOpt, sort } = this;
      const [err, res] = await this.$http.post("Business/orderPlan", {
        ...searchForm,
        ...tableOpt,
        ...sort,
        type: this.orderpackageActive,
        timeStart: searchForm.time[0],
        timeEnd: searchForm.time[1],
        appId: undefined
      });
      if (err) {
        this.tableData.loading = false;
        return;
      }
      this.tableData.loading = false;
      const { list, avg_list, sum_list, currentPage, total } = res;
      let arr = list.map((item) => {
        item.week = moment(item.date).format("dddd");
        return item;
      });
      list.forEach((item) => {
        for (const key in item) {
          if (this.keyArr.indexOf(key) >= 0 && item[key]) {
            item[key] = (item[key] * 100).toFixed(2) + "%";
          }
          if (this.numKeyArr.indexOf(key) >= 0 && item[key]) {
            item[key] = parseFloat(item[key]).toLocaleString();
          }
        }
      });
      for (const key in sum_list) {
        if (this.keyArr.indexOf(key) >= 0 && sum_list[key]) {
          sum_list[key] = (sum_list[key] * 100).toFixed(2) + "%";
        }
        if (this.numKeyArr.indexOf(key) >= 0 && sum_list[key]) {
          sum_list[key] = parseFloat(sum_list[key]).toLocaleString();
        }
      }
      for (const key in avg_list) {
        if (this.keyArr.indexOf(key) >= 0 && avg_list[key]) {
          avg_list[key] = (avg_list[key] * 100).toFixed(2) + "%";
        }
        if (this.numKeyArr.indexOf(key) >= 0 && avg_list[key]) {
          avg_list[key] = parseFloat(avg_list[key]).toLocaleString();
        }
      }
      this.tableData.data = arr;
      this.tableData.currentPage = currentPage;
      this.tableData.total = total;
      this.sumList = sum_list;
      this.avgList = avg_list;
    },
    // 获取会员付费情况表
    async getOrderPay() {
      this.tableData2.loading = true;
      const { searchForm, group, tableOpt2, sort2 } = this;
      const [err, res] = await this.$http.post("Business/orderPay", {
        ...searchForm,
        ...tableOpt2,
        ...sort2,
        type: this.memberpayTypesActive,
        group: group.sort(function (a, b) {
          return a - b;
        }),
        timeStart: searchForm.time[0],
        timeEnd: searchForm.time[1],
        appId: undefined
      });
      if (err) {
        this.tableData2.loading = false;
        return;
      }
      this.tableData2.loading = false;
      const { list, avg_list, sum_list, currentPage, total } = res;
      list.forEach((item) => {
        for (const key in item) {
          if (this.keyArr.indexOf(key) >= 0 && item[key]) {
            item[key] = (item[key] * 100).toFixed(2) + "%";
          }
          if (this.numKeyArr.indexOf(key) >= 0 && item[key]) {
            item[key] = parseFloat(item[key]).toLocaleString();
          }
        }
      });

      for (const key in sum_list) {
        if (this.keyArr.indexOf(key) >= 0 && sum_list[key]) {
          sum_list[key] = (sum_list[key] * 100).toFixed(2) + "%";
        }
        if (this.numKeyArr.indexOf(key) >= 0 && sum_list[key]) {
          sum_list[key] = parseFloat(sum_list[key]).toLocaleString();
        }
      }
      for (const key in avg_list) {
        if (this.keyArr.indexOf(key) >= 0 && avg_list[key]) {
          avg_list[key] = (avg_list[key] * 100).toFixed(2) + "%";
        }
        if (this.numKeyArr.indexOf(key) >= 0 && avg_list[key]) {
          avg_list[key] = parseFloat(avg_list[key]).toLocaleString();
        }
      }

      this.tableData2.data = list;
      this.tableData2currentPage = currentPage;
      this.tableData2.total = total;
      this.sumList2 = sum_list;
      this.avgList2 = avg_list;
    },
    // 获取字段
    async getParamDetail() {
      for (let i = 1; i < 4; i++) {
        const [err, res] = await this.$http.post("Business/paramDetail", {
          cate: 4,
          timeStart: this.searchForm["time"][0],
          timeEnd: this.searchForm["time"][1],
          third_cate: i,
          appId: undefined
        });
        if (err) return;
        res.showField.forEach((item) => {
          item.isSelect = false;
        });
        res.hiddenField.forEach((item) => {
          item.isSelect = false;
        });
        this[`paramDetailData${i}`] = res;
      }
      this.memberpayTypesActiveTab = 1
      this.paramDetailData = this[`paramDetailData1`]
      // 获取列表的自定义字段，这里把自定义字段弹窗和列表分开请求
      this.getParamDetailForList();
    },
    async getParamDetailForList() {
      const [err, res] = await this.$http.post("Business/paramDetail", {
        cate: 4,
        timeStart: this.searchForm["time"][0],
        timeEnd: this.searchForm["time"][1],
        third_cate: this.memberpayTypesActiveTab,
        appId: undefined
      });
      if (err) return;
      res.showField.forEach((item) => {
        item.isSelect = false;
      });
      res.hiddenField.forEach((item) => {
        item.isSelect = false;
      });
      this.paramDetailDataList = res;
    },
    changeTable(val) {
      this.getOrderPay();
    },
    changeDimensional(val) {
      if (val) {
        this.group = [1000, 1004, 1005, 1013, 1015, 1016];
      } else {
        this.group = [1000];
      }
      this.getOrderPay();
    },
    moveItem(data) {
      const { show, hidden } = data
      let temp = {
        showField: show,
        hiddenField: hidden
      }
      this[`paramDetailData${this.memberpayTypesActiveTab}`] = temp
    },
    async paramSave() {
      this.tableData2.loading = true
      for (let i = 1; i < 4; i++) {
        let paramDetailData = this[`paramDetailData${i}`]
        let show = paramDetailData.showField.map((item) => {
          return item.field_id;
        });
        let hidden = paramDetailData.hiddenField.map((item) => {
          return item.field_id;
        });
        const [err, res] = await this.$http.post("Business/paramSave", {
          cate: 4,
          timeStart: this.searchForm["time"][0],
          third_cate: i,
          second_cate: "",
          timeEnd: this.searchForm["time"][1],
          show,
          hidden,
          appId: undefined
        });
        if (err) return;
      }
      this.getParamDetail()
      this.getOrderPay();
    },
    initData() { },
    // 自定义字段tab点击
    memberpayTypeClickTabs(id) {
      if (this.memberpayTypesActiveTab === id) return;
      this.memberpayTypesActiveTab = id;
      this.paramDetailData = this[`paramDetailData${id}`]
      this.$nextTick(() => {
        this.$refs.transfer.init()
      })
    },
    memberpayTypeClick(id) {
      if (this.memberpayTypesActive === id) return;
      this.memberpayTypesActive = id;
      this.paramDetailDataList = this[`paramDetailData${id}`]
      this.getOrderPay();
    },
    orderpackageTypeClick(id) {
      if (this.orderpackageActive === id) return;
      this.orderpackageActive = id;
      this.getOrderPlan();
    },
    memberchangeTableList() {
      if (this.memberpayTypesActive == 2) {
        this.group.forEach((item) => {
          this.column2.forEach((_item) => {
            if (_item.value == item) {
              if (this.memberflexFlag) {
                _item.fixed = "left";
              } else {
                _item.fixed = "";
              }
            }
            if (item == 1000) {
              if (this.memberflexFlag) {
                if (_item.prop == "week") {
                  _item.fixed = "left";
                }
              }
            }
          });
        });
      } else if (this.memberpayTypesActive == 3) {
        this.group.forEach((item) => {
          this.column3.forEach((_item) => {
            if (_item.value == item) {
              if (this.memberflexFlag) {
                _item.fixed = "left";
              } else {
                _item.fixed = "";
              }
            }
            if (item == 1000) {
              if (this.memberflexFlag) {
                if (_item.prop == "week") {
                  _item.fixed = "left";
                }
              }
            }
          });
        });
      } else {
        this.group.forEach((item) => {
          this.column1.forEach((_item) => {
            if (_item.value == item) {
              if (this.memberflexFlag) {
                _item.fixed = "left";
              } else {
                _item.fixed = "";
              }
            }
            if (item == 1000) {
              if (this.memberflexFlag) {
                if (_item.prop == "week") {
                  _item.fixed = "left";
                }
              }
            }
          });
        });
      }
    },
  },
};
</script>

<style scoped lang="less">
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

.table-tabs {
  padding: 20px 0;
  text-align: center;
  background: #fff;

  .items {
    position: relative;
    margin: 0 15px;
    cursor: pointer;

    &:hover {
      color: #1890ff;
    }

    &:after {
      content: "";
      width: 2px;
      height: 20px;
      background: #ccc;
      position: absolute;
      right: -10%;
      top: 50%;
      transform: translateY(-50%);
    }

    &:nth-last-child(1)::after {
      width: 0;
    }
  }
}

.active {
  color: #1890ff;
}

.Tab_box {
  display: flex;
  justify-content: space-between;
  flex: 1;

  button {
    margin-right: 20px;
  }

  .left_box {
    line-height: 40px;
    width: 1000px;

    .btns {
      margin-left: 20px;
    }
  }
}

.tooltip-content {
  line-height: 20px;
}

.dark_item {
  position: absolute;
  top: 10px;
  right: -10px;
}
</style>