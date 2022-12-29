<template>
  <div class="table-wrap">
    <slot name="tabs" v-if="tabLocation == 'top'"></slot>
    <slot name="title"></slot>
    <!-- tab切换 -->
    <slot name="tabs" v-if="tabLocation == 'center'"></slot>
    <div class="table-option" v-if="$slots['table-option'] || leadOut">
      <slot name="table-option"></slot>
      <LeadOut2
        class="leaout"
        v-if="leadOut && author == 'liuqiang'"
        :params="params"
        :column="column"
        :api="leadApi"
        :channelFlag="channelFlag"
      />
      <LeadOut
        class="leaout"
        v-else-if="leadOut && author == 'tanhao'"
        :params="params"
        :paramsType="paramsType"
        :column="childList ? childColumn : column"
        :api="leadApi"
        :channelFlag="channelFlag"
        :leadoutList="leadoutList"
        :videoFlag="videoFlag"
      />
    </div>
    <!-- tab切换 -->
    <slot name="tabs" v-if="tabLocation == 'bottom'"></slot>
    <!-- 表格的类型使用默认配置 -->
    <template v-if="tableType == 'default'">
      <el-table
        :data="data"
        style="width: 100%"
        v-loading="loading"
        ref="table"
        :default-sort="newDefaultSort"
        border
        :cell-style="cellStyle"
        :header-cell-style="headerCellStyle"
        @sort-change="onSortChange"
        :key="num"
        @header-dragend="headerDragend"
      >
        <el-table-column
          label="视频"
          v-if="PropStr && data.length"
          width="300"
          :prop="PropStr"
          align="center"
          :fixed="leftFlag"
        >
          <template slot-scope="scope">
            <div
              class="videoBox"
              v-if="scope.row.video != '总计' && scope.row.video != '均值'"
            >
              <!-- 磁力引擎 -->
              <div>
                <img
                  :src="
                    scope.row.cover_url
                      ? scope.row.cover_url
                      : '@/asset/img/video_info.jpg'
                  "
                  class="video_img"
                  alt=""
                  style="cursor: pointer"
                  @click="openDialog(scope.row)"
                  v-if="scope.row.material_url || params.platform == 1"
                />
                <img
                  :src="
                    scope.row.cover_url
                      ? scope.row.cover_url
                      : '@/asset/img/video_node.png'
                  "
                  class="video_img"
                  alt=""
                  v-else
                />
              </div>
              <div style="padding: 0 20px">
                <div>ID:{{ scope.row.material_id }}</div>
                <div>创建时间:{{ scope.row.date }}</div>
                <el-button
                  type="text"
                  @click="sourceInfo(scope.row)"
                  v-if="infoFlag === 1"
                  >素材详情</el-button
                >
              </div>
            </div>
            <div v-else>{{ scope.row.video }}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, item_index) in column"
          :key="item_index"
          :prop="item.prop"
          :label="item.label"
          :fixed="item.fixed || false"
          :span-method="onSpanOption"
          :sortable="item.sortable || false"
          :align="alignStyle"
          :width="item.width ? item.width : ''"
          :render-header="item.label === '应用运维总成本' ? '' : headSpanFit"
          :show-overflow-tooltip="tooltipFlag"
        >
          <template #header="scope">
            <div v-if="item.label === '应用运维总成本'">
              应用运维总成本
              <el-tooltip
                class="item"
                effect="dark"
                content="总成本不包含中台运维成本"
                placement="top-start"
              >
                <i class="el-icon-info"></i>
              </el-tooltip>
            </div>
            <div v-else>
              {{ item.label }}
            </div>
          </template>
          <template #default="scope">
            <slot :name="item.prop" :row="scope.row">{{
              scope.row[item.prop]
            }}</slot>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 使用多级表头 -->
    <template v-else-if="tableType == 'multilLevelHeader'">
      <el-table
        :data="data"
        style="width: 100%"
        ref="table"
        v-loading="loading"
        @sort-change="onSortChange"
        @header-dragend="headerDragend"
      >
        <el-table-column
          :fixed="k.fixed"
          :width="k.width ? k.width : ''"
          :label="k.label"
          v-for="(k, k_idx) in column"
          :key="k_idx"
          align="center"
        >
          <el-table-column
            :width="c.width ? c.width : 120"
            :prop="c.prop"
            v-for="(c, c_idx) in k.children"
            :key="c_idx"
            :label="c.label"
            align="center"
            :sortable="c.sortable || false"
            :render-header="headSpanFit"
          >
          </el-table-column>
        </el-table-column>
      </el-table>
    </template>

    <div class="table-footer">
      <el-pagination
        background
        :layout="layout"
        :total="total"
        :current-page="currentPage"
        @current-change="onPageChange"
        @size-change="handleSizeChange"
        v-if="tablePagination == 1"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
      ></el-pagination>
      <el-pagination
        v-else
        background
        layout="total, sizes,prev, pager, next, jumper"
        :total="total"
        :current-page="currentPage"
        @current-change="onPageChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import LeadOut from "@/component/lead-out";
import LeadOut2 from "@/component/lead-out/index2";
export default {
  name: "tableLayout",
  data() {
    return {
      newDefaultSort: {},
      num: 10086,
      scrollLeft: null,
    };
  },
  components: {
    LeadOut,
    LeadOut2,
  },
  mounted() {
    this.scroll();
  },
  beforeDestroy() {
    //页面销毁移除监听事件
    this.destroyScroll();
  },
  props: {
    infoFlag: {
      type: Number,
    },
    data: {
      type: Array,
    },
    column: {
      type: Array,
    },
    childColumn: {
      type: Array,
    },
    total: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    tabLocation: {
      type: String,
      default: "bottom",
    },
    tablePagination: {
      type: Number,
      default: 1,
    },
    loading: {
      type: Boolean,
    },
    leadoutList: {
      type: Boolean,
      default: false,
    },
    leadOut: {
      type: Boolean,
    },
    params: {
      type: Object,
    },
    cellStyle: {
      type: Function,
    },
    headerCellStyle: {
      type: Function,
    },
    leadApi: {
      type: String,
    },
    layout: {
      type: String,
      default: "total,sizes, prev, pager, next, jumper",
    },
    alignStyle: {
      type: String,
      default: "left",
    },
    tooltipFlag: {
      type: Boolean,
      default: false,
    },
    PropStr: {
      type: String,
      default: "",
    },
    channelFlag: {
      type: Boolean,
      default: false,
    },
    videoFlag: {
      type: Boolean,
      default: false,
    },
    leftFlag: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "tanhao", // 后端开发人员
    },
    tableType: {
      // table表格的样式，default表示默认，multilLevelHeader 表示多级表头
      type: String,
      default: "default",
    },
    childList: {
      //true为多级表格，false为单级表格
      type: Boolean,
      default: false,
    },
    paramsType: {
      type: Number,
      default: 0,
    },
    //默认排序
    defaultSort: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    scroll() {
      this.$refs.table.bodyWrapper.addEventListener("scroll", (e) => {
        this.scrollLeft = e.target.scrollLeft;
      });
    },
    destroyScroll() {
      this.$refs.table.bodyWrapper.removeEventListener("scroll", (e) => {
        this.scrollLeft = e.target.scrollLeft;
      });
    },
    Tablechange() {
      console.log(1);
    },
    doLayout() {
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
    // 表头拖拽
    headerDragend(newWidth, oldWidth, column, event){
      const idx = this.column.findIndex(el=>el.label == column.label)
      if(idx > -1){
        this.$set(this.column[idx],'width',newWidth)
      }
    },
    onPageChange(current) {
      this.$emit("pageChange", current);
    },
    handleSizeChange(current) {
      this.$emit("sizeChange", current);
    },
    onSpanOption(obj) {
      this.$emit("spanOption", obj);
    },
    onSortChange(data) {
      this.$emit("sortChange", data);
    },
    sourceInfo(data) {
      this.$emit("changeSourceInfo", data);
    },
    headSpanFit(h, { column, index }) {
      let labelLong = column.label ? column.label.length : 1; // 表头label长度
      let size = 14; // 根据需要定义标尺，直接使用字体大小确定就行，也可以根据需要定义
      column.minWidth = labelLong * size + 46; // 根据label长度计算该表头最终宽度
      return h("span", { class: "cell-content", style: { width: "100%" } }, [
        column.label,
      ]);
    },
    async openDialog(data) {
      if (this.params.platform == 5) {
        window.open(data.material_url);
      } else {
        this.$emit("videoUrlClick", { data, type: "openDialog" });
      }
    },
  },
  watch: {
    defaultSort: {
      handler: function (cur, old) {
        if (cur.order === "asc") {
          cur.order = "ascending"
        }else if(cur.order === "desc"){
          cur.order = "descending"
        }
        this.newDefaultSort = cur;
        console.log(this.newDefaultSort);
        this.num += 1;
        this.$nextTick(() => {
          setTimeout(() => {
            let scroll = this.$el.querySelector(".el-table__body-wrapper");
            scroll.scrollLeft = this.scrollLeft;
            console.log(this.scrollLeft);
            this.scroll()
          }, 100);
        });
      },
      deep: true, //对象内部的属性监听，也叫深度监听
    },
    data: {
      handler: function (val) {
        this.num += 1;
        this.$nextTick(() => {
          setTimeout(() => {
            console.log(this.scrollLeft);
            let scroll = this.$el.querySelector(".el-table__body-wrapper");
            scroll.scrollLeft = this.scrollLeft;
            console.log(scroll.scrollLeft);
            this.scroll()
          }, 100);
        });
      },
      deep: true, //对象内部的属性监听，也叫深度监听
    },
  },
};
</script>

<style lang="less" scoped>
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
</style>
