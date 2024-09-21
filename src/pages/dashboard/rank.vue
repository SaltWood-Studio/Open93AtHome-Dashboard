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
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <!-- Ray 和 浮杨 大佬保佑我 Dash 永不报错，永不出 Bug -->
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const headers = ref([
  { title: '节点名次', value: 'rank' },
  { title: '名称', value: 'name' },
  { title: '请求数', value: 'hits' },
  { title: '流量', value: 'bytes' },
  { title: '节点拥有者', value: 'ownerName' },
  { title: '节点赞助商', value: 'sponsor' },
  { title: '节点类型', value: 'fullsize' },
  { title: '在线状态', value: 'isOnline' }
]);

const items = ref([]);

const formatBytes = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

onMounted(async () => {
  try {
    const response = await axios.get('/93AtHome/rank');
    items.value = response.data.map((item, index) => ({
      rank: index + 1,
      id: item.clusterId,
      name: item.clusterName,
      hits: item.hits !== null ? item.hits : 0,
      bytes: formatBytes(item.traffic !== null ? item.traffic : 0),
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
</script>

<route lang="yaml">
  meta:
    layout: appbar
</route>