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
    SelectChannel
  },
  data() {
    return {
      select: '1',
      selectOption: [
        {
          label: '流失率（30天）',
          value: '1',
        },
        {
          label: '流失率（60天）',
          value: '2',
        },
      ],
      searchForm: {
        time: [
          moment().subtract(61, 'd').format('YYYY-MM-DD'),
          moment().subtract(31, 'd').format('YYYY-MM-DD'),
        ],
        channel: [],
        version: '',
        timeType: 1,
      },
      column: [
        {
          prop: 'date',
          label: '日期',
        },
        {
          prop: 'num',
          label: '流失率（30天）',
        },
        {
          prop: 'num60',
          label: '流失率（60天）',
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      pickerOptions: {
        ...pickerOptions,
        shortcuts: pickerOptions.shortcuts.filter(
          (item) => item.text !== '近30天'
        ),
      },
    }
  },
  mounted() {
    this.fetchList()
    this.fetchCount()
  },
  computed: {
    ...mapState({
      app_version: (state) => state.app_version.data,
      tableData: (state) => state.churn_user.list,
      count: (state) => state.churn_user.count.data,
      countLoading: (state) => state.churn_user.count.loading,
    }),
    countData() {
      const { count } = this

      if (!count || !Object.keys(count).length) {
        return {
          legendData: [],
          xAxisData: [],
          data: [],
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
        formatter: (v) => parseInt(Number(v) * 100) + '%',
      }
    },
    timeTypeConfig() {
      const { time } = this.searchForm

      return timeTypeOption(time)
    },
  },
  methods: {
    ...mapActions(['getChurnUserList', 'getChurnUserCount']),
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

      const [err, res] = await this.getChurnUserList({
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

      const [err, res] = await this.getChurnUserCount({
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