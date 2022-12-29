<template>
  <div>
    <!-- 播放页大盒子 -->
    <div class="bigBox">
      
      <!-- 顶部 -->
      <div class="top">
        <!-- 返回课程按钮 -->
          <div class="returnFn" @click="backToCourse" style="cursor: pointer;"></div>
          <span class="return" @click="backToCourse" style="cursor: pointer;">返回课程</span>

        <!-- 当前播放的内容的标题,后期后端数据渲染 -->
        <span class="introduce"
          >{{this.title}}</span
        >
        <span class="study">{{this.course_uv}}人学习过</span>
        <p class="hot">{{this.course_pv}}次学习热度</p>
      </div>
      <!-- 播放器 -->
      <div class="broadCast">
        <video :src="'http://172.168.11.229:9000' + this.videoSrc" controls width="100%" height="100%"></video>
        <!-- <video-player
          class="video-player vjs-custom-skin video-js vjs-big-play-centered"
          ref="videoPlayer"
          :playsinline="playsinline"
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
        </video-player> -->
      </div>
       <!-- 按钮切换显隐 -->
       <div class="toggle-btn" @click="toggleClass" :class="{toggleBtnActive:drawer == false?1:0}" v-show="this.attribute == 2">
        <img src="@/assets/img/28.png" alt="" style="width:10px;height: 20px;margin-top: 15px;margin-left: 7px;">
       </div>

      <el-drawer title="侧边栏" :visible.sync = "drawer" :with-header="false" :modal="false" :append-to-body="true" v-show="this.attribute == 2">

        <h5 class="moreClassTitle">系列课目录</h5>
        <div class="spareInfo">
           <div class="spareInfo-smallBox" v-for="(item,index) in course_info" :key="index" @click="pushVideoSource(item.course_id,item.id)">
          <span>{{index+1}}.</span>
          <img src="@/assets/img/25.png" alt="" class="box-img" v-if="item.is_watch == 1">
          <img src="@/assets/img/26.png" alt="" class="box-img" v-else-if="item.is_watch == 2">
          <img src="@/assets/img/24.png" alt="" class="box-img" v-else>
          <div class="title-box">
            <span>{{item.video_title}}</span>
          </div>
          <h6>{{item.video_duration}}秒</h6>
          </div>
        </div>
      
      </el-drawer>

    </div>
  </div>
</template>

<script>
import "vue-video-player/src/custom-theme.css";
import "video.js/dist/video-js.css";
import "video.js";
// import { videoPlayer } from "vue-video-player";
export default {
  // components: { videoPlayer },
  props: {
    // 当前的options 配置
    selfOptions: Object,
    // 播放速度
    playbackRates: {
      type: Array,
      default: () => [0.7, 1.0, 1.5, 2.0],
    },
    // 封面
    poster: {
      type: String,
      // https://cz-video-photo.oss-cn-beijing.aliyuncs.com/20191108/aca6e6915d369e07db055127d3e3738c00001.jpg
      default: "",
    },
    // 视频无法播放时提示信息
    notSupportedMessage: {
      type: String,
      default: "此视频暂无法播放，请稍后再试!!!",
    },
    // 视频显示比例
    aspectRatio: {
      type: String,
      default: "16:9",
    },
    // 语言设置
    language: {
      type: String,
      default: "zh-CN",
    },
    // 设置controBar
    controlBar: {
      type: Object,
      default: () => ({
        timeDivider: true, // 当前时间和持续时间的分隔符
        durationDisplay: true, // 时长显示
        remainingTimeDisplay: false, // 剩下时间
        currentTimeDisplay: true, // 当前时间
        volumeControl: true, // 声音控制键
        playToggle: true, // 暂停和播放键
        progressControl: true, // 进度条
        fullscreenToggle: true, // 全屏按钮
      }),
    },
    // 数据源
    sources: {
      type: Array,
      default: () => [
        {
          type: "video/mp4",
          src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm",
        },
      ],
    },
    // 是否循环播放
    loop: Boolean,
    // 是否在不全屏状态下外放声音
    muted: Boolean,
    // 是否浏览器 准备好后自动播放
    autoplay: Boolean,
    // 是否直播
    isLive: Boolean,
  },

  data() {
    return {
      list: [
        {
          id: 1,
          content: "经典电影中的美术应用",
          time: "21分40秒",
        },
        {
          id: 2,
          content: "经典电影中的美术应用",
          time: "21分40秒",
        },
        {
          id: 3,
          content: "经典电影中的美术应用",
          time: "21分40秒",
        },
        {
          id: 4,
          content: "经典电影中的美术应用",
          time: "21分40秒",
        },
        {
          id: 5,
          content: "经典电影中的美术应用",
          time: "21分40秒",
        },
        {
          id: 6,
          content: "经典电影中的美术应用",
          time: "21分40秒",
        },
        {
          id: 7,
          content: "经典电影中的美术应用",
          time: "21分40秒",
        },
        {
          id: 8,
          content: "经典电影中的美术应用",
          time: "21分40秒",
        },
        {
          id: 9,
          content: "经典电影中的美术应用",
          time: "21分40秒",
        },
        {
          id: 10,
          content: "经典电影中的美术应用",
          time: "21分40秒",
        },
        {
          id: 11,
          content: "经典电影中的美术应用",
          time: "21分40秒",
        },
        {
          id: 12,
          content: "经典电影中的美术应用",
          time: "21分40秒",
        },
        {
          id: 13,
          content: "经典电影中的美术应用",
          time: "21分40秒",
        },
      ],
      //当前视频链接，需要与下面播放的路径进行绑定动态路径
      //当前视频标题
      //学习热度和学习人数
      course_uv:'', //学习人数
      course_pv:'',  //学习次数
      hiding: true,
      options: {
        playbackRates: this.playbackRates, // 播放速度
        autoplay: this.autoplay, // 如果true,浏览器准备好时开始回放。
        muted: this.muted, // 默认情况下将会消除任何音频。--- 不全屏播放的时候是否禁止声音外放
        loop: this.loop, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: this.language,
        aspectRatio: this.aspectRatio, // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: false, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: 'http://172.168.11.229:9000' + this.videoSrc,  //视频资源位置
        poster: 'http://172.168.11.229:9000' + this.course_cover_url, // 你的封面地址
        // width: document.documentElement.clientWidth, // 播放器宽度
        notSupportedMessage: this.notSupportedMessage, // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: this.controlBar,
        hls: true,
      },
      title:"",
      course_info:[],
      video_id:'',
      course_id:'',
      // 记录当前播放时间
      nowPlayer: null,
      videoSource:{},
      attribute:"",
      videoTime:[],
      drawer:true,
      toggleBtnActive:1,
      courseId:"",
      course_cover_url:"",
      videoSrc:""
    }
    },
    computed: {
    // 当前播放对象实例
    videoObj() {
      return this.$refs.videoPlayer.player
    },
    // true表示默认情况下应尝试内联播放-false表示我们应使用浏览器的默认播放模式
    playsinline(){
      var ua = navigator.userAgent.toLocaleLowerCase();
      if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
          return true
      }else{
          return true             
      }
    },
    
    // vue-video-player
    playerOptions() {
      if(this.isLive) {
        return {
          playbackRates: [0.5, 1.0, 1.5, 2.0], //可选择的播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 视频一结束就重新开始。
          preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: "zh-CN",
          aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [
            {
              type: 'video/mp4', // 这里的种类支持很多种：基本视频格式、直播、流媒体等
              src: 
              "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8", 
              //url地址
              
            },
          ],
          poster: "", //你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true, //当前时间和持续时间的分隔符
            durationDisplay: true, //显示持续时间
            remainingTimeDisplay: false, //是否显示剩余时间功能
            fullscreenToggle: true, //全屏按钮
          },
        }
      }else {
        if(this.selfOptions) {
          Object.assign(this.options, this.selfOptions)
          return this.options
        }else {
          return this.options;
        }
      }
      
    },
 
  },
  mounted(){
    console.log(this.$route.query.source)
    this.getTitle()
    this.dealSource()
    this.courseId = this.$route.query.course_id
    
  },
  methods: {
    //处理管理中心传进来的数据
    dealSource(){
      console.log(this.$route.query.source,'--------------')
      if(this.$route.query.source.attribute == '系列课'){
        this.courseId = this.$route.query.source.id
      }
      let sourcesKey = this.$route.query.source
        this.title = sourcesKey.title
        this.course_uv = sourcesKey.course_uv
        this.course_pv = sourcesKey.course_pv
        this.videoSrc = sourcesKey.video_url
    },
    backToCourse(){
      this.$router.back()
    },
    hide() {
      this.hiding = false;
    },
    // 播放回调
    onPlayerPlay(player) {
      // 播放
      if(this.nowPlayer) {
        player.currentTime(this.nowPlayer)
      }
    },
    // 暂停回调
    onPlayerPause() {
    },
    // 视频播完回调
    onPlayerEnded() {
      this.nowPlayer = null;
    },
    // DOM元素上的readyState更改导致播放停止
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
    },
 
    //媒体的readyState为HAVE_FUTURE_DATA或更高
    onPlayerCanplay() {
    },
 
    //媒体的readyState为HAVE_ENOUGH_DATA或更高。这意味着可以在不缓冲的情况下播放整个媒体文件。
    onPlayerCanplaythrough() {
    },
 
    //播放状态改变回调
    playerStateChanged() {
    },
 
    //将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数。。
    playerReadied() {
    },
    // 获取视频的标题渲染到界面上
   getTitle(){
     this.$http.post('/home/play',{course_id:this.courseId}).then((res)=>{
        this.title = res.data.data.list.title
        this.course_pv = res.data.data.list.course_pv
        this.course_uv = res.data.data.list.course_uv
        this.course_info = res.data.data.list.course_info
        this.course_cover_url = res.data.data.list.course_cover_url
        // let time = this.course_info.map((value,index)=>{
        //   console.log(value,'8888')
        //   console.log(index,'9999')
        //   return value.video_duration
        // })
         
        //  this.videoTime = time.toString()
        // // console.log(time,'time')
        // console.log(this.videoTime,'-----------')
        //取得video_id为下方做准备
        let sh = this.course_info
        let [i] = sh
        this.video_id = i.id
        console.log(res.data.data,1754)
        this.attribute = res.data.data.list.attribute
        // 取得course_id为下方接口参数做准备
        let kh = this.course_info
        let [k] = kh
        this.course_id = k.course_id
        //在这里调用方法后,取到video_id,下方执行
        this.getUrl()
      })
    },
    getUrl(){
      this.$http.post('/play/url',{ 
        course_id:this.course_id,
        video_id:this.video_id
       }).then((res)=>{
       console.log(res.data.data)
      })
      console.log(this.video_id,1444)
    },
    toggleClass(){
      this.drawer = false
      if(this.drawer == false){
      this.drawer = true
      }
    },
    pushVideoSource(courseId,videoId){
      console.log(videoId)
      console.log(courseId)
      this.$http.post('/play/url',{
        course_id:courseId,
        video_id:videoId
      }).then((res)=>{
        console.log(res.data)
      })
    },
    //学习上报
    studyReport(){
      this.$http.post('/study/report',{
        data:[
          {course_id:this.course_id},
          {video_id:this.video_id},
          {study_time:''},
          {date:''}
        ]
      }).then(res=>{
        console.log(res)
      })
    }
  },
};
</script>

<style scoped>
.bigBox {
  position: relative;
  width: 100%;
  height: 100%;
}
.top {
  display: flex;
  width: 100%;
  height: 82px;
  background: #333131;
}
.study{
    position: absolute;
    top: 0;
    right: 20px;
    margin-top: 20px;
    font-size: 16px;
    color: #2ab18b;
    z-index: 9999;
}
.hot{
    position: absolute;
    right: 20px;
    top: 50px;
   /* margin-top: 50px;
   margin-left: 20px; */
   font-size: 12px;
   color: #777E90;
   z-index: 9999;
}
.return {
  position: absolute;
  left: 68px;
  top: 30px;

  font-size: 16px;
  color: #2ab18b;
}
.returnFn {
  position: absolute;
  left: 38px;
  top: 29px;
  width: 24px;
  height: 24px;
  background-image: url("@/assets/img/19.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.introduce {
  color: #fff;
  margin: 30px auto;
}
.broadCast{
  width: 100%;
  height: 843px;
}
.video-js{
    width: 99.1vw;
    height:100%;
}
.vjs-custom-skin > .video-js .vjs-big-play-button {
  height: 200px;
  width: 200px;
  line-height: 200px;
  border-radius: 200px;
}
.moreClassTitle{
  color: #fff;
  margin-top: 80px;
  margin-left: 33px;
}
.spareInfo{
  margin-top: 30px;
  margin-left: 33px;
  /* width: 338px; */
  height: 360px;
  overflow-y: scroll;
  font-size: 14px;
}
.spareInfo::-webkit-scrollbar{
  display: none;
}
.spareInfo-smallBox{
  display: flex;
  width: 100%;
  height: 41px;
  margin-bottom: .2667rem;
  font-size: 14px;
  color: #fff;
}
.box-img{
  width: 16px;
  height: 16px;
  margin-left: 18px;
  margin-top: 1px;
}
.title-box{
  width: 188px;
  margin-left: 10px;
  margin-top: 2px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 10px;
}
.spareInfo-smallBox h6{
  font-weight: normal;
  margin-right: 10px;
  margin-top: 1px;
}
.toggle-btn{
  position: fixed;
  top: 82px;
  right: 325px;
  width: 24px;
  height: 52px;
  border-radius: 4px 0 0 4px;
  background: #201F1F;
  cursor: pointer;
}
.toggleBtnActive{
 position: fixed;
 top: 82px;
 right: 0;
}
.broadCastActive{
  width: 100%;
  height: 449px;
}
</style>
<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
.el-drawer__body{
  background: #201F1F;
}
</style>

