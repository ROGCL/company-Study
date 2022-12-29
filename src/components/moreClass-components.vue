<template>
  <div>
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
          class="upload-demo"
          drag
          action="http://172.168.11.229:9000/file/upload"
          :show-file-list="false"
          :before-upload="beforeUploadImg"
          :on-success="uploadImgSuccess"
          :headers="headersData"
          v-if="list.course_cover_url == ''"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <img
          :src="'http://172.168.11.229:9000' + list.course_cover_url"
          alt=""
          class="img-cover"
          v-else
        />
      </div>
      <!-- 下方文字描述区域 -->
      <h5>推荐图片尺寸 300*170px大小＜30M格式推荐 png、jpg</h5>
      <div class="upload-img-replace" @click="changeImgSource">
          <button v-show="list.course_cover_url">
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
          v-model="list.title"
        ></textarea>
      </div>
      <!-- 类目选择 -->
      <div class="select-class select-public">
        <span class="point-public"></span>
        类目选择
        <el-select v-model="list.cate" placeholder="请选择" class="el-select">
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
        <el-select v-model="list.posid" placeholder="请选择" class="el-select">
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
        <el-button @click="backCourse">取消</el-button>
        <el-button @click="submitCourse">保存</el-button>
      </div>
    </div>
    <!-- 上传章节栏，默认只显示一个窗口，点击底部新增在进行添加 -->
    <div class="vh-big-box">
    <div class="chapter-upload" v-for="(item,index) in courseData" :key="index">
      <!-- 标题第几节 -->
      <h5>第{{index + 1}}节</h5>
      <!-- 上传视频资源 -->
      <div class="upload-video">
        <span class="point-public"></span>
        上传视频资源
      </div>
      <!-- 视频背景栏，可以进行预览 -->
      <div class="video-banner">
        <el-upload
        v-loading="loading"
          class="upload-demo"
          drag
          action="http://172.168.11.229:9000/file/upload"
          :before-upload="file=>beforeUploadVideo(file,index)"
            :on-success="uploadVideoSuccess"
            :on-progress="uploadVideoProcess"
            :headers="headersData"
            :show-file-list="false"
          v-if="item.video_url == ''"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <video
            :src="'http://172.168.11.229:9000' + item.video_url"
            style="width: 360px; height: 180px"
            controls
            v-else
          ></video>
      </div>
      <!-- 描述文字 -->
      <!-- <h6>只能上传mp4、avi格式</h6> -->
      <!-- 路径 -->
      <!-- <div class="video-path"></div> -->
      <!-- 上传按钮，在上传文件后变为替换按钮 -->
      <div class="upload-replace" v-show="item.video_url !== ''">
        <button @click="changeSource(item)"><span class="font icon-public"></span>更改</button>
      </div>
      <!-- 文本域 -->
      <div class="textarea1">
        <span class="point-public"></span>
        标题
        <textarea name="" id="input-area1" cols="30" rows="10" v-model="item.video_title"></textarea>
      </div>
      <!-- 删除按钮 -->
      <div class="delete-btn" @click="removeList(index)" v-show="item.video_title !== '' || item.video_url !== ''">
        <button><span class="icon icon-public"></span>删除</button>
      </div>
    </div>
  </div>
  <!-- 添加视频资源栏 -->
  <div class="chapter-upload1">
    <!-- 新增按钮图标 -->
    <div class="add-box" @click="addUpload">
      <div class="add-icon"></div>
    </div>
    <h5>新增章节</h5>
  </div>
  </div>
</template>

<script>
export default {
// props:['courseData'],
    data() {
    return {
      currentIdx:0,
      options1: [
        {
          value: "产品经理",
          label: "产品经理",
        },
        {
          value: "技术开发",
          label: "技术开发",
        },
        {
          value: "运营推广",
          label: "运营推广",
        },
        {
          value: "内部讲堂",
          label: "内部讲堂",
        },
        {
          value: "职场通用素质",
          label: "职场通用素质",
        },
        {
          value: "产品与设计",
          label: "产品与设计",
        },
        {
          value: "管理与领导力",
          label: "管理与领导力",
        },
        {
          value: "数据分析",
          label: "数据分析",
        },
        {
          value: "其他",
          label: "其他",
        },
      ],
      value1: "",
      //推荐位
      options2: [
        {
          value: "首页精品推荐位",
          label: "首页精品推荐位",
        }
      ],
      value2: "",
      list:{},
      courseData:[],
      loading:false
    };
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
  mounted(){
    this.getListSource()  //请求回传的视频资源
        //接收返回来的数据
        this.list = this.$route.query.form
    console.log(this.list,'表单内容1')

  },
  methods:{
    getListSource(){
      this.$http.post('/course/edit',{
        id:this.$route.query.id
      }).then((res)=>{
        let data = res.data.data
        this.courseData = data.series
        console.log(this.courseData,'courseData')
      })
    },
    //取消回退界面
    backCourse(){
      this.$router.back()
    },
    //保存提交更新后的表单
    submitCourse(){
      console.log(this.list,'列表数据')
      this.$http.post('/course/update',{
        id:this.list.id,
        course_cover_url:this.list.course_cover_url,
        attribute:2,
        cate:this.list.cate,
        title:this.list.title,
        posid:this.list.posid,
        series:this.courseData
      }).then((res)=>{
        console.log(res.data)
        if(res.data.code == 1){
          this.$router.back()
        }
      })
    },
    addUpload(){
     let obj = {
      blues_sort:"",
      // id:"",
      video_duration:"",
      video_file_name:"",
      video_title:"",
      video_url:""
     }
     this.courseData.push(obj)
     console.log(this.courseData)
       // alert(11111)
    },
    //删除按钮进行的操作
    removeList(ind){
      this.courseData.splice(ind,1)
      
    },
    changeSource(item){
      console.log(item)
      item.video_url = ''
    },
    changeImgSource(){
      this.list.course_cover_url = ""
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
      this.list.course_cover_url = res.data.url;
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
        // video_title: file.name,
        video_duration: file.response.data.time_log,
        video_file_name: file.response.data.name,
      };
      this.courseData[this.currentIdx] = obj
      this.loading = false
      console.log(this.courseData)
    },
  }
}
</script>

<style scoped>

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
.vh-big-box{
  margin-left: 706px;
  margin-top: 56px;
  width: 591px;
  /* height: 600px; */
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
}
.vh-big-box::-webkit-scrollbar{
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
.chapter-upload1{
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
.add-box{
  position: absolute;
  left: 248px;
  top: 191px;
  width: 96px;
  height: 96px;
  border: 1px dashed #DCDFE6;
  border-radius: 4px;
  cursor: pointer;
}
.add-icon{
  width: 43px;
  height: 43px;
  margin-top: 27px;
  margin-left: 27px;
  background-image: url('@/assets/Course-Management/17.png');
  background-repeat: no-repeat;
  background-size: 100% 100%; 
 } 
 .chapter-upload1 h5{
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
</style>
<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
body {
  background: #f0f2f5;
}
/* .video-banner .el-upload-dragger {
  width: 360px;
  height: 135px;
} */
.el-upload-list--text{
  margin-top: 42px;
}
</style>