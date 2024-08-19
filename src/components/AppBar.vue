<template>
  <v-app>
    <v-app-bar color="primary" app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>93Home-Dash</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :permanent="$vuetify.display.smAndUp"
      :clipped="$vuetify.display.mdAndUp"
    >
      <!-- 加个空白 -->
      <v-list-item>
        <v-row>
          <v-col cols="12">
            <div style="height: 10px;"></div>
          </v-col>
        </v-row>
      </v-list-item>
      <v-list density="compact" nav>
        <v-list-item :to="{ path: '/' }" prepend-icon="mdi-view-dashboard" title="总览"></v-list-item>
        <v-list-item :to="{ path: '/rank' }" prepend-icon="mdi-trophy-variant" title="节点排行"></v-list-item>
        <v-list-item link title="Ray是巨佬"></v-list-item>
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
export default {
  data: () => ({
    drawer: false,
  }),
  mounted() {
    this.drawer = this.$vuetify.display.smAndUp; // 根据屏幕大小设置抽屉栏的初始状态
  },
};
</script>
