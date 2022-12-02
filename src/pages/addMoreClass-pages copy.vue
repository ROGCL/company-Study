<template>
  <div>
    <controlComponents></controlComponents>
    <!-- 面包屑位置 -->
    <div class="ham">
      <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/imporantPages' }">课程管理</el-breadcrumb-item>
   <el-breadcrumb-item :to="{path:'/addMoreClassPages'}">新增系列课</el-breadcrumb-item>
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
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>
      <!-- 下方文字描述区域 -->
      <h5>推荐图片尺寸 300*170px大小＜30M格式推荐 png、jpg</h5>
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
        ></textarea>
      </div>
      <!-- 类目选择 -->
      <div class="select-class select-public">
        <span class="point-public"></span>
        类目选择
        <el-select v-model="value1" placeholder="请选择" class="el-select">
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
        <el-button>取消</el-button>
        <el-button>保存</el-button>
      </div>
    </div>
    <!-- 上传章节栏，默认只显示一个窗口，点击底部新增在进行添加 -->
    <div class="vh-big-box">
    <div class="chapter-upload">
      <!-- 标题第几节 -->
      <h5>第一节</h5>
      <!-- 上传视频资源 -->
      <div class="upload-video">
        <span class="point-public"></span>
        上传视频资源
      </div>
      <!-- 视频背景栏，可以进行预览 -->
      <div class="video-banner">
        <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>
      <!-- 描述文字 -->
      <h6>只能上传mp4、avi格式</h6>
      <!-- 路径 -->
      <div class="video-path"></div>
      <!-- 上传按钮，在上传文件后变为替换按钮 -->
      <div class="upload-replace">
        <button><span class="font icon-public"></span>上传</button>
      </div>
      <!-- 文本域 -->
      <div class="textarea1">
        <span class="point-public"></span>
        标题
        <textarea name="" id="input-area1" cols="30" rows="10"></textarea>
      </div>
      <!-- 删除按钮 -->
      <div class="delete-btn">
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
import controlComponents from "@/components/control-components.vue";
export default {
  components: { controlComponents},
  data() {
    return {
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
      value2: ""
    };
  },
  methods:{
    addUpload(){
        alert(11111)
    }
  }
};
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
  /* height: 100vh; */
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
  margin-left: 706px;
  margin-top: 16px;
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
 .ham{
  position: absolute;
  left: 216px;
  top: 98px;
  height: 24px;
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
.video-banner .el-upload-dragger {
  width: 360px;
  height: 135px;
}
.el-upload-list--text{
  margin-top: 42px;
}

</style>
