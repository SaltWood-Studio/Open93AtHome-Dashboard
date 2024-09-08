<template>
    <h2>超级管理员节点管理</h2>
    <v-data-table v-model="selected" :items="items" item-value="clusterId" show-select></v-data-table>

    <v-btn prepend-icon="mdi-cancel" @click="ban" color="pink">
        <span>批量封禁</span>
    </v-btn>
    <v-btn class="ms-2" prepend-icon="mdi-check" @click="unban" color="pink">
        <span>批量解封</span>
    </v-btn>
    <v-btn class="ms-2" prepend-icon="mdi-delete" @click="remove" color="pink">
        <span>批量删除</span>
    </v-btn>

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
import axios from 'axios';
import Cookies from 'js-cookie';

const items = ref([]);
const selected = ref([]);
const snackbar = ref(false)
const modifytext = ref('');

const getlist = async () => {
    try {
        const response = await axios.get('/93AtHome/list_clusters');
        items.value = response.data.map((item, index) => ({
            clusterId: item.clusterId,
            clusterName: item.clusterName,
            bandwidth: item.bandwidth,
            isBanned: item.isBanned,
        }));
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

const ban = async () => {
    console.log(selected.value);

    const clusterIdsToBan = selected.value;

    try {
        for (const clusterId of clusterIdsToBan) {
            const response = await axios.post('/93AtHome/super/cluster/ban', {
                ban: true,
                clusterId: clusterId
            });

            items.value = items.value.map(item => {
                if (item.clusterId === clusterId) {
                    return {
                        ...item,
                        isBanned: true
                    };
                }
                return item;
            });
        }

        modifytext.value = "成功禁用节点";
        snackbar.value = true;
    } catch (error) {
        modifytext.value = `禁用失败: ${error}`;
        snackbar.value = true;
        console.error("Failed to ban cluster:", error);
    }
};

const unban = async () => {
    const clusterIdsToBan = selected.value;

    try {
        for (const clusterId of clusterIdsToBan) {
            const response = await axios.post('/93AtHome/super/cluster/ban', {
                ban: false,
                clusterId: clusterId
            });
            items.value = items.value.map(item => {
                if (item.clusterId === clusterId) {
                    return {
                        ...item,
                        isBanned: false
                    };
                }
                return item;
            });
        }

        modifytext.value = "成功解封节点";
        snackbar.value = true;
    } catch (error) {
        modifytext.value = `解封失败: ${error}`;
        snackbar.value = true;
        console.error("Failed to ban cluster:", error);
    }
};

const remove = async () => {
    console.log(selected.value);

    const clusterIdsToBan = selected.value;

    try {
        for (const clusterId of clusterIdsToBan) {
            const response = await axios.post('/93AtHome/super/cluster/remove', {
                clusterId: clusterId
            });
        }

        modifytext.value = "成功删除节点";
        snackbar.value = true;
    } catch (error) {
        modifytext.value = `删除失败: ${error}`;
        snackbar.value = true;
        console.error("Failed to ban cluster:", error);
    }
};

onMounted(async () => {
    getlist();
});
</script>

<route lang="yaml">
    meta:
      layout: appbar
</route>