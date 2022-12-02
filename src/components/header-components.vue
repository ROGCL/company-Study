<template>
  <div>
    <!-- 外层大盒子 -->
    <div class="line">
      <!-- 内部盒子，版心1200px -->
      <div class="heart">
        <router-link to="/homePages">
          <div class="icon"></div>
        </router-link>
        <!-- 选择框，此处需要用到路由，配置子路由 -->
        <div class="choose">
          <!-- 首页 -->
          <router-link to="/indexPages" id="col1">
            <div class="index">首页</div>
          </router-link>
          <!-- 在线课程 -->
          <div class="inline" @mouseenter="focuFn">
            在线课程
            <i class="iconfont"></i>
          </div>
          <!-- 弹出层大盒子 -->
          <div class="fade" v-show="shade" @mouseleave="leFn">
            <!-- 里面分栏，子路由在这里，点击变换的是下面内容区域，分别接收不同的数据 -->
            <!-- 弹出层中小盒子布局 -->
            <div class="smallBox">
              <router-link to="/onlinePages/mannagerPages" class="clear">
                <!-- 产品经理 -->
                <div class="manager public">{{list[1]}}</div>
              </router-link>

              <router-link to="/onlinePages/technologyPages" class="clear">
                <!-- 技术开发 -->
                <div class="technology public">{{list[2]}}</div>
              </router-link>

              <router-link to="/onlinePages/sparePages" class="clear">
                <!-- 运营推广 -->
                <div class="spare public">{{list[3]}}</div>
              </router-link>

              <router-link to="/onlinePages/internalPages" class="clear">
                <!-- 内部讲堂 -->
                <div class="internal public">{{list[4]}}</div>
              </router-link>

              <router-link to="/onlinePages/qualityPages" class="clear">
                <!-- 职场通用素质 -->
                <div class="quality public">{{list[5]}}</div>
              </router-link>

              <router-link to="/onlinePages/designPages" class="clear">
                <!-- 产品与设计 -->
                <div class="design public">{{list[6]}}</div>
              </router-link>

              <router-link to="/onlinePages/managementPages" class="clear">
                <!-- 管理与领导力 -->
                <div class="management public">{{list[7]}}</div>
              </router-link>

              <router-link to="/onlinePages/analysisPages" class="clear">
                <!-- 数据分析 -->
                <div class="analysis public">{{list[8]}}</div>
              </router-link>

              <router-link to="/onlinePages/elsePages" class="clear">
                <!-- 其他 -->
                <div class="else public">{{list[100]}}</div>
              </router-link>
            </div>
          </div>
        </div>
        <!-- 搜索框 -->
        <div class="search">
          <input type="text" id="searchForm" placeholder="输入搜索教程" />
          <div class="font"></div>
          <!-- 头像框 -->
          <div class="head" @mouseenter="into">
            <!-- 下拉盒子 -->
            <div class="seleBox" v-show="clean" @mouseleave="leave">
              <router-link to="/symbolPages" id="study">
                个人学习记录
              </router-link>
              <router-link to="/studyPages" id="logOut"> 退出登录 </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="img"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shade: false,
      clean: false,
      list:[]
    };
  },
  mounted(){
    
    
    this.init()
  },
  methods: {
    focuFn() {
      this.shade = true;
    },
    leFn() {
      this.shade = false;
    },
    into() {
      this.clean = true;
    },
    leave() {
      this.clean = false;
    },
    init(){
      this.Authenticator = sessionStorage.getItem('token')
      // console.log(this.Authenticator)
      this.$http.get('/home/course/cate').then((res)=>{
        this.list = res.data.data.list
        // console.log(this.list)
        console.log(this.list,87678)
      }).catch((err)=>{
        console.log(err)
    })
    }
  },
};
</script>

<style scoped>
.line {
  position: relative;
  width: 100%;
  height: 82px;
  background: #201f1f;
}
.heart {
  display: flex;
  align-items: center;
  width: 1200px;
  height: 100%;
  margin: 0 auto;
}
.icon {
  width: 89px;
  height: 28px;
  background-image: url("@/assets/img/12.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.choose {
  display: flex;
  width: 190px;
  height: 100%;
  line-height: 82px;
  font-size: 14px;
  margin-left: 80px;
}
.index {
  flex: 1;
  width: 95px;
  height: 100%;
  text-align: center;
}
.index:hover {
  background: #333131;
}
.inline {
  flex: 1;
  position: relative;
  width: 95px;
  height: 100%;
  text-align: center;
  color: #fff;
}
.inline:hover {
  background: #333131;
  cursor: pointer;
}
.iconfont{
    position: absolute;
    top: 35px;
    right: 2px;
    width: 12px;
    height: 12px;
    background-image: url('@/assets/img/15.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
#col1 {
  color: #fff;
  text-decoration: none;
}
.search {
  display: flex;
  position: relative;
  width: 422px;
  height: 42px;
  margin-left: 366px;
}
#searchForm {
  width: 340px;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 40px;
}
#searchForm::-webkit-input-placeholder {
  padding-left: 16px;
  font-size: 14px;
  color: #a8abb2;
}
.font {
  position: absolute;
  left: 307px;
  top: 12px;
  width: 18px;
  height: 18px;
  background-image: url("@/assets/img/10.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.head {
  width: 42px;
  height: 42px;
  background-image: url("@/assets/img/13.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  margin-left: 40px;
}
.img {
  width: 100%;
  height: 300px;
  background-image: url("@/assets/img/11.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.fade {
  position: absolute;
  left: 0;
  top: 82px;
  width: 100%;
  height: 75px;
  background: #333131;
}
.smallBox {
  display: flex;
  width: 1200px;
  height: 50px;
  margin: 0 auto;
}
.public {
  width: 116px;
  height: 100%;
  margin-right: 10px;
  justify-content: space-evenly;
  align-content: center;
  font-size: 14px;
  color: #888;
  /* text-align: center;
    line-height: 50px; */
}
.public:hover {
  color: #fff;
}
.clear {
  color: #888;
  text-decoration: none;
}

#symbol {
  text-decoration: none;
}
#study {
  text-decoration: none;
}
.seleBox {
  position: absolute;
  top: 62px;
  right: -42px;
  width: 120px;
  height: 70px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  background: #fff;
  font-size: 14px;
  text-align: center;
}
#study {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #888;
  text-decoration: none;
}
#study:hover {
  color: #2ab18b;
}
#logOut {
  display: block;
  color: #888;
  text-decoration: none;
}
#logOut:hover {
  color: #2ab18b;
}
</style>
