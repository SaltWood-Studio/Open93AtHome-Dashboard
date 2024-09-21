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
              {{ todayhits }} 次
            </v-card-text>
          </v-col>
          <v-col>
            <v-card-title class="font-weight-black text-h6">当日全网总流量</v-card-title>
            <v-card-text class="font-weight-black text-h5">
              {{ todaybytes }}
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
        </v-row>
      </v-card>
    </v-col>
    <v-col cols="12" md="6" lg="6" v-for="(chart, index) in charts" :key="index">
      <ChartCard :chart-id="index" :title="chart.title" :subtitle="chart.subtitle" :chartData="chart.data"
        :chartunit="chart.unit" />
    </v-col>
  </v-row>
  <!-- Ray 和 浮杨 大佬保佑我 Dash 永不报错，永不出 Bug -->
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ChartCard from '@/components/ChartCard.vue';
import axios from 'axios';

const charts = ref([
  { title: '全网流量', subtitle: '', data: Array(15).fill(0), unit: '' },
  { title: '全网请求数', subtitle: '', data: Array(15).fill(0), unit: '' },
]);

const todayhits = ref('');
const todaybytes = ref('');
const arraydata = ref({});
const onlines = ref('');
const sourceCount = ref('');
const totalFiles = ref('');
const totalSize = ref('');

const formataBytes = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

function convertArrayElements(array) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];

  // 找到数组中的最大字节值
  const maxBytes = Math.max(...array);

  // 根据最大字节值计算最适合的单位
  const maxIndex = Math.min(4, Math.floor(Math.log(maxBytes || 1) / Math.log(1024)));
  const targetUnit = units[maxIndex];

  // 转换每个字节值到统一的单位
  const convertedArray = array.map(byteValue => {
    const i = Math.min(maxIndex, Math.floor(Math.log(byteValue || 1) / Math.log(1024)));
    return (byteValue / Math.pow(1024, maxIndex)).toFixed(2);
  });

  return { converted: convertedArray, targetUnit };
}

const getstatistics = async () => {
  try {
    const statisticsResponse = await axios.get('/93AtHome/centerStatistics');
    arraydata.value = convertArrayElements(statisticsResponse.data.dailyBytes);

    charts.value[0].subtitle = `每日流量分布 (${arraydata.value.targetUnit})`;
    charts.value[0].data = arraydata.value.converted;
    charts.value[0].unit = arraydata.value.targetUnit;

    charts.value[1].subtitle = `每日请求分布 (次)`;
    charts.value[1].data = statisticsResponse.data.dailyHits;
    charts.value[1].unit = '次';

    todayhits.value = statisticsResponse.data.today.hits;
    todaybytes.value = formataBytes(statisticsResponse.data.today.bytes);
    onlines.value = statisticsResponse.data.onlines;
    sourceCount.value = statisticsResponse.data.sourceCount;

    // 新增总文件数和总文件大小
    totalFiles.value = statisticsResponse.data.totalFiles;
    totalSize.value = formataBytes(statisticsResponse.data.totalSize);
  } catch (error) {
    console.error("Failed to get statistics:", error);
  }
}

onMounted(async () => {
  getstatistics();
});
</script>

<route lang="yaml">
  meta:
    layout: appbar
</route>
