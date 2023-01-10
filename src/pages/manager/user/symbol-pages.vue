<template>
  <div>
   <controlComponents></controlComponents>
    <!-- 学习历史纪录菜单栏 -->
    <!-- 顶部面包屑 -->
    <!-- 中部学习总时长栏 -->
    <div class="middle-time">
      <span class="history">学习历史记录</span>
      <span class="time1"
        >学习总时长
        <p>{{this.changeResult}}</p></span
      >
    </div>
    <!-- 底部学习历史记录栏 -->
    <div class="footer-study">
      <!-- 详情栏 -->
      <!-- 顶部日期 -->
      <h1 v-if="this.value1 !== ''">{{ this.value1 }}</h1>
      <h1 v-else>{{ this.today }}</h1>
      <!-- 日期下的盒子,内容渲染出来 -->
      <div class="date-bottomBox" v-for="ol in el" :key="ol.id">
        <el-timeline reverse>
    <el-timeline-item
      :timestamp="ol.time1">
    </el-timeline-item>
       </el-timeline>
        <!-- 月份下的当天日期 -->
        <h4>{{ ol.date | monthFilters }}</h4>
        <!-- 图片 -->
        <img :src="ol.course_cover_url" alt="" class="img3" />
        <!-- 标题 -->
        <h5>{{ ol.title }}</h5>
        <!-- 学习时长 -->
        <h6>学习时长{{ ol.study_time_long | timeFilters }}</h6>

      </div>
      <!-- 日期选择器 -->
      <div class="date-time">
        <el-date-picker
          v-model="value1"
          type="month"
          placeholder="选择月"
          size="small"
          value-format="yyyy年MM月"
          @change="chooseDate"
        >
        </el-date-picker>
      </div>
      <el-empty description="暂无更多数据了"></el-empty>
    </div>
    <!-- 右侧边栏 -->
    <div class="right-asideBar">
      <!-- 板块热度echarts图表 -->
      <div class="echarts">
        <span class="font-public">板块热度占比</span>
        <!-- 图表区域 -->
        <div class="echarts-content"></div>
      </div>
      <!-- 课程TOP榜 -->
      <div class="top">
        <span class="font-public">课程TOP榜</span>
        <div class="big-bottomBox"></div>
      </div>
    </div>
  </div>
</template>

<script>
import controlComponents from '@/components/control/control-components.vue'
// let echarts = require('echarts')
import echarts from "echarts";
// import dayjs from "dayjs";
export default {
  components:{controlComponents},
  data() {
    return {
      el: [],
      value1: "",
      user_id: "",
      hotSearch: {},
      classTop: [],
      today: "",
      days:"",
      page:1,
      page_size:16,
      seconds:"",
      changeResult:""
    };
  },
  mounted() {
    this.init();
    this.getHotSearch();
    this.getTime();
    this.getHistory()
    this.user_id = JSON.parse(localStorage.getItem("user_id"));
  },
  filters:{
        //秒数时间过滤器
      timeFilters(val) {
      //此处的val接收的就是item.video_duration
      var t = "";
      if (val > -1) {
        var hour = Math.floor(val / 3600);
        var min = Math.floor(val / 60) % 60;
        var sec = val % 60;
        if (hour < 10) {
          t = "0" + hour + ":";
        } else {
          t = hour + ":";
        }
        if (min < 10) {
          t += "0";
        }
        t += min + ":";
        if (sec < 10) {
          t += "0";
        }
        t += sec.toFixed(0);
      }
      return t;
    },
    //日期时间过滤器
    monthFilters(val){
      let total = val.toString()
      let year = total.substring(0,4)
      let month = total.substring(4,6)
      let day = total.substring(6,8)
      let result = `${year}年${month}月${day}日`
      return result
    }
  },
  methods: {
    //课程TOP榜的数据请求
    init() {
      this.$http
        .post("/study/courseTop", { user_id: localStorage.getItem("user_id") })
        .then((res) => {
          this.classTop = res.data.data.data;
          this.picture();
        });
    },
    //板块热度占比的数据请求
    getHotSearch() {
      this.$http
        .post("/study/hotRate", { user_id: localStorage.getItem("user_id") })
        .then((res) => {
          this.hotSearch = res.data.data.data;
          this.drawline();
        });
    },
    //课程TOP榜
    drawline() {
      let myChart = echarts.init(document.querySelector(".echarts-content"));
      myChart.setOption({
        series: [
          {
            name: "Nightingale Chart",
            type: "pie",
            radius: [40, 160],
            center: ["50%", "50%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 8,
            },
            data: [
              {
                value: this.hotSearch[1].rate * 100,
                name: `${this.hotSearch[1].cate}${
                  this.hotSearch[1].rate * 100 + 0.01
                }%`,
              },
              {
                value: this.hotSearch[2].rate * 100,
                name: `${this.hotSearch[2].cate}${
                  this.hotSearch[2].rate * 100
                }%`,
              },
              {
                value: this.hotSearch[0].rate * 100,
                name: `${this.hotSearch[0].cate}${
                  this.hotSearch[0].rate * 100
                }%`,
              },
              {
                value: this.hotSearch[3].rate * 100,
                name: `${this.hotSearch[3].cate}${
                  this.hotSearch[3].rate * 100
                }%`,
              },
              {
                value: this.hotSearch[4].rate * 100,
                name: `${this.hotSearch[4].cate}${
                  this.hotSearch[4].rate * 100
                }%`,
              },
            ],
          },
        ],
      });
    },
    //板块热度占比
    picture() {
      let myCharts = echarts.init(document.querySelector(".big-bottomBox"));
      myCharts.setOption({
        tooltip: {
          show: true,
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
        },
        grid: {
          width: 523,
          right: 0,
        },

        label: {
          show: true,
          color: "#000",
          fontSize: 12,
          position: "right",
          height: 100,
          offset: [0, 0],
        },
        xAxis: {
          type: "value",
          show: false,
        },
        yAxis: {
          type: "category",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            width: 311,
            margin: 24,
            color: "#606266",
            showMaxLabel: true,
          },
          nameTextStyle: {
            width: 311,
          },
          data: [
            this.classTop[0].course_title,
            this.classTop[1].course_title,
            this.classTop[2].course_title,
            this.classTop[3].course_title,
            this.classTop[4].course_title,
            this.classTop[5].course_title,
            this.classTop[6].course_title,
            // this.classTop[7].course_title,
            // this.classTop[8].course_title,
            // this.classTop[9].course_title,
          ],
        },
        series: [
          {
            data: [
              {
                value: this.classTop[0].course_pv,
                itemStyle: {
                  color: "#A8ABB2",
                },
              },
              {
                value: this.classTop[1].course_pv,
                itemStyle: {
                  color: "#A8ABB2",
                },
              },
              {
                value: this.classTop[2].course_pv,
                itemStyle: {
                  color: "#A8ABB2",
                },
              },
              {
                value: this.classTop[3].course_pv,
                itemStyle: {
                  color: "#A8ABB2",
                },
              },
              {
                value: this.classTop[4].course_pv,
                itemStyle: {
                  color: "#A8ABB2",
                },
              },
              {
                value: this.classTop[5].course_pv,
                itemStyle: {
                  color: "#A8ABB2",
                },
              },
              {
                value: this.classTop[6].course_pv,
                itemStyle: {
                  color: "#2AB18B",
                },
              },
              //在数据传入时进行排序，下面三项放最大的
              // {
              //   value: this.classTop[7].course_pv,
              //   itemStyle: {
              //     color: "#2AB18B",
              //   },
              // },
              // {
              //   value: this.classTop[8].course_pv,
              //   itemStyle: {
              //     color: "#2AB18B",
              //   },
              // },
              // {
              //   value: this.classTop[0].course_pv,
              //   itemStyle: {
              //     color: "#2AB18B",
              //   },
              // },
            ],
            type: "bar",
          },
        ],
      });
    },
    // 处理默认显示时间为本月时间
    getTime() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month > 9 ? month : "0" + month;
      let today = year + "年" + month + "月";
      let days = year+"-"+month
      this.days = days
      this.today = today;
    },
    //获取历史记录
    getHistory(){
      this.$http.post('/study/log',
      {
        month:this.days,
        page:this.page,
        page_size:this.page_size
      }
      ).then((res)=>{
        this.el = res.data.data.list
        this.seconds = res.data.data.study_time
        this.changeTime()
      })
      
    },
    //转换秒为时+分+秒
    changeTime(){
      let secondTime = this.seconds;// 秒
        let minuteTime = 0;// 分
        let hourTime = 0;// 小时
        if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
            //获取分钟，除以60取整数，得到整数分钟
            minuteTime = parseInt(secondTime / 60);
            //获取秒数，秒数取余，得到整数秒数
            secondTime = parseInt(secondTime % 60);
            //如果分钟大于60，将分钟转换成小时
            if(minuteTime > 60) {
                //获取小时，获取分钟除以60，得到整数小时
                hourTime = parseInt(minuteTime / 60);
                //获取小时后取余的分，获取分钟除以60取余的分
                minuteTime = parseInt(minuteTime % 60);
            }
          }
          let result = "" + parseInt(secondTime);
          if(secondTime > 0){
            result = "" + parseInt(secondTime) + "秒"
          }
          if(minuteTime > 0) {
          result = "" + parseInt(minuteTime) + "分" + result;
         }
          if(hourTime > 0) {
         result = "" + parseInt(hourTime) + "小时" + result;
         }
         this.changeResult = result
    },
    //时间选择后，展示不同的数据
    chooseDate(val){
      let t = val.substring(0,4)
      let d = val.substring(5,7)
      this.days = `${t}-${d}`
      this.getHistory()
    }
  },
};
</script>

<style scoped>

.middle-time {
  position: absolute;
  left: 216px;
  top: 138px;
  width: 740px;
  height: 59px;
  background: #fff;
  border-radius: 8px;
}
.history {
  font-size: 16px;
  color: #23262f;
  font-weight: 600;
  margin-left: 24px;
  line-height: 59px;
}
.time1 {
  font-size: 14px;
  color: #23262f;
  line-height: 59px;
  margin-left: 400px;
}
.time1 p {
  display: inline-block;
  line-height: 59px;
  color: #2ab18b;
}
.footer-study {
  position: absolute;
  left: 216px;
  top: 213px;
  width: 740px;
  height: 833px;
  background: #fff;
  overflow-y: scroll;
}
.footer-study::-webkit-scrollbar {
  display: none;
}
.footer-study h2 {
  font-size: 16px;
  font-weight: normal;
  margin: 30px 300px;
  color: #606266;
}
.date-bottomBox {
  width: 385px;
  height: 219px;
  margin-left: 45px;
  /* margin-top: 20px; */
}
.date-bottomBox h4 {
  margin-left: 24px;
  color: #606266;
}
.img3 {
  width: 224px;
  height: 109px;
  margin-top: 12px;
  margin-left: 24px;
}
.date-bottomBox h5 {
  margin-left: 24px;
  margin-top: 12px;
  color: #606266;
}
.date-bottomBox h6 {
  color: #2ab18b;
  margin-left: 24px;
  margin-top: 9px;
}
.date-time {
  position: absolute;
  left: 582px;
  top: 26px;
}
.date-time >>> .el-input__inner {
  width: 135px;
  height: 32px;
}
.footer-study h1 {
  font-size: 16px;
  margin-left: 23px;
  margin-top: 30px;
}
.right-asideBar {
  position: absolute;
  top: 138px;
  left: 972px;
  width: 932px;
}
.echarts {
  width: 100%;
  height: 457px;
  background: #fff;
  margin-bottom: 16px;
}
.echarts-content {
  position: absolute;
  left: 130px;
  top: 13px;
  width: 672px;
  height: 406px;
  /* background: pink; */
}
.top {
  position: relative;
  width: 100%;
  height: 435px;
  background: #fff;
}
.big-bottomBox {
  width: 849px;
  height: 313px;
  position: absolute;
  left: 31px;
  top: 78px;
}
.font-public {
  display: block;
  padding-left: 24px;
  padding-top: 24px;
  font-size: 16px;
  color: #23262f;
  font-weight: 600;
}

</style>
<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
*::-webkit-scrollbar {
	display: none;
}
body {
  background: #f0f2f5;
}
.el-timeline-item__node{
  top: 25px;
  background-color: #2AB18B;
}
.el-timeline-item__wrapper{
  display: none;
}
.time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
  /* .el-empty{
    margin-top: 240px;
  } */
</style>
