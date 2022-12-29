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
              :action="server_root + 'File/uploadAppAds'"
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
            >{{ loading ? '上传中' : '确认上传' }}</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import store from 'store2'

import { mapState, mapActions } from 'vuex'
import download from '@/util/download'

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
    }
  },
  mounted() {},
  computed: {
    ...mapState({
      loading: (state) => state.upload.loading
    })
  },
  methods: {
    ...mapActions(['getUpload']),
    onDown() {
      download(
        'https://zhongtai-obs.obs.cn-southwest-2.myhuaweicloud.com//%E4%B8%AD%E5%8F%B0%E6%95%B0%E6%8D%AE%E6%94%B6%E5%85%A5%E4%B8%8A%E4%BC%A0%E6%A8%A1%E6%9D%BF.xlsx?'
      )
    },
    onChange(file) {
      this.file = file
    },
    onUpload() {
      this.$refs.excel.submit()
    },
    onSuccess() {
      this.$refs.excel.clearFiles()
      this.$message({
        showClose: true,
        message: '上传成功',
        type: 'success',
        duration: 0,
      })
    },
    onError() {
      this.$message({
        showClose: true,
        message: '上传失败',
        type: 'error',
        duration: 0,
      })
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
}
</style>