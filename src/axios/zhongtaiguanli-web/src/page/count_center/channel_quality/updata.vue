<template>
  <div class="page">
    <el-alert class="alert" type="warning" title="上传相同时间的表格会覆盖之前填写的数据" show-icon></el-alert>
    <el-row>
      <el-col :lg="12" :xs="24">
        <div class="upload-wrap">
          <div>
            <el-button type="primary" icon="el-icon-download" @click="onDown">下载模板</el-button>
          </div>
          <div>
            <el-upload
              ref="excel"
              name="excel"
              class="upload-demo"
              :data="uploadData"
              :limit="1"
              :auto-upload="false"
              :on-change="onChange"
              :on-success="onSuccess"
              :on-error="onError"
              :action="server_root + 'File/uploadAlgorithmData'"
              accept=".xls, .xlsx"
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击这里</em>
              </div>
            </el-upload>
          </div>
          <div>
            <el-button
              type="primary"
              icon="el-icon-upload"
              :loading="loading"
              :disabled="!Object.keys(file).length"
              @click="onUpload"
            >{{ loading ? "上传中" : "确认上传" }}</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="addData">
      <el-table :data="tableData" style="width: 500px" border class="table">
        <el-table-column label="名称" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.index_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数值" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.algorithm_type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">新增数据</el-button>
      <el-dialog
        title="新增手动上传数据"
        :visible.sync="dialogVisible"
        width="30%"
        center
        :modal-append-to-body="true"
      >
        <div class="container">
          <el-input v-model="input" placeholder="请输入内容"></el-input>
          <div class="radio-wrap">
            <el-radio v-model="radio" label="0">数值越大越好</el-radio>
            <el-radio v-model="radio" label="1">数值越小越好</el-radio>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="plusData">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import store from 'store2'
import { mapState, mapActions } from 'vuex'
import download from '@/util/download'
import {
  Quantity_Statistics_createQuantity,
  Quantity_Statistics_diyList,
  Quantity_Statistics_deleteQuantity,
} from '@/config/api/index'

export default {
  data() {
    return {
      server_root: process.env.VUE_APP_PROXY,
      file: {},
      uploadData: {
        appId: this.$route.query.appId,
        loginId: store.get('user')['id'],
        loginToken: store.get('loginToken'),
      },
      tableData: [],
      dialogVisible: false,
      input: '',
      radio: '1',
    }
  },
  created() {
    this.getDiyList()
  },
  computed: {
    ...mapState({
      loading: (state) => state.upload.loading,
      app: (state) => state.app.data,
    }),
  },
  methods: {
    ...mapActions(['getUpload']),
    onDown() {
      download(
        'https://zhongtai-obs.obs.cn-southwest-2.myhuaweicloud.com//%E4%B8%AD%E5%8F%B0%E6%B8%A0%E9%81%93%E8%B4%A8%E9%87%8F%E6%95%B0%E6%8D%AE%E4%B8%8A%E4%BC%A0%E6%A8%A1%E6%9D%BF.xlsx?%0A'
      )
    },
    onChange(file) {
      this.file = file
    },
    onUpload() {
      this.$refs.excel.submit()
    },
    onSuccess(res) {
      let message = res.msg
      if (res.code != 0) {
        this.$refs.excel.clearFiles()
        this.$message({
          showClose: true,
          message: message,
          type: 'success',
        })
      } else {
        this.$message({
          showClose: true,
          message: message,
          type: 'error',
        })
      }
    },
    onError() {
      this.$message({
        showClose: true,
        message: '上传失败',
        type: 'error',
      })
    },
    getDiyList() {
      Quantity_Statistics_diyList().then((res) => {
        let data = JSON.stringify(res[1]) == '{}' ? [] : res[1]
        data.forEach((item) => {
          switch (item.algorithm_type) {
            case '0':
              item.algorithm_type = '越大越好'
              break
            case '1':
              item.algorithm_type = '越小越好'
              break
          }
        })
        this.tableData = data
        this.dialogVisible = false
      })
    },
    handleDelete(index, { id }) {
      this.$confirm('确认删除？')
        .then(() => {
          Quantity_Statistics_deleteQuantity({
            quality_index_id: id,
          }).then((res) => {
            if (res[2] == 1) {
              this.getDiyList()
              this.$message({
                message: '删除成功',
                type: 'success',
              })
            } else {
              this.$message.error(res[0])
            }
          })
        })
        .catch(() => {})
    },
    plusData() {
      Quantity_Statistics_createQuantity({
        index_name: this.input,
        algorithm_type: this.radio,
      }).then((res) => {
        if (res[2] == 1) {
          this.getDiyList()
          this.$message({
            message: '添加成功',
            type: 'success',
          })
        } else {
          this.$message.error(res[0])
        }
      })
    },
  },
  watch: {
    dialogVisible(newval) {
      if (!newval) {
        this.input = ''
        this.radio = '1'
      }
    },
  },
}
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 80px 20px 50px;
  position: relative;

  .alert {
    position: absolute;
    left: 0;
    top: 0;
  }

  .upload-wrap {
    > div {
      margin-top: 20px;
    }
  }

  .edit-form {
    .el-select {
      width: 100%;
    }
  }

  .addData {
    margin-top: 50px;

    .table {
      margin-bottom: 20px;
    }

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;

      .el-input {
        width: 180px;
      }

      .radio-wrap {
        height: 50px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-top: 20px;
      }
    }
  }
}
</style>