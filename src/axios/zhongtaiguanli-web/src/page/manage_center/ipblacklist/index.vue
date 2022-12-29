<template>
    <div class="ipblacklist">
        <h3>城市IP屏蔽</h3>
        <div class="tag-wrap">
            <el-tag :key="tag.id" v-for="tag in City_list" closable @close="deleteCityIp(tag)">{{ tag.name }}</el-tag>
            <el-button class="button-new-tag" size="small" @click="addTag">+ New</el-button>
        </div>
        <div class="ip-wrap">
            <div class="hd">
                <h3>单独IP屏蔽</h3>
                <el-button type="primary" class="add" @click="addIp">添加</el-button>
            </div>
            <div class="ip-list">
                <div class="ip-item" v-for="item in Ip_list" :key="item">
                    <p class="ip">{{ item }}</p>
                    <div class="btn" @click="deleteIp(item)">删除</div>
                </div>
            </div>
            <el-pagination class="pagination" background layout="prev, pager, next" :total="total" @current-change="PageChange"></el-pagination>
        </div>
        <div class="dialog-wrap">
            <AddDialog ref="AddDialog" @onSuccess="getCity_list" />
            <IpDialog ref="IPDialog"  @onSuccess="getIp_list"/>
        </div>
    </div>
</template>

<script>
import { App_ipblack_city_list, App_ipblack_ip_list, App_ipblack_city_delete, App_ipblck_ip_delete } from '@/config/api/index'
import AddDialog from './dialog'
import IpDialog from './ipdialog'
export default {
    data() {
        return {
            City_list: [],
            Ip_list: [],
            total: 0,
            currentPage: 1,
        };
    },
    created() {
        this.getCity_list();
        this.getIp_list();
    },
    methods: {
        getCity_list() {
            App_ipblack_city_list().then(res => {
                this.City_list = res[1].list.map(item => {
                    return {
                        ...item,
                        name: item.province + '-' + item.city
                    }
                })
            })
        },
        getIp_list() {
            App_ipblack_ip_list({ currentPage: this.currentPage }).then(res => {
                let { list, total } = res[1];
                this.Ip_list = list;
                this.total = total;
            })
        },
        deleteCityIp({ id }) {
            App_ipblack_city_delete({ id }).then(res => {
                if (res[2] == 1) {
                    this.$message({
                        message: res[3],
                        type: 'success'
                    });
                    this.getCity_list();
                }
            })
        },
        addTag() {
            this.$refs.AddDialog.$data.dialogVisible = true;
        },
        deleteIp(ip) {
            this.$confirm('确认删除此条黑名单IP吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                App_ipblck_ip_delete({ ip }).then(res => {
                    if (res[2] == 1) {
                        this.$message({
                            type: 'success',
                            message: res[3]
                        });
                        this.getIp_list();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res[3]
                        });
                    }
                })
            }).catch(() => {});
        },
        addIp() {
            this.$refs.IPDialog.$data.dialogVisible = true;
        },
        PageChange(currentPage) {
            this.currentPage = currentPage;
            this.getIp_list();
        }

    },
    components: {
        AddDialog,
        IpDialog
    }
}
</script>

<style lang='scss' scoped>
.ipblacklist {
    padding: 20px;
    background: #fff;
}

.tag-wrap {
    width: 500px;
    padding: 20px;
    border: 1px solid #eaeefb;
    border-radius: 3px;
}

.Ip_list {
    width: 500px;
}

.el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}

.ip-wrap {
    width: 500px;
    display: flex;
    flex-direction: column;
    justify-content: right;
    margin-top: 20px;
    .hd {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .add {
            width: 70px;
            height: 40px;
        }
    }
    .ip-list {
        margin-bottom: 20px;
        .ip-item {
            border: 1px solid #eaeefb;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            &:not(:first-child) {
                border-top: none;
            }
            .ip {
                font-size: 14px;
            }
            .btn {
                font-size: 12px;
                color: #409eff;
                cursor: pointer;
            }
        }
    }
    .pagination {
        text-align: right;
        padding: 0;
        /deep/ .btn-next {
            margin-right: 0;
        }
    }
}
</style>