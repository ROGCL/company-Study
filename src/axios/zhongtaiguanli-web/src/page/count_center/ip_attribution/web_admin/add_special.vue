<template>
  <div class="page">
    <div class="head">{{ currentPlatformName }}投放添加流程 >></div>
    <div class="step">
      <div
        class="step-item"
        :class="{ active: stepActive === i }"
        v-for="(item, i) in steps"
        :key="i"
        :data-rank="i + 1"
      >
        {{ item }}
      </div>
    </div>
    <div class="content">
      <div class="guide" v-if="stepActive === 0">
        <el-timeline>
          <template
            v-if="
              addForm.system_create && progressConfig[addForm.system_create]
            "
          >
            <el-timeline-item
              size="large"
              v-for="(item, i) in progressConfig[addForm.system_create].step1"
              :key="i"
            >
              <div>{{ item.name }}</div>
              <a class="skip" :href="item.url" target="_blank"
                >点击跳转：{{ item.url }}</a
              >
            </el-timeline-item>
          </template>
        </el-timeline>
        <img :src="stepImg1" alt />
        <div class="operate">
          <el-popconfirm
            title="确定是否已经完成绑定管家户？"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="stepActive = 1"
          >
            <el-button type="primary" slot="reference">下一步</el-button>
          </el-popconfirm>
          <el-button @click="$router.go(-1)">取消</el-button>
        </div>
      </div>
      <el-form
        class="form"
        ref="addForm"
        :model="addForm"
        label-width="80px"
        :rules="addRules"
        v-if="stepActive === 1"
      >
        <el-form-item label="APP" required prop="appName">
          <el-input v-model="addForm.appName" disabled></el-input>
        </el-form-item>
        <el-form-item label="渠道名" required prop="title">
          <el-input v-model="addForm.title" disabled></el-input>
        </el-form-item>
        <el-form-item label="渠道号" required prop="origin">
          <el-input v-model="addForm.origin" disabled></el-input>
        </el-form-item>
        <el-form-item label="广告主ID" required prop="account_id">
          <el-input
            v-model="addForm.account_id"
            @blur="fetchAccountName"
            @change="changeAccountId"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="账户名"
          required
          prop="account_name"
          v-if="accountInit || addForm.system_create == 16"
        >
          <el-input
            v-model="addForm.account_name"
            :disabled="addForm.system_create != 16"
            v-loading="accountLoading"
          ></el-input>
        </el-form-item>
        <!-- 只有搜狗sm才有 -->
        <el-form-item
          label="账户密码"
          required
          prop="secret"
          v-if="addForm.system_create == 16"
        >
          <el-input v-model="addForm.secret"></el-input>
        </el-form-item>
        <el-form-item
          label="akey"
          required
          prop="akey"
          v-if="addForm.system_create == 16"
        >
          <el-input v-model="addForm.akey"></el-input>
        </el-form-item>
        <el-form-item
          label="token"
          required
          prop="access_token"
          v-if="addForm.system_create == 16"
        >
          <el-input v-model="addForm.access_token"></el-input>
        </el-form-item>
        <el-form-item label="收款户名" required prop="proceeds_user">
          <el-select
            class="select-control"
            v-model="addForm.proceeds_user"
            filterable
            allow-create
            placeholder="可以选中已有的也可以新建收款户名"
          >
            <el-option
              v-for="item in proceeds"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onCreate" v-loading="addLoading" :disabled="addLoading"
            >保存并下一步</el-button
          >
        </el-form-item>
      </el-form>
      <div class="guide" v-if="stepActive === 2">
        <el-timeline>
          <el-timeline-item
            icon="el-icon-success"
            type="primary"
            size="large"
            color="#0bbd87"
          >
            <div>复制监测链接</div>
            <div class="skip" @click="onCopy">点此处复制监测链接</div>
          </el-timeline-item>
          <template
            v-if="
              addForm.system_create && progressConfig[addForm.system_create]
            "
          >
            <el-timeline-item
              size="large"
              v-for="(item, i) in progressConfig[addForm.system_create].step3"
              :key="i"
            >
              <div>{{ item.name }}</div>
              <a class="skip" :href="item.url" target="_blank"
                >点击跳转：{{ item.url }}</a
              >
            </el-timeline-item>
          </template>
        </el-timeline>
        <img :src="stepImg3" alt />
        <div class="operate">
          <el-button type="primary" @click="$router.go(-1)">完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getConnectUrl, getCurrentPlatform } from "./utils";

export default {
  data() {
    return {
      steps: ["绑定管家账户", "广告主匹配", "获取回调链接"],
      stepActive: 0,
      addForm: {
        appName: "",
        title: "",
        origin: "",
        account_id: "",
        account_name: "",
        proceeds_user: "",
        system_create: "",
        access_token: "",
        akey: "",
        secret: "",
      },
      addRules: {
        account_id: [{ required: true, message: "请输入广告主ID" }],
        account_name: [{ required: true, message: "请输入账户名" }],
        proceeds_user: [{ required: true, message: "请输入收款户名" }],
        akey: [{ required: true, message: "请输入akey" }],
        access_token: [{ required: true, message: "请输入token" }],
        secret: [{ required: true, message: "请输入账户密码" }],
      },
      proceeds: [],
      accountInit: false,
      accountLoading: false,
      addLoading: false,
      $input: null,
      progressConfig: {
        1: {
          step1: [
            {
              name: "前往“巨量纵横”绑定管家账户",
              url: "https://business.oceanengine.com/",
            },
          ],
          step3: [
            {
              name: "前往“巨量引擎”添加监测链接",
              url: "https://ad.oceanengine.com/pages",
            },
            {
              name: "联调激活教程",
              url: "https://shimo.im/docs/kc9TRC8YvxxXJv3v/",
            },
          ],
        },
        2: {
          step1: [
            {
              name: "前往“腾讯广告平台”登录管家户绑定子账户",
              url: "https://ad.qq.com/",
            },
          ],
          step3: [
            {
              name: "点击跳转投放管理平台：",
              url: "https://ad.qq.com/",
            },
          ],
        },
        5: {
          step1: [
            {
              name: "前往客户罗盘完成管理员认证：",
              url: "https://luopan.e.kuaishou.com/home",
            },
          ],
          step3: [
            {
              name: "点击跳转投放管理平台：",
              url: "https://ad.e.kuaishou.com/index",
            },
          ],
        },
      },
      stepImg1: "",
      stepImg3: "",
      app: {},
    };
  },
  mounted() {
    this.app = this.$store.getters.getCurrentApp(this.$route.query.appId);

    this.addForm = {
      ...this.addForm,
      ...this.$route.query,
    };

    this.$input = document.createElement("input");
    this.$input.style.position = "fixed";
    this.$input.style.left = -999;
    this.$input.style.top = -999;
    document.body.appendChild(this.$input);

    this.fetchStepImg();
    this.fetchProceedsName();
  },
  computed: {
    currentPlatformName() {
      return getCurrentPlatform(this.addForm.system_create).label;
    },
  },
  beforeDestroy() {
    if (this.$input) {
      this.$input.remove();
      this.$input = null;
    }
  },
  methods: {
    onCreate() {
      this.$refs["addForm"].validate(async (valid, data) => {
        if (!valid) {
          return false;
        }

        this.addLoading = true;

        const [err, res] = await this.$http.post("Ip/saveLanding", {
          ...this.addForm,
        });

        this.addLoading = false;

        if (err) return;

        this.$message({
          message: "新增成功",
          type: "success",
        });

        this.stepActive = 2;
      });
    },
    changeAccountId(val) {
      let str = val.replace(/\s*/g, "");
      this.addForm.account_id = str;
    },
    async fetchAccountName(e) {
      // 搜索sm不需要请求账户名
      if (this.addForm.system_create == 16) return;
      let { system_create, account_id, origin, title } = this.addForm;
      account_id = account_id.replace(/\s*/g, "");

      if (!account_id) return;

      this.accountInit = true;
      this.accountLoading = true;

      const [err, res] = await this.$http.post("Ip/getAccountName", {
        system_create,
        account_id,
        origin,
        title,
      });

      this.accountLoading = false;

      if (err) {
        this.addForm.account_name = "";
        return;
      }

      if (!res) {
        this.addForm.account_name = "";

        this.$message({
          message: "暂未查询到关联的账户名，请核对后再试。",
          type: "error",
        });

        return;
      }

      this.addForm.account_name = res;
    },
    async fetchProceedsName() {
      const { title } = this.addForm;

      if (!title) return;

      const [err, res] = await this.$http.post("Ip/getHistoryProceedsName", {
        title,
      });

      if (err) return;

      this.proceeds = res;
    },
    async fetchStepImg() {
      const { system_create } = this.addForm;

      if (!system_create) return;

      const [err, res] = await this.$http.post("Ip/getStepImage", {
        system_create,
      });

      if (err) return;

      const { step1, step3 } = res;

      this.stepImg1 = step1;
      this.stepImg3 = step3;
    },
    onCopy() {
      const { id, system } = this.$store.getters.getCurrentApp(
        this.$route.query.appId
      );
      const { system_create, origin, lisiten_appid, lisiten_app_system } =
        this.addForm;

      const connectUrl = getConnectUrl({
        appid: id,
        origin,
        system_create,
        system,
        system2: lisiten_app_system,
        appid2: lisiten_appid,
      });

      if (!connectUrl) {
        return this.$message.error("获取参数错误，请刷新后重试！");
      }

      this.$input.value = connectUrl;
      this.$input.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令

      this.$message({
        message: "复制成功",
        type: "success",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$step-active-color: #1890ff;

.page {
  padding: 20px;
  background: #fff;

  .head {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }

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
    width: 100%;

    .form {
      width: 500px;
    }

    .guide {
      width: 800px;

      img {
        width: 100%;
        height: auto;
      }

      /deep/.el-timeline-item__content {
        font-size: 16px;
      }

      .skip {
        text-decoration: underline;
        color: #1890ff;
        font-size: 14px;
        cursor: pointer;
        margin-top: 5px;
      }
    }

    /deep/.operate {
      width: 100%;
      margin: 40px 0 50px;
      display: flex;
      align-items: center;
      justify-content: center;

      .el-button {
        margin-left: 20px;
      }
    }
  }

  /deep/ .select-control {
    width: 100%;
  }
}
</style>
