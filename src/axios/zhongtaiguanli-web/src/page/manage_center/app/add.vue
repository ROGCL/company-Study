<template>
  <div class="page">
    <el-row>
      <el-col :xl="14" :lg="24" :xs="24">
        <el-form
          ref="form"
          :model="form"
          :rules="rule"
          label-width="130px"
          class="edit-form"
        >
          <el-form-item label="应用名" prop="appName">
            <el-input :maxlength="20" v-model="form.appName"></el-input>
            <div class="item-tip">
              (如该APP支持多个平台，请务必保证多平台应用名称一致)
            </div>
          </el-form-item>
          <el-form-item label="选择平台" prop="system">
            <el-radio-group v-model="form.system">
              <el-radio
                :label="v.value"
                :key="i"
                v-for="(v, i) in systemOpt"
                border
                >{{ v.name }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="包名"
            prop="package_name"
            v-if="form.system == '1'"
          >
            <el-input v-model="form.package_name"></el-input>
          </el-form-item>
          <el-form-item
            label="OAID证书"
            prop="secret_key"
            v-if="form.system == '1'"
          >
            <el-input type="textarea" :rows="5" v-model="form.secret_key"></el-input>
          </el-form-item>
          <el-form-item
            label="证书到期时间"
            prop="exp_time"
            v-if="form.system == '1'"
          >
            <el-date-picker
              v-model="form.exp_time"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="选择部门" prop="department_id">
            <el-radio-group
              v-model="form.department_id"
              @change="onChangeDepartment"
            >
              <el-radio
                :label="v.id"
                :key="i"
                v-for="(v, i) in department"
                border
                >{{ v.title }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择项目组" prop="group_id">
            <el-select
              :popper-append-to-body="false"
              v-model="form.group_id"
              placeholder="请选择项目组"
              filterable
              @change="onChangeProjectList"
            >
              <el-option
                v-for="item in group"
                :key="item.id"
                :value="item.id"
                :label="item.title"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择项目" prop="project_id">
            <el-select
              :popper-append-to-body="false"
              v-model="form.project_id"
              placeholder="请选择项目组"
              filterable
            >
              <el-option
                v-for="item in ProjectList"
                :key="item.id"
                :value="item.id"
                :label="item.title"
              ></el-option>
            </el-select>
            <div class="item-tip">
              (如没有对应的部门、项目组、项目请联系中台新增)
            </div>
          </el-form-item>
          <el-form-item label="备注描述" prop="adminName">
            <el-input v-model="form.note" type="textarea" :rows="4"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";


export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()+3600*1000*24*9;
        },
      },
      form: {
        appId: "",
        appName: "",
        package_name: "",
        secret_key: "",
        exp_time: "",
        system: "",
        note: "",
        department_id: "",
        group_id: "",
        project_id: "",
      },
      rule: {
        appName: [
          {
            required: true,
            message: "请输入应用名",
            trigger: "blur",
          },
        ],
        package_name: [
          {
            required: true,
            message: "请输入包名",
            trigger: "blur",
          },
        ],
        secret_key:[
          {
            required: true,
            message: "请输入证书秘钥",
            trigger: "blur",
          },
        ],
        exp_time:[
          {
            required: true,
            message: "请输入证书到期时间",
            trigger: "blur",
          },
        ],
        system: [
          {
            required: true,
            message: "请选择平台",
            trigger: "blur",
          },
        ],
        department_id: [
          {
            required: true,
            message: "请选择部门",
            trigger: "blur",
          },
        ],
        group_id: [
          {
            required: true,
            message: "请选择项目组",
            trigger: "blur",
          },
        ],
        project_id: [
          {
            required: true,
            message: "请选择项目",
            trigger: "blur",
          },
        ],
      },
      systemOpt: [
        {
          name: "Android",
          value: 1,
        },
        {
          name: "iOS",
          value: 2,
        },
        {
          name: "微信小程序",
          value: "3",
        },
        {
          name: "抖音小程序",
          value: "4",
        },
        {
          name: "Web网页",
          value: "5",
        },
      ],
      department: [],
      group: [],
      ProjectList: [],
    };
  },
  mounted() {
    this.onFetchDepartment();
  },
  computed: {
    ...mapState({
      tableData: (state) => state.user_manage.list,
    }),
  },
  methods: {
    ...mapActions(["addAppManage", "getApp"]),
    onChangeDepartment(val) {
      const currentDepartment = this.department.filter((v) => v.id === val);

      this.form.group_id = "";
      this.group = currentDepartment ? currentDepartment[0].groups : [];
    },
    onChangeProjectList(val) {
      const projectList = this.group.filter((v) => v.id === val);
      this.form.project_id = "";
      this.ProjectList = projectList ? projectList[0].projects : [];
    },
    async onFetchDepartment() {
      const [err, res] = await this.$http.post(
        "/Apartment_Manage/getDepartment"
      );

      if (err) return;

      this.department = res;
    },
    async onSubmit() {
      this.$refs["form"].validate(async (valid) => {
        if (!valid) return false;
        if (this.form.system != 1) {
          this.form.package_name = ''
          this.form.secret_key = ''
          this.form.exp_time = ''
        }
        this.form.exp_time = moment(this.form.exp_time).format("YYYY-MM-DD")
        const { form } = this;
        const [err, res] = await this.addAppManage({
          ...form,
        });

        if (err) {
          this.$notify.error({
            title: "提示",
            message: err,
          });
          return;
        }

        this.$notify.success({
          title: "提示",
          message: "添加成功",
        });

        this.getApp();
        this.$router.push("/manage_center/framework");
      });
    },
    changePackageName(val) {
      if (val !== 1) {
        this.form.package_name = "";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  background-color: #fff;
  padding: 50px 20px;

  .edit-form {
    .el-select {
      width: 100%;
    }
  }

  .item-tip {
    color: #999;
    font-size: 12px;
  }
}
</style>
