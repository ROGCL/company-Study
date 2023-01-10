<template>
  <div>
    <!-- 视频上传 -->
    <el-upload
      v-loading="loading"
      drag
      :action="processUrl"
      :before-upload="file=>beforeUploadVideo(file,index)"
      :on-success="uploadVideoSuccess"
      :on-progress="uploadVideoProcess"
      :headers="headersData"
      :show-file-list="false"
      v-show="distinguish == 1 && videoUrl == ''"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将MP4格式的文件拖到此处，或<em>点击上传</em>
      </div>
    </el-upload>
    <video
      controls
      :src="videoUrl"
      style="width: 360px; height: 180px"
      v-show="videoUrl !== ''"
    ></video>
    <div class="upload-replace" v-show="distinguish == 1 && videoUrl !== ''">
      <button class="up-btn" @click="videoUrl = ''">
        <span class="font icon-public"></span>更改
      </button>
    </div>
    <!-- 图片上传 -->
    <el-upload
      drag
      :action="processUrl"
      :on-success="uploadImgSuccess"
      :before-upload="beforeUploadImg"
      :headers="headersData"
      :show-file-list="false"
      v-show="distinguish == 2 && course_cover_url == ''"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将视频封面图片拖到此处，或<em>点击上传</em>
      </div>
    </el-upload>
    <img
      :src="course_cover_url"
      alt=""
      style="width: 360px; height: 180px; border-radius: 4px; margin-top: 8px"
      v-show="course_cover_url !== ''"
    />
    <h5
      v-show="distinguish == 2"
      style="font-weight: normal; color: #606266; font-size: 12px"
    >
      推荐图片尺寸 300*170px大小＜30M格式推荐 png、jpg
    </h5>
    <div
      class="upload-replace"
      v-show="distinguish == 2 && course_cover_url !== ''"
    >
      <button class="up-btn" @click="course_cover_url = ''">
        <span class="font icon-public"></span>更改
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 模块区分字段,默认展示视频,为2的时候展示图片
    distinguish: {
      type: Number,
      default: 1,
    },
    //课程类别区分字段,不传值默认为单节课,为2的时候为系列课
    attribute: {
      type: Number,
      default: 1,
    },
    //新增多节系列课，每节系列课的下标
    idx:{
      type:Number
    }
  },
  data() {
    return {
      loading: false, // 加载
      loadingstate: false, //视频上传加载
      processUrl: `${process.env.VUE_APP_URL}/file/upload`, //上传的请求字段
      httpUrl: process.env.VUE_APP_URL, //拼接字段
      course_cover_url: "", //图片资源字段
      videoUrl: "", //视频资源字段
      currentIdx:0, //系列课的多条视频资源当前索引
      blues_sort:1, //视频排序默认为1,系列课进行处理
      series:[], //系列课新增，存储数据字段
    };
  },
  //在页面被销毁时，清除缓存
  beforeDestroy(){
   localStorage.removeItem("videoSource")
   localStorage.removeItem("videoUrl")
   localStorage.removeItem("courseUrl")
  },
  computed: {
    //带上请求头用户的token
    headersData() {
      let loginToken = sessionStorage.getItem("token");
      if (loginToken) {
        // 跳转登录
        return {
          Authenticator: loginToken,
        };
      }
      return false;
    }
  },
  methods: {
    // 视频上传的前置校验
    beforeUploadVideo(file,idx) {
      this.currentIdx = idx
      this.loadingstate = true;
      let index = file.name.lastIndexOf(".");
      let extension = file.name.substr(index + 1);
      let extensionList = ["mp4"];
      if (extensionList.indexOf(extension) < 0) {
        this.$message.error("上传视频的格式应该为mp4格式");

        return false;
      }
    },
    //视频上传中的校验
    uploadVideoProcess() {
      this.loading = true;
    },
    //视频上传成功的校验
    uploadVideoSuccess(res, file) {
      //根据传进来的attribute进行区分blues_sort的值
      if(this.attribute == 2){
        this.blues_sort = this.idx
      }else{
        this.blues_sort = 1
      }
      let obj = {
        blues_sort: this.blues_sort,
        video_url: file.response.data.url,
        video_title: file.name,
        video_duration: file.response.data.time_log,
        video_file_name: file.response.data.name,
      };
      //单节课系列课的共用videoUrl,系列课当长度为1的时候进行默认赋值
      this.videoUrl = this.httpUrl + res.data.url;
      this.loading = false;
      //当默认为单节课的时候,这样存数据,多节课的时候进行区分
      if(this.attribute == 1){
        localStorage.setItem("videoSource", JSON.stringify(obj));
        localStorage.setItem("videoUrl", JSON.stringify(this.videoUrl));
      }else{
      //series存的是多条视频数据的资源
      this.series.push(obj)
      //向父组件传递series的值过去进行处理(这边新增一条，就回传过去一条数据即可)
      this.$emit("series",this.series)
      }

    },
    //图片上传的前置校验
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
    //图片上传成功
    uploadImgSuccess(res) {
      this.course_cover_url = this.httpUrl + res.data.url;
      localStorage.setItem("courseUrl", JSON.stringify(this.course_cover_url));
    },
  },
};
</script>

<style scoped>
.upload-replace {
  /* margin-left: 139px; */
  margin: 20px 0 40px 139px;
  /* padding-top: 42px; */
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
</style>
