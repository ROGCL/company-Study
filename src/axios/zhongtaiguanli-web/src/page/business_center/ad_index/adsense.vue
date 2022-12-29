<template>
  <div class="home">
    <FilterLayout v-model="searchForm" @onSubmit="onSubmit">
      <el-col :md="6" :sm="12">
        <el-form-item label="账号" prop="account_id">
          <SelectCustomize
            :value="groupIdInfo"
            @changeScope="changeApp"
            :data="account_id"
          />
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="三方媒体ID" prop="th_app_id">
          <el-input
            v-model="searchForm.th_app_id"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="聚合广告位ID" prop="th_poly">
          <el-input
            v-model="searchForm.th_poly"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12">
        <el-form-item label="二级广告位ID（兜底）" prop="th_second">
          <el-input
            v-model="searchForm.th_second"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-col>
    </FilterLayout>
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableOpt.currentPage"
      :params="searchForm"
      @pageChange="onPageChange"
    >
      <template slot="title">
        <div class="title_box">
          <el-button @click="addData">新增关联</el-button>
        </div>
      </template>
      <template #option="scope">
        <el-button type="text" size="small" @click="delData(scope.row)"
          >删除</el-button
        >
        <el-button type="text" size="small" @click="changeData(scope.row)"
          >修改</el-button
        >
      </template>
    </TableLayout>

    <el-dialog
      :title="changFlag ? '修改关联' : '新增关联'"
      :visible.sync="addVisible"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="200px"
        class="custom-form"
      >
        <el-form-item label="媒体平台" prop="department_id" width="300px">
          <el-input
            v-model="department_id"
            placeholder="请输入内容"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="account_id">
          <el-select v-model="addForm.account_id" placeholder="请选择" style="width:350px">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三方媒体ID" prop="th_app_id">
          <el-input
            v-model="addForm.th_app_id"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="聚合广告位ID" prop="th_poly">
          <el-input
            v-model="addForm.th_poly"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="二级广告位ID（兜底）" prop="th_second">
          <el-input
            v-model="addForm.th_second"
            placeholder="请输入内容"
          ></el-input>
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
import moment from "moment";
import _ from "lodash";
import { mapActions, mapState } from "vuex";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import SelectCustomize from "@/component/select-customize";
import { pickerOptions, timeTypeOption } from "@/config/option";

export default {
  components: {
    FilterLayout,
    TableLayout,
    SelectCustomize,
  },
  data() {
    return {
      departmentInfo: {
        appInfo: [],
      },
      groupIdInfo: {
        appInfo: [],
      },
      projectInfo: {
        appInfo: [],
      },
      appidInfo: {
        appInfo: [],
      },
      systemInfo: {
        appInfo: [],
      },
      select: "1",
      searchForm: {
        account_id: [],
        th_app_id: '',
        th_poly: '',
        th_second: '',
      },
      addForm: {
        account_id: "",
        th_app_id: "",
        th_second: "",
        th_poly: "",
      },
      department_id:'广点通',
      account_id: [
        {
          id: "125889436",
          title: "赋比兴_125889436",
        },
        {
          id: "401080212140",
          title: "上浅_401080212140",
        },
        {
          id: "505040812176",
          title: "飞闪_505040812176",
        },
        {
          id: "706000715618",
          title: "涅若_706000715618",
        },
        {
          id: "938289078",
          title: "奇燎_938289078",
        },
        {
          id: "237550232",
          title: "路西法_237550232",
        },
      ],
      article_id: [],
      apps: [],
      systemIds: [],
      options: [
        {
          value: "125889436",
          label: "赋比兴_125889436",
        },
        {
          value: "401080212140",
          label: "上浅_401080212140",
        },
        {
          value: "505040812176",
          label: "飞闪_505040812176",
        },
        {
          value: "706000715618",
          label: "涅若_706000715618",
        },
        {
          value: "938289078",
          label: "奇燎_938289078",
        },
        {
          value: "237550232",
          label: "路西法_237550232",
        },
      ],
      vipOptions: [
        {
          label: "否",
          value: 0,
          disabled: false,
        },
        {
          label: "是",
          value: 1,
          disabled: false,
        },
      ],
      changFlag: false,
      addVisible: false,
      column: [
        {
          label: "账号",
          prop: "account_id_title",
        },
        {
          label: "三方媒体ID",
          prop: "th_app_id",
        },
        {
          label: "聚合广告位ID",
          prop: "th_poly",
        },
        {
          label: "二级广告位ID（兜底）",
          prop: "th_second",
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
      countBar: {},
      pickerOptions,
      sort: {
        prop: "",
        order: "",
      },
      tableData: {
        data: [],
        total: 0,
        currentPage: 1,
        pageSize: 10,
        loading: false,
      },
    };
  },
  mounted() {
    this.getReport();
  },
  computed: {},
  methods: {
    async getReport() {
      this.tableData.loading = true;
      const { searchForm,tableOpt } = this;
      const [err, res] = await this.$http.post("ads/relevance_list", {
        ...tableOpt,
        ...searchForm,
      });
      this.tableData.loading = false;
      if (err) {
        this.tableData = {
          data: [],
          total: 0,
          currentPage: 1,
          pageSize: 10,
          loading: false,
        };
        return;
      }
      const { data, currentPage, total } = res;
      data.forEach(item=>{
         this.options.forEach(_item=>{
          if (item.account_id==_item.value) {
            item.account_id_title =_item.label
          }
        })
      })
      this.tableData.data = data
      this.tableData.currentPage = currentPage;
      this.tableData.total = total;
    },
    changeProjectTeam(val) {
      this.searchForm.department_id = val.appInfo;
    },
    changeApp(val) {
      this.searchForm.account_id = val.appInfo;
    },
    changeArticle(val) {
      this.searchForm.th_app_id = val.appInfo;
    },
    changeAppid(val) {
      this.searchForm.th_poly = val.appInfo;
    },
    changeSystem(val) {
      this.searchForm.th_second = val.appInfo;
    },
    onSubmit() {
      this.getReport();
    },
    delData(data) {
      this.$confirm("确认删除当前广告位关联？").then(async (_) => {
        this.tableData.loading = true;
        const [err, res] = await this.$http.post("ads/relevance_del", {
          id: data.id,
        });
        if (err) return;
        this.getReport();
      });
    },
    changeData(data) {
      this.changFlag = true;
      this.addVisible = true;
      this.addForm.account_id = data.account_id;
      this.addForm.th_app_id = data.th_app_id;
      this.addForm.th_second = data.th_second;
      this.addForm.th_poly = data.th_poly;
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
    onAdd() {
      if (this.changFlag) {
        this.$refs.addForm.validate(async (v, i) => {
          if (v) {
            const { addForm } = this;
            console.log(addForm);
            const [err, res] = await this.$http.post("ads/relevance_add", {
              id: this.nowId,
              account_id: addForm.account_id,
              th_app_id: addForm.th_app_id,
              th_second: addForm.th_second,
              th_poly:addForm.th_poly
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
            const [err, res] = await this.$http.post("ads/relevance_add", {
              account_id: addForm.account_id,
              th_app_id: addForm.th_app_id,
              th_second: addForm.th_second,
              th_poly:addForm.th_poly
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
    onPageChange(current) {
      this.tableOpt.currentPage = current;
      this.getReport();
    },
  },
};
</script>

<style lang="less" scoped>
.title_box {
  display: flex;
  justify-content: right;
  padding: 10px 0;
}
.custom-form {
  .el-input {
    width: 350px;
  }
}
</style>