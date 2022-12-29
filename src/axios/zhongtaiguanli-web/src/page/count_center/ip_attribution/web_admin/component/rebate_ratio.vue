<template>
  <div class="get_code">
    <el-dialog
      :visible.sync="dialogVisible"
      width="600px"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <span>返点比例</span>
        <el-tooltip class="item" effect="dark" placement="right">
          <div slot="content">
            填写返点比例后，从你填写的生效时间开始，后续每天的实际消耗数据<br />将按照（账面消耗/（1+返点比例））进行计算
          </div>
          <i class="el-icon-info" style="padding-left: 5px"></i>
        </el-tooltip>
      </div>
      <div class="box">
        <div class="content" v-for="item in RebatesInfo" :key="item.id">
          <el-form label-width="80px">
            <el-form-item label="返点比例" prop="ratio">
              <el-input v-model="item.ratio" :disabled="true">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="生效时间" prop="date">
              <el-date-picker
                v-model="item.date"
                type="date"
                placeholder="选择日期"
                :disabled="true"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div class="btn">
            <el-popconfirm title="确定删除该投放？" @confirm="deldata(item.id)">
              <el-button type="text" slot="reference">删除</el-button>
            </el-popconfirm>
          </div>
        </div>
      </div>
      <div class="box" v-if="showBox">
        <div class="content">
          <el-form ref="form" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="返点比例" prop="ratio">
              <el-input v-model="form.ratio">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="生效时间" prop="date">
              <el-date-picker
                v-model="form.date"
                type="date"
                placeholder="选择日期"
                :picker-options="
                  RebatesInfo.length ? pickerOptions2 : ''
                "
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div class="btn">
            <el-button type="text" @click="updata">保存</el-button>
          </div>
        </div>
      </div>
      <div
        v-if="!showBox"
        class="box"
        style="
          text-alien: center;
          line-height: 30px;
          height: 30px;
          cursor: pointer;
        "
        @click="showBox = true"
      >
        <span
          class="el-icon-circle-plus-outline"
          style="font-size: 20px; line-height: 30px"
        ></span>
        <span style="font-size: 18px">新增</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-popover
          placement="top"
          width="160"
          v-model="visible"
          v-if="form.ratio || form.date"
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
      RebatesInfo: [],
      origin: "",
      form: {
        ratio: "",
        date: "",
      },
      info:{

      },
      rules: {
        ratio: [
          { required: true, message: "请输入返点比例", trigger: "change" },
        ],
        date: [
          { required: true, message: "请选择生效时间", trigger: "change" },
        ],
      },
      showBox: false,
    };
  },
  mounted() {},
  computed: {
    pickerOptions2() {
      let _this = this;
      if (_this.RebatesInfo.length) {
        return {
          disabledDate(time) {
            return (
              time.getTime() < new Date(_this.RebatesInfo[0].date).getTime()
            );
          },
        };
      } else {
        return {};
      }
    },
  },
  methods: {
    updata() {
      this.$refs.form.validate(async (valid) => {
        const { form } = this;
        console.log(form.date);
        if (valid) {
          const [err, res] = await this.$http.post("Ip/addRebates", {
            ratio: form.ratio,
            date: moment(form.date).format("YYYYMMDD"),
            origin:this.info.origin,
            system_create:this.info.system_create
          });
          if (err) {
            return;
          }
          this.showBox = false;
          this.form.ratio = "";
          this.form.date = "";
          this.getRebatesInfo();
        } else {
          return false;
        }
      });
    },
    async deldata(id) {
      const [err, res] = await this.$http.post("Ip/delRebates", {
        id,
      });
      if (err) {
        return;
      }
      this.$message({
        message: "删除成功",
        type: "success",
      });
      this.showBox = false;
      this.delFlag = false;
      this.getRebatesInfo();
    },
    async getRebatesInfo() {
      const [err, res] = await this.$http.post("Ip/getRebatesInfo", {
        origin:this.info.origin,
        system_create:this.info.system_create
      });
      if (err) {

        return;
      }
      this.dialogVisible = true
      if (res.length) {
        this.RebatesInfo = res.map((item) => {
          item.date = moment(item.date).format("YYYY-MM-DD");
          return item;
        });
      } else {
        this.showBox = true;
        this.RebatesInfo = [];
      }
    },
    downBox() {
      this.form.ratio = "";
      this.form.date = "";
      this.showBox = false;
      this.dialogVisible = false;
      this.visible = false
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
.el-input{
  width: 250px;
}
/deep/.el-dialog__body {
  height: 500px;
  overflow: auto;
}
</style>