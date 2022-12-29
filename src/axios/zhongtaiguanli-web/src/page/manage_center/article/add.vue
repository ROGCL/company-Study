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
        <el-form-item label="项目名称">
          <el-input
            v-model="form.title"
            style="width: 215px"
            placeholder="项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目应用">
          <Selectucg
            :value="datainfo"
            @changeScope="changeScope"
          ></Selectucg>
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
import store from "store2";
import Selectucg from "@/component/select-ucg";

const TYPE_MAP = {
  0: "new",
  1: "edit",
};
export default {
  components: {
    Selectucg,
  },
  data() {
    return {
      type: 0,
      dialogVisible: false,
      Apps: [],
      form: {
        title: "",
        app_ids: [],
      },
      editForm: null,
      datainfo: {
        appInfo: [],
      },
      num: 1,
    };
  },
  created() {
    this.getApps();
  },
  methods: {
    async submit() {
      const app_ids = this.form.app_ids;
      const form = {
        title: this.form.title,
        app_ids,
      };
      // 新增的提交
      if (TYPE_MAP[this.type] == TYPE_MAP[0]) {
        const [err, res] = await this.$http.post("Group_Manage/projectCreate", {
          ...form,
        });
        if (err) {
          this.$message.error(err);
          return;
        }
        this.$message({
          message: "项目创建成功",
          type: "success",
        });
        this.dialogVisible = false;
        this.$emit("success");
      } else {
        // 编辑的提交
        form.id = this.form.id;
        const [err, res] = await this.$http.post("Group_Manage/projectSave", {
          ...form,
        });
        if (err) {
          this.$message.error(err);
          return;
        }
        console.log(res);
        this.$message({
          message: "保存成功",
          type: "success",
        });
        this.dialogVisible = false;
        this.$emit("success");
      }
    },
    async getApps() {
      const [err, res] = await this.$http.post("Group_Manage/projectList", {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
      });
      if (err) return;
      this.Apps = res;
    },
    clear() {
      this.form = {
        title: "",
        app_ids: [],
      };
      this.datainfo = {
        appInfo: [],
      };
      this.editForm = null;
    },
    changeScope(val) {
      this.form.app_ids = val.appInfo;
    },
    init(data) {
      if (TYPE_MAP[this.type] == TYPE_MAP[0]) return;

      this.form.title = data.title;
      this.form.id = data.id;
      this.datainfo = {
        appInfo: data.app_ids.map(item=>{
          return item+''
        }),
      };
    },
  },
  watch: {
    dialogVisible(newValue) {
      if (!newValue) {
        setTimeout(() => {
          this.clear();
        }, 200);
      } else {
      }
    },
  },
};
</script>

<style lang='scss' scoped>
</style>