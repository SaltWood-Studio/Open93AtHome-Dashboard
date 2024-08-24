<template>
  <v-card>
    <v-card-title class="font-weight-black red-bg white-text">
      {{ clusterName }}
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <p>{{ clusterId }}</p>
      <p>{{ endPoint }}</p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    clusterId: {
      type: String,
      required: true,
    },
    clusterName: {
      type: String,
      required: true,
    },
    endPoint: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.red-bg {
  background-color: rgb(255,61,113);
}

.white-text {
  color: white;
}
</style>