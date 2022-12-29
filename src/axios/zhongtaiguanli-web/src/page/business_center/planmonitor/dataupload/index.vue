<template>
  <div class="dataupload">
    <FilterLayout v-model="form" @onSubmit="Search" class="filter">
      <el-col :md="5" :sm="12">
        <filterapp v-bind:appId.sync="form.appId" />
      </el-col>
      <el-col :md="9" :lg="6" :sm="24">
        <el-form-item label="筛选时间">
          <el-date-picker
            v-model="form.date"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <template #btn-option>
        <el-button type="primary" @click="add">新增</el-button>
      </template>
    </FilterLayout>
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="form.currentPage"
      @pageChange="onPageChange"
    >
      <template #option="scope">
        <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
      </template>
    </TableLayout>
    <div class="dialog">
      <addDialog ref="addDialog" @success="Search" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import FilterLayout from '@/layout/form'
import TableLayout from '@/layout/table'
import filterapp from '@/component/filterapp/filterapp'
import addDialog from './add'
import { pickerOptions } from '@/config/option'
import { System_getCpcList } from '@/config/api/index'
export default {
  data() {
    return {
      pickerOptions,
      form: {
        appId: '',
        date: [
          moment().subtract(30, 'd').format('YYYY-MM-DD'),
          moment().subtract(1, 'd').format('YYYY-MM-DD'),
        ],
        currentPage: 1,
      },
      column: [
        {
          prop: 'date',
          label: '日期',
        },
        {
          prop: 'cpc',
          label: 'cpc',
        },
        {
          prop: 'option',
          label: '操作',
          width: '100',
        },
      ],
      tableData: {
        data: [],
        total: 10,
        loading: true,
      },
    }
  },
  methods: {
    async Search() {
      const { appId, date, currentPage } = this.form
      const params = {
        appId,
        timeBegin: date[0],
        timeEnd: date[1],
        currentPage,
      }
      const [err, res] = await System_getCpcList(params)

      if (err) return

      const { list, total } = res
      this.tableData.data = list
      this.tableData.total = total
      this.tableData.loading = false
    },
    add() {
      this.$refs.addDialog.$data.dialogVisible = true
    },
    edit({ id, date, cpc }) {
      this.$refs.addDialog.$data.dialogVisible = true
      this.$refs.addDialog.$data.edit = true
      this.$refs.addDialog.$data.form.date = moment(date).format('YYYY-MM-DD')
      this.$refs.addDialog.$data.form.cpc = cpc
      this.$refs.addDialog.$data.editData.id = id
    },
    onPageChange(num) {
      this.form.currentPage = num
      this.Search()
    },
  },
  watch: {
    'form.appId': function (newValue, oldValue) {
      if (oldValue) return
      this.Search()
    },
  },
  components: {
    FilterLayout,
    filterapp,
    TableLayout,
    addDialog,
  },
}
</script>

<style lang='scss' scoped>
</style>