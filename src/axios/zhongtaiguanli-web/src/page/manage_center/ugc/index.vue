<template >
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
       <el-col :md="6" :sm="12">
        <el-form-item label="筛选时间">
          <!-- <el-date-picker
            v-model="searchForm.time"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :clearable="true"
            :append-to-body="false"
            unlink-panels
          /> -->
           <dataPicker :datevalue.sync="searchForm.time" :shortcutsFlag="false"></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="App名称" prop="appid">
          <SelectApp v-model="searchForm.appid"></SelectApp>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="searchForm.uid" placeholder="输入用户ID" />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="预警标签" prop="ugc_label">
          <el-select
            v-model="searchForm.ugc_label"
            :popper-append-to-body="false"
            placeholder="请选择"
            multiple
            collapse-tags
          >
            <el-option
              v-for="item in configList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      :leadOut="true"
      :params="searchForm"
      leadApi="Ugc_Statistics/index"
      @sizeChange="onSizeChange"
      @pageChange="onPageChange"
      :tooltipFlag="true"
      :cellStyle="cellStyle"
    >
      <template slot-scope="scope" slot="is_second">
        <span v-if="scope.row.is_second=='是'" style="color:red">
          {{scope.row.is_second}}
        </span>
        <span v-if="scope.row.is_second=='否'">
          {{scope.row.is_second}}
        </span>
      </template>
    </TableLayout>
  </div>
</template >

<script >
import moment from "moment";
import store from "store2";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import SelectApp from "@/component/select-apps";

export default {
  name: "home",
  components: {
    FilterLayout,
    TableLayout,
    SelectApp,
  },
  data() {
    return {
      searchForm: {
        appid: [],
        ugc_label: [],
        uid: "",
        time: [
          moment().subtract(30, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
      },
      column: [
        {
          prop: "uid",
          label: "用户ID",
        },
        {
          prop: "reg_time",
          label: "注册时间",
          width:"160"
        },
        {
          prop: "is_second",
          label: "是否多次预警",
          width: "120",
        },
        {
          prop: "app",
          label: "所属APP",
          width:"160"
        },
        {
          prop: "nick_name",
          label: "昵称",
          width:"160"
        },
        {
          prop: "real_name",
          label: "真实姓名",
          width: "80",
        },
        {
          prop: "sex",
          label: "性别",
        },
        {
          prop: "age",
          label: "年龄",
        },
        {
          prop: "address",
          label: "所在地",
          width:"80"
        },
        {
          prop: "phone",
          label: "联系电话",
          width:"160"
        },
        {
          prop: "other_contact",
          label: "其他联系方式",
          width: "120",
        },
        {
          prop: "uuid",
          label: "设备识别码",
          width:"150"
        },
        {
          prop: "ip",
          label: "IP地址",
          width: "140",
        },
        {
          prop: "ugc_label",
          label: "预警标签",
        },
        {
          prop: "ugc_content",
          label: "预警内容",
          width:"300"
        },
        {
          prop: "other_content",
          label: "其他信息",
          width:"300"
        },
        {
          prop: "ugc_time",
          label: "预警时间",
          width:"160"
        },
      ],
      tableOpt: {
        currentPage: 1,
        pageSize: 10,
      },
      tableData: {
        loading: false,
      },
      configList: [],
    };
  },
  mounted() {
    this.getconfig();
    this.getReport();
  },
  computed: {},
  methods: {
    onSubmit() {
      this.getReport();
    },
    async getconfig() {
      const [err, res] = await this.$http.post("Ugc_Statistics/getLabel", {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
      });
      if (err) return;
      this.configList = res;
      console.log(this.configList);
    },
    async getReport() {
      this.tableData.loading = true;
      const { searchForm, tableOpt } = this;
      const [err, res] = await this.$http.post("Ugc_Statistics/index", {
        ...searchForm,
        ...tableOpt,
        timeBegin: searchForm["time"]?searchForm["time"][0]:'',
        timeEnd: searchForm["time"]?searchForm["time"][1]:'',
      });
      this.tableData.loading = false;

      if (err) {
        this.tableData = {
          list: [],
          total: 0,
          currentPage: 1,
          pageSize: 10,
          loading: false,
        };
        return;
      }
      const { list, currentPage, total } = res;
      this.tableData.data = list;
      this.tableData.currentPage = currentPage;
      this.tableData.total = total;
    },
    onPageChange(current) {
      this.tableOpt.currentPage = current;
      this.getReport();
    },
    onSizeChange(current) {
      this.tableOpt.pageSize = current;
      this.getReport();
    },
    cellStyle(){
      return "height: 80px;"
    }
  },
};
</script >

<style lang = "less" scoped >
</style >