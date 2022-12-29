<template>
  <div>
    <!-- 头部和侧边栏共用 -->
  <controlComponents></controlComponents>
  <!-- 面包屑 -->
  <div class="ham">
      <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/symbolPages' }">学习记录</el-breadcrumb-item>
   <el-breadcrumb-item :to="{path:'/recordLearning'}">登录授权管理</el-breadcrumb-item>
    </el-breadcrumb>
    </div>
  <!-- 输入,选择框区域 -->
  <div class="input-selsect">
    <!-- 输入框外部大盒子 -->
    <div class="outside-box">
     <!-- 姓名/账号输入框 -->
    <div class="name-username input-selsect-public">
        姓名/账号
        <input type="text" v-model="account" class="input-public" placeholder="请输入姓名/账号"/>
    </div>
    <!-- 用户ID/插件ID -->
    <div class="user-ID input-selsect-public">
        用户ID/插件ID
        <input type="text" v-model="plugin" class="input-public" placeholder="请输入用户ID/插件ID"/>
    </div>
    <!-- 发起时间 -->
    <div class="send-time input-selsect-public">
        发起时间
    <el-date-picker
      v-model="value1"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      format="yyyy-MM-dd"
      size="mini"
      class="date-picker"
      >
    </el-date-picker>
    </div>
    </div>
    <!-- 按钮 -->
    <div class="find-btn" @click="searchList">
        <span></span>
        查询
    </div>
  </div>
  <!-- 下方列表展示区域 -->
  <div class="bottom-list">
    <!-- 固定栏+展示栏大盒子 -->
    <div class="bottom-list-inner-box">
    <!-- 上部固定栏 -->
    <div class="fixed-top-box">
          <!-- ID -->
          <div class="top-id top-public">用户ID</div>
          <!-- 账号 -->
          <div class="top-username top-public">账号</div>
          <!-- 姓名 -->
          <div class="top-name top-public">姓名</div>
          <!-- 插件ID -->
          <div class="top-plugin top-public">插件ID</div>
          <!-- 发起时间 -->
          <div class="top-send-time top-public">发起时间</div>
          <!-- 处理结果 -->
          <!-- <div class="top-result top-public">处理结果</div> -->
          <!-- 处理操作 -->
          <div class="operation top-public">操作</div>
    </div>
    <!-- 下部数据展示栏 -->
    <div class="fixed-bottom-box" v-for="(item,index) in list" :key="index">
          <!-- ID -->
          <div class="top-id top-public">{{item.user_id}}</div>
          <!-- 账号 -->
          <div class="top-username top-public">{{item.username}}</div>
          <!-- 姓名 -->
          <div class="top-name top-public">{{item.nickname}}</div>
          <!-- 插件ID -->
          <div class="top-plugin top-public">{{item.plug_id}}</div>
          <!-- 发起时间 -->
          <div class="top-send-time top-public">{{item.add_time}}</div>
          <!-- 处理结果 -->
          <!-- <div class="top-result top-public" v-if="item.status == 1">审核中</div>
          <div class="top-result top-public" v-else-if="item.status == 2">未通过</div>
          <div class="top-result top-public" v-else>通过</div> -->
          <div class="operation top-public" style="display:flex;justify-content: space-evenly;">
            <div style="cursor: pointer;color: #409EFF;" class="agreeConfirm" @click="agree(item.id)">同意授权</div>
            <div style="cursor: pointer;color: #409EFF;" class="refuseConfirm" @click="reference(item.id)">拒绝授权</div>
          </div>
    </div>
    <h3 v-show="this.list == null" class="anymore">--暂时没有更多数据--</h3>
    </div>
    <!-- 外层按钮+分页 -->
    <div class="footer-outside-box">
       <!-- 未处理按钮 -->
       <div class="after-deal deal-public" @click="notHandled">
         <span class="icon-public after-deal-icon"></span>
        未处理
       </div>
       <!-- 已处理按钮 -->
       <div class="deal deal-public" @click="handled">
        <span class="icon-public deal-icon"></span>
        已处理
       </div>
       <!-- 分页 -->
       <div class="pagenition">
        共{{this.total}}条
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-size="this.page_size"
      layout="prev, pager, next, jumper"
      :total="this.total">
    </el-pagination>
    </div>
    </div>
  </div>
  </div>
</template>

<script>
import controlComponents from '@/components/control-components.vue'
export default {
components:{controlComponents},
data(){
    return{
       value1:"",
       account:"",
       plugin:"",
       user:"",
       user_id:"",
       status:2,
       time_add:"",
       page:1,
       page_size:8,
       list:[],
       total:"",
    }
},
mounted(){
this.getlist()

},
// updated(){
//     this.changeTime()
// },
methods:{
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      //根据分页再次进行请求，分页后的数据
      handleCurrentChange() {
        this.$http.post('/authorization/list',{
            user:this.user,
            user_id:this.user_id,
            status:this.status,
            time_add:this.time_add,
            page:this.page,
            page_size:this.page_size
        }).then((res)=>{
            this.list = res.data.data.list
        })
      },
      getlist(){
        this.$http.post('/authorization/list',{
            user:this.user,
            user_id:this.user_id,
            status:this.status,
            time_add:this.time_add,
            page:this.page,
            page_size:this.page_size
        }).then((res)=>{
            this.list = res.data.data.list
            this.total = res.data.data.total
            console.log(this.list)
        })
      },
    //搜索再发一次请求并渲染数据到页面上
      searchList(){
        if(this.account == '' || this.plugin == ''){
            this.$message.error('请填写姓名或账号后进行搜索')
            return
        }
        this.$http.post('/authorization/list',{
            page:this.page,
            page_size:this.page_size,
            user_id:this.account,
            user:this.account,
            status:this.status
        }).then((res)=>{
            this.list = res.data.data.list
            console.log(res.data.data.list,989898)
            if(this.list !== null){
                this.account = ''
                this.plugin = ''
            }
        })
      },
      //未处理
      notHandled(){
        this.$http.post('/authorization/list',{
            page:this.page,
            page_size:this.page_size,
            status:1
        }).then(res=>{
            this.total = res.data.data.total
            this.list = res.data.data.list
        })
      },
      //处理
      handled(){
        this.$http.post('/authorization/list',{
            page:this.page,
            page_size:this.page_size,
            status:3
        }).then(res=>{
            console.log(res.data)
            this.total = res.data.data.total
            this.list = res.data.data.list
        })
      },
      agree(id){
console.log(id,'同意')
this.$http.post('/authorization/audit',{
    id,
    operation:'on'
}).then((res)=>{
    console.log(res.data)
    if(res.data.message == 'success'){
        this.getlist()
    }
})
      },
      reference(id){
console.log(id,'拒绝')
this.$http.post('/authorization/audit',{
    id,
    operation:'off'
}).then((res)=>{
    console.log(res)
    if(res.data.message == 'success'){
        this.getlist()
    }
})
      }
    //   changeTime(){
    //     if(this.value1.length !== 0){
    //     for(let i = 0;i< this.value1.length;i++){
    //   let date = this.value1[i];
    //   let year = date.getFullYear();
    //   let month = date.getMonth() + 1;
    //   let day = date.getDate()
    //   month = month > 9 ? month : "0" + month;
    //   day = day > 9 ? day : "0" + day
    //   let days = year+"-"+month+"-"+day
    //   this.Time = days
    //   console.log(this.Time)
    //     }
    // }
    //   }
}
}
</script>

<style scoped>
 .ham{
  position: absolute;
  left: 216px;
  top: 98px;
  height: 24px;
 }
.input-selsect{
    position: relative;
    width: 1688px;
    height: 94px;
    margin-top: 56px;
    margin-left: 216px;
    background: #fff;
}
.outside-box{
    position: absolute;
    left: 16px;
    top: 16px;
    width:1212px;
    height: 62px;
    display: flex;
    justify-content: space-between;
}
.input-selsect-public{
    width: 324px;
    height: 62px;
    font-size: 14px;
    color: #23262F;
}
.input-public{
    width: 100%;
    height: 32px;
    margin-top: 8px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
}
.input-public::placeholder{
    line-height: 32px;
    padding-left: 12px;
}
.date-picker{
    width: 100%;
    height: 32px;
    margin-top: 8px;
}
.find-btn{
    position: absolute;
    left: 1348px;
    top: 46px;
    width: 82px;
    height: 32px;
    border-radius: 4px;
    background: #2AB18B;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
}
.find-btn span{
    display: inline-block;
    width: 12px;
    height: 12px;
    background-image: url('@/assets/Course-Management/11.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.bottom-list{
    position: relative;
    width: 1688px;
    height: 679px;
    margin-top: 16px;
    margin-left: 216px;
    background: #fff;
}
.bottom-list-inner-box{
    position: absolute;
    left: 20px;
    top: 20px;
    width: 1648px;
    height: 567px;
    /* border: 1px solid #DCDFE6; */
    border-radius:4px;
}
.fixed-top-box{
    display: flex;
    width: 100%;
    height: 63px;
    background: #DCDFE6;
}
.top-public{
    height: 100%;
    color: #909399;
    font-size: 14px;
    text-align: center;
    line-height: 63px;
}
.top-id{
    width: 235px;
}
.top-username{
    width: 224px;
}
.top-name{
    width: 211px;
}
.top-plugin{
    width: 336px;
}
.top-send-time{
    width: 379px;
}
.top-result{
    width: 61px;
}
.operation{
    width: 265px;
}
.authorization{
    display: flex;
    justify-content: space-evenly;
}
/* .authorization-public{
    width: 1.0667rem;
    height: .5333rem;
    border-radius: 12px;
    background: pink;
} */
.fixed-bottom-box{
    display: flex;
    border-bottom: 1px solid #DCDFE6;
}
.fixed-bottom-box:last-child{
    border: none;
}
.footer-outside-box{
    display: flex;
    position: absolute;
    left: 20px;
    top: 590px;
    width: 1648px;
    height: 72px;
}
.deal-public{
    width: 96px;
    height: 32px;
    border-radius: 4px;
    margin-top: 20px;
    border: 1px solid #DCDFE6;
    font-size: 14px;
    color: #606266;
    line-height: 32px;
    text-align: center;
    margin-right: 10px;
    cursor: pointer;
}
.icon-public{
    display: inline-block;
    width: 14px;
    height: 14px;
}
.deal{
    background: #2AB18B;
    color: #fff;
}
.after-deal-icon{
    background-image: url('@/assets/Course-Management/16.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.deal-icon{
    background-image: url('@/assets/img/24.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.pagenition{
    display: flex;
    justify-content: space-around;
    position: absolute;
    left: 1030px;
    top: 20px;
    width: 620px;
    height: 32px;
    font-size: 14px;
    line-height: 32px;
    color: #606266;
}
.anymore{
    text-align: center;
    line-height: 504px;
    font-weight: normal;
    color: #606266;
}
.agreeConfirm:hover{
    color: #2AB18B;
}
.refuseConfirm:hover{
    color: #2AB18B;
}
</style>
<style>
*{
    margin: 0;
    padding: 0;
    list-style: none;
}
*::-webkit-scrollbar {
	display: none;
}
body{
    width: 100%;
    height: 100vh;
    background: #F0F2F5;
}
.el-date-range-picker__time-header {
  display: none;
}
</style>