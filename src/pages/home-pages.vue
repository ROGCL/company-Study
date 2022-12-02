<template>
  <div>
    <!-- 顶部提示栏,弹窗,所有页面共用,挂载到主页面 -->
    <div class="topNotice" v-show="shade">
      <img src="@/assets/img/17.png" alt="" id="lit" />
      清露平台所载所有内容，仅限于内部学习使用。各位同学不得将本平台所载内容用作其他用途，或提供给其他人使用
      <img src="@/assets/img/18.png" alt="" id="del" @click="close" />
    </div>
    <!-- 头部组件 -->
    <headerComponents></headerComponents>
    <!-- 内容组件 -->

      <bannerComponents></bannerComponents>
    <router-view></router-view>
  </div>
</template>

<script>
import bannerComponents from "../components/banner-components.vue";
import headerComponents from "../components/header-components.vue";
export default {
  components: { bannerComponents, headerComponents },
  data() {
    return {
      shade: true,
    };
  },
  mounted(){
  //  this.getData()
  },
  methods: {
    close() {
      this.shade = false;
    },
    
  },
};
</script>

<style scoped>
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
</style>
<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
