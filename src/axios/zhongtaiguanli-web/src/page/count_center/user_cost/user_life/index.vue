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
          <SelectChannel v-model="searchForm.channel"></SelectChannel>
        </el-form-item>
      </el-col>

      <el-col :md="6" :sm="12">
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
        <el-col :md="6" :sm="12">
          <el-form-item label="筛选项">
            <el-select
              v-model="select"
              placeholder="请选择筛选项"
              :popper-append-to-body="false"
              @change="onSelectChange"
            >
              <el-option label="LT（30天）" value="1" />

              <el-option label="LT（60天）" value="2" />

              <el-option label="LT（90天）" value="3" />
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
      searchForm: {
        time: [
          moment().subtract(37, 'd').format('YYYY-MM-DD'),
          moment().subtract(31, 'd').format('YYYY-MM-DD'),
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
          prop: 'num',
          label: 'LT（30天）',
        },
        {
          prop: 'num60',
          label: 'LT（60天）',
        },
        {
          prop: 'num90',
          label: 'LT（90天）',
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
      channel: (state) => state.channel.data,
      tableData: (state) => state.user_life.list,
      count: (state) => state.user_life.count.data,
      countLoading: (state) => state.user_life.count.loading,
    }),
    countData() {
      const { count } = this

      if (!count || !Object.keys(count).length) {
        return {
          legendData: [],
          xAxisData: [],
          data: [],
          yName: '天',
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
        yName: '天',
      }
    },
    timeTypeConfig() {
      const { time } = this.searchForm

      return timeTypeOption(time)
    },
  },
  methods: {
    ...mapActions(['getUserLifeList', 'getUserLifeCount']),
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
      this.searchForm.time =
        this.select * 1 === 2
          ? [
              moment().subtract(90, 'd').format('YYYY-MM-DD'),
              moment().subtract(60, 'd').format('YYYY-MM-DD'),
            ]
          : this.searchForm.time
      this.fetchCount()
    },
    async fetchList() {
      const { searchForm, tableOpt } = this

      const [err, res] = await this.getUserLifeList({
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

      const [err, res] = await this.getUserLifeCount({
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