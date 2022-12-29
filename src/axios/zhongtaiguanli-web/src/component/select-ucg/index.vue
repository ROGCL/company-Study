<template>
  <div>
    <el-select
      v-model="value.appInfo"
      placeholder="请选择"
      multiple
      collapse-tags
      @change="changeOption"
      @focus="initOption"
    >
      <el-row>
        <el-col :span="12">
          <div class="left_title">
            <el-button type="text" @click="AllOption">全选</el-button>
            <el-button type="text" @click="backOption">反选</el-button>
          </div>
          <div style="padding: 5px 20px">
            <el-input size="mini" v-model="value.input" @input="changOption" />
          </div>
          <template #prefix>
            <span v-if="systemIcon" class="iconfont" :class="systemIcon"></span>
          </template>
          <div>
            <el-option
              v-for="item in value.app ? value.app : App"
              :key="item.id"
              :value="item.id"
              :label="item.title"
            >
              <span
                class="iconfont"
                :class="item.system ? formatSystemIcon(item.system) : ''"
                >{{ item.title }}</span
              >
            </el-option>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="option_child" :key="num">
            <div class="title">
              <span
                >已选择：{{
                  value.optionList ? value.optionList.length : 0
                }}</span
              >
              <el-button type="text" @click="cleanOption">清空全部</el-button>
            </div>
            <div
              v-for="item in value.optionList"
              :key="item.id"
              class="option_child_card"
            >
              <span
                class="iconfont"
                :class="item.system ? formatSystemIcon(item.system) : ''"
                >{{ item.title }}</span
              >
              <!-- <span>{{ item.title }}</span> -->
              <span
                class="el-icon-close del_option"
                @click="delOption(item.id)"
              ></span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-select>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    value: {
      type: null,
    },
  },
  data() {
    return {
      num: 0, //更新组件的key
    };
  },
  mounted() {
    this.num += 1;
  },
  computed: {
    ...mapState({
      App: (state) => state.app.data,
    }),
    systemIcon(vm) {
      const { App, insideValue } = vm;
      const _currentApp = App.find((v) => v.id === insideValue);

      if (!_currentApp) return "";

      return this.formatSystemIcon(_currentApp.system);
    },
  },
  methods: {
    changeOption() {
      // 处理数据 再右边列表生成对应数据
      let arr = [];
      this.value.flag = true;
      this.App.forEach((item) => {
        this.value.appInfo.forEach((_item) => {
          // 只要所选ID包含AppID就放入
          if (item.id == _item) {
            arr.push(item);
          }
        });
      });
      this.value.optionList = arr;
    },
    initOption() {
      // 获取焦点事件 初始化右边数据列表
      let arr = [];
      this.App.forEach((item) => {
        this.value.appInfo.forEach((_item) => {
          if (item.id == _item) {
            arr.push(item);
          }
        });
      });
      this.value.optionList = arr;
      this.num += 1;
    },
    AllOption() {
      // 选择全部app 同时映射左右列表
      let appInfo = [];
      let optionList = [];
      this.value.flag = true;
      this.App.forEach((item) => {
        appInfo.push(item.id);
        optionList.push(item);
      });
      this.value.appInfo = appInfo;
      this.value.optionList = optionList;
    },
    changOption() {
      // 模糊搜索匹配的值
      let arr = [];
      this.App.forEach((item) => {
        if (item.title.indexOf(this.value.input) != -1) {
          arr.push(item);
        }
      });
      // 如果数组有值才替换
      if (arr.length) {
        this.value.app = arr;
      } else {
        this.value.app = "";
      }
    },
    cleanOption() {
      this.value.flag = true;
      // 清除左右列表
      this.value.appInfo = [];
      this.value.optionList = [];
    },
    delOption(id) {
      // 删除右边所选项 同步更新左右列表
      let arr = this.value.optionList.filter(function (item) {
        return item.id != id;
      });
      this.value.appInfo = arr.map((item) => {
        return item.id;
      });
      this.value.optionList = arr;
    },
    formatSystemIcon(code) {
      switch (String(code)) {
        case "1":
          return "icon-anzhuo";
        case "2":
          return "icon-ios";
        case "3":
          return "icon-weixin";
        case "4":
          return "icon-baidu";
        case '5':
          return 'icon-chrome'
        default:
          return "";
      }
    },
    backOption() {
      let appInfo = [];
      let optionList = [];
      this.value.flag = true;

      let defference = this.App.filter(
        (v) => this.value.appInfo.indexOf(v.id) == -1
      );
      if (defference.length) {
        defference.forEach((item) => {
          appInfo.push(item.id);
          optionList.push(item);
        });
        this.value.appInfo = appInfo;
        this.value.optionList = optionList;
      } else {
        this.value.appInfo = [];
        this.value.optionList = [];
      }

      /* this.value.appInfo = [...new Set(appInfo)];
      this.value.optionList = [...new Set(optionList)]; */
    },
  },
  watch: {
    value: {
      handler(newName, oldName) {
        this.$emit("changeScope", newName);
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-scrollbar {
  min-width: 450px;
}
/deep/.el-select-dropdown__item.selected {
  .iconfont {
    font-weight: normal;
  }
}
/deep/.iconfont {
  font-weight: normal;
}
.left_title {
  font-size: 14px;
  display: flex;
  justify-content: space-around;
  line-height: 40px;
}
.option_child {
  width: 200px;
  .option_child_card {
    .del_option {
      cursor: pointer;
    }
    display: flex;
    justify-content: space-between;
    background: rgb(240, 240, 240);
    padding: 15px 10px;
    margin: 10px;
    border-radius: 10px;
  }
  .title {
    font-size: 14px;
    display: flex;
    justify-content: space-around;

    line-height: 40px;
  }
}
</style>