<template>
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="6" :sm="12">
        <el-form-item label="开发者APPID" prop="platform_appid">
          <el-input v-model="searchForm.platform_appid" placeholder="请输入开发者APPID" />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="星图账户ID" prop="account_id">
          <el-input v-model="searchForm.account_id" placeholder="请输入星图账户ID" />
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="添加时间">
          <el-date-picker
            v-model="searchForm.time"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :popper-append-to-body="false"
            unlink-panels
          />
        </el-form-item>
      </el-col>
    </FilterLayout>
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      :params="searchForm"
      @pageChange="onPageChange"
      layout="total, prev, pager, next"
    >
      <template #table-option>
        <el-button type="primary" @click="onShowAdd">新增授权</el-button>
      </template>
      <template #option="scope">
        <el-button size="small" @click="onEdit(scope.row)">编辑</el-button>
      </template>
    </TableLayout>
    <el-dialog title="星图账户开发者授权" :visible.sync="addVisible">
      <el-form ref="addForm" :model="addForm" label-width="150px" :rules="addRules">
        <el-form-item label="开发者APPID" prop="platform_appid">
          <el-input v-model="addForm.platform_appid" placeholder="在巨量引擎应用管理中获取" :disabled="edit" />
        </el-form-item>
        <el-form-item label="Secret" prop="secret">
          <el-input v-model="addForm.secret" placeholder="在巨量引擎-应用管理-设置中获取" />
        </el-form-item>
        <el-form-item label="auth_code" prop="auth_code">
          <el-input v-model="addForm.auth_code" placeholder="通过粘贴授权URL获取(有效期10分钟)" />
        </el-form-item>
        <el-form-item label="星图账户ID" prop="account_id">
          <el-input v-model="addForm.account_id" placeholder="星图账户ID" :disabled="edit" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import FilterLayout from '@/layout/form'
import TableLayout from '@/layout/table'
import { pickerOptions } from '@/config/option'
export default {
  components: {
    FilterLayout,
    TableLayout,
  },
  data() {
    return {
      pickerOptions,
      column: [
        {
          prop: 'platform_appid',
          label: '开发者APPID',
        },
        {
          prop: 'account_id',
          label: '星图账户ID',
        },
        {
          prop: 'secret',
          label: 'Secret',
        },
        {
          prop:'time_add',
          label:'添加时间'
        },
        {
          prop: 'option',
          label: '操作',
        },
      ],
      searchForm: {
        account_id: '',
        platform_appid: '',
        time: [
          
        ],
      },
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
      addVisible: false,
      addForm: {
        platform_appid: '',
        auth_code: '',
        secret: '',
        account_id: '',
      },
      addRules: {
        platform_appid: [{ required: true, message: '请输入开发者APPID' }],
        secret: [{ required: true, message: '请输入秘钥' }],
        auth_code: [{ required: true, message: '请输入验证auth_code' }],
        account_id: [{ required: true, message: '请输入星图账户ID' }],
      },
      edit: false,
    }
  },
  mounted() {
    this.fetchList()
  },
  computed: {
    ...mapState({
      channel: (state) => state.channel.data,
      App: (state) => state.app.data,
    }),
  },
  methods: {
    onSubmit() {
      this.tableOpt.currentPage = 1
      this.fetchList()
    },
    onPageChange(current) {
      this.tableOpt.currentPage = current
      this.fetchList()
    },
    async fetchList() {
      const { searchForm, tableOpt } = this

      this.tableData.loading = true

      const [err, res] = await this.$http.post(
        'Invest_Config/authorizationXtList',
        {
          ...searchForm,
          ...tableOpt,
          timeBegin: this.searchForm['time'][0],
          timeEnd: this.searchForm['time'][1],
        }
      )

      this.tableData.loading = false

      if (err) return

      const { list, currentPage, total } = res

      this.tableData.data = list
      this.tableData.currentPage = currentPage
      this.tableData.total = total
    },
    onShowAdd() {
      this.addVisible = true
      this.edit = false
      this.$refs['addForm'] && this.$refs['addForm'].resetFields()
    },
    onAdd() {
      this.$refs['addForm'].validate(async (valid, data) => {
        if (!valid) {
          return false
        }

        const [err, res] = await this.$http.post(
          'Invest_Config/authorizationXt',
          {
            ...this.addForm,
          }
        )

        if (err) return

        this.$message({
          message: this.edit ? '编辑授权成功' : '新增授权成功',
          type: 'success',
        })

        this.addVisible = false
        this.fetchList()
      })
    },
    onEdit(data) {
      this.addVisible = true
      this.edit = true
      this.$nextTick(() => {
        this.addForm = { ...this.addForm, ...data }
      })
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .app-control {
  width: 100%;
}

.tip {
  width: 100%;
  color: #999;
  font-size: 12px;
  text-align: center;
}

.reassociation-btn {
  cursor: pointer;
}

.dialog-tip {
  position: absolute;
  top: 22px;
  left: 256px;
}
</style>