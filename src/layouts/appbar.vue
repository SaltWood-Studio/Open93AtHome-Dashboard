<template>
    <v-app-bar color="primary" app>
        <v-app-bar-nav-icon @click="openDrawer"></v-app-bar-nav-icon>
        <v-toolbar-title>93@Home-Dash</v-toolbar-title>
        <v-spacer></v-spacer>

        <template v-slot:append>
            <v-btn icon id="menu-activator">
                <v-icon>mdi-account-circle</v-icon>
            </v-btn>
        </template>

        <v-menu activator="#menu-activator" :close-on-content-click="false" location="end">
            <v-card>
                <v-card-text>
                    <div class="mx-auto text-center">
                        <v-avatar :image="avatarUrl" size="70"></v-avatar>
                        <h3 class="my-3">{{ userName }}</h3>
                        <v-divider class="my-4"></v-divider>
                        <v-btn variant="text" prepend-icon="mdi-login" v-if="!isLoggedIn" @click="login">
                            登录
                        </v-btn>

                        <v-btn variant="text" prepend-icon="mdi-logout" v-if="isLoggedIn" @click="logout">
                            登出
                        </v-btn>

                        <!-- 切换按钮 -->
                        <v-btn v-if="isSuperAdmin" small @click="showSwitchDialog">
                            切换
                        </v-btn>

                    </div>
                </v-card-text>
            </v-card>
        </v-menu>

    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :permanent="$vuetify.display.mdAndUp" :clipped="$vuetify.display.mdAndUp">
        <v-list class="mt-10" density="compact" nav>
            <v-list-item :to="{ path: '/dashboard' }" exact prepend-icon="mdi-view-dashboard" title="总览"></v-list-item>
            <v-list-item :to="{ path: '/dashboard/rank' }" exact prepend-icon="mdi-trophy-variant" title="节点排行"></v-list-item>
            <v-list-item :to="{ path: '/dashboard/sources' }" exact prepend-icon="mdi-database" title="同步源"></v-list-item>
            <v-list-group v-if="isLoggedIn">
                <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" prepend-icon="mdi-server" title="节点管理"></v-list-item>
                </template>

                <v-list-item :to="{ path: '/dashboard/clusters' }" title="我的节点"></v-list-item>

                <v-list-item v-if="isSuperAdmin" :to="{ path: '/dashboard/clusters/admin' }" title="超管面板"></v-list-item>

            </v-list-group>
        </v-list>
    </v-navigation-drawer>

    <v-container fluid>
        <router-view></router-view>
    </v-container>

    <!-- 切换用户对话框 -->
    <v-dialog v-model="switchDialog" max-width="800">
        <v-card>
            <v-card-title>
                <span class="headline">选择用户切换</span>
            </v-card-title>
            <v-card-subtitle>
                <v-data-table
                    :headers="headers"
                    :items="users"
                    item-key="id"
                    show-select
                    :items-per-page="5"
                    class="elevation-1"
                    v-model="selectedUsers"
                >
                    <template v-slot:item.photo="{ item }">
                        <v-avatar size="40">
                            <img
                                :src=item.photo
                                alt=item.username
                            >
                        </v-avatar>
                    </template>
                    <template v-slot:item.isSuperUser="{ item }">
                        <v-chip :color="Number(item.isSuperUser) > 0 ? 'green' : 'red'" dark>
                            {{ Number(item.isSuperUser) > 0 ? '管理' : '普通' }}
                        </v-chip>
                    </template>
                </v-data-table>
            </v-card-subtitle>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="switchUser" color="primary">切换</v-btn>
                <v-btn @click="switchDialog = false">取消</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" bottom right>
        {{ snackbar.message }}
        <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="snackbar.show = false">关闭</v-btn>
        </template>
    </v-snackbar>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Cookies from 'js-cookie';

const router = useRouter();
const isLoggedIn = ref(false);
const isSuperAdmin = ref(false);
const userName = ref('未登录');
const avatarUrl = ref('default_avatar.png');
const drawer = ref(null);
const switchDialog = ref(false);
const aboutDialog = ref(false);
const users = ref([]);
const selectedUsers = ref([]);
const headers = [
    { text: '头像', value: 'photo' },
    { text: '用户名', value: 'username' },
    { text: 'ID', value: 'id' },
    { text: '权限等级', value: 'isSuperUser' },
];

const snackbar = ref({
    show: false,
    message: '',
    color: 'success'
});

const openDrawer = () => {
    drawer.value = !drawer.value;
};

const getProfile = async () => {
    try {
        const response = await axios.get('/api/user/me');
        const data = response.data;
        avatarUrl.value = data.avatar_url;
        userName.value = data.login;
        isLoggedIn.value = true;
        isSuperAdmin.value = Cookies.get('adminToken') !== undefined;
    } catch (error) {
        isLoggedIn.value = false;
        Cookies.remove('token');
        message("Failed to get profile");
        console.error("Failed to get profile:", error);
    }
};

const login = () => {
    router.push('/dashboard/auth/login');
};

const logout = () => {
    Cookies.remove('token');
    Cookies.remove('adminToken');
    location.reload();
};

const showSwitchDialog = async () => {
    try {
        const response = await axios.get('/api/admin/all_users');
        users.value = response.data;
        switchDialog.value = true;
    } catch (error) {
        message("Failed to fetch users");
        console.error("Failed to fetch users:", error);
    }
};

const switchUser = async () => {
    if (selectedUsers.value.length > 1) {
        message("不能切换到多个用户！");
        selectedUsers.value = [];
        return;
    }
    const selectedUser = selectedUsers.value.at(0);
    if (selectedUser) {
        try {
            const response = await axios.post('/api/admin/sudo', { id: selectedUser });
            if (response.status === 200) {
                message("切换成功");
                switchDialog.value = false;
                await getProfile();
            } else {
                message(`失败: ${response.status}`);
            }
        } catch (error) {
            message(`请求失败: ${error.response.status}`);
        }
    } else {
        message("请选择一个用户进行切换！");
    }
    selectedUsers.value = [];
};

const message = (message) => {
    snackbar.value = {
        show: true,
        message
    };
};

const showAboutDialog = () => {
    aboutDialog.value = true;
};

onMounted(async () => {
    if (Cookies.get('token')) {
        await getProfile();
    }
});
</script>

<style scoped>
.v-data-table {
    max-width: 100%;
}
.v-avatar {
    border-radius: 50%;
}
.v-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
