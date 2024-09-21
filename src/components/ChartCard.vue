<template>
  <v-card>
    <v-card-title class="font-weight-black">{{ title }}</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div ref="chartRef" style="width: 90%; height: 300px;"></div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  chartId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  chartData: {
    type: Array,
    required: true,
  },
  chartunit: {
    type: String,
    required: true,
  },
});

const chartRef = ref(null);

const initChart = () => {
  if (chartRef.value) {
    const myChart = echarts.init(chartRef.value);

    const today = new Date();
    const dates = Array.from({ length: 15 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const day = date.getDate().toString();
      return `${day}日`;
    });

    const option = {
      title: {
        subtext: props.subtitle,
      },
      xAxis: {
        type: 'category',
        data: dates,
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          var param = params[0];
          return `<div style="color:${param.color};"><b>${param.name}</b></div>` + param.value +  " " +props.chartunit;
        }
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: props.chartData,
          type: 'line',
          smooth: true,
        },
      ],
    };

    myChart.setOption(option);
  } else {
    console.error('Chart DOM element not found.');
  }
};

onMounted(async () => {
  await initChart();
});

watch(() => props.chartData, async () => {
  await initChart();
});
</script>
