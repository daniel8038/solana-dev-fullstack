import { getMintToCheckedInstruction } from "@solana-program/token-2022";
import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
} from "@solana/kit";
import { singer } from "./utils/client";
/* ... 简单  直接省略
const mintToIx = await getMintToCheckedInstruction({
  amount: 1000000000,
  mint: "",
  token: "",
  decimals: 9,
});
const transactionMessage = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayerSigner(singer, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  (tx) => appendTransactionMessageInstructions([mintToIx], tx)
);
*/

// getTransferCheckedInstruction  为发送代币
// getBurnCheckedInstruction 销毁代币
// getCloseAccountInstruction 销毁账户
// getApproveCheckedInstruction 授权
// getRevokeInstruction 撤销授权
// getTokenAccountsByOwner 获取所有代币账户
