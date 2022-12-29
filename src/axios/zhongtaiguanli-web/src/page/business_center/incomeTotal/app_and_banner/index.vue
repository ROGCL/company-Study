<template >
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="App名称" prop="appid">
          <SelectApp v-model="searchForm.appid"></SelectApp>
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
      <template #system="row">{{ row.row.system | formatSystem }}</template>
      <template #bu_app_status="row">{{ row.row.bu_app_status | formatIs('完成', '--') }}</template>
      <template #csj_status="row">{{ row.row.csj_status | formatIs('完成', '--') }}</template>
      <template #gdt_status="row">{{ row.row.gdt_status | formatIs('完成', '--') }}</template>
      <template #ks_status="row">{{ row.row.ks_status | formatIs('完成', '--') }}</template>
      <template #kj_status="row">{{ row.row.kj_status | formatIs('完成', '--') }}</template>
      <template #bqt_status="row">{{ row.row.bqt_status | formatIs('完成', '--') }}</template>
      <template #ljwh_status="row">{{ row.row.ljwh_status | formatIs('完成', '--') }}</template>
      <template #option="scope">
        <el-button size="small" @click="onShowEdit(scope.row)">编辑</el-button>
      </template>
    </TableLayout>
    <el-dialog :title="editFormTitle" :visible.sync="showEditForm">
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="140px"
        class="edit-form"
        :rules="rules"
      >
        <div class="title">广告中台关联</div>
        <el-form-item label="广告中台应用名" prop="bu_app_title">
          <el-input
            v-model="editForm.bu_app_title"
            autocomplete="off"
            placeholder="请输入广告中台应用名"
            :disabled="current.bu_app_status | formatIs(true, false)"
          ></el-input>
        </el-form-item>
        <el-form-item label="广告中台ID" prop="bu_app_id">
          <el-input
            v-model="editForm.bu_app_id"
            autocomplete="off"
            placeholder="请输入广告中台ID"
            :disabled="current.bu_app_status | formatIs(true, false)"
          ></el-input>
        </el-form-item>
        <el-form-item label="广告中台appkey" prop="bu_app_key">
          <el-input
            v-model="editForm.bu_app_key"
            autocomplete="off"
            placeholder="请输入广告中台appkey"
            :disabled="current.bu_app_status | formatIs(true, false)"
          ></el-input>
        </el-form-item>
        <div class="title">自动广告收入拉取</div>
        <div class="tip">注：填写媒体ID需要确认中台已对接过对应平台的广告账户，保存后不可修改，请谨慎填写</div>
        <el-form-item label="穿山甲媒体ID" prop="csj_media_oth">
          <el-input
            v-model="editForm.csj_media_oth"
            autocomplete="off"
            placeholder="请输入穿山甲媒体ID"
            :disabled="current.csj_status | formatIs(true, false)"
          ></el-input>
        </el-form-item>
        <el-form-item label="广点通媒体ID" prop="gdt_media_oth">
          <el-input
            v-model="editForm.gdt_media_oth"
            autocomplete="off"
            placeholder="请输入广点通媒体ID"
            :disabled="current.gdt_status | formatIs(true, false)"
          ></el-input>
        </el-form-item>
        <el-form-item label="快手媒体ID" prop="ks_media_oth">
          <el-input
            v-model="editForm.ks_media_oth"
            autocomplete="off"
            placeholder="请输入快手媒体ID"
            :disabled="current.ks_status | formatIs(true, false)"
          ></el-input>
        </el-form-item>
        <el-form-item label="铠甲媒体ID" prop="kj_media_oth">
          <el-input
            v-model="editForm.kj_media_oth"
            autocomplete="off"
            placeholder="请输入铠甲媒体ID"
            :disabled="current.kj_status | formatIs(true, false)"
          ></el-input>
        </el-form-item>
        <el-form-item label="百度媒体ID" prop="bqt_media_oth">
          <el-input
            v-model="editForm.bqt_media_oth"
            autocomplete="off"
            placeholder="请输入百度媒体ID"
            :disabled="current.bqt_status | formatIs(true, false)"
          ></el-input>
        </el-form-item>
        <el-form-item label="灵机媒体ID" prop="ljwh_media_oth">
          <el-input
            v-model="editForm.ljwh_media_oth"
            autocomplete="off"
            placeholder="请输入灵机媒体ID"
            :disabled="current.ljwh_status | formatIs(true, false)"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditForm = false">取 消</el-button>
        <el-button type="primary" @click="onEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template >

<script >
import { mapState } from 'vuex'
import FilterLayout from '@/layout/form'
import TableLayout from '@/layout/table'
import SelectApp from '@/component/select-app'
import { formatSystem } from '@/util/filters'

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
      searchForm: {
        appid: '',
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
          prop: 'system',
          label: '平台',
        },
        {
          prop: 'bu_app_status',
          label: '广告中台',
        },
        {
          prop: 'csj_status',
          label: '穿山甲',
        },
        {
          prop: 'gdt_status',
          label: '广点通',
        },
        {
          prop: 'ks_status',
          label: '快手',
        },
        {
          prop: 'kj_status',
          label: '铠甲',
        },
        {
          prop: 'bqt_status',
          label: '百度',
        },
        {
          prop: 'ljwh_status',
          label: '灵机',
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
      editForm: {
        appid: '',
        bu_app_title: '',
        bu_app_id: '',
        bu_app_key: '',
        csj_media_oth: '',
        gdt_media_oth: '',
        ks_media_oth: '',
        kj_media_oth: '',
        bqt_media_oth: '',
        ljwh_media_oth: '',
      },
      current: {},
      rules: {
        bu_app_title: [{ required: true, message: '请输入广告中台应用名' }],
        bu_app_id: [{ required: true, message: '请输入广告中台ID' }],
        bu_app_key: [{ required: true, message: '请输入广告中台appkey' }],
      },
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const { searchForm, tableOpt } = this

      this.tableData.loading = true

      const [err, res] = await this.$http.post('income/appAdIncome', {
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
    onShowEdit(data) {
      const { system, title } = data

      Object.keys(this.editForm).forEach((key) => {
        if (key === 'appid') {
           this.editForm['appid'] = data['id']
           return
        }

        this.editForm[key] = data[key]
      })

      this.current = data
      this.editFormTitle = `${title} ${formatSystem(system)} 相关设置`
      this.showEditForm = true
    },
    onEdit() {
      this.$refs['editForm'].validate(async (valid, data) => {
        if (!valid) return false

        const [err, res] = await this.$http.post('income/editContact', {
          ...this.editForm,
        })

        if (err) {
          this.$message.error('编辑失败')

          return
        }

        this.$message.success('编辑成功')

        this.showEditForm = false
        this.fetchData()
      })
    },
  },
}
</script >

<style lang = "less" scoped >
.edit-form {
  .title {
    font-size: 18px;
    margin-bottom: 15px;
    font-weight: bold;
  }

  .tip {
    font-size: 12px;
    color: #999;
    margin-bottom: 10px;
  }
}
</style >
