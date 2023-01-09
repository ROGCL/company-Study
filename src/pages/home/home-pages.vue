<template>
  <div id="app">
    <!-- 顶部提示栏,弹窗,所有页面共用,挂载到主页面 -->
    <div class="topNotice" v-show="shade">
      <img src="@/assets/img/17.png" alt="" id="lit" />
      清露平台所载所有内容，仅限于内部学习使用。各位同学不得将本平台所载内容用作其他用途，或提供给其他人使用
      <img src="@/assets/img/18.png" alt="" id="del" @click="close" />
    </div>
    <!-- 头部组件 -->
    <!-- 外层大盒子 -->
    <div class="line">
      <!-- 内部盒子，版心1200px -->
      <div class="heart">
        <div class="icon"></div>
        <!-- 选择框，此处需要用到路由，配置子路由 -->
        <div class="choose">
          <!-- 首页 -->
          <div class="index" @click="getDataList">首页</div>
          <!-- 在线课程 -->
          <div class="inline" @mouseenter="focuFn">
            在线课程
            <i class="el-icon-arrow-down" v-if="arrow == 1"></i>
            <i class="el-icon-arrow-up" v-else></i>
          </div>
          <!-- 弹出层大盒子 -->
          <div class="fade" v-show="shading" @mouseleave="leFn">
            <!-- 里面分栏，子路由在这里，点击变换的是下面内容区域，分别接收不同的数据 -->
            <!-- 弹出层中小盒子布局 -->
            <div class="smallBox">
              <div
                class="public"
                v-for="(val, index) in lists"
                :key="index"
                :class="{ selectedActive: selectedActive == index ? 1 : 0 }"
                @click="chooseCate(index, val)"
              >
                {{ val }}
              </div>
            </div>
          </div>
        </div>
        <!-- 搜索框 -->
        <div class="search">
          <el-input
            v-model="search"
            placeholder="输入搜索教程"
            id="searchForm"
            @keyup.enter.native="searchFormList"
          ></el-input>
          <img
            src="@/assets/img/10.png"
            alt=""
            class="font"
            @click="searchFormList"
          />
          <!-- 头像框 -->
          <el-dropdown style="display: flex; margin-left: 40px">
            <img src="@/assets/img/13.png" alt="" class="user_img" />
            <el-dropdown-menu slot="dropdown" style="text-align: center">
              <el-dropdown-item @click.native="goStudyList"
                >个人学习记录</el-dropdown-item
              >
              <el-dropdown-item @click.native="leaveHome"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="img"></div>
    </div>
    <div
      style="width: 100%; min-height: 600px"
      v-loading="fullscreenLoading"
      element-loading-text="正在加载中..."
      element-loading-background="#f0f2f5"
    >
      <!-- 内容组件 -->
      <div class="container">
        <!-- 后端反数据 4栏布局保持不变更 -->
        <!-- 头部通栏 -->
        <div class="contop">
          <!-- 左边标题 -->
          <h4 ref="changeCourse">精品课程</h4>
          <!-- 右侧图标 -->
          <div class="smBox">
            <div class="sm-control-box">
              <span>最新</span>
              <i
                class="el-icon-caret-top position-change"
                @click="searchNewList"
                ref="iconChangeColor"
              ></i>
              <i
                class="el-icon-caret-bottom change-position"
                @click="searchAfterList"
                ref="iconColorChange"
              ></i>
            </div>
            <div class="sm-control-box">
              <span>最热</span>
              <i
                class="el-icon-caret-top position-change"
                ref="iconStyle"
                @click="searchHotList"
              ></i>
              <i
                class="el-icon-caret-bottom change-position"
                @click="searchHotListAfter"
                ref="styleIcon"
              ></i>
            </div>
            <div class="sm-control-box">
              <el-dropdown style="display: flex" placement="top-end">
                <span class="three" ref="dropTotal" v-if="attr == '1'"
                  >单节课 <i class="el-icon-caret-bottom"></i
                ></span>
                <span class="three" ref="dropTotal" v-else-if="attr == '2'"
                  >系列课 <i class="el-icon-caret-bottom"></i
                ></span>
                <span class="three" ref="dropTotal" v-else
                  >全部 <i class="el-icon-caret-bottom"></i
                ></span>

                <el-dropdown-menu slot="dropdown" style="text-align: center">
                  <el-dropdown-item @click.native="getData"
                    >全部</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="searchSingleList"
                    >单节课</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="searchMoreList"
                    >系列课</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <!-- 底部4栏布局 -->
        <!-- 外部大盒子 -->
        <el-empty description="暂无内容" v-show="list == null"></el-empty>
        <!-- 在这里传入点击进去的id后获得视频url和视频标题 -->
        <div class="sch">
          <!-- 内部的一个盒子 -->
          <div
            v-for="(item, index) in list"
            :key="index"
            @click="pushSource(item.id, 'identification')"
          >
            <div class="into pa">
              <!-- 课程图片 -->
              <div class="jpg">
                <img
                  :src="processUrl + item.course_cover_url"
                  alt=""
                  class="img9"
                />
                <!-- 切图单节课还是系列课 -->
                <span class="ke" v-if="item.attribute == 1">单节课</span>
                <span class="ke" v-else>系列课</span>
              </div>
              <!-- 课程介绍 -->
              <div class="introduce">{{ item.title }}</div>
              <!-- 学习热度和学习人数,数据渲染次数和人数 -->
              <div class="people">
                <span class="num1">{{ item.course_pv }}次学习热度</span>
                <span class="num2">{{ item.course_uv }}人学习过</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shade: true,
      list: [],
      attr: "",
      order: "",
      page: 1,
      page_size: 16,
      posid: 1,
      prop: "",
      cate: 0,
      total: "",
      id: [],
      shading: false,
      clean: false,
      lists: {}, //课程分类数据
      arrow: 1, //在线课程旁边的icon图标
      search: "",
      selectedActive: 0, //下拉菜单高亮控制
      processUrl: process.env.VUE_APP_URL,
      fullscreenLoading: false, //加载
      searchResult:0, // 搜索显隐字段
    };
  },
  mounted() {
    this.getData(); //获取课程信息
    this.lists = JSON.parse(localStorage.getItem("courseCate"));
  },
  methods: {
    //关闭通知栏
    close() {
      this.shade = false;
    },
    //点击首页，再次请求数据
    getDataList() {
      this.$refs.changeCourse.innerHTML = "精品课程";
      this.cate = 0;
      this.getData();
      this.selectedActive = 0;
    },
    // 打开页面时请求的数据
    async getData() {
      this.fullscreenLoading = true;
      const res = await this.$http.post("/home/index", {
        attr: this.attr,
        order: this.order,
        page: this.page,
        page_size: this.page_size,
        posid: this.posid,
        prop: this.prop,
        cate: this.cate,
        search: this.search,
      });
      this.list = res.data.data.list;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 1000);

      // console.log(res.data.data);
      this.total = res.data.data.list.total;
      if (this.search !== "") {
        this.search = "";
        this.$refs.changeCourse.innerHTML = "搜索结果";
      }
      if (this.prop == "time_add" && this.order == "asc") {
        this.$refs.iconColorChange.classList.remove("iconColor");
        this.$refs.iconChangeColor.classList.add("iconColor");
      } else if (this.prop == "time_add" && this.order == "desc") {
        this.$refs.iconChangeColor.classList.remove("iconColor");
        this.$refs.iconColorChange.classList.add("iconColor");
      }

      if (this.prop == "course_pv" && this.order == "asc") {
        this.$refs.styleIcon.classList.remove("iconColor");
        this.$refs.iconStyle.classList.add("iconColor");
      } else if (this.prop == "course_pv" && this.order == "desc") {
        this.$refs.styleIcon.classList.add("iconColor");
        this.$refs.iconStyle.classList.remove("iconColor");
      }
    },
    //页面滚动时，利用分页功能，循环发送请求加载的页面
    loadList() {
      if (this.total <= 16) {
        return (this.page = 1);
      } else {
        this.page += 1;
        this.getData();
      }
    },
    // scroll() {
    //   let isLoading = false;
    //   window.onscroll = async () => {
    //     //offsetHeight:可视区域的高度，包含了border和滚动条
    //     //scrollTop:滚动后被隐藏的高度,获取对象相对于由offsetHeight属性指定的父坐标距离顶端的高度
    //     //innerHeight:文档显示区域的高度
    //     let bottomOfWindow =
    //       document.documentElement.offsetHeight -
    //         document.documentElement.scrollTop -
    //         window.innerHeight <=
    //       10;
    //     if (bottomOfWindow && isLoading == false) {
    //       const res = await this.$http.post("/home/index", {
    //         attr: this.attr,
    //         order: this.order,
    //         page: this.page=this.page+1,
    //         page_size: this.page_size,
    //         posid: this.posid,
    //         prop: this.prop,
    //         cate:this.cate });
    //         console.log(res.data.data.list.length,878788888)
    //       const length = res.data.data.list.length
    //       if (length > 10) {
    //         this.list.push(...res.data.data.list);
    //         isLoading = true;
    //         // if(res.data.data.list === null){
    //         //   isLoading = false
    //         // }
    //       }
    //       else {
    //         this.$notify({
    //           title: "温馨提示",
    //           message: "暂无更多数据信息",
    //           position: "bottom-right",
    //         });
    //         isLoading = false;
    //       }
    //     }
    //   };
    // },
    //鼠标进入在线课程展示下拉菜单
    focuFn() {
      this.shading = true;
      this.arrow = 2;
    },
    //鼠标离开收起下拉菜单栏
    leFn() {
      this.shading = false;
      this.arrow = 1;
    },
    // 首页在线课程下拉菜单栏的请求
    async chooseCate(ind, val) {
      this.cate = ind;
      this.getData();
      this.selectedActive = ind;
      this.$refs.changeCourse.innerHTML = val;
    },
    //退出登录时做的操作，将token移除，阻止用户点击前进后再次进到主页面
    leaveHome() {
      sessionStorage.removeItem("token");
      this.$router.push("/loginPages");
    },
    //跳转个人学习记录界面
    goStudyList() {
      this.$router.push("/symbolPages");
    },
    //搜索发送请求
    searchFormList() {
      this.getData();
    },
    //下拉弹窗搜索单节课
    searchSingleList() {
      this.attr = 1;
      this.getData();
    },
    //下拉弹窗搜索多节课
    searchMoreList() {
      this.attr = 2;
      this.getData();
    },
    // 最新
    searchNewList() {
      this.prop = "time_add";
      this.order = "asc";
      this.getData();
    },
    searchAfterList() {
      this.prop = "time_add";
      this.order = "desc";
      this.getData();
    },
    //热度搜索
    searchHotList() {
      this.prop = "course_pv";
      this.order = "asc";
      this.getData();
    },
    searchHotListAfter() {
      this.prop = "course_pv";
      this.order = "desc";
      this.getData();
    },
    // 点击课程进入视频，并传送课程id给视频，进行处理操作
    pushSource(id, identification) {
      //identification标识符，传进视频播放页面后，便于区分是否进行学习上报
      this.$router.push({
        path: "/broadPages",
        query: {
          course_id: id,
          identification,
        },
      });
    },
  },
};
</script>

<style scoped>
.container {
  width: 1200px;
  margin: 0 auto;
  margin-top: 340px;
}
.contop {
  position: relative;
  width: 100%;
  height: 34px;
}
.contop h4 {
  font-size: 24px;
  line-height: 34px;
  font-weight: 600;
}
.smBox {
  position: absolute;
  right: 0;
  top: 7px;
  height: 20px;
  font-size: 14px;
  display: flex;
  justify-content: space-evenly;
}
.sm-control-box {
  position: relative;
  width: 81px;
  height: 100%;
  border-right: 2px solid #d8d8d8;
}
.sm-control-box span {
  position: absolute;
  left: 20px;
  top: 0;
}
.three {
  position: absolute;
  left: 0;
  top: 0;
}
.sm-control-box:last-child {
  border: none;
}
.position-change {
  position: absolute;
  right: 5px;
  top: -1px;
  cursor: pointer;
}
.change-position {
  position: absolute;
  right: 5px;
  bottom: -1px;
  cursor: pointer;
}
.three {
  font-size: 14px;
  color: #000;
}
.three:hover {
  color: #2ab18b;
}
.sch {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-height: 500px;
  margin-top: 24px;
}
.pa {
  width: 280px;
  height: 239px;
  border-radius: 8px;
  margin-bottom: 26px;
  margin-right: 20px;
  background-color: #fff;
  transition: all 0.5s;
}
.pa:hover {
  transform: translateY(-12px);
  cursor: pointer;
}
.jpg {
  position: relative;
  width: 100%;
  height: 140px;
  border-radius: 8px;
}
.img9 {
  width: 100%;
  height: 140px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  object-fit: cover;
}
.ke {
  display: block;
  position: absolute;
  right: 0;
  bottom: 0;
  width: 49px;
  height: 21px;
  background-color: #000;
  opacity: 70%;
  font-size: 12px;
  text-align: center;
  line-height: 21px;
  color: #fff;
  border-top-left-radius: 4px;
}
.introduce {
  width: 251px;
  height: 47px;
  margin-left: 14px;
  margin-top: 14px;
}
.people {
  position: relative;
  width: 251px;
  height: 18px;
  margin-left: 14px;
  margin-top: 7px;
  /* background-color: purple; */
  font-size: 14px;
}
.num1 {
  color: #777e90;
}
.num2 {
  position: absolute;
  left: 124px;
  top: 0;
  color: #2ab18b;
}
.decoration {
  text-decoration: none;
  color: #000;
}
.topNotice {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  margin: 0 auto;
  background: #2ab18b;
  font-size: 14px;
  color: #fff;
  white-space: nowrap;
}
#lit {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
#del {
  position: absolute;
  right: 12px;
  top: 12px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}
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
  color: #fff;
  cursor: pointer;
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
.iconfont {
  position: absolute;
  top: 35px;
  right: 2px;
  width: 12px;
  height: 12px;
  background-image: url("@/assets/img/15.png");
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
  width: 18px;
  height: 18px;
  right: 180px;
  top: 12px;
  cursor: pointer;
}
.user_img {
  width: 42px;
  height: 42px;
  margin: 0 40px;
  cursor: pointer;
}
:deep(.el-dropdown-menu__item:hover) {
  color: #2ab18b;
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
  margin: 13px auto;
}
.public {
  width: 116px;
  height: 100%;
  margin-right: 10px;
  justify-content: space-evenly;
  align-content: center;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  text-align: center;
  line-height: 50px;
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
.iconColor {
  color: #2ab18b;
}
.selectedActive {
  background: #2ab18b;
  border-radius: 40px;
}
#app {
  min-height: 100vh;
  background: #f0f2f5;
}
</style>
<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
body {
  width: 100%;
  height: 100%;
}
.el-input__inner {
  position: relative;
  border-radius: 40px;
}
</style>
