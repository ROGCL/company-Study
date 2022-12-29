<template>
  <div class="department">
    <div class="table-custom">
      <FilterLayout v-model="searchForm" @onSubmit="getList">
        <el-col :md="12" :lg="6" :sm="24">
          <el-form-item label="项目" prop="project_title">
            <el-input
              placeholder="搜索项目"
              v-model="searchForm.project_title"
              :popper-append-to-body="false"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="6" :sm="24">
          <el-form-item label="应用" prop="app_title">
            <el-input
              placeholder="搜索应用"
              v-model="searchForm.app_title"
              :popper-append-to-body="false"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-button @click="initFrom" slot="btn-option">重置筛选</el-button>
        <el-button type="primary" class="addBtn" @click="add">新增项目</el-button>
      </FilterLayout>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="项目ID" width="100px">
        </el-table-column>
        <el-table-column prop="title" label="项目名称" width="180px">
        </el-table-column>
        <el-table-column prop="app_titles" label="项目内应用">
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" size="small" @click="remove(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination-custom"
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="onChangePage"
      ></el-pagination>
    </div>
    <div class="dialog">
      <add-dialog ref="addDialog" @success="createSuccess" />
    </div>
  </div>
</template>

<script>
import addDialog from "./add.vue";
import FilterLayout from "@/layout/form";

export default {
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      loading: false,
      searchForm: {
        project_title:"",
        app_title:""
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    add() {
      this.$refs.addDialog.$data.type = 0;
      this.$refs.addDialog.$data.dialogVisible = true;
    },
    edit(data) {
      this.$refs.addDialog.$data.type = 1;
      this.$refs.addDialog.$data.dialogVisible = true;
      let row = data
      this.$nextTick(() => {
        this.$refs.addDialog.init(row)
      });
    },
    remove({ id }) {
      this.$confirm("确认删除？").then(async () => {
        const [err, res] = await this.$http.post("Group_Manage/projectDel", {
          id,
        });
        if (err) {
          this.$message.error(err);
          return;
        }
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.getList();
      });
    },
    async getList() {
      const {searchForm} = this
      this.loading = true;
      const [err, res] = await this.$http.post("Group_Manage/projectList", {
        currentPage: this.currentPage,
        ...searchForm
      });
      if (err) {
        return;
      }
      this.loading = false;
      this.tableData.currentPage = res.currentPage;
      this.tableData = res.list;
      this.total = res.total;
    },
    onChangePage(current) {
      this.currentPage = current;
      this.getList(current);
    },
    createSuccess() {
      this.getList();
    },
    initFrom(){
      this.currentPage = 1
      this.searchForm = {
        project_title:"",
        app_title:""
      },
      this.getList()
    }
  },
  components: {
    addDialog,
    FilterLayout
  },
};
</script>

<style lang='scss' scoped>
.addBtn {
  margin-bottom: 20px;
}
</style>