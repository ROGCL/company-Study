<template>
    <div :id="id" :style="size" style="background:#fff"></div>
</template>

<script>
import echarts from 'echarts'
export default {
    props: {
        id: {
            type: String
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '200px'
        },
        option: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data() {
        return {
            chart: null
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.chart = echarts.init(document.getElementById(this.id));
            this.chart.showLoading();
        }
    },
    watch: {
        option(newVal){
        // this.chart.clear();
        this.chart.setOption(newVal);
        newVal.loading ? this.chart.showLoading() : this.chart.hideLoading();
        }
    },
    computed: {
        size() {
            return {
                width: this.width,
                height: this.height
            }
        }
    }
}
</script>

<style>

</style>