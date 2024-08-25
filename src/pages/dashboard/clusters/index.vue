<template>
  <AppBar>
    <v-row>
      <v-col cols="12" md="8" lg="4" v-for="(card, index) in cards" :key="index">
        <ClusterCard :clusterId="card.clusterId" :clusterName="card.clusterName" :endPoint="card.endPoint" :bandwidth="card.bandwidth" :createdAt="card.createdAt"/>
      </v-col>

      <v-col cols="12" md="8" lg="4">
        <v-card height="460px">
          <v-container fluid class="d-flex justify-center align-center" style="height: 100%;">
            <v-card 
              width="95%" 
              height="95%" 
              class="text-center" 
              style="display: flex; 
              align-items: center; 
              justify-content: center;"
              variant="text"
              @click="showInput = true"
            >
              <v-card-text>
                <v-icon icon="mdi-paperclip-plus" size="45"></v-icon>
                <h3>绑定节点</h3>
              </v-card-text>
            </v-card>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showInput" max-width="500px">
      <v-card prepend-icon="mdi-paperclip" title="绑定节点">
        <v-card-text>
          <v-text-field v-model="clusterId" label="ClusterId" required></v-text-field>
          <v-text-field v-model="clusterSecret" label="ClusterSecret" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="cancel">取消</v-btn>
          <v-btn text @click="bindcluster">提交</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="loading" max-width="320" persistent>
      <v-list color="primary" rounded="lg">
        <v-list-item prepend-icon="mdi-paperclip" title="绑定节点中..">
          <template v-slot:prepend>
            <div class="pe-4">
              <v-icon color="primary" size="x-large"></v-icon>
            </div>
          </template>

          <template v-slot:append>
            <v-progress-circular color="primary" indeterminate="disable-shrink" size="16" width="2"></v-progress-circular>
          </template>
        </v-list-item>
      </v-list>
    </v-dialog>

    <v-dialog v-model="successDialog" max-width="500px">
      <v-card prepend-icon="mdi-paperclip-check" title="绑定成功">
        <v-card-text>
          节点ID {{ clusterId }} 已绑定到您的账号上
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="bindsuccess">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="errorDialog" max-width="500px">
      <v-card prepend-icon="mdi-paperclip-remove" title="绑定错误">
        <v-card-text>
          {{ failurerea }}
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="bindsuccess">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AppBar>
</template>

<script>
import AppBar from '@/components/AppBar.vue';
import ClusterCard from '@/components/ClusterCard.vue';
import axios from 'axios';

export default {
  components: {
    AppBar,
    ClusterCard,
  },
  data: () => ({
    cards: [
      //{ clusterId: '1', clusterName: '这是一个节点', endPoint: '1.4.5.1:1145', bandwidth: 300, createdAt: '1145-14-19 14:45:14' },
      //{ clusterId: '2', clusterName: '这是两个节点', endPoint: '1.4.5.1:1145', bandwidth: 300, createdAt: '1145-14-19 14:45:14' },
    ],
    showInput: false,
    loading: false,
    successDialog: false,
    errorDialog: false,
    clusterId: '',
    clusterSecret: '',
    failurerea: '',
  }),
  methods: {
    async bindcluster() {
      this.loading = true;
      try {
        const Url = `/93AtHome/dashboard/user/bindCluster`;
        const response = await axios.post(Url, {
            clusterId: this.clusterId,
            clusterSecret: this.clusterSecret,
        });
        this.loading = false;
        if (response.status === 200) {
          this.successDialog = true;
        }
      } catch (error) {
        this.loading = false;
        if (error.response && error.response.status) {
          if (error.response.status === 401) {
            this.failurerea = '登录已失效';
          } else if (error.response.status === 404) {
            this.failurerea = '不存在该节点或该节点已被绑定';
          } else {
            this.failurerea = '发生未知错误';
          }
        } else {
          this.failurerea = '网络错误';
        }
        this.errorDialog = true;
        console.error("Failed to bind cluster:", error);
      }
    },
    cancel() {
      this.showInput = false;
      this.loading = false;
      this.successDialog = false;
      this.errorDialog = false;
      this.clusterId = '';
      this.clusterSecret = '';
    },
    bindsuccess() {
      this.cancel();
      location.reload();
    }
  },
  async created() {
    try {
      const response = await axios.get('/93AtHome/dashboard/user/clusters');
      this.cards = response.data.map((item) => ({
        clusterId: item.clusterId,
        clusterName: item.clusterName,
        endPoint: item.endpoint,
        bandwidth: item.bandwidth,
        createdAt: item.isOnline,
      }));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  },
};
</script>
