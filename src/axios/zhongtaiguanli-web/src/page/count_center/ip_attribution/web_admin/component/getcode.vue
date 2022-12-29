<template>
  <div class="get_code">
    <el-dialog title="获取代码" :visible.sync="dialogVisible">
      <el-input
        type="textarea"
        ref="textarea"
        :rows="20"
        placeholder="请输入内容"
        v-model="textarea"
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
import store from "store2";
export default {
  data() {
    return {
      dialogVisible: false,
      textarea: "",
      origin: "",
      data: "",
    };
  },
  methods: {
    copy() {
      if (!this.textarea) return;

      this.$refs.textarea.select();
      document.execCommand("copy");
      this.$message({
        message: "复制成功",
        type: "success",
      });
    },
  },
  watch: {
    dialogVisible(newVal) {
      if (!newVal) return;
      const appid = this.$route.query.appId;
      const urlMap = {
        development: "http://mapi-dev.cqdingyan.com/ip/index",
        production: "http://mapi.cqdingyan.com/ip/index",
      };
      const api = urlMap[process.env.NODE_ENV];
      if (this.data.system_create != 18) {
        this.textarea = `
var data = JSON.stringify({"appid":"${appid}","origin":"${this.data.origin}"});
var xhr = new XMLHttpRequest();
xhr.open("POST", "${api}");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.send(data);
`;
      } else {
        // appid，渠道号，平台，双端监测系统, 双端监测 应用
        const {
          appid,
          origin,
          system_create,
          lisiten_app_system,
          lisiten_appid,
          system
        } = this.data;
        // const appid = this.$route.query.appId
        this.textarea = `let nt_os;let OS;
let UA = window.navigator.userAgent;
        let TS = new Date().valueOf()
if (/android/i.test(navigator.userAgent)) {
OS = 0
}
if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
OS = 1
}
let trackId;
let str = location.href;
let num = str.indexOf('?');
str = str.substr(num + 1);
let arr = str.split('&');
for (let i = 0; i < arr.length; i++) {
  num = arr[i].indexOf('=');
  if (num > 0) {
    if (arr[i].substring(0, num) == 'trackId') {
      trackId = arr[i].substr(num + 1);
    }
  }
}
let xhr = new XMLHttpRequest();
xhr.open(
  'GET',
  'https://mapi.cqdingyan.com/invest_watch?nt_appid=${appid}'+'&nt_channel=${origin}'+
  '&track_id='+trackId+'&UA='+UA+'&nt_platform=${system_create}'+'&nt2_os=${lisiten_app_system}'+'&nt2_appid=${lisiten_appid}'+'&nt_os='+${system}+'&OS='+OS+'&TS='+TS
);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send();
`;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.get_code {
  padding: 20px;
  background: white;
  .btn {
    margin: 20px 0;
  }
}
</style>
