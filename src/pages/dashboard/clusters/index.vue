<template>
  <v-row>
    <v-col cols="12" md="8" lg="4" v-for="(card, index) in cards" :key="index">
      <ClusterCard :clusterId="card.clusterId" :clusterName="card.clusterName" :endPoint="card.endPoint"
        :bandwidth="card.bandwidth" :createdAt="card.createdAt" :isOnline="card.isOnline" :sponsor="card.sponsor"
        :sponsorUrl="card.sponsorUrl" :fullsize="card.fullsize"/>
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
        <v-btn text @click="cancel">取消</v-btn>
        <v-btn text @click="bindcluster">提交</v-btn>
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
        <v-btn text @click="bindsuccess">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="errorDialog" max-width="500px">
    <v-card prepend-icon="mdi-paperclip-remove" title="绑定错误">
      <v-card-text>
        {{ failurerea }}
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="cancel">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ClusterCard from '@/components/ClusterCard.vue';
import axios from 'axios';
import Cookies from 'js-cookie';

const cards = ref([]);
const showInput = ref(false);
const loading = ref(false);
const successDialog = ref(false);
const errorDialog = ref(false);
const clusterId = ref('');
const clusterSecret = ref('');
const failurerea = ref('');

const cancel = () => {
  showInput.value = false;
  loading.value = false;
  successDialog.value = false;
  errorDialog.value = false;
  clusterId.value = '';
  clusterSecret.value = '';
};

const bindsuccess = () => {
  cancel();
  location.reload();
};

const bindcluster = async () => {
  loading.value = true;
  try {
    const Url = `/93AtHome/dashboard/user/bindCluster`;
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

const formatCreatedAt = (createdAt) => {
  const date = new Date(createdAt * 1000);
  const chinaTime = new Date(date.getTime());

  const year = chinaTime.getFullYear();
  const month = String(chinaTime.getMonth() + 1).padStart(2, '0');
  const day = String(chinaTime.getDate()).padStart(2, '0');
  const hours = String(chinaTime.getHours()).padStart(2, '0');
  const minutes = String(chinaTime.getMinutes()).padStart(2, '0');
  const seconds = String(chinaTime.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const getclusters = async () => {
  try {
    const response = await axios.get('/93AtHome/dashboard/user/clusters');
    cards.value = response.data.map((item) => ({
      clusterId: item.clusterId,
      clusterName: item.clusterName,
      endPoint: item.endpoint && item.port ? `${item.endpoint}:${item.port}` : null,
      bandwidth: item.bandwidth,
      createdAt: formatCreatedAt(item.createdAt),
      isOnline: item.isOnline,
      fullsize: item.fullsize,
      sponsor: item.sponsor,
      sponsorUrl: item.sponsorUrl,
    }));
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};

onMounted(async () => {
  if (Cookies.get('token')) {
    await getclusters();
  } else {
    this.$router.push({ path: '/dashboard/auth/login' });
  }
});
</script>

<route lang="yaml">
  meta:
    layout: appbar
</route>