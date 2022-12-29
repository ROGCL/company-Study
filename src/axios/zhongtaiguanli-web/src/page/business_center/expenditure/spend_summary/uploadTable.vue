<template>
  <div class="uploadTab">
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <el-alert
        class="alert"
        type="warning"
        style="margin-bottom: 10px;"
        title="上传相同时间的表格会覆盖之前填写的数据"
        show-icon
      ></el-alert>
      <el-upload
        class="excel"
        ref="excel"
        drag
        name="excel"
        :data="uploadParams"
        :action="server_root + uploadApi"
        :limit="1"
        :file-list="fileList"
        :auto-upload="false"
        accept=".xls, .xlsx, .docx"
        :on-success="onSuccess"
        :on-error="onError"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">支持扩展名：.xls .xlsx .docx</div>
      </el-upload>
      <div class="btns">
        <el-button type="primary" @click="onDown">下载模板</el-button>
        <el-button type="primary" @click="submit">上传投放支出数据</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from 'store2'
import download from '@/util/download'

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    downApi: {
      type: String,
      default: 'https://zhongtai-obs.obs.cn-southwest-2.myhuaweicloud.com//%E4%B8%AD%E5%8F%B0%E6%8A%95%E6%94%BE%E6%A8%A1%E6%9D%BF%20.xlsx',
    },
    uploadApi: {
      type: String,
      default: 'File/uploadV2',
    },
  },
  data() {
    return {
      dialogVisible: false,
      server_root: process.env.VUE_APP_PROXY,
      file: {},
      fileList: [],
      uploadParams: {
        appId: this.$route.query.appId,
        loginId: store.get('user')['id'],
        loginToken: store.get('loginToken'),
      },
    }
  },
  created() {
    if (this.value) {
      this.dialogVisible = true
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('input', val)
    },
  },
  methods: {
    submit() {
      this.$refs.excel.submit()
    },
    onSuccess({ code, msg }) {
      if (code == 1) {
        this.$refs.excel.clearFiles()
        this.$message({
          showClose: true,
          message: msg,
          type: 'success',
          duration: 0,
        })
        this.dialogVisible = false
        this.$emit('onSuccess')
      } else {
        this.$message({
          showClose: true,
          message: msg,
          type: 'error',
          duration: 0,
        })
      }
    },
    onError() {
      this.$message({
        showClose: true,
        message: '上传失败',
        type: 'error',
        duration: 0,
      })
    },
    onDown() {
      download(this.downApi)
    },
  },
}
</script>

<style lang='scss' scoped>
.btns {
  margin-top: 10px;
}
</style>