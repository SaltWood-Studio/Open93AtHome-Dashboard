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
          
          <v-card-text v-if="!success && !failure">
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
              subtitle="点击跳转到 GitHub"
              title="使用 GitHub 登录"
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
          
          <!-- 登录成功 -->
          <v-card-text v-else-if="success">
            <h2 class="mb-5">登录成功！</h2>
            <h3>欢迎回来，{{ username }}</h3>
            <p class="mb-3">今天你也很聪明！</P>
            <p>如未自动跳转，请手动跳转</p>
          </v-card-text>
          
          <!-- 登录失败 -->
          <v-card-text v-else>
            <h2 class="mb-5">登录失败</h2>
            <p class="mb-2">服务器炸啦！</p>
            <p>{{ failurerea }}</p>
          </v-card-text>

        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  name: 'login',
  data() {
    return {
      loading: false,
      success: false,
      failure: false,
    };
  },
  created() {
    if (Cookies.get('token')) {
      this.redirectToHome();
    } else if (this.$route.query.code) {
      this.loading = true;
      this.callback(this.$route.query.code).finally(() => {
        this.loading = false;
      });
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async getcode() {
      try {
        this.loading = true;
        const response = await axios.get('/93AtHome/dashboard/oauth_id');
        const redirect_uri = window.location.href;
        const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${response.data}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
        window.location.href = redirectUrl;
      } catch (error) {
        this.loading = false;
        console.error("Failed to get client_id:", error);
      }
    },
    async callback(code) {
      try {
        const Url = `/93AtHome/dashboard/user/oauth`;
        const response = await axios.get(Url, {
          params: {
            code: code,
          },
        });

        if (response.status === 200) {
          this.success = true;
          this.loading = false;
          this.username = response.data.username
          setTimeout(() => {
            this.redirectToHome();
          }, 3000);
        } else {
          this.failure = true;
          console.log(response.data);
          console.log("Login failed with status:", response.status);
          this.failurerea = response.data.error;
          this.loading = false;
        }
      } catch (error) {
         if (error.response && error.response.status === 500) {
            this.failure = true;
            this.failurerea = error.response.data.error;
            this.loading = false;
        } else {
            this.failure = true;
            console.error("Login failed:", error);
            this.failurerea = error;
            this.loading = false;
        }
      }
    },
    redirectToHome() {
      this.$router.push('..');
    },
  },
};
</script>
