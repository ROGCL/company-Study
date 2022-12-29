<template>
    <div class="custom-add">
        <el-dialog title="新增预测" :visible.sync="dialogVisible" :before-close="handleClose" :close-on-click-modal="false"
            :close-on-press-escape="false" width="80%">
            <span slot="footer" class="dialog-footer">
                <el-button @click="computedData">计算</el-button>
                <el-button type="primary" @click="submit" :disabled="submitDislabel">保存数据</el-button>
            </span>
            <table style="width:100%">
                <thead>
                    <tr>
                        <th>时间</th>
                        <th>实际日活</th>
                        <th>预期每日新增</th>
                        <th v-for="(item,index) in five_days" :key="index">
                            <input class="th-input"
                                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                placeholder="多少天后" v-model.number="five_days[index]" />
                            <span style="margin-left: 10px">天后</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in list" :key="index">
                        <td>{{firstData.date}}</td>
                        <td>{{firstData.active}}</td>
                        <td>
                            <input style="width:70px;"
                                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                class="th-input" v-model.number="list[index].value" />
                        </td>
                        <td>{{item.dayOne}}</td>
                        <td>{{item.dayTwo}}</td>
                        <td>{{item.dayThree}}</td>
                        <td>{{item.dayFour}}</td>
                        <td>{{item.dayFive}}</td>
                        <div class="handle">
                            <div class="remove" v-if="index != list.length - 1 || index == list.length - 1"
                                @click="remove(index)">-</div>
                            <div class="add" v-if="index == list.length - 1" @click="add(index)">+</div>
                        </div>
                    </tr>
                </tbody>
            </table>
        </el-dialog>
    </div>
</template>

<script>
    import {
        Day_Active_Predict_getDayActiveDefaultValue,
        Day_Active_Predict_calculatorSave,
        Day_Active_Predict_calculatorCount
    } from '@/config/api/index'
    export default {
        name: "custom-add",
        data() {
            return {
                firstData: {},
                five_days: [7, 15, 30, 60, 90],
                list: [],
                dialogVisible: false,
                submitDislabel: true
            };
        },
        created() {

        },
        methods: {
            getDayActiveDefaultValue() {
                return Day_Active_Predict_getDayActiveDefaultValue().then(res => {
                    this.firstData = res[1];
                    this.list.push(res[1])
                })
            },
            handleClose(done) {
                done();
            },

            // 检测重复数据,分为add之前检测、和计算之前检测2种
            isRepeat({
                val,
                type
            }) {
                let check = true;
                switch (type) {
                    case 'add':
                        for (let i = 0; i < this.list.length - 1; i++) {
                            let {
                                value
                            } = this.list[i];
                            if (value == val) {
                                check = false;
                                this.$message({
                                    message: `${val}已经存在了哦`,
                                    type: 'warning'
                                });
                            }
                        }
                        break;
                    case 'all':
                        let data = [];
                        for (let i = 0; i < this.list.length; i++) {
                            let {
                                value
                            } = this.list[i];
                            value = String(value);
                            if (!data.includes(value)) {
                                data.push(value)
                            } else {
                                this.$message({
                                    message: '有重复数据，无法计算，请检查',
                                    type: 'error'
                                });
                                check = false;
                            }
                        }
                        break;
                }

                return check;
            },
            // 检测无效数据,分为add之前检测、和计算之前检测2种
            isInvalid({
                val,
                type
            }) {
                const noValORInvalidVal = 0;
                let isInvalid = true;
                switch (type) {
                    case 'add':
                        if (val == noValORInvalidVal || isNaN(val)) {
                            isInvalid = false;
                            this.$message({
                                message: '请输入有效值后再添加',
                                type: 'warning'
                            });
                        }
                        break;
                    case 'all':
                        for (let i = 0; i < this.list.length; i++) {
                            let {
                                value
                            } = this.list[i];
                            if (value == noValORInvalidVal || isNaN(value)) {
                                isInvalid = false;
                                this.$message({
                                    message: '数据有误，无法计算，请检查',
                                    type: 'error'
                                });
                                break;
                            }
                        }
                        break;
                }
                return isInvalid;
            },
            // 在新增之前要先判断当前输入的数据是否已经存在和输入的数据是否无效 ? 不能新增 : 允许新增;
            add(index) {
                let curVal = Number(this.list[index].value);
                let check = this.isRepeat({
                    val: curVal,
                    type: 'add'
                }) && this.isInvalid({
                    val: curVal,
                    type: 'add'
                });
                if (check) {
                    this.list.push({
                        value: 0,
                    });
                }
            },
            remove(index) {
                if (this.list.length != 1) {
                    this.list.splice(index, 1);
                } else {
                    this.$message({
                        message: '最后一条数据不能删除',
                        type: 'warning'
                    });
                }
            },
            // 在计算之前要先判断列表中是否有无效值和重复值
            computedData() {
                if (this.isInvalid({
                        type: 'all'
                    }) && this.isRepeat({
                        type: 'all'
                    })) {
                    let {
                        date,
                        active
                    } = this.firstData;
                    let info = this.list.map(({
                        value
                    }) => {
                        return {
                            date,
                            active,
                            value
                        }
                    })
                    //   计算...
                    this.list.forEach(item => {
                        item.dayOne = '...';
                        item.dayTwo = '...';
                        item.dayThree = '...';
                        item.dayFour = '...';
                        item.dayFive = '...';
                    })
                    let data = {
                        data: {
                            five_days: this.five_days,
                            info
                        }
                    };
                    Day_Active_Predict_calculatorCount(data).then(res => {
                        if (res[2] == 1) {
                            this.list = res[1];
                            // 让保存按钮可以点击
                            this.submitDislabel = false;
                        }
                    })
                }
            },
            submit() {
                let data = {
                    data: {
                        five_days: this.five_days,
                        info: this.list
                    }
                }
                Day_Active_Predict_calculatorSave(data).then(res => {
                    // 保存成功...
                    if (res[2] == 1) {
                        this.$message({
                            message: res[3],
                            type: 'success'
                        });
                    }
                    // 让父组件更新列表
                    this.$emit('submitOk');
                })
            }
        },
        watch: {
            async dialogVisible(newVal) {
                if (newVal) {
                    await this.getDayActiveDefaultValue()
                    // 如果数据长度发生改变则禁用保存按钮 等发送计算请求后才能恢复点击
                    this.$watch('list.length', (newVal) => {
                        this.submitDislabel = true;
                    })

                } else {
                    this.five_days = [1, 2, 3, 4, 5];
                    this.firstData = {};
                    this.list = [];
                    this.submitDislabel = true;
                }
            }
        }
    };
</script>

<style lang='scss' scoped>
    table {
        // width: 500px;
        border-spacing: 0;
        border-collapse: collapse;
    }

    td,
    th {
        border: 1px solid #ccc;
        padding: 5px 10px;
    }

    th {
        width: 140px;
        text-align: left;
    }

    /deep/ .el-dialog__body {
        display: flex;
        justify-content: center;
    }

    .th-input {
        width: 40px;
    }

    .handle {
        display: flex;

        .add,
        .remove {
            width: 20px;
            height: 20px;
            border: 2px solid #ccc;
            border-radius: 50%;
            text-align: center;
            color: #ccc;
            margin-top: 5px;
            margin-left: 10px;
            cursor: pointer;
        }

        .add {
            border-color: #409eff;
            color: #409eff;
        }

        .remove {
            line-height: 12px;
            border-color: #f56c6c;
            color: #f56c6c;
        }
    }
</style>