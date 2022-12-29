<template>
    <el-dialog title="新增屏蔽IP" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
        <el-input type="textarea" class="textarea" :rows="10" placeholder="请输入内容" v-model="form.textarea"></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit">保 存</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { App_ipblack_ip_add } from '@/config/api/index'
import region from '@/component/select/region/region'
export default {
    data() {
        return {
            form: {
                textarea: ''
            },
            dialogVisible: false
        };
    },
    methods: {
        submit() {
            let regex = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
            let ip_list = this.form.textarea.split(/\n/);
            // 过滤换行符产生的数据
            ip_list = ip_list.filter(item => item);

            for (let i = 0; i < ip_list.length; i++) {
                let ip = ip_list[i];
                if(!regex.test(ip)) {
                    this.$message.error(`第${i + 1}条ip，不是有效ip`);
                    return
                }
            }
            
            App_ipblack_ip_add({ ips: ip_list }).then(res => {
                if (res[2] == 1) {
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