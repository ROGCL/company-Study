<template>
  <div class="contrast">
    <div class="filter">
      <span class="label">指标以及评分明细：</span>
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
      <el-button type="primary" @click="search">查询</el-button>
      <el-button @click="clear">重置</el-button>
    </div>
    <div id="Chart" style="width: 100%;height:400px;"></div>
    <div class="table">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-download"
        class="downDataToExcel"
        @click="Day_Active_Predict_predictCompare('excel', 2)"
      >导出</el-button>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="date" label="日期" width="120"></el-table-column>
        <el-table-column prop="active" label="实际日活" width="120"></el-table-column>
        <!-- <el-table-column prop="value" label="预期每日新增"></el-table-column> -->
        <el-table-column prop="day1_value" label="30天前预测"></el-table-column>
        <el-table-column prop="day2_value" label="60天前预测"></el-table-column>
        <el-table-column prop="day3_value" label="90天前预测"></el-table-column>
        <el-table-column prop="day4_value" label="180天前预测"></el-table-column>
        <el-table-column prop="day5_value" label="365天前预测"></el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="currentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { Day_Active_Predict_predictCompare } from '@/config/api/index'
import { export_json_to_excel } from '@/util/lead-out/Export2Excel'
import echarts from 'echarts'
import moment from 'moment'
import { pickerOptions } from '@/config/option'
import store from 'store2'
import { mapState } from 'vuex'
export default {
  name: 'contrast',
  data() {
    return {
      time: [
        moment().subtract(30, 'd').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ],
      pickerOptions,
      tableData: [],
      excelData: [],
      total: 0,
      currentPage: 1,
      options: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        {
          value: '选项2',
          label: '双皮奶',
        },
        {
          value: '选项3',
          label: '蚵仔煎',
        },
        {
          value: '选项4',
          label: '龙须面',
        },
        {
          value: '选项5',
          label: '北京烤鸭',
        },
      ],
    }
  },
  created() {
    this.Day_Active_Predict_predictCompare('', 1)
    this.Day_Active_Predict_predictCompare('', 2)
  },
  methods: {
    Day_Active_Predict_predictCompare(type, navCate) {
      Day_Active_Predict_predictCompare({
        navCate: navCate,
        currentPage: this.currentPage,
        pageSize: type ? 100000 : 10,
        timeBegin: this.time[0],
        timeEnd: this.time[1],
      }).then((res) => {
        let { total, date, list } = res[1]
        if (type == 'excel' && navCate == 2) {
          let header = [
            '日期',
            '实际日活',
            '30天前预测',
            '60天前预测',
            '90天前预测',
            '180天前预测',
            '365天前预测',
          ]
          let { list } = res[1]
          list = list.map((item) => {
            return (item = [
              item.date,
              item.active,
              item.day1_value,
              item.day2_value,
              item.day3_value,
              item.day4_value,
              item.day5_value,
            ])
          })
   
          const currentApp = this.$store.getters.getCurrentApp(this.$route.query.appId)
          const appName = currentApp['title']
          const appSystem = currentApp['system'] === '1' ? '[安卓]' : '[苹果]'
          const menu = this.$route.meta.name
          let start = this.time[0]
          let end = this.time[1]
          export_json_to_excel(
            header,
            list,
            `${appName} ${appSystem}-${menu}-${start}-${end}`
          )
        } else if (navCate == 1) {
          this.initChart(date, list)
        } else if (navCate == 2) {
          this.total = total
          this.tableData = list
        }
      })
    },
    initChart(date, list) {
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
    },
    search() {
      this.Day_Active_Predict_predictCompare('', 1)
      this.Day_Active_Predict_predictCompare('', 2)
    },
    clear() {
      this.time = [
        moment().subtract(30, 'd').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ]
      this.value = ''
    },
    // 分页
    currentChange(num) {
      this.currentPage = num
    },
    fetchData() {
      return this.excelData
    },
  },
  watch: {
    currentPage(newVal) {
      this.Day_Active_Predict_predictCompare('', 2)
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
.filter {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;

  .label {
    margin-right: 12px;
    font-size: 14px;
  }
}

.table {
  padding: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .downDataToExcel {
    margin-bottom: 20px;
  }

  .pagination {
    margin: 20px;
  }
}

.el-range-editor,
.el-select {
  margin-right: 20px;
}
</style>