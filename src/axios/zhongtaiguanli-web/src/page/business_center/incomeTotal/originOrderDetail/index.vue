<template>
  <div class="plan">
    <iframe
      class="quickbi-iframe-demo"
      :src="src"
      scrolling="no"
      frameborder="0"
      width="100%"
      height="810"
    ></iframe>
  </div>
</template>

<script>
import { System_getQuickAK } from '@/config/api/index'
export default {
  data() {
    return {
      src: '',
    }
  },
  created() {
    this.getQuickBIToken()
  },
  methods: {
    async getQuickBIToken() {
      let data = await System_getQuickAK()
      this.src = `https://das.base.shuju.aliyun.com/token3rd/dashboard/view/pc.htm?pageId=d7c58f9f-fc47-4134-80b0-e5d73246e9f2&accessToken=${data[1]}&qbi_version_param=1`
      this.timingUpdateToken()
    },
    timingUpdateToken() {
      let targetTime = 3600
      const interval = setInterval(() => {
        targetTime--
        // 提前10分钟更新token有效期
        if (targetTime - 600 === 0) {
          clearInterval(interval)
          this.getQuickBIToken()
        }
      }, 1000)
    },
  },
}
</script>

<style lang='scss' scoped>
</style>