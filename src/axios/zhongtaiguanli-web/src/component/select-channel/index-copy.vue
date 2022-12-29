<template>
  <el-cascader
    style="width: 100%; max-height: 50px"
    v-model="insideValue"
    :options="options"
    :props="myProps"
    @remove-tag="removetag"
    collapse-tags
    :append-to-body="false"
    clearable
    filterable
    ref="cascader"
    @change="change"
  >
  </el-cascader>
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
    disabled: {
      type: Boolean,
      default: false,
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
      insideValue: "",
      options: [],
      optionsCopy: [],
      all: false,
    };
  },
  mounted() {
    if (!this.channel.length) {
      this.fetchChannel();
    } else {
      let arr = this.channel.map((item) => {
        return {
          title: item.title,
          id: item.id,
          channels: item.channels.map((_item) => {
            return {
              title: _item,
              id: _item,
            };
          }),
        };
      });
      this.options = arr;
      this.optionsCopy = arr;
    }

    // this.insideValue = this.value;
  },
  watch: {
    value(val) {
      // this.insideValue = val;
    },
    insideValue(val) {
      // if (val.length) {
      //   // this.all = this.isSameArray(val, this.options);
      //   let arr = []
      //   val.forEach(item => {
      //     arr.push(item[1])
      //   });
      //   this.$emit("input", arr);
      // } else {
      //   this.$emit("input", val);
      // }

    },
  },
  computed: {
    ...mapState({
      channel: (state) => state.channel.data,
    }),
  },
  methods: {
    change(val) {
      console.log(val,123)
      if (val.length) {
        let arr = [];
        val.forEach((item) => {
          arr.push(item[1]);
        });
        this.$emit("input", arr);
      } else {
        this.$emit("input", val);
      }
    },
    removetag(e) {
      let obj = {};
      obj.stopPropagation = () => {};
      try {
        this.$refs.cascader.clearValue(obj);
      } catch (err) {
        this.$refs.cascader.handleClear(obj);
      }
    },
    ...mapActions(["getChannel"]),
    async fetchChannel() {
      const [err, res] = await this.getChannel();

      if (err) return;
      let arr = res.map((item) => {
        return {
          title: item.title,
          id: item.id,
          channels: item.channels.map((_item) => {
            return {
              title: _item,
              id: _item,
            };
          }),
        };
      });
      this.options = arr;
      this.optionsCopy = arr;
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
