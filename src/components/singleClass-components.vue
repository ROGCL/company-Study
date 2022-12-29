<template>
    <div>
      <!-- 单节课页面 -->
      <!-- 外部大盒子 -->
      <div class="single">
        <!-- 内部盒子 -->
        <div class="banner-spared">
          <div class="video-source">
            <span class="point-public"></span>
            上传视频资源
          </div>
          <div class="source-image"> 

            <el-upload
            v-loading="loading"
            class="upload-demo"
            drag
            action="http://172.168.11.229:9000/file/upload"
            :before-upload="beforeUploadVideo"
            :on-success="uploadVideoSuccess"
            :on-progress="uploadVideoProcess"
            :headers="headersData"
            :show-file-list="false"
            v-if="list.video_url == ''"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
          <video :src="'http://172.168.11.229:9000' + list.video_url" style="width:360px;height:180px;position: absolute;left: 0;top: 0;" controls v-else-if="list.video_url !== ''"></video>
          <video :src="'http://172.168.11.229:9000' + videoUrl" style="width:360px;height:180px;position: absolute;left: 0;top: 0;" controls v-show="videoUrl !== ''"></video>
          </div>
          <div class="upload-replace1">
          <button class="up-btn" @click="clearListVideoContent"><span class="font icon-public"></span>更改</button>
        </div>
        <div class="title">
          <span class="point-public"></span>
          上传视频封面
        </div>
        <!-- 图片盒子 -->
        <div class="img-banner">
          <el-upload
            class="upload-demo"
            :class="{showing:showing ? 1 : 0}"
            drag
            action="http://172.168.11.229:9000/file/upload"
            :on-success="uploadImgSuccess"
            :before-upload="beforeUploadImg"
            :headers="headersData"
            :show-file-list="false"
            v-if="list.course_cover_url == ''"
            ref="showing"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
          <img :src="'http://172.168.11.229:9000' + list.course_cover_url" alt="" class="img-cover" v-else>
          <img :src="'http://172.168.11.229:9000' + formList.course_cover_url" alt="" class="img-cover" v-show="formList.course_cover_url !== ''">
        </div>
        <!-- 下方文字描述区域 -->
        <h5>推荐图片尺寸 300*170px大小＜30M格式推荐 png、jpg</h5>
        <div class="upload-replace">
          <button class="up-btn" @click="clearListImgContent"><span class="font icon-public"></span>更改</button>
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
          <el-select placeholder="请选择" class="el-select" v-model="list.cate">
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
          <el-select v-model="list.posid" placeholder="请选择" class="el-select" clearable>
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
            <el-button @click="backToEditate">取消</el-button>
          <el-button @click="submitFormList">保存</el-button>
        </div>
      </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
  data(){
    return{
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
          }
        ],
        value2: "",
        formList:{
          course_cover_url:"",
          attribute:1,
          title:"",
          cate:1,
          posid:1,
          series:[]
        },
        //这里是接收路由query过来的数据
        list:{},
        loading:false,
        showing:false, //控制显示隐藏的字段
        videoUrl:""
    }
  },
  watch:{
    courseData(val){
      this.localcourseData = val
    },
    
  },  
  mounted(){
    this.list = this.$route.query.form
    console.log(this.list,'表单内容')
    this.choosePosid()
    this.list.series = JSON.parse(localStorage.getItem('series'))
  },
  methods:{
    choosePosid(){
  },
  //点击取消时，回到表单界面
  backToEditate(){
    this.$router.push('/imporantPages')
  },
  //视频资源的更改按钮
  clearListVideoContent(){
    this.list.video_url = ''
    if(this.videoUrl !== ''){
      this.videoUrl = ''
    }
  },
  //视频封面的更改按钮
  clearListImgContent(){
      this.list.course_cover_url = ''
    if(this.formList.course_cover_url !== ''){
      this.formList.course_cover_url = ''
    }
  },
   //图片上传成功
   uploadImgSuccess(res,file){
    console.log(res,'imgRes')
    console.log(file,'file')
    this.formList.course_cover_url = res.data.url
  },
  //视频上传过程中的加载操作
  uploadVideoProcess(event,file,formList){
    console.log(event,'视频上传中1')
    console.log(file,'视频上传中2')
    console.log(formList,'视频上传中3')
    console.log(file.status,'视频上传中response')
    this.loading = true
  },
  //视频上传成功
  uploadVideoSuccess(res,file){
    console.log(res,'视频上传成功')
    console.log(file)
    let obj = {
      blues_sort:1,
      video_url:file.response.data.url,
      video_title:file.name,
      video_duration:file.response.data.time_log,
      video_file_name:file.response.data.name
    }
    this.formList.series.push(obj)
    this.loading = false
    this.videoUrl = res.data.url
  },
  //上传之前校验文件格式
  beforeUploadImg(file){
  this.loadingstate = true
  let index = file.name.lastIndexOf(".")
  let extension = file.name.substr(index + 1)
  let extensionList = [
    "png",
    "PNG",
    "jpg",
    "JPG",
    "jpeg",
    "JPEG",
    "bmp",
    "BMP"
  ]
  let isLt2M = file.size / 1024 / 1024 < 10
  if(!isLt2M){
    this.$message({
      message:"封面不能超出10M",
      type:"warning",
      center:true
    })

    return false
  }else if(extensionList.indexOf(extension) < 0){
    this.$message({
      message:"当前文件格式不支持",
      type:"error",
      center:true
    })

    return false
  }
  },
  //上传视频前的校验
  beforeUploadVideo(file){
   this.loadingstate = true
   let index = file.name.lastIndexOf(".")
  let extension = file.name.substr(index + 1)
  let extensionList = [
    "mp4"
  ]
  if(extensionList.indexOf(extension) < 0){
    this.$message.error("上传视频的格式应该为mp4格式")

    return false
  }
  },
  //发送表单提交过程
  submitFormList(){
    console.log(this.formList,'是否有数据？')
    console.log(this.list.cate,'类目')
    console.log(this.list.posid,'推荐位')
    console.log(this.list.title,'标题')
    console.log(this.formList.series,'重新上传的视频资源')
    console.log(this.list.series,'query过来的视频资源')
    if(this.list.course_cover_url !== ''){
      this.formList.course_cover_url = this.list.course_cover_url
    }
    if(this.list.series.length > 0){
      this.formList.series = this.list.series
    }
    if(this.list.cate ){
      this.formList.cate = this.list.cate
    }
    this.$http.post('/course/add',{
      //...this.formList
      course_cover_url:this.formList.course_cover_url,
      attribute:this.formList.attribute,
      title:this.list.title,
      cate:this.formList.cate,
      series:this.formList.series
    }).then((res)=>{
      if(res.data.message == 'success'){
        this.$router.push('/imporantPages')
      }else{
        this.$message.warning('已存在相同标题的课程,请仔细检查')
      }
      console.log(res,'提交表单是否成功')
    })
  }
  },
  computed:{
//带上请求头用户的token，不然不生效果
headersData(){
  let loginToken = sessionStorage.getItem("token");
    if (loginToken) {
      // 跳转登录
      return {
      Authenticator: loginToken,
    }
    }
    return false

},
},
  }
  </script>
  
  <style scoped>
   .ham{
    position: absolute;
    left: 216px;
    top: 98px;
    height: 24px;
   }
   .single{
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
  .video-source{
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
    position: relative;
    margin-left: 57px;
    margin-top: 8px;
    width: 360px;
    height: 180px;
    border-radius: 4px;
  }
  .source-image{
    position: relative;
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
  .upload-replace1{
    margin-left: 196px; 
    padding-top: 23px;
  }
  .upload-replace{
    margin-left: 196px; 
    padding-top: 42px;
  }
  .up-btn{
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
  .localUrl-img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .img-cover{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    /* margin-top: 8px; */
    border-radius: 4px;
  }
  .showing{
    display: none;
  }
  </style>
  <style>
  *{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .img-banner .el-upload-list--text{
    margin-top: 25px;
  }
  </style>