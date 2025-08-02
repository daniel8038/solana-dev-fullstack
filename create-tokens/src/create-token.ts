import { keypairBytes, rpcClient, wsClient } from "./utils/client";
import {
  appendTransactionMessageInstruction,
  appendTransactionMessageInstructions,
  createKeyPairSignerFromBytes,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  Instruction,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import {
  getInitializeMint2Instruction,
  getMintSize,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "@solana-program/token-2022";
import { getCreateAccountInstruction } from "@solana-program/system";
const singer = await createKeyPairSignerFromBytes(keypairBytes);
console.log("singer", singer.address);
const balance = await rpcClient.getBalance(singer.address).send();
console.log("balance", balance);
// 创建mint账户 或者说 存储token数据的账户
const mint = await generateKeyPairSigner();
const mint_size = BigInt(getMintSize());
const min_rent = await rpcClient
  .getMinimumBalanceForRentExemption(mint_size)
  .send();
// 创建和分配一个账户，并将其所有权交给 TOKEN_2022_PROGRAM_ADDRESS
const mint_account_ix = getCreateAccountInstruction({
  payer: singer,
  newAccount: mint,
  lamports: min_rent,
  space: mint_size,
  programAddress: TOKEN_2022_PROGRAM_ADDRESS,
});

// 依赖于第一个指令创建好的账户。它调用 TOKEN_2022_PROGRAM_ADDRESS 程序的初始化功能，向账户中写入代币的元数据
const initializeMintIx = getInitializeMint2Instruction({
  mint: mint.address,
  decimals: 9,
  mintAuthority: singer.address,
});

const ixs = [mint_account_ix, initializeMintIx];
// blockhash
const { value: latestBlockhash } = await rpcClient.getLatestBlockhash().send();
// message
const txMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayer(singer.address, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  (tx) => appendTransactionMessageInstructions(ixs, tx)
  // (tx) => appendTransactionMessageInstruction(mint_account_ix, tx),
  // (tx) => appendTransactionMessageInstruction(initializeMintIx, tx)
);
const signedTransaction = await signTransactionMessageWithSigners(txMessage);

await sendAndConfirmTransactionFactory({
  rpc: rpcClient,
  rpcSubscriptions: wsClient,
})(signedTransaction, { commitment: "confirmed" });

const transactionSignature = getSignatureFromTransaction(signedTransaction);

console.log("Mint Address:", mint.address);
console.log("Transaction Signature:", transactionSignature);
