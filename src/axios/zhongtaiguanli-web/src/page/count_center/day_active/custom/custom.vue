<template>
    <div class="custom">
        <div class="table">
            <div class="hd">
                <h2 class="title">历史保存数据</h2>
                <el-button type="primary" size="small" @click="add">新增预测</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column fixed prop="id" label="序号" width="100"></el-table-column>
                <el-table-column prop="date" label="时间" width="200"></el-table-column>
                <el-table-column prop="add_titles" label="预测新增数量"></el-table-column>
                <el-table-column prop="five_days_titles" label="预测天数"></el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="viewDetail(scope.row)">查看</el-button>
                        <el-button type="text" size="small">
                            <el-popconfirm title="确认删除该条数据吗？" @onConfirm="onConfirm(scope.row.id)"><span
                                    slot="reference">删除</span></el-popconfirm>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="prev, pager, next" :total="total" @current-change="currentChange">
            </el-pagination>
        </div>
        <div class="Dialog-wrap">
            <!-- 新增预测Dialog -->
            <addComp ref="addComp" @submitOk="Day_Active_Predict_calculatorList" />
            <!-- 详情数据Dialog -->
            <viewDetail :details="details" :five_days="five_days" :detailDete="detailDete" ref="viewDetail" />
            <!-- <viewDetail ref="viewDetail"/> -->
        </div>
    </div>
</template>

<script>
    import {
        Day_Active_Predict_calculatorList,
        Day_Active_Predict_delete
    } from '@/config/api/index'
    import addComp from './add';
    import viewDetail from './viewDetail';
    export default {
        name: 'custom',
        data() {
            return {
                total: 0,
                tableData: [],
                five_days: [],
                detailDete: '',
                details: []
            }
        },
        created() {
            this.Day_Active_Predict_calculatorList();
        },
        methods: {
            Day_Active_Predict_calculatorList(currentPage = 1) {
                Day_Active_Predict_calculatorList({
                    currentPage
                }).then(res => {
                    let {
                        currentPage,
                        total,
                        list
                    } = res[1];
                    // this.currentPage = currentPage;
                    this.total = total;
                    this.tableData = list;
                })
            },
            // 新增数据
            add() {
                this.$refs.addComp.dialogVisible = true;
            },
            // 查看数据
            viewDetail({
                date,
                five_days,
                info
            }) {
                this.$refs.viewDetail.dialogVisible = true;
                this.detailDete = date;
                this.details = info.map(({
                    date,
                    active,
                    value,
                    day1_value,
                    day2_value,
                    day3_value,
                    day4_value,
                    day5_value
                }) => {
                    return {
                        date,
                        active,
                        value,
                        day1_value,
                        day2_value,
                        day3_value,
                        day4_value,
                        day5_value
                    }
                })
                this.five_days = five_days.map((item, index) => {
                    return {
                        prop: `day${index + 1}_value`,
                        label: item + '天后'

                    }
                })
            },
            // 删除数据
            onConfirm(id) {
                Day_Active_Predict_delete({
                    id
                }).then(res => {
                    this.Day_Active_Predict_calculatorList();
                })
            },
            // 分页
            currentChange(num) {
                this.Day_Active_Predict_calculatorList(num);
            }
        },
        components: {
            addComp,
            viewDetail
        }
    }
</script>

<style lang='scss' scoped>
    .table {
        padding: 20px;
        background: white;
        overflow: hidden;

        .hd {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;

            .title {
                font-size: 16px;
            }
        }

        .el-pagination {
            float: right;
            margin-top: 20px;
        }
    }
</style>