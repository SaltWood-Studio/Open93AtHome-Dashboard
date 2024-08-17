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
                  :color="item.isOnline ? 'green' : 'red'"
                  small
                  label
                >
                  {{ item.isOnline ? '在线' : '离线' }}
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
import AppBar from '../components/AppBar.vue';
import axios from 'axios';

export default {
  components: {
    AppBar,
  },
  data: () => ({
    headers: [
      { title: '节点名次', value: 'rank' },
      { title: '名称', value: 'name' },
      { title: '访问次数', value: 'hits' },
      { title: '传输字节数', value: 'bytes' },
      { title: '在线状态', value: 'isOnline' },
    ],
    items: [],
  }),
  async created() {
    try {
      const response = await axios.get('https://saltwood.top:9393/93AtHome/rank');
      this.items = response.data.map((item, index) => ({
        rank: index + 1,
        id: item.id,
        name: item.name,
        hits: item.hits,
        bytes: item.bytes,
        isOnline: item.isOnline,
      }));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  },
};
</script>