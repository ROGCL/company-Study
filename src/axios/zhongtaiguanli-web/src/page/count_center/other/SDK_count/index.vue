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
      <el-col :md="6" :sm="12">
        <el-form-item label="渠道" prop="channel">
          <el-select
            v-model="searchForm.channel"
            placeholder="全部渠道"
            multiple
            :popper-append-to-body="false"
            :multiple-limit="10"
            :reserve-keyword="true"
            filterable
          >
            <el-option v-for="(v, i) in channel" :key="i" :label="v" :value="v" />
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

export default {
  components: {
    FilterLayout,
    TableLayout,
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
      },
      column: [
        {
          prop: 'id',
          label: 'ID',
        },
        {
          prop: 'appid',
          label: 'APPID',
        },
        {
          prop: 'channel',
          label: '渠道',
        },
        {
          prop: 'app_version',
          label: '版本',
        },
        {
          prop: 'system',
          label: '系统',
        },
        {
          prop: 'imei',
          label: 'imei',
        },
        {
          prop: 'idfa',
          label: 'idfa',
        },
        {
          prop: 'device',
          label: '设备',
        },
        {
          prop: 'system_version',
          label: '系统版本',
        },
        {
          prop: 'mac',
          label: 'mac地址',
        },
        {
          prop: 'ip',
          label: 'ip',
        },
        {
          prop: 'behavior',
          label: '行为',
        },
        {
          prop: 'time_before',
          label: '行为开始时间',
        },
        {
          prop: 'time_happen',
          label: '行为结束时间',
        },
        {
          prop: 'time_continue',
          label: '持续时间',
        },
        {
          prop: 'time_reg',
          label: '创建时间',
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
      tableData: (state) => state.SDK_count.list,
      count: (state) => state.SDK_count.count.data,
      countLoading: (state) => state.SDK_count.count.loading,
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
    ...mapActions(['getSDKCountList', 'getSDKCountCount']),
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
      const [err, res] = await this.getSDKCountList({
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
      const [err, res] = await this.getSDKCountCount({
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