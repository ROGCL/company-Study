<template>
    <div class="log">
        <div class="filter">
            <FilterLayout v-model="form" @onSubmit="Search(1)">
                <el-col :md="12" :lg="7" :sm="24">
                    <el-form-item label="筛选时间">
                        <!-- <el-date-picker v-model="form.date" :picker-options="pickerOptions" value-format="yyyy-MM-dd" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker> -->
                         <dataPicker :datevalue.sync="form.date"></dataPicker>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="12">
                    <el-form-item label="搜索用户">
                        <el-select v-model="form.selectedUser" multiple filterable placeholder="请输入关键词">
                            <el-option v-for="item in users" :key="item.id" :label="item.realname" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :md="6" :sm="12">
                    <el-form-item label="筛选操作">
                        <el-select v-model="form.selectedHandles" multiple filterable placeholder="请输入关键词">
                            <el-option v-for="(item, index) in handles" :key="index" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </FilterLayout>
    
        </div>
        <div class="table">
            <el-table :data="tableData" border>
                <el-table-column prop="admin_name" label="用户">
                </el-table-column>
                <el-table-column prop="pathinfo" label="操作">
                </el-table-column>
                <el-table-column prop="login_ip" label="登录IP">
                </el-table-column>
                <el-table-column prop="create_time" label="时间">
                </el-table-column>
            </el-table>
            <el-pagination background :current-page="currentPage" layout="prev, pager, next" :total="total" style="margin-top:10px;" @current-change="currentChange">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import { system_adminUserList, system_operationList, system_operationLog } from '@/config/api/index'
import { pickerOptions } from "@/config/option";
import FilterLayout from '@/layout/form';
export default {
    data() {
        return {
            form: {
                date: [
                    moment().subtract(30, "d").format("YYYY-MM-DD"),
                    moment().format("YYYY-MM-DD"),
                ],
                selectedUser: [],
                selectedHandles: []
            },

            total: 0,
            pickerOptions,
            loading: false,
            users: [],

            handles: [],
            tableData: [],
            currentPage: 2,
        };
    },
    created() {
        this.getUsers();
        this.getHandles();
        this.Search();
    },
    methods: {
        getUsers() {
            system_adminUserList().then(res => {
                if (res[2] == 1) {
                    this.users = res[1];
                }
            })
        },
        getHandles() {
            system_operationList().then(res => {
                if (res[2] == 1) {
                    this.handles = res[1].map(item => {
                        return item = {
                            label: item,
                            value: item
                        }
                    });
                }
            })
        },
        currentChange(num) {
            this.Search(num);
        },
        Search(pageNum) {
            this.currentPage = pageNum;
            system_operationLog({
                currentPage: pageNum,
                time: this.form.date,
                admin_id: this.form.selectedUser,
                pathInfo: this.form.selectedHandles
            }).then(res => {
                if (res[2] == 1) {
                    let { current_page, data, per_page, last_page, personNum, total } = res[1];
                    this.tableData = data;
                    this.total = total / 2;
                }
            })
        }
    },
    components: {
        FilterLayout
    }
};
</script>

<style lang='scss' scoped>
.filter,
.table {
    background-color: #fff;
    padding: 20px;
}

.filter {
    display: flex;
    margin-bottom: 20px;
}

.table {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.date,
.search,
.select {
    display: flex;
    align-items: center;
    margin-right: 10px;
    .title {
        flex-shrink: 0;
        margin-right: 10px;
    }
}
</style>