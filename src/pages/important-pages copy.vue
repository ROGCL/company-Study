<template>
  <div>
    <!-- 通用头部 -->
    <controlComponents></controlComponents>
    <!-- 表单内容区域 -->
    <div class="input-area">
      <!-- 标题 -->
      <h3>课程管理</h3>
      <!-- 视频ID/标题选择框区域 -->
      <div class="public ID">
          <span>视频ID/标题</span>
        <input v-model="input" placeholder="请输入" class="input-public" />
      </div>
      <!-- 课程属性下拉菜单选择区域 -->
      <div class="attribute public">
        <span>课程属性</span>
        <el-select v-model="value2" placeholder="请选择" class="input-public">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <!-- 类目下拉菜单选择区域 -->
      <div class="public category">
        <span>类目</span>
        <el-select v-model="value3" placeholder="请选择" class="input-public">
          <el-option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <!-- 推荐位下拉菜单选择区域 -->
      <div class="public recommended">
        <span>推荐位</span>
        <el-select v-model="value4" placeholder="请选择" class="input-public">
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <!-- 新增时间，时间选择区域 -->
      <div class="public time-add">
        <span>新增时间</span>
        <el-date-picker
      v-model="value6"
      type="datetimerange"
      :picker-options="pickerOptions"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      align="center"
      format="yyyy-MM-dd"
      size="small"
      class="date-picker"
      >
    </el-date-picker>
      </div>
      <!-- 修改时间，时间选择区域 -->
      <div class="public time-Modify">
        <span>修改时间</span>
        <el-date-picker
      v-model="value7"
      type="datetimerange"
      :picker-options="pickerOptions"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      align="center"
      format="yyyy-MM-dd"
      size="small"
      class="date-picker"
      >
    </el-date-picker>
      </div>
      <!-- 上下架区域，下拉菜单选择框 -->
      <div class="public Up-Down">
        <span>上下架状态</span>
        <el-select v-model="value5" placeholder="请选择" class="input-public">
          <el-option
            v-for="item in options5"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <!-- 清除条件-按钮 -->
      <div class="btn-clear" @click="clearList">
        <div class="icon-public clear"></div>
        <span>清除条件</span>
      </div>
      <!-- 搜索-按钮 -->
      <div class="btn-search" @click="searchListForm">
        <div class="icon-public search"></div>
        <span>搜索</span>
      </div>
    </div>
    <!-- 选择区域，增删改查区域 -->
    <div class="bottom-area">
      <!-- 表单展示区域 -->
      <div class="show-area">
        <!-- 头部栏共用 -->
        <div class="show-area-head">
          <!-- 全选反选控制框 -->
          <div class="choose-all show-area-head-public">
            <input type="checkbox" v-model="checked"/>
          </div>
          <!-- id -->
          <div class="id-num show-area-head-public">
            ID
          </div>
          <!-- 视频封面 -->
          <div class="viedo-banner show-area-head-public">
            视频封面
          </div>
          <!-- 视频 -->
          <div class="video-url show-area-head-public">
            视频
          </div>
          <!-- 视屏标题 -->
          <div class="video-title show-area-head-public">
            视频标题
          </div>
          <!-- 课程属性 -->
          <div class="class-attritube show-area-head-public">
            课程属性
          </div>
          <!-- 类目 -->
          <div class="class-type show-area-head-public">
            类目
          </div>
          <!-- 推荐位 -->
          <div class="class-recommended show-area-head-public">
            推荐位
          </div>
          <!-- 学习人数 -->
          <div class="study-man show-area-head-public">
            学习人数
          </div>
          <!-- 学习人次 -->
          <div class="study-woman show-area-head-public">
            学习人次
          </div>
          <!-- 新增时间 -->
          <div class="new-time show-area-head-public">
            新增时间
          </div>
          <!-- 上架状态 -->
          <div class="shelves show-area-head-public">
            上架状态
          </div>
          <!-- 修改时间 -->
          <div class="Modify show-area-head-public">
            修改时间
          </div>
          <!-- 操作 -->
          <div class="operation show-area-head-public">
            操作
          </div>
        </div>
        <!-- 内容区域 -->
        <div class="show-area-content" v-for="(item,index) in listform" :key="index">
          <!-- 全选反选控制框 -->
          <div class="choose-all show-area-head-public">
            <input type="checkbox" v-model="item.status" />
          </div>
          <!-- id -->
          <div class="id-num show-area-head-public">
            {{item.id}}
          </div>
          <!-- 视频封面 -->
          <div class="viedo-banner show-area-head-public">
            <!-- <img :src="'http://192.168.3.191:9000' + item.course_cover_url" id="viedo-banner-png"> -->
          </div>
          <!-- 视频，点击预览跳转到视频页面 -->
          <div class="video-url show-area-head-public">
            预览
          </div>
          <!-- 视屏标题 -->
          <div class="video-title show-area-head-public">
            {{item.title}}
          </div>
          <!-- 课程属性 -->
          <div class="class-attritube show-area-head-public">
            {{item.attribute}}
          </div>
          <!-- 类目 -->
          <div class="class-type show-area-head-public">
            {{item.cate}}
          </div>
          <!-- 推荐位 -->
          <div class="class-recommended show-area-head-public">
            {{item.posid}}
          </div>
          <!-- 学习人数 -->
          <div class="study-man show-area-head-public">
            {{item.course_uv}}
          </div>
          <!-- 学习人次 -->
          <div class="study-woman show-area-head-public">
            {{item.course_pv}}
          </div>
          <!-- 新增时间 -->
          <div class="new-time show-area-head-public">
            {{item.time_add}}
          </div>
          <!-- 上架状态 -->
          <div class="shelves show-area-head-public">
            <!-- 放置三张图片，上架/上架中/下架状态图 -->
            <!-- 根据状态切换图片 -->
            <div class="small-attitube1" v-if="item.status == 0"></div>
            <div class="small-attitube2" v-else-if="item.status == 1"></div>
            <div class="small-attitube3" v-else></div>
          </div>
          <!-- 修改时间 -->
          <div class="Modify show-area-head-public">
            {{item.time_update}}
          </div>
          <!-- 操作 -->
          <div class="operation show-area-head-public">
            <span>编辑</span>
            <span>上架</span>
            <span>删除</span>
          </div>
        </div>
      </div>
      <!-- 按钮+分页器区域 -->
      <div class="pagination">
        <div class="btn-area">
          <div  @click="dialogVisible = true">
          <span class="add-btn area-btn-public"></span>  
          <!-- 新增 -->
          <el-button type="text" class="add-button">新增</el-button>
         </div>
         <div>
          <span class="del-btn area-btn-public"></span>
          删除</div>
         <div>
          <span class="up-btn area-btn-public"></span>
          上架
        </div>
         <div>
          <span class="up-btn area-btn-public"></span>
          下架
        </div>
         <div>
          <span class="category-btn area-btn-public"></span>
          分类
        </div>
        </div>
        <!-- 分页区域 -->
        <div class="pagination-area">
           <span>共{{this.total}}条</span>
        <!-- 分页器 -->
          <div class="el-pagination">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-size.sync="page_size"
      layout="prev, pager, next, jumper"
      :total.sync="total"
      >
    </el-pagination>
          </div>
        </div>

      </div>
    </div>
    <!-- 选择单节课还是系列课进入编辑界面 -->

         <!-- 头部右侧取消按钮 -->
         <!-- 单节课多节课的选项按钮 -->
         <el-dialog
  :visible.sync="dialogVisible"
  width="30%">
  <span slot="footer" class="dialog-footer">
    <router-link to="/addSingleClassPages">
      <el-button @click="dialogVisible = false">单节课</el-button>
    </router-link>
    <router-link to="/addMoreClassPages">
      <el-button type="primary" @click="dialogVisible = false">系列课</el-button>
    </router-link>
  </span>
</el-dialog>
  </div>
</template>

<script>
import controlComponents from "@/components/control-components.vue";
export default {
  components: { controlComponents },
  data() {
    return {
      input: "",
      //课程属性
      options2: [{
          value: '单节课',
          label: '单节课'
        }, {
          value: '系列课',
          label: '系列课'
        }],
        value2: '',
        //类目
        options3: [{
          value: '产品经理',
          label: '产品经理'
        }, {
          value: '技术开发',
          label: '技术开发'
        }, {
          value: '运营推广',
          label: '运营推广'
        }, {
          value: '内部讲堂',
          label: '内部讲堂'
        }, {
          value: '职场通用素质',
          label: '职场通用素质'
        }, {
          value: '产品与设计',
          label: '产品与设计'
        }, {
          value: '管理与领导力',
          label: '管理与领导力'
        }, {
          value: '数据分析',
          label: '数据分析'
        }, {
          value: '其他',
          label: '其他'
        }],
        value3:"",
        //推荐位
        options4: [{
          value: '精品课程',
          label: '精品课程'
        }, {
          value: '其他推位',
          label: '其他推位'
        }],
        value4:"",
        //上下架状态
        options5: [{
          value: '上架',
          label: '上架'
        }, {
          value: '上架中',
          label: '上架中'
        }, {
          value: '下架',
          label: '下架'
        }],
        value5:"",
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value6: "",
        value7:"",
        checked:false,
        // checkedList:[],
        // 课程列表请求字段
        id:"",
        title:"",
        attritube:"",
        cate:"",
        posid:"",
        status:"",
        time_add:"",
        time_update:"",
        page:1,
        page_size:8,
        prop:"",
        order:"",
        is_download:"",
        listform:[],
        total:"",
        dialogVisible: false
    };
  },
  watch:{
  },
  mounted(){
    this.getSearchList()
  },
  methods:{
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      //此处是做分页数据的处理，点击分页后展示不同的数据
      handleCurrentChange() {
        this.$http.post('/course/list',{
        id:this.id,
        title:this.title,
        attritube:this.attritube,
        cate:this.cate,
        posid:this.posid,
        status:this.status,
        time_add:this.time_add,
        time_update:this.time_update,
        page:this.page,
        page_size:this.page_size,
        prop:this.prop,
        order:this.order,
        is_download:this.is_download
        }).then((res)=>{
         this.listform = res.data.data.list
        })
      },
      // 默认请求第一页的数据列表
      getSearchList(){
        this.$http.post('/course/list',{
        id:this.id,
        title:this.title,
        attritube:this.attritube,
        cate:this.cate,
        posid:this.posid,
        status:this.status,
        time_add:this.time_add,
        time_update:this.time_update,
        page:this.page,
        page_size:this.page_size,
        prop:this.prop,
        order:this.order,
        is_download:this.is_download
        }).then((res)=>{
         this.listform = res.data.data.list
         console.log(this.listform)
         this.total = res.data.data.total
        })
      },
      // 重置清除筛选条件的操作
      clearList(){
        this.input = ""
        this.value2 = ""
        this.value3 = ""
        this.value4 = ""
        this.value5 = ""
        this.value6 = ""
        this.value7 = ""
      },
      //搜索做的操作
      searchListForm(){
         this.$http.post('/course/list',{
          page:this.page,
          page_size:this.page_size,
          id:this.input,
          title:this.input,
          attribute:this.value2,
          cate:this.value3,
          posid:this.value4,
         }).then((res)=>{
          console.log(res.data.data,990099)
         })
      },
      handleClose() {

      }
  }
};
</script>

<style scoped>
.input-area {
  position: relative;
  margin-left: 216px;
  margin-top:16px;
  width: 1688px;
  height: 231px;
  background: #fff;
  border-radius: 8px;
}
.public{
  width: 324px;
  height: 62px;
}
h3{
 position: absolute;
 left: 16px;
 top: 16px;
}
.time-add{
  width: 100%;
}
.time-Modify{
  width: 100%;
}
.icon-public{
  width: 14px;
  height: 14px;
  margin-left: 16px;
  margin-top: 9px;
}
.input-public{
  width: 100%;
  height: 32px;
}
.input-public::placeholder {
  color: #a8abb2;
  line-height: 24px;
  padding-left: 12px;
}
.public span {
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
  color: #303133;
}
.ID{
  position: absolute;
  left: 16px;
  top: 73px;
}
.ID input{
  border: 1px solid #DCDFE6;
  border-radius: 4px;
}
.attribute{
  position: absolute;
  left: 460px;
  top: 73px;
}
.category{
position: absolute;
left: 904px;
top: 73px;
}
.recommended{
  position: absolute;
  left: 1348px;
  top: 73px;
}
.time-add{
  position: absolute;
  left: 16px;
  top: 153px;
}
.time-Modify{
  position: absolute;
  left: 460px;
  top: 153px;
}
.Up-Down{
  position: absolute;
  left: 904px;
  top: 153px;
}
.btn-clear{
  position: absolute;
  left: 1348px;
  top: 183px;
  width: 110px;
  height: 32px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  cursor: pointer;
}
.clear{
  background-image: url('@/assets/Course-Management/10.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.btn-clear span{
  display: block;
  position: absolute;
  left: 38px;
  top: 4px;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  color: #606266;
}
.btn-search{
  position: absolute;
  left: 1477px;
  top: 183px;
  width: 82px;
  height: 32px;
  background: #2AB18B;
  border-radius: 4px 4px 4px 4px;
  cursor: pointer;
}
.btn-search span{
  display: block;
  height: 24px;
  line-height: 24px;
  position: absolute;
  left: 38px;
  top: 4px;
  font-size: 14px;
  color: #fff;
} 
.search{
  background-image: url('@/assets/Course-Management/11.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.bottom-area {
  position: absolute;
  left: 216px;
  top: 345px;
  width: 1688px;
  height: 850px;
  background: #fff;
  border-radius: 8px;
}
.show-area{
  width: 1643px;
  height: 738px;
  margin-top: 20px;
  margin-left: 20px;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
}
.show-area-head{
  display: flex;
  width: 100%;
  height: 82px;
  background: #DCDFE6;
}
.show-area-head-public{
  height: 100%;
  font-size: 14px;
  color: #909399;
  line-height: 82px;
  text-align: center;
}
.choose-all{
width: 48px;

}
.id-num{
  width: 75px;
  
}
.video-url{
  width: 64px;
}
.viedo-banner{
  width: 126px;
  
}
.video-title{
  width: 266px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.class-attritube{
  width: 82px;
  
}
.class-type{
  width: 82px;
  
}
.class-recommended{
  width: 114px;
  
}
.study-man{
  width: 98px;
  
}
.study-woman{
  width: 98px;
  
}
.new-time{
  width: 162px;
  
}
.shelves{
  width: 100px;
}
.Modify{
  width: 162px;
  
}
.operation{
  width: 166px;
  
}
.operation span{
  color: #409EFF;
  margin-right: 11px;
  cursor: pointer;
}
.show-area-content{
  display: flex;
  width: 100%;
  height: 82px;
  background: #fff;
  border-bottom: 1px solid #DCDFE6;
}
.pagination{
  width: 1643px;
  height: 72px;
  margin-left: 20px;
  margin-top: 20px;
}
.btn-area{
  display: flex;
  width: 450px;
  height: 32px;
  justify-content: space-evenly;
  cursor: pointer;
}
.btn-area div{
  width: 82px;
  height: 100%;
  background: #fff;
  border: 1px solid #F0F2F5;
  border-radius:4px ;
  font-size: 14px;
  text-align: center;
  line-height: 32px;
}
.btn-area div:nth-child(1){
  background: #2AB18B;
  color: #fff;
}
.btn-area div:nth-child(2){
  background: #F56C6C;
  color: #fff;
}
.btn-area div:nth-child(3){
  background: #DCDFE6;
  color: #606266;
}
.btn-area div:nth-child(4){
  background: #DCDFE6;
  color: #606266;
}
.btn-area div:nth-child(5){
  background: #DCDFE6;
  color: #606266;
}
.area-btn-public{
  display: inline-block;
  width: 14px;
  height: 14px;
}
.add-btn{
  background-image: url('@/assets/Course-Management/9.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.del-btn{
  background-image: url('@/assets/Course-Management/5.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.up-btn{
  background-image: url('@/assets/Course-Management/12.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.category-btn{
  background-image: url('@/assets/Course-Management/2.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.pagination-area{
  position: absolute;
  left: 1065px;
  bottom: 40px;
  width: 600px;
  height: 32px;
  font-size: 14px;
  color: #606266;
  line-height: 32px;
}
.el-pagination{
  position: absolute;
  left: 40px;
  top: 0;
  width: 439px;
  height: 100%;
}
.small-attitube1{
  width: 51px;
  height: 22px;
  background-image: url('@/assets/Course-Management/13.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin: 30px auto;
}
.small-attitube2{
  width: 51px;
  height: 22px;
  background-image: url('@/assets/Course-Management/14.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin: 30px auto;
}
.small-attitube3{
  width: 51px;
  height: 22px;
  background-image: url('@/assets/Course-Management/15.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin: 30px auto;
}
.viedo-banner-png{
  width: 106px;
  height: 53px;
  margin-top: 15px;
  margin-left: 10px;
}
.date-picker{
    width: 324px;
    height: 32px;
    /* margin-top: 8px; */
}
.delTextraction{
  text-decoration: none;
}
.select-singleormixed{
position: absolute;
top: 30%;
left: 40%;
width: 500px;
height: 300px;
background: pink;
}
.add-button{
  font-size: 14px;
  color: #fff;
  line-height: 8px;
}

/* .el-button{
  margin-right: 20px;
} */
</style>
<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
body {
  width: 100%;
  height: 100%;
  background: #F0F2F5;
}
.el-date-range-picker__time-header {
  display: none;
}
.el-dialog__footer{
  position: absolute;
  top: 20px;
  left: 30%;
}
.el-button--default{
  margin-right: 20px;
}
</style>
