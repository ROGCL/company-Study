<template>
  <div>
    <div style="display:flex">
      <el-cascader-multi v-model="insideValue" :data="options" clearable filterable collapse-tags @change="change"
        :append-to-body="false">
      </el-cascader-multi>
      <el-button v-if="multi" style="margin-left:20px" type="primary" @click="open">批量</el-button>
    </div>

    <el-dialog title="批量筛选" :visible.sync="dialogTableVisible" @close="cancel" :close-on-press-escape="false"
      :close-on-click-modal="false">
      <el-input type="textarea" :rows="6" placeholder="请输入内容，回车分割" v-model="textarea" @input="search">
      </el-input>
      <el-button @click="clear" type="warning" plain style="margin-top:20px">清空</el-button>
      <el-divider>搜索结果（{{ compress_result.length }}）；<span style="color:#67c23a">已选择（{{ checkList.length }}）</span>
      </el-divider>
      <template v-if="compress_result.length > 0">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkList" @change="handleCheckedItem">
          <el-checkbox v-for="(item, index) in compress_result" :key="index" :label="item"></el-checkbox>
        </el-checkbox-group>
      </template>
      <div style="text-align:center" v-else>暂无相关渠道</div>

      <div>
        <el-button v-if="compress_result.length > 0" @click="confirm" type="primary" style="margin-top:20px">确定
        </el-button>
        <el-button @click="cancel" type="info" style="margin-top:20px">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import _ from 'lodash'
export default {
  props: {
    // 是否一次性筛选多个
    multi: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Array],
      default: "",
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
      timer: null,
      isIndeterminate: true,
      checkAll: false,
      checkList: [],
      compress_result: [], // 多渠道筛选结果
      channelChildrens: [], // 具体的渠道数据
      textarea: "",
      dialogTableVisible: false,
      insideValue: [],
      options: [],
      optionsCopy: [],
      all: false,
      //
      cakey: 1,
      selected: [],
    };
  },
  mounted() {
    // 如果从父组件传递参数过来,否则使用默认接口获取数据
    if (this.paramFlag) {
      this.opertionListFun(this.optionsList);
    } else if (!this.channel.length) {
      this.fetchChannel();
    } else {
      this.opertionListFun(this.channel);
    }
    // this.insideValue = this.value;
  },
  watch: {
    optionsList: {
      handler: function () {
        this.opertionListFun(this.optionsList);
      },
      deep: true,
      immediate: true,
    },
    insideValue(val) {
      if (val.length) {
        this.clear() // 重置批量筛选
        let arr = []
        val.forEach(item => {
          arr.push(item[1])
        });
        this.$emit("input", arr);
      } else {
        this.$emit("input", val);
      }
    },
  },
  computed: {
    ...mapState({
      channel: (state) => state.channel.data,
    }),
  },
  methods: {
    search() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        // 空格区分
        let textarea_arr = this.textarea.split(/[\n,]/g)
        this.compress_result = _.compact(_.intersection(textarea_arr, this.channelChildrens))
        this.handleCheckAllChange(true)
      }, 300)
    },
    // 全选
    handleCheckAllChange(val) {
      this.checkAll = true
      this.checkList = val ? this.compress_result : [];
      this.isIndeterminate = false;
    },
    // 单选
    handleCheckedItem(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.compress_result.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.compress_result.length;
    },
    open() {
      this.dialogTableVisible = true
      this.insideValue = []
    },
    // 确认
    confirm() {
      this.$message.info('请选择')
      if (this.checkList.length == 0) return
      this.dialogTableVisible = false
      this.$message.success('批量筛选成功，请点击查询')
      this.$emit("input", this.checkList);
    },
    clear() {
      this.textarea = ''
      this.checkList = ''
      this.compress_result = ''
      this.checkAll = false
    },
    cancel() {
      // this.textarea = ''
      // this.checkList = ''
      // this.compress_result = ''
      this.dialogTableVisible = false
    },
    opertionListFun(data = []) {
      let arr_temp = [] // 存放所有渠道号
      let arr = data.map((item) => {
        let children = [];
        if (item.channels) {
          children = item.channels.map((_item) => {
            arr_temp.push(_item)
            return {
              label: _item || _item.title || _item.label,
              value: _item || _item.id || _item.value,
            };
          });
        } else {
          children = item.children.map((_item) => {
            return {
              label: _item.title || _item.label,
              value: _item.id || _item.value,
            };
          });
        }
        return {
          label: item.label || item.title,
          value: item.value || item.id,
          children
        };
      });
      this.channelChildrens = arr_temp
      this.options = arr;
      this.optionsCopy = arr;
    },
    change(val) {
      this.$emit('change', val)
    },
    removetag(e) {
      let obj = {};
      obj.stopPropagation = () => { };
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

/deep/ .multi-cascader-style {
  width: 100% !important;
}
</style>
