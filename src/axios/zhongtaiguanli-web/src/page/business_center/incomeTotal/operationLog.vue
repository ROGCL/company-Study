<template>
  <div class="operationLog">
    <div class="filter-custom">
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
        <el-col :md="5" :sm="12">
          <el-form-item label="行为筛选">
            <el-select v-model="form.is_update" placeholder="请选择">
              <el-option
                v-for="item in behaviorList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="5" :sm="12">
          <el-form-item label="用户筛选">
            <el-select v-model="form.admin_id" filterable>
              <el-option
                v-for="item in userList"
                :key="item.value"
                :label="item.realname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </FilterLayout>
    </div>
    <div class="table-custom" v-loading="table.loading">
      <el-table :data="table.data" border style="width: 99.9%">
        <el-table-column
          :prop="prop"
          :label="label"
          v-for="( {  label, prop } ) in table.columns"
          :key="prop"
          align="center"
        ></el-table-column>
      </el-table>
      <el-pagination
        class="pagination-custom"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="table.total"
        @current-change="currentPage"
        @size-change="onSizeChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { pickerOptions } from '@/config/option'
import { admin_index, income_operateList } from '@/config/api/index'
import FilterLayout from '@/layout/form'
export default {
  data() {
    return {
      pickerOptions,
      form: {
        time: [
          moment().subtract(30, 'd').format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD'),
        ],
        is_update: '2',
        admin_id: '',
        currentPage: 1,
        pageSize:10
      },
      table: {
        total: 0,
        loading: false,
        columns: [
          {
            label: '时间',
            prop: 'time_add',
          },
          {
            label: '用户',
            prop: 'realname',
          },
          {
            label: '账号',
            prop: 'name',
          },
          {
            label: '行为',
            prop: 'is_update',
          },
          {
            label: 'APPID',
            prop: 'appid',
          },
          {
            label: 'APP名称',
            prop: 'title',
          },
          {
            label: '系统',
            prop: 'system',
          },
          {
            label: '日期',
            prop: 'date',
          },
          {
            label: '收入渠道名称',
            prop: 'channel',
          },
          {
            label: '修改前金额',
            prop: 'cost',
          },
          {
            label: '修改后金额',
            prop: 'cost_new',
          },
        ],
        data: [],
      },
      behaviorList: [
        {
          value: '0',
          label: '输入',
        },
        {
          value: '1',
          label: '修改',
        },
        {
          value: '2',
          label: '所有',
        },
      ],
      userList: [],
      logList: [],
    }
  },
  created() {
    this.getUserList()
    this.getLogList()
  },
  methods: {
    getUserList() {
      admin_index({ pageSize: 500 }).then((res) => {
        this.userList = res[1].list
        this.userList.unshift({
          realname: '全部',
          id: '',
        })
      })
    },
    getLogList() {
      this.table.loading = true
      income_operateList(this.form).then((res) => {
        let { total, list } = res[1]
        this.table.total = total
        this.table.data = list
        this.table.loading = false
      })
    },
    search() {
      this.getLogList()
    },
    currentPage(num) {
      this.form.currentPage = num
      this.getLogList()
    },
    onSizeChange(num) {
      this.form.pageSize = num
      this.getLogList()
    },
  },
  components: {
    FilterLayout,
  },
}
</script>

<style lang='scss' scoped>
</style>