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
    <div class="single">
      <!-- 内部盒子 -->
      <div class="banner-spared">
        <div class="video-source">
          <span class="point-public"></span>
          上传视频资源
        </div>
        <div class="source-image">
          <upload :distinguish="1"/>
        </div>
        <div class="title">
          <span class="point-public"></span>
          上传视频封面
        </div>
        <!-- 图片盒子 -->
        <div class="img-banner">
          <upload :distinguish="2"/>
        </div>
        <!-- 下方文字描述区域 -->

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
import upload from '@/components/upload/upload-file.vue'
export default {
  components: { controlComponents,upload },
  data() {
    return {
      processUrl: `${process.env.VUE_APP_URL}/file/upload`,
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
  },
  methods: {
    //处理从locaStorage中获取到的数据
    dealSource(){
      this.videoUrl = JSON.parse(localStorage.getItem("videoUrl"))
      this.formList.course_cover_url = JSON.parse(localStorage.getItem("courseUrl"))
      let obj = JSON.parse(localStorage.getItem("videoSource"))
      this.formList.series.push(obj);
    },
    //发送表单提交过程
   submitFormList() {
     this.dealSource()
     this.$http
        .post("/course/add", {
          ...this.formList,
        }
        ).then((res,err) => {
        if(err) return
          if (res.data.message == "success") {
            this.$router.push("/imporantPages");
          } else {
            this.$message.warning(res.data.message);
          }
         });
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
  margin-top: 62px;
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
  margin-top: 75px;
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
