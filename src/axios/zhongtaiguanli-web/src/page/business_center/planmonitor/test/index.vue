<template>
  <div class="plan">
    <iframe
      class="quickbi-iframe-demo"
      :src="src"
      scrolling="no"
      frameborder="0"
      width="100%"
      height="810"
    >
    </iframe>
  </div>
</template>

<script>
import { System_getQuickAK } from "@/config/api/index";
export default {
  data() {
    return {
      src: "",
    };
  },
  created() {
    this.getQuickBIToken();
  },
  methods: {
    async getQuickBIToken() {
      let data = await System_getQuickAK();
      this.src = `https://bi.aliyun.com/dashboard/view/pc.htm?spm=a2c10.workspacedashboard.0.0.7b0675d5XMvKwv&pageId=0e35c25c-81a2-49e9-af74-4cbc89716a75&accessToken=4a10122e4ce11d7ea9b985b0d3e2cba0&qbi_version_param=1`;
      this.timingUpdateToken();
    },
    timingUpdateToken() {
      let targetTime = 3600;
      const interval = setInterval(() =>{
        targetTime--;
        // 提前10分钟更新token有效期
        if(targetTime - 600 === 0) {
          clearInterval(interval);
          this.getQuickBIToken();
        }
      }, 1000)
    }
  },
};
</script>

<style lang='scss' scoped>
</style>