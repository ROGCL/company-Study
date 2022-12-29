<template>
  <div class="basic">
    <div class="hd">
      <div class="seting">
        <p class="item" @click="seting">
          <i class="el-icon-s-tools"></i>
          <span class="tt">设置</span>
        </p>
      </div>
      <div class="tab" v-if="tabData.length">
        <tab-card
          :tabData="tabData"
          :options="baseChartFilter"
          :request="Dashboard_baseDashboardLine"
          @appChange="getChartList"
        ></tab-card>
      </div>
    </div>
    <div class="chart-list">
      <cardChart
        class="cardChart"
        v-for="( { title, tips, option, echartsProp, request, component, desc }, index ) in chartList"
        :key="index"
        :title="title"
        :tips="tips"
        :desc="desc"
        :echartsProp="echartsProp"
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
  Dashboard_baseDashboard,
  Dashboard_baseDashboardLine,
} from '@/config/api/index'
import { baseTab, BASIC_CHARTLIST, baseChartFilter } from '../utils'
import cardChart from '../components/card/card'
import tabCard from '../components/tabcard/tabcard'
import elDialog from '../components/dialog/dialog'

export default {
  data() {
    return {
      currentTab: 0,
      baseChartFilter,
      tabData: [],
      ids: [],
      chartList: [],
      Dashboard_baseDashboardLine,
    }
  },
  created() {
    baseTab.forEach((item, index) => {
      baseTab[index].data.today.value = 0
      baseTab[index].data.yesterday.value = 0
      baseTab[index].data.ratio.value = 0
      baseTab[index].data.status = 0
    })
    this.tabData = baseTab
    this.getChartList();
  },
  watch: {
    $route() {
      baseTab.forEach((item, index) => {
        baseTab[index].data.today.value = 0
        baseTab[index].data.yesterday.value = 0
        baseTab[index].data.ratio.value = 0
        baseTab[index].data.status = 0
      })
      this.tabData = baseTab
      this.getChartList()
    },
  },
  methods: {
    onSwitchTab(index) {
      this.currentTab = index
    },
    async getChartList() {
      this.chartList = null;
      let ids = [];
      const CLICKED = 1; // 状态为1的就是选中的
      await Dashboard_dashboardSetting({ pid: 1 }).then((res) => {
        let { children } = res[1];
        children.forEach(({ children }) => {
          children.forEach((item) => {
            if (item.clicked == CLICKED) {
              ids.push(item.id);
            }
          })
        })
      })
      this.ids = ids;
      const chartList = BASIC_CHARTLIST.filter(({ id }) => {
        return ids.includes(id)
      });
      setTimeout(()=>{
        this.chartList = chartList
      },600)
      this.getTab();
    },
    getTab() {
      Dashboard_baseDashboard({ setting_ids: this.ids }).then((res) => {
        if (res[2] == 1) {
          baseTab.forEach((item, index) => {
            res[1].forEach(( item2, index2) => {
              if (item.id == item2.id) {
                baseTab[index].data.today.value = res[1][index2].data.today
                baseTab[index].data.yesterday.value = res[1][index2].data.yesterday
                baseTab[index].data.ratio.value = res[1][index2].data.ratio
                baseTab[index].data.status = res[1][index2].data.status
              }
            })
          })
          let idArr = res[1].map( el => el.id);
          this.tabData = baseTab.filter( el => {
            if(idArr.indexOf(el.id) != -1){
              return el
            }
          });
        }
      })
    },
    seting() {
      this.$refs.elDialog.dialogVisible = true;
      this.$refs.elDialog.pid = '1';
    },
  },
  components: {
    tabCard,
    elDialog,
    cardChart,
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
      width: 100px;
      font-size: 14px;
      color: #5a5c60;
      margin: 0;
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