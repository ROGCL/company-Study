<template>
  <div class="material">
    <div style="width:400px;">
      <h2 class="title">上下滑动大图样式</h2>
      <p class="label">背景图片 670*800</p>
      <el-upload
        class="avatar-uploader"
        action="#"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <p class="label">引导文案</p>
      <el-input v-model="form.tiny_title" placeholder="建议5字左右，例：大家都在看、00后都在玩。"></el-input>
      <p class="label">介绍文字</p>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="单行不超过12个全角字符。推荐双行，不超过三行。支持回车换行。"
        v-model="form.description"
      ></el-input>
      <p class="label">AppIcon 64*64</p>
      <el-upload
        class="avatar-uploader"
        action="#"
        :show-file-list="false"
        :before-upload="iconBeforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <p class="label">应用名称</p>
      <el-input v-model="form.app_name" placeholder="应用名称，不需要副标题"></el-input>
      <p class="label">应用一句话介绍</p>
      <el-input v-model="form.app_description" placeholder="应用一句话介绍，不超过16字，尽量简短。"></el-input>
      <div style="margin-top:10px;">
        <el-radio v-model="form.font_color" label="1">深色字体</el-radio>
        <el-radio v-model="form.font_color" label="2">浅色字体</el-radio>
      </div>
      <h2 class="title">跳转配置</h2>
      <p class="label">安卓包名</p>
      <el-input
        v-model="form.jump_url"
        placeholder="https://org.modao.cc/app/design/p70412F69921559615775004"
      ></el-input>
      <p class="label">AppStore（Bundle ID）</p>
      <el-input v-model="form.bundle_id" placeholder="com.nineton.weatherforecast"></el-input>
      <h2 class="title">应用分发信息明示</h2>
      <p class="label">隐私政策（链接）</p>
      <el-input v-model="form.privacy_policy" placeholder="APP隐私政策的web链接"></el-input>
      <p class="label">开发者信息</p>
      <el-input v-model="form.develop_info" placeholder="与应用市场内开发者信息一致"></el-input>
      <p class="label">应用权限</p>
      <el-upload
        class="upload-demo"
        drag
        ref="excel"
        name="excel"
        :data="form"
        :action="server_root"
        :limit="1"
        :file-list="fileList"
        :auto-upload="false"
        :on-success="onSuccess"
        :on-error="onError"
        :on-remove="onRemove"
        :on-change="onChange"
        accept=".xls, .xlsx"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
      <div class="down-tips">
        只能上传Excel文件
        <el-button type="primary" @click="onDown">下载模板</el-button>
      </div>
      <el-button type="primary" style="margin-top: 20px;" @click="save">保存</el-button>
    </div>
    <div class="preview">
      <h2>预览</h2>
      <div
        class="container dark"
        :class="styleSwitch"
        :style="{ 'backgroundImage':'url('+ pre_back_image +')' }"
      >
        <p class="title">{{form.tiny_title}}</p>
        <p class="desc" v-html="reviewDescription"></p>
        <div class="ft">
          <div class="app-info">
            <div class="appIcon" :style="{ 'backgroundImage':'url('+ pre_icon +')' }"></div>
            <div class="center">
              <p class="appName">{{form.app_name}}</p>
              <p class="appDesc">{{form.app_description}}</p>
            </div>
            <p class="download">安装</p>
          </div>
          <div
            class="company-info"
            :style="{color: form.font_color == 1 ? 'rgba(0,0,0,.5)':'rgba(255,255,255,.5)'}"
          >
            <div
              class="company"
            >开发者：{{form.develop_info}}&nbsp;&nbsp;&nbsp;&nbsp;版本号：{{form.app_version}}</div>
            <div class="secrets">隐私政策&nbsp;&nbsp;&nbsp;&nbsp;应用权限</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from 'store2'
import {
  Transaction_Program_save,
  Transaction_Program_show,
} from '@/config/api/index'
import download from '@/util/download'

export default {
  props: {
    downApi: {
      type: String,
      default:
        'https://zhongtai-obs.obs.cn-southwest-2.myhuaweicloud.com//app%E5%BA%94%E7%94%A8%E6%9D%83%E9%99%90.xlsx',
    },
  },
  data() {
    return {
      server_root: process.env.VUE_APP_PROXY_KEY + '/Transaction_Program/save',
      hasFile: false,
      imageUrl: '',
      form: {
        back_image: '',
        tiny_title: '',
        description: '',
        icon: '',
        app_name: '',
        app_description: '',
        jump_url: '',
        bundle_id: '',
        font_color: '1',
        privacy_policy: '',
        develop_info: '',
        excel: '',
      },
      pre_back_image: '',
      pre_icon: '',
      fileList: [],
    }
  },
  created() {
    this.getTransaction_Program_show()
  },
  methods: {
    beforeAvatarUpload(file) {
      let param = new FormData()
      param.append('image_file', file)
      const appId = this.$route.query.appId
      const { loginToken = '', user = {} } = store.getAll()
      param.append('loginToken', loginToken)
      param.append('appId', appId)
      param.append('loginId', user.id)
      param.append('dir', 'transactionProgram')
      var xhr = new XMLHttpRequest()
      xhr.open('POST', `${process.env.VUE_APP_PROXY}File/uploadImage`)
      xhr.send(param)
      let _this = this

      xhr.onload = function (e) {
        let { data } = JSON.parse(e.currentTarget.response)
        let { file_path, url } = data
        _this.pre_back_image = url
        _this.form.back_image = file_path
      }
    },
    iconBeforeAvatarUpload(file) {
      let param = new FormData()
      param.append('image_file', file)
      const appId = this.$route.query.appId
      const { loginToken = '', user = {} } = store.getAll()
      param.append('loginToken', loginToken)
      param.append('appId', appId)
      param.append('loginId', user.id)
      param.append('dir', 'transactionProgram')
      var xhr = new XMLHttpRequest()
      xhr.open('POST', `${process.env.VUE_APP_PROXY}File/uploadImage`)
      xhr.send(param)
      let _this = this

      xhr.onload = function (e) {
        let { data } = JSON.parse(e.currentTarget.response)
        let { file_path, url } = data
        _this.pre_icon = url
        _this.form.icon = file_path
      }
    },
    backgroundOnChange({ raw, url }) {
      document.querySelector(
        '.background .el-upload--picture-card'
      ).style.display = 'none'
      this.form.back_image = raw
      this.pre_back_image = url
    },
    iconOnChange({ raw, url }) {
      document.querySelector(
        '.appIcon .el-upload--picture-card'
      ).style.display = 'none'
      this.form.icon = raw
      this.pre_icon = url
    },
    getTransaction_Program_show() {
      Transaction_Program_show().then((res) => {
        this.form = res[1]
        this.pre_back_image = res[1].back_image
        this.pre_icon = res[1].icon
        let url =
          'https://zhongtai-obs.obs.cn-southwest-2.myhuaweicloud.com:443/'
        this.pre_back_image = url + res[1].back_image
        this.pre_icon = url + res[1].icon
      })
    },
    save() {
      if (this.hasFile) {
        this.form.appId = this.$route.query.appId
        this.form.loginId = store.get('user')['id']
        this.form.loginToken = store.get('loginToken')
        this.$refs.excel.submit()
      } else {
        delete this.$data.form.app_version
        for (let i in this.$data.form) {
          if (!this.$data.form[i] && i != 'bundle_id') {
            this.$message({
              message: '请填写完整',
              type: 'warning',
            })
            return
          }
        }
        Transaction_Program_save(this.$data.form).then((res) => {
          if (res[2] == 1) {
            this.$message({
              message: '保存成功',
              type: 'success',
            })
          }
        })
      }
    },
    onSuccess({ code, msg }) {
      this.$refs.excel.clearFiles()
      if (code == 1) {
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
      this.hasFile = false
      this.$refs.excel.clearFiles()
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
    onChange(file, list) {
      this.hasFile = list.length === 0 ? false : true
    },
    onRemove() {
      this.hasFile = false
    },
  },
  computed: {
    styleSwitch() {
      return this.form.font_color == '1' ? 'drak' : 'light'
    },
    reviewDescription() {
      if (this.form.description) {
        this.form.description = this.form.description.replace(/\n/g, '<br/>')
        return this.form.description.replace(/\n/g, '<br/>')
      }
    },
  },
}
</script>

<style lang='scss' scoped>
.material {
  padding: 20px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
}

.preview {
  * {
    margin: 0;
  }
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  .container {
    width: 335px;
    height: 400px;
    border-radius: 15px;
    background: url('') no-repeat left top / 100% 100%;
    background-color: #ebeef5;
    padding: 20px 0 0 20px;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    .title {
      font-size: 14px;
    }
    .desc {
      flex: 1;
      margin-top: 7px;
      width: 216px;
      font-size: 24px;
    }
    .ft {
      padding: 15px 20px;
      margin-left: -20px;
      .app-info {
        display: flex;
        align-items: center;
        position: relative;
        z-index: 1;
        background-color: rgba(255, 255, 255, 0.2);
      }
      .company-info {
        margin: 10px 0 0 -73.75px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 442.5px;
        font-size: 12px;
        transform: scale(0.667);
      }
      &::after {
        position: absolute;
        content: '';
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: -1;
        backdrop-filter: blur(20px);
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
      }
      .appIcon {
        width: 64px;
        height: 64px;
        background: url('') no-repeat left top / cover;
        background-color: #dcdfe6;
        border-radius: 15px;
      }
      .center {
        flex: 1;
        margin-left: 10px;
        .appName {
          font-size: 16px;
        }
        .appDesc {
          font-size: 12px;
          margin-top: 3px;
        }
      }
      .download {
        width: 60px;
        line-height: 30px;
        background: rgba(255, 255, 255, 1);
        border-radius: 15px;
        border: 1px solid rgba(21, 110, 223, 1);
        text-align: center;
        font-size: 14px;
        color: rgba(21, 110, 223, 1);
        font-weight: bold;
      }
    }
  }
  .dark {
    .title {
      color: rgba(20, 20, 20, 0.8);
    }
    .desc {
      color: rgba(25, 25, 25, 1);
    }
    .ft {
      background: rgba(255, 255, 255, 0.2); // backdrop-filter: blur(20px);
    }
    .appName {
      color: #141414;
    }
    .appDesc {
      color: rgba(20, 20, 20, 0.8);
    }
  }
  .light {
    .title {
      color: rgba(255, 255, 255, 0.7);
    }
    .desc {
      color: #ffffff;
    }
    .ft {
      background-color: rgba(0, 0, 0, 0.2); // backdrop-filter: blur(20px);
    }
    .appName {
      color: #ffffff;
    }
    .appDesc {
      color: rgba(255, 255, 255, 0.7);
    }
  }
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.appIcon .el-upload {
  width: 64px;
  height: 64px;
  line-height: 64px;
}

.appIcon .el-upload-list__item {
  width: 64px;
  height: 64px;
}
.down-tips {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 360px;
  font-size: 12px;
}
</style>