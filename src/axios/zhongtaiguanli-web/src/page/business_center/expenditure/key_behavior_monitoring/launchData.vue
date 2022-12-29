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
      <el-col :md="6" :lg="6" :sm="12">
        <el-form-item label="时间">
          <dataPicker :datevalue.sync="searchForm.date"></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="部门" prop="department_id">
          <SelectCustomize
            :value="departmentInfo"
            @changeScope="changeProjectTeam"
            :data="department_id"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="项目组" prop="group_id">
          <SelectCustomize
            :value="groupIdInfo"
            @changeScope="changeApp"
            :data="group_id"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="项目" prop="project">
          <SelectCustomize
            :value="projectInfo"
            @changeScope="changeArticle"
            :data="article_id"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="应用" prop="appid">
          <SelectCustomize
            :value="appidInfo"
            @changeScope="changeAppid"
            :data="apps"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="渠道号" prop="channe">
          <SelectCustomize
            :value="channelInfo"
            @changeScope="changeChannel"
            :data="channelIds"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="投放平台" prop="platform">
          <el-select v-model="searchForm.platform" placeholder="请选择">
            <el-option
              v-for="item in platformOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="关键行为ID" prop="event">
          <SelectCustomize
            :value="keyBehaviorInfo"
            @changeScope="changekeyBehavior"
            :data="keyBehaviorIds"
          />
        </el-form-item>
      </el-col>
      <el-button @click="initFrom" slot="btn-option">重置筛选</el-button>
    </FilterLayout>
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
      leadApi="event_put/put"
      author="liuqiang"
      :defaultSort="sort"
      @pageChange="onPageChange"
      @sizeChange="onSizeChange"
      @sortChange="onSortChange"
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
          postApi="event_put/customFieldList"
          :postParams="customFieldParams"
          transferCard="index"
        >
        </TransferDialog>
      </div>
      <template #callback_conf="{ row }">
        <template>
          <div
            v-if="row.callback_conf && row.callback_conf.on"
            @click="openEdit(row)"
          >
            <el-button type="text"
              >回传比例:{{ row.callback_conf.scale }}%</el-button
            >
          </div>
          <div
            v-if="row.callback_conf && row.callback_conf.on"
            @click="openEdit(row)"
          >
            <el-button type="text">
              回传时间:{{ row.callback_conf.custom_back_time.value
              }}{{
                row.callback_conf.custom_back_time.unit === "hour"
                  ? "小时"
                  : "天"
              }}
            </el-button>
          </div>
        </template>
      </template>
      <template #duration_avg="{ row }">
        <template>
          {{(row.duration_avg/60/60).toFixed(2)}}
        </template>
      </template>
    </TableLayout>
  </div>
</template>

<script>
import moment from "moment";
import store from "store2";
import { Mydata } from "./mixins/launchData.js";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import TransferDialog from "@/layout/transferDialog";
import SelectCustomize from "@/component/select-customize";
export default {
  mixins: [Mydata],
  components: {
    FilterLayout,
    SelectCustomize,
    TableLayout,
    TransferDialog,
  },
  computed: {
    // 字段展示自定义携带参数
    customFieldParams() {
      return {
        timeStart: this.searchForm["date"][0],
        timeEnd: this.searchForm["date"][1],
      };
    },
    // 数据发生变化重新计算表头数据
    changeColumn() {
      let arr = [];
      let columu = [
        {
          label: "时间",
          prop: "date",
          value: 1000,
          width: "110",
          sortable: "custom",
        },
        {
          label: "应用",
          prop: "app_name",
          value: 1010,
          width:"100"
        },
        {
          label: "投放平台",
          prop: "platform",
          value: 1050,
        },
        {
          label: "渠道号",
          prop: "channel",
          value: 1030,
        },
        {
          label: "回传规则",
          prop: "callback_conf",
          width: "130",
          value: 1030,
        },
        {
          label: "关键行为ID",
          prop: "event_id",
          value: 1040,
        },
        {
          label: "行为描述",
          prop: "event_name",
          value: 1030,
        },
      ];
      let all = {};
      let mean = {};
      let weekFlag = false;
      // 判断所选数据维度，重新计算表格数据
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
      // 为表头插入总计和均值
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
              width:_item.width
            });
          }
        });
      });
      // 表格数据的赋值
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
      console.log(arr);
      return arr;
    },
    outPamrms() {
      const { searchForm, group, tableOpt } = this;
      return {
        ...searchForm,
        ...tableOpt,
        list_group: group.sort(function (a, b) {
          return a - b;
        }),
        leadeOutType: 4,
      };
    },
  },
  data() {
    return {
      // 表格的筛选项
      searchForm: {
        date: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ], //时间
        project: [], //项目
        appid: [], //应用
        apartment: [], //部门
        groups: [], // 项目组
        channel: [], //渠道号
        platform: "", //投放平台
        event: [], //行为ID
      },
      departmentInfo: {
        appInfo: [], //部门-组件列表数据
      },
      groupIdInfo: {
        appInfo: [], //项目组-组件列表数据
      },
      projectInfo: {
        appInfo: [], //项目组-组件件初始数据
      },
      appidInfo: {
        appInfo: [], //应用-组件列表数据
      },
      channelInfo: {
        appInfo: [], //渠道号-组件列表数据
      },
      keyBehaviorInfo: {
        appInfo: [], //关键行为ID-组件列表数据
      },
      apps: [], //应用-组件回调所选值
      article_id: [], //项目-组件回调所选值
      department_id: [], //部门-组件回调所选值
      group_id: [], //项目组-组件回调所选值
      channelIds: [], //渠道号-组件回调所选值
      keyBehaviorIds: [], //关键行为ID-组件回调所选值
      group: [1000, 1010, 1030, 1040], //投放维度的所选值
      all: false, //数据维度全选标杆
      flexFlag: false, //冻结维度的标杆
      //字段展示自定义
      paramDetailData: {
        showField: [], //显示列表
        hiddenField: [], //隐藏列表
      },
      sumList: [], //总值
      avgList: [], //均值
      // 表格数据
      tableData: {
        data: [], //数据
        total: 0, //总页数
        currentPage: 1, //当前页
        pageSize: 10, //每页条数
        loading: false, //加载标杆
      },
      panel_id: "", //面板ID
      sort: { prop: "date", order: "desc" },//排序

    };
  },
  mounted() {
    // 初始化调用部门分组
    this.getRoleBtree();
    // 获取渠道号
    this.getChannel();
    // 获取字段展示自定义
    this.getParamDetail();
    // 获取表格数据
    this.getReport();
    // 
    this.$nextTick(() => {
      // 获取关键行为ID
      this.getEventId();
    });
  },
  methods: {
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
      this.departDatas = [...res.list];
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
    // 获取渠道号接口
    async getChannel() {
      const [err, res] = await this.$http.post("Operate_Invest/getChannel", {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
        project: this.searchForm.project.join()
          ? this.searchForm.project.join()
          : undefined,
        appid: this.searchForm.appid.join()
          ? this.searchForm.appid.join()
          : undefined,
      });
      if (err) return;
      let arr = [];
      for (const i of res) {
        let obj = {
          id: i.channel,
          title: i.channel,
        };
        if (i.channel) {
          arr.push(obj);
        }
      }
      let newRes = new Map();
      this.channelIds = arr.filter(
        (item) => !newRes.has(item.id) && newRes.set(item.id, 1)
      );
    },
    //获取关键行为ID
    async getEventId() {
      const [err, res] = await this.$http.post("event/getEventId");
      if (err) return;
      let arr = [];

      if (this.searchForm.channel.length === 0) {
        res.forEach((item) => {
          arr.push({
            id: item.event_id,
            title: item.event_id,
            channel: item.channel,
            appid: item.appid,
          });
        });
      } else {
        this.searchForm.channel.forEach((item) => {
          res.forEach((_item) => {
            if (item == _item.channel) {
              arr.push({
                id: _item.event_id,
                title: _item.event_id,
                channel: _item.channel,
                appid: _item.appid,
              });
            }
          });
        });
      }
      this.keyBehaviorIds = arr;
    },
    // 改变项目组与app
    changeProjectTeam(val) {
      this.searchForm.apartment = val.appInfo;
      this.searchForm.groups = [];
      this.searchForm.appid = [];
      this.searchForm.project = [];
      this.searchForm.channel = [];
      this.groupIdInfo.appInfo = [];
      this.projectInfo.appInfo = [];
      this.appidInfo.appInfo = [];
      let group_id_arr = [];
      let apps_arr = [];
      let article_id_arr = [];
      this.searchForm.apartment.forEach((item) => {
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
      this.searchForm.groups = val.appInfo;
      this.searchForm.appid = [];
      this.searchForm.project = [];
      this.projectInfo.appInfo = [];
      this.appidInfo.appInfo = [];
      let apps_arr = [];
      let article_id_arr = [];
      if (this.searchForm.groups.length) {
        this.searchForm.groups.forEach((item) => {
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
    // 筛选应用的回调函数
    changeAppid(val) {
      this.searchForm.channel = [];
      this.channelInfo.appInfo = [];
      this.searchForm.appid = val.appInfo;
      this.getChannel();
    },
    // 渠道号的回调函数
    changeChannel(val) {
      this.searchForm.event = [];
      this.searchForm.channel = val.appInfo;
    },
    // 关键行为的回调函数
    changekeyBehavior(val) {
      this.searchForm.event = val.appInfo;
    },
    // 表单查询
    onSubmit() {
      this.tableOpt.currentPage = 1;
      this.getReport();
    },
    // 重置表单
    initFrom() {
      this.departmentInfo.appInfo = [];
      this.groupIdInfo.appInfo = [];
      this.projectInfo.appInfo = [];
      this.appidInfo.appInfo = [];
      this.channelInfo.appInfo = [];
      this.keyBehaviorInfo.appInfo = [];
      this.searchForm = {
        //筛选项
        date: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ], //时间
        project: [], //项目
        appid: [], //应用
        apartment: [], //部门
        groups: [], // 项目组
        channel: [], //渠道号
        platform: "", //投放平台
        event: [], //行为ID
      };
    },
    // 每页改变回调
    onPageChange(current) {
      this.tableOpt.currentPage = current;
      this.getReport();
    },
    // 每页条数改变回调
    onSizeChange(current) {
      this.tableOpt.pageSize = current;
      this.getReport();
    },
    // 表格排序的回调
    onSortChange(data) {
      let { prop, order } = data;
      order = order == "ascending" ? "asc" : "desc";
      this.sort = { prop, order };
      this.tableOpt.currentPage = 1;
      this.getReport();
    },
    // 改变数据维度的回调函数
    changeTable(val) {
      this.getReport();
    },
    // 数据维度全选的回调函数
    changeDimensional(val) {
      if (val) {
        this.group = [1000, 1010, 1050, 1030, 1040];
      } else {
        this.group = [1000, 1010, 1030, 1040];
      }
      this.getReport();
    },
    // 冻结列表的回调函数
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
    // 保存自定义字段
    async paramSave(val) {
      this.tableData.loading = true;
      const [err, res] = await this.$http.post("Business/paramSave", {
        timeStart: this.searchForm["date"][0],
        timeEnd: this.searchForm["date"][1],
        ...val,
        cate: this.panel_id,
      });
      if (err) return;
      this.getReport();
      this.getParamDetail();
    },
    // 获取自定义字段
    async getParamDetail() {
      const [err, res] = await this.$http.post("event_put/customFieldList");
      if (err) return;
      this.paramDetailData.showField = res.show.map((item) => {
        if (item.field == "duration_avg") {
          return {
            field_id: item.field_id,
            field: item.field,
            value: item.value+"(h)",
            order: item.true,
            sort: item.sort,
            isSelect: false,
          };
        }else{
          return {
            field_id: item.field_id,
            field: item.field,
            value: item.value,
            order: item.true,
            sort: item.sort,
            isSelect: false,
          };
        }
      });
      this.paramDetailData.hiddenField = res.hidden.map((item) => {
        if (item.field == "duration_avg") {
          return {
            field_id: item.field_id,
            field: item.field,
            value: item.value+"(h)",
            order: item.true,
            sort: item.sort,
            isSelect: false,
          };
        }else{
          return {
            field_id: item.field_id,
            field: item.field,
            value: item.value,
            order: item.true,
            sort: item.sort,
            isSelect: false,
          };
        }
      });
      this.panel_id = res.panel_id;
    },
    // 自定义数据的回调
    initData(val) {
      this.getReport();
      this.getParamDetail();
    },
    // 获取表格数据的接口函数
    async getReport() {
      this.tableData.loading = true;
      const { searchForm, tableOpt, sort, group } = this;
      const [err, res] = await this.$http.post("event_put/put", {
        ...searchForm,
        ...tableOpt,
        ...sort,
        list_group: group.sort(function (a, b) {
          return a - b;
        }),
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
      const { data, currentPage, total, sum, avg } = res;
      data.forEach((item) => {
        for (const key in item) {
          if (this.numKeyArr.indexOf(key) !== -1) {
            item[key] = parseFloat(parseInt(item[key])).toLocaleString();
          }
          if (this.doubleDigitArr.indexOf(key) !== -1) {
            item[key] = (item[key] * 100).toFixed(2) + "%";
          }
          if (this.fourNumArr.indexOf(key) !== -1) {
            item[key] = (item[key] * 1).toFixed(4);
          }
          if (this.sumKeyArr.indexOf(key) !== -1) {
            item[key] = (item[key]*1).toFixed(2);
          }
          if (key == "event_name") {
            item[key] = item[key]?item[key]:"无描述"
          }
        }
      });
      for (const key in sum) {
        if (this.numKeyArr.indexOf(key) !== -1) {
          sum[key] = parseFloat(parseInt(sum[key])).toLocaleString();
        }
        if (this.doubleDigitArr.indexOf(key) !== -1) {
          sum[key] = (sum[key] * 100).toFixed(2) + "%";
        }
        if (this.fourNumArr.indexOf(key) !== -1) {
          sum[key] = (sum[key] * 1).toFixed(4);
        }
        if (this.sumKeyArr.indexOf(key) !== -1) {
          sum[key] = (sum[key]*1).toFixed(2);
        }
      }
      for (const key in avg) {
        if (this.numKeyArr.indexOf(key) !== -1) {
          avg[key] = parseFloat(parseInt(avg[key])).toLocaleString();
        }
        if (this.doubleDigitArr.indexOf(key) !== -1) {
          avg[key] = (avg[key] * 100).toFixed(2) + "%";
        }
        if (this.fourNumArr.indexOf(key) !== -1) {
          avg[key] = (avg[key] * 1).toFixed(4);
        }
        if (this.sumKeyArr.indexOf(key) !== -1) {
          avg[key] = (avg[key]*1).toFixed(2);
        }
      }
      this.sumList = sum;
      this.avgList = avg;
      this.tableData.data = data;
      this.tableData.currentPage = currentPage;
      this.tableData.total = total;
      console.log(data);
    },
    // 格式化请求参数
    formatSearch(name) {
      let data = this.searchForm[name].appInfo.join()
        ? this.searchForm[name].appInfo.join()
        : undefined;
      return data;
    },
    // 新开标签页，进入回传控制面板的编辑页面
    openEdit(row) {
      console.log(1);
      let pathInfo = this.$router.resolve({
        path: "/business_center/planmonitor/event_back_edit",
        query: {
          channel: row.channel,
          appid: row.appid,
        },
      });
      window.open(pathInfo.href, "_blank");
      /* window.open(
        "https://madmin.nineton.cn/#/business_center/planmonitor/event_back_edit",
        "_blank"
      ); */
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
.font14 {
  font-size: 14px;
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
.my-select {
  height: 40px;
}
.check-all {
  padding: 0 20px;
  text-align: right;
}
</style>
