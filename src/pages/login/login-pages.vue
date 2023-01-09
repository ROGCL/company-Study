<template>
  <!-- 登录页 -->
  <div class="window"

  >
    <!-- 登录框 -->
    <div class="login">
       <div class="login-title"></div>
           <!-- 下方输入框表单盒子 -->
           <div class="login-form">
            <el-form :rules="loginRules" :model="login" hide-required-asterisk>
              <el-form-item label="账号" prop="account" class="form-item">
                <el-input v-model="login.account" placeholder="请输入账号" autocomplete></el-input>
                <img src="@/assets/img/yes.png" alt="" class="yes-img" v-show="login.account.length > 0">
              </el-form-item>
              <el-form-item label="密码" class="form-item" prop="password">
                <!-- 这里的三元表达式用户切换密码的显示和隐藏，默认为空就是普通输入框形式，password就是密码框形式 -->
                <el-input :type="passwordShow ? '' : 'password'" v-model="login.password" placeholder="请输入密码" autocomplete></el-input>
                <img src="@/assets/img/p2.png" alt="" class="password-img" v-if="!passwordShow" @click="passwordShow = true">
                <img src="@/assets/img/p1.png" alt="" class="password-img" v-else @click="passwordShow = false">
              </el-form-item>
            </el-form>

           </div>
            <div class="submit-form">
              <div class="login-buttom" @click="submit"><span v-if="loginAttitube == false">登录</span><span v-else><i class="el-icon-loading"></i>登录中...</span></div>
              <div class="reset" @click="resetForm">重置</div>
           </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      // ID: "",
      fullscreenLoading:false,
      passwordShow:false,
      user_id:'',
      token:"",
      login:{
        account:"",
        password:""
      },
      loginRules: {
        account: [{
          required: true, message: "账号不能为空", trigger: 'blur'
        }],
        password: [{
          required: true, message: "密码不能为空", trigger: 'blur'
        }]
      },
      loginAttitube:false
    };
  },
  mounted(){
    
    window.addEventListener('keyup',this.keyUp)
  },
  beforeDestroy(){
    window.addEventListener('keyup',this.keyUp)
  },
  methods: {
    //重置表单
    resetForm() {
      this.login.account = "";
      this.login.password = "";
    },
    keyUp(e){
      if(e.code == 'Enter'){
        this.submit()
      }
    },
   submit() {
    this.loginAttitube = true
    if(this.login.account == "" || this.login.password == ""){
      this.$message.error('请输入账号或密码后进行登录操作')
    }else{
      this.fullscreenLoading = true
     this.$http
        .post("/user/login", {
          username: this.login.account,
          password: this.login.password,
        })
        .then((res) => {

          if(res.data.code == 1){
            
            this.user_id = res.data.data.user_info.id
          localStorage.setItem('user_id',res.data.data.user_info.id)
          this.token = res.data.data.token
          sessionStorage.setItem("token",this.token );
          // console.log(res.data.data.user_info.id,6666);
          // 存储登录的token
          
          // 存储登录的用户信息
          let data = JSON.stringify(res.data.data.user_info);
          localStorage.setItem("user_info", data);
          
          this.getCourseCate()
            setTimeout(()=>{
              // this.fullscreenLoading = false
              this.$router.push('/homePages')
            },1000)
          }else{
            this.$message.error('请输入正确的用户名或密码')
          }
        })
      }
    },
    //获取课程分类信息
    getCourseCate(){
      this.$http.get('/home/course/cate').then((res)=>{
        //存储课程分类信息
        localStorage.setItem('courseCate',JSON.stringify(res.data.data.list))
      })
    }
  },
};
</script>

<style scoped>
.window{
  width: 100%;
  height: 100vh;
  background-image: url("@/assets/img/8.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login {
  position: relative;
  width: 434px;
  height: 456px;
  background: #fff;
  border-radius: 16px;
}
.login-title{
  position: absolute;
  left: 94px;
  top: 62px;
  width: 247px;
  height: 31px;
  background-image: url('@/assets/img/9.png');
  background-size: cover;
}
.login-form{
  position: absolute;
  left: 42px;
  top: 142px;
  width: 350px;
  height: 147px;
}
.form-item{
  position: relative;
}
.yes-img{
    width: 15px;
    height: 15px;
    position: absolute;
    right: 16px;
    top: 54px;
}
.password-img{
  width: 15px;
  height: 15px;
  position: absolute;
  right: 16px;
  top: 54px;
}
.submit-form{
  position: absolute;
  left: 42px;
  top: 332px;
  width: 350px;
  height: 82px;
}
.login-buttom{
  width: 100%;
  height: 45px;
  background: #2AB18B;
  text-align: center;
  line-height: 45px;
  border-radius: 4px;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
.reset{
  width: 28px;
  height: 20px;
  padding-top: 17px;
  margin-left: 161px;
  font-size: 14px;
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
}
</style>
<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
.el-form-item{
  margin-bottom: 10px;
}
</style>
