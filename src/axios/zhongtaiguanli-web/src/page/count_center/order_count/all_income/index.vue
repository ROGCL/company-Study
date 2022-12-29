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
      :leadOut="true"
      @sizeChange="onSizeChange"
      @pageChange="onPageChange"
    ></TableLayout>
  </div>
</template>

<script>
import moment from 'moment'
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
      select: '1',
      timeTypeConfig: [
        {
          label: '天',
          value: 1,
        },
        {
          label: '周',
          value: 2,
        },
        {
          label: '月',
          value: 3,
        },
        {
          label: '季',
          value: 4,
        },
        {
          label: '年',
          value: 5,
        },
      ],
      countLoading: false,
      searchForm: {
        time: [
          moment()
            .month(moment().month() - 1)
            .startOf('month')
            .format('YYYY-MM-DD'),
          moment().subtract(1, 'days').format('YYYY-MM-DD'),
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
          label: '总收入',
        },
        {
          prop: 'ad_pay',
          label: '广告收入',
        },
        {
          prop: 'ad_pay_per',
          label: '广告收入占比',
        },
        {
          prop: 'order_pay',
          label: '订单收入',
        },
        {
          prop: 'order_pay_per',
          label: '订单收入占比',
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      pickerOptions: {
        ...pickerOptions,
        disabledDate(time) {
          let beforDay = 24 * 60 * 60 * 1000
          return time.getTime() > Date.now() - beforDay
        },
      },
      CountLayoutOption: {},
      isNewUserOption,
      countData: {
        data: {},
        loading: false,
        totalInfo: {},
      },
    }
  },
  mounted() {
    this.fetchList()
    this.fetchCount()
  },
  computed: {
    ...mapState({
      channel: (state) => state.channel.data,
      tableData: (state) => state.all_income.list,
    }),
  },
  methods: {
    ...mapActions(['getAllIncomeList', 'getAllIncomeCount']),
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
    async fetchList() {
      const { searchForm, tableOpt } = this

      const [err, res] = await this.getAllIncomeList({
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

      const [err, res] = await this.$http.post('Order_Statistics/allIncome', {
        ...searchForm,
        select,
        navCate: 7,
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

      if (!res || !Object.keys(res).length) {
        this.countData.data = {
          legendData: [],
          xAxisData: [],
          data: [],
          yName: '元',
        }
        return
      }

      const { date, data, totalInfo } = res

      this.countData.totalInfo = totalInfo

      this.countData.data = {
        legendData: data,
        xAxisData: date,
        data,
        yName: '元',
        formatter: (data) => {
          // eslint-disable-next-line no-console
          let ad =
            data[0].marker +
            data[0].seriesName +
            '：' +
            parseFloat(data[0].data).toFixed(2)
          let order =
            data[1].marker +
            data[1].seriesName +
            '：' +
            parseFloat(data[1].data).toFixed(2)
          let all = (
            parseFloat(data[0].data) + parseFloat(data[1].data)
          ).toFixed(2)
          
          return `${data[0].axisValueLabel}</br>${ad}</br>${order}</br>总计：${all}`
        },
      }
    },
  },
}
</script>

<style lang="less" scoped>
</style>