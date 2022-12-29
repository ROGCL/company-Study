<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="部门管理" name="first">
      <Department v-if="activeName == 'first'" />
    </el-tab-pane>
    <el-tab-pane label="项目组管理" name="second">
      <Project v-if="activeName == 'second'" />
    </el-tab-pane>
    <el-tab-pane label="项目管理" name="third">
      <Article v-if="activeName == 'third'" />
    </el-tab-pane>
    <el-tab-pane label="应用管理" name="fourth">
      <App v-if="activeName == 'fourth'" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Department from "@/page/manage_center/department";
import Project from "@/page/manage_center/project";
import Article from "@/page/manage_center/article";
import App from "@/page/manage_center/app";
export default {
  components: {
    Department,
    Project,
    Article,
    App,
  },
  data() {
    return {
      activeName: "first",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
  mounted() {
    if (this.$route.params.index_tab == 4) {
      this.activeName = "fourth"
    }
  },
};
</script>

<style lang="less" scoped></style>
