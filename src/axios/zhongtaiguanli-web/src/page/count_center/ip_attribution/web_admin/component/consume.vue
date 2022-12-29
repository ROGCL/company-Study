<template>
  <div class="get_code">
    <el-dialog
      :visible.sync="dialogVisible"
      width="500px"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <span>消耗金额</span>
        <el-tooltip class="item" effect="dark" placement="right">
          <div slot="content">
            填写消耗金额后，该渠道的实际<br />消耗将取所填写的值
          </div>
          <i class="el-icon-info" style="padding-left: 5px"></i>
        </el-tooltip>
      </div>
      <div class="content">
        <el-form ref="form" :rules="rules" :model="form" label-width="80px">
          <el-form-item label="" prop="real_cost">
            <el-input v-model="form.real_cost">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updata">保存</el-button>
        <el-popover
          placement="top"
          width="160"
          v-model="visible"
          v-if="form.real_cost"
        >
          <p>是否放弃该次修改</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false"
              >取消</el-button
            >
            <el-button type="primary" size="mini" @click="downBox"
              >确定</el-button
            >
          </div>
          <el-button slot="reference">关闭</el-button>
        </el-popover>
        <el-button v-else @click="downBox">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      delFlag: false,
      visible: false,
      origin: "",
      form: {
        real_cost: "",
      },
      rules: {
        real_cost: [
          { required: true, message: "请输入返点金额", trigger: "change" },
        ],
      },
      showBox: false,
      info: {},
    };
  },
  mounted() {},
  methods: {
    updata() {
      this.$refs.form.validate(async (valid) => {
        const { form } = this;
        console.log(form.date);
        if (valid) {
          const [err, res] = await this.$http.post("Ip/saveCost", {
            real_cost: form.real_cost,
            origin: this.info.origin,
            system_create: this.info.system_create,
          });
          if (err) {
            return;
          }
          this.form.real_cost = "";
          this.dialogVisible = false;
          this.visible = false;
          this.$refs.form.resetFields();
        } else {
          return false;
        }
      });
    },
    async getRebatesInfo() {
      const [err, res] = await this.$http.post("Ip/getRebatesInfo", {
        origin: this.info.origin,
        system_create: this.info.system_create,
      });
      if (err) {
        return;
      }
      this.dialogVisible = true;

      this.form.real_cost = res[0].real_cost;
    },
    downBox() {
      this.form.real_cost = "";
      this.dialogVisible = false;
      this.visible = false;
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style lang='scss' scoped>
.get_code {
  padding: 20px;
  background: white;
  .box {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .content {
      padding: 0 25px;
      width: 500px;
      height: 200px;
      display: flex;
      .btn {
        align-items: center;
        text-align: center;
        width: 50px;
        margin-left: 20px;
        line-height: 100px;
      }
    }
  }
}
.el-input {
  width: 250px;
}
</style>