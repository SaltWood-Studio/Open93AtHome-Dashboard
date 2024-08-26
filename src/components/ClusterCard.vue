<template>
  <v-card height="460px">
    <v-card-title 
      :class="{'font-weight-black red-bg white-text': !isOnline, 'font-weight-black green-bg white-text': isOnline}"
    >
    <v-row align="center" no-gutters>
      <v-col>
        <span>{{ clusterName }}</span>
      </v-col>
      <v-btn 
      icon
      variant="text"
      @click="toCluster"
      >
      <v-icon>mdi-cog</v-icon>
      <v-tooltip
        activator="parent"
        location="top"
      >节点详情</v-tooltip>
      </v-btn>
    </v-row>

    </v-card-title>

    <v-tabs v-model="activeTab" background-color="transparent" grow>
      <v-tab key="0">基本信息</v-tab>
      <v-tab key="1">赞助信息</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <v-card-text>
      <v-tabs-window v-model="activeTab">
        <v-tabs-window-item key="0">
          <v-text-field
            label="ID"
            :model-value= "clusterId"
            readonly
          ></v-text-field>
          <v-text-field
            label="Endpoint"
            :model-value= "endPoint"
            readonly
          ></v-text-field>
          <v-text-field
            label="上行速率"
            :model-value= "bandwidth"
            readonly
          ></v-text-field>

          <v-divider></v-divider>

          <v-text-field
            class="mt-5"
            label="创建日期"
            :model-value= "createdAt"
            readonly
          ></v-text-field>

        </v-tabs-window-item>

        <v-tabs-window-item key="1">
          <p>啦啦啦</p>
          <p>TODO..</p>
        </v-tabs-window-item>
      </v-tabs-window>

    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    clusterId: {
      type: String,
      required: true,
    },
    clusterName: {
      type: String,
      required: true,
    },
    endPoint: {
      type: String,
      required: true,
    },
    bandwidth: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
    isOnline: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return {
      activeTab: 0, // 初始激活的Tab
    };
  },
  methods: {
    toCluster() {
      this.$router.push({ path: `${this.$route.path}/${this.clusterId}` });
    },
  }
};
</script>

<style scoped>
.red-bg {
  background-color: rgb(255, 61, 113);
}

.green-bg {
  background-color: rgb(0,200,134);
}

.white-text {
  color: white;
}
</style>
