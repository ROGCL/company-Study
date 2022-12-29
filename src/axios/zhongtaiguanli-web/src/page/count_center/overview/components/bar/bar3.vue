<template>
    <div class="bar3">
        <div :id="id" style="width: 100%;height:270px;"></div>
    </div>
</template>

<script>
import echarts from 'echarts'
var arr = [];
for (let i = 0; i < 30; i++) {
    if (i === 0) {
        arr[0] = ['score', 'amount', 'product'];
    } else {
        arr[i] = [Math.random() * 100, Math.random() * 1000, `07-${i}`]
    }
}
export default {
    props: ['propsData'],
    mounted() {
        let data = this.propsData.dataset.source;
        var myChart = echarts.init(document.getElementById(this.id));
        // 指定图表的配置项和数据
        var option = {
            barWidth: 6,
            tooltip: {
            trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: {
                        color: 'rgba(150,150,150,0.1)'
                    }
                }
            },
            emphasis: {
                itemStyle: {
                    color: '#347FEF'
                }
            },
            dataset: {
                source: data
            },
            grid: {
                top: '10%',
                left: '3%',
                right: '4%',
                // bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                axisTick: {
                    lineStyle: {
                        opacity: '0'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#AEB6C1'
                    }
                }
            },
            yAxis: {
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                axisTick: {
                    lineStyle: {
                        opacity: '0'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#AEB6C1'
                    }
                }
            },
            series: [{
                type: 'bar',
                encode: {
                    // Map the "amount" column to X axis.
                    y: 'amount',
                    // Map the "product" column to Y axis
                    x: 'product'
                },
                itemStyle: {
                    color: '#7BB1ED'
                }
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    },
    computed: {
        id() {
            return Math.random();
        }
    }
}
</script>

<style scoped>
.bar3 {
    overflow: hidden;
}
</style>