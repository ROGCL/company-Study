<template >
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
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="渠道" prop="channel">
          <SelectChannel v-model="searchForm.channel"></SelectChannel>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="订单统计" prop="isNewUser">
          <el-select
            v-model="searchForm.isNewUser"
            placeholder="请选择订单统计"
            :popper-append-to-body="false"
          >
            <el-option
              :key="i"
              :label="v.label"
              :value="v.value"
              v-for="(v, i) in isNewUserOption"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="时间刻度" prop="timeType">
          <el-radio-group v-model="searchForm.timeType">
            <el-radio-button
              v-for="(v, i) in timeTypeConfig"
              :key="i"
              :disabled="v.disabled"
              :label="v.value"
            >{{v.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <CountLayout
      type="newBar"
      :option="countData.data"
      :loading="countData.loading"
      :countInfo="countData.totalInfo"
    >
      <template #option>
        <el-col :md="12" :sm="12">
          <el-form-item label="筛选项">
            <el-radio-group v-model="select" @change="onSelectChange">
              <el-radio-button v-for="(v, i) in selectOption" :key="i" :label="v.value">{{v.label}}</el-radio-button>
            </el-radio-group>
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
      @pageChange="onPageChange"
      @sizeChange="onSizeChange"
      :headerCellStyle="headerCellStyle"
    >
      <template #table-option>
        <el-radio-group v-model="tableSelect">
          <el-radio-button v-for="(v, i) in tableSelectOption" :key="i" :label="v.value">{{v.label}}</el-radio-button>
        </el-radio-group>
      </template>
      <template #first_new_num_rate="scope">{{scope.row.first_new_num_rate | formatPercentage}}</template>
      <template #first_new_price_rate="scope">{{scope.row.first_new_price_rate | formatPercentage}}</template>
      <template #first_old_num_rate="scope">{{scope.row.first_old_num_rate | formatPercentage}}</template>
      <template #first_old_price_rate="scope">{{scope.row.first_old_price_rate | formatPercentage}}</template>
      <template #after_old_num_rate="scope">{{scope.row.after_old_num_rate | formatPercentage}}</template>
      <template #after_old_price_rate="scope">{{scope.row.after_old_price_rate | formatPercentage}}</template>
    </TableLayout>
  </div>
</template >

<script >
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import FilterLayout from '@/layout/form'
import CountLayout from '@/layout/count'
import TableLayout from '@/layout/table'
import { pickerOptions, timeTypeOption, isNewUserOption } from '@/config/option'
import SelectChannel from '@/component/select-channel'

export default {
  components: {
    FilterLayout,
    TableLayout,
    CountLayout,
    SelectChannel,
  },
  data() {
    return {
      select: '3',
      columnIndexs: [],
      selectOption: [
        {
          label: '付费用户数',
          value: '1',
          unit: '人',
        },
        {
          label: '订单量',
          value: '2',
          unit: '单',
        },
        {
          label: '订单总金额',
          value: '3',
          unit: '元',
        },
      ],
      tableSelectOption: [
        {
          label: '数据总览',
          value: 'all',
        },
        {
          label: '首购数据',
          value: 'first',
        },
        {
          label: '复购数据',
          value: 'second',
        },
      ],
      searchForm: {
        time: [
          moment().subtract(30, 'd').format('YYYY-MM-DD'),
          moment().subtract(1, 'd').format('YYYY-MM-DD'),
        ],
        channel: [],
        isNewUser: 0,
        timeType: 1,
      },
      columns: {
        all: [
          {
            prop: 'date',
            label: '日期',
          },
          {
            prop: 'order_user_pay',
            label: '付费用户数',
          },    
          {
            prop: 'order_num_pay',
            label: '订单数',
          },
          {
            prop: 'order_price_pay',
            label: '订单总金额',
          },
          {
            prop: 'all_unit_price',
            label: '总客单价',
          },
          {
            prop: 'vip_arpu',
            label: '会员ARPU',
          },
          {
            prop: 'order_user_pay_first',
            label: '首购用户',
          },
          {
            prop: 'order_num_pay_first',
            label: '订单量',
          },
          {
            prop: 'order_price_pay_first',
            label: '订单总金额',
          },
          {
            prop: 'first_unit_price',
            label: '首购客单价',
          },
          {
            prop: 'first_vip_arpu',
            label: '首购会员ARPU',
          },
          {
            prop: 'order_user_pay_old_not_first',
            label: '复购老用户',
          },
          {
            prop: 'order_num_pay_old_not_first',
            label: '订单量',
          },
          {
            prop: 'order_price_pay_old_not_first',
            label: '订单总金额',
          },
          {
            prop: 'after_old_unit_price',
            label: '复购老用户客单价',
          },
          {
            prop: 'after_old_vip_arpu',
            label: '复购会员ARPU',
          },
        ],
        first: [
          {
            prop: 'date',
            label: '日期',
          },
          {
            prop: 'order_user_pay_new',
            label: '首购新用户数',
          },
          {
            prop: 'order_num_pay_new',
            label: '首购新用户订单量',
          },
          {
            prop: 'order_price_pay_new',
            label: '首购新用户订单总金额',
          },
          {
            prop: 'first_new_unit_price',
            label: '首购新用户客单价',
          },
          {
            prop: 'new_pay_cycle',
            label: '新用户首购周期（h）',
          },
          {
            prop: 'order_user_pay_old_new',
            label: '首购老用户数',
          },
          {
            prop: 'order_num_pay_old_new',
            label: '首购老用户订单量',
          },
          {
            prop: 'order_price_pay_old_new',
            label: '首购老用户订单总金额',
          },
          {
            prop: 'first_old_unit_price',
            label: '首购老用户客单价',
          },
          {
            prop: 'old_pay_cycle',
            label: '老用户首购周期（d）',
          },
          {
            prop: 'new_vip_arpu',
            label: '首日新用户会员ARPU',
          },
          {
            prop: 'old_vip_arpu',
            label: '首日老用户会员ARPU',
          },
          {
            prop: 'first_new_num_rate',
            label: '首购新用户订单占比',
          },
          {
            prop: 'first_new_price_rate',
            label: '首购新用户订单金额占比',
          },
          {
            prop: 'first_old_num_rate',
            label: '首购老用户订单占比',
          },
          {
            prop: 'first_old_price_rate',
            label: '首购老用户订单金额占比',
          },
        ],
        second: [
          {
            prop: 'date',
            label: '日期',
          },
          {
            prop: 'after_old_unit_price',
            label: '复购老用户客单价',
          },
          {
            prop: 'after_old_cycle',
            label: '老用户复购周期（d）',
          },
          {
            prop: 'after_old_vip_arpu',
            label: '复购会员arpu',
          },
          {
            prop: 'after_old_num_rate',
            label: '复购老用户订单占比',
          },
          {
            prop: 'after_old_price_rate',
            label: '复购老用户订单金额占比',
          },
        ],
      },
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      pickerOptions,
      countData: {
        data: {},
        loading: false,
        totalInfo: {},
      },
      chartHeaderLoopData: {},
      isNewUserOption,
      tableSelect: 'all',
    }
  },
  mounted() {
    this.fetchList()
    this.fetchCount()
  },
  computed: {
    ...mapState({
      tableData: (state) => state.order_amount.list,
    }),
    timeTypeConfig() {
      const { time } = this.searchForm

      return timeTypeOption(time)
    },
    currentUnit() {
      const { select, selectOption } = this

      return selectOption && selectOption.find((v) => v.value === select).unit
    },
    column() {
      const { columns, tableSelect } = this

      return columns[tableSelect] || []
    },
  },
  methods: {
    ...mapActions(['getOrderAmountList', 'getOrderAmountCount']),
    onSubmit() {
      this.tableOpt.currentPage = 1
      this.fetchList()
      this.fetchCount()
    },
    onPageChange(current) {
      this.tableOpt.currentPage = current

      this.fetchList()
    },
    onSizeChange(current) {
      this.tableOpt.pageSize = current;
      this.fetchList();
    },
    onSelectChange() {
      this.fetchCount()
    },
    async fetchList() {
      const { searchForm, tableOpt } = this
      const [err, res] = await this.getOrderAmountList({
        ...searchForm,
        ...tableOpt,
        navCate: 2,
        channel: searchForm['channel'].join(','),
        timeBegin: searchForm['time'][0],
        timeEnd: searchForm['time'][1],
      })

      if (err) {
        return
      }
    },
    async fetchCount() {
      const { select, searchForm, currentUnit } = this
      this.countData.loading = true

      const [err, res] = await this.$http.post(
        'Order_Statistics/orderMoneyColumnar',
        {
          ...searchForm,
          channel: searchForm['channel'] ? searchForm['channel'].join(',') : '',
          navCate: 5,
          timeBegin: searchForm['time'][0],
          timeEnd: searchForm['time'][1],
          select,
        }
      )

      this.countData.loading = false

      if (err) {
        this.countData.data = {
          legendData: [],
          xAxisData: [],
          data: [],
          yName: '',
        }
        return
      }
      let { date, data, totalInfo = {} } = res

      this.countData.totalInfo = totalInfo

      this.countData.data = {
        legendData: data,
        xAxisData: date,
        data,
        yName: currentUnit,
      }
    },
    headerCellStyle({ rowIndex, columnIndex }) {
      let tableSelect = this.tableSelect
      let columnIndexs
      if (tableSelect == 'all') {
        columnIndexs = [1, 2, 3, 4, 5, 11, 12, 13, 14, 15]
      } else if (tableSelect == 'first') {
        columnIndexs = [1,2,3,4,5,11,12,15,16]
      } else {
        columnIndexs = []
      }
      if (columnIndexs.includes(columnIndex)) {
        return 'background:#e6e6e6;'
      }
    },
  },
}
</script >

<style lang = "less" scoped >
</style >
