<template>
  <div>
    <div class="box">
      <div>
        <span v-for="item in tabs" :key="item.id" :class="radio == item.id ? 'index active' : 'index'" @click="changetab(item)">{{item.title}}</span>
      </div>
    </div>

    <!-- <Index v-show="radio == 32" ref="index" />
    <fixedPrice v-show="radio == 34" ref="index" />
    <flowData v-show="radio == 33" ref="flowData" /> -->

    <!-- 这里是使用动态组件 -->
    <component :is="activeComponentName"></component>
   
    <div class="pos_ab" style="z-index: 1500;cursor:pointer">
      <div class="btn" @click="gocompent">
        <img src="./img/jsq.png" alt="" style="height: 30px;width: 30px;margin: 9px 0 0 0;" />
      </div>
    </div>
  </div>
</template>

<script>
import Index from "./index.vue";
import flowData from "./flowData.vue";
import fixedPrice from "./fixed_price.vue";
export default {
  data() {
    return {
      tabs:[{
        title:"首页",
        id:32,
        componentName:'Index'
      },{
        title:"一口价数据",
        id:34,
        componentName:'fixedPrice'
      },{
        title:"流量助推数据",
        id:33,
        componentName:'flowData'
      }],
      activeComponentName:"Index",
      radio: 32,
      changeCheckList: [],
      checkList: [],
      dialogVisible: false,
      DashboardSetting: [],
    };
  },
  components: {
    Index,
    flowData,
    fixedPrice
  },
  mounted() {
    // 如果参数里面有orderid 默认跳转到 【流量助推模块】
    let query = this.$route.query
    if(query.order_id){
      this.radio = 33
      this.activeComponentName = 'flowData'
    }
  },
  methods: {
    // tab切换
    changetab(item){
      if(this.radio == item.id) return
      this.radio = item.id
      this.activeComponentName = item.componentName
    },
    // 打开计算器
    gocompent() {
      window.open('./zt_web.html', '_blank')
      // window.open('http://madmin.nineton.cn/Admin/Test/calculator', '_blank')
    }
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