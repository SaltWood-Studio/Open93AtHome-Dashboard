<template>
  <v-row>
    <v-col cols="12" md="8" lg="4" v-for="(card, index) in cards" :key="index">
      <ClusterCard :cluster="card"/>
    </v-col>

    <v-col cols="12" md="8" lg="4">
      <v-card height="520px">
        <v-container fluid class="d-flex justify-center align-center" style="height: 100%;">
          <v-card width="95%" height="95%" class="text-center" style="display: flex; 
              align-items: center; 
              justify-content: center;" variant="text" @click="showInput = true">
            <v-card-text>
              <v-icon icon="mdi-paperclip-plus" size="45"></v-icon>
              <h3>绑定节点</h3>
            </v-card-text>
          </v-card>
        </v-container>
      </v-card>
    </v-col>
  </v-row>

  <v-dialog v-model="showInput" max-width="500px">
    <v-card prepend-icon="mdi-paperclip" title="绑定节点">
      <v-card-text>
        <v-text-field v-model="clusterId" label="ClusterId" required></v-text-field>
        <v-text-field v-model="clusterSecret" label="ClusterSecret" required></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn text="取消" @click="cancel"/>
        <v-btn text="提交" @click="bindcluster"/>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="loading" max-width="320" persistent>
    <v-list color="primary" rounded="lg">
      <v-list-item prepend-icon="mdi-paperclip" title="绑定节点中..">
        <template v-slot:prepend>
          <div class="pe-4">
            <v-icon color="primary" size="x-large"></v-icon>
          </div>
        </template>

        <template v-slot:append>
          <v-progress-circular color="primary" indeterminate="disable-shrink" size="16" width="2"></v-progress-circular>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>

  <v-dialog v-model="successDialog" max-width="500px">
    <v-card prepend-icon="mdi-paperclip-check" title="绑定成功">
      <v-card-text>
        节点ID {{ clusterId }} 已绑定到您的账号上
      </v-card-text>
      <v-card-actions>
        <v-btn text="确认" @click="bindsuccess"/>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="errorDialog" max-width="500px">
    <v-card prepend-icon="mdi-paperclip-remove" title="绑定错误">
      <v-card-text>
        {{ failurerea }}
      </v-card-text>
      <v-card-actions>
        <v-btn text="确认" @click="cancel"/>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ClusterCard from '@/components/ClusterCard.vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Cluster } from '@/types/ClusterModel';
import { formatCreatedAt } from '@/types/Utilities';

const cards = ref<Cluster[]>([]);
const showInput = ref<boolean>(false);
const loading = ref<boolean>(false);
const successDialog = ref<boolean>(false);
const errorDialog = ref<boolean>(false);
const clusterId = ref<string>('');
const clusterSecret = ref<string>('');
const failurerea = ref<string>('');

const cancel = (): void => {
  showInput.value = false;
  loading.value = false;
  successDialog.value = false;
  errorDialog.value = false;
  clusterId.value = '';
  clusterSecret.value = '';
};

const bindsuccess = (): void => {
  cancel();
  location.reload();
};

const bindcluster = async (): Promise<void> => {
  loading.value = true;
  try {
    const Url = `/api/user/clusters/bind`;
    const response = await axios.post(Url, {
      clusterId: clusterId.value,
      clusterSecret: clusterSecret.value,
    });
    loading.value = false;
    if (response.status === 200) {
      successDialog.value = true;
    }
  } catch (error) {
    loading.value = false;
    if (error.response && error.response.status) {
      if (error.response.status === 401) {
        failurerea.value = '登录已失效';
      } else if (error.response.status === 404) {
        failurerea.value = '不存在该节点或该节点已被绑定';
      } else {
        failurerea.value = '发生未知错误';
      }
    } else {
      failurerea.value = '网络错误';
    }
    errorDialog.value = true;
    console.error("Failed to bind cluster:", error);
  }
};

const getclusters = async (): Promise<void> => {
  try {
    const response = await axios.get('/api/user/clusters');
    cards.value = response.data.map((item: any) => ({
      clusterId: item.clusterId,
      clusterName: item.clusterName,
      endpoint: item.endpoint && item.port ? `${item.endpoint}:${item.port}` : null,
      bandwidth: item.bandwidth,
      createdAt: formatCreatedAt(item.createdAt),
      isOnline: item.isOnline,
      isBanned: item.isBanned,
      fullsize: item.fullsize,
      sponsor: item.sponsor,
      sponsorUrl: item.sponsorUrl,
      sponsorBanner: item.sponsorBanner,
    }));
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};

onMounted(async () => {
  if (Cookies.get('token')) {
    await getclusters();
  } else {
    // 使用 Vue Router 进行重定向
    window.location.href = '/dashboard/auth/login'; // 使用 window.location.href 代替 this.$router.push
  }
});
</script>

<route lang="yaml">
  meta:
    layout: appbar
</route>