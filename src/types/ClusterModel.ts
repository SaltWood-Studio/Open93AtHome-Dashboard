export interface Cluster {
    rank?: number;
    name: string;
    clusterId: string;
    clusterName: string;
    bandwidth: number;
    sponsor: string;
    sponsorUrl: string;
    sponsorBanner: string;
    endpoint: string;
    port: number;
    createdAt: string;
    downTime: string;
    downReason: string;
    isBanned: boolean;
    isOnline: boolean;
    fullsize: boolean;
    isMasterStats: boolean;
    isProxy: boolean;
    noWarden: boolean;
    shards: number;
}