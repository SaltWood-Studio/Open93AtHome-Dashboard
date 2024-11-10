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
                        :type="'number'" :append-inner-icon="modify ? 'mdi-pencil' : ''"></v-text-field>

                    <v-divider></v-divider>


                    <v-divider></v-divider>

                    <v-text-field class="mt-5" label="创建日期" :model-value="formatCreatedAt(cluster.createdAt)"
                        readonly></v-text-field>
                    <v-text-field label="离线时间" :model-value="formatCreatedAt(cluster.downTime)" readonly></v-text-field>
                    <v-text-field label="离线原因" :model-value="cluster.downReason" readonly></v-text-field>
                    <v-btn :prepend-icon="modify ? 'mdi-check' : 'mdi-pencil'" @click="modifyinf" color="primary">
                        <span v-if="modify">确认更改</span>
                        <span v-else>更改节点信息</span>
                    </v-btn>

                    <v-btn class="ms-2" prepend-icon="mdi-paperclip-minus" @click="showInput = true" color="pink">
                        <span>解绑节点</span>
                    </v-btn>

                    <v-btn class="ms-2" prepend-icon="mdi-lock-reset" @click="showResetDialog = true" color="red">
                        <span>重置密钥</span>
                    </v-btn>
                </v-tabs-window-item>

                <v-tabs-window-item key="1">
                    <v-text-field label="名称" v-model="cluster.sponsor" :readonly="!modify"
                        :append-inner-icon="modify ? 'mdi-pencil' : ''"></v-text-field>
                    <v-text-field label="跳转链接" v-model="cluster.sponsorUrl" :readonly="!modify"
                        :append-inner-icon="modify ? 'mdi-pencil' : ''"></v-text-field>
                    <v-text-field label="Banner" v-model="cluster.sponsorBanner" :readonly="!modify"
                        :append-inner-icon="modify ? 'mdi-pencil' : ''"></v-text-field>

                    <v-btn :prepend-icon="modify ? 'mdi-check' : 'mdi-pencil'" @click="modifyinf" color="primary">
                        <span v-if="modify">确认更改</span>
                        <span v-else>更改赞助信息</span>
                    </v-btn>

                </v-tabs-window-item>
            </v-tabs-window>
        </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar" timeout="6000">
        {{ modifytext }}
        <template v-slot:actions>
            <v-btn color="primary" variant="text" @click="snackbar = false">
                关闭
            </v-btn>
        </template>
    </v-snackbar>

    <v-dialog v-model="showInput" max-width="500px">
        <v-card prepend-icon="mdi-paperclip-minus" title="解绑节点">
            <v-card-text>
                <p>您确定解绑此节点?</p>
                <p>请在下方完整输入 <strong>{{ cluster.clusterId }}</strong> 以解绑</p>

                <v-text-field class="mt-4" v-model="clusterId" label="ClusterId" required></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn text="取消" @click="showInput = false"/>
                <v-btn text="确认" @click="unbind"/>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="showNewSecret" max-width="500px">
        <v-card prepend-icon="mdi-paperclip-minus" title="重置密钥">
            <v-card-text>
                <p>成功重置密钥！</p>
                <p>牢记您的新密钥: <strong>{{ newSecret }}</strong></p>
                <p>请妥善保管您的密钥，切勿透露给他人！</p>
            </v-card-text>
            <v-card-actions>
                <v-btn text="确认" @click="showNewSecret = false; newSecret = ''"/>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- 重置密钥的对话框 -->
    <v-dialog v-model="showResetDialog" max-width="500px">
        <v-card prepend-icon="mdi-lock-reset" title="重置密钥">
            <v-card-text>
                <p>您确定要重置密钥吗?</p>
                <p>请<strong>务必关闭在线的节点</strong>再重置密钥，否则在节点在线时重置密钥<strong>可能会导致不可预料的后果！</strong></p>
                <p>在下方完整输入节点名称 <strong>{{ cluster.clusterName }}</strong> 以确认操作</p>

                <v-text-field class="mt-4" v-model="confirmName" label="节点名称" required></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn text="取消" @click="showResetDialog = false"/>
                <v-btn text="确认" @click="resetSecret"/>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Cluster } from '@/types/ClusterModel';
import { checkName, formatCreatedAt } from '@/types/Utilities';

// 设置响应变量
const router = useRouter();
const route = useRoute();

const activeTab = ref<number>(0);
const cluster = ref<Cluster | null>(null);
const modify = ref<boolean>(false);
const snackbar = ref<boolean>(false);
const modifytext = ref<string>('');
const showInput = ref<boolean>(false);
const showResetDialog = ref<boolean>(false);
const showNewSecret = ref<boolean>(false);
const clusterId = ref<string>('');
const confirmName = ref<string>('');
const newSecret = ref<string>('');

// 获取集群数据
const getclusters = async () => {
    try {
        const response = await axios.get<Cluster>(`/api/user/clusters/${route.params.id}`);
        cluster.value = response.data;
    } catch (error) {
        console.error('获取数据失败:', error);
    }
}

// 修改集群信息
const modifyinf = async () => {
    modify.value = !modify.value;

    if (!modify.value) {
        try {
            if (checkName(cluster.value?.clusterName) || checkName(cluster.value?.sponsor) || checkName(cluster.value?.sponsorUrl) || checkName(cluster.value?.sponsorBanner)) {
                modifytext.value = "名称不能包含特殊字符";
                snackbar.value = true;
                return;
            }
            const modifyres = await axios.put(`/api/user/clusters/${cluster.value?.clusterId}`, {
                name: cluster.value?.clusterName,
                bandwidth: cluster.value?.bandwidth,
                sponsor: cluster.value?.sponsor,
                sponsorUrl: cluster.value?.sponsorUrl,
                sponsorBanner: cluster.value?.sponsorBanner,
            });
            modifytext.value = "成功修改信息";
            snackbar.value = true;
        } catch (error) {
            modifytext.value = `修改信息失败: ${error}`;
            snackbar.value = true;
            console.error("修改集群信息失败:", error);
        }
    }
};

// 解绑集群
const unbind = async () => {
    if (cluster.value?.clusterId === clusterId.value) {
        try {
            await axios.post(`/api/user/clusters/${cluster.value.clusterId}/unbind`);
            modifytext.value = "成功解绑";
            snackbar.value = true;
            showInput.value = false;
            setTimeout(() => {
                router.push({ path: '/dashboard/clusters' });
            }, 1000);
        } catch (error) {
            modifytext.value = `解绑失败: ${error}`;
            snackbar.value = true;
            showInput.value = false;
            console.error("修改集群信息失败:", error);
        }
    } else {
        modifytext.value = `输入的 ID 不一致`;
        snackbar.value = true;
    }
}

// 重置密钥
const resetSecret = async () => {
    if (confirmName.value === cluster.value?.clusterName) {
        try {
            const response = await axios.post<{ secret: string }>(`/api/user/clusters/${cluster.value.clusterId}/reset_secret`);
            modifytext.value = "成功重置密钥";
            showResetDialog.value = false;
            newSecret.value = response.data.secret;
            showNewSecret.value = true;
        } catch (error) {
            modifytext.value = `重置密钥失败: ${error}`;
            snackbar.value = true;
            showResetDialog.value = false;
            console.error("重置密钥失败:", error);
        }
    } else {
        modifytext.value = `节点名称不匹配`;
        snackbar.value = true;
    }
}

// 挂载时生命周期钩子
onMounted(async () => {
    if (Cookies.get('token')) {
        await getclusters();
    } else {
        router.push({ path: '/dashboard/auth/login' });
    }
});
</script>

<route lang="yaml">
    meta:
      layout: appbar
  </route>
