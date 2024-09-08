<template>
    <v-container>
        <v-row>
            <v-col v-for="source in sources" :key="source.name" cols="12" md="4">
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ source.name }}</span>
                    </v-card-title>
                    <v-card-subtitle>
                        <v-chip color="primary" text-color="white">{{ formatDate(source.lastUpdated) }}</v-chip>
                    </v-card-subtitle>
                    <v-card-text>
                        <div>文件数量: {{ source.count }}</div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 存储同步源信息的变量
const sources = ref([]);

// 格式化日期函数
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
};

// 获取同步源信息
const fetchSources = async () => {
    try {
        const response = await axios.get('/93AtHome/syncSources');
        sources.value = response.data;
    } catch (error) {
        console.error('Failed to fetch sources:', error);
    }
};

// 组件挂载时获取数据
onMounted(fetchSources);
</script>

<style scoped>
.headline {
    font-weight: bold;
}
</style>

<route lang="yaml">
    meta:
      layout: appbar
</route>