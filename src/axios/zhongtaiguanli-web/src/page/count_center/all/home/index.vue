<template>
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="日期" prop="time">
          <el-date-picker
            v-model="searchForm.time"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <div class="panel" v-loading="panelLoading">
      <el-row :gutter="20">
        <el-col :sm="24" :md="12" :lg="{ span: '4-8' }">
          <div class="panel-item">
            <div class="title">新激活设备</div>
            <div class="content">
              <div class="content-item">
                <div class="label">今日</div>
                <div class="value">
                  {{ panelData.activateDevice.today | formatUnit }}
                </div>
              </div>
              <div class="content-item">
                <div class="label">昨日</div>
                <div class="value">
                  {{ panelData.activateDevice.yesterday | formatUnit }}
                </div>
              </div>
              <div class="content-item" v-if="panelData.activateDevice.cycle">
                <div class="label">昨日同期</div>
                <div
                  class="value"
                  :class="
                    panelData.activateDevice.cycle.indexOf('-') == -1 &&
                    panelData.activateDevice.cycle != 0
                      ? 'up'
                      : panelData.activateDevice.cycle.indexOf('-') !== -1
                      ? 'down'
                      : ''
                  "
                >
                  {{ (panelData.activateDevice.cycle * 100).toFixed(2) + "%" }}
                  <i
                    class="iconfont"
                    :class="
                      panelData.activateDevice.cycle.indexOf('-') == -1 &&
                      panelData.activateDevice.cycle != 0
                        ? 'icon-shangzhang up'
                        : panelData.activateDevice.cycle.indexOf('-') !== -1
                        ? 'icon-xiadie down'
                        : ''
                    "
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :sm="24" :md="12" :lg="{ span: '4-8' }">
          <div class="panel-item">
            <div class="title">活跃用户数</div>
            <div class="content">
              <div class="content-item">
                <div class="label">今日</div>
                <div class="value">
                  {{ panelData.activateUser.today | formatUnit }}
                </div>
              </div>
              <div class="content-item">
                <div class="label">昨日</div>
                <div class="value">
                  {{ panelData.activateUser.yesterday | formatUnit }}
                </div>
              </div>
              <div class="content-item" v-if="panelData.activateUser.cycle">
                <div class="label">昨日同期</div>
                <div
                  class="value"
                  :class="
                    panelData.activateUser.cycle.indexOf('-') == -1 &&
                    panelData.activateUser.cycle != 0
                      ? 'up'
                      : panelData.activateUser.cycle.indexOf('-') !== -1
                      ? 'down'
                      : ''
                  "
                >
                  {{ (panelData.activateUser.cycle * 100).toFixed(2) + "%" }}
                  <i
                    class="iconfont"
                    :class="
                      panelData.activateUser.cycle.indexOf('-') == -1 &&
                      panelData.activateUser.cycle != 0
                        ? 'icon-shangzhang up'
                        : panelData.activateUser.cycle.indexOf('-') !== -1
                        ? 'icon-xiadie down'
                        : ''
                    "
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :sm="24" :md="12" :lg="{ span: '4-8' }">
          <div class="panel-item">
            <div class="title">收入</div>
            <div class="content">
              <div class="content-item">
                <div class="label">今日</div>
                <div class="value">{{ panelData.allIncome.today }}</div>
                <!-- panelData.allIncome.today ? formatIsToday(panelData.allIncome.today) : '--' -->
              </div>
              <div class="content-item">
                <div class="label">昨日</div>
                <div class="value">
                  {{ panelData.allIncome.yesterday | formatUnit }}
                </div>
              </div>
              <div class="content-item" v-if="panelData.allIncome.cycle">
                <div class="label">昨日同期</div>
                <div
                  class="value"
                  :class="
                    panelData.allIncome.cycle.indexOf('-') == -1 &&
                    panelData.allIncome.cycle != 0
                      ? 'up'
                      : panelData.allIncome.cycle.indexOf('-') !== -1
                      ? 'down'
                      : ''
                  "
                >
                  {{ (panelData.allIncome.cycle * 100).toFixed(2) + "%" }}
                  <i
                    class="iconfont"
                    :class="
                      panelData.allIncome.cycle.indexOf('-') == -1 &&
                      panelData.allIncome.cycle != 0
                        ? 'icon-shangzhang up'
                        : panelData.allIncome.cycle.indexOf('-') !== -1
                        ? 'icon-xiadie down'
                        : ''
                    "
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :sm="24" :md="12" :lg="{ span: '4-8' }">
          <div class="panel-item">
            <div class="title">支出</div>
            <div class="content">
              <div class="content-item">
                <div class="label">今日</div>
                <div class="value">
                  {{ panelData.expenditure.today | formatUnit }}
                </div>
              </div>
              <div class="content-item">
                <div class="label">昨日</div>
                <div class="value">
                  {{ panelData.expenditure.yesterday | formatUnit }}
                </div>
              </div>
              <div class="content-item" v-if="panelData.expenditure.cycle">
                <div class="label">昨日同期</div>
                <div
                  class="value"
                  :class="
                    panelData.expenditure.cycle.indexOf('-') == -1 &&
                    panelData.expenditure.cycle != 0
                      ? ' up'
                      : panelData.expenditure.cycle.indexOf('-') !== -1
                      ? ' down'
                      : ''
                  "
                >
                  {{ (panelData.expenditure.cycle * 100).toFixed(2) + "%" }}
                  <i
                    class="iconfont"
                    :class="
                      panelData.expenditure.cycle.indexOf('-') == -1 &&
                      panelData.expenditure.cycle != 0
                        ? 'icon-shangzhang up'
                        : panelData.expenditure.cycle.indexOf('-') !== -1
                        ? 'icon-xiadie down'
                        : ''
                    "
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :sm="24" :md="12" :lg="{ span: '4-8' }">
          <div class="panel-item">
            <div class="title">ROI</div>
            <div class="content">
              <div class="content-item">
                <div class="label">今日</div>
                <div class="value">
                  {{ formatPercentage(panelData.proportion.today) }}
                </div>
              </div>
              <div class="content-item">
                <div class="label">昨日</div>
                <div class="value">
                  {{ panelData.proportion.yesterday | formatPercentage }}
                </div>
              </div>
              <div class="content-item" v-if="panelData.proportion.cycle">
                <div class="label">昨日同期</div>
                <div
                  class="value"
                  :class="
                    panelData.proportion.cycle.indexOf('-') == -1 &&
                    panelData.proportion.cycle != 0
                      ? ' up'
                      : panelData.proportion.cycle.indexOf('-') !== -1
                      ? ' down'
                      : ''
                  "
                >
                  {{ (panelData.proportion.cycle * 100).toFixed(2) + "%" }}
                  <i
                    class="iconfont"
                    :class="
                      panelData.proportion.cycle.indexOf('-') == -1 &&
                      panelData.proportion.cycle != 0
                        ? 'icon-shangzhang up'
                        : panelData.proportion.cycle.indexOf('-') !== -1
                        ? 'icon-xiadie down'
                        : ''
                    "
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      @pageChange="onPageChange"
      @sortChange="onSortChange"
      @sizeChange="onSizeChange"
    >
      <template #is_collect="row">
        <div class="star" @click="onStar(row.row.id)">
          <i
            :class="row.row.is_collect ? 'el-icon-star-on' : 'el-icon-star-off'"
          ></i>
        </div>
      </template>
      <template #system="row">{{ row.row.system | formatSystem }}</template>
      <template #time>
        <div>今日</div>
        <div>昨日</div>
      </template>
      <template #activateDevice="row">
        <div>
          {{ row.row.activateDevice ? row.row.activateDevice.today : "--" }}
        </div>
        <div>
          {{ row.row.activateDevice ? row.row.activateDevice.yesterday : "--" }}
        </div>
      </template>
      <template #activateUser="row">
        <div>
          {{ row.row.activateUser ? row.row.activateUser.today : "--" }}
        </div>
        <div>
          {{ row.row.activateUser ? row.row.activateUser.yesterday : "--" }}
        </div>
      </template>
      <template #allIncome="row">
        <div>{{ row.row.allIncome ? row.row.allIncome.today : "--" }}</div>
        <div>{{ row.row.allIncome ? row.row.allIncome.yesterday : "--" }}</div>
      </template>
      <template #orderIncome="row">
        <div>{{ row.row.orderIncome ? row.row.orderIncome.today : "--" }}</div>
        <div>
          {{ row.row.orderIncome ? row.row.orderIncome.yesterday : "--" }}
        </div>
      </template>
      <template #advertIncome="row">
        <div>
          {{ row.row.advertIncome ? row.row.advertIncome.today : "--" }}
        </div>
        <div>
          {{ row.row.advertIncome ? row.row.advertIncome.yesterday : "--" }}
        </div>
      </template>
      <template #expenditure="row">
        <div>{{ row.row.expenditure ? row.row.expenditure.today : "--" }}</div>
        <div>
          {{ row.row.expenditure ? row.row.expenditure.yesterday : "--" }}
        </div>
      </template>
      <template #proportion="row">
        <div v-if="row.row.proportion">
          <div>{{ formatPercentage(row.row.proportion.today) }}</div>
          <div>{{ row.row.proportion.yesterday | formatPercentage }}</div>
        </div>
      </template>
      <template #option="row">
        <el-button @click="onCheckApp(row.row)" type="primary" size="small"
          >跳转</el-button
        >
      </template>
    </TableLayout>
  </div>
</template>

<script>
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import { formatPercentage } from "@/util/filters";
import moment from "moment";
import { mapActions } from "vuex";

export default {
  name: "home",
  components: {
    TableLayout,
    FilterLayout,
  },
  data() {
    return {
      currentTime: moment().format("YYYY-MM-DD"),
      searchForm: {
        time: moment().format("YYYY-MM-DD"),
      },
      panelData: {
        activateDevice: {},
        activateUser: {},
        advertIncome: {},
        allIncome: {},
        expenditure: {},
        orderIncome: {},
        proportion: {},
      },
      panelLoading: false,
      column: [
        {
          prop: "is_collect",
          label: "收藏",
          width: "50",
        },
        {
          prop: "system",
          label: "平台",
        },
        {
          prop: "title",
          label: "名称",
        },
        {
          prop: "time",
          label: "时间",
        },
        {
          prop: "activateDevice",
          label: "新激活设备",
        },
        {
          prop: "activateUser",
          label: "活跃用户数",
        },
        {
          prop: "allIncome",
          label: "收入",
          sortable: "custom",
        },
        {
          prop: "orderIncome",
          label: "订单收入",
          sortable: "custom",
        },
        {
          prop: "advertIncome",
          sortable: "custom",
          label: "广告收入",
        },
        {
          prop: "expenditure",
          label: "支出",
          sortable: "custom",
        },
        {
          prop: "proportion",
          label: "ROI",
        },
        {
          prop: "option",
          label: "操作",
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      tableData: {
        data: [],
        total: 0,
        loading: false,
        currentPage: 1,
        pageSize: 10,
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      sort: {
        prop: "",
        order: "",
      },
    };
  },
  mounted() {
    this.fetchList();
    this.fetchData();
  },
  methods: {
    ...mapActions(["GET_AUTH_MENU", "getChannel", "getAppVersion"]),
    onSubmit() {
      this.tableOpt.currentPage = 1;
      this.currentTime = this.searchForm.time;
      this.fetchData();
      this.fetchList();
    },
    onPageChange(current) {
      this.tableOpt.currentPage = current;
      this.fetchList();
    },
    onSizeChange(current){
      this.tableOpt.pageSize = current
      this.fetchList();
    },
    async fetchData() {
      const { searchForm } = this;
      this.panelLoading = true;

      const [err, res] = await this.$http.post("Index/summary", {
        timeBegin: searchForm.time,
        timeEnd: searchForm.time,
      });

      this.panelLoading = false;

      if (err) return;
      this.panelData = res;
    },
    async fetchList() {
      const { tableOpt, searchForm, sort } = this;

      this.tableData.loading = true;
      if (!sort.order) {
        sort.prop = "";
      }

      const [err, res] = await this.$http.post("Index/index", {
        ...tableOpt,
        ...sort,
        timeBegin: searchForm.time,
        timeEnd: searchForm.time,
      });

      this.tableData.loading = false;

      if (err) return;

      const { list, currentPage, total } = res;

      this.tableData.data = list;
      this.tableData.currentPage = currentPage;
      this.tableData.total = total;
    },
    async onStar(id) {
      if (!id) return;

      const [err, res] = await this.$http.post("/Index/collect", {
        appid: id,
      });

      if (err) return;

      this.tableOpt.currentPage = 1;
      this.fetchList();
    },
    async onCheckApp(data) {
      if (!data) return;

      const { id } = data;

      const loading = this.$loading({
        lock: true,
        text: "获取权限中...",
        background: "rgba(0, 0, 0, 0.7)",
      });

      const [err, res] = await this.GET_AUTH_MENU({ appId: id });

      loading.close();

      if (err) {
        this.$notify.error({
          title: "获取权限出错",
          message: err,
        });
        return;
      }

      this.$router.replace(res[0].path + "?appId=" + id);

      loading.close();
    },
    formatIsToday(val) {
      if (this.currentTime === moment().format("YYYY-MM-DD")) {
        return "--";
      }

      return val;
    },
    formatPercentage,
    outPamrms() {
      const { searchForm, tableOpt } = this;
      console.log({
        ...searchForm,
        ...tableOpt,
      });
      return {
        ...searchForm,
        ...tableOpt,
      };
    },
    onSortChange(data) {
      const { prop, order } = data;
      this.sort = { prop, order };
      this.tableOpt.currentPage = 1;
      this.fetchList();
    },
  },
};
</script>

<style lang="less" scoped>
@import url("https://at.alicdn.com/t/font_2045734_4911j3gnbvk.css");
.panel {
  width: 100%;
  margin: 20px 0;

  .panel-item {
    background-color: #fff;
    padding: 20px 10px;
    border-radius: 8px;

    .title {
      font-size: 15px;
      margin-bottom: 20px;
    }

    .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 60px;

      .content-item {
        width: 100%;
        font-size: 14px;
        display: flex;
        align-items: center;
        .label {
          flex-shrink: 0;
        }

        .value {
          flex: 1;
          font-weight: bold;
          margin-left: 10px;
        }
      }
    }
  }
}

.star {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
}

/deep/.el-col-lg-4-8 {
  width: 20%;
}

/deep/.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}

.up {
  color: #ea5454;
}
.down {
  color: #17bf5e;
}
</style>