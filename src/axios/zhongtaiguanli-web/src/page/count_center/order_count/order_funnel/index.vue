<template>
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="时间" prop="time">
          <!-- <el-date-picker
            v-model="searchForm.time"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :append-to-body="false"
            unlink-panels
          /> -->
          <dataPicker :datevalue.sync="searchForm.time"></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="7" :sm="24">
        <el-form-item label="渠道" prop="channel">
          <SelectChannel v-model="searchForm.channel"></SelectChannel>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <Vecharts id="funnel" :option="funnelOption" height="400px" />
    <CountLayout
      :option="CountLayoutOption"
      :loading="countLoading"
      :countInfo="totalInfo"
    >
      <template #cetent>
        <el-radio-group
          v-model="allOrinfo"
          @change="onAllChange"
          v-if="channelFlag"
        >
          <el-radio-button :label="1">汇总走势</el-radio-button>
          <el-radio-button :label="2">明细走势</el-radio-button>
        </el-radio-group>
      </template>
      <template #option>
        <el-col :md="8" :sm="8">
          <el-form-item label="筛选项">
            <el-select
              v-model="select"
              placeholder="请选择筛选项"
              :popper-append-to-body="false"
              @change="onSelectChange"
            >
              <el-option label="新增激活（人）" value="5" />
              <el-option label="注册数量（人）" value="4" />
              <el-option label="下单数量(人)" value="1" />
              <el-option label="支付成功数量(人)" value="2" />
              <el-option label="激活付费率" value="6" />
              <el-option label="激活注册率" value="7" />
              <el-option label="注册下单率" value="8" />
              <el-option label="支付成功率" value="9" />
              <!-- <el-option label = "用户退单数量" value = "3" /> -->
            </el-select>
          </el-form-item>
        </el-col>
      </template>
    </CountLayout>
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      :params="searchForm"
      :leadOut="true"
      @sizeChange="onSizeChange"
      @pageChange="onPageChange"
    >
      <template #table-option>
        <el-radio-group v-model="searchForm.select" @change="onSelectTab">
          <el-radio-button
            v-for="(v, i) in tableSelectOption"
            :key="i"
            :label="v.value"
            >{{ v.label }}</el-radio-button
          >
        </el-radio-group>
      </template>
    </TableLayout>
  </div>
</template>

<script>
import moment from "moment";
import { mapState, mapActions } from "vuex";
import FilterLayout from "@/layout/form";
import CountLayout from "@/layout/count";
import TableLayout from "@/layout/table";
import {
  pickerOptions,
  timeTypeOption,
  isNewUserOption,
} from "@/config/option";
import { Order_Statistics_conversionFunnel } from "@/config/api/index";
import Vecharts from "@/component/echarts/echarts";
import SelectChannel from "@/component/select-channel";

export default {
  components: {
    FilterLayout,
    TableLayout,
    CountLayout,
    Vecharts,
    SelectChannel,
  },
  data() {
    return {
      select: "5",
      countLoading: false,
      searchForm: {
        select: 1,
        time: [
          moment().subtract(1, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
        channel: [],
        isNewUser: 0,
        timeType: 1,
      },
      column: [
        {
          prop: "date",
          label: "日期",
        },
        {
          prop: "new_device",
          label: "新增激活(人)",
        },
        {
          prop: "new_pay_rate",
          label: "激活付费率",
        },
        {
          prop: "device_new_reg",
          label: "注册数量(人)",
        },
        {
          prop: "new_reg_rate",
          label: "激活注册率",
        },
        {
          prop: "user_new_all_pay_num",
          label: "下单数量(人)",
        },
        {
          prop: "reg_all_rate",
          label: "注册下单率",
        },
        {
          prop: "user_new_pay_num",
          label: "支付成功数量(人)",
        },
        {
          prop: "all_pay_rate",
          label: "付款成功率",
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      countBar: {},
      pickerOptions: {
        ...pickerOptions,
        disabledDate: (date) => {
          return (
            moment(date).isBefore("2020-06-01") ||
            !moment(date).isBetween(moment().subtract(1, "y"), moment())
          );
        },
      },
      CountLayoutOption: {},
      totalInfo: {},
      funnelOption: {},
      isNewUserOption,
      tableSelectOption: [
        {
          label: "当日新用户",
          value: 1,
        },
        {
          label: "全部用户",
          value: 2,
        },
      ],
      allOrinfo: 1,
      channelFlag:false
    };
  },
  mounted() {
    this.countData();
    this.fetchList();
    this.Order_Statistics_conversionFunnel_funnel();
  },
  computed: {
    ...mapState({
      channel: (state) => state.channel.data,
      tableData: (state) => state.order_funnel.list,
    }),
    timeTypeConfig() {
      const { time } = this.searchForm;
      return timeTypeOption(time);
    },
  },
  methods: {
    ...mapActions(["getOrderFunnelList", "getOrderFunnelCount"]),
    onSubmit() {
      this.tableOpt.currentPage = 1;
      this.fetchList();
      this.Order_Statistics_conversionFunnel_funnel();
      this.countData();
      if (this.searchForm.channel.length) {
        this.channelFlag = true
      }else{
        this.channelFlag = false
        this.vAllOrinfo = 1
      }
    },
    onPageChange(current) {
      this.tableOpt.currentPage = current;
      this.fetchList();
    },
    onSizeChange(current) {
      this.tableOpt.pageSize = current;
      this.fetchList();
    },
    onSelectChange() {
      this.countData();
    },
    async fetchList() {
      const { searchForm, tableOpt } = this;
      const [err] = await this.getOrderFunnelList({
        ...searchForm,
        ...tableOpt,
        navCate: 2,
        channel: searchForm["channel"].join(","),
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });

      if (err) {
        return;
      }
    },
    Order_Statistics_conversionFunnel_funnel() {
      const { searchForm } = this;
      this.funnelOption = {
        loading: true,
      };
      Order_Statistics_conversionFunnel({
        ...searchForm,
        channel: searchForm["channel"].join(","),
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
        navCate: 3,
      }).then((res) => {
        let xAxisData = ["激活", "注册", "下单", "支付成功"];
        let data = res[1].list[1].data;
        let option = {
          tooltip: {
            trigger: "item",
            formatter: function (params) {
              let { dataIndex, name, value } = params;
              let result = `${name}： ${value}`;
              let changeName = `${name} / ${xAxisData[dataIndex - 1]}`;
              let changeValue =
                ((value / data[dataIndex - 1]) * 100).toFixed(2) + "%";
              if (dataIndex > 0 && value) {
                result += `<br/> ${changeName}：${changeValue}`;
              }
              return result;
            },
          },
          series: [
            {
              name: "漏斗图",
              type: "funnel",
              left: "10%",
              top: 60,
              bottom: 60,
              width: "80%",
              minSize: "0%",
              maxSize: "100%",
              sort: "descending",
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
                borderColor: "#fff",
                borderWidth: 1,
              },
              emphasis: {
                label: {
                  fontSize: 20,
                },
              },
              data: xAxisData.map((item, index) => {
                return {
                  name: item,
                  value: data[index],
                };
              }),
            },
          ],
        };
        this.funnelOption = option;
      });
    },
        onAllChange() {
      this.countData();
    },
    countData() {
      const { select, searchForm } = this;
      this.countLoading = true;
      Order_Statistics_conversionFunnel({
        ...searchForm,
        channel: searchForm["channel"] ? searchForm["channel"].join(",") : "",
        navCate: 5,
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
        select,
      }).then((res) => {
        let { date, list, totalInfo, listAll } = res[1];
        let Yname = "人";

        if (this.allOrinfo == 1 && searchForm["channel"].length > 0) {
          if (Number(select) > 5) {
            for (let key in listAll.all) {
              Yname = "百分比";
              listAll.all[key].value = (
                Number(listAll.all[key].value) * 100
              ).toFixed(2);
            }
            totalInfo.total = "";
            totalInfo.avg = (Number(totalInfo.avg) * 100).toFixed(2) + "%";
          }
          this.totalInfo = totalInfo;
          this.countLoading = false;
          this.CountLayoutOption = {
            legendData: Object.keys(listAll),
            xAxisData: date,
            data: listAll,
            yName: Yname,
            editData: true,
          };
        } else {
          if (Number(select) > 5) {
            for (let key in list.all) {
              Yname = "百分比";
              list.all[key].value = (
                Number(list.all[key].value) * 100
              ).toFixed(2);
            }
            totalInfo.total = "";
            totalInfo.avg = (Number(totalInfo.avg) * 100).toFixed(2) + "%";
          }
          this.totalInfo = totalInfo;
          this.countLoading = false;
          this.CountLayoutOption = {
            legendData: Object.keys(list),
            xAxisData: date,
            data: list,
            yName: Yname,
            editData: true,
          };
        }
      });
    },
    onSelectTab() {
      if (this.searchForm.select == 1) {
        this.column = [
          {
            prop: "date",
            label: "日期",
          },
          {
            prop: "new_device",
            label: "新增激活(人)",
          },
          {
            prop: "new_pay_rate",
            label: "激活付费率",
          },
          {
            prop: "device_new_reg",
            label: "注册数量(人)",
          },
          {
            prop: "new_reg_rate",
            label: "激活注册率",
          },
          {
            prop: "user_new_all_pay_num",
            label: "下单数量(人)",
          },
          {
            prop: "reg_all_rate",
            label: "注册下单率",
          },
          {
            prop: "user_new_pay_num",
            label: "支付成功数量(人)",
          },
          {
            prop: "all_pay_rate",
            label: "付款成功率",
          },
        ];
      } else {
        this.column = [
          {
            prop: "date",
            label: "日期",
          },
          {
            prop: "new_device",
            label: "新增激活(人)",
          },
          {
            prop: "user_new",
            label: "注册数量(人)",
          },
          {
            prop: "order_num",
            label: "下单数量(单)",
          },
          {
            prop: "order_num_pay",
            label: "支付成功数量(单)",
          },
          {
            prop: "all_pay_rate",
            label: "付款成功率",
          },
        ];
      }
      this.fetchList();
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-cascader__search-input{
  min-width: 10px;
}
</style>