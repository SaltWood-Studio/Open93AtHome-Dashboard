<template>
  <v-card>
    <v-card-title class="font-weight-black">{{ title }}</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div ref="chartRef" style="width: 90%; height: 280px;"></div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

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
    // 动态加载 ECharts 核心模块及相关组件
    const { use, init } = await import('echarts');
    const { LineChart } = await import('echarts/charts');
    const { TitleComponent, TooltipComponent, GridComponent } = await import('echarts/components');
    const { CanvasRenderer } = await import('echarts/renderers');

    // 注册所需要的组件和图表
    use([LineChart, TitleComponent, TooltipComponent, GridComponent, CanvasRenderer]);

    const myChart = init(chartRef.value);

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
