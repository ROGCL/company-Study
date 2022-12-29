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
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="渠道" prop="channel">
          <SelectChannel v-model="searchForm.channel"></SelectChannel>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <CountLayout
      type="newBar"
      :option="countData.data"
      :loading="countData.loading"
      :countInfo="countData.totalInfo"
    ></CountLayout>
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      :params="searchForm"
      @sizeChange="onSizeChange"
      :leadOut="true"
      @pageChange="onPageChange"
    ></TableLayout>
  </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'
import FilterLayout from '@/layout/form'
import CountLayout from '@/layout/count'
import TableLayout from '@/layout/table'
import { pickerOptions, isNewUserOption } from '@/config/option'
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
      select: '6',
      searchForm: {
        time: [
          moment().subtract(30, 'd').format('YYYY-MM-DD'),
          moment().subtract(1, 'd').format('YYYY-MM-DD'),
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
          prop: 'total_pay',
          label: '金额(元)',
        },
        {
          prop: 'total_pay_3',
          label: '穿山甲(元)',
        },
        {
          prop: 'total_pay_2',
          label: '广点通(元)',
        },
        {
          prop: 'total_pay_1',
          label: '手动上传(元)',
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      countData: {
        data: {},
        loading: false,
        totalInfo: {},
      },
      pickerOptions: {
        ...pickerOptions,
        disabledDate: (val) => {
          return !moment(val).isBetween(
            moment().subtract(1, 'y'),
            moment().subtract(1, 'd')
          )
        },
      },
      isNewUserOption,
    }
  },
  mounted() {
    this.fetchList()
    this.fetchCount()
  },
  computed: {
    ...mapState({
      tableData: (state) => state.ad_income.list,
      count: (state) => state.ad_income.count.data,
      countLoading: (state) => state.ad_income.count.loading,
    }),
    timeTypeConfig() {
      const { time } = this.searchForm

      return this.timeTypeOption(time)
    },
  },
  methods: {
    ...mapActions(['getAdIncomeList', 'getAdIncomeCount']),
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

      const [err, res] = await this.getAdIncomeList({
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

      this.countData.loading = true

      const [err, res] = await this.getAdIncomeCount({
        ...searchForm,
        select,
        navCate: 1,
        channel: searchForm['channel'].join(','),
        timeBegin: searchForm['time'][0],
        timeEnd: searchForm['time'][1],
      })

      this.countData.loading = false

      if (err) {
        this.countData.data = {
          legendData: [],
          xAxisData: [],
          data: [],
          yName: '元',
        }
        return
      }

      let { date, data, totalInfo = {} } = res

      this.countData.totalInfo = totalInfo
      
      this.countData.data = {
        legendData: data,
        xAxisData: date,
        data,
        yName: '元',
      }
    },
    timeTypeOption(time) {
      return [
        {
          label: '天',
          value: 1,
          disabled: false,
        },
        {
          label: '周',
          value: 2,
          disabled: moment(time[1]).diff(moment(time[0]), 'days') < 7,
        },
        {
          label: '月',
          value: 3,
          disabled: moment(time[1]).diff(moment(time[0]), 'months') < 1,
        },
      ]
    },
  },
}
</script>

<style lang="less" scoped>
</style>