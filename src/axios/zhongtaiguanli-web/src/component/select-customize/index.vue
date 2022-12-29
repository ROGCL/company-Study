<template>
  <div class="">
    <div class="ac">
      <el-select v-model="value.appInfo" placeholder="请选择" @remove-tag="clearData" multiple :multiple-limit="100"
        collapse-tags @change="changeOption" @focus="initOption" @visible-change="visblechange">
        <!-- :popper-append-to-body="false" -->
        <div style="min-width: 500px">
          <el-row>
            <el-col :span="12" class="wrapper-left-box" v-infinite-scroll="load" :infinite-scroll-immediate="false"
              :infinite-scroll-distance="20">
              <div class="wrapper-left">
                <div class="left_title">
                  <el-button type="text" @click="AllOption">全选</el-button>
                  <el-button type="text" @click="backOption" :disabled="value.appInfo.length ? false : true">反选
                  </el-button>
                </div>
                <div style="padding: 5px 20px">
                  <el-input size="mini" v-model="inputval" @input="inputChange" />
                </div>
              </div>
              <!-- <div style="height:100px"></div> -->
              <template #prefix>
                <span v-if="systemIcon" class="iconfont" :class="systemIcon"></span>
              </template>
              <div class="box-wrapper">
                <!-- v-for="(item, index) in value.app ? value.app : data_show_arr" -->
                <!-- :disabled="item.shownothing" -->
                <el-option v-for="(item, index) in data_show_arr" :key="index" :value="item.id" :label="item.title"
                  class="options-wrapper">
                  <el-tooltip class="item" effect="dark" :content="item.title" placement="right">
                    <div>
                      <span class="iconfont"
                        :class="[item.system ? formatSystemIcon(item.system) : '', item.shownothing ? 'shownothing' : '']">{{
                            item.title
                        }}
                      </span>
                      <span v-if="item.subtitle" class="subtitle">{{
                          item.subtitle
                      }}</span>
                    </div>
                  </el-tooltip>
                </el-option>
              </div>
            </el-col>
            <el-col :span="12" class="wrapper-left-box">
              <div class="option_child" :key="num">
                <div class="title">
                  <span>已选择：{{
                      value.optionList ? value.optionList.length : 0
                  }} 条数据</span>
                  <el-button type="text" @click="cleanOption">清空全部</el-button>
                </div>
                <!-- <div style="height:50px"></div> -->
                <div v-for="(item, index) in value.optionList" :key="index" class="option_child_card">
                  <!-- <span class="iconfont" :class="item.system ? formatSystemIcon(item.system) : ''">{{ item.title  }}</span> -->
                  <div>
                    <span class="iconfont" :class="item.system ? formatSystemIcon(item.system) : ''">{{ item.title }}
                    </span>
                    <span v-if="item.subtitle" class="subtitle">{{
                        item.subtitle
                    }}</span>
                  </div>
                  <span class="el-icon-close del_option" @click="delOption(item.id)"></span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-select>
      <el-button type="primary" v-if="multipleFlag" @click="open" style="margin-left:10px;height:40px">批量</el-button>
    </div>



    <el-dialog title="批量筛选" :visible.sync="dialogTableVisible" @close="cancel" :close-on-press-escape="false"
      :close-on-click-modal="false">
      <el-input type="textarea" :rows="6" placeholder="请输入内容，回车分割" v-model="textarea" @input="search">
      </el-input>
      <el-button @click="clear" type="warning" plain style="margin-top:20px">清空</el-button>
      <el-divider>总共查询（{{ textarea_arr.length }}）；<span style="color:#409eff">搜索结果（{{ compress_result.length
      }}）；</span><span style="color:#67c23a">已选择（{{ checkList.length }}）</span>
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
import { mapState } from "vuex";
import _ from 'lodash'
export default {
  props: {
    value: {
      type: Object,
    },
    // 原始数据
    data: {
      type: Array,
    },
    // 是否多选
    multipleFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      num: 0, //更新组件的key
      loadNum: 0,  // 分页
      inputval: "",
      data_temp: [],  // 临时数据，如果是搜索就展示搜索的所有数据，如果没有搜索就是全部原始数据
      data_show_arr: [],  // 当前列表展示的渠道号数据，包括分页
      data_temp_chunk_arr: [],  // 把数组拆分为数组合集 [[],[],[],[]]这种 ；方便进行分页加载
      channelArrList: [], // 抽离title的数组
      // data_search_temp_chunk_arr: [], // 
      searchTimer: null,
      timer: null,   // 多选搜索防抖
      isIndeterminate: true,  // 多选是否默认全选
      checkAll: false,  // 是否全选
      checkList: [],  // 多选 选择的数据
      compress_result: [], // 多渠道筛选结果
      textarea: "",
      dialogTableVisible: false,
      textarea_arr: [] // 记录一下总共查询了多少
    };
  },
  mounted() {
    this.num += 1;
  },
  methods: {

    search() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        // 空格区分
        let textarea_arr = this.textarea.split(/[\n,]/g)
        // 去除字符串的空格
        let textarea_arr_replace = textarea_arr.map(e => {
          return e.replace(/\s*/g, "")
        })
        // 记录一下总共查询了多少
        this.textarea_arr = textarea_arr
        this.compress_result = _.compact(_.intersection(textarea_arr_replace, this.channelArrList))
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
    },
    // 确认
    confirm() {
      if (this.checkList.length == 0) return this.$message.info('请选择')
      this.dialogTableVisible = false
      this.$message.success('批量筛选成功，请点击查询')
      this.$emit("input", {
        appInfo: this.checkList,
        optionList: []
      });
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
    // 初始化多选搜索
    initMuitpleSearch() {
      this.textarea = ''
      this.checkList = []
      this.compress_result = []
      this.checkAll = false
    },
    // 数据分页加载
    load() {
      if (this.data_show_arr[0].shownothing) return  // 如果搜索无数据也会触发加载分页，所以此处需要判断一下
      if (this.loadNum < this.data_temp_chunk_arr.length - 1) {
        this.loadNum += 1
        this.data_show_arr = [...this.data_show_arr, ...this.data_temp_chunk_arr[this.loadNum]]
      }
    },
    changeOption() {
      // 处理数据 再右边列表生成对应数据
      let arr = [];
      for (let index = 0; index < this.value.appInfo.length; index++) {
        const idx = this.data.findIndex(el => el.id == this.value.appInfo[index])
        if (idx > -1) {
          arr.push(this.data[idx])
        }
      }
      this.value.optionList = arr;
      this.initMuitpleSearch()
    },
    initOption() {
      // 获取焦点事件 初始化右边数据列表
      let arr = [];
      this.data.forEach((item) => {
        this.value.appInfo.forEach((_item) => {
          if (item.id == _item) {
            arr.push(item);
          }
        });
      });
      this.value.optionList = arr;
      this.num += 1;
      // 初始数据
      this.inputval = "";
      this.initListData(this.data)
    },

    // 初始化列表数据
    initListData(arr) {
      this.loadNum = 0
      this.data_temp_chunk_arr = _.chunk(arr, 100)
      this.data_show_arr = this.data_temp_chunk_arr[0]
    },
    AllOption() {
      // 选择全部app 同时映射左右列表
      let appInfo = [];
      for (const i of this.data_temp) {
        appInfo.push(i.id);
      }

      const arr = this.value.appInfo.concat(appInfo);
      this.value.appInfo = [...new Set(arr)]
      // 统一处理右侧渲染数据
      this.changeOption()
      this.initMuitpleSearch()
    },
    visblechange(e) {
      // if (!e && this.inputval != "") {
      //   this.inputval = "";
      //   this.inputChange();
      // }
    },

    // 下拉筛选手动输入查询
    inputChange() {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }
      this.searchTimer = setTimeout(() => {
        if (this.inputval == '') {
          this.data_temp = _.cloneDeep(this.data)
          this.initListData(this.data_temp)
        } else {
          // 模糊搜索匹配的值
          let arr = [];
          let inputV = this.inputval.toLocaleLowerCase();
          let reg = new RegExp(inputV, 'i');
          this.data.forEach((item) => {
            // 把副标题也加入搜索
            if ((item.title && reg.test(item.title)) || (item.subtitle && reg.test(item.subtitle))) {
              arr.push(item);
            }
          });
          /**
           * 
           * 获取已经选择的第一条数据
           */
          let selectdata1 =
            this.value.optionList.length > 0 ? this.value.optionList[0] : "";
          // 查询选中的第一条数据是否在筛选列表中
          const idx = arr.findIndex((el) => el.id == selectdata1.id);
          // 搜索结果有数据
          if (arr.length) {
            // if (idx < 0) {
            //   arr.push(selectdata1);
            // }
            this.data_temp = arr
            this.initListData(arr)
          } else {
            // 无数据
            let temp = [{
              title: '没有搜索到数据~',
              id: '-100',
              shownothing: true
            }]
            // if (idx < 0) {
            //   temp.push(selectdata1);
            // }
            this.data_temp = []
            this.data_show_arr = temp
          }
        }
      }, 300)
    },
    cleanOption() {
      // 清除左右列表
      this.value.appInfo = [];
      this.value.optionList = [];
      this.initMuitpleSearch()
      /*      this.$emit('clearData') */
    },
    backOption() {
      let appInfo = [];
      let optionList = [];

      let defference = this.data_temp.filter(
        (v) => this.value.appInfo.indexOf(v.id) == -1
      );
      if (defference.length) {
        /* defference.forEach((item) => {
          appInfo.push(item.id);
          optionList.push(item);
        }); */
        for (let index = 0; index < defference.length; index++) {
          const el = this.data_temp[index]
          appInfo.push(el.id);
          optionList.push(el);
        }
        this.value.appInfo = appInfo;
        this.value.optionList = optionList;
      } else {
        this.value.appInfo = [];
        this.value.optionList = [];
      }
      this.initMuitpleSearch()
      /* this.value.appInfo = [...new Set(appInfo)];
            this.value.optionList = [...new Set(optionList)]; */
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
      this.initMuitpleSearch()
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
    clearData() {
      if (this.value.appInfo.length == 0) {
        this.$emit("clearData");
      }
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
    data: {
      handler: function (val) {
        this.data_temp = _.cloneDeep(val)
        // this.data_temp_chunk_arr = _.chunk(this.data_temp, 100)
        this.data_show_arr = _.chunk(this.data_temp, 100)[0]

        /**
         * 这里是为了渠道号多选，单独把所有的渠道号抽离成一个数组，方便批量筛选
         * 结果如下 ['A','B']
         *  */
        if (this.multipleFlag) {
          this.channelArrList = _.flatMap(this.data_temp, n => [n.title])
        }
      },
      immediate: true,
      deep: true
    }
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
  padding: 0 20px;

  .option_child_card {
    .del_option {
      cursor: pointer;
      padding: 5px;
    }

    display: flex;
    justify-content: space-between;
    background: rgb(240, 240, 240);
    padding: 15px 10px;
    margin: 10px 0;
    border-radius: 10px;
  }

  .title {
    font-size: 14px;
    display: flex;
    justify-content: space-around;
    line-height: 40px;
    position: sticky;
    width: 100%;
    margin-top: -5px;
    margin-bottom: 20px;
    top: 0;
    background: #FFF;
  }
}

.sub-title {
  font-size: 13px;
  color: #999;
  font-weight: normal;
}

.options-wrapper {
  height: auto !important;
}

.subtitle {
  display: block;
  color: #999;
  font-weight: normal;
}

.options-wrapper::after {
  top: 50% !important;
  transform: translateY(-50%);
}

.wrapper-left-box {
  height: 245px;
  overflow-y: scroll;
  position: relative
}

.wrapper-left {
  position: sticky;
  z-index: 99;
  background: #FFF;
  width: 100%;
  top: 0;
  margin-top: -5px;
  margin-bottom: 20px;
}

.shownothing {
  font-size: 12px !important;
  color: #999 !important;
}

.select-wrapper {
  // width: 75%;
}

.w100 {
  width: 100%;
}

.ac {
  display: flex;
  align-items: center;
}
</style>