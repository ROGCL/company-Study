<template>
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="6" :sm="12">
        <el-form-item label="百度APPID" prop="platform_appid">
          <el-input v-model="searchForm.platform_appid" placeholder="请输入百度APPID" />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="超管账户ID" prop="account_id">
          <el-input v-model="searchForm.account_id" placeholder="请输入超管账户ID" />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="secretKey" prop="secret">
          <el-input v-model="searchForm.secret" placeholder="请输入secretKey" />
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
    <el-dialog title="百度SEM超管授权" :visible.sync="addVisible" :close-on-click-modal="false">
      <!-- <a
        class="dialog-tip"
        href="https://docs.qq.com/doc/DWnZtQnRIV0dFaGFX"
        target="_blank"
      >如何获取以下字段？</a> -->
      <el-form ref="addForm" :model="addForm" label-width="100px" :rules="addRules">
        <el-form-item label="百度APPID" prop="appId">
          <el-input v-model="addForm.appId"  :disabled="edit" placeholder="在百度开发者应用管理中获取" />
        </el-form-item>
        <el-form-item label="secretKey" prop="secretKey">
          <el-input v-model="addForm.secretKey" placeholder="在百度开发者应用管理中获取" />
        </el-form-item>
        <el-form-item label="authCode" prop="authCode">
          <el-input v-model="addForm.authCode" placeholder="通过粘贴授权URL获取(有效期10分钟)" />
        </el-form-item>
        <el-form-item label="超管账户ID" prop="userId">
          <el-input v-model="addForm.userId"  :disabled="edit" placeholder="百度超管账户ID" />
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
import { mapState } from 'vuex'
import FilterLayout from '@/layout/form'
import TableLayout from '@/layout/table'

export default {
  components: {
    FilterLayout,
    TableLayout,
  },
  data() {
    return {
      column: [
        {
          prop: 'platform_appid',
          label: '百度APPID',
        },
        {
          prop: 'secret',
          label: 'secretKey',
        },
        {
          prop: 'account_id',
          label: '超管账户ID',
        },
        {
          prop: 'option',
          label: '操作',
        },
      ],
      searchForm: {
        account_id: '',
        platform_appid: '',
        secret:"",
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
        appId: '',
        authCode: '',
        secretKey: '',
        userId: '',
      },
      addRules: {
        appId: [{ required: true, message: '请输入百度APPID' }],
        secretKey: [{ required: true, message: '请输入秘钥' }],
        authCode: [{ required: true, message: '请输入验证auth_code' }],
        userId: [{ required: true, message: '请输入超管账户ID' }],
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
        'Invest_Config/authBaiduList',
        {
          ...searchForm,
          ...tableOpt,
        }
      )

      this.tableData.loading = false

      if (err) return

      const { data, currentPage, total } = res

      this.tableData.data = data
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
        console.log(this.addForm);
        if (!valid) {
          return false
        }

        const [err, res] = await this.$http.post('Invest_Config/addBaiduEngine', {
          ...this.addForm,
        })
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
        this.addForm = { 
          ...this.addForm,
          secretKey:data.secret,
          appId:data.platform_appid,
          userId:data.account_id,
         }
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