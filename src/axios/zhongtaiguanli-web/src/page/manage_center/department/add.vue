<template>
  <div class="add">
    <el-dialog :title="title" :visible.sync="dialogVisible" width="40%">
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="部门名称">
          <el-input
            style="width: 215px"
            v-model="form.title"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="包含项目组">
          <el-select
            v-model="form.group_ids"
            filterable
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
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
const ADD = 0;
const EDIT = 1;
import {
  Apartment_Manage_create,
  Group_Manage_index,
  Apartment_Manage_store,
} from "@/config/api/index";
import { add } from "store2";
export default {
  data() {
    return {
      type: null,
      dialogVisible: false,
      options: [],
      form: {
        title: "",
        group_ids: [],
      },
      editForm: null,
    };
  },
  created() {
    Group_Manage_index({ pageSize: 500 }).then((res) => {
      this.options = res[1].list;
    });
  },
  methods: {
    submit() {
      let form = null;
      let api =
        this.type == ADD ? Apartment_Manage_create : Apartment_Manage_store;
      if (this.type == ADD) {
        form = this.form;
      } else {
        form = { ...this.form, id: this.editForm.id };
      }
      this.dialogVisible = false;
      api(form).then((res) => {
        if (res[2] == 1) {
          this.$message({
            message: res[3],
            type: "success",
          });
          this.$emit("success");
          this.dialogVisible = false;
        } else {
          this.$message.error(res[0]);
        }
      });
    },
    clear() {
      this.form = {
        title: "",
        group_ids: [],
      };
      this.editForm = null;
    },
  },
  watch: {
    type(newValue) {
      if (newValue == ADD || newValue == EDIT) {
        this.dialogVisible = true;
      }
    },
    dialogVisible(newValue) {
      // 关闭dialog时...
      if (!newValue) {
        this.type = null;
        this.clear();
      } else if (this.type == EDIT) {
        // 打开dialog,并且是编辑时...
        const { title, id, groupIds } = this.editForm;
        this.form.title = title;
        this.form.group_ids = groupIds.map((id) => String(id));
      }
    },
  },
  computed: {
    title() {
      switch (this.type) {
        case ADD:
          return "新增";
        case EDIT:
          return "编辑";
      }
    },
  },
};
</script>

<style lang='scss' scoped>
</style>