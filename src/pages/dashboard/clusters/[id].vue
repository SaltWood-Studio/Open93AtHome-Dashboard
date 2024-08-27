<template>
    <AppBar>
        <v-card prepend-icon="mdi-server">
            <template v-slot:title>
                <span class="font-weight-black">节点详情</span>
            </template>

            <v-tabs v-model="activeTab" background-color="transparent">
                <v-tab key="0">基本信息</v-tab>
                <v-tab key="1">赞助信息</v-tab>
            </v-tabs>
            <v-divider></v-divider>
            <v-card-text>
                <v-tabs-window v-model="activeTab">
                    <v-tabs-window-item key="0">
                        <v-text-field label="ID" :model-value="route.params.id" readonly></v-text-field>
                        <v-text-field label="名称" :model-value="endPoint" readonly></v-text-field>
                        <v-text-field label="Endpoint" :model-value="endPoint" readonly></v-text-field>
                        <v-text-field label="上行速率" :model-value="bandwidth" readonly></v-text-field>

                        <v-divider></v-divider>

                        <v-text-field class="mt-5" label="创建日期" :model-value="createdAt" readonly></v-text-field>

                    </v-tabs-window-item>

                    <v-tabs-window-item key="1">
                        <p>啦啦啦</p>
                        <p>TODO..</p>
                    </v-tabs-window-item>
                </v-tabs-window>

            </v-card-text>

        </v-card>
    </AppBar>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppBar from '@/components/AppBar.vue';
import axios from 'axios';
import Cookies from 'js-cookie';

const router = useRouter();
const route = useRoute();

const activeTab = ref(0)
const cluster = ref({})

const getclusters = async () => {
    try {
        const response = await axios.get('/93AtHome/dashboard/user/clusters', {
            params: {
                clusterId: route.params.id,
            }
        });
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

onMounted(async () => {
    if (Cookies.get('token')) {
        getclusters();
    } else {
        router.push({ path: '/dashboard/auth/login' });
    }
})
</script>