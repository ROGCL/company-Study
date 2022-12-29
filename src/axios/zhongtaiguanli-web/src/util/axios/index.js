import store from "store2";
import md5 from "md5";
import router from "@/common/router/index";
import _ from "axios";
import {
  stringify
} from "qs";
import {
  Notification
} from "element-ui";
import {
  codeMessage,
  CODE
} from "./config";

const axios = _.create({
  baseURL: process.env.VUE_APP_PROXY_KEY,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

axios.interceptors.request.use(
  (cfg) => {
    /** 获取缓存中的通用数据填充在请求参数里 **/
    const {
      loginToken = "", user = {}
    } = store.getAll();
    const {
      data
    } = cfg;
    const {
      appId
    } = router.history.current.query;
    /** 这里需要加上加密参数*/
    const ztMac = cfg.data ? JSON.parse(JSON.stringify(cfg.data)) : ''
    if (ztMac && ztMac.mac_key && cfg.url == "login/login") {
      const t = new Date().getTime();
      cfg.headers["macNo"] = ztMac.macNo;
      cfg.headers["time"] = t;
      cfg.headers["sign"] = md5(md5(`mac_key=${ztMac.mac_key}&mac_no=${ztMac.macNo}&time=${t}`));
    }
    if (cfg.data) {
      // 这三个参数不能做为参数传递，只能在header里传输
      cfg.data.macNo = undefined
      cfg.data.mac_key = undefined
      cfg.data.user_tel = undefined
    }
    if (!!loginToken && !!Object.keys(user).length) {
      cfg.data = Object.assign({}, {
          appId: appId,
          loginToken,
          loginId: user.id,
        },
        data
      );
    }

    if (cfg.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      cfg.data = stringify(cfg.data);
    }

    return cfg;
  },
  (err) => [err.toString()]
);

axios.interceptors.response.use(
  (res) => {
    const {
      data: {
        data,
        code,
        msg = ""
      },
      status,
    } = res;
    if (status !== 200) {
      return [`连接失败 code:${status}`];
    }
    
    if (code === CODE.timeout) {
      if (window.timeoutLoading) return;
      const {
        chromePluginId = "", version = ''
      } = store.getAll();
      window.timeoutLoading = true;
      store.clearAll();
      localStorage.setItem('chromePluginId',chromePluginId)
      localStorage.setItem('version',version)
      Notification.error({
        title: "提示",
        message: msg || "登录超时或该账号在其他地方登录,将跳转至登录页",
        onClose: () => {
          window.timeoutLoading = false;
        },
      });

      router.replace("/login").catch(err =>{err});

      return [msg];
    }

    if (code !== CODE.success) {
      Notification.error({
        title: "错误",
        message: msg,
      });
      return [msg];
    }

    return [null, data, code, msg];
  },
  (err) => {
    console.log(err);
    const {
      response
    } = err;

    if (!response) {
      return ["未连接到服务器"];
    }

    // 还是需要返回错误原信息,因为接口需要传递发送信息与接口的信息
    if (response && response.status) {
      return [codeMessage(response.status)];
    }
  }
);

export default axios;