<template>
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="5" :sm="12">
        <el-form-item label="应用名" prop="search">
          <el-input v-model="searchForm.search" placeholder="请输入应用名" />
        </el-form-item>
      </el-col>
      <el-col :md="5" :sm="12">
        <el-form-item label="平台" prop="system">
          <el-select v-model="searchForm.system" placeholder="全部平台" :popper-append-to-body="false">
            <el-option v-for="(v, i) in systems" :key="i" :label="v.label" :value="v.value" />
          </el-select>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      @sizeChange="onSizeChange"
      @pageChange="onPageChange"
      :tooltipFlag="true"
    >
      <template #table-option>
        <el-button type="danger" icon="el-icon-plus" @click="onAdd">添加</el-button>
      </template>
      <template #exp_time="row">
        {{row.row.exp_time && row.row.exp_time!=="19700101"?moment(row.row.exp_time).format("YYYY-MM-DD"):""}}
      </template>
      <template #system="row">{{ formatSystem(row.row.system) }}</template>
      <template #option="row">
        <el-button-group>
          <el-button @click="onEdit(row)" type="primary" size="small" icon="el-icon-edit">修改</el-button>
          <el-button @click="onDelete(row)" type="primary" size="small" icon="el-icon-delete">删除</el-button>
        </el-button-group>
      </template>
    </TableLayout>
  </div>
</template>

<script>
import moment from "moment";
import { mapState, mapActions } from 'vuex'
import FilterLayout from '@/layout/form'
import TableLayout from '@/layout/table'

export default {
  components: {
    FilterLayout,
    TableLayout,
  },
  data() {
    return {
      moment: moment,
      systems: [
        {
          label: '全部',
          value: '',
          disabled: false,
        },
        {
          label: 'Android',
          value: 1,
          disabled: false,
        },
        {
          label: 'iOS',
          value: 2,
          disabled: false,
        },
        {
          label: '微信小程序',
          value: 3,
          disabled: false,
        },
        {
          label: '抖音小程序',
          value: 4,
          disabled: false,
        },
        {
          label: 'Web网页',
          value: 5,
          disabled: false,
        },
      ],
      searchForm: {
        search: '',
        system: '',
      },
      column: [
        {
          prop: 'id',
          label: 'ID',
        },
        {
          prop: 'title',
          label: '应用名',
        },
        {
          prop: 'package_name',
          label: '包名',
        },
        {
          prop: 'system',
          label: '平台',
        },
        {
          prop: 'appkey',
          label: 'appKey',
        },
        {
          prop: 'secret_key',
          label: 'OAID证书',
          width:"200"
        },
        {
          prop: 'exp_time',
          label: '证书到期时间',
        },
        {
          prop: 'note',
          label: '备注',
        },
        {
          prop: 'time_add',
          label: '添加时间',
        },
        {
          prop: 'option',
          label: '操作',
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      AppOption: [
        {
          value: '1',
          label: '天气预报',
        },
        {
          value: '2',
          label: '卡点视频',
        },
      ],
    }
  },
  mounted() {
    this.onSubmit()
  },
  computed: {
    ...mapState({
      tableData: (state) => state.app_manage.list,
    }),
  },
  methods: {
    ...mapActions(['getAppManageList', 'removeAppManage', 'getApp']),
    async fetchData() {
      const { tableOpt, searchForm } = this

      const [err, res] = await this.getAppManageList({
        ...searchForm,
        ...tableOpt,
      })

      if (err) return
    },
    onSubmit() {
      this.tableOpt.currentPage = 1
      this.fetchData(true)
    },
    onPageChange(current) {
      this.tableOpt.currentPage = current
      this.fetchData()
    },
     onSizeChange(current) {
      this.tableOpt.pageSize = current;
      this.fetchData();
    },
    onAdd() {
      this.$router.push('/manage_center/app_manage/add')
    },
    onEdit(data) {
      const { row } = data

      this.$router.push({
        path: '/manage_center/app_manage/edit',
        query: {
          id: row.id,
        },
      })
    },
    onDelete(data) {
      const { row } = data
      this.$confirm('确认删除该App？', '提示')
        .then(async (_) => {
          const { id } = row
          const [err, res] = await this.removeAppManage({
            appId: id,
          })

          if (err) {
            this.$message({
              showClose: true,
              message: err,
              type: 'error',
            })
            return
          }

          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success',
          })

          this.getApp()
          this.onSubmit()
        })
        .catch((_) => {})
    },
    formatSystem(code) {
      switch (String(code)) {
        case '1':
          return 'Android'
        case '2':
          return 'iOS'
        case '3':
          return '微信小程序'
        case '4':
          return '抖音小程序'
        case '5':
          return 'Web网页'
        default:
          return '未知'
      }
    },
  },
}
</script>

<style lang="less" scoped>
</style>