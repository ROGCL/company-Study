<template>
    <el-dialog title="新增屏蔽城市" :visible.sync="dialogVisible" width="30%">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="筛选城市">
                <region v-bind:region.sync="form.region" />
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit">保 存</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { App_ipblack_city_add_province } from '@/config/api/index'
import region from '@/component/select/region/region'
export default {
    data() {
        return {
            form: {
                region: []
            },
            dialogVisible: false
        };
    },
    methods: {
        submit() {
            App_ipblack_city_add_province({ province: this.form.region[0], city: this.form.region[1] }).then(res => {
                if (res[2] == '1') {
                    this.$message({
                        message: res[3],
                        type: 'success'
                    });
                    this.$emit('onSuccess');
                    this.dialogVisible = false;
                } else {
                    this.$message.error(res[0]);
                }
            })
        }
    },
    components: {
        region
    }
};
</script>