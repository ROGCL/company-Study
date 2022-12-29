<template >
  <el-container>
    <el-aside :width="!collapse ? '250px' : '80px'">
      <Sider :collapse="collapse" />
    </el-aside>
    <el-container>
      <el-header class="header-wrap">
        <Header @collapse="onCollapse" />
      </el-header>
      <el-main>
        <div class="breadcrumb-wrap" v-show="!$route.meta.hideBreadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item
              v-for="(item, index) in breadcrumb"
              :key="index"
            >
              {{ item["meta"].name }}
              <el-tooltip
                class="item"
                effect="dark"
                v-if="!!item['meta'].desc"
                placement="right"
              >
                <div
                  slot="content"
                  class="tooltip-content"
                  v-html="item['meta'].desc"
                ></div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </el-breadcrumb-item>
          </el-breadcrumb>
          <!-- 右侧拓展 -->
          <div v-html="breadcrumbRight"></div>
        </div>
        <router-view />
        {{
          $route.matched.length === 1 && $route.meta
            ? "欢迎来到" + $route.meta.name
            : ""
        }}
      </el-main>
    </el-container>
  </el-container>
</template >

<script >
import userStore from "../../store/user";
import Header from "./header";
import Sider from "./sider";

export default {
  components: {
    Header,
    Sider,
  },
  data() {
    return {
      collapse: false,
      breadcrumb: [],
      breadcrumbRight: "",
    };
  },
  created() {
    this.getBreadcrumb();
  },
  watch: {
    $route(to, from) {
      this.getBreadcrumb();
    },
  },
  methods: {
    onCollapse(collapse) {
      this.collapse = collapse;
    },
    getBreadcrumb() {
      this.breadcrumb = this.$route.matched;
      this.breadcrumbRight = userStore.state.breadcrumbRight;
    },
  },
};
</script >

<style lang = "less" scoped >
.header-wrap {
  padding: 0;
}

.el-aside {
  transition: all 0.2s linear;
}

:global {
  .el-container {
    width: 100%;
    min-height: 100%;
  }

  .el-header {
    z-index: 555;
  }
}

.breadcrumb-wrap {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #fff;
  margin-bottom: 20px;
}
.tooltip-content {
  line-height: 20px;
}
/deep/.el-main {
  padding: 5px 20px;
  overflow-y: auto;
  height: calc(100vh - 60px);
}
/deep/.breadcrumb-wrap {
  padding: 10px 0;
  background-color: #f7f7f7;
  margin-bottom: 0;
}
</style >