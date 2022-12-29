<template>
    <div class="custom-view">
        <el-dialog :title="`${detailDete}预测数据查看`" :visible.sync="dialogVisible" :before-close="handleClose"
            :close-on-click-modal="false" :close-on-press-escape="false" width="60%">
            <!-- {{details}} -->
            <el-table :data="details" border style="width: 100%">
                <el-table-column prop="date" label="时间" width="180"></el-table-column>
                <el-table-column prop="active" label="实际日活" width="180"></el-table-column>
                <el-table-column prop="value" label="预测每日新增" width="180"></el-table-column>
                <el-table-column :prop="item.prop" :label="item.label" v-for="(item, index) in five_days" :key="index">
                </el-table-column>
                <!-- <el-table-column prop="dayTwo" label="2天"></el-table-column>
                <el-table-column prop="dayThree" label="3天"></el-table-column>
                <el-table-column prop="dayFour" label="4天"></el-table-column>
                <el-table-column prop="dayFive" label="5天"></el-table-column> -->
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "custom-view",
        props: {
            detailDete: {
                type: String,
                default: ''
            },
            five_days: {
                type: Array,
                default: () => []
            },
            details: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                dialogVisible: false
            };
        },
        created() {},
        mounted() {},
        methods: {
            handleClose(done) {
                done();
            },
        }
    };
</script>

<style lang='scss' scoped>

</style>