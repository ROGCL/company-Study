<template >
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="时间" prop="time">
          <el-date-picker
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
          />
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
          <el-select
            v-model="searchForm.timeType"
            placeholder="请选择时间刻度"
            :popper-append-to-body="false"
          >
            <el-option
              :key="i"
              :label="v.label"
              :value="v.value"
              :disabled="v.disabled"
              v-for="(v, i) in timeTypeConfig"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <loopContrast v-bind="loopData" tooltip />
    <CountLayout :option="CountLayoutOption" :loading="countLoading">
      <template #option>
        <el-col :md="6" :sm="12">
          <el-form-item label="筛选项">
            <el-select
              v-model="select"
              placeholder="请选择筛选项"
              :popper-append-to-body="false"
              @change="onSelectChange"
            >
              <el-option label="退单均价" value="1" />
              <el-option label="退单金额" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <chartHeaderLoop v-bind="chartHeaderLoopData" />
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
    ></TableLayout>
  </div>
</template >

<script >
import moment from 'moment'
import _ from 'lodash'
import { mapState, mapActions, mapMutations } from 'vuex'
import FilterLayout from '@/layout/form'
import CountLayout from '@/layout/count'
import TableLayout from '@/layout/table'
import { pickerOptions, timeTypeOption, isNewUserOption } from '@/config/option'
import { Order_Statistics_orderChargeBack } from '@/config/api/index'
import loopContrast from '@/component/loopContrast/loopContrast'
import chartHeaderLoop from '@/component/loopContrast/chartHeaderLoop'
import SelectChannel from '@/component/select-channel'

export default {
  components: {
    FilterLayout,
    TableLayout,
    CountLayout,
    loopContrast,
    chartHeaderLoop,
    SelectChannel,
  },
  data() {
    return {
      select: '1',
      searchForm: {
        time: [
          moment().subtract(30, 'd').format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD'),
        ],
        channel: [],
        isNewUser: 0,
        timeType: 1,
      },
      column: [
        {
          prop: 'date',
          label: '日期',
        },
        {
          prop: 'buy_per',
          label: '退单均价(元)',
        },
        {
          prop: 'refund_per',
          label: '退单金额(元)',
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      pickerOptions,
      loopData: {},
      CountLayoutOption: {},
      chartHeaderLoopData: {},
      isNewUserOption,
    }
  },
  mounted() {
    this.fetchList()
    this.fetchCount()
    this.Order_Statistics_orderChargeBack()
    this.countData()
  },
  computed: {
    ...mapState({
      tableData: (state) => state.charge_back_amount.list,
      count: (state) => state.charge_back_amount.count.data,
      countLoading: (state) => state.charge_back_amount.count.loading,
    }),
    timeTypeConfig() {
      const { time } = this.searchForm

      return timeTypeOption(time)
    },
  },
  methods: {
    ...mapActions(['getChargeBackAmountList', 'getChargeBackAmountCount']),
    onSubmit(res) {
      this.tableOpt.currentPage = 1
      this.fetchList()
      this.fetchCount()
      this.Order_Statistics_orderChargeBack()
      this.countData()
    },
    onPageChange(current) {
      this.tableOpt.currentPage = current
      this.fetchList()
    },
    onSelectChange() {
      this.fetchCount()
      this.countData()
    },
    async fetchList() {
      const { searchForm, tableOpt } = this

      const [err, res] = await this.getChargeBackAmountList({
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
      const { searchForm, select } = this
      const [err, res] = await this.getChargeBackAmountCount({
        ...searchForm,
        select,
        navCate: 1,
        channel: searchForm['channel'].join(','),
        timeBegin: searchForm['time'][0],
        timeEnd: searchForm['time'][1],
      })

      if (err) {
        return
      }
    },
    Order_Statistics_orderChargeBack() {
      const { searchForm } = this
      Order_Statistics_orderChargeBack({
        ...searchForm,
        channel: searchForm['channel'].join(','),
        navCate: 4,
      }).then((res) => {
        this.loopData = res[1]
      })
    },
    async countData() {
      const { count, select, searchForm } = this
      let xAxisData
      let legendData
      let data = []
      await Order_Statistics_orderChargeBack({
        ...searchForm,
        channel: searchForm['channel'] ? searchForm['channel'].join(',') : '',
        navCate: 5,
        timeBegin: searchForm['time'][0],
        timeEnd: searchForm['time'][1],
        select,
      }).then((res) => {
        let { date, list, totalInfo } = res[1]
        this.chartHeaderLoopData = totalInfo
        legendData = Object.keys(list)
        xAxisData = date
        data = list
      })
      this.CountLayoutOption = {
        legendData,
        xAxisData,
        data,
        yName: '人',
        editData: true,
      }
    },
  },
}
</script >

<style lang = "less" scoped >
</style >
