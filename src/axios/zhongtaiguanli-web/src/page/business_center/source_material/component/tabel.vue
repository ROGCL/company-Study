<template >
  <div class="table-wrap">
    <el-table
      :data="NewDta"
      style="width: 100%"
      v-loading="loading"
      border
      :cell-style="cellStyle"
      :header-cell-style="headerCellStyle"
      @sort-change="onSortChange"
    >
      <el-table-column label="视频"  width="300" align="center">
        <template slot-scope="scope">
          <div class="videoBox">
            <div>
              <img
                :src="scope.row.cover_url?scope.row.cover_url:'@/asset/img/video_info.jpg'"
                class="video_img"
                alt=""
                style="cursor:pointer"
                @click="openDialog(scope.row)"
                
              />
              <!-- v-if="scope.row.material_url" -->
              <!-- <img
                src="@/asset/img/video_node.png"
                class="video_img"
                alt=""
                v-else
              /> -->
            </div>
            <div style="padding: 0 20px">
              <div>ID:{{ scope.row.material_id }}</div>
              <div>创建时间:{{ scope.row.stat_datetime }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="cycle" label="点击转化率环比增长">
        <template slot-scope="scope">
          {{(scope.row.cycle*100).toFixed(2)}}%
        </template>
      </el-table-column>
      <el-table-column prop="cost" label="消耗">
        <template slot-scope="scope">
          {{ Number(scope.row.cost[0]) }}
          <el-progress
            :show-text="false"
            :stroke-width="10"
            :percentage="
              Number(scope.row.cost[0]) == scope.row.costList[0] &&
              scope.row.cost[0] != 0
                ? 100
                : Number(scope.row.cost[0]) != 0 &&
                  Number(scope.row.costList[0]) != 0
                ? (Number(scope.row.cost[0]) / Number(scope.row.costList[0])) *
                  100
                : 0
            "
            color="#02A7F0"
          ></el-progress>
          <br />
          {{ Number(scope.row.cost[1]) }}
          <el-progress
            :show-text="false"
            :stroke-width="10"
            :percentage="
              scope.row.cost[1] == scope.row.costList[0] &&
              scope.row.cost[1] != 0
                ? 100
                : Number(scope.row.cost[1]) != 0 &&
                  Number(scope.row.costList[0]) != 0
                ? (Number(scope.row.costList[0]) / Number(scope.row.cost[1])) *
                  100
                : 0
            "
            color="#70B603"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column prop="ctr" label="点击率">
        <template slot-scope="scope">
          {{ (Number(scope.row.ctr[0]) * 100).toFixed(2) + "%" }}
          <el-progress
            :show-text="false"
            :stroke-width="10"
            :percentage="scope.row.ctr[0] * 100"
            color="#02A7F0"
          ></el-progress>
          <br />
          {{ (Number(scope.row.ctr[1]) * 100).toFixed(2) + "%" }}
          <el-progress
            :show-text="false"
            :stroke-width="10"
            :percentage="scope.row.ctr[1] * 100"
            color="#70B603"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column prop="click_pay_rate" label="转化率">
        <template slot-scope="scope">
          {{ (Number(scope.row.click_pay_rate[0]) * 100).toFixed(2) + "%" }}
          <el-progress
            :show-text="false"
            :stroke-width="10"
            :percentage="scope.row.click_pay_rate[0] * 100"
            color="#02A7F0"
          ></el-progress>
          <br />
          {{ (Number(scope.row.click_pay_rate[1]) * 100).toFixed(2) + "%" }}
          <el-progress
            :show-text="false"
            :stroke-width="10"
            :percentage="scope.row.click_pay_rate[1] * 100"
            color="#70B603"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column prop="cost_pay_cost" label="转化成本">
        <template slot-scope="scope">
          {{ Number(scope.row.cost_pay_cost[0]) }}
          <el-progress
            :show-text="false"
            :stroke-width="10"
            :percentage="
              Number(scope.row.cost_pay_cost[0]) ==
                scope.row.cost_pay_cost_List[0] &&
              scope.row.cost_pay_cost[0] != 0
                ? 100
                : Number(scope.row.cost_pay_cost[0]) != 0 &&
                  Number(scope.row.cost_pay_cost_List[0]) != 0
                ? (Number(scope.row.cost_pay_cost[0]) /
                    Number(scope.row.cost_pay_cost_List[0])) *
                  100
                : 0
            "
            color="#02A7F0"
          ></el-progress>
          <br />
          {{ Number(scope.row.cost_pay_cost[1]) }}
          <el-progress
            :show-text="false"
            :stroke-width="10"
            :percentage="
              scope.row.cost_pay_cost[1] == scope.row.cost_pay_cost_List[0] &&
              scope.row.cost_pay_cost[1] != 0
                ? 100
                : Number(scope.row.cost_pay_cost[1]) != 0 &&
                  Number(scope.row.cost_pay_cost_List[0]) != 0
                ? (Number(scope.row.cost_pay_cost_List[0]) /
                    Number(scope.row.cost[1])) *
                  100
                : 0
            "
            color="#70B603"
          ></el-progress>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <el-pagination
        background
        :layout="layout"
        :total="total"
        :page-size="2"
        :current-page="size"
        @current-change="onPageChange"
      ></el-pagination>
    </div>
  </div>
</template >

<script >
import LeadOut from "@/component/lead-out";

export default {
  name: "tableLayout",
  data() {
    return {
      propList: ["cost", "ctr", "click_pay_rate", "cost_pay_cost"],
      size: 1,
      dialogVisible:false
    };
  },
  components: {
    LeadOut,
  },
  computed: {
    NewDta() {
      let data = this.data;
      if (data.length) {
      let newArr = this.group(data, 2);
      this.total = data.length
        let costList = [];
        let ctrList = [];
        let click_pay_rate_List = [];
        let cost_pay_cost_List = [];
        newArr[this.size - 1].forEach((item) => {
          costList.push(...item.cost);
          ctrList.push(...item.ctr);
          click_pay_rate_List.push(...item.click_pay_rate);
          cost_pay_cost_List.push(...item.cost_pay_cost);
        });
        newArr[this.size - 1].forEach((item) => {
          item.costList = costList.sort(function (a, b) {
            return b - a;
          });
          item.ctrList = ctrList.sort(function (a, b) {
            return b - a;
          });
          item.click_pay_rate_List = click_pay_rate_List.sort(function (a, b) {
            return b - a;
          });
          item.cost_pay_cost_List = cost_pay_cost_List.sort(function (a, b) {
            return b - a;
          });
        });
        return newArr[this.size - 1];
      } else {
        this.total = 0
        return data;
      }
    },
  },
  props: {
    data: {
      type: Array,
    },
    column: {
      type: Array,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    loading: {
      type: Boolean,
    },
    leadOut: {
      type: Boolean,
    },
    cellStyle: {
      type: Function,
    },
    headerCellStyle: {
      type: Function,
    },
    layout: {
      type: String,
      default: "prev, pager, next",
    },
    alignStyle: {
      type: String,
      default: "left",
    },
    tooltipFlag: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onPageChange(current) {
      this.size = current;
    },
    onSpanOption(obj) {
      this.$emit("spanOption", obj);
    },
    onSortChange(data) {
      this.$emit("sortChange", data);
    },
    headSpanFit(h, { column, index }) {
      let labelLong = column.label ? column.label.length : 1; // 表头label长度
      let size = 14; // 根据需要定义标尺，直接使用字体大小确定就行，也可以根据需要定义
      column.minWidth = labelLong * size + 80; // 根据label长度计算该表头最终宽度
      return h("span", { class: "cell-content", style: { width: "100%" } }, [
        column.label,
      ]);
    },
    group(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)));
      }
      return newArray;
    },
    openDialog(data){
     this.$emit('videoUrlClick',{data,type:'openDialog'})
     // window.open(data.material_url);
    }
  },
};
</script >

<style lang = "less" scoped >
.table-wrap {
  margin-top: 20px;

  .table-option {
    background-color: #fff;
    padding: 20px 100px 20px 10px;
    display: flex;
    align-items: center;
    position: relative;

    .leaout {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
    }
  }

  .table-footer {
    display: flex;
    flex-direction: row-reverse;
    background-color: #fff;
    padding: 20px;
  }
  .videoBox {
    display: flex;
  }
  .video_img {
    width: 100px;
    height: 100px;

  }
}
</style >