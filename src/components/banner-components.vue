<template>
  <div>
    <div class="container">
      <!-- 后端反数据 4栏布局保持不变更 -->
      <!-- 头部通栏 -->
      <div class="contop" v-show="this.list.page === 1">
        <!-- 左边标题 -->
        <h4>精品课程</h4>
        <!-- 右侧图标 -->
        <div class="smBox">
          <span class="one" @click="turn">最新 <i></i></span>
          <p>|</p>
          <span class="two" @click="change">热门 <i></i></span>
        </div>
      </div>
      <!-- 底部4栏布局 -->
      <!-- 外部大盒子 -->
      <!-- 在这里传入点击进去的id后获得视频url和视频标题 -->
        <div class="sch">
          <!-- 内部的一个盒子 -->
          <div v-for="(item, index) in list" :key="index">
            <router-link :to="{
              path:'/broadPages',
              query:{
                course_id:item.id
              }
            }" class="decoration">
            <div class="into pa">
              <!-- 课程图片 -->
              <div class="jpg">
                <img
                  :src="'http://192.168.21.159:9000' + item.course_cover_url"
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
          </router-link>
          </div>
        </div>
    </div>
    <!-- <el-backtop target=".page-component__scroll .el-scrollbar__wrap" :bottom="100">
    <div
      style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
        background-image: url('@/assets/img/16.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }"
    >
    up
    </div>
  </el-backtop> -->
  </div>
</template>

<script>
// import { query } from 'express';
// import path from 'path';

export default {
  data() {
    return {
      list: {},
      Attr: "",
      order: "",
      page: 1,
      page_size: 16,
      posid: 1,
      prop: "",
      cate:"0",
      total:"",
      id:[]
    };
  },
  mounted() {
    this.getData();
    // this.getListform()
  },
  methods: {
    turn() {
      alert(111);
    },
    change() {
      alert(222);
    },
    // 打开页面时请求的数据
    async getData() {
      const res = await this.$http.post("/home/index", {
        Attr: this.Attr,
        order: this.order,
        page: this.page,
        page_size: this.page_size,
        posid: this.posid,
        prop: this.prop,
        cate:this.cate 
      });
      this.list = res.data.data.list;
      this.total = res.data.data.list.total
      // console.log(this.list.length,99999)
      this.scroll();
      console.log(this.list,8767);
    },
    //页面滚动时，利用分页功能，循环发送请求加载的页面
    scroll() {
      let isLoading = false;
      window.onscroll = async () => {
        //offsetHeight:可视区域的高度，包含了border和滚动条
        //scrollTop:滚动后被隐藏的高度,获取对象相对于由offsetHeight属性指定的父坐标距离顶端的高度
        //innerHeight:文档显示区域的高度
        let bottomOfWindow =
          document.documentElement.offsetHeight -
            document.documentElement.scrollTop -
            window.innerHeight <=
          10;
        if (bottomOfWindow && isLoading == false) {
          // this.page = this.page + 1;
          const res = await this.$http.post("/home/index", {             
            Attr: this.Attr,
            order: this.order,
            page: this.page=this.page+1,
            page_size: this.page_size,
            posid: this.posid,
            prop: this.prop,
            cate:this.cate });
            console.log(res.data.data.list.length,878788888)
          const length = res.data.data.list.length
          if (length > 10) {
            this.list.push(...res.data.data.list);
            isLoading = true;
            // if(res.data.data.list === null){
            //   isLoading = false 
            // }
          } 
          else {
            this.$notify({
              title: "温馨提示",
              message: "暂无更多数据信息",
              position: "bottom-right",
            });
            isLoading = false;
          }
        }
      };
    },
    // getListform(){
    //   this.$http.post(('/home/index'),{
    //     Attr: this.Attr,
    //     order: this.order,
    //     page: this.page,
    //     page_size: this.page_size,
    //     posid: this.posid,
    //     prop: this.prop,
    //     cate:"产品经理"
    //   }).then((res)=>{
    //     console.log(res.data,7890123)
    //   })
    // }
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
  width: 144px;
  height: 20px;
}
.one {
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
}
.smBox p {
  position: absolute;
  left: 62px;
  top: 0;
  color: #d8d8d8;
}
.two {
  position: absolute;
  right: 20px;
  top: 0;
  cursor: pointer;
}
.sch {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 24px;
  /* flex-direction: row; */
  /* background-color: pink; */
  /* justify-content: space-evenly; */
  /* justify-content: auto; */
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
  transform: translateX(8px);
  transform: translateY(-8px);
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

  /* background-color: green; */
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
</style>
<style>
body {
  background: #f0f2f5;
}
</style>
