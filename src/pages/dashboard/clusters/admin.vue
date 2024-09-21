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

    <v-btn class="ms-2" prepend-icon="mdi-plus" @click="openCreateDialog" color="pink">
        <span>新建节点</span>
    </v-btn>

    <v-btn class="ms-2" prepend-icon="mdi-pencil" :disabled="!canEdit" @click="openEditDialog" color="pink">
        <span>修改节点</span>
    </v-btn>

    <!-- 新的修改分片按钮 -->
    <v-btn class="ms-2" prepend-icon="mdi-database" :disabled="!canEdit" @click="openShardsDialog" color="pink">
        <span>修改分片</span>
    </v-btn>

    <v-snackbar v-model="snackbar">
        {{ modifytext }}
        <template v-slot:actions>
            <v-btn color="primary" variant="text" @click="snackbar = false">
                关闭
            </v-btn>
        </template>
    </v-snackbar>

    <v-dialog v-model="createDialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">新建节点</span>
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="newClusterName"
                    label="集群名称"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="newBandwidth"
                    label="带宽"
                    type="number"
                    required
                    :rules="[v => !!v || '带宽是必填项']"
                ></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="createDialog = false" color="grey" text>
                    取消
                </v-btn>
                <v-btn @click="create" color="primary">
                    创建
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">修改节点信息</span>
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="editClusterName"
                    label="集群名称"
                ></v-text-field>
                <v-text-field
                    v-model="editBandwidth"
                    label="带宽"
                    type="number"
                ></v-text-field>
                <v-text-field
                    v-model="editSponsor"
                    label="赞助商"
                ></v-text-field>
                <v-text-field
                    v-model="editSponsorUrl"
                    label="赞助商网址"
                ></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="editDialog = false" color="grey" text>
                    取消
                </v-btn>
                <v-btn @click="update" color="primary">
                    更新
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="showInfoDialog" max-width="400px">
        <v-card>
            <v-card-title>
                <span class="headline">节点信息</span>
            </v-card-title>
            <v-card-text>
                <div><strong>ID:</strong> {{ newClusterId }}</div>
                <div><strong>Secret:</strong> {{ newClusterSecret }}</div>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="showInfoDialog = false" color="grey" text>
                    关闭
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- 新的修改分片对话框 -->
    <v-dialog v-model="shardsDialog" max-width="800px" max-height="400px">
        <v-card>
            <v-card-title>
                <span class="headline">修改分片</span>
            </v-card-title>
            <v-card-text>
                <v-row no-gutters="true">
                    <v-col v-for="(bit, index) in 32" :key="index" cols="1">
                        <v-checkbox v-model="shards[index]" :label="index.toString().padStart(2, '0')" />
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="shardsDialog = false" color="grey" text>取消</v-btn>
                <v-btn @click="confirmShards" color="primary">确认</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const items = ref([]);
const selected = ref([]);
const snackbar = ref(false);
const modifytext = ref('');
const createDialog = ref(false);
const editDialog = ref(false);
const shardsDialog = ref(false);
const showInfoDialog = ref(false);

const newClusterName = ref('');
const newBandwidth = ref(null);

const editClusterName = ref('');
const editBandwidth = ref(null);
const editSponsor = ref('');
const editSponsorUrl = ref('');

const newClusterId = ref('');
const newClusterSecret = ref('');

const shards = ref(new Array(32).fill(false)); // 32个复选框的状态

const canEdit = computed(() => selected.value.length === 1);

const getlist = async () => {
    try {
        const response = await axios.get('/93AtHome/list_clusters');
        items.value = response.data.map(item => ({
            clusterId: item.clusterId,
            clusterName: item.clusterName,
            bandwidth: item.bandwidth,
            isBanned: item.isBanned,
        }));
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

const openCreateDialog = () => {
    createDialog.value = true;
}

const create = async () => {
    try {
        const response = await axios.post('/93AtHome/super/cluster/create', {
            clusterName: newClusterName.value,
            bandwidth: newBandwidth.value
        });

        // 设置新创建节点的信息
        newClusterId.value = response.data.clusterId;
        newClusterSecret.value = response.data.clusterSecret;
        showInfoDialog.value = true;

        // 刷新节点列表
        await getlist();

        // 取消所有选中项
        selected.value = [];

        createDialog.value = false;
        newClusterName.value = '';
        newBandwidth.value = null;

        modifytext.value = "成功创建节点";
        snackbar.value = true;
    } catch (error) {
        modifytext.value = `创建失败: ${error}`;
        snackbar.value = true;
        console.error("Failed to create cluster:", error);
    }
}

const openEditDialog = () => {
    if (selected.value.length === 1) {
        const clusterId = selected.value[0];
        const cluster = items.value.find(item => item.clusterId === clusterId);
        if (cluster) {
            editClusterName.value = cluster.clusterName;
            editBandwidth.value = cluster.bandwidth;
            editSponsor.value = ''; 
            editSponsorUrl.value = ''; 
            editDialog.value = true;
        }
    }
}

const update = async () => {
    if (selected.value.length === 1) {
        const clusterId = selected.value[0];
        try {
            const requestBody = {
                clusterName: editClusterName.value || undefined,
                bandwidth: editBandwidth.value ? Number(editBandwidth.value) : undefined,
                sponsor: editSponsor.value || undefined,
                sponsorUrl: editSponsorUrl.value || undefined
            };
            Object.keys(requestBody).forEach(key => requestBody[key] === undefined && delete requestBody[key]);

            await axios.post('/93AtHome/super/cluster/profile', requestBody, {
                params: { clusterId }
            });

            await getlist();
            selected.value = [];
            editDialog.value = false;
            editClusterName.value = '';
            editBandwidth.value = null;
            editSponsor.value = '';
            editSponsorUrl.value = '';

            modifytext.value = "成功更新节点信息";
            snackbar.value = true;
        } catch (error) {
            modifytext.value = `更新失败: ${error}`;
            snackbar.value = true;
            console.error("Failed to update cluster:", error);
        }
    }
}

const ban = async () => {
    const clusterIdsToBan = selected.value;

    try {
        for (const clusterId of clusterIdsToBan) {
            await axios.post('/93AtHome/super/cluster/ban', {
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
        await getlist();  // 刷新列表
    } catch (error) {
        modifytext.value = `禁用失败: ${error}`;
        snackbar.value = true;
        console.error("Failed to ban cluster:", error);
    }
};

const unban = async () => {
    const clusterIdsToUnban = selected.value;

    try {
        for (const clusterId of clusterIdsToUnban) {
            await axios.post('/93AtHome/super/cluster/ban', {
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
        await getlist();  // 刷新列表
    } catch (error) {
        modifytext.value = `解封失败: ${error}`;
        snackbar.value = true;
        console.error("Failed to unban cluster:", error);
    }
};

const remove = async () => {
    const clusterIdsToRemove = selected.value;

    try {
        for (const clusterId of clusterIdsToRemove) {
            await axios.post('/93AtHome/super/cluster/remove', {
                clusterId: clusterId
            });
        }

        await getlist();
        selected.value = [];
        modifytext.value = "成功删除节点";
        snackbar.value = true;
    } catch (error) {
        modifytext.value = `删除失败: ${error}`;
        snackbar.value = true;
        console.error("Failed to remove cluster:", error);
    }
}

// 打开分片对话框
const openShardsDialog = () => {
    if (selected.value.length === 1) {
        shards.value.fill(false);  // 重置复选框状态
        shardsDialog.value = true;
    }
};

// 确认修改分片
const confirmShards = async () => {
    if (selected.value.length === 1) {
        const clusterId = selected.value[0];
        try {
            const shardsValue = booleansToInt(shards.value);  // 将布尔数组转换为整数
            await axios.post('/93AtHome/super/modify_shards', { shards: shardsValue }, {
                params: { clusterId }
            });

            modifytext.value = "成功修改分片";
            snackbar.value = true;
            shardsDialog.value = false;  // 关闭对话框

        } catch (error) {
            modifytext.value = `修改分片失败: ${error}`;
            snackbar.value = true;
            console.error("Failed to modify shards:", error);
        }
    }
}

// 将布尔数组转换为整数（BigInt）
const booleansToInt = (bits) => {
    return bits.reduce((acc, bit, index) => {
        if (bit) {
            acc |= (1 << index); // 设置第 index 位为 1
        }
        return acc;
    }, 0);
}

onMounted(async () => {
    getlist();
});
</script>

<route lang="yaml">
    meta:
      layout: appbar
</route>
