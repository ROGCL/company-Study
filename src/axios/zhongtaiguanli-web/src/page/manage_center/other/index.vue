<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="预警消息设置" name="first">
        <Ucg v-if="activeName == 'first'" />
      </el-tab-pane>
      <el-tab-pane label="敏感词管理" name="sensitive">
        <span slot="label"
          >敏感词管理
          <el-tooltip class="item" effect="dark" placement="right">
            <div slot="content">
              1级：（权重高）<br />
              2级：（权重中）<br />
              3级：（权重低）
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </span>
        <Sensitive v-if="activeName == 'sensitive'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Ucg from "./ucg.vue";
import Sensitive from "./sensitive.vue";
export default {
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
  components: {
    Ucg,
    Sensitive,
  },
};
</script>

<style lang="less" scoped>
</style>