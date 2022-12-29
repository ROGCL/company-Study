<template >
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="广告计划ID" prop="ad_id">
          <el-input v-model="searchForm.ad_id" placeholder="搜索广告计划ID" />
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="App名称" prop="app_id">
          <!-- <SelectApp v-model="searchForm.app_id"></SelectApp> -->
           <SelectCustomize :value="searchForm.app_id" :data="apps" />
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="广告平台" prop="platform">
          <el-select
            v-model="searchForm.platform"
            filterable
            clearable
            :popper-append-to-body="false"
            placeholder="请选择"
          >
            <el-option v-for="item in platform" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="是否正在投放" prop="time_delete">
          <el-radio-group v-model="searchForm.time_delete">
            <el-radio-button v-for="(v, i) in putOption" :key="i" :label="v.value">{{v.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      @pageChange="onPageChange"
      @sizeChange="onSizeChange"
    >
      <template #table-option>
        <el-button type="primary" icon="el-icon-plus" @click="showCreateForm=true">新增</el-button>
      </template>
      <template #system="row">{{ row.row.system | formatSystem }}</template>
      <template #time_add="row">{{ $moment(row.row.time_add).format('YYYY-MM-DD') }}</template>
      <template #time_delete="row">
        <el-button type="text" @click="onChangeStatus(row.row.id)">
          <span
            :style="{color: row.row.time_delete === 2 ? '#f78989' : '#1890ff'}"
          >{{ formatPut(row.row.time_delete) }}</span>
        </el-button>
      </template>
    </TableLayout>
    <el-dialog title="手动新增投放计划" :visible.sync="showCreateForm">
      <div class="advertiser-controler">
        <el-radio-group v-model="isNewAdvertiser">
          <el-radio-button :label="1">已有广告主</el-radio-button>
          <el-radio-button :label="0">新广告主</el-radio-button>
        </el-radio-group>
      </div>
      <el-form
        ref="createForm"
        :model="createForm"
        label-width="140px"
        :rules="rules"
        class="custom-form"
      >
        <el-form-item label="选择App" required prop="app_id">
          <el-select
            class="custom-select"
            v-model.lazy="createForm.app_id"
            filterable
            :popper-append-to-body="false"
            placeholder="请选择App"
            @change="onSpecialChange($event, 'app_id')"
          >
            <el-option
              v-for="item in App"
              :key="item.id"
              :label="item.system | formatSystem(item.title)"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告平台" required prop="platform">
          <el-select
            class="custom-select"
            v-model.lazy="createForm.platform"
            filterable
            :popper-append-to-body="false"
            placeholder="请选择"
            @change="onSpecialChange($event, 'platform')"
          >
            <el-option v-for="item in platform" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户名以及渠道号" required prop="account_name" v-if="isNewAdvertiser === 1">
          <el-select
            class="custom-select"
            v-model="createForm.account_name"
            filterable
            :popper-append-to-body="false"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, i) in accountList"
              :key="'acount' + i"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <template v-if="isNewAdvertiser === 0">
          <el-form-item label="账户名称" prop="new_account_name">
            <el-input
              v-model="createForm.new_account_name"
              autocomplete="off"
              placeholder="可能叫广告主名称或账户名称，用于辨识"
            ></el-input>
          </el-form-item>
          <el-form-item label="渠道号" prop="channel">
            <el-input v-model="createForm.channel" autocomplete="off" placeholder="需要与该账户下投放的渠道一致"></el-input>
          </el-form-item>
          <el-form-item label="广告主ID" prop="account_id">
            <el-input v-model="createForm.account_id" autocomplete="off" placeholder="该广告主/账户的ID"></el-input>
          </el-form-item>
          <el-form-item label="收款户名" prop="proceeds_user">
            <el-input
              v-model="createForm.proceeds_user"
              autocomplete="off"
              placeholder="输入打款给代理公司的公司名称"
            ></el-input>
          </el-form-item>
        </template>
        <div class="dotted-line"></div>
        <el-form-item label="计划名称" prop="ad_name">
          <el-input v-model="createForm.ad_name" autocomplete="off" placeholder="需要与监测的计划名称一致，方便辨识"></el-input>
        </el-form-item>
        <el-form-item label="计划ID" required prop="ad_id">
          <el-input v-model="createForm.ad_id" autocomplete="off" placeholder="需要监测的广告计划ID"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showCreateForm = false">取 消</el-button>
        <el-button type="primary" @click="onCreate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template >

<script >
import FilterLayout from '@/layout/form'
import TableLayout from '@/layout/table'
import SelectApp from '@/component/select-app'
import { mapState } from 'vuex'
import store from "store2";
import SelectCustomize from "@/component/select-customize";

export default {
  name: 'home',
  components: {
    FilterLayout,
    TableLayout,
    SelectApp,
    SelectCustomize
  },
  computed: {
    ...mapState({
      App: (state) => state.app.data,
    }),
  },
  data() {
    return {
      searchForm: {
        ad_id: '',
        app_id: {
          appInfo: []
        },
        platform: '',
        time_delete: '',
        cate: 0,
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
          prop: 'time_add',
          label: '新增日期',
        },
        {
          prop: 'appid',
          label: 'APPID',
        },
        {
          prop: 'system',
          label: '系统',
        },
        {
          prop: 'title',
          label: 'APP名称',
        },
        {
          prop: 'account_name',
          label: '账户名以及渠道号',
        },
        {
          prop: 'account_id',
          label: '广告主ID',
        },
        {
          prop: 'proceeds_user',
          label: '收款户名',
        },
        {
          prop: 'platform',
          label: '广告平台名称',
        },
        {
          prop: 'ad_name',
          label: '计划名称',
        },
        {
          prop: 'ad_id',
          label: '广告计划ID',
        },
        {
          prop: 'time_delete',
          label: '是否正在投放',
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
      showCreateForm: false,
      platform: [],
      accountList: [],
      createForm: {
        app_id: '',
        platform: '',
        account_name: '',
        new_account_name: '',
        channel: '',
        account_id: '',
        proceeds_user: '',
        ad_name: '',
        ad_id: '',
      },
      rules: {
        app_id: [{ required: true, message: '请选择APP' }],
        platform: [{ required: true, message: '请选择平台' }],
        new_account_name: [{ required: true, message: '请选择账户' }],
        account_name: [{ required: true, message: '请选择账户' }],
        channel: [{ required: true, message: '请输入渠道号' }],
        account_id: [{ required: true, message: '请输入广告主ID' }],
        proceeds_user: [{ required: true, message: '请输入收款户名' }],
        ad_name: [{ required: true, message: '请输入计划名称' }],
        ad_id: [{ required: true, message: '请输入计划ID' }],
      },
      isNewAdvertiser: 1,
      apps:[]
    }
  },
  mounted() {
    this.fetchPlatform()
    this.fetchAccount()
    this.fetchData()
    this.getRoleBtree()  // 获取应用和项目
  },
  methods: {
    // 获取筛选项表单数据
    async getRoleBtree() {
        const [err, res] = await this.$http.post("System/roleBtree", {
            loginId: store.get("user")["id"],
            loginToken: store.get("loginToken"),
        });
        if (err) return;
        let apps = [];
        let article_id_arr = [];
        res.list.forEach((item) => {
            if (item.title == '项目') {
                article_id_arr = item.node
            }
            if (item.title == "应用") {
                item.node.forEach((_item) => {
                    if (_item.system == "1") {
                        _item.title = _item.title + "_Android";
                    } else if (_item.system == "2") {
                        _item.title = _item.title + "_IOS";
                    } else if (_item.system == "3") {
                        _item.title = _item.title + "_微信小程序";
                    }
                });
                apps = item.node
            }
        });
        // this.apps_default = apps;
        this.apps = apps;
        // this.article_id = article_id_arr;
    },
    onSpecialChange(val, key) {
      this.searchForm[key] = val

      this.fetchAccount()
    },
    async fetchPlatform() {
      const [err, res] = await this.$http.post('Invest_Config/get')

      if (err) return

      this.platform = res
    },
    async fetchAccount() {
      const { searchForm, isNewAdvertiser } = this

      if (isNewAdvertiser === 0) return

      const [err, res] = await this.$http.post('Invest_Config/getNotApi', {
        app_id: searchForm.app_id.appInfo,
        platform: searchForm.platform,
      })

      if (err) return

      this.accountList = res
    },
    async fetchData() {
      const { searchForm, tableOpt } = this

      this.tableData.loading = true

      const [err, res] = await this.$http.post('Invest_Config/index', {
        ...searchForm,
        ...tableOpt,
        app_id:this.searchForm.app_id.appInfo
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
    async onChangeStatus(id) {
      const [err, res] = await this.$http.post('Invest_Config/isDel', {
        id,
      })

      if (err) {
        this.$message.error('修改失败')

        return
      }

      this.$message.success('修改成功')

      this.fetchData()
    },
    onCreate() {
      this.$refs['createForm'].validate(async (valid, data) => {
        if (!valid) return false

        const [err, res] = await this.$http.post('Invest_Config/save', {
          ...this.createForm,
          acount_id: '',
        })

        if (err) {
          this.$message.error('新增失败')

          return
        }

        this.$message.success('新增成功')

        this.showCreateForm = false
        this.fetchData()
      })
    },
    formatPut(code) {
      switch (String(code)) {
        case '':
          return '全部'
        case '1':
          return '是'
        case '2':
          return '否'
        default:
          return '未知'
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
