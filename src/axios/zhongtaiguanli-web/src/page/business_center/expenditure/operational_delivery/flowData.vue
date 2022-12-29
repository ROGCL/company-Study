<template>
  <div>
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit" width="100px" :mdSpan="24" :flexFlag="true">
      <div class="component_title2">筛选项</div>
      <!-- 只有助推分日数据才会显示 -->
      <el-col :md="6" :lg="6" :sm="12">
        <el-form-item label="分日报表时间" label-width="130px">
          <dataPicker :key="datekey" clearFlag :datevalue.sync="searchForm.date"></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="6" :lg="6" :sm="12">
        <el-form-item label="助推开始时间" label-width="130px">
          <dataPicker :key="datekey" clearFlag :datevalue.sync="searchForm.promotion_begin_time"></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="6" :lg="6" :sm="12">
        <el-form-item label="助推结束时间">
          <dataPicker clearFlag :datevalue.sync="searchForm.closing_time"></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="6" :lg="6" :sm="12">
        <el-form-item label="任务发布时间">
          <dataPicker clearFlag :datevalue.sync="searchForm.task_date"></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="渠道负责人" prop="admin_id">
          <SelectCustomize :value="searchForm.admin" :data="admin_id" />
        </el-form-item>
      </el-col>

      <el-col :md="6" :sm="12">
        <el-form-item label="项目" prop="project" label-width="130px">
          <SelectCustomize :value="searchForm.project" @changeScope="changeApp" :data="article_id" />
        </el-form-item>
      </el-col>

      <el-col :md="6" :sm="12">
        <el-form-item label="应用" prop="appid" ref="appid">
          <SelectCustomize :value="searchForm.appid" :data="apps" @changeScope="getChannel" />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="达人ID/昵称" prop="author_id" ref="author_id">
          <SelectCustomize @changeScope="getTalentId" :value="searchForm.talent" :data="author_id" />
        </el-form-item>
      </el-col>

      <el-col :md="6" :sm="12">
        <el-form-item label="任务ID/渠道号" prop="channel_id" ref="channel_id">
          <!-- <SelectCustomize :value="searchForm.channel" :data="channel_id" @change="getChannelId" /> -->
          <SelectCustomize multipleFlag v-model="searchForm.channel" :data="channel_id" @change="getChannelId" />
        </el-form-item>
      </el-col>



      <el-col :md="6" :sm="12">
        <el-form-item label="助推订单ID/计划ID" label-width="130px" prop="campaign_id" ref="campaign_id">
          <SelectCustomize :value="searchForm.campaign_id" :data="campaign_id" @change="getCampaignId" />
        </el-form-item>
      </el-col>

      <el-col :md="6" :sm="12">
        <el-form-item label="助推目标" prop="unit_type">
          <el-select v-model="searchForm.unit_type" multiple collapse-tags clearable placeholder="请选择">
            <el-option v-for="item in targetData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :md="6" :sm="12">
        <el-form-item label="投放人群" prop="target_type">
          <el-select v-model="searchForm.target_type" multiple collapse-tags clearable placeholder="请选择">
            <el-option v-for="item in target_type_data" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :md="6" :sm="12">
        <el-form-item label="助推订单状态" prop="status">
          <el-select v-model="searchForm.status" multiple collapse-tags clearable placeholder="请选择">
            <el-option v-for="item in status_data" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :md="6" :sm="12">
        <el-form-item label="回收类型" prop="status">
          <el-select v-model="searchForm.income_type" collapse-tags clearable placeholder="请选择">
            <el-option v-for="item in reclamationtype" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-button @click="initFrom" slot="btn-option">重置筛选</el-button>
    </FilterLayout>

    <TableLayout :column="column" :data="tableData.data" :total="tableData.total" :loading="tableData.loading"
      :currentPage="tableData.currentPage" :params="outPamrms" :leadOut="true" alignStyle="center" :leadApi="leadApi"
      @pageChange="onPageChange" @sizeChange="onSizeChange" author="liuqiang" tabLocation="top" ref="TableLayout"
      @sortChange="onSortChange">
      <template #author_name="{ row }">
        <template v-if="!row.header_title">
          <el-tooltip class="item" effect="dark" :content="`达人id：${row.author_id}`" placement="right-start">
            <div class="self-custom">
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
      </template>
      <template #ad_id="{ row }">
        <a :href="`https://k.kuaishou.com/#/index/task/${row.order_id}?type=false`" target="_blank">{{ row.ad_id }}</a>
      </template>
      <template #operate="{ row }">
        <el-button type="text" @click="changeMoney(row)" v-if="row.ad_id">修改出价</el-button>
        <el-button type="text" @click="popularize_end(row)" v-if="row.ad_id">结束推广</el-button>
      </template>
      <template #video_url="{ row }">
        <template v-if="!row.header_title">
          <img @click="videoplay(row.video_url)" :src="row.head_image_uri" alt="" class="head_image_uri"
            v-if="row.head_image_uri" />
          <img @click="videoplay(row.video_url)" src="@/asset/img/video_info.jpg" alt="" class="head_image_uri"
            v-else />
        </template>
      </template>
      <div class="table-tabs" slot="tabs">
        <span class="items" :class="tableActiveIndex == k.id ? 'active' : ''" v-for="k in orderpackageTypes" :key="k.id"
          @click="orderpackageTypeClick(k.id)">
          {{ k.label }}
        </span>
      </div>
      <div slot="table-option" class="Tab_box">
        <div class="left_box" style="flex: 1">
          <span class="font14">维度显示/隐藏（多选）</span>
          <el-select v-model="group" placeholder="全部渠道" :popper-append-to-body="false" :reserve-keyword="true"
            filterable multiple collapse-tags @change="changeTable" @remove-tag="removetag" class="my-select">
            <div class="check-all">
              <el-checkbox v-model="all" @input="changeDimensional">全部{{ all ? "隐藏" : "显示" }}
              </el-checkbox>
            </div>
            <el-option v-for="(v, i) in fixedcolumn" :key="i" :value="v.value" :label="v.label" :disabled="
              group.length == 1 && group[0] == v.value ? true : false
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
        <div>
          <el-button type="primary" style="heigt: 40px" @click="open_drawer">流量助推下单 <i
              class="el-icon-shopping-cart-full"></i></el-button>
        </div>
        <!-- 自定义字段弹窗 -->
        <TransferDialog :data1="this.paramDetailData.show" ref="TransferDialog" :data2="this.paramDetailData.hidden"
          @paramSave="paramSave" :postApi="postApi" @moveItem="moveItem">
          <!-- 自定义字段tab -->
          <div class="table-tabs" slot="navtabs">
            <span class="items" :class="selfCustomFiledIndex == k.id ? 'active' : ''" v-for="k in orderpackageTypes"
              :key="k.id" @click="orderpackageTypeClickTab(k.id)">
              {{ k.label }}
            </span>
          </div>
        </TransferDialog>
      </div>
    </TableLayout>

    <el-dialog title="修改出价" :visible.sync="centerDialogVisible" width="30%" center @open="openModifyPrice">
      <el-input placeholder="请输入金额，限制范围0.08~9.9元" v-model="price_money" @keyup.native="changePrice(price_money)">
        <template slot="append">元</template>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="modify_price">确定修改</el-button>
      </span>
    </el-dialog>

    <el-drawer :wrapperClosable="false" title="视频推广" :visible.sync="drawer" :before-close="closePromotion">
      <el-form label-position="top" :rules="rules" ref="ruleForm" label-width="80px" :model="promotionForm"
        style="padding: 30px 30px 60px 30px">
        <el-form-item label="聚星任务ID">
          <el-input v-model="promotionForm_ad_id" placeholder="请输入内容" @blur="getAdIdExchangeOrderId"></el-input>
        </el-form-item>
        <el-form-item label="聚星订单ID" v-if="order_id || !disabled">
          <el-input v-model="order_id" placeholder="请输入内容" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="推广场景" prop="campaign_type">
          <div class="promotion">
            <div :class="active === 1 ? 'box active' : 'box'" @click="changeHeat">
              <div style="height: 22px; margin-bottom: 10px; line-height: 22px">
                <img src="./img/heat_active.svg" alt="" v-show="active === 1" />
                <img src="./img/heat.svg" alt="" v-show="active === 2" />
                &nbsp;
                <span>提升视频热度</span>
                <i class="el-icon-circle-check pos_img" v-show="active === 1"></i>
              </div>
              <div style="font-size: 12px;
                  color: #8c8c8c;
                  height: 40px;
                  line-height: 1.5;
                ">
                提升视频的播放量，账号的涨粉互动行为
              </div>
            </div>
            <div :class="active === 2 ? 'box active' : 'box'" @click="changeApp_img">
              <div style="height: 22px; margin-bottom: 10px; line-height: 22px">
                <img src="./img/app.svg" alt="" v-show="active == 1" />
                <img src="./img/app_active.svg" alt="" v-show="active === 2" />
                &nbsp;
                <span>提升应用安装</span>
                <i class="el-icon-circle-check pos_img" v-show="active === 2"></i>
              </div>
              <div style="font-size: 12px;
                  color: #8c8c8c;
                  height: 40px;
                  line-height: 1.5;
                ">
                提升用户的下载、安装、激活等行为
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="优化目标" prop="unit_charge_type">
          <el-select v-model="promotionForm.unit_charge_type" placeholder="请选择">
            <el-option v-for="item in active === 1 ? heat_option : app_option" :key="item.value" :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="active === 1 ? '出价方式' : '自定义出价'"
          :prop="promotionForm.unit_price_type == 1 ? 'unit_price_type' : ''">
          <el-radio-group v-model="promotionForm.unit_price_type" size="medium"
            @change="changePromotion_unit_price_type" v-if="active === 1">
            <el-radio-button label="2"><i class="el-icon-monitor"></i> 智能投放</el-radio-button>
            <el-radio-button label="1"><i class="el-icon-s-operation"></i>自定义出价</el-radio-button>
          </el-radio-group>
          <el-input class="mrt_10" placeholder="请输入金额，限制范围0.08~9.9元" v-model="promotionForm.money"
            @keyup.native="changepromotino_money(promotionForm.money)"
            v-if="promotionForm.unit_price_type == 1 && active === 1">
            <template slot="append">元</template>
          </el-input>
          <el-input class="mrt_10" placeholder="请输入金额，限制范围0.5~10000元" v-model="promotionForm.customize_money"
            @keyup.native="
              changepromotino_customize_money(promotionForm.customize_money)
            " v-if="active === 2">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="投放人群" prop="target_type">
          <el-radio-group v-model="promotionForm.target_type" size="medium" @change="changePromotion_target_type">
            <el-radio-button label="1"><i class="el-icon-monitor"></i> 智能定向</el-radio-button>
            <el-radio-button label="2"><i class="el-icon-s-operation"></i>自定义定向</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="地域" v-if="promotionForm.target_type == 2" prop="region_bundle">
          <el-radio-group v-model="promotionForm.region_bundle" size="medium" @change="changeRegion_bundle">
            <el-radio-button label=""> 不限</el-radio-button>
            <el-radio-button label="1">指定地区</el-radio-button>
            <el-radio-button label="3">城市等级</el-radio-button>
          </el-radio-group>
          <div class="mrt_10">
            <el-cascader v-model="promotionForm.region_ids" :options="region_type_list" :props="props" collapse-tags
              clearable v-if="promotionForm.region_bundle !== ''" filterable></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="性别" v-if="promotionForm.target_type == 2" prop="gender">
          <el-radio-group v-model="promotionForm.gender" size="medium">
            <el-radio-button label=""> 不限</el-radio-button>
            <el-radio-button label="2">男</el-radio-button>
            <el-radio-button label="1">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" v-if="promotionForm.target_type == 2" prop="multi_ages">
          <el-checkbox-group v-model="promotionForm.multi_ages" size="medium" @change="changePromotion_multi_ages">
            <el-checkbox-button label=""> 不限</el-checkbox-button>
            <el-checkbox-button label="18-23">18-23</el-checkbox-button>
            <el-checkbox-button label="24-30">24-30</el-checkbox-button>
            <el-checkbox-button label="31-40">31-40</el-checkbox-button>
            <el-checkbox-button label="40-50">40-50</el-checkbox-button>
            <el-checkbox-button label="50-100">50-100</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="投放时长" prop="promotion_duration">
          <el-radio-group v-model="promotionForm.promotion_duration" size="medium" v-if="active === 1">
            <el-radio-button label="1"> 1小时</el-radio-button>
            <el-radio-button label="2">2小时</el-radio-button>
            <el-radio-button label="6">6小时</el-radio-button>
            <el-radio-button label="12">12小时</el-radio-button>
            <el-radio-button label="24">24小时</el-radio-button>
            <el-radio-button label="">自定义</el-radio-button>
          </el-radio-group>
          <el-radio-group v-model="promotionForm.promotion_duration" size="medium" v-else>
            <el-radio-button label="6">6小时</el-radio-button>
            <el-radio-button label="12">12小时</el-radio-button>
            <el-radio-button label="24">24小时</el-radio-button>
            <el-radio-button label="48">2天</el-radio-button>
            <el-radio-button label="168">7天</el-radio-button>
            <el-radio-button label="336">14天</el-radio-button>
            <el-radio-button label="">自定义</el-radio-button>
          </el-radio-group>
          <el-input-number class="mrt_10" v-model="promotionForm.time" :step-strictly="true" controls-position="right"
            :min="1" :max="24" v-if="promotionForm.promotion_duration == ''"></el-input-number>
        </el-form-item>
        <el-form-item label="投放金额" prop="amount">
          <el-radio-group v-model="promotionForm.amount" size="medium">
            <el-radio-button label="500">500</el-radio-button>
            <el-radio-button label="1000">1000</el-radio-button>
            <el-radio-button label="2000">2000</el-radio-button>
            <el-radio-button label="3000">3000</el-radio-button>
            <el-radio-button label="5000">5000</el-radio-button>
            <el-radio-button label="9999">自定义</el-radio-button>
          </el-radio-group>
          <div class="mrt_10" v-if="promotionForm.amount == '9999'">
            <el-input-number v-model="promotionForm.amount" :step-strictly="true" controls-position="right" :min="500"
              :max="200000" v-if="active === 1"></el-input-number>元
            <el-input-number v-model="promotionForm.amount" :step-strictly="true" controls-position="right" :min="500"
              :max="10000000" v-if="active === 2"></el-input-number>元
          </div>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-radio v-model="promotionForm.pay_method" label="1">现金余额</el-radio>
          <el-radio v-model="promotionForm.pay_method" label="3">代理金额余额</el-radio>
        </el-form-item>
      </el-form>
      <div class="foot_pay">
        <span class="foot_num">共计：<span style="color: #fe3666; font-weight: bold">￥{{
            parseFloat(promotionForm.amount).toLocaleString()
        }}</span></span>
        <el-button type="primary" @click="submitPromotion">确定支付</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import _ from 'lodash'
import axios from "axios";
import moment from "moment";
import store from "store2";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import TransferDialog from "@/layout/transferDialog";
import SelectCustomize from "@/component/select-customize";
import { Mydata } from "./mixins/flowData.js";

export default {
  mixins: [Mydata],
  components: {
    FilterLayout,
    TableLayout,
    SelectCustomize,
    TransferDialog,
  },
  data() {
    return {
      props: { multiple: true, value: "id", label: "name" },
      tableActiveIndex: 1, // table报表tab选项卡选择的id
      selfCustomFiledIndex: 1, // 自定义字段tab选项卡选择的id
      orderpackageTypes: [
        {
          label: "助推累计数据",
          id: 1,
        },
        {
          label: "助推分日数据",
          id: 2,
        }
      ],
      datekey: 1,
      all: false,
      that: this,
      apps: [],
      paramDetailData: {},   // 渲染自定义字段时候使用
      paramDetailData1: {}, // 助推累计数据自定义字段数据
      paramDetailData2: {}, // 助推分日数据自定义字段数据
      paramDetailDataList: {}, // 渲染table时使用
      department_id: [],
      apps_default: [],
      article_id: [],
      systemIds: [],
      author_id: [],
      admin_id: [], //渠道负责人
      channel_id: [],
      campaign_id: [],
      group: [],  // 固定维度项选择的数据值
      group1: [], // 用于存储table切换前的group数据
      group2: [], // 用于存储table切换前的group数据
      flexFlag: false, // 是否固定维度
      sort_prop: "",
      sort_order: "",
      data_avg: {}, // 临时存储均值
      data_sum: {},   // 临时存储总值
      tableData_data_temp: [], // 暂时存放tabledata的数据
      fixedcolumn_temp: [], // 固定维度最终数据
      index_order_id: "",
      changeTableTimer: null,
      tableData: {
        data: [],
        total: 0,
        currentPage: 1,
        pageSize: 10,
        loading: false,
      },
      centerDialogVisible: false,
      price_money: "",
      ad_id: "",
      drawer: false,
      advertiser_id: "",
      order_id: "",
      promotionForm: {
        campaign_type: 30,
        unit_charge_type: "104",
        unit_price_type: "2",
        target_type: "1",
        promotion_duration: "24",
        amount: "500",
        pay_method: "1",
        money: "",
        region_bundle: "",
        gender: "",
        multi_ages: [""],
        time: "",
        customize_money: "",
        region_ids: [],
      },
      region_type_list: [],
      active: 2,
      rules: {
        unit_price_type: [
          { required: true, message: "请填写自定义出价", trigger: "blur" },
        ],
      },
      promotionForm_ad_id: "",
      disabled: true,
      order_info: {},
      operateFlag: false, //控制操作列表
    };
  },
  computed: {
    // 重置自定义字段的接口
    postApi() {
      let api = ''
      if (this.selfCustomFiledIndex == 1) {
        api = 'Operate_Boost/customFieldList'
      } else {
        api = 'Operate_Boost_day/customFieldList'
      }
      return api
    },
    // 导出的接口
    leadApi() {
      // 动态切换接口，1表示累计助推  2表示分日助推
      let api = ''
      if (this.tableActiveIndex == 1) {
        api = 'Operate_Boost/lists'
      } else {
        api = 'Operate_Boost_day/lists'
      }
      return api
    },
    outPamrms() {
      let unit_type = [];
      if (this.searchForm.unit_type.length) {
        this.searchForm.unit_type.forEach((item) => {
          if (item.indexOf(",")) {
            let arr = item.split(",");
            arr.forEach((_item) => {
              unit_type.push(Number(_item));
            });
          } else {
            unit_type.push(Number(item));
          }
        });
      }

      /**
       * 处理channel 因为组件返回的都是渠道号；但是此处后台接受的ad_id 所以需要转换一下
       */

      let ad_id = []
      const channel_appinfo = this.searchForm.channel.appInfo
      for (const i of channel_appinfo) {
        const result = _.find(this.channel_id, { title: i })
        ad_id.push(result.subtitle)
      }


      return {
        project: this.searchForm.project.appInfo,
        appid: this.searchForm.appid.appInfo,
        author_id: this.searchForm.talent.appInfo,
        ad_id: ad_id,
        campaign_id: this.searchForm.campaign_id.appInfo,
        leadeOutType: 2,
        unit_type: unit_type,
        list_group: this.group,
        order: this.sort_order,
        prop: this.sort_prop,
        target_type: this.searchForm.target_type,
        status: this.searchForm.status,
        promotion_begin_time: this.searchForm.promotion_begin_time,
        closing_time: this.searchForm.closing_time,
        date: this.searchForm.date,
        task_date: this.searchForm.task_date,
        income_type: this.searchForm.income_type,
        is_download: 1,
        admin_id: this.searchForm.admin.appInfo,
      };
    },
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
  created() {
    this.init();
  },
  mounted() {
    window.onresize = () => {
      // myTable是表格的ref属性值
      if (this.$refs.TableLayout && this.$refs.TableLayout.doLayout) {
        this.$refs.TableLayout.doLayout();
      }
    };
  },
  updated() {
    // myTable是表格的ref属性值
    if (this.$refs.TableLayout && this.$refs.TableLayout.doLayout) {
      this.$refs.TableLayout.doLayout();
    }
  },
  methods: {
    // 冻结维度
    changeTableList(e) {
      // 需要固定的字段
      this.fixedcolumn_temp.forEach((el) => {
        el.fixed = e ? "left" : "";
      });
      this.column = this.fixedcolumn_temp.concat(this.paramDetailDataList.show);
      if (this.operateFlag) {
        this.column.push({
          label: "操作",
          prop: "operate",
          width: "180",
        });
      }
    },
    // 设置维度固定默认值
    setdefaultcolumn() {
      this.group = [1003, 1004, 1008, 1006];
      this.group1 = this.group
      // 分日助推默认固定维度
      this.group2 = [1010, 1003, 1004, 1008, 1006]
    },
    // 全部隐藏至少保留一个固定维度
    removetag(e) {
      if (this.group.length < 1) {
        this.group = [e];
      }
    },
    // 维度固定
    changeTable(e) {
      if (this.group.length < 1) return;
      if (this.changeTableTimer) return;
      this.changeTableTimer = setTimeout(() => {
        this.all = e.length == this.fixedcolumn.length ? true : false;
        this.tableData.currentPage = 1;
        this.getOperateInvest();
        this.changeTableTimer = null;
      }, 1000);
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
        this.setdefaultcolumn();
      }
      this.tableData.currentPage = 1;
      this.getOperateInvest();
    },
    getDashboardSetting() {
      // this.initFrom()
      // this.init();
    },
    videoplay(url) {
      window.open(url);
    },
    init() {
      this.tableData.currentPage = 1;
      this.tableData.data = [];
      this.datekey += 1;
      let query = this.$route.query;
      this.index_order_id = query.order_id;
      this.setdefaultcolumn(); // 设置数据报表默认维度
      if (!query.order_id) {
        this.getOperateInvest(); //获取表格数据
      }
      this.getAuthor();
      this.getScreening(); //获取联动下拉框数据
      this.getParamDetail(); // 获取自定义字段
      this.getParamDetailDay(); // 获取分日助推自定义字段
    },
    onSortChange(e) {
      let order = e.order == "descending" ? "desc" : "asc";
      this.sort_prop = e.prop;
      this.sort_order = order;
      this.getOperateInvest();
    },
    onSubmit() {
      this.tableData.currentPage = 1;
      this.getOperateInvest();
    },

    // 获取自定义字段
    async getParamDetail() {
      const [err, res] = await this.$http.post(
        "Operate_Boost/customFieldList",
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
      this.paramDetailData1 = res;
      this.opertionParams()
    },
    // 获取分日助推自定义字段
    async getParamDetailDay() {
      const [err, res] = await this.$http.post(
        "Operate_Boost_day/customFieldList",
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
      this.paramDetailData2 = res;

      this.opertionParams()

    },
    opertionParams() {
      // 设置当前自定义字段
      this.paramDetailData = this[`paramDetailData${this.selfCustomFiledIndex}`]
      // 设置当前table需要使用的字段
      this.paramDetailDataList = this[`paramDetailData${this.tableActiveIndex}`]
      // 处理自定义字段
      this.showchangeColumn();
    },
    showchangeColumn() {
      // 获取自定义字段
      for (const k of this.paramDetailDataList.show) {
        k["prop"] = k.field;
        k["label"] = k.value;
        k["sortable"] = k.order ? "custom" : false;
      }
      // this.setFlexColumn();
    },
    async getAuthor() {
      const [err, res] = await this.$http.post("Operate_Invest/getAuthor", {
        platform: 9,
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

    /**
     * 
     * @param {*} params 公共参数  默认参数是初始化加载
     * @param {*} from 来源 有些是联动选择 对应的值就是方法名
     * 
     */
    async getScreening(params, from) {
      if (this.index_order_id) {
        this.tableData.loading = true;
      }
      let temp_params = {
        project: this.searchForm.project.appInfo,
        appid: this.searchForm.appid.appInfo,
        author_id: this.searchForm.talent.appInfo,
        ad_id: this.searchForm.channel.appInfo,
        campaign_id: this.searchForm.campaign_id.appInfo,
      }
      if (params) {
        temp_params = params
      }
      const [err, res] = await this.$http.post("Operate_Boost/screening", temp_params);
      if (err) {
        return;
      }
      if (from != 'getTalentId' || from != 'getChannelId') {
        this.author_id = res.author_id.map((item) => {
          return {
            id: item.id,
            title: item.title,
            subtitle: item.id,
          };
        });
      }
      if (from != 'getChannelId') {
        this.channel_id = res.ad_id.map((item) => {
          return {
            id: item.title,
            title: item.title,
            subtitle: item.id,
          };
        });
      }

      this.campaign_id = res.campaign_id.map((item) => {
        return {
          id: item.id,
          title: item.title + "",
          subtitle: item.id,
        };
      });
      if (!from || from == 'changeApp') {
        this.apps_default = res.appid;
        this.apps = res.appid;
      }

      if (!from) {
        this.article_id = res.project_id;
      }



      // 处理从首页跳转过来的参数
      if (!params) {
        this.opertionIndex();
      }
    },
    // 处理从首页跳转过来的参数
    opertionIndex() {
      if (!this.index_order_id) return  // 只有首页跳转过来的时候才走此流程
      const idx = this.channel_id.findIndex(
        (el) => el.subtitle == this.index_order_id
      );
      if (idx > -1) {
        this.searchForm.channel.appInfo = [this.channel_id[idx].title];
        this.datekey += 1;
        this.searchForm.promotion_begin_time = [];
        this.getOperateInvest();
      } else {
        this.tableData.loading = false;
        this.$message({
          message: `没有找到${this.index_order_id}相关的数据`,
          type: 'warning'
        });
      }
    },

    // 切换项目组之后筛选app
    async changeApp(val) {
      if (this.searchForm.project.appInfo.length == 0) {
        return;
      }
      this.searchForm.appid.appInfo = [];
      this.searchForm.talent.appInfo = [];
      this.searchForm.channel.appInfo = [];
      this.searchForm.campaign_id.appInfo = [];
      this.getScreening({
        project: this.searchForm.project.appInfo,
      }, 'changeApp')
      // const [err, res] = await this.$http.post("Operate_Boost/screening", {
      //   project: this.searchForm.project.appInfo,
      // });
      // if (err) {
      //   return;
      // }
      // this.author_id = res.author_id.map((item) => {
      //   return {
      //     id: item.id,
      //     title: item.title,
      //     subtitle: item.id,
      //   };
      // });
      // this.channel_id = res.ad_id.map((item) => {
      //   return {
      //     id: item.id,
      //     title: item.title,
      //     subtitle: item.id,
      //   };
      // });
      // this.campaign_id = res.campaign_id.map((item) => {
      //   return {
      //     id: item.id,
      //     title: item.title + "",
      //     subtitle: item.id,
      //   };
      // });
      // this.apps_default = res.appid;
      // this.apps = res.appid;
    },
    async getChannel(val) {
      if (this.searchForm.appid.appInfo.length == 0) {
        return;
      }
      this.searchForm.talent.appInfo = [];
      this.searchForm.channel.appInfo = [];
      this.searchForm.campaign_id.appInfo = [];
      this.getScreening({
        project: this.searchForm.project.appInfo,
        appid: this.searchForm.appid.appInfo,
      }, 'getChannel')

      // const [err, res] = await this.$http.post("Operate_Boost/screening", {
      //   project: this.searchForm.project.appInfo,
      //   appid: this.searchForm.appid.appInfo,
      // });
      // if (err) {
      //   return;
      // }
      // this.author_id = res.author_id.map((item) => {
      //   return {
      //     id: item.id,
      //     title: item.title,
      //     subtitle: item.id,
      //   };
      // });
      // this.channel_id = res.ad_id.map((item) => {
      //   return {
      //     id: item.id,
      //     title: item.title,
      //     subtitle: item.id,
      //   };
      // });
      // this.campaign_id = res.campaign_id.map((item) => {
      //   return {
      //     id: item.id,
      //     title: item.title + "",
      //     subtitle: item.id,
      //   };
      // });
    },
    async getTalentId() {
      if (this.searchForm.talent.appInfo.length == 0) {
        return;
      }
      this.searchForm.channel.appInfo = [];
      this.searchForm.campaign_id.appInfo = [];
      this.getScreening({
        project: this.searchForm.project.appInfo,
        appid: this.searchForm.appid.appInfo,
        author_id: this.searchForm.talent.appInfo,
      }, 'getTalentId')
      // const [err, res] = await this.$http.post("Operate_Boost/screening", {
      //   project: this.searchForm.project.appInfo,
      //   appid: this.searchForm.appid.appInfo,
      //   author_id: this.searchForm.talent.appInfo,
      // });
      // if (err) {
      //   return;
      // }
      // this.channel_id = res.ad_id.map((item) => {
      //   return {
      //     id: item.id,
      //     title: item.title,
      //     subtitle: item.id,
      //   };
      // });
      // this.campaign_id = res.campaign_id.map((item) => {
      //   return {
      //     id: item.id,
      //     title: item.title + "",
      //     subtitle: item.id,
      //   };
      // });
    },
    // 获取渠道
    async getChannelId() {
      if (this.searchForm.channel.appInfo.length == 0) {
        return;
      }
      this.searchForm.campaign_id.appInfo = [];
      this.getScreening({
        project: this.searchForm.project.appInfo,
        appid: this.searchForm.appid.appInfo,
        author_id: this.searchForm.talent.appInfo,
        ad_id: this.searchForm.channel.appInfo,
      }, 'getChannelId')
      // const [err, res] = await this.$http.post("Operate_Boost/screening", {
      //   project: this.searchForm.project.appInfo,
      //   appid: this.searchForm.appid.appInfo,
      //   author_id: this.searchForm.talent.appInfo,
      //   ad_id: this.searchForm.channel.appInfo,
      // });
      // if (err) {
      //   return;
      // }
      // this.campaign_id = res.campaign_id.map((item) => {
      //   return {
      //     id: item.id,
      //     title: item.title + "",
      //     subtitle: item.id,
      //   };
      // });
    },
    initFrom() {
      this.tableData.loading = true;
      this.searchForm = {
        project: {
          appInfo: [],
        },
        appid: {
          appInfo: [],
        },
        talent: {
          appInfo: [],
        },
        admin: {
          appInfo: [],
        },
        platform: "9",
        channel: {
          appInfo: [],
        },
        campaign_id: {
          appInfo: [],
        },
        unit_type: [],
        status: [],
        target_type: [],
        promotion_begin_time: [
          moment().subtract(6, "d").format("YYYY-MM-DD"),
          moment().subtract(0, "d").format("YYYY-MM-DD"),
        ],
        closing_time: [],
        date: [],
      };
      this.tableData.currentPage = 1;
      this.tableData.data = [];
      this.datekey += 1;
      this.tableData.total = 0;
      this.getOperateInvest(); //获取表格数据
    },
    // 监听分页切换
    onPageChange(val) {
      this.tableData.currentPage = val;
      this.getOperateInvest();
    },
    // 监听改变分页
    onSizeChange(current) {
      this.tableData.pageSize = current;
      this.getOperateInvest();
    },
    // 自定义字段切换tab
    orderpackageTypeClickTab(id) {
      if (this.selfCustomFiledIndex === id) return;
      this.selfCustomFiledIndex = id;
      this.paramDetailData = this[`paramDetailData${id}`]
      this.$nextTick(() => {
        this.$refs.TransferDialog.init()
      })
    },
    // 切换助推累计tab
    orderpackageTypeClick(id) {
      if (this.tableActiveIndex === id) return;
      this.tableActiveIndex = id;
      // 重置某些查询数据
      this.sort_prop = ''
      this.sort_order = ''
      this.tableData.pageSize = 10
      this.tableData.currentPage = 1
      /**
       * 需要处理一下固定字段下面的数据，
       * 如果是助推累计数据不显示分日报表时间
       */
      const excludeValue = [{
        label: "分日报表时间",
        prop: "date",
        fixed: false,
        ordernum: 0.9,
        width: 150,
        value: 1010,
      }]
      if (id == 2) {
        this.fixedcolumn = excludeValue.concat(this.fixedcolumn)
      } else {
        // 需要把分日助推时间屏蔽掉
        this.fixedcolumn.splice(0, 1)
      }
      // 把分页改为1
      this.searchForm.currentPage = 1
      // 切换table时也要把固定维度一起更改
      this.group = this[`group${id}`]
      // 处理自定义字段,重新切换到当前tab的所需字段
      this.paramDetailDataList = this[`paramDetailData${id}`]
      this.showchangeColumn();
      // 获取table表单数据
      this.getOperateInvest()
    },
    getCampaignId() { },

    // 请求列表数据
    async getOperateInvest() {
      this.tableData.loading = true;
      // 处理助推目标数据
      let unit_type = [];
      if (this.searchForm.unit_type.length) {
        this.searchForm.unit_type.forEach((item) => {
          if (item.indexOf(",")) {
            let arr = item.split(",");
            arr.forEach((_item) => {
              unit_type.push(Number(_item));
            });
          } else {
            unit_type.push(Number(item));
          }
        });
      }

      /**
       * 处理channel 因为组件返回的都是渠道号；但是此处后台接受的ad_id 所以需要转换一下
       */

      let ad_id = []
      const channel_appinfo = this.searchForm.channel.appInfo
      for (const i of channel_appinfo) {
        const result = _.find(this.channel_id, { title: i })
        ad_id.push(result.subtitle)
      }

      const [err, res] = await this.$http.post(this.leadApi, {
        project: this.searchForm.project.appInfo,
        appid: this.searchForm.appid.appInfo,
        author_id: this.searchForm.talent.appInfo,
        ad_id: ad_id,
        campaign_id: this.searchForm.campaign_id.appInfo,
        unit_type: unit_type,
        list_group: this.group,
        order: this.sort_order,
        prop: this.sort_prop,
        target_type: this.searchForm.target_type,
        status: this.searchForm.status,
        promotion_begin_time: this.searchForm.promotion_begin_time,
        closing_time: this.searchForm.closing_time,
        date: this.searchForm.date,
        income_type: this.searchForm.income_type,
        task_date: this.searchForm.task_date,
        currentPage: this.tableData.currentPage,
        pageSize: this.tableData.pageSize,
        admin_id: this.searchForm.admin.appInfo,
      });
      this.tableData.loading = false;
      if (err) {
        return;
      }

      // 现在已经有的显示维度
      let fixedcolumn = [];
      for (const i of this.fixedcolumn) {
        if (this.group.indexOf(i.value) > -1) {
          fixedcolumn.push(i);
        }
      }

      // 需要乘以100加上%
      let multiply100_arr = [
        "total_roi",
        "played3s_percent",
        "order_rate",
        "activate_pay_rate",
        "pay_ok_rate",
        "play_percent",
        "action_percent",
        'fnum_day1',
        'fnum_day2',
        'fnum_day3',
        'fnum_day7',
        'roi1',
        'roi2',
        'roi3',
        'roi4',
        'roi5',
        'roi6',
        'roi7',
        'roi14',
        'roi30',
        'roi60',
        'roi90',
        'roi180',
        'roi365',
        'new_day2',
        'new_day3',
        'new_day7',
        'new_day30'
      ];
      // 保留整数
      let notFormatarr = [
        "device_new",
        "conversion",
        "order_num",
        "order_pay_num",
        "view",
        "action",
        "click",
        "play",
        "comment",
        "admire",
      ];
      // id 不需要任何处理
      let notFormatarr_of_id = [
        "ad_id",
        "campaign_id",
        "author_id",
        "supplement_order_id",
        "order_id",
        "avatar_uri",
        'date'
      ];
      // 处理均值和总值
      if (res.avg) {
        res.data.unshift(res.avg);
      }
      if (res.sum) {
        res.data.unshift(res.sum);
      }

      for (const i of res.data) {
        for (const key in i) {
          if (key === "new_add_arpu") {
            // 特殊字段保留4位
            i[key] = i[key]
              ? `${parseFloat((i[key] * 1).toFixed(4)).toLocaleString()}`
              : 0;
          } else if (multiply100_arr.indexOf(key) > -1) {
            // 百分比乘以100 保留两位
            i[key] = i[key] > 0
              ? `${parseFloat((i[key] * 100).toFixed(2)).toLocaleString()}%`
              : "0.00%";
          } else if (
            (Number(i[key]) || Number(i[key]) == 0) &&
            notFormatarr.indexOf(key) == -1 &&
            notFormatarr_of_id.indexOf(key) == -1
          ) {
            // 无特殊要求保留两位
            i[key] = i[key]
              ? `${parseFloat((i[key] * 1).toFixed(2)).toLocaleString()}`
              : "0.00";
          } else if (
            (Number(i[key]) || Number(i[key]) == 0) &&
            notFormatarr.indexOf(key) > -1
          ) {
            // 向下取整
            i[key] = i[key] ? Math.floor(i[key]).toLocaleString() : 0;
          }
        }
      }

      // 统一处理均值的数据 向下取整
      // for (const key in res.avg) {
      //   if (notFormatarr.indexOf(key) > -1) {
      //     res.avg[key] = Math.floor(res.avg[key])
      //   }
      // }

      const { last_page, per_page, data, total } = res;
      res.data.splice(0, 2);

      this.data_avg = res.avg;
      this.data_sum = res.sum;
      this.tableData.pageSize = per_page;
      this.tableData.total = total;
      // this.tableData.data = data;
      this.tableData_data_temp = data;
      if (this.group.indexOf(1001) !== -1) {
        this.operateFlag = true;
      } else {
        this.operateFlag = false;
      }
      this.setFlexColumn();
    },
    setFlexColumn(arr) {
      let fixedcolumn = [];
      if (arr) {
        fixedcolumn = arr;
      } else {
        for (const i of this.fixedcolumn) {
          if (this.group.indexOf(i.value) > -1) {
            fixedcolumn.push(i);
          }
        }
      }

      // 处理时间
      const time_index = fixedcolumn.findIndex((el) => el.value == 1000);
      if (time_index > -1) {
        fixedcolumn = [...fixedcolumn, ...fixedcolumn[time_index].association];
        fixedcolumn.splice(time_index, 1);
      }

      // 处理达人信息
      const author_index = fixedcolumn.findIndex((el) => el.value == 1003);
      if (author_index > -1) {
        fixedcolumn = [
          ...fixedcolumn,
          ...fixedcolumn[author_index].association,
        ];
        fixedcolumn.splice(author_index, 1);
      }

      // 处理助推关系
      const fixedcolumn1002_index = fixedcolumn.findIndex(
        (el) => el.value == 1002
      );
      const fixedcolumn1001_index = fixedcolumn.findIndex(
        (el) => el.value == 1001
      );
      if (fixedcolumn1002_index > -1 || fixedcolumn1001_index > -1) {
        fixedcolumn = [
          ...fixedcolumn,
          ...fixedcolumn[
            fixedcolumn1002_index > -1
              ? fixedcolumn1002_index
              : fixedcolumn1001_index
          ].association,
        ];
      }

      // 处理回传状态
      const fixedcolumn1004_index = fixedcolumn.findIndex(
        (el) => el.value == 1004
      );
      const fixedcolumn1009_index = fixedcolumn.findIndex(
        (el) => el.value == 1009
      );
      if (fixedcolumn1004_index > -1 && fixedcolumn1009_index > -1) {
        fixedcolumn = [
          ...fixedcolumn,
          ...fixedcolumn[fixedcolumn1009_index].association,
        ];
      }

      fixedcolumn.forEach((el) => {
        el.fixed = this.flexFlag;
      });

      fixedcolumn.sort(this.orts_fun("ordernum")); // 固定字段排序

      // 处理均值和总值
      if (this.data_avg) {
        this.data_avg[fixedcolumn[0].prop] = "均值";
        this.data_avg.header_title = "均值";
        this.tableData_data_temp.unshift(this.data_avg);
      }
      if (this.data_sum) {
        this.data_sum[fixedcolumn[0].prop] = "总计";
        this.data_sum.header_title = "总计";
        this.tableData_data_temp.unshift(this.data_sum);
      }
      this.fixedcolumn_temp = fixedcolumn;
      this.column = fixedcolumn.concat(this.paramDetailDataList.show);
      if (this.operateFlag) {
        this.column.push({
          label: "操作",
          prop: "operate",
          width: "180",
        });
      }
      // 重新赋值方式数据格式错乱
      setTimeout(() => {
        this.tableData.data = _.cloneDeep(this.tableData_data_temp);
        this.$refs.TableLayout.doLayout();
      }, 500);
    },

    // 固定字段排序
    orts_fun(arr) {
      return function (a, b) {
        var v1 = a[arr];
        var v2 = b[arr];
        return v1 - v2;
      };
    },
    /**
     * 
     * 监听自定义字段移动之后更新现有的数据
     * 主要用户多个表更改之后一起更新
     */
    moveItem(data) {
      this[`paramDetailData${this.selfCustomFiledIndex}`] = data
    },
    /**
     * 
     * 自定义字段保存
     * 两个tab的数据点击保存的时候同时保存
     */
    async paramSave(val) {
      this.tableData.loading = true;
      for (let i = 1; i < 3; i++) {
        // 分别为累计助推字段数据和分日助推字段数据
        let paramDetailData = this[`paramDetailData${i}`]
        // 获取显示字段id
        let show = paramDetailData.show.map((item) => {
          return item.field_id;
        });
        // 隐藏字段id
        let hidden = paramDetailData.hidden.map((item) => {
          return item.field_id;
        });
        const [err, res] = await this.$http.post("Business/paramSave", {
          cate: i == 1 ? 30 : 35, // 30 助推累计 35 分日助推
          show,
          hidden,
        });
        if (err) return;
      }
      this.tableData.currentPage = 1;
      this.getParamDetail(); // 重新获取字段
      this.getParamDetailDay(); // 重新获取字段
      this.getOperateInvest(); // 请求table数据

    },
    popularize_end(val) {
      this.$confirm(
        "结束推广后，该流量助推订单停止消耗并进行结算，未消耗金额返还账户！",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          const [err, res] = await this.$http.post(
            "Operate_Boost/adIdExchangeOrderId",
            {
              ad_id: val.ad_id,
            }
          );
          if (err) {
            this.$message.error("请手动填写聚星订单ID");
            this.disabled = false;
            return;
          }
          this.advertiser_id = res.advertiser_id;
          this.order_id = res.order_id;
          const [err2, res2] = await this.$http.post(
            "Operate_Boost/advertiserIdToToken",
            {
              advertiser_id: this.advertiser_id,
            }
          );
          if (err2) {
            return;
          }
          axios.defaults.baseURL = "/supplement_order";
          axios({
            method: "post",
            url: "stop",
            data: {
              advertiser_id: this.advertiser_id,
              supplement_order_type: 1,
              supplement_order_ids: [val.supplement_order_id],
            },
            headers: { "Access-Token": res2.access_token },
          })
            .then((res) => {
              if (res.data.code === 500000) {
                this.$message.error(res.data.message);
              }
              if (res.data.code === 0) {
                this.$message({
                  message: `停投成功`,
                  type: "success",
                  showClose: true,
                  duration: 0,
                });
              }
              this.advertiser_id = "";
              this.order_id = "";
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          //几点取消的提示
        });
    },
    changeMoney(row) {
      this.centerDialogVisible = true;
      this.order_info = row;
    },
    async modify_price() {
      if (Number(this.price_money) < 0.08 || Number(this.price_money) > 9.9) {
        this.$message.error("修改金额不可低于0.08元,不可高于9.9元");
        return;
      }
      const [err, res] = await this.$http.post(
        "Operate_Boost/adIdExchangeOrderId",
        {
          ad_id: this.order_info.ad_id,
        }
      );
      if (err) {
        this.$message.error("请手动填写聚星订单ID");
        this.disabled = false;
        return;
      }
      this.advertiser_id = res.advertiser_id;
      this.order_id = res.order_id;
      const [err2, res2] = await this.$http.post(
        "Operate_Boost/advertiserIdToToken",
        {
          advertiser_id: this.advertiser_id,
        }
      );
      if (err2) {
        return;
      }
      axios.defaults.baseURL = "/supplement_order";
      axios({
        method: "post",
        url: "unit_price/update",
        data: {
          advertiser_id: this.advertiser_id,
          unit_price: this.price_money * 1000,
          supplement_order_id: this.order_info.supplement_order_id,
        },
        headers: { "Access-Token": res2.access_token },
      })
        .then((res) => {
          if (res.data.code === 500000) {
            this.$message.error(res.data.message);
          }
          if (res.data.code === 0) {
            this.$message({
              message: `改价成功,助推订单号为:${res.data.data.supplement_order_id}`,
              type: "success",
              showClose: true,
              duration: 0,
            });
          }
          this.order_info = {};
          this.price_money = "";
          this.centerDialogVisible = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openModifyPrice() {
      this.price_money = "";
      this.ad_id = "";
    },
    changePrice(val) {
      this.price_money = this.proving(val);
    },
    proving(e) {
      let num = e;
      console.log(e);
      // 先把非数字的都替换掉，除了数字和.
      num = num.replace(/[^\d.]/g, "");
      // 必须保证第一个为数字而不是.
      num = num.replace(/^\./g, "");
      // 保证只有出现一个.而没有多个.
      num = num.replace(/\.{3,}/g, "");
      // 保证.只出现一次，而不能出现两次以上
      num = num.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      let index = -1;
      for (let i in num) {
        if (num[i] === ".") {
          index = i;
        }
        if (index !== -1) {
          if (i - index > 2) {
            num = num.substring(0, num.length - 1);
          }
        }
      }
      if (Number(num) > 9.99) {
        num = 9.99;
      }
      return num;
    },
    customize_proving(e) {
      let num = e;
      console.log(e);
      // 先把非数字的都替换掉，除了数字和.
      num = num.replace(/[^\d.]/g, "");
      // 必须保证第一个为数字而不是.
      num = num.replace(/^\./g, "");
      // 保证只有出现一个.而没有多个.
      num = num.replace(/\.{3,}/g, "");
      // 保证.只出现一次，而不能出现两次以上
      num = num.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      let index = -1;
      for (let i in num) {
        if (num[i] === ".") {
          index = i;
        }
        if (index !== -1) {
          if (i - index > 2) {
            num = num.substring(0, num.length - 1);
          }
        }
      }
      if (Number(num) > 10000) {
        num = 10000;
      }
      return num;
    },
    open_drawer() {
      this.drawer = true;
    },
    changeHeat() {
      this.$refs["ruleForm"].resetFields();
      this.active = 1;
      this.promotionForm.campaign_type = 20;
      this.promotionForm.unit_charge_type = "101";
    },
    changeApp_img() {
      this.$refs["ruleForm"].resetFields();
      this.active = 2;
      this.promotionForm.campaign_type = 30;
      this.promotionForm.unit_charge_type = "104";
    },
    changePromotion_unit_price_type(val) {
      if (val == 1) {
        this.promotionForm.money = "";
      }
    },
    changepromotino_money(val) {
      this.promotionForm.money = this.proving(val);
    },
    changepromotino_customize_money(val) {
      this.promotionForm.customize_money = this.customize_proving(val);
    },
    changePromotion_target_type(val) { },
    // 获取聚星订单ID
    async getAdIdExchangeOrderId(val) {
      const [err, res] = await this.$http.post(
        "Operate_Boost/adIdExchangeOrderId",
        {
          ad_id: this.promotionForm_ad_id,
        }
      );
      if (err) {
        this.$message.error("请手动填写聚星订单ID");
        this.disabled = false;
        return;
      }
      this.disabled = true;
      this.advertiser_id = res.advertiser_id;
      this.order_id = res.order_id;
    },
    changeRegion_bundle(val) {
      let arr = this.regionData.data.regions.map((item) => {
        return JSON.parse(item.region);
      });
      arr.forEach((item) => {
        item.forEach((_item) => {
          if (_item.children.length) {
            _item.children.forEach((__item) => {
              console.log(__item.children);
              if (__item.children && __item.children.length) {
                __item.children.forEach((__item_) => {
                  delete __item_.children;
                });
              } else {
                delete __item.children;
              }
            });
          } else {
            delete _item.children;
          }
        });
      });
      if (val === "1") {
        this.region_type_list = arr[0];
      }
      if (val === "3") {
        this.region_type_list = arr[1];
      }
      console.log(this.region_type_list);
    },
    changePromotion_multi_ages(val) {
      if (val[val.length - 1] == "") {
        this.promotionForm.multi_ages = [""];
      }
      if (val[val.length - 1] !== "" && val.indexOf("") !== -1) {
        this.promotionForm.multi_ages.forEach((item, index) => {
          if (item == "") {
            this.promotionForm.multi_ages.splice(index, 1);
          }
        });
      }
    },
    async submitPromotion() {
      console.log(this.promotionForm.region_ids);
      let region_ids_list = [];
      //城市ID
      this.promotionForm.region_ids.forEach((item) => {
        region_ids_list.push(item.join("-"));
      });
      let submitObj = {};
      if (this.promotionForm.target_type == 2) {
        submitObj = {
          advertiser_id: this.advertiser_id,
          order_id: this.order_id,
          campaign_type: this.promotionForm.campaign_type,
          unit_charge_type: this.promotionForm.unit_charge_type,
          target_type: this.promotionForm.target_type,
          unit_price_type:
            this.active == 2 ? 1 : this.promotionForm.unit_price_type,
          pay_method: this.promotionForm.pay_method,
          amount: this.promotionForm.amount * 1000,
          unit_price: this.promotionForm.customize_money * 1000,
          promotion_duration:
            this.promotionForm.promotion_duration * 60 * 60 * 1000,
          target_info: {
            gender: this.promotionForm.gender,
            multi_ages: this.promotionForm.multi_ages,
            region_bundle: {
              region_type: this.promotionForm.region_bundle,
              region_ids: region_ids_list,
            },
          },
        };
        if (!this.promotionForm.gender) {
          delete submitObj.target_info.gender;
        }
        if (this.promotionForm.multi_ages[0] === "") {
          delete submitObj.target_info.multi_ages;
        }
        if (!this.promotionForm.region_bundle) {
          delete submitObj.target_info.region_bundle;
        }
        if (
          !this.promotionForm.region_bundle &&
          this.promotionForm.multi_ages[0] === "" &&
          !this.promotionForm.gender
        ) {
          delete submitObj.target_info;
        }
      } else {
        submitObj = {
          advertiser_id: this.advertiser_id,
          order_id: this.order_id,
          campaign_type: this.promotionForm.campaign_type,
          unit_charge_type: this.promotionForm.unit_charge_type,
          target_type: this.promotionForm.target_type,
          unit_price_type:
            this.active == 2 ? 1 : this.promotionForm.unit_price_type,
          pay_method: this.promotionForm.pay_method,
          amount: this.promotionForm.amount * 1000,
          unit_price: this.promotionForm.customize_money * 1000,
          promotion_duration:
            this.promotionForm.promotion_duration * 60 * 60 * 1000,
        };
      }
      const [err, res] = await this.$http.post(
        "Operate_Boost/advertiserIdToToken",
        {
          advertiser_id: this.advertiser_id,
        }
      );
      if (err) {
        return;
      }
      axios.defaults.baseURL = "/supplement_order";
      console.log(submitObj);
      axios({
        method: "post",
        url: "star_video/create",
        data: submitObj,
        headers: { "Access-Token": res.access_token },
      })
        .then((res) => {
          if (res.data.code === 500000) {
            this.$message.error(res.data.message);
          }
          if (res.data.code === 0) {
            this.$message({
              message: `下单成功,助推订单ID为${res.data.data.supplement_order_id}`,
              type: "success",
              showClose: true,
              duration: 0,
            });
          }
          this.closePromotion();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    closePromotion() {
      this.promotionForm = {
        campaign_type: 30,
        unit_charge_type: "104",
        unit_price_type: "2",
        target_type: "1",
        promotion_duration: "24",
        amount: "500",
        pay_method: "1",
        money: "",
        region_bundle: "",
        gender: "",
        multi_ages: [""],
        time: "",
        customize_money: "",
        region_ids: [],
      };
      this.promotionForm_ad_id = "";
      this.order_id = "";
      this.disabled = true;
      this.region_type_list = [];
      this.active = 2;
      this.drawer = false;
    },
  },
  watch: {
    "promotionForm.region_ids"(newVal, oldVal) {
      if (newVal.length > 50) {
        this.$message.error("最多支持50项");
        this.$nextTick(() => {
          this.promotionForm.region_ids = oldVal;
        });
      }
    },
    // 监听group的变化
    group: {
      handler: function (val) {
        this[`group${this.tableActiveIndex}`] = val
      }, immediate: true,
      deep: true
    }
  },
};
</script>

<style lang="less" scoped>
.mrt_10 {
  margin-top: 10px;
}

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

.Tab_box {
  display: flex;
  justify-content: space-between;
  flex: 1;
  align-items: center;

  button {
    margin-right: 20px;
  }

  .left_box {
    line-height: 40px;
    width: 300px;
    display: flex;

    .my-select {
      height: 40px;
    }

    .btns {
      margin-left: 20px;
    }
  }
}

.check-all {
  padding: 0 20px;
  text-align: right;
}

.head_image_uri {
  width: 100px;
  height: 100px;
  object-fit: contain;
  cursor: pointer;
}

.avatar_uri {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  border-radius: 3px;
}

/deep/.el-drawer {
  width: 700px !important;
}

.promotion {
  display: flex;
  justify-content: space-around;

  .box {
    position: relative;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    width: 190px;
    height: 95px;
    cursor: pointer;
  }

  .pos_img {
    position: absolute;
    top: 8px;
    right: 16px;
    color: #0075ff;
    font-size: 24px;
  }

  .active {
    border: 1px solid #0075ff;
  }
}

.foot_pay {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  text-align: right;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
  height: 80px;
  padding: 20px;
  z-index: 999;

  .foot_num {
    display: inline-block;
    margin-right: 30px;
  }
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

.ac {
  display: flex;
  align-items: center;
}
</style>
