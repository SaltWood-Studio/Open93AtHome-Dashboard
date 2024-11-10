<template>
    <h2>超级管理员节点管理</h2>
    <v-data-table v-model="selected" :items="items" item-value="clusterId" show-select>
        <template v-slot:item.fullsize="{ item }">
            <v-chip :color="item.fullsize ? 'cyan' : 'orange'"
                :prepend-icon="item.fullsize ? 'mdi-database' : 'mdi-database-outline'" label>
                {{ item.fullsize ? '全量' : '分片' }}
            </v-chip>
        </template>
        <template v-slot:item.isBanned="{ item }">
            <v-chip :color="item.isBanned ? 'shades' : 'green'"
                :prepend-icon="item.isBanned ? 'mdi-cancel' : 'mdi-check'" label>
                {{ item.isBanned ? '封禁' : '正常' }}
            </v-chip>
        </template>
        <template v-slot:item.isProxy="{ item }">
            <v-chip :color="item.isProxy ? 'blue' : 'orange'"
                :prepend-icon="item.isProxy ? 'mdi-share' : 'mdi-share-off'" label>
                {{ item.isProxy ? '代理' : '普通' }}
            </v-chip>
        </template>
        <template v-slot:item.isMasterStats="{ item }">
            <v-chip :color="item.isMasterStats ? 'blue' : 'orange'"
                :prepend-icon="item.isMasterStats ? 'mdi-chart-line' : 'mdi-server-network'" label>
                {{ item.isMasterStats ? '主控统计' : '节点统计' }}
            </v-chip>
        </template>
    </v-data-table>

    <v-btn prepend-icon="mdi-cancel" @click="ban" color="pink">
        <span>批量封禁</span>
    </v-btn>
    <v-btn class="ms-2" prepend-icon="mdi-check" @click="unban" color="pink">
        <span>批量解封</span>
    </v-btn>
    <v-btn class="ms-2" prepend-icon="mdi-delete" @click="openRemoveDialog" color="pink">
        <span>批量删除</span>
    </v-btn>
    <v-btn class="ms-2" prepend-icon="mdi-arrow-down" @click="kick" color="pink">
        <span>批量下线</span>
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

    <v-snackbar v-model="snackbar" timeout="3000">
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
                <v-btn @click="createDialog = false" color="grey" text="取消"/>
                <v-btn @click="create" color="primary" text="创建"/>
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
                <v-text-field
                    v-model="editSponsorBanner"
                    label="赞助商 Banner"
                ></v-text-field>
                <v-checkbox
                    v-model="editProxy"
                    label="代理节点"
                ></v-checkbox>
                <v-checkbox
                    v-model="editMasterStats"
                    label="启用主控统计"
                ></v-checkbox>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="editDialog = false" color="grey" text="取消"/>
                <v-btn @click="update" color="primary" text="更新"/>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="showInfoDialog" max-width="400px">
        <v-card>
            <v-card-title>
                <span class="headline">节点信息</span>
            </v-card-title>
            <v-card-text>
                <div>成功创建新节点！</div>
                <div>节点信息如下：</div><br/>
                <v-text-field label="ID" v-model="newClusterId" readonly></v-text-field>
                <v-text-field label="Secret" v-model="newClusterSecret" readonly></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="copyNewCluster" color="blue" text="复制"/>
                <v-btn @click="showInfoDialog = false" color="grey" text="关闭"/>
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
                <div>全量为 1000，分片大小必须<strong>大于 0 且小于等于 1000</strong>。</div>
                <div>预计将会承载全站 {{ (shards * 100 / 1000).toFixed(2) }}% 的文件、流量。</div>
                <v-text-field
                    v-model="shards"
                    label="分片数量"
                    type="number"
                    :rules="[v => v > 0 && v <= 1000 || '分片大小必须在 (0, 1000] 之间']"
                ></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="shardsDialog = false" color="grey" text="取消"/>
                <v-btn @click="confirmShards" color="primary">确认</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- 新增的删除确认对话框 -->
    <v-dialog v-model="removeDialog" max-width="400px">
        <v-card>
            <v-card-title>
                <span class="headline">确认删除</span>
            </v-card-title>
            <v-card-text>
                <span style="font-weight: bold;">您确定要删除所选节点吗？</span>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="removeClusters" color="grey" text="确认"/>
                <v-btn @click="removeDialog = false" color="red" text="取消"/>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { Cluster } from '@/types/ClusterModel';

const items = ref<Cluster[]>([]);
const selected = ref<string[]>([]);
const snackbar = ref<boolean>(false);
const modifytext = ref<string>('');
const createDialog = ref<boolean>(false);
const editDialog = ref<boolean>(false);
const shardsDialog = ref<boolean>(false);
const showInfoDialog = ref<boolean>(false);
const removeDialog = ref<boolean>(false);

const newClusterName = ref<string>('');
const newBandwidth = ref<number | null>(null);

const editClusterName = ref<string>('');
const editBandwidth = ref<number | null>(null);
const editSponsor = ref<string>('');
const editSponsorUrl = ref<string>('');
const editSponsorBanner = ref<string>('');
const editProxy = ref<boolean>(false);
const editMasterStats = ref<boolean>(false);

const newClusterId = ref<string>('');
const newClusterSecret = ref<string>('');

const shards = ref<number>(0); // 32个复选框的状态

const canEdit = computed(() => selected.value.length === 1);

const copyNewCluster = (): void => {
    navigator.clipboard.writeText(`ID: ${newClusterId.value}\nSecret: ${newClusterSecret.value}`);
    modifytext.value = '复制成功';
    snackbar.value = true;
};

const getlist = async (): Promise<void> => {
    try {
        const response = await axios.get('/api/admin/all_clusters');
        items.value = response.data.map((item: any) => ({
            clusterId: item.clusterId,
            clusterName: item.clusterName,
            bandwidth: item.bandwidth,
            fullsize: item.fullsize,
            isBanned: item.isBanned,
            isMasterStats: item.isMasterStats,
            isProxy: item.isProxy
        }));
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
};

const openCreateDialog = (): void => {
    createDialog.value = true;
};

const create = async (): Promise<void> => {
    try {
        const response = await axios.post('/api/clusters', {
            name: newClusterName.value,
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
};

const openEditDialog = (): void => {
    if (selected.value.length === 1) {
        const clusterId = selected.value[0];
        const cluster = items.value.find(item => item.clusterId === clusterId);
        if (cluster) {
            editClusterName.value = cluster.clusterName;
            editBandwidth.value = cluster.bandwidth;
            editSponsor.value = ''; 
            editSponsorUrl.value = '';
            editSponsorBanner.value = '';
            editDialog.value = true;
            editProxy.value = cluster.isProxy;
            editMasterStats.value = cluster.isMasterStats;
        }
    }
};

const update = async (): Promise<void> => {
    if (selected.value.length === 1) {
        const clusterId = selected.value[0];
        try {
            const requestBody: Record<string, any> = {
                name: editClusterName.value || undefined,
                bandwidth: editBandwidth.value !== null ? Number(editBandwidth.value) : undefined,
                sponsor: editSponsor.value || undefined,
                sponsorUrl: editSponsorUrl.value || undefined,
                sponsorBanner: editSponsorBanner.value || undefined,
                isProxy: editProxy.value,
                isMasterStats: editMasterStats.value
            };
            Object.keys(requestBody).forEach(key => requestBody[key] === undefined && delete requestBody[key]);

            await axios.put(`/api/clusters/${clusterId}`, requestBody);

            await getlist();
            selected.value = [];
            editDialog.value = false;
            editClusterName.value = '';
            editBandwidth.value = null;
            editSponsor.value = '';
            editSponsorUrl.value = '';
            editSponsorBanner.value = '';
            editProxy.value = false;
            editMasterStats.value = false;

            modifytext.value = "成功更新节点信息";
            snackbar.value = true;
        } catch (error) {
            modifytext.value = `更新失败: ${error}`;
            snackbar.value = true;
            console.error("Failed to update cluster:", error);
        }
    }
};

const ban = async (): Promise<void> => {
    const clusterIdsToBan = selected.value;

    try {
        for (const clusterId of clusterIdsToBan) {
            await axios.post(`/api/clusters/${clusterId}/ban`, {
                banned: true
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

const unban = async (): Promise<void> => {
    const clusterIdsToUnban = selected.value;

    try {
        for (const clusterId of clusterIdsToUnban) {
            await axios.post(`/api/clusters/${clusterId}/ban`, {
                banned: false
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

// 打开分片对话框
const openShardsDialog = (): void => {
    if (selected.value.length === 1) {
        const clusterId = selected.value[0];
        const cluster = items.value.find(item => item.clusterId === clusterId);
        if (cluster) {
            shards.value = cluster.shards;  // 读取当前节点的分片数量
            shardsDialog.value = true;
        } else {
            console.error(`Failed to find cluster with id ${clusterId}`);
        }
    }
};

// 确认修改分片
const confirmShards = async (): Promise<void> => {
    if (selected.value.length === 1) {
        const clusterId = selected.value[0];
        try {
            const shardsValue = shards.value;  // 读取分片值
            await axios.put(`/api/clusters/${clusterId}/shards`, { shards: shardsValue });

            modifytext.value = "成功修改分片";
            snackbar.value = true;
            shardsDialog.value = false;  // 关闭对话框
        } catch (error) {
            modifytext.value = `修改分片失败: ${error}`;
            snackbar.value = true;
            console.error("Failed to modify shards:", error);
        }
        await getlist();  // 刷新列表
    }
};

const kick = async (): Promise<void> => {
    const clusterIdsToKick = selected.value;

    try {
        for (const clusterId of clusterIdsToKick) {
            await axios.post(`/api/clusters/${clusterId}/kick`);
        }

        modifytext.value = "成功下线节点";
        snackbar.value = true;
        await getlist();  // 刷新列表
    } catch (error) {
        modifytext.value = `下线失败: ${error}`;
        snackbar.value = true;
        console.error("Failed to kick cluster:", error);
    }
};

const openRemoveDialog = (): void => {
    removeDialog.value = true;  // 打开删除确认对话框
};

const removeClusters = async (): Promise<void> => {
    try {
        await axios.delete(`/api/clusters/${selected.value}`);
        modifytext.value = "成功删除节点";
        snackbar.value = true;
        removeDialog.value = false;

        // 刷新节点列表
        await getlist();
    } catch (error) {
        modifytext.value = `删除失败: ${error}`;
        snackbar.value = true;
        console.error("Failed to remove clusters:", error);
    }
};

onMounted(async () => {
    await getlist();
});
</script>

<route lang="yaml">
    meta:
      layout: appbar
</route>
