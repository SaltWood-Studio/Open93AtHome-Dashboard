<template>
  <v-card height="520px">
    <v-card-title
      :class="{ 'font-weight-black red-bg white-text': !isOnline, 'font-weight-black green-bg white-text': isOnline }">
      <v-row align="center" no-gutters>
        <v-col>
          <span>{{ clusterName }}</span>
        </v-col>
        <v-btn icon variant="text" @click="toCluster">
          <v-icon>mdi-cog</v-icon>
          <v-tooltip activator="parent" location="top">节点详情</v-tooltip>
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
          <v-text-field label="ID" :model-value="clusterId" readonly></v-text-field>
          <v-text-field label="Endpoint" :model-value="endPoint" readonly></v-text-field>
          <v-text-field label="上行速率" :model-value="bandwidth" readonly></v-text-field>

          <v-divider></v-divider>

          <v-row align="center" justify="space-between" class="mt-4">
            <v-col>
              <span class="node-type">节点类型</span>
            </v-col>
            <v-col class="text-right">
              <v-chip
                :class="fullsize ? 'blue-border blue-bg white-text' : 'blue-border white-bg blue-text'"
                :style="{ marginLeft: 'auto' }"
              >
                <strong>{{ fullsize ? '全量' : '分片' }}</strong>
              </v-chip>
            </v-col>
          </v-row>

          <v-text-field class="mt-5" label="创建日期" :model-value="createdAt" readonly></v-text-field>

        </v-tabs-window-item>

        <v-tabs-window-item key="1">
          <v-text-field label="名称" :model-value="sponsor" readonly></v-text-field>
          <v-text-field label="跳转链接" :model-value="sponsorUrl" readonly></v-text-field>
        </v-tabs-window-item>
      </v-tabs-window>

    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  // 迟早把这个改成传入数组（
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
  },
  sponsor: {
    type: Boolean,
    required: true,
  },
  sponsorUrl: {
    type: String,
    required: true,
  },
  fullsize: {
    type: Boolean,
    required: true,
  }
});

const activeTab = ref(0);
const router = useRouter();

const toCluster = () => {
  router.push({ path: `/dashboard/clusters/${props.clusterId}` });
};

</script>

<style scoped>
.red-bg {
  background-color: rgb(255, 61, 113);
}

.green-bg {
  background-color: rgb(0, 200, 134);
}

.white-text {
  color: white;
}

.blue-border {
  border: 1px solid rgb(51, 102, 255);
}

.blue-bg {
  background-color: rgb(51, 102, 255);
}

.white-bg {
  background-color: white;
}

.blue-text {
  color: rgb(51, 102, 255);
}

.node-type {
  font-size: 1.2em; /* 调整字体大小 */
  margin-right: 16px; /* 向右移动 */
}
</style>
