<template>
  <v-container>
    <v-card width="90%" height="90%" class="text-center" style="display: flex; 
      align-items: center; 
      justify-content: center;">
      <v-card-actions class="pa-2" style="position: absolute; top: 0; left: 0;">
        <v-btn icon @click="back" color="indigo">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Sponsor Title -->
    <v-row justify="center">
      <v-col class="text-center">
        <!-- Sponsor Name -->
        <h1>{{ hasError? '加载失败！' : sponsor }}</h1>
      </v-col>
    </v-row>

    <!-- Image with 16:9 aspect ratio -->
    <v-row justify="center" v-if="!imageError && !hasError">
      <v-col class="text-center" cols="12" md="8">
        <v-img
          :src="sponsorBanner"
          max-width="100%"
          height="auto"
          aspect-ratio="16/9"
          @error="handleImageError"
          contain
        >
        </v-img>
      </v-col>
    </v-row>

    <v-row justify="center" v-if="!hasError">
      <v-col class="text-center">
        <v-card>
          <v-card-text>
            <div>感谢 <strong>{{ name }}</strong> 的赞助！</div>
            <div>此节点今日共承担 {{ formataBytes(traffic.bytes) }} 的流量，共计 {{ traffic.hits }} 次访问。</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Button -->
    <v-row justify="center" v-if="!hasError">
      <v-col class="text-center">
        <v-btn
          color="primary"
          @click="openSponsorPage"
        >
          跳转至赞助商页面
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { Cluster } from '@/types/ClusterModel';

const formataBytes = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

const sponsor = ref('Sponsor Name');
const sponsorBanner = ref('https://via.placeholder.com/800x450');
const sponsorUrl = ref('https://www.sponsorpage.com');
const imageError = ref(false);
const hasError = ref(false);
const cluster = ref<Cluster | null>(null);
const name = ref('Cluster Name');
const traffic = {
    bytes: 0,
    hits: 0
}

const route = useRoute();
const router = useRouter();

function back() {
    router.go(-1);
}

function handleImageError() {
    imageError.value = true;
}

function openSponsorPage() {
    window.location.href = sponsorUrl.value;
}

onMounted(async () => {
    try {
        const response = (await axios.get(`/api/clusters/${route.params.id}`)).data;
        sponsor.value = response.sponsor;
        if (response.sponsorBanner) sponsorBanner.value = response.sponsorBanner;
        sponsorUrl.value = response.sponsorUrl;
        cluster.value = response;
        traffic.bytes = response.bytes;
        traffic.hits = response.hits;
        name.value = response.clusterName;
    }
    catch (error) {
        console.error(error);
        hasError.value = true;
    }
});
</script>

<route lang="yaml">
  meta:
    layout: appbar
</route>
