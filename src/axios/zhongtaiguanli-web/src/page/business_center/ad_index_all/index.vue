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
            :popper-append-to-body="false"
            unlink-panels
          /> -->
           <dataPicker :datevalue.sync="searchForm.time"></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="渠道" prop="channel">
          <el-select
            v-model="searchForm.channel"
            placeholder="全部渠道"
            multiple
            :popper-append-to-body="false"
            :multiple-limit="10"
            filterable
            :reserve-keyword="true"
          >
            <el-option v-for="(v, i) in channel" :key="i" :label="v" :value="v" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="APP" prop="appIds">
          <el-select
            v-model="searchForm.appIds"
            placeholder="全部APP"
            :popper-append-to-body="false"
            multiple
            :multiple-limit="10"
            filterable
          >
            <el-option v-for="(v, i) in apps" :key="i" :label="v.title" :value="v.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
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
      <el-col :md="6" :sm="12">
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
    <CountLayout :option="countData" :loading="countLoading"></CountLayout>
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
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'
import FilterLayout from '@/layout/form'
import CountLayout from '@/layout/count'
import TableLayout from '@/layout/table'
import { pickerOptions, timeTypeOption, isNewUserOption } from '@/config/option'

export default {
  components: {
    FilterLayout,
    TableLayout,
    CountLayout,
  },
  data() {
    return {
      select: '6',
      searchForm: {
        time: [
          moment().subtract(30, 'd').format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD'),
        ],
        channel: '',
        appIds: [],
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
          label: '总金额(元)',
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      pickerOptions,
      isNewUserOption,
    }
  },
  mounted() {
    this.fetchList()
    this.fetchCount()
    this.getAdApp()
  },
  computed: {
    ...mapState({
      channel: (state) => state.channel.data,
      apps: (state) => state.ad_app.data,
      tableData: (state) => state.ad_income.list,
      count: (state) => state.ad_income.count.data,
      countLoading: (state) => state.ad_income.count.loading,
    }),
    countData() {
      const { count } = this

      if (!count || !Object.keys(count).length) {
        return {
          legendData: [],
          xAxisData: [],
          data: [],
          yName: '元',
        }
      }

      const { date, list } = count

      const xAxisData = date
      const legendData = Object.keys(list)
      const data = _.values(list)

      return {
        legendData,
        xAxisData,
        data,
        yName: '元',
      }
    },
    timeTypeConfig() {
      const { time } = this.searchForm

      return timeTypeOption(time)
    },
  },
  methods: {
    ...mapActions(['getAdIncomeList', 'getAdIncomeCount', 'getAdApp']),
    onSubmit(res) {
      this.tableOpt.currentPage = 1
      this.fetchList()
      this.fetchCount()
    },
    onPageChange(current) {
      this.tableOpt.currentPage = current
      this.fetchList()
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
      const [err, res] = await this.getAdIncomeCount({
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
  },
}
</script>

<style lang="less" scoped>
</style>