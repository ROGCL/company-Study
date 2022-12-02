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
            <img :src="'127.0.0.1'+this.localVideoUrl" v-if="localVideoUrl == ''" class="localUrl-img">
            <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            v-else
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
          </div>
          <div class="video-path"></div>
          <div class="upload-replace1">
          <button class="up-btn"><span class="font icon-public"></span>更改</button>
        </div>
        <div class="title">
          <span class="point-public"></span>
          上传视频封面
        </div>
        <!-- 图片盒子 -->
        <div class="img-banner">
          <img :src="'127.0.0.1:9000'+ this.localUrl" alt="" v-if="localUrl == ''" class="localUrl-img">
          <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            v-else
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </div>
        <!-- 下方文字描述区域 -->
        <h5>推荐图片尺寸 300*170px大小＜30M格式推荐 png、jpg</h5>
        <div class="upload-replace">
          <button class="up-btn"><span class="font icon-public"></span>更改</button>
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
            v-model="localcourseData.course.title"
          ></textarea>
        </div>
        <!-- 类目选择 -->
        <div class="select-class select-public">
          <span class="point-public"></span>
          类目选择
          <el-select v-model="localCate" placeholder="请选择" class="el-select">
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
          <el-select v-model="value2" placeholder="请选择" class="el-select">
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
          <el-button>保存</el-button>
        </div>
      </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props:{
      title:{type:String},
      course_cover_url:{type:String},
      cate:{type:String},
      posid:{type:String},
      //视频文件名
      video_file_name:{type:String},
      //视频链接
      video_url:{type:String},
      courseData:{type:Object}
    },
  data(){
    return{
      localcourseData:{course:{},series:{}},
      localTitle:this.title,
      localCate:this.cate,
      localPosid:this.posid,
      localUrl:this.course_cover_url,
      localFileName:this.video_file_name,
      localVideoUrl:this.video_url,
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
            value: "精品课程",
            label: "精品课程",
          },
          {
            value: "其他推位",
            label: "其他推位",
          },
        ],
        value2: "",
    }
  },
  watch:{
    courseData(val){
      this.localcourseData = val
    },
    
  },  
  mounted(){
    this.choosePosid()
  },
  updated(){
    // 给textarea挂载默认值
    // if(this.localTitle !== ''){
    //   document.getElementById('input-area').value = this.localTitle
    // }else{
    //   document.getElementById('input-area').value = ''
    // }
  },
  methods:{
    choosePosid(){
    // 判断推荐位
    if(this.localPosid == 0){
      this.value2 = '其他推位'
    }else if(this.localPosid == 1){
      this.value2 = '精品推位'
    }else{
      this.value2 = ''
    }
  }
  }
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
    height: 100vh;
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
    margin-left: 57px;
    margin-top: 8px;
    width: 360px;
    height: 180px;
    border-radius: 4px;
  }
  .source-image{
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
    margin-top: 62px;
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