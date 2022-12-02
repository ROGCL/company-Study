<template>
  <div>
    <controlComponents></controlComponents>
    <!-- 判断新增的是单节课还是系列课 -->
    <!-- 面包屑 -->
    <div class="ham">
      <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/imporantPages' }">课程管理</el-breadcrumb-item>
   <el-breadcrumb-item :to="{path:'/addSingleClassPages'}">新增单节课</el-breadcrumb-item>
    </el-breadcrumb>
    </div>
    <!-- 单节课页面 -->
    <singleClassComponents></singleClassComponents>
  </div>
</template>

<script>
import singleClassComponents from '@/components/singleClass-components.vue';
import controlComponents from '@/components/control-components.vue';
export default {
components:{controlComponents,singleClassComponents},
data(){
  return{
  }
}
}
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
*{
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>