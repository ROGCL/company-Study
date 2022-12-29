<template>
  <div class="income">
    <div class="hd">
      <div class="seting">
        <p class="item" @click="seting">
          <i class="el-icon-s-tools"></i>
          <span class="tt">设置</span>
        </p>
      </div>
      <div class="tab" v-if="tabData.length">
        <tab-card
          name="income"
          :tabData="tabData"
          :options="currentTab=='0'?incomeChartFilterDate:incomeChartFilter"
          :request="Dashboard_incomeDashboardLine"
          @onSwitchTab="onSwitchTab"
        ></tab-card>
      </div>
    </div>
    <div class="chart-list">
      <cardChart
        class="cardChart"
        v-for="({ title, tips, option, echartsProp, request, component, desc },index) in chartList"
        :key="index"
        :echartsProp="echartsProp"
        :title="title"
        :tips="tips"
        :desc="desc"
        :option="option"
        :request="request"
        :component="component"
      />
    </div>
    <div class="dialog">
      <el-dialog ref="elDialog" @onChange="getChartList" />
    </div>
  </div>
</template>

<script>
import {
  Dashboard_dashboardSetting,
  Dashboard_incomeDashboard,
  Dashboard_incomeDashboardLine,
} from '@/config/api/index'
import { incomeTab, INCOME_CHARTLIST, incomeChartFilter,incomeChartFilterDate } from '../utils'
import cardChart from '../components/card/card'
import tabCard from '../components/tabcard/tabcard'
import elDialog from '../components/dialog/dialog'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      currentTab: '0',
      incomeChartFilter,
      incomeChartFilterDate,
      tabData: [],
      ids: [],
      chartList: [],
      Dashboard_incomeDashboardLine,
    }
  },
  mounted() {
    this.getChartList()
  },
  watch: {
    user() {
      this.$destroy()
    },
  },
  methods: {
    onSwitchTab(index) {
      this.currentTab = index
    },
    async getChartList() {
      this.chartList = null
      let ids = []
      const CLICKED = 1 // 状态为1的就是选中的
      await Dashboard_dashboardSetting({ pid: 2 }).then((res) => {
        let { children } = res[1]
        children.forEach(({ children }) => {
          children.forEach((item) => {
            if (item.clicked == CLICKED) {
              ids.push(item.id)
            }
          })
        })
      })
      this.ids = ids
      this.chartList = INCOME_CHARTLIST.filter(({ id }) => ids.includes(id))
      this.getTab()
    },
    getTab() {
      Dashboard_incomeDashboard({ setting_ids: this.ids }).then((res) => {
        if (res[2] == 1) {
          incomeTab.forEach((item, index) => {
            res[1].forEach((item2, index2) => {
              if (item.id == item2.id) {
                console.log(res[1][index2].data);
                incomeTab[index].data.today.value = res[1][index2].data.today;
                incomeTab[index].data.yesterday.value =res[1][index2].data.yesterday;
                incomeTab[index].data.ratio.value = res[1][index2].data.ratio;
                incomeTab[index].data.status = res[1][index2].data.status;
              }
            })
          });
          let idArr = res[1].map( el => el.id);
          this.tabData = incomeTab.filter( el => {
            if(idArr.indexOf(el.id) != -1){
              return el
            }
          });
          this.tabData[0].select = '2';
          console.log(this.tabData[0].select);
        }
      })
    },
    seting() {
      this.$refs.elDialog.dialogVisible = true
      this.$refs.elDialog.pid = '2'
    },
  },
  components: {
    tabCard,
    elDialog,
    cardChart,
  },
  computed: {
    ...mapState({
      user: (state) => state.user.app,
    }),
  },
}
</script>

<style lang='scss' scoped>
.hd {
  padding: 15px;
  background: #fff;
  .seting {
    padding: 0 0 11px 0;
    .item {
      margin: 0;
      width: 100px;
      font-size: 14px;
      color: #5a5c60;
      margin-left: auto;
      text-align: right;
      cursor: pointer;
      i {
        margin-right: 5px;
      }
    }
  }
}

.chart-list {
  display: flex;
  flex-wrap: wrap;
  margin-left: -20px;
  .card {
    flex: 1;
    margin-top: 20px;
  }
  .cardChart {
    margin-left: 20px;
  }
}

/deep/ .el-loading-spinner .path {
  stroke: #f99629;
}
</style>