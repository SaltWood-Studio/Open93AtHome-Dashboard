<template>
  <v-row>
    <v-col cols="12">
      <v-card prepend-icon="mdi-trophy-variant">
        <template v-slot:title>
          <span class="font-weight-black">节点排行榜</span>
        </template>
        <v-card-text>
          <v-data-table :headers="headers" :items="items" :items-per-page="10">
            <template v-slot:item.rank="{ item }">
              <span class="font-weight-black">#{{ item.rank }}</span>
            </template>
            <template v-slot:item.sponsor="{ item }">
              <a :href="item.sponsorUrl">{{ item.sponsor }}</a>
            </template>
            <template v-slot:item.fullsize="{ item }">
              <v-chip :color="item.fullsize ? 'cyan' : 'orange'"
                :prepend-icon="item.fullsize ? 'mdi-database' : 'mdi-database-outline'" label>
                {{ item.fullsize ? '全量' : '分片' }}
              </v-chip>
            </template>
            <template v-slot:item.isOnline="{ item }">
              <v-chip :color="item.isBanned ? 'shades' : (item.isOnline ? 'green' : 'red')"
                :prepend-icon="item.isBanned ? 'mdi-cancel' : (item.isOnline ? 'mdi-check' : 'mdi-close')" label>
                {{ item.isBanned ? '封禁' : (item.isOnline ? '在线' : '离线') }}
              </v-chip>
            </template>
            <template v-slot:item.action="{ item }">
              <v-btn @click="openDialog(item.clusterId)" color="primary" small>查看统计</v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <!-- Ray 和 浮杨 大佬保佑我 Dash 永不报错，永不出 Bug -->
  <v-dialog v-model="dialog" max-width="1000px" @click:outside="closeDialog">
    <v-card>
      <v-card-title class="font-weight-black">统计数据</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <DoubleChartCard v-if="selectedClusterData" :title="selectedClusterTitle" :units="units" :data="selectedClusterData" :x-axis="xAxisData"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">关闭</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DoubleChartCard from '@/components/DoubleChartCard.vue';
import { Cluster } from '@/types/ClusterModel';

const headers = ref<{ title: string; value: string; sortable?: boolean }[]>([
  { title: '节点名次', value: 'rank' },
  { title: '名称', value: 'name' },
  { title: '请求数', value: 'hits' },
  { title: '流量', value: 'bytes' },
  { title: '节点拥有者', value: 'ownerName' },
  { title: '节点赞助商', value: 'sponsor' },
  { title: '节点类型', value: 'fullsize' },
  { title: '在线状态', value: 'isOnline' },
  { title: '操作', value: 'action', sortable: false }
]);

const units = ref<string[]>(["次", "Bytes"]);
const items = ref<Cluster[]>([]);
const dialog = ref<boolean>(false);  // 控制弹出窗口的显示与隐藏
const selectedClusterData = ref<number[][] | null>(null);  // 用于存储点击后的统计数据
const selectedClusterTitle = ref<string>('');  // 用于显示点击的节点名称
const xAxisData = ref<string[]>([]);  // 用于双图表的 x 轴数据

const formatBytes = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

function convertArrayElements(array: number[]): { converted: string[]; targetUnit: string } {
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

onMounted(async () => {
  try {
    const response = await axios.get('/api/clusters');
    items.value = response.data.map((item, index) => ({
      rank: index + 1,
      clusterId: item.clusterId,
      name: item.clusterName,
      hits: item.hits !== null ? item.hits : 0,
      bytes: formatBytes(item.bytes !== null ? item.bytes : 0),
      sponsor: item.sponsor,
      sponsorUrl: item.sponsorUrl,
      ownerName: item.ownerName,
      isOnline: item.isOnline,
      isBanned: item.isBanned,
      fullsize: item.fullsize
    }));
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});

const openDialog = async (clusterId: string): Promise<void> => {
  try {
    const response = await axios.get(`/api/stats/cluster/${clusterId}`);
    const hits = response.data.hits;
    const data = convertArrayElements(response.data.bytes);
    const bytes = data.converted;
    units.value[1] = data.targetUnit;
    selectedClusterData.value = hits.map((item: number, index: number) => [item, bytes[index]]);
    const cluster = items.value.find(item => item.clusterId === clusterId);
    selectedClusterTitle.value = cluster?.name || '';
    dialog.value = true;
    xAxisData.value = response.data.dates.map((item: string) => `${item.split('-').at(-1).replace(/^0+/, '')}日`);
  } catch (error) {
    console.error('Failed to fetch cluster statistics:', error);
  }
};

const closeDialog = (): void => {
  dialog.value = false;
};
</script>

<route lang="yaml">
  meta:
    layout: appbar
</route>
