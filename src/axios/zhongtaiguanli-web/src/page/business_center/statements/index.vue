<template>
  <div>
    <div class="box">
      <div>
        <span :class="radio==32?'index active':'index'" @click="gotoIndex">首页</span>
        <span :class="radio==33?'advertisement active':'advertisement'" @click="gotoAdver">广告收入明细</span>
        <span :class="radio==41?'advertisement active':'advertisement'" @click="gotoMember">会员收入明细</span>
        <span :class="radio==42?'advertisement active':'advertisement'" @click="gotoPackage">套餐复购情况</span>
      </div>
      <div>
        <el-button @click="dialogVisible = true" class="margin-top">模块设置</el-button>
      </div>
    </div>
    <el-dialog
      :title="DashboardSetting.basename"
      @close="resumeDashboardSetting"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-checkbox-group v-model="checkList">
        <el-checkbox
          v-for="(v,i) in DashboardSetting.children"
          :label="v.id"
          :key="i"
        >{{v.basename}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resumeDashboardSetting">取 消</el-button>
        <el-button type="primary" @click="saveBoardSetting">确 定</el-button>
      </span>
    </el-dialog>

    <Index v-if="radio == 32" ref="index" :checkList="changeCheckList" />
    <Advertisement v-if="radio == 33" ref="index" :checkList="changeCheckList" />
    <MemberDetails v-if="radio == 41" ref="index" :checkList="changeCheckList" />
    <PackageF v-if="radio == 42" ref="index" :checkList="changeCheckList" />
  </div>
</template>

<script>
import Index from './component/index.vue'
import Advertisement from './component/advertisement.vue'
import MemberDetails from './component/memberdetails.vue'
import PackageF from './component/packageF.vue'
export default {
  data() {
    return {
      radio: 32,
      changeCheckList: [],
      checkList: [],
      dialogVisible: false,
      DashboardSetting: [],
    }
  },
  components: {
    Index,
    Advertisement,
    MemberDetails,
    PackageF
  },
  mounted() {
    this.getDashboardSetting()
  },
  methods: {
    gotoIndex() {
      if (this.radio == 32) {
        return
      }
      this.radio = 32
      this.getDashboardSetting()
    },
    gotoAdver() {
      if (this.radio == 33) {
        return
      }
      this.radio = 33
      this.getDashboardSetting()
    },
    gotoMember(){
     if (this.radio == 41) {
        return
      }
      this.radio = 41
      this.getDashboardSetting()
    },
    gotoPackage(){
      if (this.radio == 42) {
        return
      }
      this.radio = 42
      this.$nextTick(()=>{
        this.$refs.index.getDashboardSetting()
      })

    },
    async getDashboardSetting() {
      const [err, res] = await this.$http.post('Business/dashboardSetting', {
        pid: this.radio,
      })
      if (err) return
      let checkList = []
      this.DashboardSetting = res
      console.log(res);
      res.children.forEach((item) => {
        if (item.clicked == 1) {
          checkList.push(item.id)
        }
      })
      this.changeCheckList = [...checkList]
      this.checkList = [...checkList]
      console.log(this.changeCheckList);
      this.$refs.index.getDashboardSetting()
    },
    // 取消模板设置
    resumeDashboardSetting() {
      this.checkList = [...this.changeCheckList]
      this.dialogVisible = false
      this.radio == 41 ? this.$refs.index.getOrderPlan():this.$refs.index.fetchCount()
      this.radio == 41 ? this.$refs.index.getOrderPay():this.$refs.index.getReport()
      this.radio == 32 ? this.$refs.index.funnelEach() : ''
    },
    // 保存模板设置
    async saveBoardSetting() {
      const [err, res] = await this.$http.post('Business/saveBoardSetting', {
        setting_ids: this.checkList,
        pid: this.radio,
      })
      if (err) return
      this.changeCheckList = [...this.checkList]
      this.dialogVisible = false
      this.radio == 41 ? this.$refs.index.getOrderPlan():this.$refs.index.fetchCount()
      this.radio == 41 ? this.$refs.index.getOrderPay():this.$refs.index.getReport()
      this.radio == 32 ? this.$refs.index.funnelEach() : ''
    },
  },
}
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
  .advertisement{
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
</style>