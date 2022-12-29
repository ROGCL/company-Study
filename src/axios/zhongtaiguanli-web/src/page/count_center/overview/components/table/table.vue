<template>
    <div class="table">
        <table style="margin: 0 auto;">
            <thead>
                <tr>
                    <th v-for="(item, index) in propsData.tableData[0]" :key="index">{{item}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in trs" :key="index">
                    <td v-for="(child_item, jndex) in item" :key="jndex" :style="{backgroundColor: `${child_item.color}`}">{{child_item.value}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import sectioncolor from '@/util/sectioncolor'
export default {
    props: ['propsData'],
    data() {
        return {
            trs: []
        }
    },
    created() {
        this.getTr();
    },
    methods: {
        getTr() {
            let { tableData } = this.propsData;
            let trs = [];
            for (let i = 1; i < tableData.length; i++) {
                let mapData = tableData[i].map((item, index) => {
                    if (index && item) {
                        return {
                            color: sectioncolor(item),
                            value: item
                        }
                    } else {
                        return {
                            value: item
                        }
                    }
                })
                trs.push(mapData)
            }
            this.trs = trs;
        }
    }
}
</script>

<style lang='scss' scoped>
table {
    margin-top: 10px;
    border-collapse: collapse;
    border-spacing: 0px;
    margin-bottom: 50px;
    thead tr th,
    tbody tr td {
        display: inline-block;
        width: 63px;
        height: 23px;
        line-height: 23px;
        text-align: center;
    }
    thead tr th {
        margin-right: 5px;
        font-size: 14px;
        margin-bottom: 5px;
    }
    tbody {
        tr {
            td {
                font-size: 12px;
                color: #fff;
                margin-bottom: 8px;
                &:not(:first-child) {
                    margin-left: 4.5px;
                    background: #F2F4F7;
                }
                &:first-child {
                    font-size: 14px;
                    color: #5A5C60;
                    margin-right: 8px;
                }
            }
        }
    }
}
</style>