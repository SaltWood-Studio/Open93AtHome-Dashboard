<template>
  <v-container class="mt-0 pt-0">
    <!-- 搜索栏和刷新按钮 -->
    <v-row class="mb-0 align-center">
      <v-col cols="11">
        <v-text-field v-model="search" label="搜索同步源" clearable append-icon="mdi-magnify" class="search-bar" />
      </v-col>
      <v-col cols="1" class="d-flex justify-end align-center">
        <v-btn color="primary" large @click="showDialog = true" class="btn">
          <v-icon left>mdi-refresh</v-icon> 更新文件
        </v-btn>
      </v-col>
    </v-row>

    <!-- 卡片展示 -->
    <v-row class="mt-1">
      <v-col v-for="source in filteredSources" :key="source.name" cols="12" md="4" class="mb-3">
        <v-card>
          <v-card-title>
            <v-avatar v-if="source.imageExists" size="40" class="mr-3">
              <img :src="`/assets/sources/${source.name}.png`" alt="source image" class="avatar-image" />
            </v-avatar>
            <span :class="{
              headline: true,
              'no-avatar': !source.imageExists,
            }">
              {{ source.name }}
            </span>
          </v-card-title>
          <v-card-subtitle>
            <v-chip color="primary" text-color="white">
              {{ formatDate(source.lastUpdated) }}
            </v-chip>
          </v-card-subtitle>
          <v-card-text>
            <div>文件数量: {{ source.count }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-if="error" type="error" dismissible>{{ error }}</v-alert>

    <v-dialog v-model="showDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">确认更新</v-card-title>
        <v-card-text>是否确认要进行文件更新？</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="updateFiles">确认</v-btn>
          <v-btn color="secondary" @click="showDialog = false">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="3000">
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn color="primary" variant="text" @click="snackbar = false">
          关闭
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { formatDate } from "@/types/Utilities";

interface Source {
  name: string;
  imageExists?: boolean;
  lastUpdated: string;
  count: number;
}

const sources = ref<Source[]>([]);
const search = ref<string>("");
const error = ref<string>("");
const showDialog = ref<boolean>(false);
const snackbar = ref<boolean>(false);
const snackbarMessage = ref<string>("");


// 获取同步源信息
const checkImage = async (source: Source): Promise<void> => {
  try {
    await axios.get(`/assets/sources/${source.name}.png`);
    source.imageExists = true;
  } catch {
    source.imageExists = false;
  }
};

const fetchSources = async (): Promise<void> => {
  try {
    const response = await axios.get<Source[]>("/api/stats/source");
    sources.value = response.data;

    for (const source of sources.value) {
      await checkImage(source);
    }
  } catch (error) {
    console.error("Failed to fetch sources:", error);
  }
};

// 过滤后的同步源列表，根据搜索内容进行筛选
const filteredSources = computed(() => {
  return sources.value.filter((source) =>
    source.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

// 文件更新的 POST 请求
const updateFiles = async (): Promise<void> => {
  try {
    const response = await axios.post("/api/admin/update");

    const { success } = response.data;
    if (success) {
      snackbarMessage.value = "成功开始更新文件。";
    } else {
      snackbarMessage.value = `文件更新失败，${response.data.message}。`;
    }
  } catch (err) {
    snackbarMessage.value = "请求失败，请检查网络或稍后再试。";
  } finally {
    snackbar.value = true;
    showDialog.value = false;
  }
};

// 在组件挂载时获取同步源数据
onMounted(fetchSources);
</script>

<style scoped>
.headline {
  font-weight: bold;
}

.no-avatar {
  margin-left: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 确保图片填充整个圆形区域 */
  border-radius: 50%;
  /* 确保图片是圆形的 */
}

.mt-0 {
  margin-top: 0 !important;
  /* 整体向上靠近页面顶端 */
}

.search-bar {
  margin-right: 0px;
  /* 恢复搜索栏与刷新按钮的原始间距 */
}

.large-btn {
  height: 56px;
  /* 增大按钮高度 */
  font-size: 16px;
  /* 增大字体以提升按钮可见度 */
}
</style>

<route lang="yaml">
meta:
  layout: appbar
</route>
