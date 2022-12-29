<template>
  <div>
    <controlComponents></controlComponents>
    <!-- 面包屑位置 -->
    <div class="ham">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/imporantPages' }"
          >课程管理</el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ path: '/addMoreClassPages' }"
          >新增系列课</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <!-- 系列课 -->
    <!-- 上传封面栏 -->
    <div class="banner-spared">
      <div class="title">
        <span class="point-public"></span>
        上传视频封面
      </div>
      <!-- 图片盒子 -->
      <div class="img-banner">
        <el-upload
          v-loading="loading"
          class="upload-demo"
          drag
          action="http://172.168.11.229:9000/file/upload"
          :show-file-list="false"
          :before-upload="beforeUploadImg"
          :on-success="uploadImgSuccess"
          :headers="headersData"
          v-if="formList.course_cover_url == ''"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <img
          :src="'http://172.168.11.229:9000' + formList.course_cover_url"
          alt=""
          class="img-cover"
          v-else
        />
      </div>
      <!-- 下方文字描述区域 -->
      <h5>推荐图片尺寸 300*170px大小＜30M格式推荐 png、jpg</h5>
      <div class="upload-img-replace" @click="changeImgSource">
          <button v-show="formList.course_cover_url">
            <span class="font icon-public"></span>更改
          </button>
        </div>
      <!-- 文本域 -->
      <div class="textarea">
        <span class="point-public"></span>
        标题
        <textarea
          name=""
          id="input-area"
          cols="30"
          rows="10"
          maxlength="40"
          v-model="formList.title"
        ></textarea>
      </div>
      <!-- 类目选择 -->
      <div class="select-class select-public"> 
        <span class="point-public"></span>
        类目选择
        <el-select v-model="formList.cate" placeholder="请选择" class="el-select">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
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
        <el-button @click="backToControl">取消</el-button>
        <el-button @click="submitList">保存</el-button>
      </div>
    </div>
    <!-- 上传章节栏，默认只显示一个窗口，点击底部新增在进行添加 -->
    <div class="vh-big-box">
      <div class="chapter-upload" v-for="(item, index) in list" :key="index">
        <!-- 标题第几节 -->
        <h5>第{{ index + 1 }}节</h5>
        <!-- 上传视频资源 -->
        <div class="upload-video">
          <span class="point-public"></span>
          上传视频资源
        </div>
        <!--  :before-upload="beforeUploadVideo($event,index)" -->
        <!-- 视频背景栏，可以进行预览 -->
        <div class="video-banner">
          <el-upload
            v-loading="loading"
            class="upload-demo"
            ref="upload"
            drag
            action="http://172.168.11.229:9000/file/upload"
            :before-upload="file=>beforeUploadVideo(file,index)"
            :on-success="uploadVideoSuccess"
            :on-progress="uploadVideoProcess"
            :headers="headersData"
            :show-file-list="false"
            v-if="item.videoUrl == ''"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将MP4格式的文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
          <video
            :src="'http://172.168.11.229:9000' + item.videoUrl"
            style="width: 360px; height: 180px"
            controls
            v-else
          ></video>
        </div>
        <!-- 上传按钮，在上传文件后变为替换按钮 -->
        <div class="upload-replace" @click="changeVideoSource(item)">
          <button v-show="videoUrl">
            <span class="font icon-public"></span>更改
          </button>
        </div>
        <!-- 文本域 -->
        <div class="textarea1">
          <span class="point-public"></span>
          标题
          <textarea
            name=""
            id="input-area1"
            cols="30"
            rows="10"
            v-model="item.value"
          ></textarea>
        </div>
        <!-- 删除按钮 -->
        <div class="delete-btn" v-show="item.videoUrl !== '' || item.value !== ''">
          <button @click="clearList(index)">
            <span class="icon icon-public"></span>删除
          </button>
        </div>
      </div>
    </div>
    <!-- 添加视频资源栏 -->
    <div class="chapter-upload1">
      <!-- 新增按钮图标 -->
      <div class="add-box" @click="addCourseList">
        <div class="add-icon"></div>
      </div>
      <h5>新增章节</h5>
    </div>
  </div>
</template>

<script>
import controlComponents from "@/components/control-components.vue";
export default {
  components: { controlComponents },
  data() {
    return {
      currentIdx:0,
      options1: [
        {
          value: 1,
          label: "产品经理",
        },
        {
          value: 2,
          label: "技术开发",
        },
        {
          value: 3,
          label: "运营推广",
        },
        {
          value: 4,
          label: "内部讲堂",
        },
        {
          value: 5,
          label: "职场通用素质",
        },
        {
          value: 6,
          label: "产品与设计",
        },
        {
          value: 7,
          label: "管理与领导力",
        },
        {
          value: 8,
          label: "数据分析",
        },
        {
          value: 100,
          label: "其他",
        },
      ],
      value1: "",
      //推荐位
      options2: [
        {
          value: "精品课程",
          label: "精品课程",
        },
      ],
      value2: "",
      value3: "",
      loadingstate: false,
      loading: false,
      formList: {
        course_cover_url: "",
        attribute: 2,
        title: "",
        cate: "",
        posid: "",
        series: [],
      },
      videoUrl: "",
      list: [
        //处理默认第一条数据
        {
          videoUrl:"", //视频资源
          series: [], //视频的提交数据栏
          value: "", //textarea的输入框绑定部分
        },
      ],
      series:[],//系列课存储视频数据的字段
    };
  },
  mounted(){
    console.log('%caddMoreClass-pages.vue line:257 this.list', 'color: #007acc;', this.list);
  },
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
  methods: {
    //新增课程章节
    addCourseList() {
      let obj = {
        videoUrl: "",
        series:[],
        value: "",
      };
      this.list.push(obj);
      console.log(this.list,'list')
    },
    //上传封面之前的判断
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
    uploadImgSuccess(res, file) {
      console.log(res, "imgRes");
      console.log(file, "file");
      this.formList.course_cover_url = res.data.url;
    },
    //上传视频前的校验
    beforeUploadVideo(file,idx) {
      console.log('%caddMoreClass-pages.vue line:322 index', 'color: #007acc;', idx);
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
        blues_sort: this.currentIdx,
        video_url: file.response.data.url,
        video_title: file.name,
        video_duration: file.response.data.time_log,
        video_file_name: file.response.data.name,
      };
      //当list的长度为1的时候进行默认操作
      this.videoUrl = res.data.url; //后面的视频数据
      this.loading = false;
      //给数组中的每一个对象一个标识,以避免影响操作
      this.series.push(obj)
      this.list[this.currentIdx].videoUrl = res.data.url
      this.list[this.currentIdx].series = obj
    },
    clearList(index) {
      console.log(index);
      this.list.splice(index,1) //删除操作，从index的位置开始删除，且删除index为点击的哪一个
    },
    backToControl() {
      this.$router.back();
    },
    
  submitList() {
      //formList数据存储完成
      console.log(this.formList,'图片数据')
      console.log(this.series,'list数组')
     this.$http.post('/course/add',{
       course_cover_url:this.formList.course_cover_url,
       attribute:this.formList.attribute,
       title:this.formList.title,
       cate:this.formList.cate,
       posid:this.formList.posid,
       series:this.series
    }).then((res)=>{
      console.log(res,'result')
      if(res.data.code == 1){
        this.$router.push('/imporantPages')
      }
    })
    },
    //更改视频
    changeVideoSource(item) {
      // this.videoUrl = "";
      item.videoUrl = ""  //清除当前项的videoUrl
    },
    changeImgSource(){
      this.formList.course_cover_url = ""
    }
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
.point-public {
  display: inline-block;
  width: 4px;
  height: 4px;
  border: 1px solid #f56c6c;
  background: #f56c6c;
  border-radius: 50%;
}
.el-button {
  width: 108px;
  height: 100%;
  margin-right: 26px;
  text-align: center;
  line-height: 8px;
  color: #606266;
}
.vh-big-box {
  margin-left: 706px;
  margin-top: 56px;
  width: 591px;
  /* height: 600px; */
  /* height: 926px; */
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
}
.vh-big-box::-webkit-scrollbar {
  display: none;
}
.chapter-upload {
  position: relative;
  /* margin-left: 706px; */
  margin-bottom: 16px;
  width: 591px;
  height: 514px;
  background: #fff;
  border-radius: 4px;
}
.chapter-upload1 {
  position: relative;
  margin-left: 1312px;
  margin-top: -930px;
  width: 591px;
  height: 514px;
  background: #fff;
  border-radius: 4px;
}
.chapter-upload h5 {
  position: absolute;
  left: 20px;
  top: 20px;
}
.upload-video {
  position: absolute;
  left: 116px;
  top: 44px;
  font-size: 14px;
  color: #606266;
}
.video-banner {
  position: absolute;
  left: 116px;
  top: 76px;
  width: 360px;
  height: 135px;
  border-radius: 4px;
}

.chapter-upload h6 {
  position: absolute;
  left: 116px;
  top: 216px;
  font-size: 12px;
  font-weight: normal;
  color: #606266;
}
.textarea1 {
  position: absolute;
  left: 116px;
  top: 329px;
  width: 360px;
  height: 112px;
  font-size: 14px;
  color: #303133;
}
.video-path {
  position: absolute;
  left: 117px;
  top: 285px;
  width: 359px;
  border-bottom: 2px solid #2ab18b;
}
.delete-btn {
  width: 82px;
  height: 32px;
  position: absolute;
  left: 255px;
  top: 462px;
}
.icon-public {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 6px;
}
.icon {
  background-image: url("@/assets/Course-Management/5.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.delete-btn button {
  width: 100%;
  height: 100%;
  background: #f56c6c;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}
.upload-img-replace{
  position: absolute;
  left: 190px;
  top: 297px;
}
.upload-img-replace button{
  width: 82px;
  height: 32px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
}
.upload-replace {
  position: absolute;
  left: 255px;
  top: 297px;
}
.upload-replace button {
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
#input-area1 {
  width: 100%;
  height: 80px;
  margin-top: 8px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  resize: none;
}
.add-box {
  position: absolute;
  left: 248px;
  top: 191px;
  width: 96px;
  height: 96px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
}
.add-icon {
  width: 43px;
  height: 43px;
  margin-top: 27px;
  margin-left: 27px;
  background-image: url("@/assets/Course-Management/17.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.chapter-upload1 h5 {
  position: absolute;
  left: 268px;
  top: 299px;
  font-size: 14px;
  color: #909399;
  font-weight: normal;
}

.banner-spared {
  position: absolute;
  left: 216px;
  top: 138px;
  width: 474px;
  height: 926px;
  background: #fff;
  border-radius: 4px;
}

.title {
  position: absolute;
  left: 57px;
  top: 48px;
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
  position: absolute;
  top: 80px;
  left: 57px;
  width: 360px;
  height: 180px;
  border-radius: 4px;
}
.banner-spared h5 {
  position: absolute;
  left: 57px;
  top: 268px;
  font-size: 12px;
  font-weight: normal;
  color: #606266;
}
.textarea {
  position: absolute;
  left: 57px;
  top: 358px;
  width: 360px;
  height: 112px;
  font-size: 14px;
  color: #303133;
}

#input-area {
  width: 100%;
  height: 80px;
  margin-top: 8px;
  border: 1px solid #2ab18b;
  border-radius: 4px;
  resize: none;
}
.select-public {
  width: 360px;
  height: 64px;
  font-size: 14px;
  color: #303133;
}
.select-class {
  position: absolute;
  left: 57px;
  top: 500px;
}
.el-select {
  width: 100%;
  margin-top: 8px;
}
.select-introduce {
  position: absolute;
  left: 57px;
  top: 594px;
}
.del-save-btn {
  position: absolute;
  left: 116px;
  top: 798px;
  /* width: 242px; */
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
.img-cover {
  width: 100%;
  height: 100%;
  margin-top: 8px;
  border-radius: 4px;
}
</style>
<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
