<template>
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="6" :sm="12">
        <el-form-item label="操作时间">
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
      <el-col :md="6" :sm="12">
        <el-form-item label="操作人" prop="admin_id">
          <el-select v-model="searchForm.admin_id" placeholder="请选择" :clearable="true">
            <el-option
              v-for="item in OperationAdminList"
              :key="item.admin_id"
              :label="item.realname"
              :value="item.admin_id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="同步应用" prop="appid">
          <SelectApp v-model="searchForm.appid"></SelectApp>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="同步数据表" prop="synchronous_id">
          <el-select v-model="searchForm.synchronous_id" placeholder="请选择" :clearable="true">
            <el-option
              v-for="item in synchronousList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <template #btn-option>
        <el-button @click="onShowAdd" type="primary">数据同步</el-button>
      </template>
    </FilterLayout>
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      @sizeChange="onSizeChange"
      @pageChange="onPageChange"
    ></TableLayout>

    <el-dialog title="数据同步" :visible.sync="addVisible">
      <el-form ref="addForm" :model="addForm" label-width="150px">
        <el-form-item label="同步数据表" prop="synchronous_id">
          <el-select v-model="addForm.synchronous_id" placeholder="请选择">
            <el-option
              v-for="item in synchronousList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="同步应用" prop="appid">
          <SelectApp v-model="addForm.appid"></SelectApp>
        </el-form-item>
        <el-form-item label="同步时间范围" prop="time">
          <el-date-picker
            v-model="addForm.time"
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FilterLayout from '@/layout/form'
import TableLayout from '@/layout/table'
import store from 'store2'
import SelectApp from '@/component/select-apps'
import { pickerOptions } from '@/config/option'
export default {
  components: {
    FilterLayout,
    TableLayout,
    SelectApp,
  },
  data() {
    return {
      pickerOptions,
      searchForm: {
        admin_id: '',
        appid: [],
        synchronous_id: '',
        time: '',
      },
      addVisible: false,
      addForm: {
        synchronous_id: '',
        appid:[],
        time: '',
      },
      column: [
        {
          prop: 'create_time',
          label: '操作时间',
        },
        {
          prop: 'realname',
          label: '操作人',
        },
        {
          prop: 'appid',
          label: '同步应用',
        },
        {
          prop: 'synchronous_id',
          label: '同步数据表',
        },
        {
          prop: 'synchronous_time',
          label: '同步时间范围',
          width: '120px',
        },
      ],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        currentPage: 1,
        pageSize: 10,
      },
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      synchronousList: [],
      OperationAdminList: [],
    }
  },
  mounted() {
    this.fetchData()
    this.getsynchronous()
    this.getOperationAdminList()
  },
  methods: {
    async fetchData() {
      const { searchForm } = this
      const [err, res] = await this.$http.post('data_synchronization/index', {
        appid: this.searchForm.appid.toString(),
        synchronous_id: this.searchForm.synchronous_id,
        admin_id: this.searchForm.admin_id,
        timeBegin:searchForm['time']?searchForm['time'][0]:'',
        timeEnd: searchForm['time']?searchForm['time'][1]:'',
        ...this.tableOpt
      })

      if (err) {
        return
      }
      const { list, currentPage, total } = res
      this.tableData.data = list
      this.tableData.currentPage = currentPage
      this.tableData.total = total
    },
    async getsynchronous() {
      const [err, res] = await this.$http.post(
        'data_synchronization/getOperationList',
        {
          loginId: store.get('user')['id'],
          loginToken: store.get('loginToken'),
        }
      )
      if (err) {
        return
      }
      this.synchronousList = res
    },
    async getOperationAdminList() {
      const [err, res] = await this.$http.post(
        'data_synchronization/getOperationAdminList',
        {
          loginId: store.get('user')['id'],
          loginToken: store.get('loginToken'),
        }
      )
      if (err) {
        return
      }
      console.log(res);
      this.OperationAdminList = res
    },
    onAdd() {
      this.$refs['addForm'].validate(async (valid, data) => {
        if (!valid) {
          return false
        }

        const [err, res] = await this.$http.post(
          'data_synchronization/synchronization',
          {
            timeBegin: this.addForm['time'][0],
            timeEnd: this.addForm['time'][1],
            appid: this.addForm.appid.toString(),
            synchronous_id: this.addForm.synchronous_id,
          }
        )

        if (err) return

        this.$message({
          message: '同步成功',
          type: 'success',
        })

        this.addVisible = false
        this.fetchData()
      })
    },
    onShowAdd() {
      this.addVisible = true
      this.edit = false
      this.$refs['addForm'] && this.$refs['addForm'].resetFields()
    },
    onSubmit(res) {
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
  },
}
</script>

<style lang="less" scoped>
</style>
