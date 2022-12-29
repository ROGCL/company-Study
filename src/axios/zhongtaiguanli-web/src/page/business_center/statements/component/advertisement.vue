<template>
  <div>
    <!-- 筛选项 -->
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit" width="100px">
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
            @changeScope="getAdFiltrate"
            :data="apps"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="收入渠道" prop="ad_platform">
          <SelectCustomize
            :value="adPlatformInfo"
            @changeScope="changeAdtypemine"
            :data="ad_platform"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="广告类型" prop="adtypemine_id">
          <SelectCustomize
            :value="adtypemineIdInfo"
            @changeScope="changeAdpositionid"
            :data="adtypemine_id"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="广告位" prop="adpositionid_id">
          <SelectCustomize
            :value="adpositionidInfo"
            @changeScope="changeADID"
            :data="adpositionid_id"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="三方广告位id" prop="placement_id_oth">
          <SelectCustomize
            :value="placementIdOthInfo"
            @changeScope="changePlacementIdOth"
            :data="placement_id_oth"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="ADID" prop="ad_id">
          <SelectCustomize
            :value="adIdInfo"
            @changeScope="changeTtile"
            :data="ad_id"
          />
        </el-form-item>
      </el-col>

      <el-col :md="6" :sm="12">
        <el-form-item label="广告名称" prop="title">
          <SelectCustomize
            :value="changeAppKeyOthInfo"
            @changeScope="changeApp_key_oth"
            :data="title"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="三方媒体ID" prop="app_key_oth">
          <SelectCustomize
            :value="appKeyOthInfo"
            @changeScope="changeAppKeyOth"
            :data="app_key_oth"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="筛选系统" prop="system">
          <!-- <el-select
            v-model="searchForm.system"
            placeholder="请选择"
            :popper-append-to-body="false"
            multiple
            filterable
            collapse-tags
            :disabled="this.searchForm.appid.length > 0 ? true : false"
            @change="changeSystem"
            :clearable="true"
          >
            <el-option label="全选" value="all"></el-option>
            <el-option
              v-for="(v, i) in systemIds"
              :key="i"
              :label="v.title"
              :value="v.id"
            />
          </el-select> -->
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
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="筛选时间">
          <!--  <el-date-picker
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
    <!-- 趋势对比 -->

    <CountLayout
      :option="countData.data"
      :loading="countData.loading"
      :countInfoArr="countData.totalInfo"
      type="newMix"
      v-if="this.checkList.indexOf(38) >= 0"
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
            filterable
            @change="selectAll"
            :popper-append-to-body="false"
          >
            <el-option label="全选" value="all"></el-option>
            <el-option
              v-for="item in infoDeparts"
              :key="item.id"
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
      alignStyle="center"
      :leadOut="true"
      leadApi="Business/report"
      @pageChange="onPageChange"
      @sizeChange="onSizeChange"
      @sortChange="onSortChange"
      :defaultSort="sort"
      v-if="this.checkList.indexOf(39) >= 0"
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
            @change="getReport"
            class="my-select"

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
          transferCard="advertisement"
        />
      </div>
    </TableLayout>
  </div>
</template>

<script>
import moment from "moment";
import store from "store2";
import CountLayout from "@/layout/count";
import { Mydata } from "../mixins/advertisement.js";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import TransferDialog from "@/layout/transferDialog";
import SelectCustomize from "@/component/select-customize";

export default {
  mixins: [Mydata],
  props: {
    checkList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      //筛选项
      searchForm: {
        project: [],
        appid: [],
        system: [],
        ad_platform: [],
        adtypemine_id: [],
        adpositionid_id: [],
        ad_id: [],
        title: [],
        placement_id_oth: [],
        app_key_oth: [],
        timeType: "1",
        time: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
      },
      targetName: "", // 指标对应的名称
      departDatas: [],
      infoDeparts: [],
      changeCheckList: [],
      placement_id_oth: [],
      sumList: [],
      avgList: [],
      projectInfo: {
        appInfo: [],
      },
      appidInfo: {
        appInfo: [],
      },
      adtypemineIdInfo: {
        appInfo: [],
      },
      adPlatformInfo: {
        appInfo: [],
      },
      adpositionidInfo: {
        appInfo: [],
      },
      adIdInfo: {
        appInfo: [],
      },
      placementIdOthInfo: {
        appInfo: [],
      },
      changeAppKeyOthInfo: {
        appInfo: [],
      },
      appKeyOthInfo: {
        appInfo: [],
      },
      systemInfo: {
        appInfo: [],
      },
      //趋势对比
      form: {
        key: 31,
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
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      group: [1000],
      paramDetailData: {
        showField: [],
        hiddenField: [],
      },
      department_id: [],
      article_id: [],
      plat_pictLoading: false,
      adtypemine_pictLoading: false,
      dpositionid_pictLoading: false,
      ad_id_pictLoading: false,
      title_pictLoading: false,
      app_key_pictLoading: false,
      all: false,
      flexFlag: false,
      appAll: false,
      articleAll: false,
      sort: {
        prop: "",
        order: "",
      },
    };
  },
  components: {
    CountLayout,
    TransferDialog,
    TableLayout,
    FilterLayout,
    SelectCustomize,
  },
  computed: {
    customFieldParams() {
      return {
        cate: 2,
        timeStart: this.searchForm["time"][0],
        timeEnd: this.searchForm["time"][1],
      };
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
          label: "应用",
          prop: "app_title",
          value: 1004,
        },
        {
          label: "系统",
          prop: "system_title",
          value: 1005,
        },
        {
          label: "广告类型",
          prop: "bu_adtypemine_id",
          value: 1007,
        },
        {
          label: "广告位",
          prop: "bu_adpositionid_id",
          value: 1008,
        },
        {
          label: "收入渠道",
          prop: "th_cate",
          value: 1006,
        },
        {
          label: "ADID",
          prop: "ad_id",
          value: 1009,
        },
        {
          label: "广告名称",
          prop: "ad_title",
          value: 1010,
        },
        {
          label: "三方媒体id",
          prop: "app_key_oth",
          value: 1011,
        },
        {
          label: "三方广告位id",
          prop: "placement_id_oth",
          value: 1012,
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
          console.log(item.date);
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
        cate: 2,
        group: group.sort(function (a, b) {
          return a - b;
        }),
      };
    },
  },
  methods: {
    changeArticle(val) {
      this.searchForm.project = val.appInfo;
      this.searchForm.appid = [];
      this.appidInfo.appInfo = [];
      this.adtypemineIdInfo.appInfo = [];
      this.adPlatformInfo.appInfo = [];
      this.adpositionidInfo.appInfo = [];
      this.adIdInfo.appInfo = [];
      this.placementIdOthInfo.appInfo = [];
      this.changeAppKeyOthInfo.appInfo = [];
      this.appKeyOthInfo.appInfo = [];
      let apps_arr = [];
      console.log(val);
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
      }
      this.apps = apps_arr;
      this.getAdFiltrate();
      if (!val.appInfo.length) {
        this.getRoleBtree();
      }
    },
    // 获取筛选项
    async getAdFiltrate(val) {
      if (val) {
        this.searchForm.appid = val.appInfo
          ? val.appInfo
          : this.searchForm.appid;
      }
      if (val && val.appInfo.length == 0) {
        return;
      }

      this.searchForm.ad_platform = [];
      this.searchForm.adtypemine_id = [];
      this.searchForm.adpositionid_id = [];
      this.searchForm.ad_id = [];
      this.searchForm.app_key_oth = [];
      this.searchForm.title = [];
      this.adtypemineIdInfo.appInfo = [];
      this.adPlatformInfo.appInfo = [];
      this.adpositionidInfo.appInfo = [];
      this.adIdInfo.appInfo = [];
      this.placementIdOthInfo.appInfo = [];
      this.changeAppKeyOthInfo.appInfo = [];
      this.appKeyOthInfo.appInfo = [];
      this.plat_pictLoading = true;
      const { searchForm } = this;
      const [err, res] = await this.$http.post("Business/adFiltrate", {
        ...searchForm,
        timeStart: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });
      if (err) {
        this.plat_pictLoading = false;
        return;
      }
      if (!res.advert.list) {
        this.ad_platform = [];
        this.adtypemine_id = [];
        this.adpositionid_id = [];
        this.ad_id = [];
        this.app_key_oth = [];
        this.title = [];
        this.plat_pictLoading = false;
        return;
      }
      this.ad_platform = res.advert.list[0].children;
      this.adtypemine_id = res.advert.list[1].children;
      this.adpositionid_id = res.advert.list[2].children;
      this.ad_id = res.advert.list[3].children;
      this.app_key_oth = res.advert.list[4].children;
      this.title = res.advert.list[5].children;
      this.placement_id_oth = res.advert.list[6].children;
      this.departDatas = [
        { id: 1003, title: "项目", children: [...this.article_id] },
        { id: 1004, title: "应用", children: [...this.apps] },
        ...res.advert.list,
        { id: 1005, title: "系统", children: [...this.systemIds] },
      ];
      this.plat_pictLoading = false;
    },
    // app全选
    onInputAppAll(val) {
      if (val) {
        let arr = [];
        this.apps.forEach((item) => {
          arr.push(item.id);
        });
        this.searchForm.appid = arr;
      } else {
        this.searchForm.appid = [];
      }
      this.getAdFiltrate();
    },
    onInputArticleAll() {},
    // 获取app部门分组
    async getRoleBtree(val) {
      const [err, res] = await this.$http.post("System/roleBtree", {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
      });
      if (err) return;
      let apps = [];
      let article_id_arr = [];
      this.department_id = res.tree;
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
    // 基于收入渠道改变
    async changeAdtypemine(val) {
      if (val && val.appInfo.length == 0) {
        this.searchForm.ad_platform = [];
        return;
      }

      this.searchForm.ad_platform = val.appInfo;
      this.adtypemine_pictLoading = true;
      this.dpositionid_pictLoading = true;
      this.ad_id_pictLoading = true;
      this.title_pictLoading = true;
      this.app_key_pictLoading = true;
      this.searchForm.adtypemine_id = [];
      this.searchForm.adpositionid_id = [];
      this.searchForm.ad_id = [];
      this.searchForm.app_key_oth = [];
      this.searchForm.title = [];
      this.searchForm.placement_id_oth = [];

      this.adtypemineIdInfo.appInfo = [];
      this.adpositionidInfo.appInfo = [];
      this.adIdInfo.appInfo = [];
      this.placementIdOthInfo.appInfo = [];
      this.changeAppKeyOthInfo.appInfo = [];
      this.appKeyOthInfo.appInfo = [];

      const { searchForm } = this;
      const [err, res] = await this.$http.post("Business/adFiltrate", {
        ...searchForm,
        timeStart: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });
      if (err) {
        this.adtypemine_pictLoading = false;
        this.dpositionid_pictLoading = false;
        this.ad_id_pictLoading = false;
        this.title_pictLoading = false;
        this.app_key_pictLoading = false;
        return;
      }
      this.adtypemine_id = res.advert.list[1].children;
      this.adpositionid_id = res.advert.list[2].children;
      this.ad_id = res.advert.list[3].children;
      this.app_key_oth = res.advert.list[4].children;
      this.title = res.advert.list[5].children;
      this.placement_id_oth = res.advert.list[6].children;

      this.adtypemine_pictLoading = false;
      this.dpositionid_pictLoading = false;
      this.ad_id_pictLoading = false;
      this.title_pictLoading = false;
      this.app_key_pictLoading = false;
    },
    // 基于类型改变
    async changeAdpositionid(val) {
      if (val && val.appInfo.length == 0) {
        this.searchForm.adtypemine_id = [];
        return;
      }

      this.searchForm.adtypemine_id = val.appInfo;
      this.dpositionid_pictLoading = true;
      this.ad_id_pictLoading = true;
      this.title_pictLoading = true;
      this.app_key_pictLoading = true;
      this.searchForm.adpositionid_id = [];
      this.searchForm.ad_id = [];
      this.searchForm.app_key_oth = [];
      this.searchForm.title = [];
      this.searchForm.placement_id_oth = [];

      this.adpositionidInfo.appInfo = [];
      this.adIdInfo.appInfo = [];
      this.placementIdOthInfo.appInfo = [];
      this.changeAppKeyOthInfo.appInfo = [];
      this.appKeyOthInfo.appInfo = [];

      const { searchForm } = this;
      const [err, res] = await this.$http.post("Business/adFiltrate", {
        ...searchForm,
        timeStart: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });
      if (err) {
        this.dpositionid_pictLoading = false;
        this.ad_id_pictLoading = false;
        this.title_pictLoading = false;
        this.app_key_pictLoading = false;
        return;
      }
      this.adpositionid_id = res.advert.list[2].children;
      this.ad_id = res.advert.list[3].children;
      this.app_key_oth = res.advert.list[4].children;
      this.title = res.advert.list[5].children;
      this.placement_id_oth = res.advert.list[6].children;
      this.dpositionid_pictLoading = false;
      this.ad_id_pictLoading = false;
      this.title_pictLoading = false;
      this.app_key_pictLoading = false;
    },
    // 基于ADID改变
    async changeADID(val) {
      if (val && val.appInfo.length == 0) {
        this.searchForm.adpositionid_id = [];
        return;
      }

      this.searchForm.adpositionid_id = val.appInfo;
      this.ad_id_pictLoading = true;
      this.title_pictLoading = true;
      this.app_key_pictLoading = true;
      this.searchForm.ad_id = [];
      this.searchForm.app_key_oth = [];
      this.searchForm.title = [];
      this.searchForm.placement_id_oth = [];

      this.adIdInfo.appInfo = [];
      this.placementIdOthInfo.appInfo = [];
      this.changeAppKeyOthInfo.appInfo = [];
      this.appKeyOthInfo.appInfo = [];

      const { searchForm } = this;
      const [err, res] = await this.$http.post("Business/adFiltrate", {
        ...searchForm,
        timeStart: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });
      if (err) {
        this.ad_id_pictLoading = false;
        this.title_pictLoading = false;
        this.app_key_pictLoading = false;
        return;
      }
      this.ad_id = res.advert.list[3].children;
      this.app_key_oth = res.advert.list[4].children;
      this.title = res.advert.list[5].children;
      this.placement_id_oth = res.advert.list[6].children;

      this.ad_id_pictLoading = false;
      this.title_pictLoading = false;
      this.app_key_pictLoading = false;
    },
    // 基于名称改变
    async changeTtile(val) {
      if (val && val.appInfo.length == 0) {
        this.searchForm.ad_id = [];
        return;
      }

      this.searchForm.ad_id = val.appInfo;
      this.title_pictLoading = true;
      this.app_key_pictLoading = true;
      this.searchForm.app_key_oth = [];
      this.searchForm.title = [];

      this.changeAppKeyOthInfo.appInfo = [];
      this.appKeyOthInfo.appInfo = [];

      const { searchForm } = this;
      const [err, res] = await this.$http.post("Business/adFiltrate", {
        ...searchForm,
        timeStart: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });
      if (err) {
        this.title_pictLoading = false;
        this.app_key_pictLoading = false;
        return;
      }
      this.app_key_oth = res.advert.list[4].children;
      this.title = res.advert.list[5].children;
      this.title_pictLoading = false;
      this.app_key_pictLoading = false;
    },
    async changeApp_key_oth(val) {
      if (val && val.appInfo.length == 0) {
        this.searchForm.title = [];
        return;
      }
      this.searchForm.title = val.appInfo;
      this.app_key_pictLoading = true;
      this.searchForm.app_key_oth = [];
      this.appKeyOthInfo.appInfo = [];

      const { searchForm } = this;
      const [err, res] = await this.$http.post("Business/adFiltrate", {
        ...searchForm,
        timeStart: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });
      if (err) {
        this.app_key_pictLoading = false;

        return;
      }
      this.app_key_oth = res.advert.list[4].children;
      this.app_key_pictLoading = false;
    },
    changeAppKeyOth(val) {
      this.searchForm.app_key_oth = val.appInfo;
    },
    async changePlacementIdOth(val) {
      if (val && val.appInfo.length == 0) {
        this.searchForm.placement_id_oth = [];
        return;
      }

      this.searchForm.placement_id_oth = val.appInfo;
      this.ad_id_pictLoading = true;
      this.title_pictLoading = true;
      this.app_key_pictLoading = true;
      this.searchForm.ad_id = [];
      this.searchForm.app_key_oth = [];
      this.searchForm.title = [];

      this.adIdInfo.appInfo = [];
      this.changeAppKeyOthInfo.appInfo = [];
      this.appKeyOthInfo.appInfo = [];

      const { searchForm } = this;
      const [err, res] = await this.$http.post("Business/adFiltrate", {
        ...searchForm,
        timeStart: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });
      if (err) {
        this.ad_id_pictLoading = false;
        this.title_pictLoading = false;
        this.app_key_pictLoading = false;
        return;
      }
      this.ad_id = res.advert.list[3].children;
      this.app_key_oth = res.advert.list[4].children;
      this.title = res.advert.list[5].children;
      this.ad_id_pictLoading = false;
      this.title_pictLoading = false;
      this.app_key_pictLoading = false;
    },
    async getDashboardSetting() {
      this.getParamList();
      this.getReport();
      this.fetchCount();
      this.getRoleBtree();
      this.getAdFiltrate([]);
      this.getParamDetail();
    },
    changeSystem(val) {
      this.searchForm.system = val.appInfo;
    },
    async getParamList() {
      const [err, res] = await this.$http.post("Business/paramList", {
        cate: 2,
      });
      if (err) return;
      this.key = res;
    },
    onSubmit() {
      this.tableOpt.currentPage = 1;
      this.fetchCount();
      this.getReport();
    },
    initFrom() {
      this.searchForm = {
        appid: [],
        system: [],
        ad_platform: [],
        adtypemine_id: [],
        adpositionid_id: [],
        ad_id: [],
        title: [],
        app_key_oth: [],
        timeType: "1",
        time: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
      };
      this.projectInfo.appInfo = [];
      this.appidInfo.appInfo = [];
      this.adtypemineIdInfo.appInfo = [];
      this.adPlatformInfo.appInfo = [];
      this.adpositionidInfo.appInfo = [];
      this.adIdInfo.appInfo = [];
      this.placementIdOthInfo.appInfo = [];
      this.changeAppKeyOthInfo.appInfo = [];
      this.appKeyOthInfo.appInfo = [];
      this.getDashboardSetting();
    },
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
    async fetchCount() {
      const { searchForm, form, timeBegin, timeEnd } = this;
      this.countData.loading = true;
      const [err, res] = await this.$http.post("Business/advertComparison", {
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
      let yAxis = [];
      // if (this.keyNumArr.indexOf(this.form.key) !== -1 || this.keyNumArr.indexOf(this.form.c_key) !== -1) {
      data.forEach((item) => {
        // 只有百分比的指标才要*100
        if (this.nameArr.indexOf(item.name) >= 0) {
          item.data = item.data.map((_item) => {
            return (_item = (_item * 100).toFixed(2));
          });
        }
      });
      // }
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
          key: 31,
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
      const [err, res] = await this.$http.post("Business/report", {
        ...searchForm,
        ...tableOpt,
        ...sort,
        group: group.sort(function (a, b) {
          return a - b;
        }),
        timeStart: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
        cate: 2,
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
          if (this.keyArr.indexOf(key) >= 0) {
            item[key] = (item[key] * 100).toFixed(2) + "%";
          }
          if (this.numKeyArr.indexOf(key) === -1) {
            item[key] = parseFloat(item[key]).toLocaleString();
          }
        }
      });

      for (const key in sumList) {
        if (this.keyArr.indexOf(key) >= 0) {
          sumList[key] = (sumList[key] * 100).toFixed(2) + "%";
        }
        if (this.numKeyArr.indexOf(key) === -1) {
          sumList[key] = parseFloat(sumList[key]).toLocaleString();
        }
      }
      for (const key in avgList) {
        if (this.keyArr.indexOf(key) >= 0) {
          avgList[key] = (avgList[key] * 100).toFixed(2) + "%";
        }
        if (this.numKeyArr.indexOf(key) === -1) {
          avgList[key] = parseFloat(avgList[key]).toLocaleString();
        }
      }

      this.tableData.data = list;
      this.tableData.currentPage = currentPage;
      this.tableData.total = total;
      this.sumList = sumList;
      this.avgList = avgList;
    },
    async getParamDetail() {
      const [err, res] = await this.$http.post("Business/paramDetail", {
        cate: 2,
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
    async paramSave(val) {
      const [err, res] = await this.$http.post("Business/paramSave", {
        cate: 2,
        timeStart: this.searchForm["time"][0],
        timeEnd: this.searchForm["time"][1],
        ...val,
      });
      if (err) return;
      this.getReport();
      this.getParamDetail();
    },
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
        this.group = [
          1001, 1000, 1004, 1005, 1007, 1008, 1006, 1009, 1010, 1011, 1012,
        ];
      } else {
        this.group = [1000];
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
        case "5":
          return "icon-chrome";
        default:
          return "";
      }
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
    width: 1000px;
    display: flex;
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
.my-select{
  height: 40px;
}
</style>
