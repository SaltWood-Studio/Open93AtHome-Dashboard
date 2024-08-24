<template>
    <AppBar>
      <v-row>
        <v-col cols="12" md="6" lg="3" v-for="(card, index) in cards" :key="index">
          <ClusterCard :clusterId="card.clusterId" :clusterName="card.clusterName" :endPoint="card.endPoint" />
        </v-col>
      </v-row>
    </AppBar>
    <!--Ray 和 浮杨 大佬保佑我 Dash 永不报错，永不出 Bug-->
  </template>
  
  <script>
  import AppBar from '@/components/AppBar.vue';
  import ClusterCard from '@/components/ClusterCard.vue';
  
  export default {
    components: {
      AppBar,
      ClusterCard,
    },
    data: () => ({
      cards: [
      { clusterId: '1', clusterName: '这是一个节点', endPoint: '1.4.5.1:1145'},
      { clusterId: '2', clusterName: '这是两个节点', endPoint: '1.4.5.1:1145'},
      { clusterId: '3', clusterName: '这是三个节点', endPoint: '1.4.5.1:1145'},
      { clusterId: '4', clusterName: '这是四个节点', endPoint: '1.4.5.1:1145'},
      { clusterId: '5', clusterName: '这是五个节点', endPoint: '1.4.5.1:1145'},
      { clusterId: '6', clusterName: '这是六个节点', endPoint: '1.4.5.1:1145'},
      { clusterId: '7', clusterName: '这是七个节点', endPoint: '1.4.5.1:1145'},

    ],
    }),
  };
  </script>