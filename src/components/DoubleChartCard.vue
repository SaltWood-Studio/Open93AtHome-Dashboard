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
  title: {
    type: String,
    required: true,
  },
  units: {
    type: Array, // 单位数组，如 ['MB', '请求数']
    required: true,
  },
  data: {
    type: Array, // 数据格式为 [[值1_1, 值1_2], [值2_1, 值2_2], ...]
    required: true,
  },
  xAxis: {
    type: Array, // X轴数据，如 ['0时', '1时', '2时', ...]
    required: false,
    default: Array.from({ length: 24 }, (_, i) => `${i}时`)
  },
  colors: {
    type: Array, // 颜色数组，如 ['#5470C6', '#91CC75']
    required: false,
    default: ['#5470C6', '#91CC75']
  },
  areaColors: {
    type: Array, // 面积图颜色数组，如 ['rgba(29,105,150,0.3)', 'rgba(29,105,150,0.3)']
    required: false,
    default: ['rgba(29,105,150,0.3)', 'rgba(29,105,150,0.3)']
  },
});

const chartRef = ref(null);
const xAxis = ref(props.xAxis);

const initChart = () => {
    if (chartRef.value) {
        const myChart = echarts.init(chartRef.value);
  
        const xAxisData = xAxis.value; // X轴为0时到23时
  
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross', // 十字指示器
                },
                formatter: function (params) {
                    let result = `<b>${params[0].axisValue}</b><br/>`;
                    params.forEach((param) => {
                        const unit = param.seriesName;
                        result += `<div style="color:${param.color};">${param.marker}${param.value} ${unit}</div>`;
                    });
                    return result;
                },
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
            },
            yAxis: [
                {
                    type: 'value',
                    name: props.units[0], // 左侧 Y 轴单位
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                          color: props.colors[0], // 左侧 Y 轴线颜色
                        },
                    },
                },
                {
                  type: 'value',
                  name: props.units[1], // 右侧 Y 轴单位
                  position: 'right',
                  axisLine: {
                    lineStyle: {
                      color: props.colors[1], // 右侧 Y 轴线颜色
                    },
                  },
                },
            ],
            series: [
                {
                    name: props.units[0], // 第一条折线的单位名
                    type: 'line',
                    data: props.data.map(item => item[0]), // 第一条折线数据
                    smooth: true,
                    yAxisIndex: 0, // 对应左侧 Y 轴
                    areaStyle: {
                      color: props.areaColors[0], // 第一条折线面积颜色
                    },
                    itemStyle: {
                      color: props.colors[0], // 第一条折线颜色
                    },
                },
                {
                    name: props.units[1], // 第二条折线的单位名
                    type: 'line',
                    data: props.data.map(item => item[1]), // 第二条折线数据
                    smooth: true,
                    yAxisIndex: 1, // 对应右侧 Y 轴
                    areaStyle: {
                        color: props.areaColors[1], // 第二条折线面积颜色
                    },
                    itemStyle: {
                        color: props.colors[1], // 第二条折线颜色
                    }
                },
            ],
        };
        myChart.setOption(option);
  }
};

onMounted(initChart);

watch(() => props.data, initChart);
</script>
