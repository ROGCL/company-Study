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
        <el-form-item label="设备筛选" prop="type">
          <el-radio-group v-model="searchForm.type">
            <el-radio-button
              v-for="(v, i) in typeConfig"
              :key="i"
              :disabled="v.disabled"
              :label="v.value"
            >{{v.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <CountLayout :option="countData.data" :loading="countData.loading" type="newBar">
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
      leadApi="Behavior_Statistics/startTotal"
      @pageChange="onPageChange"
      @sizeChange="onSizeChange"
      :headerCellStyle="headerCellStyle"
    ></TableLayout>
  </div>
</template >

<script >
import moment from 'moment'
import FilterLayout from '@/layout/form'
import CountLayout from '@/layout/count'
import TableLayout from '@/layout/table'
import { pickerOptions } from '@/config/option'
import SelectChannel from '@/component/select-channel'
import { formatPercentage } from '@/util/filters'

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
      selectOption: [
        {
          label: '绝对值',
          value: '1',
        },
        {
          label: '百分比',
          value: '2',
        },
      ],
      searchForm: {
        time: [
          moment().subtract(30, 'd').format('YYYY-MM-DD'),
          moment().subtract(1, 'd').format('YYYY-MM-DD'),
        ],
        channel: [],
        type: 1,
      },
      column: [
        {
          prop: 'date',
          label: '日期',
        },
        {
          prop: 'day_device',
          label: '设备数',
        },
        {
          prop: 'num1',
          label: '累积启动1次',
        },
        {
          prop: 'rate_num1',
          label: '占比',
        },
        {
          prop: 'num2',
          label: '累积启动2次',
        },
        {
          prop: 'rate_num2',
          label: '占比',
        },
        {
          prop: 'num3',
          label: '累积启动3次',
        },
        {
          prop: 'rate_num3',
          label: '占比',
        },
        {
          prop: 'num4',
          label: '累积启动4次',
        },
        {
          prop: 'rate_num4',
          label: '占比',
        },
        {
          prop: 'num5',
          label: '累积启动5次',
        },
        {
          prop: 'rate_num5',
          label: '占比',
        },
        {
          prop: 'num6',
          label: '累积启动5次以上',
        },
        {
          prop: 'rate_num6',
          label: '占比',
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      pickerOptions,
      countData: {
        data: {},
        loading: false,
      },
      typeConfig: [
        {
          label: '活跃设备',
          value: '2',
        },
        {
          label: '新增设备',
          value: '1',
        },
      ],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        currentPage: 1,
        pageSize: 10,
      },
      countInfo: {},
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

      const [err, res] = await this.$http.post(
        'Behavior_Statistics/startTotal',
        {
          ...searchForm,
          ...tableOpt,
          navCate: 2,
          channel: searchForm['channel'].join(','),
          timeBegin: searchForm['time'][0],
          timeEnd: searchForm['time'][1],
        }
      )

      if (err) return

      const { list, currentPage, total } = res

      this.tableData.data = list
      this.tableData.currentPage = currentPage
      this.tableData.total = total
    },
    async fetchCount() {
      const { select, searchForm } = this

      this.countData.loading = true

      const [err, res] = await this.$http.post(
        'Behavior_Statistics/startTotal',
        {
          ...searchForm,
          channel: searchForm['channel'] ? searchForm['channel'].join(',') : '',
          navCate: 3,
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
          yName: select == 1 ? '人' : '占比',
        }
        return
      }

      let { date, data, totalInfo = {} } = res

      this.countInfo = totalInfo

      if (select == 1) {
        this.countData.data = {
          legendData: data,
          xAxisData: date,
          data,
          yName: '人',
          allName: '设备数',
        }
      } else {
        this.countData.data = {
          legendData: data,
          xAxisData: date,
          data,
          yName: '占比',
          formatter: (res) => {
            if (res.length) {
              let html = `${res[0].axisValueLabel}<br/>`

              res.forEach((v) => {
                html += `${v.marker}${v.seriesName}：${formatPercentage(
                  v.value
                )}<br/>`
              })

              return html
            }

            return ''
          },
        }
      }
    },
    headerCellStyle({ rowIndex, columnIndex }) {
      let columnIndexs = [2, 3, 6, 7, 10, 11]
      if (columnIndexs.includes(columnIndex)) {
        return 'background:#e6e6e6;'
      }
    },
  },
}
</script >

<style lang = "less" scoped >
</style >
