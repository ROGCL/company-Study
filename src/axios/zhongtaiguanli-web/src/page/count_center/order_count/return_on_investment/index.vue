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
        <el-form-item label="渠道" prop="channel">
          <SelectChannel v-model="searchForm.channel"></SelectChannel>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="ROI" prop="type">
          <el-radio-group v-model="searchForm.type">
            <el-radio-button v-for="(v, i) in ROI" :key="i" :label="v.value">{{v.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <CountLayout :option="countData" :loading="countLoading">
      <template #option>
        <el-col :md="12" :lg="6" :sm="24">
          <el-form-item label="筛选项">
            <el-select
              v-model="select"
              placeholder="请选择筛选项"
              :popper-append-to-body="false"
              @change="onSelectChange"
            >
              <el-option label="1日回报率" value="1" />
              <el-option label="2日回报率" value="2" />
              <el-option label="3日回报率" value="3" />
              <el-option label="4日回报率" value="4" />
              <el-option label="5日回报率" value="5" />
              <el-option label="6日回报率" value="6" />
              <el-option label="7日回报率" value="7" />
              <el-option label="14日回报率" value="14" />
              <el-option label="30日回报率" value="30" />
              <el-option label="60日回报率" value="60" />
              <el-option label="90日回报率" value="90" />
              <el-option label="180日回报率" value="180" />
              <el-option label="365日回报率" value="365" />
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
      @pageChange="onPageChange"
      :cellStyle="cellStyle"
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
import { pickerOptions, timeTypeOption } from '@/config/option'
import sectioncolor from '@/util/sectioncolor'
import SelectChannel from '@/component/select-channel'

let arr = []

export default {
  name: 'home',
  components: {
    FilterLayout,
    TableLayout,
    CountLayout,
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
        timeType: 1,
        type: 'all',
      },
      ROI: [
        {
          label: '全部',
          value: 'all',
          disabled: false,
        },
        {
          label: '广告',
          value: 'advert',
          disabled: false,
        },
        {
          label: '订单',
          value: 'order',
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
          label: '投资金额',
        },
        {
          prop: 'day1',
          label: '1日回报率',
        },
        {
          prop: 'day2',
          label: '2日回报率',
        },
        {
          prop: 'day3',
          label: '3日回报率',
        },
        {
          prop: 'day4',
          label: '4日回报率',
        },
        {
          prop: 'day5',
          label: '5日回报率',
        },
        {
          prop: 'day6',
          label: '6日回报率',
        },
        {
          prop: 'day7',
          label: '7日回报率',
        },
        {
          prop: 'day14',
          label: '14日回报率',
        },
        {
          prop: 'day30',
          label: '30日回报率',
        },
        {
          prop: 'day60',
          label: '60日回报率',
        },
        {
          prop: 'day90',
          label: '90日回报率',
        },
        {
          prop: 'day180',
          label: '180日回报率',
        },
        {
          prop: 'day365',
          label: '365日回报率',
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      pickerOptions,
    }
  },
  mounted() {
    this.fetchList()
    this.fetchCount()
  },
  computed: {
    ...mapState({
      tableData: (state) => {
        arr = []
        let obj = state.return_on_investment.list.data
        obj.forEach((item, index) => {
          let i = -1
          for (let key in item) {
            i++
            if (key != 'date' && key != 'day_into') {
              arr.push({
                column: index,
                row: i,
                count: parseFloat(item[key]),
              })
            } else {
              arr.push({
                column: index,
                row: i,
                count: null,
              })
            }
          }
        })

        const filterData = state.return_on_investment.list.data.map((item) => {
          const obj = {}
          for (const key in item) {
            if (key != 'date' && key != 'day_into') {
              obj[key] = parseFloat(item[key]) > 0 ? item[key] : ''
            } else {
              obj[key] = item[key]
            }
          }
          return obj
        })
        for (const key in state.return_on_investment.list.data) {
          state.return_on_investment.list.data[key] = filterData[key]
        }
        return state.return_on_investment.list
      },
      count: (state) => state.return_on_investment.count.data,
      countLoading: (state) => state.return_on_investment.count.loading,
    }),
    countData() {
      const { count } = this

      if (count && Object.keys(count).length) {
        const { date, list } = count

        const xAxisData = date
        const legendData = Object.keys(list)
        const data = _.values(list)

        return {
          legendData,
          xAxisData,
          data,
          formatter: function (e) {
            return e + '%'
          },
        }
      }

      return {
        legendData: [],
        xAxisData: [],
        data: [],
        formatter: (v) => parseInt(Number(v) * 100) + '%',
      }
    },
    timeTypeConfig() {
      const { time } = this.searchForm

      return timeTypeOption(time)
    },
  },
  methods: {
    ...mapActions(['getReturnOnInvestmentList', 'getReturnOnInvestmentCount']),
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

      const [err, res] = await this.getReturnOnInvestmentList({
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

      const [err, res] = await this.getReturnOnInvestmentCount({
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
    cellStyle({ row, column, columnIndex, rowIndex }) {
      for (let i = 0; i < arr.length; i++) {
        let { column, row, count, color } = arr[i]
        if (columnIndex == row && rowIndex == column && count) {
          return `background-color:${sectioncolor(count)}; color: #fff;`
        } else if (columnIndex == row && rowIndex == column && color) {
          return 'background: #98FB98; color: #fff;'
        }
      }
    },
  },
}
</script>

<style lang = "less" scoped>
</style>
