<template>
  <div class="Administration">
    <div class="filter-custom">
      <el-form inline>
        <filterapp v-bind:appId.sync="form.appId" optionAll />
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add.dialogVisible = true">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-custom" v-loading="tableLoading">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="system" label="系统" width="100"></el-table-column>
        <el-table-column prop="app_title" label="App名称"></el-table-column>
        <el-table-column prop="title" label="收入渠道"></el-table-column>
        <el-table-column fixed="right" label="编辑" width="50">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleClick(scope.row)"
              :style="{color: scope.row.color}"
            >{{ scope.row.show }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="dialog">
      <el-dialog title="新增收入渠道" :visible.sync="add.dialogVisible" width="30%">
        <el-form>
          <filterapp v-bind:appId.sync="add.form.appId" label="筛选App" />
          <el-form-item label="类型">
            <el-radio v-model="add.form.edit" label="1" @change="add.form.title = ''">手动上传</el-radio>
            <el-radio v-model="add.form.edit" label="2" @change="add.form.title = ''">自动拉取</el-radio>
          </el-form-item>
          <el-form-item label="渠道名称">
            <el-input
              v-model="add.form.title"
              style="width:232px"
              placeholder="请输入内容"
              v-if="add.form.edit == '1'"
            ></el-input>
            <el-select v-model="add.form.title" placeholder="请选择" style="width:232px" v-else>
              <el-option
                v-for="item in add.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="add.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  income_incomeChannelList,
  income_storeIncomeChannel,
  income_updateChannelShow,
} from '@/config/api/index'
import filterapp from '../../../component/filterapp/filterapp'
export default {
  data() {
    return {
      form: {
        appId: '',
      },
      add: {
        form: {
          appId: '',
          edit: '1',
          title: '',
        },
        options: [
          {
            value: '广点通',
            label: '广点通',
          },
          {
            value: '穿山甲',
            label: '穿山甲',
          },
        ],
        dialogVisible: false,
      },
      Apps: [],
      currentAppIcon: '',
      timeDimension: [
        {
          value: '1',
          label: '天',
        },
      ],
      tableData: [],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      income_incomeChannelList(this.form).then((res) => {
        let { list = [] } = res[1]
        this.tableData = list.map((item) => {
          return {
            ...item,
            show: item.show == 0 ? '隐藏' : '显示',
            color: item.show == 0 ? 'red' : '',
          }
        })
        this.tableLoading = false
      })
    },
    search() {
      this.getList()
    },
    addSubmit() {
      var pattern = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/
      if (!pattern.test(this.add.form.title)) {
        this.$message.error('只能输入汉字、英文、数字')
        return
      }
      income_storeIncomeChannel(this.add.form).then((res) => {
        if (res[2] == 1) {
          this.$message({
            message: res[3],
            type: 'success',
          })
          this.getList()
          this.add.dialogVisible = false
        } else {
          this.$message.error(res[0])
        }
      })
    },
    handleClick({ id, edit, appid }) {
      // 不能编辑
      if (edit == 0) {
        this.$message({
          message: '不能编辑系统默认的渠道',
          type: 'warning',
        })
        return
      }
      income_updateChannelShow({ id, appId: appid }).then((res) => {
        if (res[2] == 1) {
          this.$message({
            type: 'success',
            message: res[3],
          })
          this.getList()
        } else {
          this.$message.error(res[0])
        }
      })
    },
    change(appId) {
      this.currentAppIcon = this.Apps.filter(
        ({ value }) => appId == value
      )[0].icon
    },
  },
  components: {
    filterapp,
  },
}
</script>

<style lang='scss' scoped>
</style>