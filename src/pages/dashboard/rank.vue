<template>
  <AppBar>
    <v-row>
      <v-col cols="12">
        <v-card prepend-icon="mdi-trophy-variant">
          <template v-slot:title>
            <span class="font-weight-black">节点排行榜</span>
          </template>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="items"
              :items-per-page="10"
            >
            <template v-slot:item.rank="{ item }">
              <span class="font-weight-black">#{{ item.rank }}</span>
            </template>
            <template v-slot:item.isOnline="{ item }">
              <v-chip
                :color="item.isBanned ? 'shades' : (item.isOnline ? 'green' : 'red')"
                :prepend-icon="item.isBanned ? 'mdi-cancel' : (item.isOnline ? 'mdi-check' : 'mdi-close')"
                label
              >
              {{ item.isBanned ? '封禁' : (item.isOnline ? '在线' : '离线') }}
              </v-chip>
            </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </AppBar>
  <!-- Ray 和 浮杨 大佬保佑我 Dash 永不报错，永不出 Bug -->
</template>

<script>
import AppBar from '@/components/AppBar.vue';
import axios from 'axios';

export default {
  components: {
    AppBar,
  },
  data: () => ({
    headers: [
      { title: '节点名次', value: 'rank' },
      { title: '名称', value: 'name' },
      { title: '请求数', value: 'hits' },
      { title: '流量', value: 'bytes' },
      { title: '在线状态', value: 'isOnline' },
    ],
    items: [],
  }),
  methods: {
    formatBytes(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) return '0 Bytes';
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
    },
  },
  async created() {
    try {
      const response = await axios.get('/93AtHome/rank');
      this.items = response.data.map((item, index) => ({
        rank: index + 1,
        id: item.clusterId,
        name: item.clusterName,
        hits: item.hits !== null ? item.hits : 0,
        bytes: this.formatBytes(item.traffic !== null ? item.traffic : 0),
        isOnline: item.isOnline,
        isBanned: item.isBanned,
      }));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  },
};
</script>