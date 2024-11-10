<template>
  <v-card>
    <v-card-title class="font-weight-black">{{ title }}</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div ref="chartRef" style="width: 90%; height: 280px;"></div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

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
  xAxis: {
    type: Array,
    required: false,
    default: [],
  },
  color: {
    type: String,
    required: false,
    default: 'red',
  },
  areaColor: {
    type: String,
    required: false,
    default: 'rgba(255, 0, 0, 0.3)',
  },
});

const chartRef = ref(null);

const initChart = async () => {
  if (chartRef.value) {
    echarts.use([LineChart, TitleComponent, TooltipComponent, GridComponent, CanvasRenderer]);

    const myChart = echarts.init(chartRef.value);

    const today = new Date();
    let dates = props.xAxis;
    if (dates.length === 0) {
      dates = Array.from({ length: 15 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const day = date.getDate().toString();
        return `${day}日`;
      }).reverse();
    }

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
          return `<div style="color:${param.color};"><b>${param.name}</b></div>` + param.value + ' ' + props.chartunit;
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: props.chartData.reverse(),
          type: 'line',
          smooth: true,
          itemStyle: {
            color: props.color,
          },
          lineStyle: {
            width: 2
          },
          areaStyle: {
            color: props.areaColor
          }
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
