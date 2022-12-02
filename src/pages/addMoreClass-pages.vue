<template>
  <div>
    <controlComponents></controlComponents>
    <!-- 面包屑位置 -->
    <div class="ham">
      <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/imporantPages' }">课程管理</el-breadcrumb-item>
   <el-breadcrumb-item :to="{path:'/addMoreClassPages'}">新增系列课</el-breadcrumb-item>
    </el-breadcrumb>
    </div>
    <moreClassComponents></moreClassComponents>
  </div>
</template>

<script>
import moreClassComponents from "@/components/moreClass-components.vue";
import controlComponents from "@/components/control-components.vue";
export default {
  components: { controlComponents,moreClassComponents},

};
</script>
<style scoped>
 .ham{
  position: absolute;
  left: 216px;
  top: 98px;
  height: 24px;
 }
</style>
<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}


</style>
