<template>
    <v-app-bar color="primary" app>
        <v-app-bar-nav-icon @click="openDrawer"></v-app-bar-nav-icon>
        <v-toolbar-title>93Home-Dash</v-toolbar-title>
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

                    </div>
                </v-card-text>
            </v-card>
        </v-menu>

    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :permanent="$vuetify.display.mdAndUp" :clipped="$vuetify.display.mdAndUp">
        <v-list class="mt-10" density="compact" nav>
            <v-list-item :to="{ path: '/dashboard' }" exact prepend-icon="mdi-view-dashboard" title="总览"></v-list-item>
            <v-list-item :to="{ path: '/dashboard/rank' }" exact prepend-icon="mdi-trophy-variant"
                title="节点排行"></v-list-item>
            <v-list-group v-if="isLoggedIn">
                <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" prepend-icon="mdi-server" title="节点管理"></v-list-item>
                </template>

                <v-list-item :to="{ path: '/dashboard/clusters' }" title="我的节点"></v-list-item>

                <v-list-item v-if="isAdmin" :to="{ path: '/dashboard/clusters/admin' }" title="超级节点管理"></v-list-item>

            </v-list-group>

        </v-list>
    </v-navigation-drawer>

    <v-container fluid>
        <router-view></router-view>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Cookies from 'js-cookie';

const router = useRouter();
const isLoggedIn = ref(false);
const isAdmin = ref(false);
const userName = ref('未登录');
const avatarUrl = ref('default_avatar.png');
const drawer = ref(null);

const openDrawer = () => {
    drawer.value = !drawer.value;
}

const getProfile = async () => {
    try {
        const response = await axios.get('/93AtHome/dashboard/user/profile');
        avatarUrl.value = response.data.avatar_url;
        userName.value = response.data.login;
    } catch (error) {
        isLoggedIn.value = false;
        Cookies.remove('token');
        console.error("Failed to get profile:", error);
    }
}

const login = () => {
    router.push('/dashboard/auth/login');
}

const logout = () => {
    Cookies.remove('token');
    location.reload();
}

onMounted(async () => {
    if (Cookies.get('token')) {
        isLoggedIn.value = true;
        getProfile();
        if (Cookies.get('adminToken')) {
            isAdmin.value = true;
        }
    }
})

</script>