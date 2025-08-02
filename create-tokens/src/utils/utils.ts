type NetConfig = { rpc: string; wss: string };
type NetType = "Mainnet" | "Devnet";

const clusterConfig: Record<NetType, NetConfig> = {
  Mainnet: {
    rpc: "https://api.mainnet-beta.solana.com",
    wss: "wss://api.mainnet-beta.solana.com",
  },
  Devnet: {
    rpc: "https://api.devnet.solana.com",
    wss: "wss://api.devnet.solana.com",
  },
};

export { clusterConfig };
