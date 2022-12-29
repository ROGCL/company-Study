<template>
  <div class="computed">
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
    <div class="table">
      <el-button
        type="primary"
        size="small"
        class="downDataToExcel"
        @click="downDataToExcel"
        icon="el-icon-download"
      >导出</el-button>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="active" label="实际日活"></el-table-column>
        <el-table-column prop="value" label="预期每日新增"></el-table-column>
        <el-table-column prop="day1_value" label="预测30天后"></el-table-column>
        <el-table-column prop="day2_value" label="预测60天后"></el-table-column>
        <el-table-column prop="day3_value" label="预测90天后"></el-table-column>
        <el-table-column prop="day4_value" label="预测180天后"></el-table-column>
        <el-table-column prop="day5_value" label="预测365天后"></el-table-column>
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
import store from 'store2'
import { mapState } from 'vuex'
import { Day_Active_Predict_dayCalculator } from '@/config/api/index'
import moment from 'moment'
import { export_json_to_excel } from '@/util/lead-out/Export2Excel'
import { pickerOptions } from '@/config/option'
export default {
  name: 'computed',
  data() {
    return {
      time: [
        moment().subtract(30, 'd').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ],
      pickerOptions,
      tableData: [],
      total: 0,
      currentPage: 1,
      excelData: [],
    }
  },
  created() {
    this.Day_Active_Predict_dayCalculator()
  },
  methods: {
    Day_Active_Predict_dayCalculator(type) {
      Day_Active_Predict_dayCalculator({
        navCate: 2,
        currentPage: this.currentPage,
        pageSize: type ? 100000 : 10,
        timeBegin: this.time[0],
        timeEnd: this.time[1],
      }).then((res) => {
        let { total, list } = res[1]
        if (type == 'excel') {
          this.excelData = list.map(
            ({
              date,
              active,
              value,
              day1_value,
              day2_value,
              day3_value,
              day4_value,
              day5_value,
            }) => {
              return {
                日期: date,
                实际日活: active,
                预期每日新增: value,
                预测30天后: day1_value,
                预测60天后: day2_value,
                预测90天后: day3_value,
                预测180天后: day4_value,
                预测365天后: day5_value,
              }
            }
          )
        } else {
          this.total = total
          this.tableData = list
        }
      })
    },
    downDataToExcel() {
      Day_Active_Predict_dayCalculator({
        navCate: 2,
        currentPage: this.currentPage,
        pageSize: 100000,
        timeBegin: this.time[0],
        timeEnd: this.time[1],
      }).then((res) => {
        let header = [
          '日期',
          '实际日活',
          '预期每日新增',
          '预测30天后',
          '预测60天后',
          '预测90天后',
          '预测180天后',
          '预测365天后',
        ]
        let { list } = res[1]
        list = list.map((item) => {
          return (item = [
            item.date,
            item.active,
            item.value,
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
      })
    },
    search() {
      this.Day_Active_Predict_dayCalculator()
    },
    clear() {
      this.time = [
        moment().subtract(30, 'd').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ]
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
      this.Day_Active_Predict_dayCalculator()
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