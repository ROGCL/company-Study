<template>
  <div>
    <!-- <el-cascader style="width: 100%; max-height: 50px" v-model="insideValue" :options="options" :props="myProps"
    collapse-tags :append-to-body="false" clearable filterable>
  </el-cascader> -->
  <el-cascader-multi v-model="insideValue" :data="options"  clearable
    filterable collapse-tags :append-to-body="false"  @change="change"> </el-cascader-multi>
  </div>
 
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  props: {
    value: {
      type: [String, Number, Array],
      default: "",
    },
    haveAll: {
      type: Boolean,
      default: true,
    },
    optionsList: {
      type: Array,
      default: () => [],
    },
    paramFlag: {
      // 是否从外部传参进来
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    appId: {
      type: [String, Number, Array],
      default: ()=>[],
    },
  },
  data() {
    return {
      myProps: {
        multiple: true,
        value: "id",
        label: "title",
        children: "channels",
      },
      insideValue: [],
      options: [],
      optionsCopy: [],
      all: false,
      channel: [],
    };
  },
  mounted() {
    // 如果从父组件传递参数过来,否则使用默认接口获取数据
    if (this.paramFlag) {
      this.opertionListFun(this.optionsList);
    }else if (!this.channel.length) {
      this.fetchChannel();
    } else {
      this.opertionListFun(this.channel);
    }
  },
  watch: {
    optionsList: {
      handler: function () {
        this.opertionListFun(this.optionsList);
      },
      deep: true,
      immediate: true,
    },

    // 监听值的改变
    insideValue(val) {
      if (val.length && Array.isArray(val)) {
        this.all = this.isSameArray(val, this.options);
        let arr = [];
        val.forEach((item) => {
          arr.push(item[1]);
        });
        this.$emit("input", arr);
      } else {
        this.$emit("input", val);
      }
    },

    // appid 改变了就去调用接口
      appId(val) {
        this.fetchChannel(val)
      // this.insideValue = [];
      // const [err, res] = await this.$http.post("income/getChannel", {
      //   app_id: val,
      // });
      // if (err) return;
      // if (!res.length) {
      //   this.options = [];
      //   this.optionsCopy = [];
      //   return
      // }
      // let arr = res.map((item) => {
      //   return {
      //     label: item.title,
      //     value: item.id,
      //     children: item.channels.map((_item) => {
      //       return {
      //         label: _item,
      //         value: _item,
      //       };
      //     }),
      //   };
      // });
      // this.options = arr;
      // this.optionsCopy = arr;
    },
  },
  computed: {},
  methods: {
    opertionListFun(data=[]){
      let arr = data.map((item) => {
        let children = [];
        if (item.channels) {
          children = item.channels.map((_item) => {
            return {
              label: _item || _item.title || _item.label,
              value: _item || _item.id || _item.value,
            };
          });
        } else if(item.children){
          children = item.children.map((_item) => {
            return {
              label: _item.title || _item.label,
              value: _item.id || _item.value,
            };
          });
        }
        return {
          label: item.label || item.title,
          value: item.value|| item.id,
          children
        };
      });
      this.options = arr;
      this.optionsCopy = arr;
    },
    // 默认接口获取数据
    async fetchChannel(val=[]) {
      const [err, res] = await this.$http.post("income/getChannel",{
        app_id: val,
      });
      if (err) return;
      if (!res.length) {
        this.options = [];
        this.optionsCopy = [];
        return
      }
      this.opertionListFun(res)
      // let arr = res.map((item) => {
      //   return {
      //     label: item.title,
      //     value: item.id,
      //     children: item.channels.map((_item) => {
      //       return {
      //         label: _item,
      //         value: _item,
      //       };
      //     }),
      //   };
      // });
      // this.options = arr;
      // this.optionsCopy = arr;
    },
    change(val) {
      this.$emit('change',val)
    },
    onFilter(query) {
      if (query) {
        //val存在
        this.options = this.optionsCopy.filter((item) => {
          if (
            !!~item.indexOf(query) ||
            !!~item.toUpperCase().indexOf(query.toUpperCase())
          ) {
            return true;
          }
        });
      } else {
        this.options = this.optionsCopy;
      }
    },
    onInputAll(val) {
      if (val) {
        this.insideValue = this.options;
      } else {
        this.insideValue = [];
      }
    },
    isSameArray(originArr1, originArr2) {
      const arr1 = originArr1.concat([]);
      const arr2 = originArr2.concat([]);

      const _arr1 = arr1.sort().join("");
      const _arr2 = arr2.sort().join("");

      return _arr1 === _arr2;
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  max-height: 40px;
}
</style>