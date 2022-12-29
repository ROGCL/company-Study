<template>
  <div>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column label="功能" width="180" prop="title" align="center"></el-table-column>
      <el-table-column label="选取渠道" align="center">
        <template slot-scope="scope" prop="channel">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium" v-for="(item, index) in scope.row.channel" :key="index">{{ item }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <modify ref="modify" :editData="editData" @clearEditData="clearEditData" @updated="getList" />
  </div>
</template>

<script>
import { Channel_Manage_list } from '@/config/api/index'
import modify from './modify'
export default {
  data() {
    return {
      tableData: [],
      editData: {},
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleEdit(index, row) {
      this.editData = row
      this.$refs.modify.dialogVisible = true
    },
    getList() {
      Channel_Manage_list().then((res) => {
        res[1].forEach((item) => {
          item.channel = item.channel ? item.channel.split(',') : null
        })
        this.tableData = res[1]
      })
    },
    clearEditData() {
      this.editData = {}
    },
  },
  components: {
    modify,
  },
}
</script>

<style lang='scss' scoped>
.el-tag {
  margin-left: 10px;
}
</style>