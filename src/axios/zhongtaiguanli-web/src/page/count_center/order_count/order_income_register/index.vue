<template>
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
        <el-form-item label="用户渠道" prop="channel">
          <SelectChannel v-model="searchForm.channel"></SelectChannel>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item prop="select">
          <el-select v-model="searchForm.select" :popper-append-to-body="false">
            <el-option :key="i" :label="v.label" :value="v.value" v-for="(v, i) in orderOptions" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item prop="dataType">
          <el-select v-model="searchForm.dataType" :popper-append-to-body="false">
            <el-option :key="i" :label="v.label" :value="v.value" v-for="(v, i) in showOptions" />
          </el-select>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      :params="searchForm"
      :leadOut="true"
      @pageChange="onPageChange"
    >
      <!--<template #date = "scope" >-->
      <!--{{ scope }}-->
      <!--</template >-->
    </TableLayout>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import FilterLayout from '@/layout/form'
import TableLayout from '@/layout/table'
import { pickerOptions, timeTypeOption, isNewUserOption } from '@/config/option'
import SelectChannel from '@/component/select-channel'

export default {
  components: {
    FilterLayout,
    TableLayout,
    SelectChannel
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
        select: '',
        dataType: 0,
      },
      orderOptions: [
        {
          label: '全部',
          value: '',
          disabled: false,
        },
        {
          label: '只看首单',
          value: 1,
          disabled: false,
        },
        {
          label: '只看复购',
          value: 2,
          disabled: false,
        },
      ],
      showOptions: [
        {
          label: '显示金额',
          value: 0,
          disabled: false,
        },
      ],
      column: [
        {
          prop: 'date',
          label: '日期',
        },
        {
          prop: 'day_into',
          label: '投入',
        },
        {
          prop: 'day1',
          label: '1日回收',
        },
        {
          prop: 'day2',
          label: '2日回收',
        },
        {
          prop: 'day3',
          label: '3日回收',
        },
        {
          prop: 'day7',
          label: '7日回收',
        },
        {
          prop: 'day14',
          label: '14日回收',
        },
        {
          prop: 'day30',
          label: '30日回收',
        },
        {
          prop: 'day60',
          label: '60日回收',
        },
        {
          prop: 'day90',
          label: '90日回收',
        },
        {
          prop: 'day180',
          label: '180日回收',
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      countBar: {},
      pickerOptions,
      isNewUserOption,
    }
  },
  mounted() {
    this.fetchList()
    this.fetchCount()
  },
  computed: {
    ...mapState({
      channel: (state) => state.channel.data,
      tableData: (state) => state.order_income_register.list,
      count: (state) => state.order_income_register.count.data,
      countLoading: (state) => state.order_income_register.count.loading,
    }),
    countData() {
      const { count } = this

      if (!count || !Object.keys(count).length) {
        return {
          legendData: [],
          xAxisData: [],
          data: [],
          yName: '单',
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
        yName: '单',
      }
    },
    countBarData() {
      const { countBar } = this

      if (!countBar || !Object.keys(countBar).length) {
        return {
          tooltip: {
            trigger: 'axis',
            borderRadius: 6,
          },
          xAxis: [],
          yAxis: [],
          series: [],
          legend: [],
        }
      }

      const { list } = countBar

      const xAxisData = ['新增', '注册', '下单', '支付成功', '退单  ']
      const data = _.values(list).map((v) => v.data)
      const _data = data && data.length ? data[0] : []
      return {
        tooltip: {
          trigger: 'axis',
          borderRadius: 6,
          formatter: (name) => {
            const order = name[0]
            const cover = name[1]
            const orderCount = order.data
            const coverCount = (
              (cover.data / _data[cover['dataIndex'] - 1]) *
              100
            ).toFixed(0)
            if (!cover['dataIndex']) {
              return `订单数: ${orderCount}`
            }

            return `订单数: ${orderCount}<br>转化率: ${
              coverCount !== 'NAN' ? coverCount : 0
            }%`
          },
        },
        legend: {
          data: ['订单数', '转化率'],
        },
        xAxis: [
          {
            type: 'category',
            data: xAxisData,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            scale: true,
            name: '订单数',
          },
          {
            type: 'value',
            scale: true,
            name: '转化率',
            show: false,
          },
        ],
        series: [
          {
            name: '订单数',
            type: 'bar',
            barWidth: '60%',
            data: _data,
          },
          {
            name: '转化率',
            type: 'line',
            data: _data,
          },
        ],
      }
    },
    timeTypeConfig() {
      const { time } = this.searchForm

      return timeTypeOption(time)
    },
  },
  methods: {
    ...mapActions(['getOrderIncomeCount', 'getOrderIncomeRegisterList']),
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
      const [err, res] = await this.getOrderIncomeRegisterList({
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
      const [err, res] = await this.getOrderIncomeCount({
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