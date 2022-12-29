<template>
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="6" :sm="12">
        <el-form-item label="敏感词" prop="keyword">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="分类" prop="cate">
          <SelectCustomize
            :value="departmentInfo"
            @changeScope="changeProjectTeam"
            :data="department_id"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="等级" prop="level" multiple collapse-tags>
          <el-select
            v-model="searchForm.level"
            multiple
            collapse-tags
            placeholder="请选择"
          >
            <el-option label="1级" :value="1"> </el-option>
            <el-option label="2级" :value="2"> </el-option>
            <el-option label="3级" :value="3"> </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-button @click="initFrom" slot="btn-option">重置筛选</el-button>
    </FilterLayout>
    <div class="table-header">
      <div>
        <el-button type="primary" @click="delAll">批量删除</el-button>
      </div>
      <div>
        <el-button type="primary" @click="addData">新增敏感词</el-button>
        <el-button type="primary" @click="leadingOut" :loading="loading"
          >导出</el-button
        >
      </div>
    </div>
    <div style="display: flex">
      <el-table
        style="width: 50%"
        ref="multipleTable"
        :data="tableData.data1"
        tooltip-effect="dark"
        :stripe="false"
        @selection-change="handleSelectionChange"
        v-loading="tableData.loading"
      >
        <el-table-column type="selection" align="center" width="55">
        </el-table-column>
        <el-table-column prop="keyword" align="center" label="敏感词">
        </el-table-column>
        <el-table-column prop="cate_name" align="center" label="分类">
        </el-table-column>
        <el-table-column prop="level" align="center" label="等级">
          <template slot-scope="scope"> {{ scope.row.level }}级 </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="delData(scope.row)"
              >删除</el-button
            >
            <el-button type="text" size="small" @click="changeData(scope.row)"
              >修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table
        style="width: 50%"
        ref="multipleTable"
        :data="tableData.data2"
        tooltip-effect="dark"
        :stripe="false"
        @selection-change="handleSelectionChange"
        v-loading="tableData.loading"
      >
        <el-table-column type="selection" align="center" width="55">
        </el-table-column>
        <el-table-column prop="keyword" align="center" label="敏感词">
        </el-table-column>
        <el-table-column prop="cate_name" align="center" label="分类">
        </el-table-column>
        <el-table-column prop="level" align="center" label="等级">
          <template slot-scope="scope"> {{ scope.row.level }}级 </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="delData(scope.row)"
              >删除</el-button
            >
            <el-button type="text" size="small" @click="changeData(scope.row)"
              >修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-footer">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="tableData.total"
        :current-page="tableData.currentPage"
        @current-change="onPageChange"
        :page-size="20"
      ></el-pagination>
    </div>

    <el-dialog
      :title="changFlag ? '修改敏感词' : '新增敏感词'"
      :visible.sync="addVisible"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="80px"
        :rules="addRules"
        class="custom-form"
      >
        <el-form-item label="敏感词" prop="keyword">
          <el-input
            v-model="addForm.keyword"
            placeholder="请输入内容"
            :disabled="changFlag"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="cate">
          <el-select v-model="addForm.cate" placeholder="请选择">
            <el-option
              v-for="item in department_id"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-select v-model="addForm.level" placeholder="请选择">
            <el-option label="1级" :value="1"> </el-option>
            <el-option label="2级" :value="2"> </el-option>
            <el-option label="3级" :value="3"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import FormatJson from "@/util/lead-out/FormatJson";
import { export_json_to_excel } from "@/util/lead-out/Export2Excel";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import SelectApp from "@/component/select-apps";
import SelectCustomize from "@/component/select-customize";

export default {
  components: {
    FilterLayout,
    TableLayout,
    SelectApp,
    SelectCustomize,
  },
  computed: {
    ...mapState({
      appArr: (state) => state.app.data,
    }),
  },
  data() {
    return {
      searchForm: {
        keyword: "",
        cate: [],
        level: [],
      },
      department_id: [],
      addClassify_id: [],
      addClassifyInfo: {
        appInfo: [],
      },
      departmentInfo: {
        appInfo: [],
      },
      column: [
        {
          prop: "keyword",
          label: "敏感词",
        },
        {
          prop: "cate_name",
          label: "分类",
        },
        {
          prop: "level",
          label: "等级",
        },
      ],
      tableOpt: {
        currentPage: 1,
        per_page: 20,
      },
      tableData: {
        loading: false,
        data: [],
      },
      configList: [],
      addVisible: false,
      addForm: {
        keyword: "",
        cate: "",
        level: "",
      },
      addRules: {
        keyword: [{ required: true, message: "请填写敏感词" }],
        cate: [{ required: true, message: "请选择分类" }],
        level: [{ required: true, message: "请选择等级" }],
      },
      changFlag: false,
      nowId: "",
      loading: false,
    };
  },
  mounted() {
    this.getSensitiveType();
    this.getReport();
  },
  methods: {
    async onSubmit() {
      this.tableData.loading = true;
      const { searchForm, tableOpt } = this;
      const [err, res] = await this.$http.post("Other/lists", {
        keyword: searchForm.keyword,
        cate: searchForm.cate.join(","),
        level: searchForm.level.join(","),
        currentPage: 1,
        per_page: 20,
      });
      this.tableData.loading = false;

      if (err) {
        this.tableData = {
          list: [],
          total: 0,
          currentPage: 1,
          per_page: 20,
          loading: false,
        };
        return;
      }
      const { data, currentPage, total } = res;
      let arr = this.group(data, 10);
      this.tableData.data1 = arr[0];
      this.tableData.data2 = arr[1];
      this.tableData.currentPage = 1;
      this.tableData.total = total;
    },
    initFrom() {
      this.searchForm = {
        keyword: "",
        cate: [],
        level: [],
      };
      this.departmentInfo.appInfo = [];
      this.getReport();
    },
    // 获取分类
    async getSensitiveType() {
      const [err, res] = await this.$http.post("Other/sensitiveType", {});
      if (err) {
        return;
      }
      console.log(res);
      this.department_id = res;
      this.addClassify_id = res;
    },
    async getReport() {
      this.tableData.loading = true;
      const { searchForm, tableOpt } = this;
      const [err, res] = await this.$http.post("Other/lists", {
        keyword: searchForm.keyword,
        cate: searchForm.cate.join(","),
        level: searchForm.level.join(","),
        ...tableOpt,
      });
      this.tableData.loading = false;

      if (err) {
        this.tableData = {
          list: [],
          total: 0,
          currentPage: 1,
          per_page: 20,
          loading: false,
        };
        return;
      }
      const { data, currentPage, total } = res;
      let arr = this.group(data, 10);
      this.tableData.data1 = arr[0];
      this.tableData.data2 = arr[1];
      this.tableData.currentPage = currentPage;
      this.tableData.total = total;
    },
    changeProjectTeam(val) {
      this.searchForm.cate = val.appInfo;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onPageChange(current) {
      console.log(current);
      this.tableOpt.currentPage = current;
      this.getReport();
    },
    async delAll() {
      let id = this.multipleSelection.map((item) => {
        return item.id;
      });
      if (id.length == 0) {
        return;
      }
      this.$confirm("确认删除当前敏感词？").then(async (_) => {
        this.tableData.loading = true;
        const [err, res] = await this.$http.post("Other/deletes", {
          id: id.join(","),
        });
        if (err) return;
        this.getReport();
      });
    },
    delData(data) {
      this.$confirm("确认删除当前敏感词？").then(async (_) => {
        this.tableData.loading = true;
        const [err, res] = await this.$http.post("Other/deletes", {
          id: data.id,
        });
        if (err) return;
        this.getReport();
      });
    },
    changeData(data) {
      this.changFlag = true;
      this.addVisible = true;
      this.addForm.keyword = data.keyword;
      this.addForm.cate = data.cate;
      this.addForm.level = Number(data.level);
      this.nowId = data.id;
      console.log(this.addForm);
    },
    addData() {
      this.changFlag = false;
      this.addVisible = true;
      if (this.$refs["addForm"] !== undefined) {
        this.$refs["addForm"].resetFields();
      }
    },
    async leadingOut() {
      const { column, searchForm, tableOpt } = this;

      if (!column.length) return;

      this.loading = true;

      const [err, res] = await this.$http.post("Other/lists", {
        keyword: searchForm.keyword,
        cate: searchForm.cate.join(","),
        level: searchForm.level.join(","),
        download: true,
        currentPage: 1,
      });

      if (err) {
        this.$notify.error({
          title: "导出提示",
          message: err,
        });
        this.loading = false;

        return;
      }
      let arr = [];
      arr.push(...res.data);

      for (let index = 1; index < res.last_page; index++) {
        const [err, res] = await this.$http.post("Other/lists", {
          keyword: searchForm.keyword,
          cate: searchForm.cate.join(","),
          level: searchForm.level.join(","),
          download: true,
          currentPage: index + 1,
        });
        arr.push(...res.data);
      }
      this.loading = false;

      const data = arr;

      if (!data || !data.length) {
        this.$notify.error({
          title: "导出提示",
          message: "未查询到数据，请更换搜索条件重新查询",
        });
        return;
      }

      let app = this.$route.query.appId;
      let currentApp = {};
      let appName = "";
      let appSystem = "";

      if (app) {
        currentApp = this.appArr.filter((v) => v.id === app)[0];
        appName = currentApp["title"];
        appSystem = currentApp["system"] === "1" ? "[安卓]" : "[苹果]";
      }

      const menu = this.$route.meta.name;
      const start = "";
      const end = "";
      const tHeader = column.map((v) => v.label);
      const filter = column.map((v) => v.prop);
      const _data = FormatJson(filter, data);

      export_json_to_excel(tHeader, _data, `项目中台敏感词汇`);
    },
    onAdd() {
      if (this.changFlag) {
        this.$refs.addForm.validate(async (v, i) => {
          if (v) {
            const { addForm } = this;
            console.log(addForm);
            const [err, res] = await this.$http.post("Other/sensitiveSave", {
              id: this.nowId,
              keyword: addForm.keyword,
              cate: addForm.cate,
              level: addForm.level,
            });
            if (err) {
              return;
            }
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.addVisible = false;
            this.getReport();
          } else {
            return;
          }
        });
      } else {
        this.$refs.addForm.validate(async (v, i) => {
          if (v) {
            const { addForm } = this;
            console.log(addForm);
            const [err, res] = await this.$http.post("Other/sensitiveSave", {
              keyword: addForm.keyword,
              cate: addForm.cate,
              level: addForm.level,
            });
            if (err) {
              return;
            }
            this.$message({
              message: "新增成功",
              type: "success",
            });
            this.addVisible = false;
            this.getReport();
          } else {
            return;
          }
        });
      }
    },
    group(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)));
      }
      return newArray;
    },
  },
};
</script>

<style lang="less" scoped>
.table-header {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
}
.table-footer {
  display: flex;
  flex-direction: row-reverse;
  background-color: #fff;
  padding: 20px;
}
</style>