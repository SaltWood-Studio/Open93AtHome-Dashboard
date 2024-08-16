<template>
  <v-app>
    <v-app-bar color="primary" app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>93Home-Dash</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <!-- 加个空白 -->
      <v-list-item>
        <v-row>
          <v-col cols="12">
            <div style="height: 15px;"></div>
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item link title="盐木是大佬"></v-list-item>
      <v-list-item link title="研磨是大佬"></v-list-item>
      <v-list-item link title="听风是大佬"></v-list-item>
      <v-list-item link title="天秀是大佬"></v-list-item>
      <v-list-item link title="Ray是巨佬"></v-list-item>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="6" lg="3" v-for="(chart, index) in charts" :key="index">
            <ChartCard :chart-id="index" :title="chart.title" :chart-data="chart.data" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ChartCard from './ChartCard.vue';

export default {
  components: {
    ChartCard,
  },
  data: () => ({
    drawer: false,
    charts: [
      { title: '当前在线节点', data: [120, 200, 150, 80, 70, 110, 130] },
      { title: '当前出网带宽', data: [90, 150, 200, 130, 100, 170, 120] },
      { title: '当日全网总流量', data: [300, 400, 350, 200, 150, 250, 300] },
      { title: '当日全网总请求数', data: [10, 20, 15, 8, 7, 11, 13] },
    ],
  }),
};
</script>

<style>
  .v-card {
    margin: 10px;
  }
</style>
