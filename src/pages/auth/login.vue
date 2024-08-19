<template>
  <v-app>
    <v-main>
      <v-container fluid class="d-flex justify-center align-center" style="height: 100vh;">
        <v-card 
        width="90%" 
        height="90%" 
        class="text-center" 
        style="display: flex; 
        align-items: center; 
        justify-content: center;"
        >
          <v-card-actions class="pa-2" style="position: absolute; top: 0; left: 0;">
            <v-btn icon @click="goBack" color="indigo">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <h1 class="mb-5">93@Home - 登录</h1>
            <p class="mb-10">目前仅支持使用社交账户登录，也许未来也是</p>
            <v-card
              :disabled="loading"
              :loading="loading"
              color="indigo"
              append-icon="mdi-open-in-new"
              class="mx-auto"
              max-width="344"
              prepend-icon="mdi-github"
              subtitle="点击跳转到 Github"
              title="使用 Github 登录"
              variant="outlined"
              @click="getcode"
            >
            <template v-slot:loader="{ isActive }">
              <v-progress-linear
              :active="isActive"
              color="deep-purple"
              height="4"
              indeterminate
              ></v-progress-linear>
            </template>
          </v-card>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'login',
  data: () => ({
    loading: false,
  }),
  created() {
    if (this.$route.query.code) {
      this.loading = true;
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async getcode() {
      this.loading = true
      setTimeout(() => (this.loading = false), 2000)
    },
  },
};
</script>