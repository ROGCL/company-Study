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
        <el-form-item label="时间刻度" prop="timeType">
          <el-radio-group v-model="searchForm.timeType">
            <el-radio-button
              v-for="(v, i) in timeTypeConfig"
              :key="i"
              :disabled="v.disabled"
              :label="v.value"
            >{{v.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <CountLayout :option="countData" :loading="countLoading">
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
import { pickerOptions, timeTypeOption } from '@/config/option'
import SelectChannel from '@/component/select-channel'

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
      selectOption: [
        {
          label: '新用户数量',
          value: '1',
        },
        {
          label: '新用户订单数量',
          value: '2',
        },
      ],
      searchForm: {
        time: [
          moment().subtract(30, 'd').format('YYYY-MM-DD'),
          moment().subtract(1, 'd').format('YYYY-MM-DD'),
        ],
        channel: [],
        timeType: 1,
      },
      column: [
        {
          prop: 'date',
          label: '日期',
        },
        {
          prop: 'new_user',
          label: '新增用户(设备)',
        },
        {
          prop: 'order_num_new',
          label: '新用户订单数量(单)',
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
    }
  },
  mounted() {
    this.fetchList()
    this.fetchCount()
  },
  computed: {
    ...mapState({
      channel: (state) => state.channel.data,
      tableData: (state) => state.new_user.list,
      count: (state) => state.new_user.count.data,
      countLoading: (state) => state.new_user.count.loading,
    }),
    countData() {
      const { count, select } = this

      if (!count || !Object.keys(count).length) {
        return {
          legendData: [],
          xAxisData: [],
          data: [],
          yName: select === '1' ? '人' : '单',
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
        yName: select === '1' ? '人' : '单',
      }
    },
    timeTypeConfig() {
      const { time } = this.searchForm

      return timeTypeOption(time)
    },
  },
  methods: {
    ...mapActions(['getNewUserList', 'getNewUserCount']),
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

      const [err, res] = await this.getNewUserList({
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

      const [err, res] = await this.getNewUserCount({
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

<style lang = "less" scoped>
</style>
