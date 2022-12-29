<template>
    <div class="chartHeaderLoop">
        <p class="tt">渠道：{{channel}}</p>
        <div class="nums">
            <p class="tt" style="margin-right: 10px">合计：{{total}}</p>
            <p class="tt">平均：{{avg}}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'chartHeaderLoop',
    props: {
        channel: {
            type: [String, Number],
            default: ''
        },
        total: {
            type: [String, Number],
            default: 0
        },
        avg: {
            type: [String, Number],
            default: ''
        },

    },
}
</script>

<style lang='scss' scoped>
.chartHeaderLoop {
    float: right;
    margin: 0 40px 20px 0;
    * {
        margin: 0;
        padding: 0;
    }
    .tt {
        font-size: 12px;
        line-height: 1.7;
        &:not(:first-child) {
            color: rgba(125, 125, 125, 1);
        }
    }
    .nums {
        display: flex;
    }
}
</style>