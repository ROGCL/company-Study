<template>
  <div>
    <controlComponents></controlComponents>
    <!-- 判断新增的是单节课还是系列课 -->
    <!-- 面包屑 -->
    <div class="ham">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/imporantPages' }"
          >课程管理</el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ path: '/addSingleClassPages' }"
          >新增单节课</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <!-- 单节课页面 -->
    <!-- <singleClassComponents></singleClassComponents> -->
    <div class="single">
      <!-- 内部盒子 -->
      <div class="banner-spared">
        <div class="video-source">
          <span class="point-public"></span>
          上传视频资源
        </div>
        <div class="source-image">
          <!-- <img src="" class="localUrl-img"> -->
          <el-upload
            v-loading="loading"
            class="upload-demo"
            drag
            :action="processUrl"
            :before-upload="beforeUploadVideo"
            :on-success="uploadVideoSuccess"
            :on-progress="uploadVideoProcess"
            :headers="headersData"
            :show-file-list="false"
            v-if="videoUrl == ''"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将MP4格式的文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
          <video
            :src="this.videoUrl"
            style="width: 360px; height: 180px"
            controls
            v-else
          ></video>
        </div>
        <div class="upload-replace1">
          <button class="up-btn">
            <span class="font icon-public"></span>更改
          </button>
        </div>
        <div class="title">
          <span class="point-public"></span>
          上传视频封面
        </div>
        <!-- 图片盒子 -->
        <div class="img-banner">
          <!-- <img src="" class="localUrl-img"> -->
          <el-upload
            class="upload-demo"
            drag
            :action="processUrl"
            :on-success="uploadImgSuccess"
            :before-upload="beforeUploadImg"
            :headers="headersData"
            :show-file-list="false"
            v-if="this.formList.course_cover_url == ''"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将视频封面图片拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
          <img
            :src="this.formList.course_cover_url"
            alt=""
            class="img-cover"
            v-else
          />
        </div>
        <!-- 下方文字描述区域 -->
        <h5>推荐图片尺寸 300*170px大小＜30M格式推荐 png、jpg</h5>
        <div class="upload-replace">
          <button class="up-btn">
            <span class="font icon-public"></span>更改
          </button>
        </div>
        <!-- 文本域 -->
        <div class="textarea">
          <span class="point-public"></span>
          标题
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="formList.title"
            maxlength="40"
            show-word-limit
            resize="none"
            cols="30"
            rows="4"
          >
          </el-input>
        </div>
        <!-- 类目选择 -->
        <div class="select-class select-public">
          <span class="point-public"></span>
          类目选择
          <el-select
            v-model="formList.cate"
            placeholder="请选择"
            class="el-select"
          >
            <el-option
              v-for="(item, index) in courseCate"
              :key="index"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
        </div>
        <!-- 推荐位选择 -->
        <div class="select-introduce select-public">
          <span class="point-public"></span>
          推荐位选择
          <el-select
            v-model="formList.posid"
            placeholder="请选择"
            class="el-select"
            clearable
          >
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <!-- 取消和保存按钮 -->
        <div class="del-save-btn">
          <router-link to="/imporantPages">
            <el-button>取消</el-button>
          </router-link>
          <el-button @click="submitFormList">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import singleClassComponents from '@/components/singleClass-components.vue';
import controlComponents from "@/components/control/control-components.vue";
export default {
  components: { controlComponents },
  data() {
    return {
      processUrl: `${process.env.VUE_APP_URL}/file/upload`,
      //推荐位
      options2: [
        {
          value: 1,
          label: "精品课程",
        },
      ],
      value2: "",
      // uploadImaUrl:`'http://172.168.11.229:9000/' + 'file/upload'`,
      loadingstate: false,
      formList: {
        course_cover_url: "",
        attribute: 1,
        title: "",
        cate: "",
        posid: "",
        series: [],
      },
      videoUrl: "",
      loading: false, //加载进度条字段
      // loginToken:"",
      courseCate: {}, //课程分类的数据
    };
  },
  mounted() {
    this.courseCate = JSON.parse(localStorage.getItem("courseCate"));
    console.log(this.processUrl, "888999");
  },
  methods: {
    //图片上传成功
    uploadImgSuccess(res, file) {
      console.log(res, "imgRes");
      console.log(file, "file");
      this.formList.course_cover_url = process.env.VUE_APP_URL + res.data.url;
    },
    //视频上传过程中的加载操作
    uploadVideoProcess(event, file, formList) {
      console.log(event, "视频上传中1");
      console.log(file, "视频上传中2");
      console.log(formList, "视频上传中3");
      console.log(file.status, "视频上传中response");
      this.loading = true;
    },
    //视频上传成功
    uploadVideoSuccess(res, file) {
      console.log(res, "视频上传成功");
      console.log(file);
      let obj = {
        blues_sort: 1,
        video_url: file.response.data.url,
        video_title: file.name,
        video_duration: file.response.data.time_log,
        video_file_name: file.response.data.name,
      };
      this.formList.series.push(obj);
      this.loading = false;
      this.videoUrl = process.env.VUE_APP_URL + res.data.url;
    },
    //上传之前校验文件格式
    beforeUploadImg(file) {
      this.loadingstate = true;
      let index = file.name.lastIndexOf(".");
      let extension = file.name.substr(index + 1);
      let extensionList = [
        "png",
        "PNG",
        "jpg",
        "JPG",
        "jpeg",
        "JPEG",
        "bmp",
        "BMP",
      ];
      let isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message({
          message: "封面不能超出10M",
          type: "warning",
          center: true,
        });

        return false;
      } else if (extensionList.indexOf(extension) < 0) {
        this.$message({
          message: "当前文件格式不支持",
          type: "error",
          center: true,
        });

        return false;
      }
    },
    //上传视频前的校验
    beforeUploadVideo(file) {
      this.loadingstate = true;
      let index = file.name.lastIndexOf(".");
      let extension = file.name.substr(index + 1);
      let extensionList = ["mp4"];
      if (extensionList.indexOf(extension) < 0) {
        this.$message.error("上传视频的格式应该为mp4格式");

        return false;
      }
    },
    //发送表单提交过程
    submitFormList() {
      this.$http
        .post("/course/add", {
          ...this.formList,
        })
        .then((res) => {
          if (res.data.message == "success") {
            this.$router.push("/imporantPages");
          } else {
            this.$message.warning(res.data.message);
          }
        });
    },
  },
  //计算属性这里是获取用户token，然后再发送请求时，加上用户的Authenticator进行发送请求
  computed: {
    //带上请求头用户的token，不然不生效果
    headersData() {
      let loginToken = sessionStorage.getItem("token");
      if (loginToken) {
        // 跳转登录
        return {
          Authenticator: loginToken,
        };
      }
      return false;
    },
  },
};
</script>

<style scoped>
.ham {
  position: absolute;
  left: 216px;
  top: 98px;
  height: 24px;
}
.single {
  margin-left: 216px;
  margin-top: 56px;
  /* width: 1688px; */
  height: 116vh;
  background: #fff;
}

.banner-spared {
  margin: 0 auto;
  width: 474px;
}
.video-source {
  margin-left: 60px;
  padding-top: 30px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #303133;
}
.title {
  margin-left: 57px;
  margin-top: 40px;
  width: 104px;
  height: 24px;
  font-size: 14px;
  color: #303133;
  line-height: 24px;
  text-align: center;
}
.point-public {
  display: inline-block;
  width: 4px;
  height: 4px;
  border: 1px solid #f56c6c;
  background: #f56c6c;
  border-radius: 50%;
}
.img-banner {
  margin-left: 57px;
  margin-top: 8px;
  width: 360px;
  height: 180px;
  border-radius: 4px;
}
.img-cover {
  width: 100%;
  height: 100%;
  margin-top: 8px;
  border-radius: 4px;
}
.source-image {
  width: 360px;
  height: 180px;
  margin-left: 57px;
  border-radius: 4px;
}
.banner-spared h5 {
  margin-left: 57px;
  margin-top: 8px;
  font-size: 12px;
  font-weight: normal;
  color: #606266;
}
.textarea {
  margin-left: 57px;
  margin-top: 20px;
  width: 360px;
  height: 112px;
  font-size: 14px;
  color: #303133;
}

.select-public {
  width: 360px;
  height: 64px;
  font-size: 14px;
  color: #303133;
}
.select-class {
  margin-top: 30px;
  margin-left: 57px;
}
.el-select {
  width: 100%;
  margin-top: 8px;
}
.select-introduce {
  margin-top: 30px;
  margin-left: 57px;
}
.del-save-btn {
  margin-left: 116px;
  margin-top: 55px;
  height: 32px;
}
.el-button {
  width: 108px;
  height: 100%;
  margin-right: 26px;
  text-align: center;
  line-height: 8px;
  color: #606266;
}
.el-button:nth-child(2) {
  background: #2ab18b;
  color: #fff;
}
.upload-replace1 {
  margin-left: 196px;
  padding-top: 23px;
}
.upload-replace {
  margin-left: 196px;
  padding-top: 42px;
}
.up-btn {
  width: 82px;
  height: 32px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
}
.font {
  background-image: url("@/assets/Course-Management/10.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.icon-public {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 6px;
}
.video-path {
  margin-top: 42px;
  margin-left: 60px;
  width: 359px;
  border-bottom: 2px solid #2ab18b;
}
.localUrl-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
.el-textarea__inner {
  margin-top: 14px;
}
/* .img-banner .el-upload-list--text{
    margin-top: 0;
  } */
</style>
