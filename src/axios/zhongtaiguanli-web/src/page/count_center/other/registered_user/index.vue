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
        <el-form-item prop="uid">
          <el-input placeholder="搜索（用户ID）" v-model="searchForm.uid" :popper-append-to-body="false"></el-input>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item prop="phone">
          <el-input placeholder="搜索（手机号）" v-model="searchForm.phone" :popper-append-to-body="false"></el-input>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="是否VIP" prop="isVip">
          <el-radio-group v-model="searchForm.isVip">
            <el-radio-button v-for="(v, i) in vipOptions" :key="i" :label="v.value">{{v.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="渠道" prop="channel">
          <SelectChannel v-model="searchForm.channel"></SelectChannel>
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
      @sizeChange="onSizeChange"
    >
      <!--<template #date = "scope" >-->
      <!--{{ scope }}-->
      <!--</template >-->
    </TableLayout>
  </div>
</template >

<script >
import axios from '@/util/axios'
import _ from 'lodash'
import moment from 'moment'
import { api } from '@/config/api'
import { mapState, mapActions, mapMutations } from 'vuex'
import FilterLayout from '@/layout/form'
import CountLayout from '@/layout/count'
import TableLayout from '@/layout/table'
import { pickerOptions, timeTypeOption } from '@/config/option'
import SelectChannel from '@/component/select-channel'

export default {
  components: {
    FilterLayout,
    TableLayout,
    CountLayout,
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
        isVip: 0,
        uid: '',
        phone: '',
        channel: [],
      },
      vipOptions: [
        {
          label: '否',
          value: 0,
          disabled: false,
        },
        {
          label: '是',
          value: 1,
          disabled: false,
        },
      ],
      column: [
        {
          label: 'ID',
          prop: 'id',
        },
        {
          label: 'APPID',
          prop: 'appid',
        },
        {
          label: '渠道',
          prop: 'channel',
        },
        {
          label: '用户ID',
          prop: 'uid',
        },
        {
          label: '手机号',
          prop: 'phone',
        },
        {
          label: 'imei',
          prop: 'imei',
        },
        {
          label: 'idfa',
          prop: 'idfa',
        },
        {
          label: '系统',
          prop: 'system',
        },
        {
          label: '创建时间',
          prop: 'create_time',
        },
        {
          label: '中台创建时间',
          prop: 'time_add',
        },
        {
          label: '最后打开时间',
          prop: 'last_open_time',
        },
        {
          label: '总消费',
          prop: 'amount',
        },
        {
          label: '是否VIP',
          prop: 'is_vip',
        },
        {
          label: 'VIP结束时间',
          prop: 'vip_time_end',
        },
        {
          label: '第一次VIP时间',
          prop: 'first_vip_time',
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      countBar: {},
      pickerOptions,
    }
  },
  mounted() {
    this.fetchList()
    this.fetchCount()
  },
  computed: {
    ...mapState({
      channel: (state) => state.channel.data,
      tableData: (state) => state.registered_user.list,
      count: (state) => state.registered_user.count.data,
      countLoading: (state) => state.registered_user.count.loading,
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
    ...mapActions(['getRegisteredUserList', 'getRegisteredUserCount']),
    onSubmit(res) {
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
      const [err, res] = await this.getRegisteredUserList({
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
      const [err, res] = await this.getRegisteredUserCount({
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
</script >

<style lang = "less" scoped >
</style >
