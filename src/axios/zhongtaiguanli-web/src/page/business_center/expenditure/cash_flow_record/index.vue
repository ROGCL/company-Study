<template >
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="时间" prop="ad_id">
          <!-- <el-date-picker
            v-model="searchForm.time"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :popper-append-to-body="false"
            unlink-panels
          /> -->
          <dataPicker :datevalue.sync="searchForm.time"></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="上传人/手机号" prop="handleName">
          <el-input
            v-model="searchForm.handleName"
            placeholder="请输入上传人或手机号"
            type="text"
          />
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="6" :sm="24">
        <el-form-item label="上传结果" prop="status">
          <el-radio-group v-model="searchForm.status">
            <el-radio-button
              v-for="(v, i) in statusOption"
              :key="i"
              :label="v.value"
              >{{ v.label }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      @sizeChange="onSizeChange"
      @pageChange="onPageChange"
      @sortChange="onSortChange"
    >
      <template #table-option>
        <el-button type="primary" icon="el-icon-plus" @click="showUpload = true"
          >上传</el-button
        >
      </template>
      <template #status="scope">
        <span :style="{ color: formatStatusColor(scope.row.status) }">{{
          formatStatus(scope.row.status)
        }}</span>
      </template>
      <template #option="scope">
        <el-button
          v-if="scope.row.status == 2"
          size="small"
          @click="onShowError(scope.row.error_info)"
          >查看原因</el-button
        >
        <el-button
          size="small"
          @click="onDown('https://madmin.cqdingyan.com' + scope.row.file_path)"
          >下载文件</el-button
        >
      </template>
    </TableLayout>
    <el-dialog title="上传" :visible.sync="showUpload">
      <el-tabs v-model="activeName">
        <el-tab-pane label="投放数据上传" name="second">
          <div v-if="activeName == 'second'">
            <el-upload
              class="excel"
              ref="excel"
              drag
              name="excel"
              :data="uploadParams"
              :action="uploadUrl2"
              :limit="1"
              :file-list="fileList"
              :auto-upload="false"
              accept=".xls, .xlsx, .docx"
              :on-success="onSuccess"
              :on-error="onError"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </el-upload>
            <div class="down-tips">
              支持扩展名：.xls .xlsx .docx
              <div>
                <el-button type="primary" @click="submit">保存</el-button>
                <el-button
                  type="primary"
                  @click="
                    onDown(
                      'https://zhongtai-obs.obs.cn-southwest-2.myhuaweicloud.com//%E4%B8%AD%E5%8F%B0%E6%8A%95%E6%94%BE%E6%A8%A1%E6%9D%BF%20.xlsx'
                    )
                  "
                  >下载投放数据模板</el-button
                >
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="打款记录上传" name="first">
          <div v-if="activeName == 'first'">
            <el-upload
              ref="upload"
              name="excel"
              :data="uploadParams"
              :action="uploadUrl"
              :limit="1"
              :file-list="fileList"
              :auto-upload="false"
              :multiple="false"
              accept=".xls, .xlsx, .docx"
              :on-success="onSuccess"
              drag
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </el-upload>
            <div class="down-tips">
              支持扩展名：.xls .xlsx .docx
              <div>
                <el-button type="primary" @click="onUpload">保存</el-button>
                <el-button
                  type="primary"
                  @click="
                    onDown(
                      'https://madmin.cqdingyan.com/download/%E6%89%93%E6%AC%BE%E8%AE%B0%E5%BD%95%E4%B8%8A%E4%BC%A0%E6%A8%A1%E6%9D%BF.xlsx'
                    )
                  "
                  >下载打款记录模板</el-button
                >
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template >

<script >
import moment from "moment";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import { mapState } from "vuex";
import { pickerOptions } from "@/config/option";
import store from "store2";

export default {
  components: {
    FilterLayout,
    TableLayout,
  },
  data() {
    return {
      uploadParams: {
        appId: this.$route.query.appId,
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
      },
      uploadUrl: `${process.env.VUE_APP_PROXY_KEY}/File/uploadRemit`,
      uploadUrl2: `${process.env.VUE_APP_PROXY_KEY}/File/uploadV2`,
      fileList: [],
      searchForm: {
        time: [
          moment().subtract(30, "d").format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD"),
        ],
        handleName: "",
        status: "",
        sort: "",
      },
      activeName: "second",
      statusOption: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "成功",
          value: "1",
        },
        {
          label: "失败",
          value: "2",
        },
        {
          label: "上传中",
          value: "3",
        },
      ],
      column: [
        {
          prop: "realname",
          label: "上传人",
        },
        {
          prop: "phone",
          label: "上传人手机号",
        },
        {
          prop: "file_name",
          label: "上传文件名",
        },
        {
          prop: "data_num",
          label: "总数据量（条）",
        },
        {
          prop: "create_time",
          label: "上传时间",
          sortable: true,
        },
        {
          prop: "status",
          label: "上传结果",
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
      showUpload: false,
      pickerOptions,
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    ...mapState({
      App: (state) => state.app.data,
      user: (state) => state.user,
    }),
  },
  methods: {
    async fetchData() {
      const { searchForm, tableOpt } = this;

      this.tableData.loading = true;

      const [err, res] = await this.$http.post("Invest_Statistics/RemitList", {
        ...searchForm,
        ...tableOpt,
        timeBegin: searchForm["time"][0],
        timeEnd: searchForm["time"][1],
      });

      this.tableData.loading = false;

      if (err) return;

      const { list, currentPage, total } = res;

      this.tableData.data = list;
      this.tableData.currentPage = currentPage;
      this.tableData.total = total;
    },
    onSubmit() {
      this.tableOpt.currentPage = 1;
      this.fetchData();
    },
    onPageChange(current) {
      this.tableOpt.currentPage = current;
      this.fetchData();
    },
    onSizeChange(current) {
      this.tableOpt.pageSize = current;
      this.fetchData();
    },
    onSortChange(data) {
      this.searchForm.sort = data.order;
      this.fetchData();
    },
    onUpload() {
      this.$refs["upload"].submit();
    },
    onSuccess({ code, msg }) {
      if (this.$refs["upload"]) {
        this.$refs["upload"].clearFiles();
      }
      if (this.$refs["excel"]) {
        this.$refs["excel"].clearFiles();
      }
      if (code == 1) {
        this.$message({
          showClose: true,
          message: msg,
          type: "success",
          duration: 0,
        });
        this.showUpload = false;
        this.tableOpt.currentPage = 1;
      } else {
        this.$message({
          showClose: true,
          message: msg,
          type: "error",
          duration: 0,
        });
      }

      this.fetchData();
    },
    submit() {
      this.$refs.excel.submit();
    },
    onError() {
      this.$message({
        showClose: true,
        message: "上传失败",
        type: "error",
        duration: 0,
      });
    },
    onDown(url) {
      if (!url) return;

      window.open(url);
    },
    onShowError(err) {
      this.$alert(err, "错误原因", {
        confirmButtonText: "确定",
      });
    },
    formatStatus(code) {
      switch (String(code)) {
        case "":
          return "全部";
        case "1":
          return "成功";
        case "2":
          return "失败";
        case "3":
          return "上传中";
        default:
          return "未知";
      }
    },
    formatStatusColor(code) {
      switch (String(code)) {
        case "1":
          return "#67C23A";
        case "2":
          return "#F56C6C";
        default:
          return "#409EFF";
      }
    },
  },
};
</script >

<style lang = "less" scoped >
.advertiser-controler {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.dotted-line {
  width: 100%;
  border-top: 1px dashed #aaa;
  margin-bottom: 22px;
}

/deep/ .custom-select {
  width: 100%;
}

.down-tips {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}
</style >
