<template>
  <div>
    <!-- 筛选项 -->
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit" width="100px">
      <el-col :md="6" :sm="12">
        <el-form-item label="投放平台" prop="platform">
          <el-select v-model="searchForm.platform" @change="changePlatform" placeholder="请选择">
            <el-option label="巨量引擎" :value="1"> </el-option>
            <el-option label="磁力引擎" :value="5"> </el-option>
          </el-select>
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
        <el-form-item label="投放渠道" prop="channel">
          <SelectCustomize
            :value="channelInfo"
            @changeScope="changeChannel"
            :data="channelIds"
          />
        </el-form-item>
      </el-col>

      <el-col :md="6" :sm="12">
        <el-form-item label="素材ID" prop="material_id">
          <SelectCustomize
            :value="material_idInfo"
            @changeScope="changeMaterial_id"
            :data="material_id"
          />
        </el-form-item>
      </el-col>

      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="筛选时间">
          <el-date-picker
            v-model="searchForm.time"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            :clearable="false"
            unlink-panels
          />
        </el-form-item>
      </el-col>
      <el-button @click="initFrom" slot="btn-option">重置筛选</el-button>
    </FilterLayout>
    <!-- 报表 -->
    <div class="bgf">
      <el-tabs v-model="activeName" type="card" @tab-click="getHMreport">
        <el-tab-pane name="first">
          <span slot="label">
            黑马视频
            <el-tooltip
              class="item"
              effect="dark"
              content="所选周期内的点击转化率（点击到付费）环比上一周期增长比例前10的素材"
              placement="right"
            >
              <i class="el-icon-info pbt0"></i>
            </el-tooltip>
          </span>

          <div class="show-test">
            <div class="line-bar-wrapper">
              本周期
              <div class="line-bar"></div>
            </div>
            <div class="line-bar-wrapper">
              上周期
              <div class="line-bar line-bar2"></div>
            </div>
          </div>
          <HMtableLayout
            :column="HMcolumn"
            :data="HMtableData.data"
            :loading="HMtableData.loading"
            @videoUrlClick="getMaterialGetVideoUrl"
          >
          </HMtableLayout>
        </el-tab-pane>
        <el-tab-pane label="衰减视频" name="second">
          <span slot="label">
            衰减视频
            <el-tooltip
              class="item"
              effect="dark"
              content="所选周期内的点击转化率（点击到付费）环比上一周期衰减比例前10的素材"
              placement="right"
            >
              <i class="el-icon-info pbt0"></i>
            </el-tooltip>
          </span>

          <div class="show-test">
            <div class="line-bar-wrapper">
              本周期
              <div class="line-bar"></div>
            </div>
            <div class="line-bar-wrapper">
              上周期
              <div class="line-bar line-bar2"></div>
            </div>
          </div>
          <HMtableLayout
            :column="HMcolumn"
            :data="HMtableData.data"
            :loading="HMtableData.loading"
            @videoUrlClick="getMaterialGetVideoUrl"
          >
          </HMtableLayout>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 趋势对比 -->
    <CountLayout
      :option="countData.data"
      :loading="countData.loading"
      :countInfoArr="countData.totalInfo"
      type="newMix"
    >
      <div class="component_title mrg_btn" slot="title">趋势对比</div>
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
            filterable
            @change="changeDepart"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="(item, index) in departDatas"
              :key="index"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="form.c_group"
            placeholder="请选择"
            multiple
            collapse-tags
            filterable
            @change="selectAll"
            :popper-append-to-body="false"
          >
            <el-option label="全选" value="all"></el-option>
            <el-option
              v-for="(item, index) in infoDeparts"
              :key="index"
              :label="item.title"
              :value="item.id"
            >
              <span
                class="iconfont"
                :class="item.system ? formatSystemIcon(item.system) : ''"
                >{{ item.title }}</span
              >
            </el-option>
          </el-select>
        </el-col>
        <el-col :md="12" :sm="12" v-if="form.comparison_type == 3">
          <el-date-picker
            v-model="timeBegin"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @blur="changeTimeEnd"
            :picker-options="pickerOptions0"
            :append-to-body="false"
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
            :append-to-body="false"
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
      :leftFlag="leftFlag"
      :defaultSort="sortList"
      alignStyle="center"
      :leadOut="true"
      :PropStr="PropStr"
      leadApi="Material/list"
      :channelFlag="true"
      :videoFlag="true"
      @videoUrlClick="getMaterialGetVideoUrl"
      @pageChange="onPageChange"
      @sizeChange="onSizeChange"
      @sortChange="onSortChange"
      @changeSourceInfo="changeSourceInfo"
      :infoFlag="searchForm.platform"
    >
      <div class="component_title2" slot="title">数据报表</div>
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
            @change="dataDimension"
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
        <!-- postApi="Material/paramDetail"
          :postParams="customFieldParams" -->
        <TransferDialog
          :data1="this.paramDetailData.showField"
          :data2="this.paramDetailData.hiddenField"
          :changeData="changeData"
          @paramSave="paramSave"
          @initData="initData"          transferCard="sourceMaterial"
          :key="num"
        />
      </div>
    </TableLayout>

    <el-drawer
      class="my-drawer"
      size="70%"
      :visible.sync="drawer"
      :direction="direction"
    >
      <div class="drawer-header">
        <div>
          <!-- <img
            src="@/asset/img/video_info.jpg"
            class="video_img"
            alt=""
            style="cursor: pointer"
            v-if="tableInfo.material_url"
          /> -->

          <video
            v-if="materialGetVideoUrlInfo.url"
            ref="Myvideo"
            controls
            style="padding: 0 20px"
            width="200"
            height="240"
          >
            <source :src="materialGetVideoUrlInfo.url" type="video/mp4" />
          </video>

          <img
            src="@/asset/img/video_node.png"
            class="video_img"
            alt=""
            v-else
          />
        </div>
        <div style="padding: 0 50px 0 0">
          <p>
            <span>ID：{{ tableInfo.material_id }}</span>
            <span
              style="padding: 0 20px"
              v-if="
                materialGetVideoUrlInfo && materialGetVideoUrlInfo.create_time
              "
              >创建时间：{{ materialGetVideoUrlInfo.create_time }}</span
            >
            <span
              v-if="materialGetVideoUrlInfo && materialGetVideoUrlInfo.duration"
              >视频时长：{{ materialGetVideoUrlInfo.duration }}</span
            >
          </p>
          <p>
            <el-dropdown trigger="click" @command="changeDropDown">
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i
                >{{ dropdown1 }}:{{ tableInfoData[dropdownData[0]] }}
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="cost" :disabled="cost"
                  >总花费</el-dropdown-item
                >
                <el-dropdown-item command="show" :disabled="show"
                  >曝光数</el-dropdown-item
                >
                <el-dropdown-item command="convert" :disabled="convert"
                  >转化数</el-dropdown-item
                >
                <el-dropdown-item command="click" :disabled="click"
                  >点击数</el-dropdown-item
                >
                <el-dropdown-item command="ctr" :disabled="ctr"
                  >点击率</el-dropdown-item
                >
                <el-dropdown-item
                  command="convert_cost"
                  :disabled="convert_cost"
                  >转化成本</el-dropdown-item
                >
                <el-dropdown-item
                  command="convert_rate"
                  :disabled="convert_rate"
                  >转化率</el-dropdown-item
                >
                <el-dropdown-item command="cpm" :disabled="cpm"
                  >平均千次展示费用</el-dropdown-item
                >
                <el-dropdown-item
                  command="avg_click_cost"
                  :disabled="avg_click_cost"
                  >平均点击成本</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown
              trigger="click"
              @command="changeDropDown2"
              style="padding: 0 20px"
            >
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i
                >{{ dropdown2 }}:{{ tableInfoData[dropdownData[1]] }}
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="cost" :disabled="cost"
                  >总花费</el-dropdown-item
                >
                <el-dropdown-item command="show" :disabled="show"
                  >曝光数</el-dropdown-item
                >
                <el-dropdown-item command="convert" :disabled="convert"
                  >转化数</el-dropdown-item
                >
                <el-dropdown-item command="click" :disabled="click"
                  >点击数</el-dropdown-item
                >
                <el-dropdown-item command="ctr" :disabled="ctr"
                  >点击率</el-dropdown-item
                >
                <el-dropdown-item
                  command="convert_cost"
                  :disabled="convert_cost"
                  >转化成本</el-dropdown-item
                >
                <el-dropdown-item
                  command="convert_rate"
                  :disabled="convert_rate"
                  >转化率</el-dropdown-item
                >
                <el-dropdown-item command="cpm" :disabled="cpm"
                  >平均千次展示费用</el-dropdown-item
                >
                <el-dropdown-item
                  command="avg_click_cost"
                  :disabled="avg_click_cost"
                  >平均点击成本</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown
              trigger="click"
              @command="changeDropDown3"
              style="padding: 0 20px 0 0"
            >
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i
                >{{ dropdown3 }}:{{ tableInfoData[dropdownData[2]] }}
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="cost" :disabled="cost"
                  >总花费</el-dropdown-item
                >
                <el-dropdown-item command="show" :disabled="show"
                  >曝光数</el-dropdown-item
                >
                <el-dropdown-item command="convert" :disabled="convert"
                  >转化数</el-dropdown-item
                >
                <el-dropdown-item command="click" :disabled="click"
                  >点击数</el-dropdown-item
                >
                <el-dropdown-item command="ctr" :disabled="ctr"
                  >点击率</el-dropdown-item
                >
                <el-dropdown-item
                  command="convert_cost"
                  :disabled="convert_cost"
                  >转化成本</el-dropdown-item
                >
                <el-dropdown-item
                  command="convert_rate"
                  :disabled="convert_rate"
                  >转化率</el-dropdown-item
                >
                <el-dropdown-item command="cpm" :disabled="cpm"
                  >平均千次展示费用</el-dropdown-item
                >
                <el-dropdown-item
                  command="avg_click_cost"
                  :disabled="avg_click_cost"
                  >平均点击成本</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="click" @command="changeDropDown4">
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i
                >{{ dropdown4 }}:{{ tableInfoData[dropdownData[3]] }}
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="cost" :disabled="cost"
                  >总花费</el-dropdown-item
                >
                <el-dropdown-item command="show" :disabled="show"
                  >曝光数</el-dropdown-item
                >
                <el-dropdown-item command="convert" :disabled="convert"
                  >转化数</el-dropdown-item
                >
                <el-dropdown-item command="click" :disabled="click"
                  >点击数</el-dropdown-item
                >
                <el-dropdown-item command="ctr" :disabled="ctr"
                  >点击率</el-dropdown-item
                >
                <el-dropdown-item
                  command="convert_cost"
                  :disabled="convert_cost"
                  >转化成本</el-dropdown-item
                >
                <el-dropdown-item
                  command="convert_rate"
                  :disabled="convert_rate"
                  >转化率</el-dropdown-item
                >
                <el-dropdown-item command="cpm" :disabled="cpm"
                  >平均千次展示费用</el-dropdown-item
                >
                <el-dropdown-item
                  command="avg_click_cost"
                  :disabled="avg_click_cost"
                  >平均点击成本</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </p>
        </div>
        <div style="line-height: 80px">
          <el-date-picker
            v-model="drawerInfoTime"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            :clearable="false"
            unlink-panels
            @change="changeDrawerInfoTime"
          />
        </div>
      </div>
      <el-tabs
        v-model="active"
        tab-position="left"
        type="border-card"
        style="height: 800px"
        @tab-click="changeTabs"
      >
        <el-tab-pane label="视频互动" name="sphd">
          <VideoInteractions
            :requestObj="requestObj"
            :videoInteractionsList="videoInteractionsList"
            :subNum="subNum"
            @changeVideoTime="changeVideoTime"
          />
        </el-tab-pane>
        <el-tab-pane label="版位数据" name="bwsj" class="tab_pane_overflot">
          <PositionData :requestObj="requestObj2" />
        </el-tab-pane>
        <el-tab-pane label="账户细分" name="zhxf" class="tab_pane_overflot">
          <AccountInfo :requestObj="requestObj3" :subNum="subNum2" />
        </el-tab-pane>
        <el-tab-pane label="文案效果" name="waxg" class="tab_pane_overflot">
          <CopyWriter :requestObj="requestObj4" />
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script>
import moment from "moment";
import store from "store2";
import CountLayout from "@/layout/count";
import { Mydata } from "./mixins/advertisement.js";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import HMtableLayout from "./component/tabel";
import VideoInteractions from "./component/videoInteractions";
import PositionData from "./component/positionData";
import AccountInfo from "./component/accountInfo";
import CopyWriter from "./component/copyWriter";
import TransferDialog from "@/layout/transferDialog";
import SelectCustomize from "@/component/select-customize";

export default {
  mixins: [Mydata],
  data() {
    return {
      num: 1,
      subNum: 1,
      subNum2:1,
      PositionDataList: {},
      videoInteractionsList: {},
      requestObj: {},
      requestObj2: {},
      requestObj3: {},
      requestObj4: {},
      drawerInfoTime: [],
      tableInfo: {},
      tableInfoData:{},
      active: "sphd",
      PropStr: "",
      drawer: false,
      direction: "rtl",
      //筛选项
      searchForm: {
        project: [],
        appid: [],
        system: [],
        platform: 1,
        channel: [],
        material_id: [],
        time: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
      },
      departDatas: [],
      infoDeparts: [],
      changeCheckList: [],
      sumList: [],
      avgList: [],
      projectInfo: {
        appInfo: [],
      },
      appidInfo: {
        appInfo: [],
      },
      systemInfo: {
        appInfo: [],
      },
      channelInfo: {
        appInfo: [],
      },
      material_idInfo: {
        appInfo: [],
      },
      //趋势对比
      form: {
        key: 0,
        comparison_type: "",
        c_key: "",
        c_type: "",
        c_group: [],
      },
      countData: {
        data: {},
        totalInfo: [],
        loading: false,
      },
      compareKey: [],
      key: [],
      timeBegin: [],
      timeEnd: [],
      // 数据报表
      tableData: {
        data: [],
        total: 0,
        currentPage: 1,
        pageSize: 10,
        loading: false,
      },
      HMtableData: {
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
      HMtableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      group: [1006],
      paramDetailData: {
        showField: [],
        hiddenField: [],
      },
      department_id: [],
      article_id: [],
      plat_pictLoading: false,
      all: false,
      flexFlag: false,
      appAll: false,
      articleAll: false,
      channelIds: [],
      material_id: [],
      activeName: "first",
      leftFlag: "",
      listData: [],
      changeData: "",
      dropdown1: "总花费",
      dropdown2: "曝光数",
      dropdown3: "转化数",
      dropdown4: "点击数",
      cost: true,
      show: true,
      convert: true,
      click: true,
      ctr: false,
      convert_cost: false,
      convert_rate: false,
      cpm: false,
      avg_click_cost: false,
      cost_pay_cost: true,
      click_pay_rate: true,
      dropdownData: [
        "cost",
        "show",
        "convert",
        "click",
        "ctr",
        "convert_cost",
        "convert_rate",
        "cpm",
        "avg_click_cost",
      ],
      dropdownObj: {
        cost: "总花费",
        show: "曝光数",
        convert: "转化数",
        click: "点击数",
        ctr: "点击率",
        convert_cost: "转化成本",
        convert_rate: "转化率",
        cpm: "平均千次展示费用",
        avg_click_cost: "平均点击成本",
      },
      materialGetVideoUrlInfo: {
        url: "",
      },
      timer: null,

      sortList: {
        prop:"",
        order:""
      },
      sort: {
        prop: "cost",
        order: "descending",
      },
    };
  },
  components: {
    CountLayout,
    TransferDialog,
    TableLayout,
    FilterLayout,
    SelectCustomize,
    HMtableLayout,
    VideoInteractions,
    PositionData,
    AccountInfo,
    CopyWriter,
  },
  computed: {
    /* videoSource: function () {
      return ``;
    }, */
    customFieldParams(){
      return {
        timeStart: this.searchForm["time"][0],
        timeEnd: this.searchForm["time"][1],
        cate: 3,
        platform: this.searchForm.platform,
      }
    },
    changeColumn() {
      let arr = [];
      let columu = [
        {
          label: "日期",
          prop: "date",
          value: 1000,
        },
        {
          label: "项目",
          prop: "project",
          value: 1001,
        },
        {
          label: "应用",
          prop: "app_title",
          value: 1002,
        },
        {
          label: "系统",
          prop: "system_title",
          value: 1003,
        },
        {
          label: "投放平台",
          prop: "platform",
          value: 1004,
        },
        {
          label: "投放渠道",
          prop: "channel",
          value: 1005,
        },
        {
          label: "视频",
          prop: "material_id",
          value: 1006,
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
          });
        });
      } else {
        arr = [...columu];
      }
      let index_num = -1;
      arr.forEach((item, index) => {
        if (item.prop == "material_id") {
          this.PropStr = "material_id";
          index_num = index;
        } else {
          this.PropStr = "";
          index_num = -1;
        }
      });
      if (index_num != -1) {
        arr.splice(index_num, 1);
        all["video"] = "总计";
        mean["video"] = "均值";
      } else {
        all[arr[0].prop] = "总计";
        mean[arr[0].prop] = "均值";
      }
      this.paramDetailData.showField.forEach((item) => {
        this.column.forEach((_item) => {
          if (item.value == _item.label) {
            all[_item.prop] = this.sumList[_item.prop];
            mean[_item.prop] = this.avgList[_item.prop];
            arr.push({
              label: item.value,
              prop: _item.prop,
              width: _item.width,
              sortable: _item.sortable,
            });
          }
        });
      });
      if (!this.tableData.data.length) {
        return;
      }
      this.tableData.data = [all, mean, ...this.listData];

      this.tableData.data.forEach((item) => {
        if (item.date != "总计" && item.date != "均值" && weekFlag) {
          item.week = item.date ? moment(item.date).format("dddd") : "";
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
  mounted() {
    this.getDashboardSetting();
  },
  methods: {
    changeTabs(val) {
      console.log(this.requestObj);
      console.log(val.name);
      if (val.name == "bwsj") {
        this.requestObj2 = JSON.parse(JSON.stringify(this.requestObj))
      }
      if (val.name == "zhxf") {
        this.requestObj3 = JSON.parse(JSON.stringify(this.requestObj))
        this.subNum2 += 1
      }
      if (val.name == "waxg") {
        this.requestObj4 = JSON.parse(JSON.stringify(this.requestObj))
      }
      if (val.name == 'sphd') {
        this.subNum += 1;
      }
    },
    changeSourceInfo(data) {
      this.drawer = true;
      this.tableInfo = data;
      this.active = "sphd";
      this.drawerInfoTime = this.searchForm.time;
      this.getMaterialToAdvertiser();
      this.getMaterialGetVideoUrl();
      this.getInfoData()
    },
    async changePlatform(){
      this.searchForm.project = []
      this.searchForm.appid = [];
      this.searchForm.channel = [];
      this.searchForm.material_id = [];
      this.projectInfo.appInfo= [];
      this.appidInfo.appInfo = [];
      this.channelInfo.appInfo = [];
      this.material_idInfo.appInfo = [];
      this.systemInfo.appInfo = []
      this.searchForm.system = []
      this.getRoleBtree()
    },
    async changeArticle(val) {
      this.searchForm.project = val.appInfo;
      this.searchForm.appid = [];
      this.searchForm.channel = [];
      this.searchForm.material_id = [];
      this.appidInfo.appInfo = [];
      this.channelInfo.appInfo = [];
      this.material_idInfo.appInfo = [];
      this.systemInfo.appInfo = []
      this.searchForm.system = []
      const { searchForm } = this;
      const [err, res] = await this.$http.post("Material/filtrate", {
        ...searchForm,
        timeStart: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });
      this.apps = res.list[3].children;
      this.channelIds = res.list[1].children;
      this.material_id = res.list[0].children;
    },
    async changeAppid(val) {
      this.searchForm.appid = val.appInfo;
      this.searchForm.channel = [];
      this.searchForm.material_id = [];
      this.channelInfo.appInfo = [];
      this.material_idInfo.appInfo = [];
      this.systemInfo.appInfo = []
      this.searchForm.system = []
      const { searchForm } = this;
      const [err, res] = await this.$http.post("Material/filtrate", {
        ...searchForm,
        timeStart: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });
      this.channelIds = res.list[1].children;
      this.material_id = res.list[0].children;
    },
    // 获取筛选项
    async getAdFiltrate(val) {
      if (val) {
        this.searchForm.appid = val.appInfo
          ? val.appInfo
          : this.searchForm.appid;
      }
      this.plat_pictLoading = true;
      const { searchForm } = this;
      const [err, res] = await this.$http.post("Material/filtrate", {
        ...searchForm,
        timeStart: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });
      if (err) {
        this.plat_pictLoading = false;
        return;
      }
      if (!res.list) {
        this.plat_pictLoading = false;
        return;
      }
      res.list.splice(2, 1);
      this.departDatas = [...res.list];
      this.plat_pictLoading = false;
    },
    // 获取app部门分组
    async getRoleBtree() {
      const { searchForm } = this;
      const [err, res] = await this.$http.post("Material/filtrate", {
        ...searchForm,
        timeStart: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });
      if (err) return;
      this.apps = res.list[3].children;
      this.article_id = res.list[4].children;
      this.channelIds = res.list[1].children;
      this.material_id = res.list[0].children;
    },
    async changeChannel(val) {
      this.searchForm.channel = val.appInfo;
      this.searchForm.material_id = [];
      this.material_idInfo.appInfo = [];
      const { searchForm } = this;
      const [err, res] = await this.$http.post("Material/filtrate", {
        ...searchForm,
        timeStart: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });
      this.material_id = res.list[0].children;
    },
    async changeMaterial_id(val) {
      this.searchForm.material_id = val.appInfo;
    },
    async getDashboardSetting() {
      this.getParamDetail();
      this.getReport();
      this.fetchCount();
      this.changePlatform();
      this.getAdFiltrate();
      this.getParamList();
      this.getHMreport();
    },
    changeSystem(val) {
      this.searchForm.system = val.appInfo;
    },
    async getParamList() {
      const [err, res] = await this.$http.post("Material/paramList", {
        platform: this.searchForm.platform,
      });
      if (err) return;
      this.key = res;
    },
    // 黑马视频
    async getHMreport() {
      this.HMtableData.loading = true;
      const { searchForm, activeName, HMtableOpt } = this;
      const [err, res] = await this.$http.post("Material/report", {
        ...searchForm,
        timeStart: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
        up_down: activeName == "first" ? 1 : 0,
        ...HMtableOpt,
      });
      if (err) {
        this.HMtableData.loading = false;
        this.HMtableData.data = [];
        return;
      }
      const { list, currentPage, total } = res;
      list.forEach((el) => {
        el.stat_datetime = moment(el.stat_datetime).format("YYYY-MM-DD");
      });
      this.HMtableData.loading = false;
      this.HMtableData.data = list;
      this.HMtableData.currentPage = currentPage;
      this.HMtableData.total = total;
    },
    onSubmit() {
      this.sort = {
        prop: "cost",
        order: "descending",
      };
      this.tableOpt.currentPage = 1;
      this.HMtableOpt.currentPage = 1
      this.getParamDetail();
      this.fetchCount();
      this.getReport();
      this.getHMreport();
      this.getParamList();
    },
    initFrom() {
      this.searchForm = {
        project: [],
        appid: [],
        system: [],
        platform: 1,
        channel: [],
        material_id: [],
        time: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
      };
      this.projectInfo.appInfo = [];
      this.appidInfo.appInfo = [];
      this.getDashboardSetting();
    },
    changeComparisonKey(res) {
      let arr = [];
      this.key.forEach((item) => {
        if (item.id !== res) {
          arr.push(item);
        }
      });
      this.compareKey = arr;
      this.fetchCount();
    },
    async fetchCount() {
      const { searchForm, form, timeBegin, timeEnd } = this;
      this.countData.loading = true;
      const [err, res] = await this.$http.post("Material/comparison", {
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
      this.countData.totalInfo = totalInfo;
      totalInfo.forEach((item) => {
        if (this.nameArr.indexOf(item.name) !== -1) {
          item.avg = (item.avg * 100).toFixed(2) + "%";
          item.total = (item.total * 100).toFixed(2) + "%";
          item.hasPercentSign = true;
        }
      });
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
          xAxisData.push(moment(item.startDate).format("YYYY-MM-DD"));
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
                  ? 100
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
                  ? 100
                  : Math.max(...data[1].data),
              min: 0,
            },
          ],
          formatter: (res) => {
            let html = `${res[0].axisValueLabel}<br/>`;
            res.forEach((v) => {
              html += `${v.marker}${v.seriesName}：${
                this.nameArr.indexOf(v.seriesName) >= 0
                  ? (v.value * 100).toFixed(2) + "%"
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
          xAxisData.push(moment(item.startDate).format("YYYY-MM-DD"));
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
        this.countData.data = {
          legendData: data,
          xAxisData: xAxisData,
          data: data,
          yAxis,
          formatter: (res) => {
            let html = `${res[0].axisValueLabel}<br/>`;
            res.forEach((v) => {
              html += `${v.marker}${v.seriesName}<br/>${title}：${parseFloat(
                v.value
              ).toLocaleString()}<br/>`;
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
                  ? "<span ball style='width:10px;height: 10px;border-radius: 50%;background:#5291ec;display: inline-block;margin-right:4px;'></span>"
                  : "<span ball style='width:10px;height: 10px;border-radius: 50%;background:#ffc706;display: inline-block;margin-right:4px;'></span>"
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
        const _data = data.map((item) => {
          return {
            ...item,
          };
        });
        date.forEach((item) => {
          xAxisData.push(moment(item.startDate).format("YYYY-MM-DD"));
        });
        yAxis = [
          {
            type: "value",
            name:
              this.nameArr.indexOf(data[0].name) >= 0
                ? data[0].name + "(%)"
                : data[0].name,
            min: null,
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
        this.countData.data = {
          legendData: data,
          xAxisData: xAxisData,
          data: _data,
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
          this.key.forEach((item, index) => {
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
          this.form.c_type = this.departDatas[0].id;
          this.infoDeparts = [...this.departDatas[0].children];
          this.form.c_group = [this.departDatas[0].children[0].id];
          this.fetchCount();
          break;
        case 3: {
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
    changeDepart(val) {
      this.infoDeparts = [];
      this.form.c_group = [];
      this.departDatas.forEach((item) => {
        if (item.id == val) {
          this.infoDeparts = [...item.children];
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
    // 数据报表
    onPageChange(current) {
      this.tableOpt.currentPage = current;
      this.getReport();
    },
    onSizeChange(current) {
      this.tableOpt.pageSize = current;
      this.getReport();
    },
    async getReport() {
      this.tableData.loading = true;
      const { searchForm, group, tableOpt, sort } = this;
      const [err, res] = await this.$http.post("Material/list", {
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
        this.tableData.data = [];
        this.listData = [];
        return;
      }
      const { list, currentPage, total, sumList, avgList } = res;
      list.forEach((item) => {
        item.date = moment(item.date).format("YYYY-MM-DD");
        for (const key in item) {
          if (this.keyArr.indexOf(key) >= 0) {
            item[key] = (item[key] * 100).toFixed(2) + "%";
          }
          if (this.numKeyArr.indexOf(key) >= 0) {
            item[key] = parseFloat(item[key]).toLocaleString();
          }
        }
      });

      for (const key in sumList) {
        if (this.keyArr.indexOf(key) >= 0) {
          sumList[key] = (sumList[key] * 100).toFixed(2) + "%";
        }
        if (this.numKeyArr.indexOf(key) >= 0) {
          sumList[key] = parseFloat(sumList[key]).toLocaleString();
        }
      }
      for (const key in avgList) {
        if (this.keyArr.indexOf(key) >= 0) {
          avgList[key] = (avgList[key] * 100).toFixed(2) + "%";
        }
        if (this.numKeyArr.indexOf(key) >= 0) {
          avgList[key] = parseFloat(avgList[key]).toLocaleString();
        }
      }
      this.listData = list;
      this.tableData.data = list;
      this.tableData.currentPage = currentPage;
      this.tableData.total = total;
      this.sumList = sumList;
      this.avgList = avgList;
    },
    async getParamDetail() {
      const [err, res] = await this.$http.post("Material/paramDetail", {
        timeStart: this.searchForm["time"][0],
        timeEnd: this.searchForm["time"][1],
        cate: 3,
        platform: this.searchForm.platform,
      });
      if (err) return;
      res.showField.forEach((item) => {
        item.isSelect = false;
      });
      res.hiddenField.forEach((item) => {
        item.isSelect = false;
      });
      if (this.searchForm.platform == 1) {
        this.changeData = "1";
      } else if (this.searchForm.platform == 5) {
        this.changeData = "5";
      }
      this.num += 1;
      this.paramDetailData = res;
    },
    async paramSave(val) {
      this.tableData.loading = true;
      const [err, res] = await this.$http.post("Material/paramSave", {
        cate: 3,
        platform: this.searchForm.platform,
        timeStart: this.searchForm["time"][0],
        timeEnd: this.searchForm["time"][1],
        ...val,
      });
      if (err) return;
      this.getParamDetail();
      this.getReport();
    },
    initData(val) {
      this.getParamDetail();
      this.getReport();
    },
    onSortChange(data) {
      const { prop, order } = data;
      this.sort = { prop, order };
      this.tableOpt.currentPage = 1;
      this.getReport();
    },
    changeDimensional(val) {
      if (val) {
        this.group = [1006, 1000, 1001, 1002, 1003, 1004, 1005];
      } else {
        this.group = [1006];
      }
      this.getReport();
    },
    // 冻结列表
    changeTableList(val) {
      this.group.forEach((item) => {
        this.column.forEach((_item) => {
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
      if (val) {
        this.leftFlag = "left";
      } else {
        this.leftFlag = null;
      }
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
    async getMaterialToAdvertiser() {
      const [err, res] = await this.$http.post(
        "Material_Info/materialToAdvertiser",
        {
          advertiser_id: this.tableInfo.advertiser_id,
          material_id: this.tableInfo.material_id,
          time_start: this.drawerInfoTime[0],
          time_end: this.drawerInfoTime[1],
        }
      );
      if (err) {
        return;
      }
      this.videoInteractionsList = res;
      this.requestObj = {
        advertiser_id: this.tableInfo.advertiser_id,
        material_id: this.tableInfo.material_id,
        time_start: this.drawerInfoTime[0],
        time_end: this.drawerInfoTime[1],
      };
    },
    // 获取视频链接
    async getMaterialGetVideoUrl(v) {
      // 重置
      this.materialGetVideoUrlInfo = {
        url: "",
      };
      const [err, res] = await this.$http.post(
        "Material_Info/materialGetVideoUrl",
        {
          advertiser_id: this.tableInfo.advertiser_id
            ? this.tableInfo.advertiser_id
            : v.data.advertiser_id,
          material_id: this.tableInfo.material_id
            ? this.tableInfo.material_id
            : v.data.material_id,
          time_start: this.drawerInfoTime[0],
          time_end: this.drawerInfoTime[1],
        }
      );
      if (err) {
        return;
      }
      // 有type表示打开视频链接，巨量引擎和磁力引擎方式不一样；巨量引擎不再列表中返回URL
      if (v && v.type == "openDialog") {
        if (res&&res.url) {
          window.open(res.url);
        }else{
          this.$message.error('未获取到视频播放地址');
        }
      } else {
        res.duration = this.formatSeconds(res.duration);
        this.materialGetVideoUrlInfo = res;
      }
    },
    //秒数转化为时分秒
    formatSeconds(value) {
      var secondTime = parseInt(value); // 秒
      var minuteTime = 0; // 分
      var hourTime = 0; // 小时
      if (secondTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取余，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取余的分，获取分钟除以60取余的分
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      var result = "" + parseInt(secondTime) + "秒";

      if (minuteTime > 0) {
        result = "" + parseInt(minuteTime) + "分" + result;
      }
      if (hourTime > 0) {
        result = "" + parseInt(hourTime) + "小时" + result;
      }
      return result;
    },
    // 改变下拉框
    changeDropDown(val) {
      let str = this.dropdownData[0];
      this[str] = false;
      this[val] = true;
      this.dropdownData[0] = val;
      for (const key in this.dropdownObj) {
        if (val === key) {
          this.dropdown1 = this.dropdownObj[key];
        }
      }
    },
    changeDropDown2(val) {
      let str = this.dropdownData[1];
      this[str] = false;
      this[val] = true;
      this.dropdownData[1] = val;
      for (const key in this.dropdownObj) {
        if (val === key) {
          this.dropdown2 = this.dropdownObj[key];
        }
      }
    },
    changeDropDown3(val) {
      let str = this.dropdownData[2];
      this[str] = false;
      this[val] = true;
      this.dropdownData[2] = val;
      for (const key in this.dropdownObj) {
        if (val === key) {
          this.dropdown3 = this.dropdownObj[key];
        }
      }
    },
    changeDropDown4(val) {
      let str = this.dropdownData[3];
      this[str] = false;
      this[val] = true;
      this.dropdownData[3] = val;
      for (const key in this.dropdownObj) {
        if (val === key) {
          this.dropdown4 = this.dropdownObj[key];
        }
      }
    },
    // 改变时间重新请求接口
    changeDrawerInfoTime(val) {
      this.getInfoData()
      this.getMaterialToAdvertiser();
    },
    changeVideoTime(val) {
      this.$refs.Myvideo.currentTime =
        val[0].axisValueLabel !== ""
          ? Number(val[0].axisValueLabel)
          : val[0].axisValueLabel;
      // if (this.timer) {
      //   // 如果在timeout秒调用 清空定时器
      //   clearTimeout(this.timer);
      // }
      // // 每次调用都指定timeout后再执行
      // this.timer = setTimeout(() => {
      //   this.timer = null;
      //   this.$refs.Myvideo.currentTime =
      //     val[0].axisValueLabel !== ""
      //       ? Number(val[0].axisValueLabel)
      //       : val[0].axisValueLabel;
      // }, 500);
    },
    dataDimension(val){
      this.tableOpt.currentPage = 1
      this.getReport();
    },
    async getInfoData(){
      const [err, res] = await this.$http.post(
        "Material_Info/materialInfo",
        {
          advertiser_id: this.tableInfo.advertiser_id,
          material_id: this.tableInfo.material_id,
          time_start: this.drawerInfoTime[0],
          time_end: this.drawerInfoTime[1],
        }
      );
      if (err) {
        return;
      }
      this.tableInfoData = res
    }
  },
  watch:{
    changeColumn: {
      handler: function(cur, old){
       if (cur) {
        this.sortList.prop = this.sort.prop;
        this.sortList.order = this.sort.order;
       }
      },
      deep: true, //对象内部的属性监听，也叫深度监听
    },
  }
};
</script>

<style lang="less" scoped>
.bgf {
  background: #fff;
  margin: 20px 0;
}
.fl_rigth {
  background: #fff;
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 15px;
}
.among {
  margin: 0 10px;
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
    .btns {
      margin-left: 20px;
    }
  }
}
.component_title {
  padding-left: 20px;
  font-weight: bold;
  background: #fff;
}
.component_title2 {
  padding: 20px 0 0px 20px;
  font-weight: bold;
  background: #fff;
}
.mrg_btn {
  margin-bottom: 20px;
}
.height_centent {
  line-height: 40px;
}
.font14 {
  font-size: 14px;
}
.pbt0 {
  position: absolute;
  right: 2px;
  top: 2px;
}

/deep/.el-select__tags-text {
  display: inline-block;
  //根据自己的需要调整文字宽度
  max-width: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.my-drawer /deep/.el-drawer__header {
  margin: 0;
  padding: 0;
}
.drawer-header {
  display: flex;
  padding: 0 0 30px 0;
  align-items: center;
  .video_img {
    width: 300px;
    height: 240px;
    padding: 0 20px;
  }
}
.check-all {
  padding: 0 20px;
  text-align: right;
}
.show-test {
  display: flex;
  padding-left: 20px;
}
.line-bar-wrapper {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-right: 15px;
}
.line-bar {
  width: 50px;
  height: 5px;
  margin-left: 5px;
  border-radius: 10px;
  background: #02a7f0;
}
.line-bar2 {
  background: #70b603;
}
.tab_pane_overflot {
  overflow: auto;
  height: 700px;
}
</style>