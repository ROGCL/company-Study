<template>
  <div>
    <!-- 个人学习记录页面 -->
    <!-- 头部固定栏 -->
    <div class="header">
      <!-- 管理中心文字 -->
      <h1 style="cursor: pointer;" @click="toManageCenter">管理中心</h1>
      <!-- 头像框 -->
      <!-- <div class="img1"></div> -->
      <el-dropdown style="display:flex;">
      <img src="@/assets/img/13.png" alt="" class="img1" />
      <el-dropdown-menu slot="dropdown" style="text-align:center">
        <el-dropdown-item @click.native="goStudyList">个人学习记录</el-dropdown-item>
        <el-dropdown-item @click.native="leaveHome">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    </div>
    <!-- 左侧边栏 -->
    <div class="left-asideBar" ref="activeBar">
      <!-- 返回首页按钮 -->
      <router-link to="/homepages" style="text-decoration: none">
        <div class="btn1">返回首页</div>
      </router-link>
      <!-- 课程管理与学习记录，配置两个子路由，同页面显示 -->
    <router-link to="/imporantPages" class="delstyle">
    <div class="manage">
      <img src="@/assets/img/40.png" alt="" class="img-public icon-img1">
      <h5>课程管理</h5>
    </div>
  </router-link>
  <router-link to="/recordLearning" class="delstyle">
    <div class="manage">
      <img src="@/assets/img/37.png" alt="" class="img-public icon-img2">
      <h5>登录授权管理</h5>
    </div>
  </router-link>
    </div>
  </div>
</template>

<script>
export default {
data(){
    return{
      address:""
    }
},
mounted(){
  //截取路径为侧边栏动态样式做准备
  this.splitAdress()
},
methods:{
  splitAdress(){
          //处理url参数的方法
    let geturl = 
      window.location.href
    ;
    let getqyinfo = geturl.split("#")[1];
    this.address = getqyinfo
    console.log(this.address,999)
    this.changeAsideBarClass()
    },
    //改变侧边栏样式
    changeAsideBarClass(){
      if(this.address == '/symbolPages'){
         this.$refs.activeBar.style = "height:106%"
      }else if(this.address == '/imporantPages'){
        this.$refs.activeBar.style = "height:125%"
      }else if(this.address == '/recordLearning'){
        this.$refs.activeBar.style = 'height:95%'
      }
    },
  leaveHome(){
    this.$router.push('/loginPages')
    sessionStorage.removeItem('token')
    
   },
   goStudyList(){
    this.$router.push('/symbolPages')
   },
   toManageCenter(){
    this.$router.push('/symbolPages')
   }
}
}
</script>

<style scoped>
.header {
  /* display: flex; */
  position: relative;
  width: 100vw;
  height: 82px;
  background: #201f1f;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.header h1 {
  font-size: 21px;
  font-weight: 700;
  margin-top: 26px;
  margin-left: 31.3px;
  color: #fff;
}
.img1 {
  position: absolute;
  right: 105px;
  top: -33px;
  width: 42px;
  height: 42px;
  border-radius: 42px;
  cursor: pointer;
}
.left-asideBar {
  position: absolute;
  left: 0;
  top: 84px;
  width: 200px;
  height: 125%;
  background: #fff;
}
.btn1 {
  margin-left: 46px;
  margin-top: 24px;
  width: 108px;
  height: 32px;
  background: #2ab18b;
  border-radius: 4px;
  margin-bottom: 24px;
  /* margin: 24px auto; */
  text-align: center;
  line-height: 32px;
  font-size: 14px;
  color: #fff;
}
.manage {
  width: 100%;
  height: 56px;
}
.img-public {
  width: 18px;
  height: 18px;
  margin-left: 20px;
  margin-right: 8px;
  transform: translateY(4px);
}
/* .manage:hover .img-public {
  content: url("@/assets/img/39.png");
} */
.manage h5 {
  display: inline-block;
  /* margin-left: 46px; */
  line-height: 56px;
}
.manage:hover {
  background: #f7fffd;
  color: #2ab18b;
  border-right: 4px solid #2ab18b;
}
.manage:hover .icon-img1{
  content: url("@/assets/img/39.png");
}
.manage:hover .icon-img2{
  content: url("@/assets/img/38.png");
}
/* .manage:hover #img2 {
  content: url("@/assets/img/39.png");
} */
.delstyle{
    text-decoration: none;
    color: #000;
}
:deep(.el-dropdown-menu__item:hover) {
  color: #2AB18B
}
</style>
<style>
*{
  margin: 0;
  padding: 0;
  list-style: none;
}
body{
  width: 100%;
  height: 100%;
  background: #F0F2F5;
}
</style>