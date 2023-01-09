<template>
  <div>
    <!-- 通用头部 -->
    <controlComponents :manageActive="1"></controlComponents>
    <!-- 表单内容区域 -->
    <div class="input-area">
      <!-- 标题 -->
      <h3>课程管理</h3>
      <!-- 视频ID/标题选择框区域 -->
      <div class="public ID">
        <span>视频ID/标题</span>
        <el-input
          type="text"
          v-model="title"
          placeholder="请输入"
          size="medium"
        ></el-input>
      </div>
      <!-- 课程属性下拉菜单选择区域 -->
      <div class="attribute public">
        <span>课程属性</span>
        <el-select
          v-model="attribute"
          placeholder="请选择"
          class="input-public"
          size="medium"
        >
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
        <el-select
          v-model="cate"
          placeholder="请选择"
          class="input-public"
          size="medium"
        >
          <el-option
            v-for="(item, index) in this.courseCate"
            :key="index"
            :label="item"
            :value="index"
          >
          </el-option>
        </el-select>
      </div>
      <!-- 推荐位下拉菜单选择区域 -->
      <div class="public recommended">
        <span>推荐位</span>
        <el-select
          v-model="posid"
          placeholder="请选择"
          class="input-public"
          size="medium"
        >
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
          v-model="courseNewAdd"
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
          v-model="courseAfterAdd"
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
        <el-select
          v-model="status"
          placeholder="请选择"
          class="input-public"
          size="medium"
        >
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
    <div class="bottom-area" v-loading="loading">
      <!-- 表单展示区域 -->
      <div class="show-area">
        <el-table
          ref="multipleTable"
          :data="listform"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange($event, listform)"
        >
          <!-- <template slot-scope="scope"> -->
          <el-table-column type="selection" width="48"> </el-table-column>
          <!-- </template> -->
          <el-table-column label="ID" prop="id" width="75"></el-table-column>
          <el-table-column label="视频封面" width="126" prop="course_cover_url">
            <template slot-scope="scope">
              <el-image
                style="
                  width: 106px;
                  height: 53px;
                  object-fit: cover;
                  cursor: pointer;
                "
                :src="listform[scope.$index].course_cover_url"
                :preview-src-list="srcList"
                @click="
                  showImageSource(listform[scope.$index].course_cover_url)
                "
              ></el-image>
              <!-- <img :src="'http://172.168.11.229:9000' + listform[scope.$index].course_cover_url" alt="" style="width:106px;height: 53px;object-fit: cover;cursor: pointer;"> -->
            </template>
          </el-table-column>
          <el-table-column prop="address" label="视频" width="64">
            <template slot-scope="scope">
              <span
                @click="pushVideo(listform[scope.$index].id)"
                style="cursor: pointer"
                class="preview"
                >预览</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="title" label="视频标题" width="266">
          </el-table-column>
          <el-table-column prop="attribute" label="课程属性" width="82">
          </el-table-column>
          <el-table-column prop="cate" label="类目" width="82">
          </el-table-column>
          <el-table-column prop="posid" label="推荐位" width="114">
          </el-table-column>
          <el-table-column
            prop="course_uv"
            sortable
            label="学习人数"
            width="98"
          >
          </el-table-column>
          <el-table-column
            prop="course_pv"
            sortable
            label="学习人次"
            width="98"
          >
          </el-table-column>
          <el-table-column
            prop="time_add"
            sortable
            label="新增时间"
            width="162"
          >
          </el-table-column>
          <el-table-column prop="status" label="上架状态" width="100">
            <template slot-scope="scope">
              <div
                class="small-attitube1"
                v-if="listform[scope.$index].status == 3"
              ></div>
              <div
                class="small-attitube2"
                v-else-if="listform[scope.$index].status == 1"
              ></div>
              <!-- status==0为下架状态,status==3为上架状态,status==1为上架中状态 -->
              <div class="small-attitube3" v-else></div>
            </template>
          </el-table-column>
          <el-table-column
            prop="time_update"
            sortable
            label="修改时间"
            width="162"
          >
          </el-table-column>
          <el-table-column label="操作" width="166">
            <template slot-scope="scope">
              <div class="operation show-area-head-public">
                <router-link
                  :to="{
                    path: '/redactPages',
                    query: {
                      id: listform[scope.$index].id,
                      attribute: listform[scope.$index].attribute,
                      cate: listform[scope.$index].cate,
                      form: listform[scope.$index],
                    },
                  }"
                  class="delTextraction"
                >
                  <span>编辑</span>
                </router-link>
                <span
                  @click="
                    shelves(
                      listform[scope.$index].id,
                      listform[scope.$index].status
                    )
                  "
                  >上架</span
                >
                <span @click="deleteCourse(listform[scope.$index].id)"
                  >删除</span
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 按钮+分页器区域 -->
      <div class="pagination">
        <div class="btn-area">
          <div @click="dialogVisible = true">
            <span class="add-btn area-btn-public"></span>
            <!-- 新增 -->
            <el-button type="text" class="add-button">新增</el-button>
          </div>
          <div @click="deleteSelection(multipleSelection)">
            <span class="del-btn area-btn-public"></span>
            删除
          </div>
          <div @click="shelfCourse(multipleSelection, 'up')">
            <span class="up-btn area-btn-public"></span>
            上架
          </div>
          <div @click="shelfCourse(multipleSelection, 'down')">
            <span class="up-btn area-btn-public"></span>
            下架
          </div>
          <!-- <div @click="dialogFormVisible = true">
            <span class="category-btn area-btn-public"></span>
            分类
          </div> -->
        </div>
        <!-- 分页区域 -->
        <div class="pagination-area">
          <span>共{{ total }}条</span>
          <!-- 分页器 -->
          <div class="el-pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="page"
              :page-size.sync="page_size"
              layout="prev, pager, next, jumper"
              :total.sync="total"
              hide-on-single-page
            >
              <!-- 报错出现在这里:total.sync="total" -->
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 选择单节课还是系列课进入编辑界面 -->

    <!-- 头部右侧取消按钮 -->
    <!-- 单节课多节课的选项按钮 -->
    <el-dialog :visible.sync="dialogVisible">
      <span style="padding: 30px 85px">请选择您要新增的课程类别</span>

      <span slot="footer" class="dialog-footer">
        <router-link to="/addSingleClassPages">
          <el-button @click="dialogVisible = false">单节课</el-button>
        </router-link>
        <router-link to="/addMoreClassPages">
          <el-button type="primary" @click="dialogVisible = false"
            >系列课</el-button
          >
        </router-link>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import controlComponents from "@/components/control/control-components.vue";
export default {
  components: { controlComponents },
  data() {
    return {
      courseCate: {},
      classification: true,
      input: "",
      //课程属性
      options2: [
        {
          value: "1",
          label: "单节课",
        },
        {
          value: "2",
          label: "系列课",
        },
      ],
      courseAttritube: "",
      //类目
      courseCategory: "",
      //推荐位
      options4: [
        {
          value: "1",
          label: "精品课程",
        },
        {
          value: "0",
          label: "其他推位",
        },
      ],
      courseRecommend: "",
      //上下架状态
      options5: [
        {
          value: "3",
          label: "上架",
        },
        {
          value: "1",
          label: "上架中",
        },
        {
          value: "0",
          label: "下架",
        },
      ],
      multipleSelection: [],
      courseState: "", //课程状态
      videoShade: false, //点击封面预览弹出层字段
      videoShadeSource: "", //点击封面预览传进去的视频资源路径
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      courseNewAdd: "",
      courseAfterAdd: "",
      checked: false,
      // checkedList:[],
      // 课程列表请求字段
      id: "",
      title: "",
      attribute: "",
      cate: "",
      posid: "",
      status: "",
      time_add: "",
      time_update: "",
      page: 1,
      page_size: 8,
      prop: "",
      order: "",
      is_download: "",
      listform: [],
      total: 0,
      dialogVisible: false,
      srcList: [],
      loading: false,
      operation: "", // 上架或下架
    };
  },
  watch: {},
  mounted() {
    //默认请求第一页的数据
    this.getSearchList();
    // 获取课程分类的数据
    this.courseCate = JSON.parse(localStorage.getItem("courseCate"));
  },
  methods: {
    handleSizeChange() {
    },
    //此处是做分页数据的处理，点击分页后展示不同的数据
    handleCurrentChange(val) {
      this.page = val
        this.getSearchList();
      
    },
    // 默认请求第一页的数据列表
    getSearchList() {
      this.loading = true;
      this.$http
        .post("/course/list", {
          id: this.id,
          title: this.title,
          attribute: this.attribute,
          cate: this.cate,
          posid: this.posid,
          status: this.status,
          time_add: this.time_add,
          time_update: this.time_update,
          page: this.page,
          page_size: this.page_size,
          prop: this.prop,
          order: this.order,
          is_download: this.is_download,
        })
        .then((res) => {
          setTimeout(() => {
            this.loading = false;
          }, 500);
          this.clearList()
          this.listform = res.data.data.list;
          this.total = res.data.data.total;
        });
    },
    // 重置清除筛选条件的操作
    clearList() {
      this.title = "";
      this.attribute = "";
      this.cate = "";
      this.posid = "";
      this.status = "";
      this.courseNewAdd = "";
      this.courseAfterAdd = "";
    },
    //搜索做的操作
    searchListForm() {
      this.getSearchList();
    },
    //课程的删除操作
    deleteCourse(id) {
      this.$confirm("此操作将永久删除该文件,是否继续?", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.$http
            .post("/course/del", {
              id,
            })
            .then((res) => {
              //如果删除成功就重新获取列表数据即可
              if (res.data.message == "success") {
                this.getSearchList();
              }
            });
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    //表格中的上架
    shelves(id, status) {
      if (status == 3 || status == 1) {
        this.$message.error("这个视频正在上架中,请稍后再试");
        return;
      } else {
        this.$http
          .post("/course/shelves", {
            id,
            operation: "up",
          })
          .then((res) => {
            if (res.data.message == "success") {
              this.getSearchList();
            }
          });
      }
    },
    //预览视频推送
    pushVideo(id) {
      this.$router.push({
        path: "/broadPages",
        query: {
          course_id: id,
        },
      });
    },
    //大图预览的推送
    showImageSource(url) {
      // "process.env.VUE_APP_URL" +
      this.srcList.push(url);
    },
    //选择框中的值
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //删除课程
    deleteSelection(val) {
      if (val.length == 0) {
        this.$message.error("请选择后在进行操作");
      } else {
        this.$confirm("此操作将永久删除该文件,是否继续?", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        })
          .then(() => {
            this.multipleSelection.forEach((val) => {
              this.$http
                .post("/course/del", {
                  id: val.id,
                })
                .then((res) => {
                  if (res.data.code == 1) {
                    this.$message.success("删除成功");
                    this.getSearchList();
                  }
                });
            });
          })
          .catch(() => {
            this.$message.info("已取消删除");
          });
      }
    },
    //下架课程
    shelfCourse(val, option) {
      if (option == "up") {
        this.operation = "up";
      } else {
        this.operation = "down";
      }
      if (val.length == 0) {
        this.$message.error("请选择后在进行操作");
      } else {
        this.multipleSelection.forEach((val) => {
          this.$http
            .post("/course/shelves", {
              id: val.id,
              operation: this.operation,
            })
            .then((res) => {
              if (res.data.code == 1) {
                this.getSearchList();
              } else {
                this.$message.error("操作有误，请重试");
              }
            });
        });
      }
    },
  },
};
</script>

<style scoped>
.input-area {
  position: relative;
  margin-left: 216px;
  margin-top: 16px;
  width: 1688px;
  height: 231px;
  background: #fff;
  border-radius: 8px;
}
.public {
  width: 324px;
  height: 62px;
}
h3 {
  position: absolute;
  left: 16px;
  top: 16px;
}
.time-add {
  width: 100%;
}
.time-Modify {
  width: 100%;
}
.icon-public {
  width: 14px;
  height: 14px;
  margin-left: 16px;
  margin-top: 9px;
}
.input-public {
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
.ID {
  position: absolute;
  left: 16px;
  top: 73px;
}
.ID input {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.attribute {
  position: absolute;
  left: 460px;
  top: 73px;
}
.category {
  position: absolute;
  left: 904px;
  top: 73px;
}
.recommended {
  position: absolute;
  left: 1348px;
  top: 73px;
}
.time-add {
  position: absolute;
  left: 16px;
  top: 153px;
}
.time-Modify {
  position: absolute;
  left: 460px;
  top: 153px;
}
.Up-Down {
  position: absolute;
  left: 904px;
  top: 153px;
}
.btn-clear {
  position: absolute;
  left: 1348px;
  top: 183px;
  width: 110px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
}
.clear {
  background-image: url("@/assets/Course-Management/10.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.btn-clear span {
  display: block;
  position: absolute;
  left: 38px;
  top: 4px;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  color: #606266;
}
.btn-search {
  position: absolute;
  left: 1477px;
  top: 183px;
  width: 82px;
  height: 32px;
  background: #2ab18b;
  border-radius: 4px 4px 4px 4px;
  cursor: pointer;
}
.btn-search span {
  display: block;
  height: 24px;
  line-height: 24px;
  position: absolute;
  left: 38px;
  top: 4px;
  font-size: 14px;
  color: #fff;
}
.search {
  background-image: url("@/assets/Course-Management/11.png");
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
.show-area {
  width: 1643px;
  height: 738px;
  margin-top: 20px;
  margin-left: 20px;
  border-radius: 4px;
  /* border: 1px solid #dcdfe6; */
  border-radius: 4px;
  text-align: center;
}
.show-area-head {
  display: flex;
  width: 100%;
  height: 82px;
  background: #dcdfe6;
}
.show-area-head-public {
  height: 100%;
  font-size: 14px;
  color: #909399;
  text-align: center;
}
.choose-all {
  width: 48px;
}
.id-num {
  width: 75px;
}
.video-url {
  width: 64px;
}
.viedo-banner {
  width: 126px;
}
.video-title {
  width: 266px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.class-attritube {
  width: 82px;
}
.class-type {
  width: 82px;
}
.class-recommended {
  width: 114px;
}
.study-man {
  width: 98px;
}
.study-woman {
  width: 98px;
}
.new-time {
  width: 162px;
}
.shelves {
  width: 100px;
}
.Modify {
  width: 162px;
}
.operation {
  width: 166px;
}
.operation span {
  color: #409eff;
  margin-right: 11px;
  cursor: pointer;
}
.show-area-content {
  display: flex;
  width: 100%;
  height: 82px;
  background: #fff;
  border: 1px solid #dcdfe6;
}
.pagination {
  width: 1643px;
  height: 72px;
  margin-left: 20px;
  margin-top: 30px;
}
.btn-area {
  display: flex;
  width: 450px;
  height: 32px;
  justify-content: space-evenly;
  cursor: pointer;
}
.btn-area div {
  width: 82px;
  height: 100%;
  background: #fff;
  border: 1px solid #f0f2f5;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  line-height: 32px;
}
.btn-area div:nth-child(1) {
  background: #2ab18b;
  color: #fff;
}
.btn-area div:nth-child(2) {
  background: #f56c6c;
  color: #fff;
}
.btn-area div:nth-child(3) {
  background: #dcdfe6;
  color: #606266;
}
.btn-area div:nth-child(4) {
  background: #dcdfe6;
  color: #606266;
}
.btn-area div:nth-child(5) {
  background: #dcdfe6;
  color: #606266;
}
.area-btn-public {
  display: inline-block;
  width: 14px;
  height: 14px;
}
.add-btn {
  background-image: url("@/assets/Course-Management/9.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.del-btn {
  background-image: url("@/assets/Course-Management/5.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.up-btn {
  background-image: url("@/assets/Course-Management/12.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.category-btn {
  background-image: url("@/assets/Course-Management/2.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.pagination-area {
  position: absolute;
  left: 1065px;
  bottom: 40px;
  width: 600px;
  height: 32px;
  font-size: 14px;
  color: #606266;
  line-height: 32px;
}
.el-pagination {
  position: absolute;
  left: 40px;
  top: 0;
  width: 439px;
  height: 100%;
}
.small-attitube1 {
  width: 51px;
  height: 22px;
  background-image: url("@/assets/Course-Management/13.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin: 0 auto;
}
.small-attitube2 {
  width: 51px;
  height: 22px;
  background-image: url("@/assets/Course-Management/14.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin: 0 auto;
}
.small-attitube3 {
  width: 51px;
  height: 22px;
  background-image: url("@/assets/Course-Management/15.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin: 0 auto;
}
.viedo-banner-png {
  width: 106px;
  height: 53px;
  margin-top: 15px;
  margin-left: 10px;
}
.date-picker {
  width: 324px;
  height: 32px;
  /* margin-top: 8px; */
}
.delTextraction {
  text-decoration: none;
}
.select-singleormixed {
  position: absolute;
  top: 30%;
  left: 40%;
  width: 500px;
  height: 300px;
  background: pink;
}
.add-button {
  font-size: 14px;
  color: #fff;
  line-height: 8px;
}
.preview:hover {
  color: #2ab18b;
}
</style>
<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
*::-webkit-scrollbar {
  display: none;
}
body {
  width: 100%;
  height: 100%;
  background: #f0f2f5;
}
.el-date-range-picker__time-header {
  display: none;
}
.el-input__inner {
  border-radius: 8px;
}
.el-dialog {
  width: 20%;
  border-radius: 10px;
}
.el-dialog_body {
  padding: 0;
  text-align: center;
}
.el-dialog__footer {
  text-align: center;
  padding: 10px 20px 15px;
}
.el-button--default {
  margin-right: 20px;
}
.el-table thead {
  height: 82px;
  background: #dcdfe6;
}
.el-table tr {
  height: 82px;
}
.el-table .cell {
  text-align: center;
  padding-left: 0;
  /* white-space: nowrap; */
}
.el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: hidden;
}
.el-table th.el-table__cell > .cell {
  padding-left: 0;
}
.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #2ab18b;
  border-color: #2ab18b;
}
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background: #fff;
  border-color: #e4e7ed;
}
.el-image-viewer__prev {
  display: none;
}
.el-image-viewer__next {
  display: none;
}
</style>
