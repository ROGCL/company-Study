<template>
  <div class="department">
    <div class="table-custom">
      <el-button type="primary" class="addBtn" @click="add">新增部门</el-button>
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="部门ID" width="100px">
        </el-table-column>
        <el-table-column prop="title" label="部门名称" width="180px">
        </el-table-column>
        <el-table-column prop="groupTitles" label="部门内项目组"> </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination-custom" background layout="prev, pager, next" :total="total" @current-change="onChangePage"></el-pagination>
    </div>
    <div class="dialog">
      <add-dialog ref="addDialog" @success="getList"/>
    </div>
  </div>
</template>

<script>
const ADD = 0;
const EDIT = 1;
import { Apartment_Manage_index, Apartment_Manage_delete } from '@/config/api/index'
import addDialog from './add'
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      total: 0,
      loading:false
    };
  },
  mounted() {
    this.getList();
  },
   methods: {
     add() {
      this.$refs.addDialog.$data.type = ADD;
     },
     edit({ id, title, groupIds }) {
       this.$refs.addDialog.$data.editForm = {id, title, groupIds};
       this.$refs.addDialog.$data.type = EDIT;
     },
     remove({ id }) {
       this.$confirm('确认删除？').then(_ => {
        Apartment_Manage_delete({ id }).then(res => {
          if(res[2] == 1) {
            this.$message({
              message: res[3],
              type: 'success'
            });
            this.getList();
          } else {
            this.$message.error(res[0]);
          }
        })
      })
     },
     getList(current = 1) {
       this.loading = true
       Apartment_Manage_index({ currentPage: current}).then(res => {
         const { list, total } = res[1];
         this.tableData = list;
         this.total = total;
         this.loading = false
       })
     },
     onChangePage(current) {
       this.currentPage = current;
       this.getList(current);
     }
   },
   components: {
     addDialog
   }
};
</script>

<style lang='scss' scoped>
.addBtn {
  margin-bottom: 20px;
}
</style>