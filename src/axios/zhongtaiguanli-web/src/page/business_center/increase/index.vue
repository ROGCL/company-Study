<template>
  <div>
    <!-- 报表预配置 -->
    <div class="top-box component_title">
      <el-popover placement="bottom" width="250" trigger="click">
        <div>
          <!-- 配置列表 -->
          <div v-for="(item, index) in deployList" :key="index" class="flex_jc_sb">
            <div style="line-height: 40px;" @dblclick="changeDeploy(item)" title="双击可重命名" v-show="item.flag">
              {{ item.name }}
            </div>
            <el-input v-model="item.name" size="small" style="width:100px" v-show="!item.flag" @blur="changeDeploy(item)"></el-input>
            <div style="line-height: 40px;">
              <el-button size="small" type="text">引用</el-button>
              <el-button style="color:#adadad" size="small" type="text">删除</el-button>
            </div>
          </div>
          <div class="btn">
            <el-button style="width:224px" size="small" type="primary">保存当前配置</el-button>
          </div>
        </div>
        <el-button slot="reference" type="primary">表报预配置</el-button>
      </el-popover>
    </div>
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
          <dataPicker :datevalue.sync="searchForm.time"></dataPicker>
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
        <el-form-item label="系统" prop="system">
          <SelectCustomize
            :value="systemInfo"
            @changeScope="changeSystem"
            :data="systemIds"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="渠道" prop="channe">
          <SelectCustomize
            :value="channelInfo"
            @changeScope="changeChannel"
            :data="channelIds"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="投放平台" prop="terrace">
          <SelectCustomize
            :value="terraceInfo"
            @changeScope="changeTerrace"
            :data="terraceIds"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="投放方式" prop="way">
          <SelectCustomize
            :value="wayInfo"
            @changeScope="changeWay"
            :data="wayIds"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="代理名称" prop="agent">
          <SelectCustomize
            :value="agentInfo"
            @changeScope="changeAgent"
            :data="agentIds"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="渠道人员" prop="channe_staff">
          <SelectCustomize
            :value="channeStaffInfo"
            @changeScope="changeChanneStaff"
            :data="channeStaffIds"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="来源" prop="source">
          <el-select
            v-model="searchForm.source"
            placeholder="请选择"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="(v, i) in sourceList"
              :key="i"
              :label="v.title"
              :value="v.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="时间周期" prop="timeType">
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
      leadApi="Business/report"
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
          postApi="Business/paramDetail"
          :postParams="customFieldParams"
          transferCard="index"
        >
        </TransferDialog>
      </div>
    </TableLayout>
  </div>
</template>

<script>
import moment from "moment";
import store from "store2";
import { Mydata } from "./mixins/index.js";
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
        timeStart: this.searchForm["time"][0],
        timeEnd: this.searchForm["time"][1],
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
  data() {
    return {
      ceshiFlag:false,//测试数据
      // 配置列表的数据
      deployList: [
        {
          name: "测试",
          id: 1,
          flag:true,
        },
      ],
      // 表格的筛选项
      searchForm: {
        project: [], //项目
        appid: [], //应用
        system: [], //系统
        channe: [], //渠道
        timeType: "1", //时间周期
        department_id: [], //部门
        group_id: [], // 项目组
        terrace: [], //投放平台
        way: [], //投放方式
        agent: [], //代理名称
        channe_staff: [], //渠道人员
        source: "1", //来源
        time: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ], //时间
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
        appInfo: [], //渠道-组件列表数据
      },
      systemInfo: {
        appInfo: [], //系统-组件列表数据
      },
      terraceInfo: {
        appInfo: [], //投放平台-组件列表数据
      },
      wayInfo: {
        appInfo: [], //投放方式-组件列表数据
      },
      agentInfo: {
        appInfo: [], //代理名称-组件列表数据
      },
      channeStaffInfo: {
        appInfo: [], //渠道人员-组件列表数据
      },
      apps: [], //应用-组件回调所选值
      article_id: [], //项目-组件回调所选值
      department_id: [], //部门-组件回调所选值
      group_id: [], //项目组-组件回调所选值
      channelIds: [], //渠道-组件回调所选值
      terraceIds: [], //投放平台-组件回调所选值
      wayIds: [], //投放方式-组件回调所选值
      agentIds: [], //代理名称-组件回调所选值
      channeStaffIds: [], //渠道人员-组件回调所选值
      sourceList: [], //筛选项-来源-初始化数据
      group: [1000], //投放维度的所选值
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
    };
  },
  mounted() {
    // 初始化调用部门分组
    this.getRoleBtree();
  },
  methods: {
    // 改变配置报表
    changeDeploy(item){
      item.flag = !item.flag
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
    // 筛选应用的回调函数
    changeAppid(val) {
      this.searchForm.appid = val.appInfo;
    },
    // 筛选系统的回调函数
    changeSystem(val) {
      this.searchForm.system = val.appInfo;
    },
    // 渠道的回调函数
    changeChannel() {},
    // 投放平台的回调函数
    changeTerrace(val) {},
    // 投放方式的回调函数
    changeWay(val) {},
    // 代理名称的回调函数
    changeAgent(val) {},
    // 渠道人员的回调函数
    changeChanneStaff(val) {},
    // 表单查询
    onSubmit() {},
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
      const { prop, order } = data;
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
        this.group = [1000, 1001, 1002, 1003, 1004, 1005];
      } else {
        this.group = [1000];
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
        timeStart: this.searchForm["time"][0],
        timeEnd: this.searchForm["time"][1],
        ...val,
      });
      if (err) return;
      this.getReport();
      this.getParamDetail();
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
    // 自定义数据的回调
    initData(val) {
      this.getReport();
      this.getParamDetail();
    },
    // 获取表格数据的接口函数
    async getReport() {},
  },
};
</script>

<style lang="less" scoped>
.top-box {
  margin-bottom: 20px;
  .btn{
    margin-top: 20px;
  }
}
.flex_jc_sb {
  display: flex;
  justify-content: space-between;
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
