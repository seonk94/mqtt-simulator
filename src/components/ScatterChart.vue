<template>

    <div class="graph">
        <h3>Latency Graph</h3>
        <canvas ref="canvas" width="247" height="163" style="margin-top: 15px;"></canvas>
    </div>
</template>

<script>
    import { Scatter } from 'vue-chartjs'
    import VueCharts from 'vue-chartjs'
    export default {
        name: 'ScatterChart',
        props: ['topicArr', 'nowSeconds'],
        extends: Scatter,
        methods: {
            createChartData() {
                return {
                    datasets: [{
                        borderColor : '#6989ff',
                        borderWidth : 2,
                        fill : false,
                        label: 'latency',
                        pointRadius : 1,
                        data: this.getDatasets()
                    }]
                }
            },
            tooltipCallback : function(tooltipItem, data) {
                /* let label = data.datasets[tooltipItem.datasetIndex].label || '';
                return label + " : " + tooltipItem.yLabel + " " + this.$t('monitor.abdMoveUnit'); */
                return 'hi';
            },
            createChartOptions() {
                return {
                    responsive: false, 
                    animation: {
                        duration : 0
                    },
                    tooltips: {
                        enabled: false,
                        callbacks : {
                            label : this.tooltipCallback
                        }
                    },
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            type: 'time',
                            display: false,
                            bounds: 'ticks',
                            position: 'bottom',
                            time: {
                                max: ~~((new Date()).getTime() / 1000) + 15,
                                min: this.nowSeconds,
                                unit: 'second',
                                stepSize : 1
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                max: 20,
                                min: 0,
                                
                            },
                            gridLines : {
                                drawBorder : false,
                                lineWidth : 0.3,
                                zeroLineWidth : 0,
                                color : ['#ffffff', '#cecece', '#cecece', '#cecece', '#cecece', '#cecece', '#cecece']
                            }
                        }]
                    }
                }
            },
            getDatasets() {
                let dataList = [];
                if(this.topicArr) {
                    this.topicArr.forEach(ele => {
                        let temp = {
                            x: ele.seconds,
                            y: ele.latency
                        }
                        dataList = [ ...dataList, temp]
                    })
                }
                return dataList;
            }
        },
        mounted () {
            this.renderChart(this.createChartData(), this.createChartOptions())
        },
        watch: {
            topicArr () {
                this.renderChart(this.createChartData(), this.createChartOptions())
            }
        }
    }
</script>

<style scoped>

</style>