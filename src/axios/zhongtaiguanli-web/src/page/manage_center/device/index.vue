<template >
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="5" :sm="12">
        <el-form-item label="手机号/UID" prop="keywords">
          <el-input v-model="searchForm.keywords" placeholder="搜索手机号或者UID" />
        </el-form-item>
      </el-col>
      <el-col :md="5" :sm="12">
        <el-form-item label="IMEI/IDFA" prop="uuid">
          <el-input v-model="searchForm.uuid" placeholder="搜索IMEI或者IDFA" />
        </el-form-item>
      </el-col>
      <el-col :md="5" :sm="12">
        <el-form-item label="OAID" prop="oaid">
          <el-input v-model="searchForm.oaid" placeholder="搜索OAID" />
        </el-form-item>
      </el-col>
      <el-col :md="5" :sm="12">
        <el-form-item label="App名称" prop="app_id">
          <SelectApp v-model="searchForm.app_id"></SelectApp>
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
    >
      <template #option="scope">
        <el-popconfirm title="确定删除这条数据吗？" @confirm="onDelete(scope.row)">
          <el-button slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
    </TableLayout>
  </div>
</template >

<script >
import { pickerOptions } from '@/config/option'
import FilterLayout from '@/layout/form'
import TableLayout from '@/layout/table'
import SelectApp from '@/component/select-app'
import { mapState } from 'vuex'

export default {
  name: 'home',
  components: {
    FilterLayout,
    TableLayout,
    SelectApp,
  },
  computed: {
    ...mapState({
      App: (state) => state.app.data,
    }),
  },
  data() {
    return {
      pickerOptions,
      searchForm: {
        keywords: '',
        uuid: '',
        app_id: '',
        oaid: '',
      },
      column: [
        {
          prop: 'phone',
          label: '手机号',
        },
        {
          prop: 'uid',
          label: 'UID',
        },
        {
          prop: 'appid',
          label: 'APPID',
        },
        {
          prop: 'app_name',
          label: 'APP名称',
        },
        {
          prop: 'uuid',
          label: 'IMEI',
        },
        {
          prop: 'zt',
          label: 'ZTID',
        },
        {
          prop: 'time_add',
          label: '激活时间',
        },
        {
                    prop: 'channel',
          label: '渠道号',
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
      tableData: {
        data: [],
        total: 0,
        loading: false,
        currentPage: 1,
        pageSize: 10,
      },
      showEditForm: false,
      editFormTitle: '',
      platform: [],
    }
  },
  mounted() {},
  methods: {
    async fetchData() {
      const { searchForm, tableOpt } = this

      if (!searchForm.keywords && !searchForm.uuid && !searchForm.oaid) {
        this.$message({
          message: '请输入手机号、UID、IMEI、IDFA、OAID其中任意值',
          type: 'error',
        })
        return
      }

      if (!searchForm.app_id) {
        this.$message({
          message: '请选择app',
          type: 'error',
        })
        return
      }

      this.tableData.loading = true

      const [err, res] = await this.$http.post('Device_Manage/index', {
        ...searchForm,
        ...tableOpt,
      })

      this.tableData.loading = false

      if (err) return

      const { list, currentPage, total } = res
      this.tableData.data = list
      this.tableData.currentPage = currentPage
      this.tableData.total = total
    },
    onSubmit() {
      this.tableOpt.currentPage = 1
      this.fetchData()
    },
    onPageChange(current) {
      this.tableOpt.currentPage = current
      this.fetchData()
    },
    onSizeChange(current) {
      this.tableOpt.pageSize = current;
      this.fetchData();
    },
    async onDelete(data) {
      if (!data) return

      const [err, res] = await this.$http.post('Device_Manage/del', { ...data })

      if (err) {
        this.$message({
          message: err || '删除失败',
          type: 'error',
        })
        return
      }

      this.$message({
        message: '删除成功',
        type: 'success',
      })

      this.onSubmit()
    },
  },
}
</script >

<style lang = "less" scoped >
.form-item-child {
  padding-left: 50px;
}
/deep/.back-money {
  width: 100px;
  margin: 0 10px;
}
</style >
