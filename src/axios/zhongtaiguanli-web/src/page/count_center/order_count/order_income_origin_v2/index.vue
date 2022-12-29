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
      <el-col :md="6" :sm="12">
        <el-form-item label="用户渠道" prop="channel">
          <SelectChannel v-model="searchForm.channel" multi />
        </el-form-item>
      </el-col>
      <el-col :md="5" :sm="12">
        <el-form-item label="回收来源" prop="type">
          <el-radio-group v-model="searchForm.type">
            <el-radio-button v-for="(v, i) in source" :key="i" :label="v.value">{{v.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <CountLayout
      :option="countData.data"
      :loading="countData.loading"
      :countInfo="countData.totalInfo"
      type="mix"
    >
      <template #option>
        <el-col :md="12" :lg="6" :sm="24">
          <el-form-item label="筛选项">
            <el-select
              v-model="select"
              placeholder="请选择筛选项"
              :popper-append-to-body="false"
              @change="onSelectChange"
            >
              <el-option
                v-for="(item,i) in selectOption"
                :key="i"
                :label="item.label"
                :value="item.value"
              />
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
      @sizeChange="onSizeChange"
      :headerCellStyle="headerCellStyle"
      leadApi="Order_Statistics/incomeOriginV2"
    ></TableLayout>
  </div>
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'
import FilterLayout from '@/layout/form'
import TableLayout from '@/layout/table'
import CountLayout from '@/layout/count'
import { pickerOptions } from '@/config/option'
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
      select: '1',
      searchForm: {
        time: [
          moment().subtract(30, 'd').format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD'),
        ],
        channel: [],
        select: '',
        type: 'all',
      },
      selectOption: [
        {
          label: '1日回收',
          value: '1',
        },
        {
          label: '2日回收',
          value: '2',
        },
        {
          label: '3日回收',
          value: '3',
        },
        {
          label: '4日回收',
          value: '4',
        },
        {
          label: '5日回收',
          value: '5',
        },
        {
          label: '6日回收',
          value: '6',
        },
        {
          label: '7日回收',
          value: '7',
        },
        {
          label: '14日回收',
          value: '14',
        },
        {
          label: '30日回收',
          value: '30',
        },
        {
          label: '60日回收',
          value: '60',
        },
        {
          label: '90日回收',
          value: '90',
        },
        {
          label: '180日回收',
          value: '180',
        },
        {
          label: '365日回收',
          value: '365',
        },
      ],
      source: [
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
      orderOptions: [
        {
          label: '全部',
          value: '',
          disabled: false,
        },
      ],
      column: [
        {
          prop: 'date',
          label: '日期',
          width:"100"
        },
        {
          prop: 'device_new',
          label: '激活数',
        },
        {
          prop: 'day_into',
          label: '投资金额',
        },
        {
          prop: 'day1',
          label: '1日回收',
        },
        {
          prop: 'roi1',
          label: '1日回报率',
        },
        {
          prop: 'day2',
          label: '2日回收',
        },
        {
          prop: 'roi2',
          label: '2日回报率',
        },
        {
          prop: 'day3',
          label: '3日回收',
        },
        {
          prop: 'roi3',
          label: '3日回报率',
        },
        {
          prop: 'day7',
          label: '7日回收',
        },
        {
          prop: 'roi7',
          label: '7日回报率',
        },
        {
          prop: 'day14',
          label: '14日回收',
        },
        {
          prop: 'roi14',
          label: '14日回报率',
        },
        {
          prop: 'day30',
          label: '30日回收',
        },
        {
          prop: 'roi30',
          label: '30日回报率',
        },
        {
          prop: 'day60',
          label: '60日回收',
        },
        {
          prop: 'roi60',
          label: '60日回报率',
        },
        {
          prop: 'day90',
          label: '90日回收',
        },
        {
          prop: 'roi90',
          label: '90日回报率',
        },
        {
          prop: 'day180',
          label: '180日回收',
        },
        {
          prop: 'roi180',
          label: '180日回报率',
        },
        {
          prop: 'day365',
          label: '365日回收',
        },
        {
          prop: 'roi365',
          label: '365日回报率',
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      tableData: {
        data: [],
        total: 0,
        loading: false,
        currentPage: 1,
        pageSize: 10,
      },
      countBar: {},
      pickerOptions,
      countData: {
        data: {},
        loading: false,
        totalInfo: {},
      },
    }
  },
  mounted() {
    this.fetchData()
    this.fetchCount()
  },
  methods: {
    ...mapActions(['getOrderIncomeOriginList']),
    onSubmit(res) {
      this.tableOpt.currentPage = 1
      this.fetchData()
      this.fetchCount()
    },
    onPageChange(current) {
      this.tableOpt.currentPage = current
      this.fetchData()
    },
    onSizeChange(current) {
      this.tableOpt.pageSize = current;
      this.fetchData();
    },
    onSelectChange() {
      this.fetchCount()
    },
    async fetchData() {
      const { searchForm, tableOpt } = this

      this.tableData.loading = true

      const [err, res] = await this.$http.post(
        'Order_Statistics/incomeOriginV2',
        {
          ...searchForm,
          ...tableOpt,
          navCate: 2,
          channel: searchForm['channel'].join(','),
          timeBegin: searchForm['time'][0],
          timeEnd: searchForm['time'][1],
        }
      )

      this.tableData.loading = false

      if (err) return

      const { list, currentPage, total } = res

      this.tableData.data = list
      this.tableData.currentPage = currentPage
      this.tableData.total = total
    },
    async fetchCount() {
      const { searchForm, select } = this

      this.countData.loading = true

      const [err, res] = await this.$http.post(
        'Order_Statistics/incomeOriginV2',
        {
          ...searchForm,
          select,
          navCate: 1,
          channel: searchForm['channel'].join(','),
          timeBegin: searchForm['time'][0],
          timeEnd: searchForm['time'][1],
        }
      )

      this.countData.loading = false

      if (err) {
        this.countData.data = {
          legendData: [],
          xAxisData: [],
          data: [],
          yAxis: [
            {
              type: 'value',
              name: '回收金额（元）',
            },
            {
              type: 'value',
              name: 'ROI（%）',
            },
          ],
        }
        return
      }

      let { date, data, totalInfo } = res

      const _data = data.map((v) => {
        if (v.name === 'ROI') {
          return {
            ...v,
            yAxisIndex: 1,
            smooth: true,
          }
        }

        return {
          ...v,
          stack: 'money',
          smooth: true,
        }
      })

      this.countData.totalInfo = totalInfo
      this.countData.data = {
        legendData: data,
        xAxisData: date,
        data: _data,
        yAxis: [
          {
            type: 'value',
            name: '回收金额（元）',
          },
          {
            type: 'value',
            name: 'ROI（%）',
          },
        ],
        formatter: (res) => {
          if (res.length) {
            let html = `${res[0].axisValueLabel}<br/>`

            res.forEach((v) => {
              if (v.seriesName === 'ROI') {
                html += `${v.marker}${v.seriesName}：${v.value}%<br/>`
                return
              }

              html += `${v.marker}${v.seriesName}：${v.value}<br/>`
            })

            return html
          }

          return ''
        },
      }
    },
    headerCellStyle({ rowIndex, columnIndex }) {
      let columnIndexs = [3, 4, 7, 8, 11, 12, 15, 16, 19, 20]

      if (columnIndexs.includes(columnIndex)) {
        return 'background:#e6e6e6;'
      }
    },
  },
}
</script>

<style lang="less" scoped>
</style>