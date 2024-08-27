<template>
  <v-card>
    <v-card-title class="font-weight-black">{{ title }}</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div ref="chartRef" style="height: 300px;"></div>
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
});

const chartRef = ref(null);

const initChart = () => {
  if (chartRef.value) {
    const myChart = echarts.init(chartRef.value);

    const option = {
      title: {
        text: props.title,
        subtext: props.subtitle,
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      tooltip: {
        trigger: 'axis',
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
