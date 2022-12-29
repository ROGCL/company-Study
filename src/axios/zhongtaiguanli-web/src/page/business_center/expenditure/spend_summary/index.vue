<template>
  <div class="home">
    <FilterLayout v-model="form" @onSubmit="search">
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="筛选时间">
          <!-- <el-date-picker
            v-model="form.time"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :popper-append-to-body="false"
            unlink-panels
          /> -->
          <dataPicker :datevalue.sync="form.time"></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="类型">
          <el-radio-group v-model="form.type">
            <el-radio-button
              v-for="(v, i) in types"
              :key="i"
              :label="v.value"
            >{{v.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24" v-if="this.form.type === '2' || this.form.type === '3'">
        <el-form-item label="次级">
          <el-select v-model="selectValue" placeholder="请选择" :disabled="disabledSelect" filterable>
            <el-option
              v-for="item in newOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24" v-if="this.form.type=== '4'">
        <el-form-item label="APP名称">
          <SelectApp v-model="selectValue" />
        </el-form-item>
      </el-col>
      <template #btn-option>
        <el-button class="downDataToExcel" type="primary" @click="exportExcel">导出</el-button>
        <!-- <el-button
          class="downDataToExcel"
          type="primary"
          @click="dialogVisible=true"
          v-if="form.type == '4'"
        >上传表格</el-button> -->
      </template>
    </FilterLayout>
    <div class="table-custom" v-loading="!tableDataOne.reload" v-if="!showIncomeList">
      <el-table :data="tableDataOne.data" border style="width: 100%" id="out-table">
        <el-table-column
          :label="label"
          align="center"
          v-for="( { key, label, child } ) in tableDataOne.columns"
          :key="key"
        >
          <el-table-column
            :prop="prop"
            :label="label"
            v-for="( { key, label, prop } ) in child"
            :key="key"
            align="center"
          ></el-table-column>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination-custom"
        background
        layout="prev, pager, next"
        :total="tableDataOne.total"
        @current-change="tableOneOnChangePage"
      ></el-pagination>
    </div>
    <div class="table-custom" v-loading="tableDataTow.reload" v-if="showIncomeList">
      <el-table border :data="tableDataTow.data" style="width: 100%" id="out-table-tow">
        <el-table-column
          :label="label"
          align="center"
          v-for="( { key, label, child } ) in tableDataTow.columns"
          :key="key"
        >
          <el-table-column
            :prop="prop"
            :label="label"
            v-for="( { key, label, prop } ) in child"
            :key="key"
            align="center"
          ></el-table-column>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination-custom"
        background
        layout="prev, pager, next"
        :total="tableDataTow.total"
        @current-change="tableTowOnChangePage"
      ></el-pagination>
    </div>
    <uploadTable v-model="dialogVisible" @onSuccess="getTableTowList" />
  </div>
</template>

<script>
import { pickerOptions } from '@/config/option'
import moment from 'moment'
import {
  Group_Manage_index,
  Apartment_Manage_index,
  System_apps,
  Invest_Statistics_index,
} from '@/config/api/index'
import uploadTable from './uploadTable'
import tocsv from '@/util/tocsv'
import FilterLayout from '@/layout/form'
import SelectApp from '@/component/select-app'

export default {
  components: {
    FilterLayout,
    SelectApp,
    uploadTable,
  },
  data() {
    return {
      pickerOptions,
      form: {
        time: [
          moment().subtract(30, 'd').format('YYYY-MM-DD'),
          moment().subtract(1, 'd').format('YYYY-MM-DD'),
        ],
        timeType: '1',
        type: '1',
        group_id: '',
        apartment_id: '',
        appid: '',
      },
      types: [
        {
          value: '1',
          label: '总和',
        },
        {
          value: '3',
          label: '部门',
        },
        {
          value: '2',
          label: '项目组',
        },
        {
          value: '4',
          label: 'App',
        },
      ],
      timeDimension: [
        {
          value: '1',
          label: '天',
        },
      ],
      tableDataOne: {
        columns: [],
        data: [],
        total: 0,
        reload: false,
        currentPage: 1,
      },
      tableDataTow: {
        columns: [],
        data: [],
        total: 0,
        reload: false,
        currentPage: 1,
      },
      options: {
        project: [],
        department: [],
        apps: [],
      },
      selectValue: '',
      dialogVisible: false,
    }
  },
  created() {
    this.getSelectData()
    this.getTableOneList()
  },
  methods: {
    getSelectData() {
      let params = { pageSize: 500 }
      Group_Manage_index(params).then((res) => {
        this.options.project = reFormat({
          arr: res[1].list,
          label: 'title',
          value: 'id',
        })
      })
      Apartment_Manage_index(params).then((res) => {
        this.options.department = reFormat({
          arr: res[1].list,
          label: 'title',
          value: 'id',
        })
      })
      System_apps().then((res) => {
        this.options.apps = res[1].map((app) => {
          return {
            label: `${app.title} - ${checkSystem(app.system)}`,
            value: app.id,
          }
        })
      })

      function reFormat({ arr, label, value }) {
        return arr.map((item) => {
          return {
            label: item[label],
            value: item[value],
          }
        })
      }

      function checkSystem(system) {
        return system == '1' ? '安卓' : '苹果'
      }
    },

    getTableOneList(
      pageSize = 10,
      currentPage = this.tableDataOne.currentPage
    ) {
      this.tableDataOne.reload = false
      let params = {
        ...this.form,
        timeBegin: this.form.time[0],
        timeEnd: this.form.time[1],
        pageSize,
        currentPage,
      }
      return Invest_Statistics_index(params).then((res) => {
        if (!res[1]) {
          this.$message.error(res[0].msg)
          this.tableDataOne.reload = true
          return
        }
        let { headers, list, tapMaps, total } = res[1]
        let columns = []
        for (const key in tapMaps) {
          columns.push({
            key,
            label: tapMaps[key],
            child: [],
          })
        }
        headers.forEach((item) => {
          columns.forEach((child_item) => {
            if (item.tap == child_item.key) {
              child_item.child.push({
                label: item.index_name,
                prop: item.key,
              })
            }
          })
        })
        this.tableDataOne.columns = columns
        this.tableDataOne.data = list
        this.tableDataOne.total = total
        this.tableDataOne.reload = true
      })
    },
    getTableTowList(
      pageSize = 10,
      currentPage = this.tableDataTow.currentPage
    ) {
      this.tableDataTow.reload = true
      let params = {
        ...this.form,
        timeBegin: this.form.time[0],
        timeEnd: this.form.time[1],
        pageSize,
        currentPage,
      }
      return Invest_Statistics_index(params).then((res) => {
        let { headers, list, tapMaps, total } = res[1]
        let columns = []
        for (const key in tapMaps) {
          columns.push({
            key,
            label: tapMaps[key],
            child: [],
          })
        }
        headers.forEach((item) => {
          columns.forEach((child_item) => {
            if (item.tap == child_item.key) {
              child_item.child.push({
                label: item.index_name,
                prop: item.key,
              })
            }
          })
        })
        this.tableDataTow.columns = columns
        this.tableDataTow.data = list
        this.tableDataTow.total = total
        this.tableDataTow.reload = false
      })
    },
    tableOneOnChangePage(current) {
      this.tableDataOne.currentPage = current
      this.getTableOneList()
    },
    tableTowOnChangePage(current) {
      this.tableDataTow.currentPage = current
      this.getTableTowList()
    },
    search() {
      let { form, selectValue } = this
      switch (form.type) {
        case '2':
          this.form.group_id = selectValue
          break
        case '3':
          this.form.apartment_id = selectValue
          break
        case '4':
          this.form.appid = selectValue
          this.getTableTowList()
          break
      }
      if (form.type != '4') {
        this.getTableOneList()
      }
    },
    exportExcel() {
      // todo 先查询再导出
      let method, dom
      switch (this.form.type) {
        case '4':
          method = this.getTableTowList
          dom = '#out-table-tow'
          break
        default:
          method = this.getTableOneList
          dom = '#out-table'
          break
      }
      method(500, 1).then(() => {
        let { time, type } = this.form
        let selectKey = (function () {
          switch (type) {
            case '1':
              return '总和'
            case '2':
              return '项目组'
            case '3':
              return '部门'
            case '4':
              return 'App'
          }
        })()
        let seleteValue
        try {
          seleteValue =
            type == '1'
              ? '总和'
              : this.newOptions.filter(
                  (item) => item.value == this.selectValue
                )[0].label
        } catch (error) {
          seleteValue = type == '1' ? '总和' : '全部'
        }
        tocsv(dom, `${time[0]}-${time[1]}-收入-${selectKey}-${seleteValue}`)
      })
    },
  },
  watch: {
    'form.type'() {
      this.selectValue = ''
    },
  },
  computed: {
    radioFilterApp() {
      return this.form.type == '1'
    },
    newOptions() {
      switch (this.form.type) {
        case '2':
          this.selectValue = this.options.project[0].value
          return this.options.project
        case '3':
          this.selectValue = this.options.department[0].value
          return this.options.department
        case '4':
          this.selectValue = this.options.apps[0].value
          return this.options.apps
      }
    },
    showIncomeList() {
      return this.form.type == 4
    },
  },
}
</script>

<style lang='scss' scoped>
</style>