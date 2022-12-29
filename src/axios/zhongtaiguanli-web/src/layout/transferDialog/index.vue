<template>
  <div>
    <el-button type="primary" @click="init" style="margin:10px">字段展示自定义</el-button>
    <el-dialog title="字段展示自定义" :visible.sync="transferDialog" width="800px" @before-close="resumeDashboardSetting">
      <slot name="navtabs"></slot>
      <Transfer :key="transferKey" :huiyuanType="huiyuanType" ref="transfer" :source-l="myData" :target-r="myData2" v-bind="$attrs" v-on="$listeners"
        v-if="flag" v-loading="loading" :changeData="changeData"></Transfer>
      <div slot="footer" class="my_footer">
        <div>
          <el-button @click="initData">重置自定义</el-button>
        </div>
        <div>
          <el-button @click="resumeDashboardSetting">取 消</el-button>
          <el-button type="primary" @click="getData">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from "store2";
import Transfer from '@/component/transfer/index'
export default {
  components: {
    Transfer,
  },
  props: {
    // 重置的接口
    postApi: {
      type: String,
      default: ''
    },
    // 重置的参数
    postParams: {
      type: Object,
      default: function () {
        return {}
      },
    },
    // 显示字段
    data1: {
      type: Array,
      default: function () {
        return []
      },
    },
    // 隐藏字段
    data2: {
      type: Array,
      default: function () {
        return []
      },
    },
    transferCard: {
      type: String,
    },
    changeData: {
      type: String,
      default: ''
    },
    huiyuanType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      transferDialog: false,
      flag: false,
      transferKey: 1,
      myData: [],  // 显示的字段
      myData2: [],  // 隐藏的字段
      loading: false
    }
  },
  computed: {
    // myData(){
    //   let data = [...this.data1]
    //   return data
    // },
    // myData2(){
    //   let data1 = [...this.data2]
    //   return data1
    // }
  },
  mounted() {
    this.flag = true
  },
  watch:{
    // data1:{
    //   handler:function(val){
    //     console.log(val,';监听')
    //     this.myData = [...val]
    //     this.changeKey()
    //   },
    //   deep:true
    // },
    // data2:{
    //   handler:function(val){
    //     console.log(val,';监听2')
    //     // this.myData2 = [...val]
    //     // this.changeKey()
    //   },
    //   deep:true
    // }

  },
  methods: {
    init() {
      this.myData = [...this.data1]
      this.myData2 = [...this.data2]
      this.changeKey()
      this.transferDialog = true
      this.flag = true
    },
    close() {
      this.transferDialog = false
      this.flag = false
    },
    getData() {
      let data = this.$refs.transfer.dataReturn()
      this.$emit('paramSave', data)
      this.transferDialog = false
      this.flag = false
    },
    resumeDashboardSetting() {
      // this.$emit('initData')
      this.transferDialog = false
      this.flag = false
    },
    initData() {
      // 如果有链接，直接请求接口进行重置
      if (this.postApi) {
        this.reset()
      }else if (this.transferCard == 'index') {
        this.$refs.transfer.initData()
      } else if (this.transferCard == 'advertisement') {
        this.$refs.transfer.advertInitData()
      } else if (this.transferCard == 'sourceMaterial') {
        this.$refs.transfer.sourceMaterial()
      } else if (this.transferCard == 'toufang') {
        this.$refs.transfer.toufangyunying()
      } else if (this.transferCard == 'huiyuan') {
        this.$refs.transfer.huiyuan()
      } 
    },
    async reset() {
      this.loading = true
      let params = {
        ...{
          loginId: store.get("user")["id"],
          loginToken: store.get("loginToken"),
          is_reset: true
        },
        ...this.postParams
      }
      const [err, res] = await this.$http.post(
        this.postApi,
        params
      );

      this.loading = false
      if (err) return;
      let show = res.show || res.showField || []
      let hidden = res.hidden || res.hiddenField || []
      show.forEach((item) => {
        item.isSelect = false;
      });
      hidden.forEach((item) => {
        item.isSelect = false;
      });
      this.myData = show
      this.myData2 = hidden
      this.$emit('moveItem',{show,hidden})
      this.changeKey()
    },
    changeKey() {
      this.transferKey += 1
    }
  },

}
</script>

<style lang="less" scoped>
/deep/.my_footer {
  display: flex;
  justify-content: space-between;
  padding: 0 50px;
  text-align: left;
}
</style>