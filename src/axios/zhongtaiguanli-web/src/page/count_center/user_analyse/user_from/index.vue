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
        <el-form-item label="版本号" prop="channel">
          <el-select
            v-model="searchForm.version"
            placeholder="所有版本"
            :popper-append-to-body="false"
            filterable
          >
            <el-option label="全部" value />
            <el-option v-for="(v, i) in app_version" :key="i" :label="v" :value="v" />
          </el-select>
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
              <el-option label="活跃用户占比" value="1" />
              <el-option label="沉默用户占比" value="2" />
              <el-option label="流失用户占比" value="3" />
              <el-option label="活跃用户中付费用户占比" value="4" />
              <el-option label="活跃用户中免费用户占比" value="5" />
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
    ></TableLayout>
  </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import { mapState, mapActions, mapMutations } from 'vuex'
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
        channel: '',
        version: '',
        timeType: 1,
      },
      column: [
        {
          prop: 'date',
          label: '日期',
        },
        {
          prop: 'active_user',
          label: '活跃用户(人)',
        },
        {
          prop: 'active_user_per',
          label: '活跃用户占比',
        },
        {
          prop: 'silence_user',
          label: '沉默用户(人)',
        },
        {
          prop: 'silence_user_per',
          label: '沉默用户占比',
        },
        {
          prop: 'wastage_user',
          label: '流失用户(人)',
        },
        {
          prop: 'wastage_user_per',
          label: '流失用户占比',
        },
        {
          prop: 'user_pay',
          label: '活跃用户中付费用户(人)',
        },
        {
          prop: 'user_pay_per',
          label: '活跃用户中付费用户占比',
        },
        {
          prop: 'user_not_pay',
          label: '活跃用户中免费用户(人)',
        },
        {
          prop: 'user_not_pay_per',
          label: '活跃用户中免费用户占比',
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
      app_version: (state) => state.app_version.data,
      tableData: (state) => state.user_from.list,
      count: (state) => state.user_from.count.data,
      countLoading: (state) => state.user_from.count.loading,
    }),
    countData() {
      const { count } = this

      if (!count || !Object.keys(count).length) {
        return {
          legendData: [],
          xAxisData: [],
          data: [],
          yName: '占比',
          formatter: (v) => '',
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
        yName: '占比',
        formatter: (v) => parseInt(Number(v) * 100) + '%',
      }
    },
    timeTypeConfig() {
      const { time } = this.searchForm

      return timeTypeOption(time)
    },
  },
  methods: {
    ...mapActions(['getUserFromList', 'getUserFromCount']),
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

      const [err, res] = await this.getUserFromList({
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

      const [err, res] = await this.getUserFromCount({
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