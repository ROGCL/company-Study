<template>
  <div>
          <!-- 顶部右侧折叠选项栏 -->
          <div class="colpase" @click="hide">
        <!-- 内部小图 -->
        <div class="smallImg"></div>
      </div>
      <!-- 侧边栏 -->
      <div class="asideBar" v-show="hiding">
        <!-- 顶部学学习人数和热度,接口渲染人数和热度数量 -->
        <div asideBar-top>
          <span class="man font-public"
            >99999
            <p>人学习过</p></span
          >
          <span class="woman font-public"
            >77777
            <p>次学习热度</p></span
          >
        </div>
        <!-- 下部目录 -->
        <span class="list">系列课目录</span>
        <!-- 课程目录详情,接口渲染,大盒子不设置高，由内容默认撑开 -->
        <div class="inside">
          <div class="studyList" v-for="item in list" :key="item.id">
            <!-- 左侧序号 -->
            <span class="studyList-public">{{ item.id }}.</span>
            <!-- 播放状态,是否完成，后期动态切换 -->
            <div class="state studyList-public"></div>
            <!-- 播放详情内容标题 -->
            <span class="detail studyList-public">{{ item.content }}</span>
            <!-- 时长和播放状态，后期动态切换状态 -->
            <span class="time studyList-public">{{ item.time }}</span>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.colpase {
  position: absolute;
  top: 82px;
  left: 1279px;
  width: 24px;
  height: 52px;
  background: #333131;
  opacity: 70%;
  cursor: pointer;
}
.smallImg {
  width: 7.2px;
  height: 12px;
  margin-top: 20px;
  margin-left: 10px;
  background-image: url("@/assets/img/28.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.asideBar {
  position: absolute;
  right: 0;
  top: 0;
  width: 404px;
  height: 100%;
  background-color: #201f1f;
}
.font-public {
  display: block;
  font-size: 14px;
  margin-left: 33px;
  margin-top: 20px;
  cursor: pointer;
}
.font-public:nth-child(2) {
  margin-top: 6px;
}
.font-public p {
  display: inline-block;
}
.man {
  color: #2ab18b;
}
.woman {
  color: #777e90;
}
.list {
  display: block;
  margin-left: 33px;
  margin-top: 128px;
  margin-bottom: 55px;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}
.inside {
  width: 400px;
  height: 400px;
  overflow-x: hidden;
  overflow-y: scroll;
}
.inside::-webkit-scrollbar {
  display: none;
}
.studyList {
  position: relative;
  width: 338px;
  height: 41px;
  margin-left: 33px;
  margin-top: 20px;
}
.studyList-public {
  display: block;
  color: #fff;
  font-size: 14px;
}
.state {
  position: absolute;
  left: 28px;
  top: 2px;
  width: 16px;
  height: 16px;
  background-image: url("@/assets/img/27.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.detail {
  position: absolute;
  left: 54px;
  top: 0;
}
.time {
  position: absolute;
  right: 0;
  top: 0;
}
</style>