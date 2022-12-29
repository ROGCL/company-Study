<template>
  <div class="score">
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
      <span class="label" style="margin-left:20px">指标以及评分明细：</span>
      <SelectChannel v-model="channel"></SelectChannel>
      <el-button type="primary" @click="search">查询</el-button>
      <el-button @click="clear">重置</el-button>
    </div>
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
          :class-name="item.type == 0 ? 'Dark' : ''"
          width="120"
        ></el-table-column>
      </el-table>
      <el-pagination
        background
        style="margin:20px"
        layout="prev, pager, next"
        :total="total"
        :current-page="currentPage"
        @current-change="currentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import store from 'store2'
import moment from 'moment'
import { Quantity_Statistics_grade } from '@/config/api/index'
import { export_json_to_excel } from '@/util/lead-out/Export2Excel'
import { pickerOptions } from '@/config/option'
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      time: [
        moment().subtract(30, 'd').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ],
      tableData: [],
      tHeader: [],
      excelData: [],
      tHeader_excel: [],
      tableData_excel: [],
      total: 0,
      channel: ['xiaomi'],
      pageSize: 10,
      currentPage: 1,
      pickerOptions,
      cell: {
        backgroundColor: 'red',
      },
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      Quantity_Statistics_grade({
        appId: this.$route.query.appId,
        loginId: store.get('user')['id'],
        loginToken: store.get('loginToken'),
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        timeBegin: this.time[0],
        timeEnd: this.time[1],
        channel:
          typeof this.channel == 'string'
            ? this.channel
            : this.channel.join(','),
      }).then((res) => {
        let { header, tbody, total } = res[1]
        this.total = total
        const _header = header.map((v, i) => ({
          label: v.weight ? v.index_name + v.weight : v.index_name,
          prop: String(i),
          type: v.table_type,
        }))

        const _tbody = []

        tbody.forEach((item, i) => {
          const obj = {}

          item.forEach((_item, _i) => {
            _tbody[i] = {
              ..._tbody[i],
              [String(_i)]: _item,
            }
          })
        })
        this.tHeader = _header
        this.tableData = _tbody
      })
    },
    fetchData() {
      return this.excelData
    },
    downDataToExcel() {
      Quantity_Statistics_grade({
        pageSize: 100000,
        timeBegin: this.time[0],
        timeEnd: this.time[1],
        channel:
          typeof this.channel == 'string'
            ? this.channel
            : this.channel.join(','),
      }).then((res) => {
        let { header, tbody, total } = res[1]
        header = header.map((item, index) => {
          return item.index_name + (item.weight ? item.weight : '')
        })

        const currentApp = this.$store.getters.getCurrentApp(this.$route.query.appId)
        const appName = currentApp['title']
        const appSystem = currentApp['system'] === '1' ? '[安卓]' : '[苹果]'
        const menu = this.$route.meta.name
        let start = this.time[0]
        let end = this.time[1]
        export_json_to_excel(
          header,
          tbody,
          `${appName} ${appSystem}-${menu}-${start}-${end}`
        )
      })
    },
    search() {
      this.getTableData()
    },
    clear() {
      this.time = [
        moment().subtract(30, 'd').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ]
      this.channel = []
    },
    currentChange(cur) {
      this.currentPage = cur
      this.getTableData()
    },
  },
  computed: {
    ...mapState({
      channelState: (state) => state.channel.data,
      appArr: (state) => state.app.data,
    }),
  },
}
</script>

<style lang="scss" scoped>
/deep/ .Dark {
  background-color: #f5f7fa;
}

.score {
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
  }
}
</style>