<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-subtitle style="padding-bottom: 10px;">盐木可爱哈斯哈四</v-card-subtitle>
    <v-divider></v-divider>
    <v-card-text>
      <div :id="'chart' + chartId" style="height: 300px;"></div>
    </v-card-text>
  </v-card>
</template>

<script>
import * as echarts from 'echarts';

export default {
  props: {
    chartId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    chartData: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  methods: {
    initChart() {
      const chartDom = document.getElementById('chart' + this.chartId);
      if (chartDom) {
        const myChart = echarts.init(chartDom);

        const option = {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: this.chartData,
              type: 'line',
              smooth: true,
            },
          ],
        };

        myChart.setOption(option);
      } else {
        console.error(`Chart DOM with id chart${this.chartId} not found.`);
      }
    },
  },
};
</script>
