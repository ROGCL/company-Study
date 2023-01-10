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
        <upload :distinguish="2"/>
      </div>
      <!-- 文本域 -->
      <div class="textarea">
        <span class="point-public"></span>
        标题
        <el-input type="textarea" v-model="formList.title" maxlength="40" show-word-limit resize="none" cols="30" rows="4"></el-input>
      </div>
      <!-- 类目选择 -->
      <div class="select-class select-public"> 
        <span class="point-public"></span>
        类目选择
        <el-select v-model="formList.cate" placeholder="请选择" class="el-select">
          <el-option
            v-for="(item,index) in courseCate"
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
          <upload :attribute="2" @series="recordSeries" :idx="index"/>
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
          <el-input type="textarea" v-model="item.value" maxlength="40" show-word-limit resize="none" cols="30" rows="4"></el-input>
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
import controlComponents from "@/components/control/control-components.vue";
import upload from '@/components/upload/upload-file.vue'
export default {
  components: { controlComponents,upload },
  data() {
    return {
      processUrl:`${process.env.VUE_APP_URL}/file/upload`,
      currentIdx:0,
      //推荐位
      options2: [
        {
          value: 1,
          label: "精品课程",
        },
        {
          value:2,
          label:'其他推位'
        }
      ],
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
      courseCate:{}, //课程分类的数据
    };
  },
  mounted(){
    //取全局的课程分类
    this.courseCate = JSON.parse(localStorage.getItem('courseCate'))
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
    clearList(index) {
      console.log(index);
      this.list.splice(index,1) //删除操作，从index的位置开始删除，且删除index为点击的哪一个
    },
    backToControl() {
      this.$router.back();
    },
    //提交表单
     submitList() {
      this.formList.course_cover_url = JSON.parse(localStorage.getItem("courseUrl"))
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
      }else{
        this.$message.error(res.data.message)
      }
    })
    },
    //更改视频
    changeVideoSource(item) {
      // this.videoUrl = "";
      item.videoUrl = ""  //清除当前项的videoUrl
    },
    recordSeries(val){
      //每次向series数组中推送一项数据进去
      this.series.push(val[0])
      console.log(this.series,'6677')
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
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
}
.vh-big-box::-webkit-scrollbar {
  display: none;
}
.chapter-upload {
  position: relative;
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
