<template>
  <AppBar>
    <v-row>
      <v-col cols="12">
        <v-card title="Test114514" text="Test114514" />
      </v-col>
      <v-col cols="12" md="6" lg="3" v-for="(chart, index) in charts" :key="index">
        <ChartCard :chart-id="index" :title="chart.title" :subtitle="chart.subtitle" :chart-data="chart.data" />
      </v-col>
    </v-row>
  </AppBar>
  <!-- Ray 和 浮杨 大佬保佑我 Dash 永不报错，永不出 Bug -->
</template>

<script setup>
import { ref } from 'vue';
import ChartCard from '@/components/ChartCard.vue';

const charts = ref([
  { title: '当前在线节点', subtitle: '每小时在线节点（个）', data: [120, 200, 150, 80, 70, 110, 130] },
  { title: '当前出网带宽', subtitle: '平均每小时出网带宽（Mbps）', data: [90, 150, 200, 130, 100, 170, 120] },
  { title: '当日全网总流量', subtitle: '每小时流量分布（GiB）', data: [300, 400, 350, 200, 150, 250, 300] },
  { title: '当日全网总请求数', subtitle: '每小时请求分布（万）', data: [10, 20, 15, 8, 7, 11, 13] },
]);

</script>