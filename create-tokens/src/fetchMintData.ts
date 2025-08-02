import { address } from "@solana/kit";
import { rpcClient } from "./utils/client";
import { fetchMint } from "@solana-program/token-2022";

const token_address = address("BGS83xZpYvS8E45vfvAkAUFWoV8M7dJAbmmVmzJ9F6Qy");
const mint = await fetchMint(rpcClient, token_address);
console.log("mint", mint);
