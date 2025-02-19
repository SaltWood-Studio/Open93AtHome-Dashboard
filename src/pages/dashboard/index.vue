<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-row>
          <v-col>
            <v-card-title class="font-weight-black text-h6">当前在线节点</v-card-title>
            <v-card-text class="font-weight-black text-h5">
              {{ onlines }} 个
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-title class="font-weight-black text-h6">当日全网总请求</v-card-title>
            <v-card-text class="font-weight-black text-h5">
              {{ todayHits }} 次
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-title class="font-weight-black text-h6">当日全网总流量</v-card-title>
            <v-card-text class="font-weight-black text-h5">
              {{ todayBytes }}
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-title class="font-weight-black text-h6">同步源数量</v-card-title>
            <v-card-text class="font-weight-black text-h5">
              {{ sourceCount }} 个
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-title class="font-weight-black text-h6">总文件数</v-card-title>
            <v-card-text class="font-weight-black text-h5">
              {{ totalFiles }} 个
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-title class="font-weight-black text-h6">总文件大小</v-card-title>
            <v-card-text class="font-weight-black text-h5">
              {{ totalSize }}
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-title class="font-weight-black text-h6">主控在线时间</v-card-title>
            <v-card-text class="font-weight-black text-h5">
              {{ uptime }}
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col cols="12" md="6" lg="6" v-for="(chart, index) in charts" :key="index">
      <AreaChartCard :chart-id="index" :title="chart.title" :subtitle="chart.subtitle" :chart-data="chart.data" :chartunit="chart.unit" :x-axis="chart.xAxis || []" :color="chart.color || undefined" :area-color="chart.areaColor || undefined"/>
    </v-col>
    <v-col cols="12" md="6" lg="6" v-for="(chart, index) in doubleCharts" :key="index">
      <DoubleChartCard :title="chart.title" :subtitle="chart.subtitle" :units="chart.units" :data="chart.data" :colors="chart.colors || undefined" :area-colors="chart.areaColors || undefined" />
    </v-col>
  </v-row>

  <v-container>
    <v-divider></v-divider>
      <br/>
      <v-row>
          <v-col class="text-center footer">
              <p>
                  本面板由 
                  <strong><a href="https://github.com/Mxmilu666" target="_blank" rel="noopener noreferrer">Mxmilu666</a></strong> 和 
                  <strong><a href="https://github.com/SALTWOOD" target="_blank" rel="noopener noreferrer">SALTWOOD</a></strong> 联合开发。
              </p>
              <p>
                  项目地址：<a href="https://github.com/SaltWood-Studio/Open93AtHome-Dashboard" target="_blank" rel="noopener noreferrer">GitHub</a> |
                  <a href="https://github.com/SaltWood-Studio/Open93AtHome-Dashboard/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT 协议</a>
              </p>
              <p>
                  版权所有 © 2024 Mxmilu & SALTWOOD
              </p>
          </v-col>
      </v-row>
  </v-container>
  <!-- Ray、浮杨和米露大佬保佑我 Dash 永不报错，永不出 Bug -->
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import axios from 'axios';
import DoubleChartCard from '@/components/DoubleChartCard.vue';
import AreaChartCard from '@/components/AreaChartCard.vue';
import { convertArrayElements, formatBytes, formatDuration } from '@/types/Utilities';

const elements = 15;
const uptime = ref<string>('');

interface Chart {
  title: string;
  subtitle: string;
  data: number[];
  unit: string;
  color?: string;
  areaColor?: string;
  xAxis?: string[];
}

const charts = ref<Chart[]>([
  { title: '全网流量', subtitle: '', data: Array(elements).fill(0), unit: '', color: "orange", areaColor: "rgba(255, 152, 0, 0.15)" },
  { title: '全网请求数', subtitle: '', data: Array(elements).fill(0), unit: '', color: "rgb(63, 81, 192)", areaColor: "rgba(63, 81, 192, 0.15)" },
  { title: '被拒绝请求趋势', subtitle: '', data: Array(24).fill(0), unit: '次', xAxis: Array.from({ length: 24 }, (_, index) => `${index}时`) },
]);

interface DoubleChart {
  title: string;
  subtitle: string;
  data: [number, number][];
  units: string[];
  colors: string[];
  areaColors: string[];
}

const doubleCharts = ref<DoubleChart[]>([
  { title: '今日请求/流量分布', subtitle: '', data: Array(24).fill(0).map(() => [0, 0]), units: [], colors: ["rgb(63, 81, 192)", "rgb(7, 200, 19)"], areaColors: ["rgba(63, 81, 192, 0.3)", "rgba(7, 200, 19, 0.3)"] },
]);

const todayHits = ref<string>('');
const todayBytes = ref<string>('');
const onlines = ref<string>('');
const sourceCount = ref<string>('');
const totalFiles = ref<string>('');
const totalSize = ref<string>('');
let uptimeInterval: number | undefined;

const getstatistics = async (): Promise<void> => {
  try {
    const statisticsResponse = await axios.get('/api/stats/center');
    todayHits.value = statisticsResponse.data.today.hits;
    todayBytes.value = formatBytes(statisticsResponse.data.today.bytes);

    // 上面的信息
    onlines.value = statisticsResponse.data.onlines;
    sourceCount.value = statisticsResponse.data.sources;
    totalFiles.value = statisticsResponse.data.totalFiles;
    totalSize.value = formatBytes(statisticsResponse.data.totalSize);
    uptime.value = formatDuration(statisticsResponse.data.startTime);
    
    uptimeInterval = setInterval(() => {
      uptime.value = formatDuration(statisticsResponse.data.startTime);
    }, 1000); // 每秒更新1次

    // 图表
    const hourlyHits = (statisticsResponse.data.hourly[0] || []).slice(0, 24);
    const hourlyBytes = convertArrayElements((statisticsResponse.data.hourly[1] || []).slice(0, 24));

    const dailyHits = (statisticsResponse.data.daily[0] || []).slice(0, elements);
    const dailyBytes = convertArrayElements((statisticsResponse.data.daily[1] || []).slice(0, elements));
    const rejected = statisticsResponse.data.rejected.slice(0, 24);

    charts.value[0].subtitle = `每日流量分布 (${dailyBytes.targetUnit})`;
    charts.value[0].data = dailyBytes.converted.map(Number);
    charts.value[0].unit = dailyBytes.targetUnit;

    charts.value[1].subtitle = "每日请求分布 (次)";
    charts.value[1].data = dailyHits;
    charts.value[1].unit = '次';

    charts.value[2].subtitle = "今日拒绝请求趋势 (次)";
    charts.value[2].data = rejected.reverse();
    charts.value[2].unit = '次';

    doubleCharts.value[0].subtitle = `今日请求/流量分布 (次/${hourlyBytes.targetUnit})`;
    doubleCharts.value[0].data = hourlyHits.map((value, index) => ([value, hourlyBytes.converted[index]]));
    doubleCharts.value[0].units = ["次", hourlyBytes.targetUnit];
  } catch (error) {
    console.error('Failed to get statistics:', error);
  }
};

onMounted(async () => {
  await getstatistics();
});

onBeforeUnmount(() => {
  if (uptimeInterval) {
    clearInterval(uptimeInterval);
    uptimeInterval = null;
  }
});
</script>

<style>
    .footer a:link {
        color: #007bff;
        text-decoration: none;
    }

    .footer a:visited {
        color: #0056b3;
    }

    .footer a:hover {
        color: #000000;
        text-decoration: underline;
    }

    .footer a:active {
        color: #003d80;
    }
</style>

<route lang="yaml">
  meta:
    layout: appbar
</route>
