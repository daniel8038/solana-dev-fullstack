import {
  findAssociatedTokenPda,
  getCreateAssociatedTokenInstruction,
  getCreateAssociatedTokenInstructionAsync,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import {
  address,
  appendTransactionMessageInstruction,
  appendTransactionMessageInstructions,
  createTransactionMessage,
  getSignatureFromTransaction,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import { rpcClient, singer, wsClient } from "./utils/client";
const token_address = address("BGS83xZpYvS8E45vfvAkAUFWoV8M7dJAbmmVmzJ9F6Qy");
const ata_account = await findAssociatedTokenPda({
  mint: token_address,
  owner: singer.address,
  tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
});
console.log("ata_account", ata_account);
const createAtaIx = await getCreateAssociatedTokenInstructionAsync({
  payer: singer,
  mint: token_address,
  owner: singer.address,
});
const { value } = await rpcClient.getLatestBlockhash().send();

const txMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayerSigner(singer, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(value, tx),
  (tx) => appendTransactionMessageInstructions([createAtaIx], tx)
);

const signTx = await signTransactionMessageWithSigners(txMessage);
await sendAndConfirmTransactionFactory({
  rpc: rpcClient,
  rpcSubscriptions: wsClient,
})(signTx, { commitment: "confirmed" });

const sig = getSignatureFromTransaction(signTx);

console.log("Transaction Signature: ", sig);
