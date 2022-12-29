<template>
  <div class="trend">
    <div class="filter">
      <span class="label">时间：</span>
      <el-date-picker
        v-model="time"
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
      <span class="label" style="margin-left:20px">渠道：</span>
      <SelectChannel v-model="channel"></SelectChannel>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <div id="Chart" style="width: 100%;height:400px;"></div>
    <div class="table">
      <el-button
        type="primary"
        size="small"
        style="margin-bottom:20px"
        @click="downDataToExcel"
        icon="el-icon-download"
      >导出</el-button>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          v-for="(item, index) in tHeader"
          :key="index"
          width="120"
        ></el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        style="margin:20px"
        @current-change="currentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { pickerOptions } from '@/config/option'
import moment from 'moment'
import { export_json_to_excel } from '@/util/lead-out/Export2Excel'
import { Quantity_Statistics_weight } from '@/config/api/index'
import store from 'store2'
import { mapState } from 'vuex'
import SelectChannel from '@/component/select-channel'

export default {
  components: {
    SelectChannel,
  },
  data() {
    return {
      time: [
        moment().subtract(30, 'd').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ],
      tableData: [],
      tHeader: [],
      tableData_excel: [],
      tHeader_excel: [],
      excelData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      pickerOptions,
      channel: [],
    }
  },
  mounted() {
    this.initChart()
    this.initTable()
  },
  methods: {
    initChart() {
      this.getData(1).then(({ date, list }) => {
        let series = []
        let legend = []
        for (const product in list) {
          list[product].data = list[product].data.map((item, index) => {
            const week = date ? moment(String(date[index])).format('E') : 0
            return {
              value: item,
              symbol: week === '6' || week === '7' ? 'circle' : 'emptyCircle',
            }
          })
          series.push({
            ...list[product],
            type: 'line',
            symbolSize: 7,
          })
          legend.push(product)
        }
        var Chart = echarts.init(document.getElementById('Chart'))
        var option = {
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: legend,
          },
          xAxis: {
            type: 'category',
            data: date,
          },
          yAxis: {
            name: '得分',
            type: 'value',
          },
          series: series,
        }
        Chart.clear()
        Chart.setOption(option)
      })
    },
    initTable() {
      this.getData(2).then(
        ({ currentPage, headers, list, pageSize, total }) => {
          list = list == null ? [] : list
          this.currentPage = currentPage
          this.pageSize = pageSize
          this.tHeader_excel = headers
          this.tableData_excel = list

          this.tHeader = headers.map((item, index) => ({
            label: item,
            prop: String(index),
          }))
          let tableData = []
          list.forEach((item, index) => {
            tableData.push({
              [index]: {},
            })
            item.forEach((childItem, childIndex) => {
              tableData[index][childIndex] = childItem
            })
          })
          this.tableData = tableData
        }
      )
    },
    fetchData() {
      return this.excelData
    },
    getData(navCate) {
      return Quantity_Statistics_weight({
        pageSize: navCate == 2 ? '31' : this.pageSize,
        timeBegin: this.time[0],
        timeEnd: this.time[1],
        channel: this.channel.join(','),
        navCate: navCate,
      }).then((res) => {
        return res[1]
      })
    },
    currentChange(cur) {
      if (cur <= Math.round(this.total / this.pageSize)) {
        this.currentPage = cur
        this.initTable()
      }
    },
    search() {
      this.initChart()
      this.initTable()
    },
    downDataToExcel() {
      Quantity_Statistics_weight({
        pageSize: 100000,
        timeBegin: this.time[0],
        timeEnd: this.time[1],
        channel: this.channel.join(','),
        navCate: 2,
      }).then((res) => {
        let { headers, list } = res[1]
        const currentApp = this.$store.getters.getCurrentApp(this.$route.query.appId)
        const appName = currentApp['title']
        const appSystem = currentApp['system'] === '1' ? '[安卓]' : '[苹果]'
        const menu = this.$route.meta.name
        let start = this.time[0]
        let end = this.time[1]
        export_json_to_excel(
          headers,
          list,
          `${appName} ${appSystem}-${menu}-${start}-${end}`
        )
      })
    },
  },
  computed: {
    ...mapState({
      appArr: (state) => state.app.data,
    }),
  },
}
</script>

<style lang='scss' scoped>
.filter,
.table,
#Chart {
  background: white;
  padding: 20px;
  margin-bottom: 20px;
}

.filter {
  margin-right: 12px;
  font-size: 14px;
}

.table {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>