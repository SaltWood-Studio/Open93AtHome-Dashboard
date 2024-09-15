<template>
    <v-container>
        <v-row>
            <v-col v-for="source in sources" :key="source.name" cols="12" md="4" class="mb-3">
                <v-card>
                    <v-card-title>
                        <v-avatar v-if="source.imageExists" size="40" class="mr-3">
                            <img :src="`/assets/sources/${source.name}.png`" alt="source image" class="avatar-image" />
                        </v-avatar>
                        <span :class="{'headline': true, 'no-avatar': !source.imageExists}">
                            {{ source.name }}
                        </span>
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
const search = ref('');

// 格式化日期函数
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
};

// 获取同步源信息
const checkImage = async (source) => {
    try {
        await axios.get(`/assets/sources/${source.name}.png`);
        source.imageExists = true;
    } catch {
        source.imageExists = false;
    }
};

const fetchSources = async () => {
    try {
        const response = await axios.get('/93AtHome/syncSources');
        sources.value = response.data;

        for (const source of sources.value) {
            await checkImage(source);
        }
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
.no-avatar {
    margin-left: 0;
}
.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 确保图片填充整个圆形区域 */
    border-radius: 50%; /* 确保图片是圆形的 */
}
</style>

<route lang="yaml">
    meta:
      layout: appbar
</route>
