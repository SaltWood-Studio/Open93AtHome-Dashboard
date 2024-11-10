<template>
  <v-container>
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
            <div>🎉感谢 “<strong>{{ name }}</strong>” 的支持！🎉</div>
            <div>此节点今日共承担 {{ formatBytes(traffic.bytes) }} 的流量，共计 {{ traffic.hits }} 次访问。</div>
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
import { onMounted, onUnmounted, ref, watch } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { Cluster } from '@/types/ClusterModel';
import { formatBytes } from '@/types/Utilities';

const sponsor = ref('Sponsor Name');
const sponsorBanner = ref('');
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

function handleImageError() {
    imageError.value = true;
}

function openSponsorPage() {
    window.location.href = sponsorUrl.value;
}

const watcher = watch(sponsorBanner, () => {
    hasError.value = false;
    imageError.value = false;
});

onUnmounted(() => {
    watcher.stop();
});

onMounted(async () => {
    try {
        const response = (await axios.get(`/api/clusters/${route.params.id}`)).data;
        sponsor.value = response.sponsor;
        if (response.sponsorBanner) sponsorBanner.value = response.sponsorBanner;
        else sponsorBanner.value = 'https://via.placeholder.com/800x450?text=Sponsor%20Banner';
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
