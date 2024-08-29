<template>
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
                    <v-text-field label="ID" :model-value="cluster.clusterId" readonly></v-text-field>
                    <v-text-field label="名称" v-model="cluster.clusterName" :readonly="!modify"
                        :append-inner-icon="modify ? 'mdi-pencil' : ''"></v-text-field>
                    <v-text-field label="Endpoint" :model-value="`${cluster.endpoint}:${cluster.port}`"
                        readonly></v-text-field>
                    <v-text-field label="上行速率" v-model="cluster.bandwidth" :readonly="!modify" suffix="Mbps"
                        :append-inner-icon="modify ? 'mdi-pencil' : ''"></v-text-field>

                    <v-divider></v-divider>


                    <v-divider></v-divider>

                    <v-text-field class="mt-5" label="创建日期" :model-value="formatCreatedAt(cluster.createdAt)"
                        readonly></v-text-field>
                    <v-text-field label="离线原因" :model-value="cluster.downReason" readonly></v-text-field>

                    <v-btn :prepend-icon="modify ? 'mdi-check' : 'mdi-pencil'" @click="modifyinf" color="primary">
                        <span v-if="modify">确认更改</span>
                        <span v-else>更改节点信息</span>
                    </v-btn>

                </v-tabs-window-item>

                <v-tabs-window-item key="1">
                    <v-text-field label="名称" v-model="cluster.sponsor" :readonly="!modify"
                        :append-inner-icon="modify ? 'mdi-pencil' : ''"></v-text-field>
                    <v-text-field label="跳转链接" v-model="cluster.sponsorUrl" :readonly="!modify"
                        :append-inner-icon="modify ? 'mdi-pencil' : ''"></v-text-field>

                    <v-btn :prepend-icon="modify ? 'mdi-check' : 'mdi-pencil'" @click="modifyinf" color="primary">
                        <span v-if="modify">确认更改</span>
                        <span v-else>更改赞助信息</span>
                    </v-btn>

                </v-tabs-window-item>
            </v-tabs-window>
        </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar">
        {{ modifytext }}
        <template v-slot:actions>
            <v-btn color="primary" variant="text" @click="snackbar = false">
                关闭
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import Cookies from 'js-cookie';

const router = useRouter();
const route = useRoute();

const activeTab = ref(0)
const cluster = ref({})
const modify = ref(false)
const snackbar = ref(false)
const modifytext = ref('')

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
        const response = await axios.get('/93AtHome/dashboard/user/clusters', {
            params: {
                clusterId: route.params.id,
            }
        });
        cluster.value = response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

const modifyinf = async () => {
    modify.value = !modify.value;

    if (!modify.value) {
        try {
            const modifyres = await axios.post('/93AtHome/dashboard/user/cluster/profile', {
                clusterName: cluster.value.clusterName,
                bandwidth: cluster.value.bandwidth,
                sponsor: cluster.value.sponsor,
                sponsorUrl: cluster.value.sponsorUrl,
            }, {
                params: {
                    clusterId: cluster.value.clusterId
                }
            });
            modifytext.value = "成功修改信息";
            snackbar.value = true;
        } catch (error) {
            modifytext.value = `修改信息失败: ${error}`;
            snackbar.value = true;
            console.error("Failed to modify cluster information:", error);
        }
    }
};



onMounted(async () => {
    if (Cookies.get('token')) {
        getclusters();
    } else {
        router.push({ path: '/dashboard/auth/login' });
    }
})
</script>

<route lang="yaml">
    meta:
      layout: appbar
  </route>