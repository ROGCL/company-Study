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
          <el-timeline-item
            size="large"
            v-for="(item, i) in progressConfig.step1"
            :key="i"
          >
            <div>{{ item.name }}</div>
            <a class="skip" :href="item.url" target="_blank"
              >点击跳转：{{ item.url }}</a
            >
          </el-timeline-item>
        </el-timeline>
        <img src="./img/baidu.png" alt class="myImg" />
        <el-timeline style="padding-top: 30px">
          <el-timeline-item size="large">
            <div>
              确认超管账户是否授权给中台开发者，如不清楚可提供超管账户ID给中台产品确认
            </div>
          </el-timeline-item>
        </el-timeline>
        <div class="operate">
          <el-popconfirm
            title="确定已完成上诉操作"
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
        label-width="120px"
        :rules="addRules"
        v-if="stepActive === 1"
        v-loading="loading"
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
        <el-form-item label="广告投放方式" required prop="bd_type">
          <el-select
            class="select-control"
            v-model="addForm.bd_type"
            filterable
            placeholder="请选择广告投放方式"
          >
            <el-option
              v-for="(item, i) in platformWay"
              :key="i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户ID" required prop="account_id">
          <el-input
            v-model="addForm.account_id"
            @blur="fetchAccountId"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="账户名"
          required
          prop="account_name"
          v-if="getAccountFlag"
        >
          <el-input disabled v-model="addForm.account_name"></el-input>
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
          <el-timeline-item
            size="large"
            v-for="(item, i) in progressConfig.step3"
            :key="i"
          >
            <div>{{ item.name }}</div>
            <a class="skip" :href="item.url" target="_blank"
              >点击跳转：{{ item.url }}</a
            >
          </el-timeline-item>
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
import { getConnectUrl, getCurrentPlatform } from "./utils";

export default {
  data() {
    return {
      steps: ["API权限申请", "广告主匹配", "获取回调链接"],
      stepActive: 0,
      addForm: {
        appName: "",
        title: "",
        origin: "",
        account_id: "",
        account_name: "",
        system_create: "",
        bd_type: "",
        proceeds_user: "",
      },
      addRules: {
        account_id: [{ required: true, message: "请输入账户ID" }],
        account_name: [{ required: true, message: "请输入账户名" }],
        bd_type: [{ required: true, message: "请选择投放方式" }],
        proceeds_user: [{ required: true, message: "请输入收款户名" }],
      },
      proceeds: [],
      platformWay: [],
      accountInit: false,
      accountLoading: true,
      addLoading: false,
      $input: null,
      progressConfig: {
        step1: [
          {
            name: "进入投放平台（www2.baidu.com）绑定当前账户到对应超管账户",
            url: "https://www2.baidu.com/",
          },
        ],
        step3: [
          {
            name: "点击跳转投放管理平台",
            url: "https://www2.baidu.com",
          },
        ],
      },
      stepImg1: "",
      stepImg3: "",
      app: {},
      getAccountFlag: false, //显示用户名称
      loading: false,
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
    this.getPlatformInvestWay();
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
    // 获取用户名
    async fetchAccountId(e) {
      const { system_create, account_id, origin, title } = this.addForm;
      this.getAccountFlag = false;
      if (!account_id) return;
      this.loading = true;

      const [err, res] = await this.$http.post("Ip/getAccountName", {
        system_create,
        origin,
        title,
        account_id,
      });

      if (err) {
        this.loading = false;
        this.addForm.account_id = "";
        return;
      }
      console.log(res.account_name);
      if (!res.account_name) {
        this.addForm.account_id = "";
        this.loading = false;

        this.$message({
          message: "暂未查询到关联的账户ID，请核对后再试。",
          type: "error",
        });

        return;
      }
      this.loading = false;
      this.getAccountFlag = true;
      this.addForm.account_name = res.account_name;
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
    async getPlatformInvestWay() {
      const { system_create } = this.addForm;

      if (!system_create) return;

      const [err, res] = await this.$http.post("Ip/getPlatformInvestWay", {
        system_create,
      });

      if (err) return;

      this.platformWay = res;
    },
    async fetchStepImg() {
      const { system_create } = this.addForm;

      if (!system_create) return;

      const [err, res] = await this.$http.post("Ip/getStepImage", {
        system_create,
      });

      if (err) return;

      const { step1, step3 } = res;
      console.log(step1);
      this.stepImg3 = step3;
    },
    onCopy() {
      const { id, system } = this.$store.getters.getCurrentApp(
        this.$route.query.appId
      );
      const { system_create, origin } = this.addForm;

      const connectUrl = getConnectUrl({
        appid: id,
        origin,
        system_create,
        system,
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
      .myImg {
        width: 750px;
        height: 300px;
        padding-left: 40px;
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
