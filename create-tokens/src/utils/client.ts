import {
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
} from "@solana/kit";

import fs from "fs";
import { clusterConfig } from "./utils";
let keypairFile = fs.readFileSync("keypair.json");

const devnetConfig = clusterConfig.Devnet;
const keypairBytes = new Uint8Array(JSON.parse(keypairFile.toString()));
const rpcClient = createSolanaRpc(devnetConfig.rpc);
const wsClient = createSolanaRpcSubscriptions(devnetConfig.wss);
const singer = await createKeyPairSignerFromBytes(keypairBytes);
console.log("singer", singer.address);
export { wsClient, rpcClient, keypairBytes, singer };
