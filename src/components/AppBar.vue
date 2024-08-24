<template>
  <v-app>
    <v-app-bar color="primary" app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
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
              <v-btn
                variant="text"
                prepend-icon="mdi-login"
                v-if="!isLoggedIn"
                @click="login"
                >
                  登录
              </v-btn>

              <v-btn
                variant="text"
                prepend-icon="mdi-logout"
                v-if="isLoggedIn"
                @click="logout"
                >
                  登出
              </v-btn>

            </div>
          </v-card-text>
        </v-card>
      </v-menu>

    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :permanent="$vuetify.display.smAndUp"
      :clipped="$vuetify.display.mdAndUp"
    >
      <v-list class="mt-10" density="compact" nav>
        <v-list-item :to="{ path: '.' }" exact prepend-icon="mdi-view-dashboard" title="总览"></v-list-item>
        <v-list-item :to="{ path: 'rank' }" exact prepend-icon="mdi-trophy-variant" title="节点排行"></v-list-item>
        <v-divider v-if="isLoggedIn" class="mb-1"></v-divider>
        <v-list-item v-if="isLoggedIn" :to="{ path: 'clusters' }" exact prepend-icon="mdi-server" title="我的节点"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  data: () => ({
    drawer: false,
    isLoggedIn: false,
    userName: '未登录',
    avatarUrl: 'default_avatar.png',
  }),
  created(){
    if(Cookies.get('token')){
      this.isLoggedIn = true;
      this.getProfile();
    }
    else{

    }
  },
  mounted() {
    this.drawer = this.$vuetify.display.smAndUp;
  },
  methods: {
    async getProfile() {
      try {
        this.loading = true;
        const response = await axios.get('/93AtHome/dashboard/user/profile');
        this.avatarUrl = response.data.avatar_url;
        this.userName = response.data.login;
      } catch (error) {
        this.loading = false;
        console.error("Failed to get client_id:", error);
      }
    },
    login() {
      this.$router.push('auth/login');
    },
    logout() {
      Cookies.remove('token');
      location.reload();
    },
  }
};
</script>
