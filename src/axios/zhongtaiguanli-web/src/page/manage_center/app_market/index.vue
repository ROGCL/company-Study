<template >
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="5" :sm="12">
        <el-form-item label="投放平台" prop="channel">
          <el-select v-model="searchForm.channel" placeholder="全部平台">
            <el-option label="全部" value />
            <el-option
              v-for="(v, i) in platformChannel"
              :key="i"
              :label="v.label"
              :value="v.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="5" :sm="12">
        <el-form-item label="APP名称" prop="appid">
          <SelectApp v-model="searchForm.appid"></SelectApp>
        </el-form-item>
      </el-col>
      <el-col :md="5" :sm="12">
        <el-form-item label="时间" prop="time">
          <!-- <el-date-picker
            v-model="searchForm.time"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            :clearable="true"
            :popper-append-to-body="false"
            unlink-panels
          /> -->
          <dataPicker :datevalue.sync="searchForm.time"></dataPicker>
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
      <template #table-option>
        <el-button type="primary" icon="el-icon-plus" @click="onShowEdit()">新增</el-button>
      </template>
      <template #status="scope">
        <span
          :style="{color: scope.row.status == '1' ? '#67C23A' : '#F56C6C'}"
        >{{ formatStatus(scope.row.status) }}</span>
      </template>
      <template #option="scope">
        <el-button @click="onShowEdit(scope.row)" type="text">修改</el-button>
        <el-button @click="onDelete(scope.row.id)" type="text">删除</el-button>
      </template>
    </TableLayout>
    <el-dialog :title="editForm.id ? '修改配置' :'新增配置'" :visible.sync="showEditForm">
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="140px"
        :rules="rules"
        class="custom-form"
      >
        <el-form-item label="投放平台" prop="channel">
          <el-select
            class="custom-select"
            v-model="editForm.channel"
            placeholder="请选择平台"
            :disabled="!!editForm.id"
          >
            <el-option
              v-for="(v, i) in platformChannel"
              :key="i"
              :label="v.label"
              :value="v.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="client_id"
          prop="client_id"
          v-if="showFormItem.indexOf('client_id') >=0"
        >
          <el-input
            v-model="editForm.client_id"
            autocomplete="off"
            placeholder="请输入client_id"
            :disabled="editForm.channel ==='vivo' && !!editForm.id"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="secrete_key"
          prop="secrete_key"
          v-if="showFormItem.indexOf('secrete_key') >=0"
        >
          <el-input v-model="editForm.secrete_key" autocomplete="off" placeholder="请输入secrete_key"></el-input>
        </el-form-item>
        <el-form-item
          label="platform_appid"
          prop="platform_appid"
          v-if="showFormItem.indexOf('platform_appid') >=0"
        >
          <el-input
            v-model="editForm.platform_appid"
            autocomplete="off"
            placeholder="请输入platform_appid"
          ></el-input>
        </el-form-item>
        <el-form-item label="sign_id" prop="sign_id" v-if="showFormItem.indexOf('sign_id') >=0">
          <el-input v-model="editForm.sign_id" autocomplete="off" placeholder="请输入sign_id"></el-input>
        </el-form-item>
        <el-form-item label="owner_id" prop="owner_id" v-if="showFormItem.indexOf('owner_id') >=0">
          <el-input v-model="editForm.owner_id" autocomplete="off" placeholder="请输入owner_id"></el-input>
        </el-form-item>
        <el-form-item label="中台appid" prop="appid" v-if="showFormItem.indexOf('appid') >=0">
          <el-input
            v-model="editForm.appid"
            autocomplete="off"
            placeholder="请输入appid"
            :disabled="editForm.channel !=='vivo' && !!editForm.id"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="editForm.status"
            active-text="开启"
            inactive-text="关闭"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditForm = false">取 消</el-button>
        <el-button type="primary" @click="onEdit" :loading="editLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template >

<script >
import SelectApp from '@/component/select-app';
import FilterLayout from '@/layout/form';
import TableLayout from '@/layout/table';
import { pickerOptions } from '@/config/option';

export default {
  name: 'home',
  components: {
    FilterLayout,
    TableLayout,
    SelectApp,
  },
  data() {
    return {
      searchForm: {
        channel: '',
        appid: '',
        time: [],
      },
      putOption: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '是',
          value: '1',
        },
        {
          label: '否',
          value: '2',
        },
      ],
      column: [
        {
          prop: 'channel',
          label: '投放平台',
        },
        {
          prop: 'client_id',
          label: 'client_id',
        },
        {
          prop: 'sign_id',
          label: 'sign_id',
        },
        {
          prop: 'secrete_key',
          label: 'secrete_key',
        },
        {
          prop: 'owner_id',
          label: 'owner_id',
        },
        {
          prop: 'platform_appid',
          label: 'platform_appid',
        },
        {
          prop: 'appid',
          label: '中台appid',
        },
        {
          prop: 'time_add',
          label: '添加时间',
        },
        {
          prop: 'status',
          label: '投放状态',
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
      platformChannel: [],
      editForm: {
        id: '',
        channel: '',
        client_id: '',
        secrete_key: '',
        platform_appid: '',
        sign_id: '',
        owner_id: '',
        appid: '',
        status: '1',
      },
      editLoading: false,
      rules: {
        channel: [{ required: true, message: '请选择平台' }],
        client_id: [{ required: true, message: '请输入client_id' }],
        secrete_key: [{ required: true, message: '请输入secrete_key' }],
        platform_appid: [{ required: true, message: '请输入platform_appid' }],
        sign_id: [{ required: true, message: '请输入sign_id' }],
        owner_id: [{ required: true, message: '请输入owner_id' }],
        appid: [{ required: true, message: '请输入appid' }],
      },
      isNewAdvertiser: 1,
      pickerOptions,
    }
  },
  mounted() {
    this.fetchPlatformChannel()
    this.fetchData()
  },
  computed: {
    showFormItem() {
      const mixs = {
        huawei: ['client_id', 'secrete_key', 'platform_appid', 'appid'],
        xiaomi: [
          'sign_id',
          'secrete_key',
          'owner_id',
          'platform_appid',
          'appid',
        ],
        oppo: ['sign_id', 'secrete_key', 'owner_id', 'appid'],
        vivo: ['client_id', 'sign_id', 'secrete_key','appid'],
      }
      const { channel } = this.editForm

      if (!channel) return []

      return mixs[channel]
    },
  },
  methods: {
    async fetchPlatformChannel() {
      const [err, res] = await this.$http.post(
        'app_store_invest/getPlatformChannel'
      )

      if (err) return

      this.platformChannel = res
    },
    async fetchData() {
      const { searchForm, tableOpt } = this

      this.tableData.loading = true

      const [err, res] = await this.$http.post('app_store_invest/index', {
        ...searchForm,
        ...tableOpt,
        timeBegin: searchForm['time'][0],
        timeEnd: searchForm['time'][1],
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
    onEdit() {
      this.$refs['editForm'].validate(async (valid, data) => {
        if (!valid) return false

        this.editLoading = true

        const [err, res] = await this.$http.post('app_store_invest/save', {
          ...this.editForm,
        })

        this.editLoading = false

        if (err) return

        this.$message.success('新增成功')

        this.showEditForm = false
        this.fetchData()
      })
    },
    onShowEdit(data = {}) {
      const form = {
        id: '',
        channel: '',
        client_id: '',
        secrete_key: '',
        platform_appid: '',
        sign_id: '',
        owner_id: '',
        appid: '',
        status: '1',
      }

      this.editForm = form

      if (!data.id) {
        this.showEditForm = true
        return
      }

      Object.keys(form).forEach((key) => {
        this.editForm[key] = data[key] || ''
      })

      this.showEditForm = true
    },
    async onDelete(id) {
      this.$confirm('确认删除该投放平台？', '提示').then(async () => {
        const [err, res] = await this.$http.post('app_store_invest/delete', {
          id,
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

        this.fetchData()
      })
    },
    formatStatus(val) {
      switch (String(val)) {
        case '0':
          return '关闭'
        case '1':
          return '开启'
        default:
          return '--'
      }
    },
  },
}
</script >

<style lang = "less" scoped >
.advertiser-controler {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.dotted-line {
  width: 100%;
  border-top: 1px dashed #aaa;
  margin-bottom: 22px;
}

/deep/ .custom-select {
  width: 100%;
}
</style >
