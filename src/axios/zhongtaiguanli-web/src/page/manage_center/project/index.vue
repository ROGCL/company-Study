<template>
  <div class="department">
    <div class="table-custom">
      <FilterLayout v-model="searchForm" @onSubmit="getList">
        <el-col :md="12" :lg="6" :sm="24">
          <el-form-item label="项目组" prop="group_title">
            <el-input
              placeholder="搜索项目组"
              v-model="searchForm.group_title"
              :popper-append-to-body="false"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="6" :sm="24">
          <el-form-item label="项目" prop="project_title">
            <el-input
              placeholder="搜索项目"
              v-model="searchForm.project_title"
              :popper-append-to-body="false"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-button @click="initFrom" slot="btn-option">重置筛选</el-button>
        <el-button type="primary" class="addBtn" @click="add"
          >新增项目组</el-button
        >
      </FilterLayout>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="项目组ID" width="100px">
        </el-table-column>
        <el-table-column prop="title" label="项目组名称" width="180px">
        </el-table-column>
        <el-table-column prop="app_titles" label="组内项目"> </el-table-column>
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
import { Group_Manage_index, Group_Manage_delete } from "@/config/api/index";
import FilterLayout from "@/layout/form";

import addDialog from "./add";
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      loading: false,
      searchForm: {
        group_title:"",
        project_title:""
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
    edit({ id, title, app_ids }) {
      console.log(app_ids);
      this.$refs.addDialog.$data.type = 1;
      this.$refs.addDialog.$data.dialogVisible = true;
      this.$refs.addDialog.$data.editForm = { id, title, app_ids };
    },
    remove({ id }) {
      this.$confirm("确认删除？").then(() => {
        Group_Manage_delete({ id }).then((res) => {
          if (res[2] == 1) {
            this.$message({
              message: res[3],
              type: "success",
            });
            this.getList();
          } else {
            this.$message.error(res[0]);
          }
        });
      });
    },
    getList() {
      const {searchForm} = this
      this.loading = true;
      Group_Manage_index({ 
        currentPage: this.currentPage,
        ...searchForm
      }).then((res) => {
        const { list, total } = res[1];
        this.tableData = list;
        this.total = total;
        this.loading = false;
      });
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
        group_title:"",
        project_title:""
      }
      this.getList()
    }
  },
  components: {
    addDialog,
    FilterLayout,
  },
};
</script>

<style lang="scss" scoped>
.addBtn {
  margin-bottom: 20px;
}
</style>
