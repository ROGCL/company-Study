<template>
  <div class="add">
    <el-dialog
      :title="type == 0 ? '新增' : '编辑'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="项目组名称">
          <el-input
            v-model="form.title"
            style="width: 215px"
            placeholder="项目组名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目">
          <el-select
            v-model="form.value"
            filterable
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in Apps"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  Group_Manage_create,
  System_apps,
  Group_Manage_store,
} from "@/config/api/index";
import { getAppIcon } from "./util";
import store from "store2";

const TYPE_MAP = {
  0: "new",
  1: "edit",
};
export default {
  data() {
    return {
      type: 0,
      dialogVisible: false,
      Apps: [],
      form: {
        title: "",
        value: [],
      },
      editForm: null,
    };
  },
  mounted() {
    this.getApps();
  },
  methods: {
    submit() {
      const project_ids = this.form.value;
      const form = {
        title: this.form.title,
        project_ids,
      };
      // 新增的提交
      if (TYPE_MAP[this.type] == TYPE_MAP[0]) {
        Group_Manage_create(form).then((res) => {
          if (res[2] == 1) {
            this.$message({
              message: res[3],
              type: "success",
            });
            this.dialogVisible = false;
            this.$emit("success");
          } else {
            this.$message.error(res[0]);
          }
        });
      } else {
        // 编辑的提交
        form.id = this.form.id;
        Group_Manage_store(form).then((res) => {
          if (res[2] == 1) {
            this.$message({
              message: res[3],
              type: "success",
            });
            this.dialogVisible = false;
            this.$emit("success");
          } else {
            this.$message.error(res[0]);
          }
        });
      }
    },
    async getApps() {
      const [err, res] = await this.$http.post("Group_Manage/projectList", {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
        pageSize: 500,
        currentPage: 1,
      });
      if (err) return;
      this.Apps = res.list;
    },
    clear() {
      this.form = {
        title: "",
        value: [],
      };
      this.editForm = null;
    },
  },
  watch: {
    dialogVisible(newValue) {
      if (!newValue) {
        setTimeout(() => {
          this.clear();
        }, 200);
      } else {
        if (TYPE_MAP[this.type] == TYPE_MAP[0]) return;
        this.form.title = this.editForm.title;
        this.form.id = this.editForm.id;
        this.form.value = this.editForm.app_ids.map((id) => String(id));
      }
    },
  },
};
</script>

<style lang='scss' scoped>
</style>