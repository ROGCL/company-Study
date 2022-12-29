<template>
  <div>
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit" width="100px" :mdSpan="6" :flexFlag="true">
      <div class="component_title2">筛选项</div>
      <el-col :md="6" :sm="12">
        <el-form-item label="筛选部门" prop="apartments">
          <SelectCustomize :value="departmentInfo" @changeScope="changeProjectTeam" @clearData="getOrderFiltrate"
            :data="apartments" />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="筛选项目组" prop="project_group">
          <SelectCustomize :value="groupIdInfo" @changeScope="changeApp" @clearData="getOrderFiltrate"
            :data="project_group" />
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
          <!-- <el-cascader :props="props" collapse-tags filterable :options="appId_options" @change="handleChange">
          </el-cascader> -->
          <SelectChannel paramFlag :optionsList="appId_options" @change="handleChange"></SelectChannel>
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
          <SelectChannel v-model="searchForm.channel" :appId="searchForm.appid"></SelectChannel>
        </el-form-item>
      </el-col>
      <el-col :md="6" :lg="6" :sm="12">
        <el-form-item label="复购周期">
          <el-select v-model="searchForm.day" placeholder="请选择">
            <el-option v-for="item in Period" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="6" :lg="6" :sm="12">
        <el-form-item label="复购次数">
          <el-select v-model="searchForm.cate" placeholder="请选择">
            <el-option v-for="item in Fnum" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="6" :lg="6" :sm="12" v-if="searchForm.appid.length === 1">
        <el-form-item label="首购套餐">
          <SelectCustomize :value="first_pay_goods_idInfo" @changeScope="changefirst_pay_goods_id"
            :data="first_pay_goods_id" />
        </el-form-item>
      </el-col>
      <el-col :md="6" :lg="6" :sm="12">
        <el-form-item label="筛选时间">
          <dataPicker :datevalue.sync="searchForm.date" :key="dateNum"></dataPicker>
        </el-form-item>
      </el-col>
      <el-button @click="initFrom" slot="btn-option">重置筛选</el-button>
    </FilterLayout>

    <!-- 新增复购情况表 -->
    <TableLayout :column="changeColumn" :data="tableData.data" :total="tableData.total" :loading="tableData.loading"
      :currentPage="tableData.currentPage" author="liuqiang" :params="outPamrms" :leadOut="true" alignStyle="center"
      leadApi="Re_Purchase/NewRePurchaseList" @pageChange="onPageChange" @sizeChange="onSizeChange"
      @sortChange="onSortChange">
      <div class="component_title" slot="title">新增复购情况表</div>
    </TableLayout>

    <TableLayout :column="changeColumnMove" :data="goodsRePurchaseTableData.data"
      :total="goodsRePurchaseTableData.total" :loading="goodsRePurchaseTableData.loading" author="liuqiang"
      :currentPage="goodsRePurchaseTableData.currentPage" :params="outPamrmsMove" :leadOut="true" alignStyle="center"
      :leadApi="memberpayTypesActive == 1 ? 'Re_Purchase/GoodsRePurchaseList' : 'Re_Purchase/GoodsRePurchaseMoveList'"
      @pageChange="onGoodPageChange" @sizeChange="onGoodSizeChange" @sortChange="onGoodSortChange">
      <div slot="table-option" class="Tab_box" v-if="memberpayTypesActive == 2 && goodsRePurchaseTableData.data.length">
        <div class="left_box">
          <el-checkbox style="margin-left: 20px" v-model="orderflexFlag">冻结维度项</el-checkbox>
        </div>
      </div>
      <!-- tabs -->
      <div class="table-tabs" slot="tabs">
        <span class="items" :class="memberpayTypesActive == k.id ? 'active' : ''" v-for="k in memberpayTypes"
          :key="k.id" @click="memberpayTypeClick(k.id)">
          {{ k.label }}
        </span>
      </div>
      <template #operate="scope">
        <el-button type="text" @click="changeTabelInfo(scope)"
          v-if="memberpayTypesActive == 2 && scope.row.move_goods_info.length > 1">更多</el-button>
      </template>
    </TableLayout>

    <el-dialog title="详情" :visible.sync="dialogVisible" width="30%">
      <el-table :data="tableInfo" style="width: 100%">
        <el-table-column prop="goods_name" label="迁移套餐名称" width="180">
        </el-table-column>
        <el-table-column prop="number" label="迁移套餐用户数" width="180">
        </el-table-column>
        <el-table-column prop="cycle" label="迁移占比">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import store from "store2";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import SelectCustomize from "@/component/select-customize";
import { Mydata } from "../mixins/packageF.js";
import SelectChannel from "@/component/select-channel-huiyuan";

export default {
  mixins: [Mydata],
  components: {
    FilterLayout,
    SelectCustomize,
    TableLayout,
    SelectChannel,
  },
  data() {
    return {
      dialogVisible: false,
      dateNum: 1,
      tableInfo: [],
      searchForm: {
        //筛选项
        project: [],
        appid: [],
        apartments: [],
        project_group: [],
        channel: [],
        day: "30",
        cate: "1",
        first_pay_goods_id: [],
        date: [
          moment().subtract(37, "d").format("YYYY-MM-DD"),
          moment().subtract(30, "d").format("YYYY-MM-DD"),
        ],
      },
      tableData: {
        data: [],
        total: 0,
        currentPage: 1,
        pageSize: 10,
        loading: false,
      },
      goodsRePurchaseTableData: {
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
      incomeInfo: {
        appInfo: [],
      },
      first_pay_goods_idInfo: {
        appInfo: [],
      },
      apartments: [],
      project_group: [],
      article_id: [],
      first_pay_goods_id: [],
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
      sort: {
        prop: "",
        order: "",
      },
      orderflexFlag: false,
      appId_options: [],
      props: { multiple: true },
      goodsName: [],
      memberpayTypesActive: 1,
      memberpayTypes: [
        {
          label: "套餐复购情况",
          id: 1,
        },
        {
          label: "套餐迁移情况",
          id: 2,
        }
      ],
    };
  },
  mounted() { },
  computed: {
    outPamrms() {
      const { searchForm, group, tableOpt } = this;
      return {
        ...searchForm,
        currentPage: this.tableData.currentPage,
        pageSize: this.tableData.pageSize,
      };
    },
    outPamrmsMove() {
      const { searchForm, group, tableOpt } = this;
      return {
        ...searchForm,
        leadeOutType: this.memberpayTypesActive == 1 ? '' : 3,
        currentPage: this.goodsRePurchaseTableData.currentPage,
        pageSize: this.goodsRePurchaseTableData.pageSize,
      };
    },
    changeColumn() {
      return this.column
    },
    changeColumnMove() {
      let arr = [...this.Goodscolumn]
      if (this.orderflexFlag) {
        arr.forEach(item => {
          if (item.prop == "date") {
            item.fixed = 'left'
          }
          if (item.prop == "week") {
            item.fixed = 'left'
          }
        })
        return arr
      } else {
        arr.forEach(item => {
          if (item.prop == "date") {
            item.fixed = ''
          }
          if (item.prop == "week") {
            item.fixed = ''
          }
        })
        return arr
      }
    },
  },
  methods: {
    getDashboardSetting() {
      this.getGoodsNameAll();
      this.getReport();
      this.getRoleBtree();
    },
    async getGoodsNameAll() {
      const [err, res] = await this.$http.post('Re_Purchase/GetGoodsNameAll');
      if (err) return
      this.goodsName = res
    },
    async getRoleBtree() {
      let android = {
        value: "1",
        label: "安卓",
        children: []
      }
      let ios = {
        value: "2",
        label: "ios",
        children: []
      }
      let wx_xcx = {
        value: "3",
        label: "微信小程序",
        children: []
      }
      let bd_xcx = {
        value: "4",
        label: "百度小程序",
        children: []
      }
      const [err, res] = await this.$http.post("System/roleBtree", {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
      });
      if (err) return;
      this.apartments = res.tree;
      res.list.forEach((item) => {
        if (item.title == "应用") {
          item.node.forEach((_item) => {
            if (_item.system == "1") {
              _item.title = _item.title + "_Android";
              android.children.push({
                value: _item.id,
                label: _item.title
              })
            } else if (_item.system == "2") {
              _item.title = _item.title + "_IOS";
              ios.children.push({
                value: _item.id,
                label: _item.title
              })
            } else if (_item.system == "3") {
              _item.title = _item.title + "_微信小程序";
              wx_xcx.children.push({
                value: _item.id,
                label: _item.title
              })
            } else if (_item.system == "4") {
              _item.title = _item.title + "_百度小程序";
              bd_xcx.children.push({
                value: _item.id,
                label: _item.title
              })
            }

          });
        }
      });
      this.departDatas = [
        ...res.list,
        { id: 1005, title: "系统", node: [...this.systemIds] },
      ];
      let project_group = [];
      res.tree.forEach((item) => {
        item.node.forEach((_item) => {
          project_group.push(_item);
        });
      });
      this.project_group = project_group;
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
      this.appId_options = [android, ios, wx_xcx, bd_xcx]
    },
    async getOrderFiltrate() {
      const [err, res] = await this.$http.post("Business/orderFiltrate", {
        ...this.searchForm,
        timeStart: this.searchForm.date[0],
        timeEnd: this.searchForm.date[1],
      });
      if (err) {
        return;
      }
      res.forEach((item) => {
        if (item.id == 1013) {
          this.incomeIds = [...item.children];
        } else if (item.id == 1016) {
          this.form_pathIds = [...item.children];
        }
      });
    },
    changeProjectTeam(val) {
      let android = {
        value: "1",
        label: "安卓",
        children: []
      }
      let ios = {
        value: "2",
        label: "ios",
        children: []
      }
      let wx_xcx = {
        value: "3",
        label: "微信小程序",
        children: []
      }
      let bd_xcx = {
        value: "4",
        label: "百度小程序",
        children: []
      }
      this.searchForm.apartments = val.appInfo;
      this.searchForm.project_group = [];
      this.searchForm.appid = [];
      this.searchForm.project = [];
      this.groupIdInfo.appInfo = [];
      this.projectInfo.appInfo = [];
      this.appidInfo.appInfo = [];
      this.incomeInfo.appInfo = [];
      let group_id_arr = [];
      let apps_arr = [];
      let article_id_arr = [];
      this.searchForm.apartments.forEach((item) => {
        this.apartments.forEach((_item) => {
          if (item == _item.id) {
            group_id_arr = [..._item.node, ...group_id_arr];
            _item.node.forEach((__item) => {
              article_id_arr.push(...__item.node);
              __item.node.forEach((item_) => {
                console.log(item_);
                apps_arr.push(...item_.node);
              });
            });
          }
        });
      });
      this.project_group = [...group_id_arr];
      this.article_id = [...article_id_arr];
      apps_arr.forEach(item => {
        if (item.system == "1") {
          android.children.push({
            value: item.id,
            label: item.title
          })
        } else if (item.system == "2") {
          ios.children.push({
            value: item.id,
            label: item.title
          })
        } else if (item.system == "3") {
          wx_xcx.children.push({
            value: item.id,
            label: item.title
          })
        } else if (item.system == "4") {
          bd_xcx.children.push({
            value: item.id,
            label: item.title
          })
        }
      })
      this.appId_options = [android, ios, wx_xcx, bd_xcx]
      if (!val.appInfo.length) {
        this.getRoleBtree();
      }
      if (val && val.appInfo.length == 0) {
        this.searchForm.apartments = [];
        return;
      }
    },
    // 改变app与部门
    changeApp(val) {
      let android = {
        value: "1",
        label: "安卓",
        children: []
      }
      let ios = {
        value: "2",
        label: "ios",
        children: []
      }
      let wx_xcx = {
        value: "3",
        label: "微信小程序",
        children: []
      }
      let bd_xcx = {
        value: "4",
        label: "百度小程序",
        children: []
      }
      this.searchForm.project_group = val.appInfo;
      this.searchForm.appid = [];
      this.searchForm.project = [];
      this.projectInfo.appInfo = [];
      this.appidInfo.appInfo = [];
      this.incomeInfo.appInfo = [];
      let apps_arr = [];
      let article_id_arr = [];
      if (this.searchForm.project_group.length) {
        this.searchForm.project_group.forEach((item) => {
          this.apartments.forEach((_item) => {
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
        this.project_group.forEach((item) => {
          this.apartments.forEach((_item) => {
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
      apps_arr.forEach(item => {
        if (item.system == "1") {
          android.children.push({
            value: item.id,
            label: item.title
          })
        } else if (item.system == "2") {
          ios.children.push({
            value: item.id,
            label: item.title
          })
        } else if (item.system == "3") {
          wx_xcx.children.push({
            value: item.id,
            label: item.title
          })
        } else if (item.system == "4") {
          bd_xcx.children.push({
            value: item.id,
            label: item.title
          })
        }

      })
      this.appId_options = [android, ios, wx_xcx, bd_xcx]
      this.article_id = [...article_id_arr];
      if (val && val.appInfo.length == 0) {
        this.searchForm.project_group = [];
        return;
      }
    },
    // 改变项目
    changeArticle(val) {
      let android = {
        value: "1",
        label: "安卓",
        children: []
      }
      let ios = {
        value: "2",
        label: "ios",
        children: []
      }
      let wx_xcx = {
        value: "3",
        label: "微信小程序",
        children: []
      }
      let bd_xcx = {
        value: "4",
        label: "百度小程序",
        children: []
      }
      this.searchForm.project = val.appInfo;
      this.searchForm.appid = [];
      this.appidInfo.appInfo = [];
      this.incomeInfo.appInfo = [];
      let apps_arr = [];
      if (this.searchForm.project.length) {
        this.searchForm.project.forEach((item) => {
          this.apartments.forEach((_item) => {
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
      apps_arr.forEach(item => {
        if (item.system == "1") {
          android.children.push({
            value: item.id,
            label: item.title
          })
        } else if (item.system == "2") {
          ios.children.push({
            value: item.id,
            label: item.title
          })
        } else if (item.system == "3") {
          wx_xcx.children.push({
            value: item.id,
            label: item.title
          })
        } else if (item.system == "4") {
          bd_xcx.children.push({
            value: item.id,
            label: item.title
          })
        }
      })
      this.appId_options = [android, ios, wx_xcx, bd_xcx]
      if (val && val.appInfo.length == 0) {
        this.searchForm.project = [];
        return;
      }
    },
    /*     changeAppid(val) {
          this.incomeInfo.appInfo = [];
          this.searchForm.channel = [];
          this.searchForm.appid = val.appInfo;
          if (val.appInfo.length == 1) {
            this.form_pathFlag = false;
          } else {
            this.searchForm.from_path_one = [];
            this.searchForm.from_path_two = [];
            this.searchForm.from_path_three = [];
            this.form_pathFlag = true;
          }
          if (val && val.appInfo.length == 0) {
            this.searchForm.appid = [];
            return;
          }
        }, */
    handleChange(val) {
      this.incomeInfo.appInfo = [];
      this.searchForm.channel = [];
      let arr = []
      val.forEach(item => {
        arr.push(item[1])
      })
      this.searchForm.appid = arr
      let goodsName = []
      // console.log(this.goodsName);
      if (arr.length && this.goodsName.length) {
        this.goodsName.forEach(item => {
          // console.log(arr[0], item.appid);
          if (item.appid == arr[0]) {
            item.goods_list.forEach(_item => {
              goodsName.push({
                title: _item.goods_name+`(${_item.goods_id})`,
                id: _item.goods_id,
              })
            })
          }
        })
      }
      console.log(goodsName);
      this.first_pay_goods_id = goodsName
    },
    changefirst_pay_goods_id(val) {
      this.searchForm.first_pay_goods_id = val.appInfo
    },
    onSubmit() {
      this.tableOpt.currentPage = 1;
      this.goodsRePurchaseTableData.currentPage = 1;
      this.getReport()
      console.log(this.searchForm.appid.length)
      if (this.memberpayTypesActive == 1 && this.searchForm.appid.length == 1) {
        this.getGoodsRePurchaseList()
      } else if (this.memberpayTypesActive == 2 && this.searchForm.appid.length == 1) {
        this.getGoodsRePurchaseMove()
      } else {
        this.goodsRePurchaseTableData = {
          data: [],
          total: 0,
          currentPage: 1,
          pageSize: 10,
          loading: false,
        }
      }
    },
    initFrom() {
      this.searchForm = {
        //筛选项
        project: [],
        appid: [],
        apartments: [],
        project_group: [],
        channel: [],
        day: "30",
        cate: "1",
        first_pay_goods_id: [],
        date: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
      }
      this.searchForm.date = [
        moment().subtract(7, "d").format("YYYY-MM-DD"),
        moment().subtract(1, "d").format("YYYY-MM-DD"),
      ]
      this.dateNum++
      this.getDashboardSetting()
    },
    onPageChange(current) {
      this.tableData.currentPage = current;
      console.log(current);
      this.getReport();
    },
    onSizeChange(current) {
      this.tableData.pageSize = current;
      this.getReport();
    },
    onSortChange(data) {
      const { prop, order } = data;
      this.sort = { prop, order };
      this.tableData.currentPage = 1;
      this.getReport();
    },
    onGoodPageChange(current) {
      this.goodsRePurchaseTableData.currentPage = current;
      if (this.memberpayTypesActive == 1) {
        this.getGoodsRePurchaseList()
      } else if (this.memberpayTypesActive == 2) {
        this.getGoodsRePurchaseMove()
      }
    },
    onGoodSizeChange(current) {
      this.goodsRePurchaseTableData.pageSize = current;
      if (this.memberpayTypesActive == 1) {
        this.getGoodsRePurchaseList()
      } else if (this.memberpayTypesActive == 2) {
        this.getGoodsRePurchaseMove()
      }
    },
    onGoodSortChange(data) {
      const { prop, order } = data;
      this.sort = { prop, order };
      this.goodsRePurchaseTableData.currentPage = 1;
      if (this.memberpayTypesActive == 1) {
        this.getGoodsRePurchaseList()
      } else if (this.memberpayTypesActive == 2) {
        this.getGoodsRePurchaseMove()
      }
    },
    async getReport() {
      this.tableData.loading = true;
      this.column = [
        {
          label: '时间',
          prop: 'date',
        },
        {
          label: '星期',
          prop: "week"
        },
        {
          label: '新增',
          prop: 'device_new',
        },
        {
          label: '首购总人数',
          prop: 'total_first_pay_user',
        },
        {
          prop: 'repurchase_rate',
          label: this.searchForm.day + '日复购率'
        },
        {
          prop: 'repurchase_price',
          label: this.searchForm.day + '日复购客单价'
        },
        {
          prop: 'repurchase_cost',
          label: this.searchForm.day + '日复购价值'
        },
        {
          prop: 'people',
          label: this.searchForm.day + '日复购人数'
        },
        {
          prop: 'money',
          label: this.searchForm.day + '日复购金额'
        },
      ]
      const { searchForm, group, tableOpt } = this;
      const [err, res] = await this.$http.post("Re_Purchase/NewRePurchaseList", {
        ...searchForm,
        currentPage:this.tableData.currentPage,
        pageSize:this.tableData.pageSize
      });
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
      this.tableData.loading = false;
      const { data, avg, sum, current_page, last_page, per_page, total } = res
      if (data.length == 0) {
        this.tableData = {
          data: [],
          total: 0,
          currentPage: 1,
          pageSize: 10,
          loading: false,
        };
        return
      }
      sum.date = '总计'
      avg.date = '均值'
      let mean = {};
      data.forEach(item => {
        for (const key in item) {
          if (this.keyArr.indexOf(key) >= 0) {
            item[key] = (item[key] * 100).toFixed(2) + "%";
          }
          if (this.numKeyArr.indexOf(key) !== -1) {
            item[key] = parseFloat(Math.trunc(item[key])).toLocaleString();
          }
          if (this.truncArr.indexOf(key) !== -1) {
            console.log(Number(item[key]));
            item[key] = parseFloat(((Number(item[key])).toFixed(2))).toLocaleString();
          }
          if (this.fourNumArr.indexOf(key) >= 0) {
            item[key] = (item[key] * 1).toFixed(4)
          }
        }
        item.week = moment(item.date).format("dddd")
      })
      for (const key in sum) {
        if (this.keyArr.indexOf(key) >= 0) {
          sum[key] = (sum[key] * 100).toFixed(2) + "%";
        }
        if (this.numKeyArr.indexOf(key) !== -1) {
          sum[key] = parseFloat(Math.trunc(sum[key])).toLocaleString();
        }
        if (this.truncArr.indexOf(key) !== -1) {
          sum[key] = parseFloat(((Number(sum[key])).toFixed(2))).toLocaleString();
        }
        if (this.fourNumArr.indexOf(key) >= 0) {
          sum[key] = (sum[key] * 1).toFixed(4)
        }
      }
      for (const key in avg) {
        if (this.keyArr.indexOf(key) >= 0) {
          avg[key] = (avg[key] * 100).toFixed(2) + "%";
        }
        if (this.numKeyArr.indexOf(key) !== -1) {
          avg[key] = parseFloat(Math.trunc(avg[key])).toLocaleString();
        }
        if (this.truncArr.indexOf(key) !== -1) {
          avg[key] = parseFloat(((Number(avg[key])).toFixed(2))).toLocaleString();
        }
        if (this.fourNumArr.indexOf(key) >= 0) {
          avg[key] = (avg[key] * 1).toFixed(4)
        }
      }
      this.sumList = avg;
      this.avgList = sum;
      this.tableData.data = [sum, avg, ...data];
      this.tableData.currentPage = current_page;
      this.tableData.pageSize = per_page
      this.tableData.total = total;

    },
    async getGoodsRePurchaseList() {
      this.goodsRePurchaseTableData.loading = true;
      this.Goodscolumn = [
        {
          label: '时间',
          prop: 'date',
        },
        {
          label: '星期',
          prop: "week"
        },
        {
          label: '新增',
          prop: 'device_new',
        },
        {
          label: '首购总人数',
          prop: 'total_first_pay_user',
        },
        {
          label: '首购套餐名称',
          prop: 'goods_name',
        },
        {
          label: '首购套餐人数',
          prop: 'first_pay_user',
        },
        {
          prop: 'first_pay_user_rate',
          label: "首购套餐占比"
        },
        {
          prop: 'repurchase_rate',
          label: this.searchForm.day + '日复购率'
        },
        {
          prop: 'repurchase_price',
          label: this.searchForm.day + '日复购客单价'
        },
        {
          prop: 'repurchase_cost',
          label: this.searchForm.day + '日复购价值'
        },
        {
          prop: 'people',
          label: this.searchForm.day + '日复购人数'
        },
        {
          prop: 'money',
          label: this.searchForm.day + '日复购金额'
        },
      ]
      const { searchForm, group, tableOpt } = this;
      const [err, res] = await this.$http.post("Re_Purchase/GoodsRePurchaseList", {
        ...searchForm,
        currentPage: this.goodsRePurchaseTableData.currentPage,
        pageSize: this.goodsRePurchaseTableData.pageSize,
      });
      if (err) {
        this.goodsRePurchaseTableData = {
          data: [],
          total: 0,
          currentPage: 1,
          pageSize: 10,
          loading: false,
        };
        return;
      }
      this.goodsRePurchaseTableData.loading = false;
      const { data, avg, sum, current_page, last_page, per_page, total } = res
      if (data.length == 0) {
        this.goodsRePurchaseTableData.data = []
        return
      }
      sum.date = '总计'
      avg.date = '均值'
      let mean = {};
      data.forEach(item => {
        for (const key in item) {
          if (this.keyArr.indexOf(key) >= 0) {
            item[key] = (item[key] * 100).toFixed(2) + "%";
          }
          if (this.numKeyArr.indexOf(key) !== -1) {
            item[key] = parseFloat(Math.trunc(item[key])).toLocaleString();
          }
          if (this.truncArr.indexOf(key) !== -1) {
            item[key] = parseFloat(((Number(item[key])).toFixed(2))).toLocaleString();
          }
          if (this.fourNumArr.indexOf(key) >= 0) {
            item[key] = (item[key] * 1).toFixed(4)
          }
          if ("goods_name" == key) {
            item[key] = `${item[key]}(${item['goods_id']})`
          }
        }
        item.week = moment(item.date).format("dddd")
      })
      for (const key in sum) {
        if (this.keyArr.indexOf(key) >= 0) {
          sum[key] = (sum[key] * 100).toFixed(2) + "%";
        }
        if (this.numKeyArr.indexOf(key) !== -1) {
          sum[key] = parseFloat(Math.trunc(sum[key])).toLocaleString();
        }
        if (this.truncArr.indexOf(key) !== -1) {
          sum[key] = parseFloat(((Number(sum[key])).toFixed(2))).toLocaleString();
        }
        if (this.fourNumArr.indexOf(key) >= 0) {
          sum[key] = (sum[key] * 1).toFixed(4)
        }
      }
      for (const key in avg) {
        if (this.keyArr.indexOf(key) >= 0) {
          avg[key] = (avg[key] * 100).toFixed(2) + "%";
        }
        if (this.numKeyArr.indexOf(key) !== -1) {
          avg[key] = parseFloat(Math.trunc(avg[key])).toLocaleString();
        }
        if (this.truncArr.indexOf(key) !== -1) {
          avg[key] = parseFloat(((Number(avg[key])).toFixed(2))).toLocaleString();
        }
        if (this.fourNumArr.indexOf(key) >= 0) {
          avg[key] = (avg[key] * 1).toFixed(4)
        }
      }
      this.sumList = avg;
      this.avgList = sum;
      this.goodsRePurchaseTableData.data = [sum, avg, ...data];
      this.goodsRePurchaseTableData.currentPage = current_page;
      this.goodsRePurchaseTableData.pageSize = per_page
      this.goodsRePurchaseTableData.total = total;
    },
    async getGoodsRePurchaseMove() {
      this.goodsRePurchaseTableData.loading = true;
      this.Goodscolumn = [
        {
          label: '时间',
          prop: 'date',
        },
        {
          label: '星期',
          prop: "week"
        },
        {
          label: '新增',
          prop: 'device_new',
        },
        {
          label: '首购总人数',
          prop: 'total_first_pay_user',
        },
        {
          label: '首购套餐名称',
          prop: 'goods_name',
        },
        {
          label: '首购套餐人数',
          prop: 'first_pay_user',
        },
        {
          prop: 'first_pay_user_rate',
          label: "首购套餐占比"
        },
        {
          prop: 'repurchase_rate',
          label: this.searchForm.day + '日迁移复购率'
        },
        {
          prop: 'repurchase_price',
          label: this.searchForm.day + '日迁移复购客单价'
        },
        {
          prop: 'repurchase_cost',
          label: this.searchForm.day + '日迁移复购价值'
        },
        {
          prop: 'people',
          label: this.searchForm.day + '日迁移复购人数'
        },
        {
          prop: 'money',
          label: this.searchForm.day + '日迁移复购金额'
        },
        {
          prop: 'ql_goods_name',
          label: '迁移套餐名称'
        },
        {
          prop: 'ql_number',
          label: '迁移套餐用户数'
        },
        {
          prop: 'ql_cycle',
          label: '迁移占比'
        },
        {
          prop: "operate",
          label: '操作'
        }
      ]
      const { searchForm, group, tableOpt } = this;
      const [err, res] = await this.$http.post("Re_Purchase/GoodsRePurchaseMoveList", {
        ...searchForm,
        currentPage: this.goodsRePurchaseTableData.currentPage,
        pageSize: this.goodsRePurchaseTableData.pageSize,
      });
      if (err) {
        this.goodsRePurchaseTableData = {
          data: [],
          total: 0,
          currentPage: 1,
          pageSize: 10,
          loading: false,
        };
        return;
      }
      this.goodsRePurchaseTableData.loading = false;
      const { data, avg, sum, current_page, last_page, per_page, total } = res
      if (data.length == 0) {
        this.goodsRePurchaseTableData = {
          data: [],
          total: 0,
          currentPage: 1,
          pageSize: 10,
          loading: false,
        };
        return
      }
      data.forEach(item => {
        if (item.move_goods_info.length) {
          item.ql_goods_name = item.move_goods_info[0].goods_name
          item.ql_number = item.move_goods_info[0].number
          item.ql_cycle = item.move_goods_info[0].cycle
        }
      })
      sum.ql_goods_name = ' '
      sum.ql_number = ' '
      sum.ql_cycle = ' '
      sum.move_goods_info = []
      avg.ql_goods_name = ' '
      avg.ql_number = ' '
      avg.ql_cycle = ' '
      avg.move_goods_info = []
      sum.date = '总计'
      avg.date = '均值'
      data.forEach(item => {
        for (const key in item) {
          if (this.keyArr.indexOf(key) >= 0) {
            item[key] = (item[key] * 100).toFixed(2) + "%";
          }
          if (this.numKeyArr.indexOf(key) !== -1) {
            item[key] = parseFloat(Math.trunc(item[key])).toLocaleString();
          }
          if (this.truncArr.indexOf(key) !== -1) {

            item[key] = parseFloat(((Number(item[key])).toFixed(2))).toLocaleString();
          }
          if (this.fourNumArr.indexOf(key) >= 0) {
            item[key] = (item[key] * 1).toFixed(4)
          }
          if ("goods_name" == key) {
            item[key] = `${item[key]}(${item['goods_id']})`
          }
          if("ql_goods_name" == key){
            item[key] = `${item[key]}(${item['goods_id']})`
          }
        }
        item.week = moment(item.date).format("dddd")
      })
      for (const key in sum) {
        if (this.keyArr.indexOf(key) >= 0) {
          sum[key] = (sum[key] * 100).toFixed(2) + "%";
        }
        if (this.numKeyArr.indexOf(key) !== -1) {
          sum[key] = parseFloat(Math.trunc(sum[key])).toLocaleString();
        }
        if (this.truncArr.indexOf(key) !== -1) {
          sum[key] = parseFloat(((Number(sum[key])).toFixed(2))).toLocaleString();
        }
        if (this.fourNumArr.indexOf(key) >= 0) {
          sum[key] = (sum[key] * 1).toFixed(4)
        }
      }
      for (const key in avg) {
        if (this.keyArr.indexOf(key) >= 0) {
          avg[key] = (avg[key] * 100).toFixed(2) + "%";
        }
        if (this.numKeyArr.indexOf(key) !== -1) {
          avg[key] = parseFloat(Math.trunc(avg[key])).toLocaleString();
        }
        if (this.truncArr.indexOf(key) !== -1) {
          avg[key] = parseFloat(((Number(avg[key])).toFixed(2))).toLocaleString();
        }
        if (this.fourNumArr.indexOf(key) >= 0) {
          avg[key] = (avg[key] * 1).toFixed(4)
        }
      }
      this.sumList = avg;
      this.avgList = sum;
      this.goodsRePurchaseTableData.data = [sum, avg, ...data];
      console.log(this.goodsRePurchaseTableData.data);
      this.goodsRePurchaseTableData.currentPage = current_page;
      this.goodsRePurchaseTableData.pageSize = per_page
      this.goodsRePurchaseTableData.total = total;
    },
    memberpayTypeClick(id) {
      if (this.memberpayTypesActive === id) return;
      this.memberpayTypesActive = id;
      this.goodsRePurchaseTableData.currentPage = 1;
      if (id == 1) {
        this.getGoodsRePurchaseList()
      } else if (id == 2) {
        this.getGoodsRePurchaseMove()
      }
      // this.$refs.transfer.changeKey()
    },
    changeTabelInfo(table) {
      let arr = []
      for (let index = 1; index < table.row.move_goods_info.length; index++) {
        arr.push(table.row.move_goods_info[index])
      }
      arr = JSON.parse(JSON.stringify(arr))
      arr.forEach(item => {
        for (const key in item) {
          if (this.keyArr.indexOf(key) >= 0) {
            console.log(item[key]);
            item[key] = (item[key] * 100).toFixed(2) + "%";
          }
          if (this.numKeyArr.indexOf(key) !== -1) {
            item[key] = parseFloat(Math.trunc(item[key])).toLocaleString();
          }
          if (this.truncArr.indexOf(key) !== -1) {
            item[key] = parseFloat(((Number(item[key])).toFixed(2))).toLocaleString();
          }
          if (this.fourNumArr.indexOf(key) >= 0) {
            item[key] = (item[key] * 1).toFixed(4)
          }
          if ("goods_name" == key) {
            item[key] = `${item[key]}(${item['goods_id']})`
          }
        }
      })
      console.log(arr)
      this.tableInfo = arr
      this.dialogVisible = true
    }
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
</style>