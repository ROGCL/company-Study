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
    <CountLayout :option="countData.data" :loading="countData.loading" type="mix">
      <template #extra>
        <div>
          <div>
            毛利合计：
            <span>{{countData.totalInfo.gross_profit_total}}</span>
          </div>
          <div>
            毛利平均：
            <span>{{countData.totalInfo.gross_profit_avg}}</span>
          </div>
          <div>
            毛利率平均：
            <span>{{countData.totalInfo.gross_profit_ratio_avg + '%'}}</span>
          </div>
        </div>
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
      leadApi="Order_Statistics/incomeInvest"
      @sizeChange="onSizeChange"
      @pageChange="onPageChange"
    >
      <template #gross_profit_ratio="row">{{row.row.gross_profit_ratio | formatPercentage}}</template>
    </TableLayout>
  </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import FilterLayout from '@/layout/form'
import TableLayout from '@/layout/table'
import CountLayout from '@/layout/count'
import { pickerOptions } from '@/config/option'
import SelectChannel from '@/component/select-channel'

export default {
  components: {
    SelectChannel,
    FilterLayout,
    TableLayout,
    CountLayout,
  },
  data() {
    return {
      select: '1',
      column: [
        {
          prop: 'date',
          label: '日期',
        },
        {
          prop: 'total_pay',
          label: '总收入',
        },
        {
          prop: 'gross_profit',
          label: '毛利',
        },
        {
          prop: 'total_invert',
          label: '总支出',
        },
        {
          prop: 'gross_profit_ratio',
          label: '毛利率',
        },
      ],
      searchForm: {
        time: [
          moment().subtract(30, 'd').format('YYYY-MM-DD'),
          moment().subtract(1, 'd').format('YYYY-MM-DD'),
        ],
        channel: [],
      },
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
      pickerOptions: {
        ...pickerOptions,
      },
      countData: {
        data: {},
        totalInfo: {},
        loading: false,
      },
    }
  },
  mounted() {
    this.fetchList()
    this.fetchCount()
  },
  methods: {
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

      this.tableData.loading = true

      const [err, res] = await this.$http.post(
        'Order_Statistics/incomeInvest',
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
        'Order_Statistics/incomeInvest',
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
              name: '金额（元）',
            },
            {
              type: 'value',
              name: '毛利率（%）',
              max: 100,
            },
          ],
        }
        return
      }

      let { date, data, totalInfo = {} } = res

      const _data = data.map((v) => {
        if (v.name === '毛利率') {
          return {
            ...v,
            yAxisIndex: 1,
          }
        }

        return {
          ...v,
          stack: 'money',
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
            name: '金额（元）',
          },
          {
            type: 'value',
            name: '毛利率（%）',
            max: 100,
          },
        ],
        formatter: (res) => {
          if (res.length) {
            let html = `${res[0].axisValueLabel}<br/>`
            let income = 0

            res.forEach((v) => {
              if (v.seriesName === '毛利率') {
                html += `${v.marker}${v.seriesName}：${v.value}%<br/>`
                return
              }

              html += `${v.marker}${v.seriesName}：${v.value}<br/>`
              income += Number(v.value)
            })

            return html + `总收入：${income.toFixed(2)}`
          }

          return ''
        },
      }
      console.log(this.countData.data);
    },
  },
}
</script>

<style lang="less" scoped>
.count-wrap {
  background-color: #fff;
  margin-top: 20px;
  padding: 30px 0;

  .count-option {
    position: relative;

    .extra {
      position: absolute;
      right: 20px;
      top: 0;
      font-size: 12px;
      text-align: right;
    }

    /deep/.el-col {
      .el-form-item {
        width: 100%;
        display: flex;
        padding: 0 20px;

        .el-form-item__content {
          flex: 1;
          text-align: left;

          .el-select {
            width: 100%;
          }

          .el-range-editor.el-input__inner {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>