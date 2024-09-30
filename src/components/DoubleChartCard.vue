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
});

const chartRef = ref(null);

const initChart = () => {
    if (chartRef.value) {
        const myChart = echarts.init(chartRef.value);
  
        const xAxisData = Array.from({ length: 24 }, (_, i) => `${i}时`); // X轴为0时到23时
  
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
                          color: '#5470C6', // 左侧 Y 轴线颜色
                        },
                    },
                },
                {
                  type: 'value',
                  name: props.units[1], // 右侧 Y 轴单位
                  position: 'right',
                  axisLine: {
                    lineStyle: {
                      color: '#91CC75', // 右侧 Y 轴线颜色
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
                    lineStyle: {
                        color: '#5470C6', // 第一条折线颜色
                    },
                },
                {
                    name: props.units[1], // 第二条折线的单位名
                    type: 'line',
                    data: props.data.map(item => item[1]), // 第二条折线数据
                    smooth: true,
                    yAxisIndex: 1, // 对应右侧 Y 轴
                    lineStyle: {
                        color: '#91CC75', // 第二条折线颜色
                    },
                },
            ],
        };
        myChart.setOption(option);
  }
};

onMounted(initChart);

watch(() => props.data, initChart);
</script>
