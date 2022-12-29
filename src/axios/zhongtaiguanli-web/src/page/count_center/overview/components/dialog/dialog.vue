<template>
  <div class="dialog">
    <el-dialog title="基础数据概览设置" :visible.sync="dialogVisible" width="50%">
      <div class="checkbox-list" v-loading="loading">
        <div class="checkbox-item" v-for="(item, index) in form.children" :key="index">
          <p class="title">{{item.basename}}</p>
          <el-checkbox-group v-model="setting_ids" @change="boxChange" :ref="item.basename">
            <el-checkbox
              :label="chekItem.id"
              v-for="chekItem in item.children"
              :key="chekItem.id"
            >{{chekItem.basename}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <p slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm" class="dialogCloseBtn">确 定</el-button>
      </p>
    </el-dialog>
  </div>
</template>

<script>
const SELECTED = 1
import {
  Dashboard_dashboardSetting,
  Dashboard_saveBoardSetting,
} from '@/config/api/index'
export default {
  data() {
    return {
      setting_ids: [],
      form: {},
      pid: '',
      count: 1,
      dialogVisible: false,
      loading: false,
    }
  },
  methods: {
    confirm() {
      if(this.count === 0){
        this.$confirm("请至少选择一个",{
            type:'warning'}).then(()=>{
            }).catch(()=>{
            })
        return 
      }
      if (!this.loading) {
        let setting_ids = this.setting_ids.join(',');
        Dashboard_saveBoardSetting({ pid: this.pid, setting_ids }).then(
          (res) => {
            if (res[2] === 1) {
              this.$message({
                message: res[3],
                type: 'success',
              })
              this.$emit('onChange')
              this.dialogVisible = false
            } else {
              this.$message({
                message: res[0],
                type: 'error',
              })
            }
          }
        )
      }
    },
    boxChange(value) {
      this.count = 0;
      let elArr = [];
      if(this.$refs["逐日更新数据"]){
        elArr = this.$refs["逐日更新数据"][0].$el.children
      }else if(this.$refs["逐时更新数据"]){
        elArr =this.$refs["逐时更新数据"][0].$el.children ;
      }
      for (let index = 0; index < elArr.length; index++) {
        if(elArr[index].className.indexOf('is-checked') !== -1){
          this.count++;
        }
      }
    }
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.loading = !this.loading
        Dashboard_dashboardSetting({ pid: this.pid }).then((res) => {
          if (res[2] === 1) {
            let setting_ids = []
            res[1].children.forEach((item) => {
              item.children.forEach(({ clicked, id }) => {
                if (clicked == SELECTED) {
                  setting_ids.push(id)
                }
              })
            })
            this.form = res[1]
            this.setting_ids = setting_ids
            this.loading = !this.loading
          }
        })
      } else {
        this.setting_ids = []
      }
    },
  },
}
</script>

<style lang='scss' scoped>
.dialog {
  .dialogCloseBtn {
    background: #f19222;
    border-color: #f19222;
  }
}

/deep/ .el-checkbox-group {
  .el-checkbox__inner:hover {
    border-color: #f19222;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #ff981f;
    border-color: #ff981f;
  }
  .el-checkbox__label {
    color: #5a5c60;
  }
  .el-checkbox {
    margin-bottom: 15px;
  }
}

/deep/ .el-loading-spinner .path {
  stroke: #f99629;
}
</style>