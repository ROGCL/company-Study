<template>
  <div>
    <div class="box">
      <div>
        <span
          v-for="item in tabs"
          :key="item.id"
          :class="radio == item.id ? 'index active' : 'index'"
          @click="changetab(item)"
          >{{ item.title }}</span
        >
      </div>
    </div>

    <!-- <Index v-show="radio == 32" ref="index" />
    <fixedPrice v-show="radio == 34" ref="index" />
    <flowData v-show="radio == 33" ref="flowData" /> -->

    <!-- 这里是使用动态组件 -->
    <component :is="activeComponentName"></component>
  </div>
</template>

<script>
import Index from "./index.vue";
import launchData from "./launchData.vue";
export default {
  data() {
    return {
      tabs: [
        {
          title: "关键行为预估数据",
          id: 32,
          componentName: "Index",
        },
        {
          title: "关键行为投放数据",
          id: 33,
          componentName: "launchData",
        },
      ],
      activeComponentName: "Index",
      radio: 32,
      changeCheckList: [],
      checkList: [],
      dialogVisible: false,
      DashboardSetting: [],
    };
  },
  components: {
    Index,
    launchData,
  },
  methods: {
    // tab切换
    changetab(item) {
      if (this.radio == item.id) return;
      this.radio = item.id;
      this.activeComponentName = item.componentName;
    },
  },
};
</script>

<style lang="less" scoped>
.radio_button {
  width: 75px;
}

.box {
  background-color: #fff;
  margin: 20px 0;
  display: flex;
  justify-content: space-between;

  span {
    display: inline-block;
    padding: 15px 0 12px 0;
    font-size: 16px;
    color: rgba(90, 92, 96, 0.65);
    cursor: pointer;
  }

  .index {
    margin: 0 60px 0 18px;
  }

  .advertisement {
    margin-right: 60px;
  }

  .active {
    font-size: 16px;
    font-weight: bold;
    color: #232528;
    border-bottom: 2px solid #ff981f;
  }

  .margin-top {
    margin-top: 5px;
  }
}

.btn {
  word-wrap: break-word;
  width: 50px;
  height: 50px;
  color: #fff;
  background: #409eff;
  border-radius: 50%;
  text-align: center;
}

.pos_ab {
  position: absolute;
  bottom: 15vh;
  right: 5vh;
}
</style>