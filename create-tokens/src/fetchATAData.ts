import {
  fetchToken,
  findAssociatedTokenPda,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { rpcClient, singer } from "./utils/client";
import { address } from "@solana/kit";
const token_address = address("BGS83xZpYvS8E45vfvAkAUFWoV8M7dJAbmmVmzJ9F6Qy");
const [ata_account] = await findAssociatedTokenPda({
  owner: singer.address,
  mint: token_address,
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});
const data = await fetchToken(rpcClient, ata_account);
console.log(data);
