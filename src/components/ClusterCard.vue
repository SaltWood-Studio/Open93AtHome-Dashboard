<template>
  <v-card height="460px">
    <v-card-title class="font-weight-black red-bg white-text">
      {{ clusterName }}
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
    }
  },
  data() {
    return {
      activeTab: 0, // 初始激活的Tab
    };
  },
};
</script>

<style scoped>
.red-bg {
  background-color: rgb(255, 61, 113);
}

.white-text {
  color: white;
}
</style>
