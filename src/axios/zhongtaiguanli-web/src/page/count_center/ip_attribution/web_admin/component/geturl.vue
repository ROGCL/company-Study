<template>
  <div class="get_code">
    <el-dialog title="获取URL" :visible.sync="dialogVisible">
      <el-input
        type="textarea"
        ref="textarea"
        :rows="20"
        placeholder="请输入内容"
        v-model="url"
        readonly
      ></el-input>
      <div class="btn">
        <el-button type="primary" @click="copy">复制</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dialogVisible: false,
      oneAppArr: ["nt_appid", "nt_platform", "nt_channel", "nt_os"],
      deArr: [
        "nt_appid",
        "nt_platform",
        "nt_channel",
        "nt_os",
        "nt2_os",
        "nt2_appid",
      ],
    };
  },
  methods: {
    copy() {
      if (!this.url) return;
      // 提取双端监测与非双端的值，通过every方法判断两个数组的值
      let oneAppArr = [];
      let deArr = [];
      this.oneAppArr.forEach((item) => {
        oneAppArr.push(this.getQueryString(item));
      });
      this.deArr.forEach((item) => {
        deArr.push(this.getQueryString(item));
      });
      if (deArr.every((item) => item) || oneAppArr.every((item) => item)) {
        this.$refs.textarea.select();
        document.execCommand("copy");
        this.$message({
          message: "复制成功",
          type: "success",
        });
      } else {
        this.$message({
          type:"error",
          message:'监测链接错误，请勿复制使用，联系中台同学处理',
        })
      }
    },
    getQueryString(name) {
      let url = this.url.slice(this.url.indexOf("?"))
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      let r = url.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    },
  },
};
</script>

<style lang='less' scoped>
.get_code {
  padding: 20px;
  background: white;
  .btn {
    margin: 20px 0;
  }
}
</style>