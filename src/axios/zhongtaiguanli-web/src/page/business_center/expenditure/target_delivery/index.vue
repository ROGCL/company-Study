<template>
  <div>
    <!-- 筛选项 -->
    <FilterLayout
      :key="FilterLayoutkey"
      v-model="searchForm"
      @onSubmit="onSubmit"
      width="100px"
      :mdSpan="6"
      :flexFlag="true"
    >
      <div class="component_title2">筛选项</div>
      <el-col :md="8" :sm="12">
        <el-form-item label="目标时间">
          <dataPicker
            clearFlag
            :datevalue.sync="searchForm.target_time"
          ></dataPicker>
        </el-form-item>
      </el-col>
      <el-col :md="8" :sm="12">
        <el-form-item label="投放平台" prop="platform">
          <!-- <el-cascader
            v-model="searchForm.invest_channel"
            clearable
            collapse-tags
            :options="Invest_channel"
            style="width: 100%"
            :props="{ value: 'id', label: 'title', multiple: true }"
          ></el-cascader> -->
          <SelectChannel :optionsList="Invest_channel" paramFlag v-model="searchForm.invest_channel"></SelectChannel>
        </el-form-item>
      </el-col>
      <el-col :md="8" :sm="12">
        <el-form-item label="渠道负责人" prop="system">
          <el-select
            v-model="searchForm.admin_id"
            placeholder="请选择"
            clearable
            multiple
            collapse-tags
            filterable
          >
            <el-option
              v-for="item in allAdmin"
              :key="item.id"
              :label="item.realname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="8" :sm="12">
        <el-form-item label="应用" prop="appid">
          <SelectCustomize :value="searchForm.appid" :data="apps" />
        </el-form-item>
      </el-col>
      <el-col :md="8" :sm="12">
        <el-form-item label="目标添加人" prop="system">
          <el-select
            v-model="searchForm.target_admin"
            placeholder="请选择"
            clearable
            multiple
            collapse-tags
            filterable
          >
            <el-option
              v-for="item in allAdmin"
              :key="item.id"
              :label="item.realname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="8" :sm="12">
        <el-form-item label="添加时间">
          <dataPicker
            clearFlag
            :datevalue.sync="searchForm.create_time"
            ref="dataPicker"
          ></dataPicker>
        </el-form-item>
      </el-col>
      <el-button @click="initFrom"> 重置</el-button>
      <el-button slot="more_option" type="primary" @click="add">新增</el-button>
      <el-button slot="more_option" type="primary" @click="uploadClick"
        >批量上传</el-button
      >
    </FilterLayout>

    <!-- 数据报表 -->
    <TableLayout
      :column="column"
      :data="tableData.data"
      :total="tableData.total"
      :loading="tableData.loading"
      :currentPage="tableData.currentPage"
      alignStyle="center"
      author="liuqiang"
      leadApi="Operate_Invest/lists"
      @sizeChange="onSizeChange"
      @pageChange="onPageChange"
      ref="TableLayout"
    >
      <div class="component_title" slot="title">数据报表</div>
      <template #target_roi="{ row }"> {{ row.target_roi }}% </template>
      <template #operate="{ row }">
        <div>
          <el-link type="primary" style="margin-right: 20px" @click="edit(row)"
            >修改</el-link
          >
          <el-link type="danger" @click="del(row.id)">删除</el-link>
        </div>
      </template>
    </TableLayout>

    <!-- 新增或者修改 -->
    <el-dialog
      :title="`投放目标${type == 1 ? '新增' : '编辑'}`"
      :visible.sync="dialogFormVisible"
      width="400px"
      v-loading="add_loading"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addForm"
        :rules="rules"
        ref="ruleForm"
        :key="FilterLayoutkey"
      >
        <el-form-item
          label="开始时间"
          label-width="100px"
          required
          prop="time_begin"
        >
          <el-date-picker
            :disabled="type == 1 ? false : true"
            @change="dateChange($event, 1)"
            v-model="addForm.time_begin"
            type="date"
            placeholder="选择日期"
            class="input"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="结束时间"
          label-width="100px"
          required
          prop="time_end"
        >
          <el-date-picker
            :disabled="type == 1 ? false : true"
            @change="dateChange($event, 2)"
            v-model="addForm.time_end"
            type="date"
            placeholder="选择日期"
            class="input"
          >
          </el-date-picker>
        </el-form-item>
        <!-- 这里是二级目录 -->
        <el-form-item
          label="投放平台"
          label-width="100px"
          required
          prop="invest_channel_id"
        >
          <el-cascader
            v-model="addForm.invest_channel_id"
            :options="Invest_channel"
            class="input"
            :props="{ value: 'id', label: 'title' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="渠道负责人"
          label-width="100px"
          required
          prop="admin_id"
        >
          <el-select
            v-model="addForm.admin_id"
            placeholder="请选择"
            clearable
            class="input"
          >
            <el-option
              v-for="item in allAdmin"
              :key="item.id"
              :label="item.realname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="应用" label-width="100px" required prop="app_id">
          <el-select
            v-model="addForm.app_id"
            placeholder="请选择"
            clearable
            class="input"
          >
            <el-option
              v-for="item in apps"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消耗目标" label-width="100px">
          <div class="form-item-div">
            <el-input
              onkeyup="value=value.replace(/[^\x00-\xff]/g, '')"
              v-model="addForm.target_amount"
              autocomplete="off"
              class="input"
            ></el-input>
            <span> （元） </span>
          </div>
        </el-form-item>
        <el-form-item label="回收目标" label-width="100px">
          <div class="form-item-div">
            <el-input
              onkeyup="value=value.replace(/[^\x00-\xff]/g, '')"
              v-model="addForm.target_recycling"
              autocomplete="off"
              class="input"
            ></el-input>
            <span> （元） </span>
          </div>
        </el-form-item>
        <el-form-item label="新增目标" label-width="100px">
          <el-input
            onkeyup="value=value.replace(/[^\x00-\xff]/g, '')"
            v-model="addForm.target_device_new"
            autocomplete="off"
            class="input"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单量目标" label-width="100px">
          <el-input
            onkeyup="value=value.replace(/[^\x00-\xff]/g, '')"
            v-model="addForm.target_order_num"
            autocomplete="off"
            class="input"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleConfirm"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 批量上传 -->
    <el-dialog
      title="目标批量上传"
      :visible.sync="uploadVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-upload
        class="upload-demo"
        :file-list="fileList"
        accept=".xls, .xlsx, .docx"
        name="excel"
        drag
        :on-change="uploadchange"
        @before-upload="beforeUpload"
        :auto-upload="false"
        multiple
        ref="upload"
        :data="uploadParams"
        :action="uploadUrl2"
        :on-success="onSuccess"
        :on-error="onError"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          支持扩展名：.xls .xlsx .docx
        </div>
      </el-upload>

      <div class="btn-box">
        <el-button type="primary" @click="submitUpload">确定</el-button>
        <el-button
          type="primary"
          @click="
            onDown(
              'http://madmin.cqdingyan.com/download/%E6%8A%95%E6%94%BE%E7%9B%AE%E6%A0%87%E6%A8%A1%E6%9D%BF.xlsx'
            )
          "
          >下载上传模板</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { myMixins } from "./mixin/index.js";
import FilterLayout from "@/layout/form";
import TableLayout from "@/layout/table";
import SelectCustomize from "@/component/select-customize";
import SelectChannel from "@/component/select-channel";
import moment from "moment";
import store from "store2";
import _ from "lodash";
import axios from "axios";
export default {
  mixins: [myMixins],
  components: {
    FilterLayout,
    TableLayout,
    SelectCustomize,
    SelectChannel
  },
  data() {
    return {
      apps: [],
      FilterLayoutkey: 1,
      add_loading: false,
      uploadVisible: false,
      dialogFormVisible: false,
      type: 1, // 1 新增 2 编辑
      searchForm: {
        appid: {
          appInfo: [],
        },
        // 目标时间
        target_time: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
        // 添加时间
        create_time: [],
        admin_id: [],
        invest_channel: [],
        target_admin: [],
      },
      uploadUrl2: `${process.env.VUE_APP_PROXY_KEY}/File/uploadTarget`,
      uploadParams: {
        appId: this.$route.query.appId,
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
      },
      addForm: {
        app_id: "",
        time_begin: "",
        time_end: "",
        invest_channel_id: "",
        admin_id: "",
        target_amount: "",
        target_recycling: "",
        target_device_new: "",
        target_order_num: "",
      },
      rules: {
        time_begin: [
          { required: true, message: "请选择开始时间", trigger: "blur" },
        ],
        time_end: [
          { required: true, message: "请选择结束时间", trigger: "blur" },
        ],
        invest_channel_id: [
          {
            required: true,
            message: "请选择投放平台",
            trigger: ["change", "blur"],
          },
        ],
        app_id: [
          {
            required: true,
            message: "请选择应用",
            trigger: ["change", "blur"],
          },
        ],
        admin_id: [
          {
            required: true,
            message: "请选择渠道负责人",
            trigger: ["change", "blur"],
          },
        ],
      },

      tableData: {
        data: [],
        total: 0,
        currentPage: 1,
        pageSize: 10,
        loading: false,
      },
      Invest_channel: [],
      fileList: [],
      allAdmin: [],
    };
  },
  created() {
    this.getList();
    this.getChannel();
    this.getAllAdmin();
    this.getRoleBtree();
  },
  watch:{
    'searchForm.invest_channel':{
      handler:function(val){
        this.searchForm.invest_channel = val
      },
      deep:true,
      immediate:true
    }
  },
  methods: {
    investChannelChange(val){
      console.log(val)
    },
    // 获取筛选项表单数据
    async getRoleBtree() {
      const [err, res] = await this.$http.post("System/roleBtree", {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
      });
      if (err) return;
      this.department_id = res.tree;
      let apps = [];
      res.list.forEach((item) => {
        if (item.title == "应用") {
          item.node.forEach((_item) => {
            if (_item.system == "1") {
              _item.title = _item.title + "_Android";
            } else if (_item.system == "2") {
              _item.title = _item.title + "_IOS";
            } else if (_item.system == "3") {
              _item.title = _item.title + "_微信小程序";
            }
          });
          apps = item.node;
        }
      });
      this.apps = apps;
    },

    onDown(url) {
      if (!url) return;
      let url_temp = `${url}?t=${new Date().getTime()}`;
      window.open(url_temp);
    },
    async getAllAdmin() {
      const [err, res] = await this.$http.post("Admin/getAllAdmin", {
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
      });
      if (err) return;
      this.allAdmin = res;
    },
    async getChannel() {
      const [err, res] = await this.$http.post(
        "Invest_Statistics/getInvestChannel",
        {
          loginId: store.get("user")["id"],
          loginToken: store.get("loginToken"),
        }
      );
      if (err) return;
      this.Invest_channel = res;
    },
    dateChange(data, type) {
      if (
        type == 1 &&
        !moment(data).isBefore(this.addForm.time_end) &&
        this.addForm.time_end
      ) {
        this.$message.warning("开始时间不能大于结束时间");
        this.addForm.time_begin = "";
      } else if (
        type == 2 &&
        !moment(data).isAfter(this.addForm.time_begin) &&
        this.addForm.time_begin
      ) {
        this.$message.warning("结束时间不能小于开始时间");
        this.addForm.time_end = "";
      }
    },
    // 格式化请求参数
    formatSearch(name) {
      let data = this.searchForm[name].appInfo.join()
        ? this.searchForm[name].appInfo.join()
        : undefined;
      return data;
    },
    async getList() {
      this.tableData.loading = true;
      let search_data = _.cloneDeep(this.searchForm);
      // if (search_data.invest_channel.length > 0) {
      //   let arr = [];
      //   search_data.invest_channel.forEach((el) => {
      //     console.log(el,'dsdas')
      //     arr.push(el[el.length - 1]);
      //   });
      //   search_data.invest_channel = arr;
      // }
      search_data.app_id = this.searchForm.appid.appInfo;
      let params = Object.assign({}, search_data, {
        pageSize: this.tableData.pageSize,
        currentPage: this.tableData.currentPage,
        loginId: store.get("user")["id"],
        loginToken: store.get("loginToken"),
      });
      delete params.appid;
      const [err, res] = await this.$http.post(
        "Invest_Statistics/targetList",
        params
      );
      this.tableData.loading = false;
      if (err) return;
      this.tableData.data = res.list;
      this.tableData.total = res.total;
    },

    dialogFormVisibleConfirm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          // 判断选填项
          const must_temp = [
            "target_amount",
            "target_roi",
            "target_cpi",
            "target_device_new",
            "target_order_num",
          ];
          let must_temp_arr = [];
          for (const key in this.addForm) {
            if (must_temp.indexOf(key) > -1 && this.addForm[key] == "") {
              must_temp_arr.push(true);
            }
          }
          if (must_temp_arr.length == must_temp.length) {
            return this.$message.warning("目标值至少填写一个！");
          }

          this.dialogFormVisible = false;
          let httpUrl = "Invest_Statistics/addTarget";
          if (this.type == 1) {
            httpUrl = "Invest_Statistics/addTarget";
          } else {
            httpUrl = "Invest_Statistics/updateTarget";
          }
          this.tableData.loading = true;
          let params = _.cloneDeep(this.addForm);
          params.invest_channel_id =
            params.invest_channel_id[params.invest_channel_id.length - 1];
          params.time_begin = moment(params.time_begin).format("YYYYMMDD");
          params.time_end = moment(params.time_end).format("YYYYMMDD");
          const [err, res] = await this.$http.post(httpUrl, params);
          if (err) {
            return (this.tableData.loading = false);
          }

          this.$message.success(this.type == 1 ? "新增成功！" : "修改成功！");
          this.tableData.currentPage = 1;
          this.getList();
        }
      });
    },
    initFrom() {
      this.FilterLayoutkey += 1;
      this.searchForm = {
        appid: {
          appInfo: [],
        },
        // 目标时间
        target_time: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
        // 添加时间
        create_time: [],
        admin_id: [],
        invest_channel: [],
        target_admin: [],
      };
    },
    onSubmit() {
      this.tableData.currentPage = 1;
      this.getList();
    },
    onPageChange(val) {
      this.tableData.currentPage = val;
      this.getList();
    },
    onSizeChange(current) {
      this.tableData.pageSize = current;
      this.getList();
    },
    onSuccess(e) {
      if (this.$refs["upload"]) {
        this.$refs["upload"].clearFiles();
      }
      if (e.code != 1) {
        this.$notify.error({
          title: "错误",
          message: e.msg,
        });
      } else {
        this.$message.success("上传成功");
        this.tableData.currentPage = 1;
        this.getList();
      }
    },
    onError() {
      this.$message.warning("上传错误，请重新尝试");
    },
    beforeUpload(e) {},
    uploadchange(file, fileList) {
      const type = ".xls, .xlsx, .docx";
      const files = file.name.split(".");
      const attr = files.pop();
      if (type.indexOf(attr) < 0) {
        this.$message.warning("请选择正确格式文件");
        const index = fileList.findIndex((el) => el.name == file.name);
        if (index > -1) {
          fileList.splice(index, 1);
          this.fileList = fileList;
        }
        return;
      }
    },
    uploadClick() {
      this.uploadVisible = true;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    add() {
      this.FilterLayoutkey += 1;
      this.type = 1;
      this.addForm = {
        time_begin: "",
        time_end: "",
        app_id: "",
        invest_channel_id: "",
        admin_id: "",
        target_amount: "",
        target_roi: "",
        target_cpi: "",
        target_device_new: "",
        target_order_num: "",
      };
      setTimeout(() => {
        this.dialogFormVisible = true;
      }, 100);
    },
    edit(row) {
      this.FilterLayoutkey += 1;
      this.type = 2;
      this.dialogFormVisible = true;
      let {
        date_b,
        date_e,
        invest_channel_id,
        admin_id,
        target_amount,
        target_recycling,
        target_device_new,
        target_order_num,
        app_id,
      } = _.cloneDeep(row);
      this.Invest_channel.forEach((el) => {
        el.children.forEach((item) => {
          if (item.id == invest_channel_id) {
            invest_channel_id = [el.id, item.id];
          }
        });
      });

      this.addForm = {
        time_begin: moment(date_b).format("YYYY-MM-DD"),
        time_end: moment(date_e).format("YYYY-MM-DD"),
        invest_channel_id,
        admin_id,
        app_id: Number(app_id) ? app_id : "",
        target_amount,
        target_recycling,
        target_device_new,
        target_order_num,
        id: row.id,
      };
    },
    del(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        this.tableData.loading = true;
        const [err, res] = await this.$http.post(
          "Invest_Statistics/delTarget",
          { id }
        );
        if (err) {
          return (this.tableData.loading = false);
        }
        this.getList();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
  },
};
</script>

<style scoped>
.component_title {
  background: #fff;
  padding: 20px 0 10px 15px;
  font-weight: bold;
}

.form-item-div {
  display: flex;
  align-items: center;
}

.input {
  width: 200px;
}

.input2 {
  width: 290px;
}

.upload-demo {
  text-align: center;
}

.btn-box {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.component_title2 {
  background: #fff;
  padding: 1px 0 10px 15px;
  font-weight: bold;
}
</style>