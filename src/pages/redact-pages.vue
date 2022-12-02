<template>
  <div>
    <!-- 公共头部 -->
    <controlComponents></controlComponents>
      <!-- 面包屑 -->
      <div class="ham">
      <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/imporantPages' }">课程管理</el-breadcrumb-item>
       <el-breadcrumb-item :to="{path:'/redactPages'}" v-if="$route.query.attribute == '系列课'">编辑系列课</el-breadcrumb-item>
       <el-breadcrumb-item :to="{path:'/redactPages'}" v-else>编辑单节课</el-breadcrumb-item>
    </el-breadcrumb>
    </div>
    <!-- 单节课的编辑页面 -->
    <!-- <singleClassComponents v-if="$route.query.attribute == '单节课'" :title="this.title" :course_cover_url="this.course_cover_url" :cate="this.cate" :posid="this.posid" :video_file_name="this.video_file_name" :video_url="this.video_url"></singleClassComponents> -->
    <singleClassComponents v-if="$route.query.attribute == '单节课'" :courseData="courseData"></singleClassComponents>
    <!-- 系列课的编辑页面 -->
    <moreClassComponents v-else></moreClassComponents>
  </div>
</template>

<script>
import singleClassComponents from '@/components/singleClass-components.vue';
import controlComponents from '@/components/control-components.vue';
import moreClassComponents from '@/components/moreClass-components.vue';
export default {
components:{controlComponents,singleClassComponents,moreClassComponents},
data(){
  return{
    courseData:{},
      // 单节课的接收字段
      title:"",
      course_cover_url:"",
      cate:this.$route.query.cate,
      posid:"",
      //视频文件名,播放链接,传给公共组件进行回显
      video_file_name:"",
      video_url:""
  }
},
mounted(){
   this.getSingleList()
},
methods:{
  // 单节课的请求
  getSingleList(){
    this.$http.post('/course/edit',{
      id:this.$route.query.id
    }).then((res)=>{
      console.log(res.data.data,123)
      let data = res.data.data
      this.courseData =data
      this.title = data.course.title
      this.course_cover_url = data.course.course_cover_url
      this.cate = data.course.cate
      this.posid = data.course.posid
      this.video_file_name = data.series[0].video_file_name
      this.video_url = data.series[0].video_url
    })
  },
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
</style>
<style>
*{
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>