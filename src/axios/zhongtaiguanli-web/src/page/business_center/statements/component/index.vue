<template>
  <div>
    <!-- 筛选项 -->
    <FilterLayout
      v-model="searchForm"
      @onSubmit="onSubmit"
      width="100px"
      :mdSpan="6"
      :flexFlag="true"
    >
      <div class="component_title2">筛选项</div>
      <el-col :md="6" :sm="12">
        <el-form-item label="筛选部门" prop="department_id">
          <SelectCustomize
            :value="departmentInfo"
            @changeScope="changeProjectTeam"
            :data="department_id"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="筛选项目组" prop="group_id">
          <SelectCustomize
            :value="groupIdInfo"
            @changeScope="changeApp"
            :data="group_id"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="筛选项目" prop="project">
          <SelectCustomize
            :value="projectInfo"
            @changeScope="changeArticle"
            :data="article_id"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="筛选应用" prop="appid">
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
        <el-form-item label="时间维度" prop="timeType">
          <el-select
            v-model="searchForm.timeType"
            placeholder="请选择"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="(v, i) in timeType"
              :key="i"
              :label="v.title"
              :value="v.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="6" :lg="6" :sm="12">
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
            unlink-panels
          /> -->
          <dataPicker :datevalue.sync="searchForm.time"></dataPicker>
        </el-form-item>
      </el-col>
      <el-button @click="initFrom" slot="btn-option">重置筛选</el-button>
    </FilterLayout>
    <!-- 指示看板 -->
    <div class="dash_board" v-if="this.checkList.indexOf(34) >= 0">
      <div class="component_title">指示看板</div>
      <div class="dash_board_card">
        <el-col
          :lg="4"
          :md="24"
          :sm="24"
          v-for="(v, i) in frontDashBoardData"
          :key="i"
        >
          <div class="box">
            <div class="title">{{ v.title }}</div>
            <div class="money">
              {{
                titleArr.indexOf(v.title) !== -1 ? v.value : `￥${v.value}元`
              }}
            </div>
            <div class="per">
              <div>
                <div>环比</div>
                <div>差值</div>
              </div>
              <div class="rig_font">
                <div
                  :class="
                    v.per.indexOf('-') >= 0
                      ? 'down'
                      : v.per == '0.00%'
                      ? ''
                      : 'up'
                  "
                >
                  {{ v.per }}
                  <i
                    :class="
                      v.per.indexOf('-') >= 0
                        ? 'el-icon-caret-bottom'
                        : v.per == '0.00%'
                        ? 'a'
                        : 'el-icon-caret-top'
                    "
                  ></i>
                </div>
                <div
                  :class="
                    v.dif.indexOf('-') >= 0
                      ? 'down'
                      : v.dif == '0.00' || v.dif == '0.00%' || v.dif == '0.0000'
                      ? 'a'
                      : 'up'
                  "
                >
                  {{
                    ["昨日毛利率", "本年累计毛利率"].indexOf(v.title) !== -1
                      ? v.dif
                      : `${v.dif}元`
                  }}
                  <i
                    :class="
                      v.per.indexOf('-') >= 0
                        ? 'el-icon-caret-bottom'
                        : v.per == '0.00%'
                        ? 'a'
                        : 'el-icon-caret-top'
                    "
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </div>
      <div class="dash_board_card">
        <el-col
          :lg="4"
          :md="24"
          :sm="24"
          v-for="(v, i) in behindDashBoardData"
          :key="i"
        >
          <div class="box">
            <div class="title">{{ v.title }}</div>
            <div class="money">
              {{
                titleArr.indexOf(v.title) !== -1 ? v.value : `￥${v.value}元`
              }}
            </div>
            <div class="per">
              <div>
                <div>环比</div>
                <div>差值</div>
              </div>
              <div class="rig_font">
                <div
                  :class="
                    v.per.indexOf('-') >= 0
                      ? 'down'
                      : v.per == '0.00%'
                      ? ''
                      : 'up'
                  "
                >
                  {{ v.per }}
                  <i
                    :class="
                      v.per.indexOf('-') >= 0
                        ? 'el-icon-caret-bottom'
                        : v.per == '0.00%'
                        ? ''
                        : 'el-icon-caret-top'
                    "
                  ></i>
                </div>
                <div
                  :class="
                    v.dif.indexOf('-') >= 0
                      ? 'down'
                      : v.dif == '0.00' || v.dif == '0.00%' || v.dif == '0.0000'
                      ? ''
                      : 'up'
                  "
                >
                  {{
                    ["昨日毛利率", "本年累计毛利率"].indexOf(v.title) !== -1
                      ? v.dif
                      : `${v.dif}元`
                  }}
                  <i
                    :class="
                      v.per.indexOf('-') >= 0
                        ? 'el-icon-caret-bottom'
                        : v.per == '0.00%'
                        ? ''
                        : 'el-icon-caret-top'
                    "
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </div>
    </div>
    <!-- :option="funnelOption" -->
    <!-- <div class="component_title">转换漏斗</div> -->
    <FunnelEcharts
      :option="funnelOption"
      :twoOption="TfunnelOption"
      v-if="this.checkList.indexOf(35) >= 0"
    ></FunnelEcharts>
    <!-- 趋势对比 -->
    <CountLayout
      :option="countData.data"
      :loading="countData.loading"
      :countInfoArr="countData.totalInfo"
      type="newMix"
      v-if="this.checkList.indexOf(36) >= 0"
    >
      <div class="component_title2 mrg_btn" slot="title">趋势对比</div>
      <template #option>
        <el-col :md="6" :sm="12">
          <el-form-item label="指标" prop="key">
            <el-select
              v-model="form.key"
              placeholder="请选择"
              @change="changeComparisonKey"
              :popper-append-to-body="false"
            >
              <el-option
                :disabled="form.c_key === v.id"
                v-for="(v, i) in key"
                :key="i"
                :label="v.title"
                :value="v.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="6" :sm="12" class="height_centent">
          <el-radio-group v-model="form.comparison_type">
            <el-radio
              :label="v.value"
              v-for="(v, i) in comparison_data"
              :key="i"
              @click.native.prevent="initKeyType(v.value)"
              >{{ v.title }}</el-radio
            >
          </el-radio-group>
        </el-col>
        <el-col :md="6" :sm="12" v-if="form.comparison_type == 1">
          <el-select
            v-model="form.c_key"
            placeholder="请选择"
            @change="fetchCount"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="(v, i) in compareKey"
              :key="i"
              :label="v.title"
              :value="v.id"
            />
          </el-select>
        </el-col>
        <el-col :md="12" :sm="12" v-if="form.comparison_type == 2">
          <el-select
            v-model="form.c_type"
            placeholder="请选择"
            @change="changeDepart"
            filterable
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in departDatas"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="form.c_group"
            placeholder="请选择"
            multiple
            collapse-tags
            @change="selectAll"
            filterable
            :popper-append-to-body="false"
          >
            <el-option label="全选" value="all"></el-option>
            <el-option
              v-for="v in infoDeparts"
              :key="v.id"
              :label="v.title"
              :value="v.id"
              :disabled="v.flag"
            >
              <span
                class="iconfont"
                :class="v.system ? formatSystemIcon(v.system) : ''"
                >{{ v.title }}</span
              >
            </el-option>
          </el-select>
        </el-col>
        <el-col :md="12" :sm="12" v-if="form.comparison_type == 3">
          <!-- :append-to-body="false" -->
          <el-date-picker
            v-model="timeBegin"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @blur="changeTimeEnd"
            :picker-options="pickerOptions0"
            :clearable="false"
          ></el-date-picker>
          <span class="among">对比</span>
          <el-date-picker
            v-model="timeEnd"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @blur="changeTimeBegin"
            :picker-options="pickerOptions0"
            :clearable="false"
          ></el-date-picker>
        </el-col>
      </template>
      <template #extras> </template>
    </CountLayout>
    <!-- 数据报表 -->
    <TableLayout
      :column="changeColumn"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      :params="outPamrms"
      :leadOut="true"
      alignStyle="center"
      leadApi="Business/report"
      @pageChange="onPageChange"
      @sizeChange="onSizeChange"
      @sortChange="onSortChange"
      :defaultSort="sort"
      v-if="this.checkList.indexOf(37) >= 0"
    >
      <div class="component_title" slot="title">数据报表</div>
      <div slot="table-option" class="Tab_box">
        <div class="left_box">
          <span class="font14">数据维度（多选）</span>
          <el-select
            v-model="group"
            placeholder="全部渠道"
            :popper-append-to-body="false"
            :reserve-keyword="true"
            filterable
            multiple
            collapse-tags
            class="my-select"
            @change="changeTable"
          >
            <div class="check-all">
              <el-checkbox v-model="all" @input="changeDimensional"
                >全部勾选</el-checkbox
              >
            </div>
            <el-option
              v-for="(v, i) in dimensionalData"
              :key="i"
              :value="v.value"
              :label="v.title"
              :disabled="
                group.length == 1 && group[0] == v.value ? true : false
              "
            />
          </el-select>
          <el-checkbox
            style="margin-left: 20px"
            v-model="flexFlag"
            @input="changeTableList"
            >冻结维度项</el-checkbox
          >
        </div>
        <TransferDialog
          :data1="this.paramDetailData.showField"
          :data2="this.paramDetailData.hiddenField"
          @paramSave="paramSave"
          @initData="initData"
          postApi="Business/paramDetail"
          :postParams="customFieldParams"
          transferCard="index"
        >
          <div class="table-tabs" slot="tabs">
            <span
              class="items"
              :class="memberpayTypesActive == k.id ? 'active' : ''"
              v-for="k in memberpayTypes"
              :key="k.id"
              @click="memberpayTypeClick(k.id)"
            >
              {{ k.label }}
            </span>
          </div>
        </TransferDialog>
      </div>
    </TableLayout>
  </div>
</template>

<script>
import moment from "moment";
import store from "store2";
import CountLayout from "@/layout/count";
import { mapActions } from "vuex";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import TransferDialog from "@/layout/transferDialog";
import FunnelEcharts from "./double-funnel/index";
import { Mydata } from "../mixins/index.js";
import SelectCustomize from "@/component/select-customize";
export default {
  mixins: [Mydata],
  props: {
    checkList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    FilterLayout,
    CountLayout,
    FunnelEcharts,
    TableLayout,
    TransferDialog,
    SelectCustomize,
  },
  data() {
    return {
      searchForm: {
        //筛选项
        project: [],
        appid: [],
        system: [],
        timeType: "1",
        department_id: [],
        group_id: [],
        time: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
      },
      dashBoardData: [], //指示看板
      frontDashBoardData: [],
      behindDashBoardData: [],
      form: {
        //趋势对比
        key: 0,
        comparison_type: "",
        c_key: "",
        c_type: "",
        c_group: [],
      },
      department_id: [],
      targetName: "",
      group_id: [],
      countData: {
        data: {},
        totalInfo: [],
        loading: false,
      },
      funnelOption: {},
      TfunnelOption: {},
      changeCheckList: [],
      departmentInfo: {
        appInfo: [], //部门-组件初始数据
      },
      groupIdInfo: {
        appInfo: [], //项目组-组件初始数据
      },
      projectInfo: {
        appInfo: [], //项目组-件初始数据
      },
      appidInfo: {
        appInfo: [], //应用-组件初始数据
      },
      systemInfo: {
        appInfo: [], //系统-组件初始数据
      },
      tableData: {
        data: [],
        total: 0,
        currentPage: 1,
        pageSize: 10,
        loading: false,
      },
      group: [1000], //投放维度的所选值
      transferDialog: false,
      timeBegin: [],
      timeEnd: [],
      //字段展示自定义
      paramDetailData: {
        showField: [], //显示列表
        hiddenField: [], //隐藏列表
      },
      customProps: {
        value: "id", // 自定义当前数组的键名
        label: "title",
        children: "node",
      },
      all: false, //数据维度全选标杆
      flexFlag: false, //冻结维度的标杆
      departmentAll: false,
      grouptAll: false,
      appidAll: false,
      articleAll: false,
      apps: [], //应用-组件列表数据
      article_id: [], //项目-组件列表数据
      sumList: [], //总值
      avgList: [], //均值
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
      memberpayTypesActive: 1,
      sort:{
        prop:"",
        order:'',
      }
    };
  },
  computed: {
    customFieldParams(){
      return{
        cate: 1,
        timeStart: this.searchForm["time"][0],
        timeEnd: this.searchForm["time"][1],
      }
    },
    changeColumn() {
      let arr = [];
      let columu = [
        {
          label: "时间",
          prop: "date",
          value: 1000,
        },
        {
          label: "项目",
          prop: "project",
          value: 1003,
        },
        {
          label: "部门",
          prop: "department_title",
          value: 1001,
        },
        {
          label: "项目组",
          prop: "group_title",
          value: 1002,
        },
        {
          label: "应用",
          prop: "app_title",
          value: 1004,
        },
        {
          label: "系统",
          prop: "system_title",
          value: 1005,
        },
      ];
      let all = {};
      let mean = {};
      let weekFlag = false;
      if (this.group.length) {
        this.group.forEach((item) => {
          columu.forEach((_item) => {
            if (_item.value == item) {
              if (this.flexFlag) {
                _item.fixed = "left";
              } else {
                _item.fixed = "";
              }
              arr.push(_item);
            }
            if (_item.value == item && _item.prop == "date") {
              if (this.flexFlag) {
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
      this.paramDetailData.showField.forEach((item) => {
        this.column.forEach((_item) => {
          if (item.value == _item.label) {
            all[_item.prop] = this.sumList[_item.prop];
            mean[_item.prop] = this.avgList[_item.prop];
            arr.push({
              label: item.value,
              prop: _item.prop,
              sortable: _item.sortable,
            });
          }
        });
      });
      if (
        this.tableData.data[0] &&
        this.tableData.data[0][arr[0].prop] != "总计"
      ) {
        this.tableData.data = [all, mean, ...this.tableData.data];
      }
      this.tableData.data.forEach((item) => {
        if (item.date != "总计" && item.date != "均值" && weekFlag) {
          item.week = moment(item.date).format("dddd");
        }
      });
      return arr;
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
  },
  methods: {
    ...mapActions(["getAdApp"]),
    // 模板设置
    getDashboardSetting() {
      this.getAdApp();
      this.getParamList();
      this.getDashboard();
      this.funnelEach();
      this.getReport();
      this.getParamDetail();
      this.getRoleBtree();
      this.fetchCount();
    },
    // 改变项目组与app
    changeProjectTeam(val) {
      this.searchForm.department_id = val.appInfo;
      this.searchForm.group_id = [];
      this.searchForm.appid = [];
      this.searchForm.project = [];
      this.groupIdInfo.appInfo = [];
      this.projectInfo.appInfo = [];
      this.appidInfo.appInfo = [];
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
    },
    // 改变app与部门
    changeApp(val) {
      this.searchForm.group_id = val.appInfo;
      this.searchForm.appid = [];
      this.searchForm.project = [];
      this.projectInfo.appInfo = [];
      this.appidInfo.appInfo = [];
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
    },
    // 改变项目
    changeArticle(val) {
      this.searchForm.project = val.appInfo;
      this.searchForm.appid = [];
      this.appidInfo.appInfo = [];
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
    },
    changeAppid(val) {
      this.searchForm.appid = val.appInfo;
    },
    changeSystem(val) {
      this.searchForm.system = val.appInfo;
    },
    // 指标列表
    async getParamList() {
      const [err, res] = await this.$http.post("Business/paramList", {
        cate: 1,
      });
      if (err) return;
      this.key = res;
    },
    // 趋势对比
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
    onSubmit() {
      this.tableOpt.currentPage = 1;
      this.funnelEach();
      this.getDashboard();
      this.fetchCount();
      this.getReport();
    },
    // 重置表单
    initFrom() {
      this.departmentInfo.appInfo = [];
      this.groupIdInfo.appInfo = [];
      this.projectInfo.appInfo = [];
      this.appidInfo.appInfo = [];
      this.systemInfo.appInfo = [];
      this.searchForm = {
        //筛选项
        appid: [],
        system: [],
        timeType: "1",
        department_id: [],
        group_id: [],
        time: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
      };
      this.getDashboardSetting();
    },
    // 指示看板数据
    async getDashboard() {
      const [err, res] = await this.$http.post("Business/dashboard", {
        ...this.searchForm,
        timeBegin: this.searchForm["time"][0],
        timeEnd: this.searchForm["time"][1],
      });
      if (err) return;
      let arr = [...res];
      arr.forEach((item) => {
        item.dif = parseFloat(item.dif).toLocaleString() + "";
        if (item.title !== "昨日毛利率" || item.title !== "本年累计毛利率") {
          if (
            item.title == "昨日ARPU" ||
            item.title == "本年ARPU均值" ||
            item.title == "昨日买量CPI" ||
            item.title == "本年买量CPI均值"
          ) {
            if (item.value.split(".")[1].length == 1) {
              item.value = item.value + "000";
            }
            if (item.value.split(".")[1].length == 2) {
              item.value = item.value + "00";
            }
            if (item.value.split(".")[1].length == 3) {
              item.value = item.value + "0";
            }
          } else {
            item.value = parseFloat(item.value).toLocaleString() + "";
          }
        }
        if (item.title == "昨日毛利率") {
          item.value = item.value + "%";
        }
        if (item.title == "本年累计毛利率") {
          item.value = item.value + "%";
        }
      });
      this.frontDashBoardData = arr.slice(0, 6);
      this.behindDashBoardData = arr.slice(6, 12);
    },
    // 改变图片筛选项
    changeComparisonKey(res) {
      let arr = [];
      this.key.forEach((item) => {
        if (item.id !== res) {
          arr.push(item);
        }
        if (item.id == res) {
          this.targetName = item.title;
        }
      });
      this.compareKey = arr;
      this.fetchCount();
    },
    // 请求图片数据
    async fetchCount() {
      if(this.form.comparison_type != 3){
        this.timeEnd = [];
        this.timeBegin = ''
      }
      const { searchForm, form, timeBegin, timeEnd } = this;
      this.countData.loading = true;
      const [err, res] = await this.$http.post("Business/comparison", {
        ...searchForm,
        ...form,
        timeStart: searchForm["time"][0],
        c_timeBegin: timeEnd[0] ? moment(timeEnd[0]).format("YYYY-MM-DD") : "",
        c_timeEnd: timeEnd[1] ? moment(timeEnd[1]).format("YYYY-MM-DD") : "",
        timeBegin: timeBegin[0]
          ? moment(timeBegin[0]).format("YYYY-MM-DD")
          : "",
        timeEnd: timeBegin[1]
          ? moment(timeBegin[1]).format("YYYY-MM-DD")
          : searchForm["time"][1],
      });
      this.countData.loading = false;
      if (err) {
        this.countData.data = {
          legendData: [],
          xAxisData: [],
          data: [],
          yAxis: [],
        };
        return;
      }
      let { date, data, totalInfo = [] } = res;
      totalInfo.forEach((item) => {
        if (this.nameArr.indexOf(item.name) !== -1) {
          item.avg = (item.avg * 100).toFixed(2) + "%";
          item.total = (item.total * 100).toFixed(2) + "%";
          item.hasPercentSign = true;
        }
      });
      this.countData.totalInfo = totalInfo;
      if (
        this.keyNumArr.indexOf(this.form.key) !== -1 ||
        this.keyNumArr.indexOf(this.form.c_key) !== -1
      ) {
        data.forEach((item) => {
          item.data = item.data.map((_item) => {
            // 只有百分比的指标才要*100
            if (this.nameArr.indexOf(this.targetName) > -1) {
              return (_item = (_item * 100).toFixed(2));
            } else {
              return (_item = _item * 1);
            }
          });
        });
      }
      let yAxis = [];
      if (this.form.comparison_type == 1) {
        const _data = data.map((item, index) => {
          if (index != 0) {
            return {
              ...item,
              yAxisIndex: 1,
            };
          } else {
            return {
              yAxisIndex: 0,
              ...item,
            };
          }
        });
        let xAxisData = [];
        date.forEach((item) => {
          xAxisData.push(item.startDate);
        });
        xAxisData = xAxisData.map((item) => {
          return moment(item).format("YYYY-MM-DD");
        });
        this.countData.data = {
          legendData: data,
          xAxisData: xAxisData,
          data: _data,
          yAxis: [
            {
              type: "value",
              name:
                this.nameArr.indexOf(data[0].name) >= 0
                  ? data[0].name + "%"
                  : data[0].name,
              max:
                this.nameArr.indexOf(data[0].name) >= 0
                  ? null
                  : Math.max(...data[0].data),
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
            },
            {
              type: "value",
              name:
                this.nameArr.indexOf(data[1].name) >= 0
                  ? data[1].name + "%"
                  : data[1].name,
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
              max:
                this.nameArr.indexOf(data[1].name) >= 0
                  ? null
                  : Math.max(...data[1].data),
              min: 0,
            },
          ],
          formatter: (res) => {
            let html = `${res[0].axisValueLabel}<br/>`;
            res.forEach((v) => {
              html += `${v.marker}${v.seriesName}：${
                this.nameArr.indexOf(v.seriesName) >= 0
                  ? parseFloat(v.value).toLocaleString() + "%"
                  : this.numberArr.indexOf(v.seriesName) >= 0
                  ? v.value
                  : parseFloat(v.value).toLocaleString()
              }<br/>`;
            });
            return html;
          },
        };
      } else if (this.form.comparison_type == 2) {
        let xAxisData = [];
        let title = "";
        date.forEach((item) => {
          xAxisData.push(item.startDate);
        });
        this.key.forEach((item) => {
          if (this.form.key == item.id) {
            title = item.title;
          }
        });
        yAxis = [
          {
            type: "value",
            name: title,
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
        ];
        xAxisData = xAxisData.map((item) => {
          return moment(item).format("YYYY-MM-DD");
        });
        this.countData.data = {
          legendData: data,
          xAxisData: xAxisData,
          data: data,
          yAxis,
          formatter: (res) => {
            let html = `${res[0].axisValueLabel}<br/>`;
            res.forEach((v) => {
              html += `${v.marker}${v.seriesName}<br/>${title}：${
                this.nameArr.indexOf(title) !== -1
                  ? parseFloat(v.value).toLocaleString() + "%"
                  : parseFloat(v.value).toLocaleString()
              }<br/>`;
            });
            return html;
          },
        };
      } else if (this.form.comparison_type == 3) {
        let xAxisData = [];
        let title = "";
        date.forEach((item) => {
          xAxisData.push(
            `${moment(item.startDate).format("YYYY-MM-DD")}\n${moment(
              item.endDate
            ).format("YYYY-MM-DD")}`
          );
        });
        data[0].name == data[1].name ? (data[1].name = data[1].name + " ") : "";
        this.key.forEach((item) => {
          if (this.form.key == item.id) {
            title = item.title;
          }
        });
        yAxis = [
          {
            type: "value",
            name: title,
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
        ];
        this.countData.data = {
          legendData: data,
          xAxisData: xAxisData,
          data: data,
          yAxis,
          formatter: (res) => {
            let html = ``;
            let arr = res[0].axisValueLabel.split("\n");
            res.forEach((v, i) => {
              html += `${arr[i]}<br/>${
                i == 0
                  ? "<span ball style='width:10px;height: 10px;border-radius: 50%;background:#ffc706;display: inline-block;margin-right:4px;'></span>"
                  : "<span ball style='width:10px;height: 10px;border-radius: 50%;background:#5291ec;display: inline-block;margin-right:4px;'></span>"
              }${title}：${parseFloat(v.value).toLocaleString()}<br/>`;
            });
            html += `变化值：${
              (res[0].value - res[1].value + "").indexOf("-")
                ? `<span style='color: #ea5454'>${parseFloat(
                    (res[0].value - res[1].value).toFixed(2)
                  ).toLocaleString()}</span>`
                : `<span style='color: #17bf5e'>${parseFloat(
                    (res[0].value - res[1].value).toFixed(2)
                  ).toLocaleString()}</span>`
            }<br/>`;
            html += `变化率：${
              ((res[0].value - res[1].value) / res[1].value + "").indexOf("-")
                ? `<span style='color: #ea5454'>${
                    (
                      ((res[0].value - res[1].value) / res[1].value) *
                      100
                    ).toFixed(2) + "%"
                  }</span>`
                : `<span style='color: #17bf5e'>${
                    (
                      ((res[0].value - res[1].value) / res[1].value) *
                      100
                    ).toFixed(2) + "%"
                  }</span>`
            }`;
            // html += res

            return html;
          },
        };
      } else {
        let xAxisData = [];
        date.forEach((item) => {
          xAxisData.push(item.startDate);
        });
        yAxis = [
          {
            type: "value",
            name:
              this.nameArr.indexOf(data[0].name) >= 0
                ? data[0].name + "(%)"
                : data[0].name,
            min: 0,
            max:
              this.nameArr.indexOf(data[0].name) >= 0
                ? null
                : Math.max(...data[0].data),
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
        ];
        xAxisData = xAxisData.map((item) => {
          return moment(item).format("YYYY-MM-DD");
        });
        this.countData.data = {
          legendData: data,
          xAxisData: xAxisData,
          data: data,
          yAxis,
          formatter: (res) => {
            let html = `${res[0].axisValueLabel}<br/>`;
            res.forEach((v) => {
              html += `${v.marker}${v.seriesName}：${
                this.nameArr.indexOf(v.seriesName) >= 0
                  ? parseFloat(v.value).toLocaleString() + "%"
                  : parseFloat(v.value).toLocaleString()
              }<br/>`;
            });
            return html;
          },
        };
      }
    },

    async funnelEach() {
      this.funnelOption = {
        loading: true,
      };
      this.TfunnelOption = {
        loading: true,
      };
      const { searchForm } = this;
      const [err, res] = await this.$http.post("Business/funnelDetail", {
        ...searchForm,
        timeStart: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });
      if (err) return;
      let xAxisData = res.advert.data;
      let expandData = res.advert.other;
      let TxAxisData = res.order.data;
      let TexpandData = res.order.other;
      let option = {
        tooltip: {
          trigger: "item",
          formatter: (params) => {
            let { dataIndex, name, value } = params;
            let result = `${name}： ${parseFloat(value).toLocaleString()}`;
            switch (dataIndex) {
              case 0:
                break;
              case 1:
                if (expandData[dataIndex].per.indexOf("-") >= 0) {
                  result += `<br/>广告填充率：${expandData[dataIndex].rate}%<br/>环比：<span style="color:rgb(38, 191, 106)">${expandData[dataIndex].per}%</span>`;
                } else if (
                  expandData[dataIndex].rate.indexOf("-") == -1 &&
                  expandData[dataIndex] != "0.00%"
                ) {
                  result += `<br/>广告填充率：${expandData[dataIndex].rate}%<br/>环比：<span style="color:rgb(246, 82, 82)">${expandData[dataIndex].per}%</span>`;
                } else {
                  result += `<br/>广告填充率：${expandData[dataIndex].rate}%<br/>环比：<span>${expandData[dataIndex].per}%</span>`;
                }
                break;
              case 2:
                if (expandData[dataIndex].per.indexOf("-") >= 0) {
                  result += `<br/>曝光率：${expandData[dataIndex].rate}%<br/>环比：<span style="color:rgb(38, 191, 106)">${expandData[dataIndex].per}%</span>`;
                } else if (
                  expandData[dataIndex].rate.indexOf("-") == -1 &&
                  expandData[dataIndex] != "0.00%"
                ) {
                  result += `<br/>曝光率：${expandData[dataIndex].rate}%<br/>环比：<span style="color:rgb(246, 82, 82)">${expandData[dataIndex].per}%</span>`;
                } else {
                  result += `<br/>曝光率：${expandData[dataIndex].rate}%<br/>环比：<span>${expandData[dataIndex].per}%</span>`;
                }
                break;
              case 3:
                if (expandData[dataIndex].per.indexOf("-") >= 0) {
                  result += `<br/>点击率：${expandData[dataIndex].rate}%<br/>环比：<span style="color:rgb(38, 191, 106)">${expandData[dataIndex].per}%</span>`;
                } else if (
                  expandData[dataIndex].rate.indexOf("-") == -1 &&
                  expandData[dataIndex] != "0.00%"
                ) {
                  result += `<br/>点击率：${expandData[dataIndex].rate}%<br/>环比：<span style="color:rgb(246, 82, 82)">${expandData[dataIndex].per}%</span>`;
                } else {
                  result += `<br/>点击率：${expandData[dataIndex].rate}%<br/>环比：<span>${expandData[dataIndex].per}%</span>`;
                }
                break;
            }
            return result;
          },
        },
        series: [
          {
            name: "广告流量",
            type: "funnel",
            left: "10%",
            top: 60,
            bottom: 60,
            width: "80%",
            minSize: "0%",
            maxSize: "100%",
            sort: "none",
            gap: 2,
            label: {
              show: true,
              position: "inside",
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: "solid",
              },
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ["#2E96B4", "#66D2DE", "#FF9320", "#DE4647"];
                  return colorList[params.dataIndex];
                },
                borderColor: "#fff",
                borderWidth: 1,
              },
            },
            emphasis: {
              label: {
                fontSize: 20,
              },
            },
            data: xAxisData,
          },
        ],
        legend: {},
      };
      let Toption = {
        tooltip: {
          trigger: "item",
          formatter: (params) => {
            let { dataIndex, name, value } = params;
            let result = `${name}： ${parseFloat(value).toLocaleString()}`;
            switch (dataIndex) {
              case 0:
                break;
              case 1:
                if (TexpandData[dataIndex].per.indexOf("-") >= 0) {
                  result += `<br/>注册率：${TexpandData[dataIndex].rate}%<br/>环比：<span style="color:rgb(38, 191, 106)">${TexpandData[dataIndex].per}%</span>`;
                } else if (
                  expandData[dataIndex].rate.indexOf("-") == -1 &&
                  expandData[dataIndex] != "0.00%"
                ) {
                  result += `<br/>注册率：${TexpandData[dataIndex].rate}%<br/>环比：<span style="color:rgb(246, 82, 82)">${TexpandData[dataIndex].per}%</span>`;
                } else {
                  result += `<br/>注册率：${TexpandData[dataIndex].rate}%<br/>环比：${TexpandData[dataIndex].per}%`;
                }
                break;
              case 2:
                if (TexpandData[dataIndex].per.indexOf("-") >= 0) {
                  result += `<br/>下单率：${TexpandData[dataIndex].rate}%<br/>环比：<span style="color:rgb(38, 191, 106)">${TexpandData[dataIndex].per}%</span>`;
                } else if (
                  expandData[dataIndex].rate.indexOf("-") == -1 &&
                  expandData[dataIndex] != "0.00%"
                ) {
                  result += `<br/>下单率：${TexpandData[dataIndex].rate}%<br/>环比：<span style="color:rgb(246, 82, 82)">${TexpandData[dataIndex].per}%</span>`;
                } else {
                  result += `<br/>下单率：${TexpandData[dataIndex].rate}%<br/>环比：${TexpandData[dataIndex].per}%`;
                }
                break;
              case 3:
                if (TexpandData[dataIndex].per.indexOf("-") >= 0) {
                  result += `<br/>支付成功率：${TexpandData[dataIndex].rate}%<br/>环比：<span style="color:rgb(38, 191, 106)">${TexpandData[dataIndex].per}%</span>`;
                } else if (
                  expandData[dataIndex].rate.indexOf("-") == -1 &&
                  expandData[dataIndex] != "0.00%"
                ) {
                  result += `<br/>支付成功率：${TexpandData[dataIndex].rate}%<br/>环比：<span style="color:rgb(246, 82, 82)">${TexpandData[dataIndex].per}%</span>`;
                } else {
                  result += `<br/>支付成功率：${TexpandData[dataIndex].rate}%<br/>环比：${TexpandData[dataIndex].per}%`;
                }
                break;
            }
            return result;
          },
        },
        series: [
          {
            name: "付费转化",
            type: "funnel",
            left: "10%",
            top: 60,
            bottom: 60,
            width: "80%",
            minSize: "0%",
            maxSize: "100%",
            sort: "none",
            gap: 2,
            label: {
              show: true,
              position: "inside",
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: "solid",
              },
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ["#2E96B4", "#66D2DE", "#FF9320", "#DE4647"];
                  return colorList[params.dataIndex];
                },
              },
              borderColor: "#fff",
              borderWidth: 1,
            },
            emphasis: {
              label: {
                fontSize: 20,
              },
            },
            data: TxAxisData,
          },
        ],
        legend: {},
      };
      this.funnelOption = option;
      this.TfunnelOption = Toption;
    },
    onPageChange(current) {
      this.tableOpt.currentPage = current;
      this.getReport();
    },
    onSizeChange(current) {
      this.tableOpt.pageSize = current;
      this.getReport();
    },
    changeTable(val) {
      this.getReport();
    },
    // 数据报表
    async getReport() {
      this.tableData.loading = true;
      const { searchForm, group, tableOpt, sort } = this;
      const [err, res] = await this.$http.post("Business/report", {
        ...searchForm,
        ...tableOpt,
        ...sort,
        group: group.sort(function (a, b) {
          return a - b;
        }),
        timeStart: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });
      this.tableData.loading = false;
      if (err) {
        this.tableData = {
          list: [],
          total: 0,
          currentPage: 1,
          pageSize: 10,
          loading: false,
        };
        return;
      }
      const { list, currentPage, total, sumList, avgList } = res;
      list.forEach((item) => {
        for (const key in item) {
          /* if (key == "roi_day1") {
            item[key] = (item[key] * 100).toFixed(2);
          } */
          if (this.keyArr.indexOf(key) >= 0) {
            if (item[key] === "roi_day1") {
              item[key] = item[key] + "%";
            } else {
              item[key] = (item[key] * 100).toFixed(2) + "%";
            }
          }
          if (this.numKeyArr.indexOf(key) === -1) {
            item[key] = parseFloat(item[key]).toLocaleString();
          }
          if (key == "device_new_keep" || key == "device_active_keep") {
            if (key) {
              item[key] = (item[key] * 100).toFixed(2) + "%";
            }
          }
        }
      });
      for (const key in sumList) {
        if (this.keyArr.indexOf(key) >= 0) {
          if (sumList[key] === "roi_day1") {
            sumList[key] = sumList[key] + "%";
          } else {
            sumList[key] = (sumList[key] * 100).toFixed(2) + "%";
          }
        }
        if (this.numKeyArr.indexOf(key) === -1) {
          sumList[key] = parseFloat(sumList[key]).toLocaleString();
        }
        if (key == "device_new_keep" || key == "device_active_keep") {
          if (key) {
            sumList[key] = (sumList[key] * 100).toFixed(2) + "%";
          }
        }
      }
      for (const key in avgList) {
        if (this.keyArr.indexOf(key) >= 0) {
          if (avgList[key] === "roi_day1") {
            avgList[key] = avgList[key] + "%";
          } else {
            avgList[key] = (avgList[key] * 100).toFixed(2) + "%";
          }
        }
        if (this.numKeyArr.indexOf(key) === -1) {
          avgList[key] = parseFloat(avgList[key]).toLocaleString();
        }
        if (key == "device_new_keep" || key == "device_active_keep") {
          if (key) {
            avgList[key] = (avgList[key] * 100).toFixed(2) + "%";
          }
        }
      }

      this.sumList = sumList;
      this.avgList = avgList;
      this.tableData.data = list;
      this.tableData.currentPage = currentPage;
      this.tableData.total = total;
    },
    // 改变维度筛选
    changeDepart(val) {
      this.infoDeparts = [];
      this.form.c_group = [];
      this.departDatas.forEach((item) => {
        if (item.id == val) {
          this.infoDeparts = [...item.node];
        }
      });
    },
    // 改变后置时间
    changeTimeEnd() {
      const timeStart = this.timeBegin[0];
      const timeEnd = this.timeBegin[1];
      const time = moment(timeEnd).diff(moment(timeStart), "days");
      // 如果时间差不相等
      if (time != this.timeDiff) {
        // 如果这次时间大于前一次时间
        if (time > this.timeDiff) {
          this.timeEnd = [
            moment(this.timeEnd[0])
              .subtract(time - this.timeDiff, "days")
              .format("YYYY-MM-DD"),
            this.timeEnd[1],
          ];
        } else {
          this.timeEnd = [
            moment(this.timeEnd[0])
              .add(this.timeDiff - time, "days")
              .format("YYYY-MM-DD"),
            this.timeEnd[1],
          ];
        }
      }
      this.timeDiff = time;
      this.fetchCount();
    },
    // 改变前置时间
    changeTimeBegin() {
      const timeStart = this.timeEnd[0];
      const timeEnd = this.timeEnd[1];
      const time = moment(timeEnd).diff(moment(timeStart), "days");
      if (time != this.timeDiff) {
        // 如果这次时间大于前一次时间
        if (time > this.timeDiff) {
          this.timeBegin = [
            moment(this.timeBegin[0])
              .subtract(time - this.timeDiff, "days")
              .format("YYYY-MM-DD"),
            this.timeBegin[1],
          ];
        } else {
          this.timeBegin = [
            moment(this.timeBegin[0])
              .add(this.timeDiff - time, "days")
              .format("YYYY-MM-DD"),
            this.timeBegin[1],
          ];
        }
      }
      this.timeDiff = time;
      this.fetchCount();
    },
    // 取消单选
    initKeyType(res) {
      if (res === this.form.comparison_type) {
        this.form.comparison_type = "";
        this.form = {
          //趋势对比
          key: 0,
          comparison_type: "",
          c_key: "",
          c_type: "",
          c_group: [],
        };
      } else {
        this.form.comparison_type = res;
      }
      switch (res) {
        case 1: {
          if (!this.form.comparison_type) {
            this.form.c_key = "";
            this.fetchCount();
            return;
          }
          let arr = [];
          this.key.forEach((item) => {
            if (item.id !== this.form.key) {
              arr.push(item);
            }
          });
          this.compareKey = arr;
          this.form.c_key = arr[0].id;
          this.fetchCount();
          break;
        }
        case 2:
          this.form.c_key = "";
          this.form.c_type = 1002;
          this.infoDeparts = [...this.departDatas[0].node];
          this.form.c_group = [this.departDatas[0].node[0].id];
          this.fetchCount();
          break;
        case 3: {
          this.form.c_key = "";
          const timeStart = this.searchForm["time"][0];
          const timeEnd = this.searchForm["time"][1];
          const time = moment(timeEnd).diff(moment(timeStart), "days");
          this.timeBegin = this.searchForm.time;
          let newTimeStart = moment(timeStart)
            .subtract(time + 1, "days")
            .format("YYYY-MM-DD");
          let newTimeEnd = moment(timeStart)
            .subtract(1, "days")
            .format("YYYY-MM-DD");
          this.timeEnd = [newTimeStart, newTimeEnd];
          this.timeDiff = time;
          this.fetchCount();
          break;
        }
      }
    },
    selectAll(val) {
      for (var key of val) {
        if (key == "all") {
          let arr = [];
          this.form.c_group = [];
          this.infoDeparts.forEach((item) => {
            arr.push(item.id);
          });
          this.form.c_group = [...arr];
        }
      }
      this.fetchCount();
    },
    // 获取自定义字段
    async getParamDetail() {
      const [err, res] = await this.$http.post("Business/paramDetail", {
        cate: 1,
        timeStart: this.searchForm["time"][0],
        timeEnd: this.searchForm["time"][1],
      });
      if (err) return;
      res.showField.forEach((item) => {
        item.isSelect = false;
      });
      res.hiddenField.forEach((item) => {
        item.isSelect = false;
      });
      this.paramDetailData = res;
    },
    // 获取自定义展示字段接口
    async paramSave(val) {
      this.tableData.loading = true;
      const [err, res] = await this.$http.post("Business/paramSave", {
        cate: 1,
        timeStart: this.searchForm["time"][0],
        timeEnd: this.searchForm["time"][1],
        ...val,
      });
      if (err) return;
      this.getReport();
      this.getParamDetail();
    },
    // 自定义数据初始化数据
    initData(val) {
      this.getReport();
      this.getParamDetail();
    },
    onSortChange(data) {
      const { prop, order } = data;
      this.sort = { prop, order };
      this.tableOpt.currentPage = 1;
      this.getReport();
    },
    changeDimensional(val) {
      if (val) {
        this.group = [1000, 1001, 1002, 1003, 1004, 1005];
      } else {
        this.group = [1000];
      }
      this.getReport();
    },
    // 冻结列表
    changeTableList(val) {
      this.group.forEach((item) => {
        this.changeColumn.forEach((_item) => {
          if (_item.value == item) {
            if (this.flexFlag) {
              _item.fixed = "left";
            } else {
              _item.fixed = "";
            }
          }
          if (item == 1000) {
            if (this.flexFlag) {
              if (_item.prop == "week") {
                _item.fixed = "left";
              }
            }
          }
        });
      });
    },
    formatSystemIcon(code) {
      switch (String(code)) {
        case "1":
          return "icon-anzhuo";
        case "2":
          return "icon-ios";
        case "3":
          return "icon-weixin";
        case "4":
          return "icon-baidu";
        case '5':
          return 'icon-chrome'
        default:
          return "";
      }
    },
    memberpayTypeClick(index) {
      if (this.memberpayTypesActive == index) {
        return;
      }
      this.memberpayTypesActive = index;
    },
  },
};
</script>

<style lang="less" scoped>
.fl_rigth {
  background: #fff;
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 15px;
}
.dash_board {
  margin: 20px 0;
  background: #fff;
  min-height: 400px;
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
  height: 150px;
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
    display: flex;
    .btns {
      margin-left: 20px;
    }
  }
}
.among {
  margin: 0 10px;
}
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
.mrg_btn {
  margin-bottom: 20px;
}
.height_centent {
  line-height: 40px;
}
.ball {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  color: aqua;
  display: inline-block;
  padding-right: 4px;
}
.font14 {
  font-size: 14px;
}
.rig_font {
  text-align: right;
}
/deep/.el-select__tags-text {
  display: inline-block;
  //根据自己的需要调整文字宽度
  max-width: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.check-all {
  padding: 0 20px;
  text-align: right;
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
.my-select{
  height: 40px;
}
</style>