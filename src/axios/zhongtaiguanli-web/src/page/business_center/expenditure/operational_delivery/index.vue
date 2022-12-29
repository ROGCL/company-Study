<template>
  <div>
    <!-- 筛选项 -->
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit" width="100px" :mdSpan="6" :flexFlag="true">
      <div class="component_title2">筛选项</div>
      <el-col :md="6" :lg="6" :sm="12">
        <el-form-item label="发布时间">
          <dataPicker :datevalue.sync="searchForm.time"></dataPicker>
        </el-form-item>
      </el-col>

      <el-col :md="6" :sm="12">
        <el-form-item label="项目" prop="project">
          <SelectCustomize :value="searchForm.project" @changeScope="changeApp" :data="article_id" />
        </el-form-item>
      </el-col>

      <el-col :md="6" :sm="12">
        <el-form-item label="应用" prop="appid">
          <SelectCustomize :value="searchForm.appid" :data="apps" @changeScope="getChannel" />
        </el-form-item>
      </el-col>

      <el-col :md="6" :sm="12">
        <el-form-item label="平台" prop="system">
          <!-- <SelectCustomize :value="searchForm.platform" :data="platform_id" @changeScope="getAuthor" /> -->
          <el-select v-model="searchForm.platform" placeholder="请选择" @change="getAuthor" clearable>
            <el-option v-for="item in platform_id" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :md="6" :sm="12">
        <el-form-item label="达人ID/昵称" prop="talent_id">
          <SelectCustomize :value="searchForm.talent" :data="talent_id" />
        </el-form-item>
      </el-col>

      <el-col :md="6" :sm="12">
        <el-form-item label="渠道负责人" prop="admin_id">
          <SelectCustomize :value="searchForm.admin" :data="admin_id" />
        </el-form-item>
      </el-col>

      <el-col :md="6" :sm="12">
        <el-form-item label="渠道号/订单ID" prop="channel_id">
          <!-- <SelectCustomize multipleFlag :value="searchForm.channel" :data="channel_id" /> -->
          <SelectCustomize multipleFlag v-model="searchForm.channel" :data="channel_id" />
        </el-form-item>
      </el-col>

      <el-col :md="6" :sm="12">
        <el-form-item label="助推状态" prop="system">
          <el-select v-model="searchForm.boost_status" placeholder="请选择" clearable>
            <el-option v-for="item in boost_status_list" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-button @click="initFrom" slot="btn-option">重置筛选</el-button>
    </FilterLayout>
    <!-- 指示看板 -->
    <div class="dash_board" v-loading="signboardLoding">
      <div class="component_title">指示看板</div>
      <el-row>
        <el-col :lg="{ span: '4-8' }" :md="8" :sm="12" v-for="(item, index) in signboardInfo" :key="index">
          <div class="box">
            <div class="title">{{ item.label }}</div>
            <!-- <div class="num" v-if="item.multiplyFlag100">
              {{ (item.number * 100).toFixed(2) }}{{ item.afterunit }}
            </div>

            <div class="num" v-else>
              {{ item.beforeunit }}{{ parseFloat(item.number).toLocaleString()
              }}{{ item.afterunit }}
            </div> -->
            <div class="num" >
              {{ item.beforeunit }}{{ item.number}}{{ item.afterunit }}
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 投放对比 -->
    <div class="layoutcount-wrapper">
      <div class="component_title">投放对比</div>
      <CountLayout :option="countdataoptions" :loading="countLoading" :type="CountLayoutype" :countInfoArr="totalInfo">
        <template #option>
          <el-row :gutter="10" class="compared-wrapper">
            <el-col :span="5">
              指标
              <el-select placeholder="请选择" v-model="target_id" @change="targetChange">
                <el-option :label="item.title" v-for="item in targetList" :key="item.id" :value="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-radio-group v-model="comparison_type">
                <el-radio :label="v.value" v-for="(v, i) in comparison_data" :key="i"
                  @click.native.prevent="initKeyType(v.value)">{{ v.title }}</el-radio>
              </el-radio-group>
            </el-col>
            <template v-if="comparison_type == 1">
              <el-col :span="7">
                维度对比
                <el-select placeholder="请选择" v-model="dimension_id" @change="dimensionchange">
                  <el-option :label="item.title" v-for="item in dimensionList" :key="item.id" :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="7" v-if="dimension_id">
                <div class="ac">
                  <span class="dimension_title">{{ dimension_title }}</span>
                  <SelectCustomize :value="dimension_select_ids" @changeScope="dimensionitemchange"
                    :data="dimension_data" />
                </div>
              </el-col>
            </template>
            <el-col :span="9" v-else-if="comparison_type == 2">
              <div class="ac">
                <el-date-picker v-model="timeBegin" type="daterange" range-separator="~" value-format="yyyy-MM-dd"
                  start-placeholder="开始日期" end-placeholder="结束日期" @blur="changeTimeEnd"
                  :picker-options="pickerOptions0"></el-date-picker>
                <span class="among">对比</span>
                <el-date-picker v-model="timeEnd" type="daterange" range-separator="~" value-format="yyyy-MM-dd"
                  start-placeholder="开始日期" end-placeholder="结束日期" @blur="changeTimeBegin"
                  :picker-options="pickerOptions0"></el-date-picker>
              </div>
            </el-col>
          </el-row>
        </template>
      </CountLayout>
    </div>

    <!-- 数据报表 -->
    <TableLayout :column="column" :data="tableData.data" :total="tableData.total" :loading="tableData.loading"
      :currentPage="tableData.currentPage" :params="outPamrms"
      :cellStyle="tab_arr_index == 2 ? cellStyle : cellStylefunnull"
      :headerCellStyle="tab_arr_index == 2 ? cellStyle : cellStylefunnull" :leadOut="true" alignStyle="center"
      author="liuqiang" :leadApi="
        tab_arr_index == 1
          ? 'Operate_Invest/lists_new'
          : 'Operate_Invest/targetFinishList'
      " tabLocation="top" @sizeChange="getListFun($event, 'size')" @pageChange="getListFun($event, 'page')"
      ref="TableLayout" @sortChange="onSortChange">
      <!-- tabs -->
      <div class="table-tabs" slot="tabs">
        <span class="items" :class="tab_arr_index == k.id ? 'active' : ''" v-for="k in tab_arr" :key="k.id"
          @click="handleTabClick(k.id)">
          {{ k.label }}
        </span>
      </div>
      <div class="component_title" slot="title">数据报表</div>
      <template #self_custom="{ row }">
        <div v-if="row.header_title">
          {{ row.header_title }}
        </div>
        <el-tooltip class="item" effect="dark" :content="`达人id：${row.author_id}`" placement="right-start" v-else>
          <div class="self-custom" :class="row.platform && row.platform.indexOf('星图') > -1?'author_name':''" @click="jumpAuthor(row)">
            <img :src="row.avatar_uri" alt="" class="avatar_uri" v-if="row.avatar_uri" />
            <img
              src="https://zhongtai-obs.obs.cn-southwest-2.myhuaweicloud.com:443/transactionProgram/fa071a5df8061699e5aaef6fa994deca.png"
              alt="" class="avatar_uri" v-else />
            <div>
              <div>
                {{ row.author_name }}
              </div>
            </div>
          </div>
        </el-tooltip>
      </template>
      <template #ad_id="{ row }">
        <a :href="`https://k.kuaishou.com/#/index/task/${row.order_id}?type=false`" target="_blank"
          v-if="row.platform && row.platform.indexOf('磁力聚星') > -1">{{ row.ad_id }}</a>
        <div v-else>
          {{ row.ad_id }}
        </div>

        <el-button v-if="!row.header_title && row.platform && row.platform.indexOf('磁力聚星') > -1" type="primary"
          size="mini" @click="jumpBoost(row.ad_id)">查看助推订单
        </el-button>
      </template>
      <template #video="{ row }">
        <template v-if="!row.header_title">
          <img @click="videoplay(row.video_url)" @contextmenu.prevent="onContextmenu($event,row.video_url)"  :src="row.head_image_uri" alt="" class="head_image_uri"
            v-if="row.head_image_uri" />
          <img @click="videoplay(row.video_url)" @contextmenu.prevent="onContextmenu($event,row.video_url)" src="@/asset/img/video_info.jpg" alt="" class="head_image_uri"
            v-else />
        </template>
      </template>
      <!-- 处理助推状态 -->
      <template #boost_status="{ row }">
        <div v-html="operationBoostStatus(row.boost_status)"></div>
      </template>
      <div slot="table-option" class="Tab_box">
        <template v-if="tab_arr_index == 1">
          <div class="left_box">
            <span class="font14">维度显示/隐藏（多选）</span>
            <el-select v-model="group" placeholder="全部渠道" :popper-append-to-body="false" :reserve-keyword="true"
              filterable multiple collapse-tags @change="changeTable" @remove-tag="removetag">
              <div class="check-all">
                <el-checkbox v-model="all" @input="changeDimensional">全部{{ all ? "隐藏" : "显示" }}
                </el-checkbox>
              </div>
              <el-option v-for="(v, i) in fixedcolumn" :key="i.value" :value="v.value" :label="v.label" :disabled="
                (group.length == 1 && group[0] == v.value ? true : false) || selectDisabled
              ">
                <span style="float: left">{{ v.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                  {{ v.value | groupvaluefilters(that) }}
                </span>
              </el-option>
            </el-select>
            <el-checkbox style="margin-left: 20px" v-model="flexFlag" @input="changeTableList">冻结维度项
            </el-checkbox>
          </div>
          <TransferDialog :data1="this.paramDetailData.show" :data2="this.paramDetailData.hidden" @paramSave="paramSave"
            postApi="Operate_Invest/customFieldList" ref="TransferDialog" @initData="initData" />
        </template>
        <template v-else>
          <div class="left_box">
            <el-checkbox style="margin-left: 20px" v-model="flexFlag" @input="changeTableList">冻结维度项
            </el-checkbox>
          </div>
        </template>
      </div>
    </TableLayout>
  </div>
</template>

<script>
import FilterLayout from "@/layout/form";
import moment from "moment";
import store from "store2";
import TableLayout from "@/layout/table";
import CountLayout from "@/layout/count";
import TransferDialog from "@/layout/transferDialog";
import SelectCustomize from "@/component/select-customize";
import _ from 'lodash'
import { Mydata } from "./mixins/index.js";
export default {
  mixins: [Mydata],
  components: {
    FilterLayout,
    TableLayout,
    CountLayout,
    SelectCustomize,
    TransferDialog,
  },
  data() {
    return {
      tab_arr_index: 1,
      tab_arr: [
        {
          label: "投放明细",
          id: 1,
        },
        {
          label: "目标完成情况",
          id: 2,
        },
      ],
      selectDisabled: false,
      sort_order: "",
      sort_prop: "",
      fixedcolumn_temp: [],
      tableData_data_temp: [],
      data_avg: {},
      data_sum: {},
      activeName: "first",
      CountLayoutype: "newBar",
      signboardLoding: false,
      channel_id: [],
      talent_id: [],
      list_group: [],
      timeBegin: [],
      timeEnd: [],
      timeDiff: [],
      apps: [],
      apps_default: [],
      article_id: [],
      systemIds: [],
      targetSelectedItem: {}, // 指标选择的对象
      targetList: [], // 指标列表
      target_id: "", // 指标id
      dimension_id: "", // 选择的哪个维度
      admin_id: [], //渠道负责人
      dimension_title: "应用",
      dimension_key: "",
      dimension_data: [], // 选择维度后下一级数据
      dimension_select_ids: {
        appInfo: [],
      },
      last_dimension_selectids: [], // 上一次选择的
      dimensionList: [], // 维度对比
      dimension_selecetd: {}, // 选择的维度
      department_id: [],
      flexFlag: false,
      countLoading: false,
      countdataoptions: {},
      paramDetailData: {
        show: [],
        hidden: [],
      },
      column: [],
      group: [],
      all: true,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 24 * 3600 * 1000;
        },
      },
      totalInfo: [],

      that: this,
      comparison_type: 1,
      changeTableTimer: null,
      tableData: {
        data: [],
        total: 0,
        currentPage: 1,
        pageSize: 10,
        loading: false,
      },
    };
  },

  computed: {
    outPamrms() {
      return {
        platform: this.searchForm.platform,
        project: this.formatSearch("project"),
        appid: this.formatSearch("appid"),
        channel: this.formatSearch("channel"),
        admin_id: this.formatSearch("admin"),
        author_id: this.formatSearch("talent"),
        is_download: 1,
        boost_status: this.searchForm.boost_status,
        list_group: this.group,
        leadeOutType: 1, //用于区分导出是哪个模块
        timeStart: this.searchForm.time[0] ? this.searchForm.time[0] : "",
        timeEnd: this.searchForm.time[1] ? this.searchForm.time[1] : "",
      };
    },
  },

  created() {
    this.init();
  },
  filters: {
    groupvaluefilters(val, that) {
      const idx = that.group.indexOf(val);
      if (idx > -1) {
        return "显示";
      } else {
        return "隐藏";
      }
    },
  },

  methods: {
    getDashboardSetting() {
      this.init()
    },
    jumpAuthor(row){
      if(row.platform.indexOf('星图') > -1){
        window.open(`https://www.xingtu.cn/ad/creator/author/douyin/${row.author_id}`)
      }
    },
    init() {
      this.setdefaultcolumn(); // 设置数据报表默认维度
      this.getRoleBtree(); // 获取应用和项目
      this.getAuthor(); // 获取达人id
      this.getChannel(); // 获取渠道号
      this.getParamDetail(); // 获取自定义字段
      this.getOperateInvest(); // 获取数据报表以及看板
      // this.countLoading = true
      // this.gettargetList() // 获取【投放对比】指标
    },

    initTime() {
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
      this.getTimeContrast();
    },

    handleTabClick(id) {
      if (this.tab_arr_index == id) return;
      this.flexFlag = false;
      this.tab_arr_index = id;
      this.tableData.currentPage = 1;
      this.tableData.data = [];
      if (id == 1) {
        this.setdefaultcolumn(); // 设置数据报表默认维度
        this.getParamDetail(); // 获取自定义字段
        this.getOperateInvest(); // 获取数据报表以及看板
      } else if (id == 2) {
        this.column = this.column2
        this.gettargetFinishList();
      }
    },
    cellStyle({ rowIndex, columnIndex }) {
      let columnIndexs = [5, 6, 7, 11, 12, 13, 17, 18, 19];
      if (columnIndexs.includes(columnIndex)) {
        return "background:#e6e6e6;";
      }
    },
    cellStylefunnull() { },

    async gettargetFinishList() {
      this.tableData.loading = true;
      let params = {
        platform: this.searchForm.platform,
        timeStart: this.searchForm.time[0] ? this.searchForm.time[0] : "",
        timeEnd: this.searchForm.time[1] ? this.searchForm.time[1] : "",
        currentPage: this.tableData.currentPage,
        pageSize: this.tableData.pageSize,
        admin_id: this.formatSearch("admin"),
        appid: this.formatSearch("appid"),
        order: this.sortablevale ? this.sortablevale : undefined,
      };
      const [err, res] = await this.$http.post(
        "Operate_Invest/targetFinishList",
        params
      );
      this.tableData.loading = false;
      if (err) return;
      this.tableData.data = res.list;
      this.tableData.total = Number(res.total) || 0;
    },
    // 获取时间对比数据
    async getTimeContrast() {
      this.CountLayoutype = "newMix";
      this.countLoading = true;
      let params = {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
        platform: this.searchForm.platform,
        project: this.formatSearch("project"),
        appid: this.formatSearch("appid"),
        channel: this.formatSearch("channel"),
        author_id: this.formatSearch("talent"),
        timeStart: this.searchForm.time[0] ? this.searchForm.time[0] : "",
        timeEnd: this.searchForm.time[1] ? this.searchForm.time[1] : "",
        target: this.target_id,
        time_contrast: {
          left: this.timeBegin,
          right: this.timeEnd,
        },
      };
      const [err, res] = await this.$http.post(
        "Operate_Invest/time_contrast",
        params
      );
      this.countLoading = false;
      if (err) {
        this.countdataoptions = {
          legendData: [],
          xAxisData: [],
          data: [],
          yAxis: [],
        };
        return;
      }
      let xAxisData = [];
      let yAxis = [];
      let obj1 = {
        data: [],
        name: this.timeBegin.join("~"),
        type: "line",
      };
      let obj2 = {
        data: [],
        name: this.timeEnd.join("~"),
        type: "line",
      };
      let sum1 = 0;
      let sum2 = 0;
      let avg1 = 0;
      let avg2 = 0;
      res.forEach((item) => {
        xAxisData.push(
          `${moment(item.left_date).format("YYYY-MM-DD")}\n${moment(
            item.right_date
          ).format("YYYY-MM-DD")}`
        );
        sum1 = sum1 + Number(item.left_value);
        sum2 = sum2 + Number(item.right_value);
        obj1.data.push(item.left_value);
        obj2.data.push(item.right_value);
      });
      avg1 = sum1 / res.length;
      avg2 = sum2 / res.length;
      this.totalInfo = [
        {
          avg: avg1,
          total: sum1,
          name: this.timeBegin.join("~"),
        },
        {
          avg: avg2,
          total: sum2,
          name: this.timeEnd.join("~"),
        },
      ];

      const idx = this.targetList.findIndex((el) => el.id == this.target_id);
      const title = this.targetList[idx].title;
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
      this.countdataoptions = {
        legendData: [this.timeBegin.join("~"), this.timeEnd.join("~")],
        xAxisData: xAxisData,
        yAxis,
        data: [obj1, obj2],
        formatter: (res) => {
          let html = ``;
          let arr = res[0].axisValueLabel.split("\n");
          res.forEach((v, i) => {
            html += `${arr[i]}<br/>${i == 0
              ? "<span ball style='width:10px;height: 10px;border-radius: 50%;background:#ffc706;display: inline-block;margin-right:4px;'></span>"
              : "<span ball style='width:10px;height: 10px;border-radius: 50%;background:#5291ec ;display: inline-block;margin-right:4px;'></span>"
              }${title}：${parseFloat(v.value).toLocaleString()}<br/>`;
          });
          html += `变化值：${(res[0].value - res[1].value + "").indexOf("-")
            ? `<span style='color: #ea5454'>${parseFloat(
              (res[0].value - res[1].value).toFixed(2)
            ).toLocaleString()}</span>`
            : `<span style='color: #17bf5e'>${parseFloat(
              (res[0].value - res[1].value).toFixed(2)
            ).toLocaleString()}</span>`
            }<br/>`;
          html += `变化率：${((res[0].value - res[1].value) / res[1].value + "").indexOf("-")
            ? `<span style='color: #ea5454'>${(
              ((res[0].value - res[1].value) / res[1].value) *
              100
            ).toFixed(2) + "%"
            }</span>`
            : `<span style='color: #17bf5e'>${(
              ((res[0].value - res[1].value) / res[1].value) *
              100
            ).toFixed(2) + "%"
            }</span>`
            }`;

          return html;
        },
      };
    },

    videoplay(url) {
      window.open(url);
    },

    /**
     * 指示看板的参数是由搜索栏的参数以及指示看板独享参数构成。
     * 比如说在搜索栏选择在项目，然后再独享中也选择的项目，之前
     * 搜索栏选择的项目会被覆盖
     */
    async getlaunchComparison() {
      if(!this.dimension_id) return
      this.countLoading = true;
      let params = {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
        platform: this.searchForm.platform,
        project: this.formatSearch("project"),
        appid: this.formatSearch("appid"),
        channel: this.formatSearch("channel"),
        admin_id: this.formatSearch("admin"),
        author_id: this.formatSearch("talent"),
        timeStart: this.searchForm.time[0] ? this.searchForm.time[0] : "",
        timeEnd: this.searchForm.time[1] ? this.searchForm.time[1] : "",
        group_id: this.dimension_id,
        target: this.target_id,
        boost_status: this.searchForm.boost_status,
      };
      let dimensionids = this.dimension_select_ids.appInfo.join()
        ? this.dimension_select_ids.appInfo.join()
        : undefined;
      if (this.dimension_selecetd.key && dimensionids) {
        params[this.dimension_selecetd.key] = dimensionids;
      }
      const [err, res] = await this.$http.post(
        "Operate_Invest/launchComparison",
        params
      );
      this.countLoading = false;
      if (err) return;
      const title = this.targetSelectedItem.title
        ? this.targetSelectedItem.title
        : "";
      const unit = this.targetSelectedItem.unit
        ? `（${this.targetSelectedItem.unit}）`
        : "";
      const yName = title + unit;
      let arr = [];

      // 数据从大到小排列
      let sort_arr = [];
      for (let i = 0; i < res.x.length; i++) {
        let obj = {
          x_v: res.x[i],
          y_v: res.y[i],
        };
        sort_arr.push(obj);
      }
      const newSortedArr = sort_arr.sort(this.sortarr("y_v")); // 已经排序过后的数组
      let newResX = [];
      let newResY = [];
      newSortedArr.forEach((el) => {
        newResX.push(el.x_v);
        newResY.push(el.y_v);
      });

      // 需要对百分比处理
      let percentage_arr = [
        "下单率",
        "支付成功率",
        "激活付费率",
        "总收入roi",
        "点击激活率",
        "完播率",
        "CVR",
        "CTR",
        'PVR',
        "有效播放率",
        "平均播放率",
        "负向评论率",
        "中立评论率",
        "正向评论率",
        "点击率",
      ];
      // 需要对千分位进行出来
      let format_att = [
        "账面消耗",
        "实际消耗",
        "返点金额",
        "新增",
        "下单数",
        "激活成本",
        "下单数",
        "支付成功数",
        "付费成本",
        "总收入",
        "订单收入",
        "广告收入",
        "客单价",
        "组件曝光",
        "组件点击",
        "ECPM",
        'CPC',
        '组件ecpm',
        "播放量",
        "评论量",
        "点赞量",
        "分享量",
        '一口价消耗',
        '助推消耗'
      ];
      const idx1 = percentage_arr.indexOf(title); // 需要乘以100+%
      const idx2 = format_att.indexOf(title);  // 保留两位小数
      if (idx1 > -1) {
        newResY.forEach((el) => {
          const e = `${(el * 100).toFixed(2)}`;
          arr.push(e);
        });
      } else if (idx2 > -1) {
        newResY.forEach((el) => {
          const e = (el * 1).toFixed(2);
          arr.push(e);
        });
      } else {
        arr = newResY;
      }
      const data = [
        {
          name: title,
          data: arr,
          showlabel: true, // 柱状图顶部是否显示文字
        },
      ];
      this.countdataoptions = {
        xAxisData: newResX,
        allName: false,
        data,
        yName,
        formatter: (res) => {
          let html = `${res[0].axisValueLabel}<br/>`;
          res.forEach((v) => {
            if (percentage_arr.indexOf(v.seriesName) > -1) {
              html += `${v.seriesName}：${v.value}%<br/>`;
            } else if (format_att.indexOf(v.seriesName) > -1) {
              html += `${v.seriesName}：${parseFloat(
                v.value
              ).toLocaleString()}<br/>`;
            }else{
              html += `${v.seriesName}：${v.value}<br/>`;
            }
          });
          return html;
        },
      };
    },
    sortarr(propName) {
      return function (a, b) {
        return b[propName] - a[propName];
      };
    },

    // 获取指标和维度数据
    async gettargetList() {
      const [err, res] = await this.$http.post("Operate_Invest/targetList", {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
      });
      if (err) return;
      this.targetList = res.target;
      const idx = res.target.findIndex((el) => el.title == "实际消耗");
      this.target_id = res.target[idx ? idx : 0].id; // 默认选择指标
      this.targetChange(res.target[idx ? idx : 0].id, true);
      this.dimensionList = res.groups;
      this.dimension_id = res.groups[0].id; // 默认选择维度
      this.dimensionchange(res.groups[0].id, true);  // 设置默认维度的子集
    },

    // 格式化请求参数
    formatSearch(name) {
      let data = this.searchForm[name].appInfo.join()
        ? this.searchForm[name].appInfo.join()
        : undefined;
      return data;
    },
    operationBoostStatus(val) {
      let arr = val ? val.split('|') : []
      let text = ''
      let color = '#F56C6C'
      arr.forEach(item => {
        switch (item) {
          case '自然超期':
            color = '#F56C6C'
            break;
          case '无助推':
            color = '#409EFF'
            break;
          case '助推中':
            color = '#F56C6C'
            break;
          default:
            color = '#909399'
            break;
        }
        text += `<div style="background:${color};color:#FFF;border-radius:5px;margin-bottom:5px;font-size:13px;padding:2px 5px;display:inline-block">${item}</div>`
      })
      return text
    },
    async getChannel() {
      const [err, res] = await this.$http.post("Operate_Invest/getChannel", {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
        project: this.formatSearch("project"),
        appid: this.formatSearch("appid"),
      });
      if (err) return;
      let arr = [];
      for (const i of res) {
        let obj = {
          id: i.channel,
          title: i.channel,
          subtitle: i.ad_id,
        };
        if (i.channel) {
          arr.push(obj);
        }
      }
      this.channel_id = arr;
    },
    async getAuthor() {
      const [err, res] = await this.$http.post("Operate_Invest/getAuthor", {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
        platform: this.searchForm.platform,
      });
      if (err) return;
      for (const i of res.author) {
        i.id = i.author_id;
        i.title = i.author_id;
        i.subtitle = i.author_name;
      }
      this.talent_id = res.author;
      for (const i of res.admin) {
        i.title = i.realname;
      }
      this.admin_id = res.admin;
    },
    async getOperateInvest() {
      if (this.selectDisabled) return
      this.selectDisabled = true
      this.tableData.loading = true;
      this.signboardLoding = true;
      const [err, res] = await this.$http.post("Operate_Invest/lists_new", {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
        list_group: this.group,
        platform: this.searchForm.platform,
        project: this.formatSearch("project"),
        appid: this.formatSearch("appid"),
        admin_id: this.formatSearch("admin"),
        channel: this.formatSearch("channel"),
        author_id: this.formatSearch("talent"),
        timeStart: this.searchForm.time[0] ? this.searchForm.time[0] : "",
        timeEnd: this.searchForm.time[1] ? this.searchForm.time[1] : "",
        currentPage: this.tableData.currentPage,
        pageSize: this.tableData.pageSize,
        boost_status: this.searchForm.boost_status,
        // order: this.sortablevale ? this.sortablevale : undefined,
        order: this.sort_order,
        prop: this.sort_prop,
      });
      this.selectDisabled = false
      if (err) {
        this.tableData.loading = false;
        this.signboardLoding = false;
        return false;
      }
         // 处理指示看板数据
      //    for (const i of this.signboardInfo) {
      //   i.number = res.sum[i.field] ? res.sum[i.field] : 0;
      // }

      // 需要保留整数
      let integer_arr = ['device_new', 'order_user', 'order_user_pay', 'show', 'click', 'play', 'comment', 'like', 'share']
      // 需要处理百分比
      let percent_arr = ['order_rate', 'order_pay_rate', 'add_pay_rate', 'total_income_roi', 'ctr', 'cvr', 'five_s_play_rate', 'finish_rate', 'play_rate', 'neg_rate', 'neu_rate', 'pos_rate', 'pvr']
      // 不需要格式化数据的字段
      let notFormatarr_of_id = [
        'ad_id', 'author_id','order_id','avatar_uri'
      ]
      // 处理均值和总值
      if (res.avg) {
        res.data.unshift(res.avg);
      }
      if (res.sum) {
        res.data.unshift(res.sum);
      }
      for (const i of res.data) {
        for (const key in i) {
          if (integer_arr.indexOf(key) > -1) {
            i[key] = i[key] ? Math.floor(i[key]).toLocaleString() : 0;
          } else if (percent_arr.indexOf(key) > -1) {
            i[key] = i[key] ? `${(i[key] * 100).toFixed(2)}%` : '0.00%';
          } else if ((Number(i[key]) || Number(i[key]) == 0) && notFormatarr_of_id.indexOf(key) == -1 ) {
            i[key] = i[key] ? `${parseFloat((i[key] * 1).toFixed(2)).toLocaleString()}` : '0.00';
          }
        }
      }

      //  // 处理指示看板数据
      for (const i of this.signboardInfo) {
        i.number = res.sum[i.field] ? res.sum[i.field] : 0;
      }

      res.data.splice(0, 2)  // 把统一处理好的总值和均值从data数组中删掉
      this.data_avg = res.avg
      this.data_sum = res.sum
      this.tableData.total = Number(res.total) || 0;
      this.tableData_data_temp = res.data
      this.signboardLoding = false;
      this.setFlexColumn()
    },
    // 获取筛选项表单数据
    async getRoleBtree() {
      const [err, res] = await this.$http.post("System/roleBtree", {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
      });
      if (err) return;
      this.department_id = res.tree;
      this.gettargetList(); // 获取【投放对比】指标
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
      this.apps_default = apps;
      this.apps = apps;
      this.article_id = article_id_arr;
    },
    setdefaultcolumn() {
      this.group = [1000, 1001, 1006, 1007, 1004, 1005];
    },
    removetag(e) {
      if (this.group.length < 1) {
        this.group = [e];
      }
    },
    // 维度固定
    changeTable(e) {
      if (this.group.length < 1) return;
      if (this.changeTableTimer) {
        clearTimeout(this.changeTableTimer)
      }
      this.changeTableTimer = setTimeout(() => {
        this.all = e.length == this.fixedcolumn.length ? true : false;
        this.tableData.currentPage = 1;
        this.getOperateInvest();
        // this.changeTableTimer = null
      }, 800)
      
    },
    // 维度全部隐藏或者是显示
    changeDimensional(e) {
      if (e) {
        let group = [];
        for (const i of this.fixedcolumn) {
          i.fixed = this.flexFlag;
          group.push(i.value);
        }
        this.group = group;
      } else {
        this.group = [1000];
      }
      this.tableData.currentPage = 1;
      this.getOperateInvest();
    },

    // 切换项目组之后筛选app
    changeApp(val) {
      this.searchForm.appid.appInfo = [];
      // this.getChannel()
      let apps_arr = [];
      if (val.appInfo && val.appInfo.length > 0) {
        val.appInfo.forEach((item) => {
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
        this.apps = apps_arr;
      } else {
        this.apps = this.apps_default;
      }
    },
    // 维度对比切换
    dimensionchange(val, isfirstload) {
      const e = this.dimensionList.findIndex((el) => el.id == val);
      if (e == -1) return;
      this.dimension_select_ids.appInfo = [];
      this.dimension_title = this.dimensionList[e].title;
      this.dimension_key = this.dimensionList[e].key;
      this.dimension_selecetd = this.dimensionList[e];
      if (e == 0) {
        this.dimension_data = this.article_id;
      } else if (e == 1) {
        this.dimension_data = this.apps;
      } else if (e == 2) {
        this.dimension_data = this.talent_id;
      } else if (e == 3) {
        this.dimension_data = this.channel_id;
      } else if (e == 4) {
        this.dimension_data = this.admin_id;
      }
      // 获取默认的维度子集选择
      this.setdefaultgroup(isfirstload);
    },
     // 获取默认的维度子集选择
    setdefaultgroup(isfirstload) {
      let arr_id = [];
      this.dimension_data.forEach((el, index) => {
        arr_id.push(el.id);
      });
      this.dimension_select_ids = {
        appInfo: isfirstload ? arr_id : this.dimension_data[0] ? [this.dimension_data[0].id] : [],
      };
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
      if (this.comparison_type == 2) {
        this.getTimeContrast();
      }
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
      if (this.comparison_type == 2) {
        this.getTimeContrast();
      }
    },
    // 维度对比和时间对比切换执行
    initKeyType(res) {
      if (this.comparison_type == res) return;
      if (res == 2) {
        this.initTime(); // 初始化时间对比
      } else if (res == 1) {
        this.CountLayoutype = "newBar";
        this.totalInfo = [];
        this.getlaunchComparison();
      }
      this.comparison_type = res;
    },
    // 指标改变
    targetChange(e, isdefault = false) {
      const idx = this.targetList.findIndex((el) => el.id == e);
      this.targetSelectedItem = this.targetList[idx];
      if (!isdefault && this.comparison_type == 1) {
        this.getlaunchComparison();
      } else if (this.comparison_type == 2) {
        this.getTimeContrast();
      }
    },
    // 维度对比子集切换
    dimensionitemchange(e) {
      // 防止重复请求
      if (
        (e.appInfo && e.appInfo.length == 0) 
        // || e.appInfo.length == this.last_dimension_selectids.length
      )
        return;
      this.last_dimension_selectids = e.appInfo;
      this.getlaunchComparison();
    },
    onSubmit() {
      this.tableData.currentPage = 1;
      if (this.tab_arr_index == 1) {
        this.getlaunchComparison(); // 获取指示看板
        this.getOperateInvest();
      } else {
        this.gettargetFinishList()
      }

    },
    getListFun(val, type) {
      if (type == 'size') {
        this.tableData.pageSize = val;
      } else if (type == 'page') {
        this.tableData.currentPage = val;
      }
      if (this.tab_arr_index == 1) {
        this.getOperateInvest();
      } else {
        this.gettargetFinishList()
      }
    },
    // 冻结维度
    changeTableList(e) {
      if (this.tab_arr_index == 1) {
        // 需要固定的字段
        this.fixedcolumn_temp.forEach(el => {
          el.fixed = e ? "left" : "";
        })
        this.column = this.fixedcolumn_temp.concat(this.paramDetailData.show)
      } else {
        for (const i of this.column) {
          if (this.fixedcolumn2.findIndex(el => el.prop == i.prop) > -1) {
            i.fixed = e ? "left" : "";
          }
        }

      }
    },
    // 设置表头
    setFlexColumn(arr) {
      let fixedcolumn = [];
      if (arr) {
        fixedcolumn = arr
      } else {
        for (const i of this.fixedcolumn) {
          if (this.group.indexOf(i.value) > -1) {
            fixedcolumn.push(i);
          }
        }
      }
      // 如果固定维度里面有达人信息需要显示视频
      const darenIndex = fixedcolumn.findIndex((el) => el.value == 1000);
      if (darenIndex > -1) {
        fixedcolumn = [...fixedcolumn, ...fixedcolumn[Number(darenIndex)].association]
      }

      // 处理助推状态
      const index2 = fixedcolumn.findIndex((el) => el.value == 1004 || el.value == 1005);
      if (index2 > -1) {
        fixedcolumn = [...fixedcolumn, ...fixedcolumn[Number(index2)].association]
      }

      // 处理回传状态
      const fixedcolumn1002_index = fixedcolumn.findIndex((el) => el.value == 1002);
      const fixedcolumn1005_index = fixedcolumn.findIndex((el) => el.value == 1005);
      if (fixedcolumn1002_index > -1 && fixedcolumn1005_index > -1) {
        fixedcolumn = [...fixedcolumn, ...fixedcolumn[fixedcolumn1002_index].association]
      }

      fixedcolumn.forEach(el => {
        el.fixed = this.flexFlag
      })
      fixedcolumn.sort(this.orts_fun('ordernum'))  // 固定字段排序
      this.fixedcolumn_temp = fixedcolumn
      this.column = fixedcolumn.concat(this.paramDetailData.show);
      // 处理均值和总值
      if (this.data_avg) {
        this.data_avg[fixedcolumn[0].prop] = "均值";
        this.data_avg.header_title = '均值'
        this.tableData_data_temp.unshift(this.data_avg);
      }
      if (this.data_sum) {
        this.data_sum[fixedcolumn[0].prop] = "总计";
        this.data_sum.header_title = '总计'
        this.tableData_data_temp.unshift(this.data_sum);
      }
      // 重新赋值方式数据格式错乱
      setTimeout(() => {
        this.tableData.loading = false;
        this.tableData.data = _.cloneDeep(this.tableData_data_temp)
        this.$refs.TableLayout.doLayout();
      }, 300);

    },
    orts_fun(arr) {
      return function (a, b) {
        var v1 = a[arr];
        var v2 = b[arr];
        return v1 - v2;
      };
    },
    onSortChange(e) {
      const idx = this.column.findIndex((el) => el.prop == e.prop);
      let order = e.order == "descending" ? "desc" : "asc";
      this.sort_order = order
      this.sort_prop = e.prop
      if (idx) {
        if (this.tab_arr_index == 1) {
          this.sortablevale = `${this.column[idx].field_id}_${order}`;
          this.getOperateInvest();
        } else {
          this.sortablevale = `${this.column2[idx].prop}:${order}`;
          this.gettargetFinishList();
        }
      }
    },
    // 重置表单
    initFrom() {
      this.searchForm = {
        //筛选项
        project: {
          appInfo: [],
        },
        appid: {
          appInfo: [],
        },
        platform: "",
        talent: {
          appInfo: [],
        },
        admin: {
          appInfo: [],
        },
        channel: {
          appInfo: [],
        },
        boost_status: "",
        time: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
      };
      this.tableData.currentPage = 1;
      if (this.tab_arr_index == 1) {
        this.getOperateInvest();
        this.getlaunchComparison();
      } else {
        this.gettargetFinishList()
      }
    },
    // 字段自定义展示
    async paramSave(val) {
      this.tableData.loading = true;
      const [err, res] = await this.$http.post("Business/paramSave", {
        cate: 20,
        ...val,
      });
      if (err) return;
      this.tableData.currentPage = 1
      this.getOperateInvest()
      this.getParamDetail();
    },
    // 获取自定义字段
    async getParamDetail() {
      this.tableData.loading = true;
      const [err, res] = await this.$http.post(
        "Operate_Invest/customFieldList",
        {
          loginId: store.get("user")["id"],
          loginToken: store.get("loginToken"),
        }
      );
      if (err) return;

      res.show.forEach((item) => {
        item.isSelect = false;
      });
      res.hidden.forEach((item) => {
        item.isSelect = false;
      });
      this.paramDetailData = res;
      // 获取自定义字段
      for (const k of this.paramDetailData.show) {
        k["prop"] = k.filed;
        k["label"] = k.value;
        k["sortable"] = k.order ? "custom" : false;
      }
    },
    // 右键鼠标复制视频地址栏
    onContextmenu(e,row) {
      console.log(e)
      this.$contextmenu({
        items: [
          {
            label: "复制视频地址",
            onClick: () => {
              let input = document.createElement("input"); // 创建input对象
              input.value = row; // 设置复制内容
              input.style.position = 'fixed'
              input.style.left = -999
              input.style.top = -999
              document.body.appendChild(input); // 添加临时实例
              input.select(); // 选择实例内容
              document.execCommand("Copy"); // 执行复制
              document.body.removeChild(input); // 删除临时实例
            }
          },
        ],
        event:e,
        zIndex: 3,
        minWidth: 100
      });
      return false;
    },
    initData() {
      let temp = [...this.paramDetailData.show, ...this.paramDetailData.hidden]
      let arr = []
      temp.forEach(el => {
        arr.push(el.field_id)
      })
      arr.sort((x, y) => {
        return x - y
      })
      this.$refs.TransferDialog.close()
      this.paramSave({ show: arr, hidden: [] })
    },
    jumpBoost(id) {
      const routeLink = this.$router.resolve({
        path: `/business_center/expenditure/operational_delivery?order_id=${id}`
      })
      window.open(routeLink.href, '_blank')

    }
  },
};
</script>

<style scoped lang="less">
.dash_board {
  margin: 20px 0;
  background: #fff;
}

.component_title {
  background: #fff;
  padding: 20px 0 10px 15px;
  font-weight: bold;
}

.component_title2 {
  background: #fff;
  padding: 1px 0 10px 15px;
  font-weight: bold;
}

.box {
  height: 150px;
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
    margin-bottom: 30px;
  }

  .num {
    font-weight: bold;
    font-size: 18px;
  }
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

.layoutcount-wrapper {
  background: #fff;
  padding: 20rpx;
  box-sizing: border-box;
}

.compared-wrapper {
  padding-left: 30px !important;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

/deep/.el-table--scrollable-x .el-table__body-wrapper {
  z-index: 1;
}

/deep/.el-col-lg-4-8 {
  width: 20%;
}

.ac {
  display: flex;
  align-items: center;
}

.dimension_title {
  margin-right: 4px;
}

.self-custom {

  // display: flex;
  // text-align: left;
  .avatar_uri {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    border-radius: 3px;
  }
}

.check-all {
  padding: 0 20px;
  text-align: right;
}

/deep/.el-table__body {
  width: 100%;
  // 使表格兼容safari，不错位
  table-layout: fixed !important;
}

/deep/ .left_box {
  height: 40px;
}

.among {
  font-size: 14px;
  display: inline-block;
  width: 50px;
  text-align: center;
}

.head_image_uri {
  width: 100px;
  height: 100px;
  object-fit: contain;
  cursor: pointer;
}

.tab-box {
  background: #fff;
  margin-top: 20px;
}

/deep/ .el-tabs__header {
  padding: 0 20px;
  box-sizing: border-box;
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
      right: -22%;
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
.author_name{
  color: #1890ff;
  cursor: pointer;
}
</style>
