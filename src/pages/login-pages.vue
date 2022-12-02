<template>
  <!-- 登录页 -->
  <div>
    <!-- 登录框 -->
    <div class="login">
      <!-- 标题 -->
      <div class="title"></div>
      <!-- 账号输入框+正则校验 -->
      <div class="ID">
        <span>账号</span>
        <input
          type="text"
          placeholder="输入账号"
          v-model="ID"
          @blur="handler"
        />
        <p id="notice1"></p>
      </div>
      <!-- 密码输入框 -->
      <div class="password">
        <span>密码</span>
        <input
          type="text"
          placeholder="输入密码"
          v-model="password"
          @blur="handlers"
        />
        <p id="notice2"></p>
      </div>
      <!-- 登录按钮 -->
      <!-- 要做路由守卫，判断是否填写满足正则校验或与后端数据一致满足校验后在进行跳转 -->
      <router-link to="/homePages">
        <div class="loginBtn" @click="addFn">登录</div>
      </router-link>

      <!-- 重置按钮 -->
      <a href="#" id="reset" @click="resetForm">重置</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ID: "",
      password: "",
      user_id:'',
      token:""
    };
  },
  created() {
    
  },
  methods: {
    resetForm() {
      this.ID = null;
      this.password = null;
    },
    handler() {
      let s = document.getElementById("notice1");
      if (/^[a-zA-Z]{2,}$/.test(s.value)) {
        //  s.className = 'right'
        s.innerHTML = "";
      } else {
        // s.className = 'err'
        s.innerHTML = "账号格式有误";
      }
    },
    handlers() {
      let h = document.getElementById("notice2");
      if (/^[a-zA-Z0-9]{1,20}$/.test(h.value)) {
        // h.className = 'right'
        h.innerHTML = "";
      } else {
        // h.className = 'false'
        h.innerHTML = "密码不能为空";
      }
    },
   addFn() {
     this.$http
        .post("/user/login", {
          username: this.ID,
          password: this.password,
        })
        .then((res) => {
          this.user_id = res.data.data.user_info.id
          localStorage.setItem('user_id',res.data.data.user_info.id)
          console.log(res.data,111)
          this.token = res.data.data.token
          sessionStorage.setItem("token",this.token );
          // console.log(res.data.data.user_info.id,6666);
          // 存储登录的token
          
          // 存储登录的用户信息
          let data = JSON.stringify(res.data.data.user_info);
          localStorage.setItem("user_info", data);
        })
        .catch((err) => {
          console.log(err);
        })
        
    },
  },
};
</script>

<style scoped>
.login {
  position: relative;
  top: 50%;
  transform: translateY(50%);
  width: 434px;
  height: 456px;
  background: #fff;
  border-radius: 16px;
  margin: 0 auto;
}
.title {
  position: absolute;
  left: 94px;
  top: 62px;
  width: 247px;
  height: 31px;
  background-image: url("@/assets/img/9.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.ID {
  position: absolute;
  left: 42px;
  top: 142px;
  width: 350px;
  height: 62px;
}
.ID span {
  display: block;
  padding-bottom: 5px;
  font-size: 12px;
  color: #333333;
}
.ID input {
  width: 100%;
  height: 40px;
  background: #f9f9f9;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.ID input::-webkit-input-placeholder {
  padding-left: 12px;
  font-size: 14px;
  color: #a8abb2;
}
.password {
  position: absolute;
  left: 42px;
  top: 249px;
  width: 350px;
  height: 62px;
}
.password span {
  display: block;
  padding-bottom: 5px;
  font-size: 12px;
  color: #333333;
}
.password input {
  width: 100%;
  height: 40px;
  background: #f9f9f9;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.password input::-webkit-input-placeholder {
  padding-left: 12px;
  font-size: 14px;
  color: #a8abb2;
}
.loginBtn {
  position: absolute;
  left: 42px;
  bottom: 79px;
  width: 350px;
  height: 45px;
  background: #2ab18b;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  line-height: 45px;
  color: #fff;
}
#reset {
  position: absolute;
  left: 203px;
  bottom: 42px;
  color: #409eff;
  font-size: 14px;
}
#notice1 {
  font-size: 12px;
  color: #f56c6c;
}
#notice2 {
  font-size: 12px;
  color: #f56c6c;
}
</style>
<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
body {
  width: 100%;
  height: 100vh;
  background-image: url("@/assets/img/8.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

/* @media (max-width:768px) {
    html{
        background-color: #fff;
    }
}
@media (min-width:992px) {
    html{
        background-color: pink;
    }
}
@media (min-width:1200px) {
    html{
        background-color: skyblue;
    }
} */
</style>
