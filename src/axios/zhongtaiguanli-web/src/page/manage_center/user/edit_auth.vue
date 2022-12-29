<template>
  <div class="page">
    <div class="content">
      <el-form label-width="80px">
        <el-form-item label>
          <el-tree
            ref="AuthTree"
            :data="AuthTree"
            :props="treeProps"
            show-checkbox
            node-key="id"
            default-expand-all
          ></el-tree>
        </el-form-item>
        <el-form-item label="选择APP">
          <el-select
            v-model="currentApp"
            placeholder="请选择"
            @change="onChangeApp"
            class="app-control"
            filterable
          >
            <template #prefix>
              <span class="iconfont" :class="systemIcon"></span>
            </template>
            <el-option
              v-for="item in app"
              :key="item.id"
              :value="item.id"
              :label="item.title"
            >
              <span class="iconfont" :class="formatSystem(item.system)"
                >{{ item.title
                }}{{ item.type === 1 ? "(已分配权限)" : "" }}</span
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-tree
            ref="AppAuthTree"
            :data="AppAuthTree"
            :props="treeProps"
            show-checkbox
            node-key="id"
            default-expand-all
          ></el-tree>
        </el-form-item>
        <el-form-item class="operate">
          <el-button type="primary" size="small" @click="onSubmitAuth"
            >保存至当前APP</el-button
          >
          <el-button type="primary" size="small" @click="showCopy = true"
            >保存并复制当前权限到其他APP</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-dialog :visible.sync="showCopy" title="请选择" width="60%">
      <el-select
        class="copy-control"
        v-model="copyApp"
        placeholder="请选择"
        multiple
        filterable
      >
        <el-option
          v-for="item in app"
          :key="item.id"
          :value="item.id"
          :label="item.title"
        >
          <span class="iconfont" :class="formatSystem(item.system)"
            >{{ item.title }}{{ item.type === 1 ? "(已分配权限)" : "" }}</span
          >
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <div class="option-item">
          <el-button type="primary" @click="onCopyAll">全选</el-button>
          <el-button type="danger" @click="copyApp = []">清空</el-button>
        </div>
        <div class="option-item">
          <el-button
            type="primary"
            @click="onSubmitCopyAuth"
            :loading="isLoading"
            >保 存</el-button
          >
          <el-button @click="showCopy = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { api } from "@/config/api";

export default {
  data() {
    return {
      currentApp: "",
      AuthTree: [],
      AppAuthTree: [],
      treeProps: {
        children: "children",
        label: "name",
      },
      showCopy: false,
      copyApp: [],
      app: [],
      adminId: "",
      isLoading: false,
      treeLists: [],
    };
  },
  mounted() {
    this.adminId = this.$route.query.id;

    this.fetchApp();
  },
  computed: {
    systemIcon(vm) {
      const { app, currentApp } = vm;
      const _currentApp = _.find(app, (v) => v.id === currentApp);

      if (!_currentApp) return "";

      return this.formatSystem(_currentApp.system);
    },
  },
  methods: {
    async fetchApp() {
      const { adminId } = this;

      if (!adminId) return;

      const [err, res] = await this.$http.post(api.admin.app, {
        adminId,
      });

      if (err) return;

      this.app = res;
      let arr = []
      for (const i of res) {
        if(i.type == 1 ){
            arr.push(i.id)
        }
      }
      this.copyApp = arr
      

      if (res.length) {
        this.currentApp = res[0].id;
        this.fetchAuth();
      }
    },
    async fetchMenu() {
      const { currentApp } = this;

      if (!currentApp) return;

      const [err, res] = await this.$http.post(api.admin.menu, {
        appId: currentApp,
      });

      if (err) return;
      this.treeLists = JSON.parse(JSON.stringify(res));
      this.AuthTree = res.splice(0, res.length - 1);
      this.AppAuthTree = res.splice(res.length - 1, res.length);
    },
    async fetchAuth() {
      const { currentApp, adminId } = this;

      if (!currentApp) return;

      await this.fetchMenu();

      const [err, res] = await this.$http.post(api.admin.auth_detail, {
        appId: currentApp,
        adminId,
      });

      if (err) return;

      const { adminAuth = "", authArr = "" } = res;
      let arr = [];
      this.treeLists.forEach((item) => {
        arr.push(item.id);
        item.children.forEach(_item=>{
          if(_item.children && _item.children.length > 0){
              arr.push(_item.id)
          }
        })
      });
      let newArr = []
      adminAuth.split(",").forEach((item) => {
          if (arr.indexOf(item) === -1) {
            newArr.push(item)
          }
      });
      this.$refs["AuthTree"].setCheckedKeys(newArr);
      this.$refs["AppAuthTree"].setCheckedKeys(authArr.split(","));
    },
    async onSubmitAuth() {
      const { currentApp, adminId } = this;

      const adminAuth = this.$refs["AuthTree"].getCheckedKeys().join(",");
      const authArr = this.$refs["AppAuthTree"].getCheckedKeys().join(",");
      if (!currentApp) return;

      const [err, res] = await this.$http.post(api.admin.edit_auth, {
        appId: currentApp,
        adminId,
        adminAuth,
        authArr: {
          [currentApp]: authArr,
        },
      });

      if (err) return;
      this.isLoading = false;
      this.$message({
        message: "保存成功",
        type: "success",
      });
      this.fetchApp();
    },
    onChangeApp(val) {
      this.currentApp = val;
      this.$refs["AppAuthTree"].setCheckedKeys([]);

      this.fetchAuth();
    },
    async onSubmitCopyAuth() {
      const { currentApp, adminId, copyApp } = this;

      const adminAuth = this.$refs["AuthTree"].getCheckedKeys().join(",");
      const authArr = this.$refs["AppAuthTree"].getCheckedKeys().join(",");

      if (!currentApp) return;

      let _copyApp = {};

      copyApp.forEach((v) => {
        _copyApp[v] = authArr;
      });
      this.isLoading = true;
      const [err, res] = await this.$http.post(api.admin.edit_auth, {
        appId: currentApp,
        adminId,
        adminAuth,
        authArr: {
          [currentApp]: authArr,
          ..._copyApp,
        },
      });

      if (err) return;
      this.isLoading = false;
      this.$message({
        message: "保存成功",
        type: "success",
      });

      this.copyApp = [];
      this.showCopy = false;
      this.fetchApp();
    },
    onCopyAll() {
      this.copyApp = this.app.map((v) => v.id);
    },
    formatSystem(code) {
      switch (String(code)) {
        case "1":
          return "icon-anzhuo";
        case "2":
          return "icon-ios";
        case "3":
          return "icon-weixin";
        case "4":
          return "icon-baidu";
        case '5':
          return 'icon-chrome'
        default:
          return "";
      }
    },
  },
};
</script>

<style lang='scss' scoped>
$step-active-color: #1890ff;

.page {
  padding: 20px;
  background: #fff;

  .step {
    width: 100%;
    max-width: 800px;
    height: 60px;
    display: flex;
    align-items: center;
    margin-bottom: 40px;
    background-color: #efefef;

    .step-item + .step-item {
      &::after {
        position: absolute;
        content: "";
        width: 32px;
        height: 32px;
        left: -32px;
        top: 50%;
        transform: translateY(-50%);
        background: url("./img/step-arrow.png") no-repeat center;
        background-size: cover;
      }
    }

    &-item {
      flex-basis: 0;
      flex: 1;
      position: relative;
      padding-left: 70px;

      &.active {
        color: $step-active-color;

        &::before {
          color: $step-active-color;
          border-color: $step-active-color;
        }
      }

      &::before {
        content: attr(data-rank);
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px solid #555;
        color: #555;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .content {
    width: 500px;

    .operate {
      display: flex;
      align-items: center;

      /deep/.el-button {
        width: 200px;
        height: 40px;
      }
    }
  }

  /deep/ .app-control {
    width: 100%;
  }

  /deep/ .copy-control {
    width: 100%;

    .el-select__tags {
      width: 100%;
    }

    .el-input__inner {
      height: 100px;
    }
  }

  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .option-item {
      display: flex;
      align-items: center;
    }
  }
}
</style>