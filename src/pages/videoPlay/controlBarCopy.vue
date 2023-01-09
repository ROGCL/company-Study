<template>
  <div>
    <div
              class="process-bar"
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                z-index: 9999;
              "
              v-show="showControlBar"
            >
              <div class="progress-box" style="cursor: pointer">
                <div class="process-green" style="cursor: pointer">
                  <div class="ponit" style="cursor: pointer"></div>
                </div>
              </div>
              <div style="display: flex; align-items: center">
                <img
                  src="@/assets/img/29.png"
                  alt=""
                  class="icon"
                  @click="preVideo"
                />
                <img
                  src="@/assets/img/31.png"
                  alt=""
                  class="icon"
                  @click="playVideo"
                  v-show="!pauseHide"
                />
                <i
                  class="icon iconfont icon-zanting"
                  style="color: #fff"
                  @click="pauseVideo"
                  v-show="pauseHide"
                ></i>
                <img
                  src="@/assets/img/30.png"
                  alt=""
                  class="icon"
                  @click="lastVideo"
                />
                <!-- 放视频播放时间的区域 -->
                <div style="font-size: 16px; color: #fff; margin-left: 40px">
                  {{ currentTime }}/{{ totalTime }}
                </div>
              </div>
              <div style="display: flex; align-items: center">
                <img src="" alt="" class="icon" />
                <i class="el-icon-headset icons" @click="voiceChoose"></i>
                <div
                  style="
                    font-size: 16px;
                    color: #fff;
                    cursor: pointer;
                    position: relative;
                  "
                >
                  <el-slider
                    v-model="voice"
                    vertical
                    height="50px"
                    v-show="voiceHide"
                    input-size="mini"
                  ></el-slider>
                  <div class="list" v-show="speedShow">
                    <div
                      class="item"
                      v-for="(item, index) in playerOptions.playbackRates"
                      :key="index"
                      @click="changeSpeed(item)"
                    >
                      {{ item }}x
                    </div>
                  </div>
                  <!-- 默认为1倍速，用户选择后重新赋值 -->
                  <div class="item" @click="showSpeedChoose">
                    <span v-if="speed == ''">1x</span
                    ><span v-else>{{ speed }}x</span>
                  </div>
                </div>
                <img
                  src="@/assets/img/32.png"
                  alt=""
                  class="icons"
                  @click="fullScreen"
                />
              </div>
            </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>