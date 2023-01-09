<template>
  <div id="windows">
    <div class="outSideBox">
      <el-container>
        <el-header style="height: 82px; width: 100%; background: #333131">
          <el-row
            :class="drawer == true && list.attribute == '2' ? 'put' : 'show'"
          >
            <el-col :span="5">
              <div
                style="height: 82px; cursor: pointer; z-index: 9999"
                class="backCourse"
                @click="backCourse"
              >
                <span class="returnFn"></span>返回课程
              </div>
            </el-col>
            <el-col :span="14">
              <div style="height: 82px" class="courseTitle">
                {{ list.title }}<span v-show="subtitle !== ''">---{{ subtitle }}</span>
              </div>
            </el-col>
            <el-col :span="5">
              <div style="height: 82px" class="hotPerson">
                <div class="pub">{{ list.course_uv }}人学习过</div>
                <div class="puba">{{ list.course_pv }}次学习热度</div>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <div
          class="videoPlayer"
          :class="drawer == true && list.attribute == '2' ? 'put' : 'show'"
        >
          <div
            class="foldEdge"
            @click="drawerChange"
            v-show="list.attribute == '2'"
            style="cursor: pointer"
          >
            <i
              class="iconfont icon-youbian"
              style="line-height: 52px; margin-left: 4px"
              v-show="drawer == true"
            ></i>
            <i
              class="iconfont icon-xiangzuo"
              style="line-height: 52px; margin-left: 4px"
              v-show="drawer == false"
            ></i>
          </div>

          <div
            class="sourcePlayer"
            @mouseleave="leaveVideo"
            @mouseenter="intoVideo"
          >
            <!-- 播放按钮 -->
            <img
              src="@/assets/img/20.png"
              alt=""
              class="playBtn"
              v-show="isPlaying"
              @click="playVideo"
              style="cursor: pointer; z-index: 9999"
            />
            <video-player
              class="video-player vjs-custom-skin video-js vjs-big-play-centered"
              ref="videoPlayer"
              :options="playerOptions"
              @play="onPlayerPlay($event)"
              @pause="onPlayerPause($event)"
              @ended="onPlayerEnded($event)"
              @waiting="onPlayerWaiting($event)"
              @playing="onPlayerPlaying($event)"
              @loadeddata="onPlayerLoadeddata($event)"
              @timeupdate="onPlayerTimeupdate($event)"
              @canplay="onPlayerCanplay($event)"
              @canplaythrough="onPlayerCanplaythrough($event)"
              @statechanged="playerStateChanged($event)"
              @ready="playerReadied"
            >
            </video-player>
            <!-- 进度条 -->
          </div>
        </div>
      </el-container>
    </div>
    <!-- <el-button @click="drawerChange" v-show="list.course_info.length !== 1" style="cursor: pointer !important;">打开</el-button> -->
    <!-- style="position:absolute;right:82px;top:-106px;z-index: 999;" -->
    <!-- 声音滑块 -->

    <el-drawer
      :visible.sync="drawer"
      :append-to-body="true"
      direction="rtl"
      v-show="list.attribute == '2'"
      :with-header="false"
      :modal="false"
      size="25%"
    >
      <!-- <div style="margin-top:30px;margin-left: 40px;font-size: 16px;color: #2ab18b;">{{list.course_uv}}人学习过</div>
  <div style="margin-top: 10px;margin-left:40px;font-size: 12px;color: #777E90;">{{list.course_pv}}次学习热度</div> -->
      <div
        style="
          font-size: 20px;
          font-weight: 600;
          color: #fff;
          margin-top: 100px;
          margin-left: 40px;
        "
      >
        系列课目录
      </div>
      <div class="drawer-innerBox">
        <div
          class="innerText"
          v-for="(item, index) in list.course_info"
          :key="item.id"
          @click="videoPlay(item)"
        >
          <h5>{{ index + 1 }}.</h5>
          <img
            src="@/assets/img/25.png"
            alt=""
            class="inner-img img-hover"
            v-if="item.is_watch == 0"
          />
          <img src="@/assets/img/24.png" alt="" class="inner-img "  v-else-if="item.is_watch == 1" />
          <img
            src="@/assets/img/26.png"
            alt=""
            class="inner-img"
            v-else
          />

          <el-tooltip
            :content="index + 1 + '：' + item.video_title"
            placement="left"
          >
            <span class="fitStyle">{{ item.video_title }}</span>
          </el-tooltip>
          <!-- 使用过滤器将时间进行转换 -->
          <span>{{ item.video_duration | timeFilters }}</span>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import "vue-video-player/src/custom-theme.css";
import "video.js/dist/video-js.css";
import "video.js";
import { videoPlayer } from "vue-video-player";
import dayjs from "dayjs";
export default {
  components: { videoPlayer },
  data() {
    return {
      list: {}, //存放请求回来的标题数据...
      controlList: {}, //
      drawer: true, //侧边栏控制字段
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。--- 不全屏播放的时候是否禁止声音外放
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN", //语言
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            //application/x-mpegURL
            type: "video/mp4",
            src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm",
          },
        ],
        poster: "", // 你的封面地址
        //width: document.documentElement.clientWidth, // 播放器宽度
        notSupportedMessage: "此视频暂时无法播放，请稍后再进行尝试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        // controlBar: this.controlBar,
        // hls: true,
      },
      // 记录当前播放时间
      nowPlayer: null,
      isPlaying: true, //控制播放按钮的元件
      showControlBar: true, //视频播放栏控制栏的显示字段
      inVideoBox: 1, //鼠标位置是否在播放器里面
      speedShow: false, //播放速度显隐控制
      speed: "", //存放用户选择的播放速度的字段
      pauseHide: false, //暂停按钮的显示隐藏
      voice: 40, //声音音量调节
      voiceHide: false, //声音调节栏的显隐
      currentTime: "00:00:00", //当前播放的时间
      totalTime: "00:00:00", //视频总时长
      stayTime: 0, //页面停留的事件字段
      unoperatedTime: 0, //用户未操作时间
      lastTime: null, // 用户最后一次操作的时间
      currentTiming: null, //用户点击开始播放后进行计算
      timeOut: 5 * 60 * 1000, //设置超时时间，5分钟，未进行操作，弹窗出现
      leaveTab: false, //是否离开窗口
      data: [], //学习上报的数据
      course_id: "", //学习上报的课程id
      video_id: "", //学习上报的视频资源id(需要判定是默认打开的视频还是切换视频后的id)
      study_time: 0, //学习上报的学习时间秒数
      date: "", //学习上报的日期，当天日期
      is_watch:0, //观看状态(是否观看过)
      subtitle:"", //系列课目录下的副标题
      countDownTime:0//倒计时时间
    };
  },
  mounted() {
    this.getTitle(); //默认获取视频数据
    window.addEventListener("visibilitychange", this.visibilityToggle); //监听切换窗口
    window.addEventListener("keyup", this.keyup); //监听键盘按下事件，展开全屏或视频暂停
  },
  beforeDestroy() {
    //在页面被摧毁时，移除全局监听的事件
    window.removeEventListener("visibilitychange", this.visibilityToggle);
    window.removeEventListener("keyup", this.keyup);
  },
  computed: {
    // 当前播放对象实例
    videoObj() {
      return this.$refs.videoPlayer.player;
    },
  },
  filters: {
    //时间过滤器
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
  },
  methods: {
    //传入id获取数据
    getTitle() {
      this.$http
        .post("/home/play", {
          course_id: this.$route.query.course_id,
        })
        .then((res) => {
          let data = res.data.data.list;
          this.list = data;
          this.playerOptions.poster =
            process.env.VUE_APP_URL + this.list.course_cover_url;
          this.assignment(); //处理赋值
        });
    },
    //处理学习上报的默认赋值
    assignment() {
      this.course_id = Number(this.list.id);
      this.video_id = Number(this.list.course_info[0].id); //默认赋值video_id为第一项的(如果用户切换了视频后再重新赋值)
      this.date = dayjs(new Date().getTime()).format("YYYY-MM-DD");
      this.is_watch = this.list.course_info[0].is_watch
    },
    //返回课程按钮
    backCourse() {
      this.$router.back();
    },
    //系列课侧边栏显隐
    drawerChange() {
      if (this.drawer == false) {
        this.drawer = true;
      } else {
        this.drawer = false;
      }
    },
    //获取视频源
    videoPlay(item) {
      this.video_id = item.id; //这里是当切换了视频源之后重新赋值切换后的视频id
      this.is_watch = item.is_watch //切换视频源后重新赋值观看状态
      //切换视频后需要将标题跟着一起切换过去
      this.subtitle = item.video_title
      this.$http
        .post("/play/url", {
          course_id: item.course_id,
          video_id: item.id,
        })
        .then((res) => {
          if (res.data.data == null) {
            this.$message.error(res.data.message);
          } else {
            //进行赋值url操作
          }
        });
    },

    //鼠标离开视频播放界面
    leaveVideo() {
      if (this.isPlaying == true) {
        this.showControlBar = true;
        this.pauseHide = false;
      } else {
        this.showControlBar = false;
      }
      this.speedShow = false;
      this.voiceHide = false;
    },
    //鼠标进入视频播放界面
    intoVideo() {
      this.showControlBar = true;
    },
    //播放按钮的点击事件(后期需要配合视频播放器进行禁用按钮等操作)
    playVideo() {
      // 前置校验，当视频不能播放的时候,禁用按钮
      this.$refs.videoPlayer.player.play();
      if (this.drawer == true) {
        this.drawer = false;
      } else {
        this.drawer = false;
      }
      this.isPlaying = false;
      this.pauseHide = true;
    },
    //学习上报
    studyUpload() {
      //不足60s不进行上报
      let data = [
        {
          course_id: this.course_id,
          video_id: this.video_id,
          date: this.date,
          study_time: this.study_time,
        },
      ];
      //判断条件为首页进入的标识符和观看状态(is_watch为1的时候，用户观看过就不进行学习上报,没有观看过在进行学习上报)
      if (this.$route.query.identification !== undefined && this.is_watch !== 1){
        this.$http.post("/study/report", { data }).then((res) => {
          //当传送成功了之后,就将学习时间清0
          if(res.data.message == 'success'){
            this.study_time = 0 
          }
        });
      }
    },
    // 播放回调
    onPlayerPlay(player) {
      this.isPlaying = false; //同步开始播放的按钮事件
      //开始播放后，需要全局监听切屏事件，1分钟进行学习上报一次，5分钟内未进行操作，弹窗提醒
      //播放时就开启定时器
      this.waitTimer = setInterval(()=>{
          this.countDownTime++
          if(this.countDownTime == 60){
            this.study_time = this.countDownTime
            this.studyUpload()
            //clearInterval(this.waitTimer)
            this.countDownTime = 0
          }
        },1000)

      if (this.nowPlayer) {
        player.currentTime(this.nowPlayer);
      }
    },
    //观看视频中切出窗口的提醒
    visibilityToggle() {
      if (document.visibilityState == "hidden") {
        if (this.isPlaying == true && this.nowPlayer !== null && this.$route.query.identification !== undefined) return;
      } else if (document.visibilityState == "visible" && this.$route.query.identification !== undefined) {
        //切回来的时候进行的处理(切回来后在进行处理，避免用户暂停后切出去还是会出现提示框，必须在播放的时候切出去才有提示),同时还需要满足是首页点进来的视频才进行校验,预览视频就不进行校验
        this.leaveTab = true;
        this.$refs.videoPlayer.player.pause(); //切出去暂停
        if (this.isPlaying == true && this.nowPlayer !== null) return;
        if (this.leaveTab) {
          this.leaveTab = false;
          //首页传进来的特殊标识符，预览页面不进行处理(并且在视频已经开始播放的时候，在进行处理)
          if (this.$route.query.identification && this.nowPlayer !== null) {
            this.$message.warning(
              "系统检测到您离开了当前页面,已自动将视频暂停"
            );
          }
        }
      }
    },
    //键盘按下事件
    keyup(e) {
      //按下enter全屏
      if (e.code == "Enter") {
        this.$refs.videoPlayer.player.requestFullscreen();
      } else if (e.code == "Space") {
        // 按下space根据视频播放状态来判定暂停还是播放
        if (this.isPlaying == false) {
          this.$refs.videoPlayer.player.pause();
        } else {
          this.$refs.videoPlayer.player.play();
        }
      }
    },
    // 暂停回调
    onPlayerPause() {
      clearInterval(this.waitTimer)
      //暂停时，展现播放原件
      this.isPlaying = true;
      // this.drawer = true;
    },
    // 视频播完回调
    onPlayerEnded() {
      clearInterval(this.waitTimer)
      this.study_time = this.countDownTime
      this.studyUpload();
      this.nowPlayer = null;
      //视频播放完成后,也需要上报一次，有可能视频时间 % 60 !== 0
    },
    // DOM元素上的readyState更改导致播放停止
    //这里当用户拖动进度条时会触发
    onPlayerWaiting() {
    },
    // 已开始播放回调
    onPlayerPlaying() {
    },
    // 当播放器在当前播放位置下载数据时触发
    onPlayerLoadeddata() {
      // 直播每次播放都会调用--录播只是刚开始调用一次
    },
    // 当前播放位置发生变化时触发。
    onPlayerTimeupdate(player) {
      // 获取到当前的播放时间
      this.nowPlayer = player.currentTime();
      //this.nowPlayer拿到的是播放进度时间的进度条
    },

    //媒体的readyState为HAVE_FUTURE_DATA或更高
    onPlayerCanplay() {
      
    },
    //媒体的readyState为HAVE_ENOUGH_DATA或更高。这意味着可以在不缓冲的情况下播放整个媒体文件。
    onPlayerCanplaythrough() {
    },

    //播放状态改变回调
    playerStateChanged(){
      //这里可以拿到播放的的状态
      
    },

    //将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数。。
    playerReadied() {
      
    },
  },
};
</script>

<style scoped>
#windows {
  min-height: 100vh;
  background: #000;
}
.backCourse {
  line-height: 82px;
  color: #2ab18b;
  font-size: 16px;
  cursor: pointer;
}
.returnFn {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-image: url("@/assets/img/19.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  transform: translateY(7px);
}
.courseTitle {
  line-height: 82px;
  text-align: center;
  font-size: 18px;
  color: #fff;
}
.hotPerson {
  display: flex;
  flex-wrap: wrap;
}
.pub {
  width: 100%;
  height: 41px;
  line-height: 66px;
  text-align: center;
  color: #2ab18b;
  font-size: 14px;
  white-space: nowrap;
}
.puba {
  width: 100%;
  height: 41px;
  line-height: 20px;
  text-align: center;
  color: #777e90;
  font-size: 12px;
  white-space: nowrap;
}
.drawer-innerBox {
  margin-top: 50px;
  margin-left: 40px;
  height: 600px;
  font-size: 14px;
  overflow-y: scroll;
}
.drawer-innerBox::-webkit-scrollbar {
  display: none;
}
.innerText {
  display: flex;
  width: 100%;
  height: 30px;
  margin-top: 10px;
  line-height: 30px;
  color: #fff;
  cursor: pointer;
}
.innerText:hover {
  color: #2ab18b;
}
.innerText:hover .img-hover {
  content: url("@/assets/img/26.png");
}
.innerText h5 {
  font-weight: normal;
  margin-right: 20px;
  font-size: 14px;
}
.fitStyle {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 10px;
  margin-right: 35px;
}
.inner-img {
  width: 16px;
  height: 16px;
  margin-top: 7px;
}
.foldEdge {
  position: absolute;
  right: 0;
  width: 24px;
  height: 52px;
  background: rgba(51, 49, 49, 0.7);
  border-radius: 4px 0px 0px 4px;
  z-index: 999;
}
.videoPlayer {
  position: relative;
  height: 91vh;
}
.sourcePlayer {
  width: 100%;
  height: 91vh;
  background: pink;
}

.outSideBox {
  position: relative;
}
.playBtn {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 146px;
  height: 146px;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 999;
}
.process-bar {
  width: 100%;
  height: 90px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    rgba(0, 0, 0, 0.9)
  );
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 999;
}
.progress-box {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%);
  width: 98%;
  height: 6px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.3);
}
.process-green {
  position: absolute;
  top: 0;
  left: 0;
  max-width: 100%;
  height: 6px;
  background: #67c23a;
}
.ponit {
  width: 10px;
  height: 10px;
  background: #ffffff;
  border-radius: 100px;
  position: absolute;
  top: -2px;
  right: -10px;
}
.icon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
  margin-left: 18px;
  cursor: pointer;
}
.icons {
  width: 16px;
  height: 16px;
  margin-left: 20px;
  margin-right: 20px;
  cursor: pointer;
  color: #fff;
}
.item {
  line-height: 40px;
  height: 40px;
  text-align: center;
}
.list {
  position: absolute;
  bottom: 50px;
  right: -14px;
  background: rgba(51, 49, 49, 0.7);
  width: 50px;
  height: 160px;
}
.put {
  transition: width 0.35s;
  width: calc(100% - 25%);
}
.show {
  width: 100%;
  transition: width 0.35s;
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
  /* background: #201f1f; */
}
.el-drawer__body {
  background: #201f1f;
}
.video-js {
  /* min-width: 1344px; */
  z-index: 0;
  position: absolute;
  width: 100%;
  height: 91vh;
  /* width: 75vw;
  height: 91vh; */
}
/* 播放按钮禁止 */
.vjs-custom-skin > .video-js .vjs-big-play-button {
  display: none;
}
.el-tooltip__popper.is-dark {
  color: rgb(42, 177, 139);
}
/* .video-js.vjs-fluid, .video-js.vjs-16-9, .video-js.vjs-4-3, .video-js.vjs-9-16, .video-js.vjs-1-1{
  width: 0%;
} */
.vjs_video_1165-dimensions.vjs-fluid {
  padding-top: 0;
}
.vjs-fluid:not(.vjs-audio-only-mode) {
  padding-top: 0;
}
.vjs-error .vjs-error-display:before {
  content: "";
}
.video-js.vjs-fluid:not(.vjs-audio-only-mode),
.video-js.vjs-16-9:not(.vjs-audio-only-mode),
.video-js.vjs-4-3:not(.vjs-audio-only-mode),
.video-js.vjs-9-16:not(.vjs-audio-only-mode),
.video-js.vjs-1-1:not(.vjs-audio-only-mode) {
  height: 91vh;
}
.el-slider.is-vertical .el-slider__runway {
  position: absolute;
  right: 28px;
  top: -46px;
  z-index: 999;
  background: rgba(51, 49, 49, 0.7);
}
.el-container.is-vertical {
  background: #000;
}
.vjs-custom-skin > .video-js .vjs-control-bar {
  /* display: none; */
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    rgba(0, 0, 0, 0.9)
  );
}
.video-js .vjs-slider {
  background-color: rgba(255, 255, 255, 0.3);
}
.vjs-custom-skin > .video-js .vjs-play-progress,
.vjs-custom-skin > .video-js .vjs-volume-level {
  background-color: #67c23a;
}
</style>
