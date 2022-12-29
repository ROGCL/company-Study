<template>
  <div class="dialog">
    <el-dialog title="新增支出渠道" :visible.sync="dialogVisible" width="30%" @close="edit = false">
      <el-form label-position="left">
        <filterapp v-bind:appId.sync="form.appId" label="筛选App" :disabled="edit" />
        <el-form-item label="选择分类">
          <el-select
            v-model="form.classify_id"
            placeholder="请选择"
            filterable
            style="width:232px"
            :disabled="edit"
          >
            <el-option
              v-for="item in classifyOps"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台名称">
          <el-select
            v-model="form.invest_channel_id"
            placeholder="请选择"
            filterable
            style="width:232px"
            :disabled="edit"
          >
            <el-option
              v-for="item in channelOps"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠 道 号" style="margin-left:6px;">
          <el-select
            v-model="form.channels"
            multiple
            placeholder="点击选择渠道号（可多选）"
            filterable
            style="width:232px"
            v-loading="channelNumOpsLoading"
          >
            <el-option
              v-for="item in channels"
              :key="item.id"
              :label="item.title"
              :value="item.id"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  App_getChannel,
  Invest_Statistics_addInvestChannel,
  Invest_Statistics_classify,
  Invest_Statistics_invest_channels,
  Invest_Statistics_services_types,
  Invest_Statistics_store_invest_channel,
} from '@/config/api/index'
import filterapp from '../../../component/filterapp/filterapp'

export default {
  data() {
    return {
      edit: false,
      form: {
        appId: '',
        classify_id: '',
        invest_channel_id: '',
        channels: '',
      },
      classifyOps: [],
      channelOps: [],
      servicesOps: [],
      channelNumOps: [],
      dialogVisible: false,
      channelNumOpsLoading: true,
      editData: {},
      channelNumOpsNew: [],
    }
  },
  created() {
    this.getOpsList()
  },
  methods: {
    getOpsList() {
      Invest_Statistics_classify().then((res) => {
        this.classifyOps = res[1]
      })
      Invest_Statistics_invest_channels().then((res) => {
        this.channelOps = res[1]
      })
      Invest_Statistics_services_types().then((res) => {
        this.servicesOps = res[1]
      })
    },
    Submit() {
      this.form.channels = this.form.channels.join(',')
      if (this.edit) {
        let { id, appId, channels } = this.form
        let params = {
          id,
          appId,
          channels,
        }
        Invest_Statistics_addInvestChannel(params).then((res) => {
          if (res[2] == 1) {
            this.$message({
              message: res[3],
              type: 'success',
            })
            this.$emit('success')
            this.dialogVisible = false
            for (const key in this.form) {
              this.form[key] = ''
            }
          } else {
            this.$message.error(res[0])
            this.form.channels = this.form.channels.split(',')
          }
        })
      } else {
        Invest_Statistics_store_invest_channel(this.form).then((res) => {
          if (res[2] == 1) {
            this.$message({
              message: res[3],
              type: 'success',
            })
            this.$emit('success')
            this.dialogVisible = false
            for (const key in this.form) {
              this.form[key] = ''
            }
          } else {
            this.$message.error(res[0])
            this.form.channels = ''
          }
        })
      }
    },
  },
  watch: {
    'form.appId'(newValue) {
      if (!newValue) return
      App_getChannel({ appId: this.form.appId }).then((res) => {
        this.channelNumOps = res[1].map((item) => {
          return {
            title: item,
            id: item,
          }
        })
        this.channelNumOpsLoading = false
      })
    },
    edit(newValue) {
      if (newValue) {
        let { classify, invest_channel, id } = this.editData
        this.form.classify_id = classify
        this.form.invest_channel_id = invest_channel
        this.form.id = id
      }
    },
    channelNumOps(newValue) {
      if (!this.edit) return
      this.channelNumOpsNew = newValue.map((item) => {
        if (this.editData.channels.includes(item.title)) {
          return {
            ...item,
            disabled: true,
          }
        } else {
          return item
        }
      })
    },
  },
  computed: {
    channels() {
      return this.edit ? this.channelNumOpsNew : this.channelNumOps
    },
  },
  components: {
    filterapp,
  },
}
</script>

<style lang='scss' scoped>
</style>