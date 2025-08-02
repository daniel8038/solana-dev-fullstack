import {
  Blockhash,
  createSolanaClient,
  createTransaction,
  generateKeyPairSigner,
  Instruction,
  isSolanaError,
  KeyPairSigner,
  signTransactionMessageWithSigners,
} from 'gill'
import {
  fetchSwap,
  getCloseInstruction,
  getDecrementInstruction,
  getIncrementInstruction,
  getInitializeInstruction,
  getSetInstruction,
} from '../src'
// @ts-ignore error TS2307 suggest setting `moduleResolution` but this is already configured
import { loadKeypairSignerFromFile } from 'gill/node'

const { rpc, sendAndConfirmTransaction } = createSolanaClient({ urlOrMoniker: process.env.ANCHOR_PROVIDER_URL! })

describe('swap', () => {
  let payer: KeyPairSigner
  let swap: KeyPairSigner

  beforeAll(async () => {
    swap = await generateKeyPairSigner()
    payer = await loadKeypairSignerFromFile(process.env.ANCHOR_WALLET!)
  })

  it('Initialize Swap', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getInitializeInstruction({ payer: payer, swap: swap })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSER
    const currentSwap = await fetchSwap(rpc, swap.address)
    expect(currentSwap.data.count).toEqual(0)
  })

  it('Increment Swap', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getIncrementInstruction({
      swap: swap.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchSwap(rpc, swap.address)
    expect(currentCount.data.count).toEqual(1)
  })

  it('Increment Swap Again', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getIncrementInstruction({ swap: swap.address })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchSwap(rpc, swap.address)
    expect(currentCount.data.count).toEqual(2)
  })

  it('Decrement Swap', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getDecrementInstruction({
      swap: swap.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchSwap(rpc, swap.address)
    expect(currentCount.data.count).toEqual(1)
  })

  it('Set swap value', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getSetInstruction({ swap: swap.address, value: 42 })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    const currentCount = await fetchSwap(rpc, swap.address)
    expect(currentCount.data.count).toEqual(42)
  })

  it('Set close the swap account', async () => {
    // ARRANGE
    expect.assertions(1)
    const ix = getCloseInstruction({
      payer: payer,
      swap: swap.address,
    })

    // ACT
    await sendAndConfirm({ ix, payer })

    // ASSERT
    try {
      await fetchSwap(rpc, swap.address)
    } catch (e) {
      if (!isSolanaError(e)) {
        throw new Error(`Unexpected error: ${e}`)
      }
      expect(e.message).toEqual(`Account not found at address: ${swap.address}`)
    }
  })
})

// Helper function to keep the tests DRY
let latestBlockhash: Awaited<ReturnType<typeof getLatestBlockhash>> | undefined
async function getLatestBlockhash(): Promise<Readonly<{ blockhash: Blockhash; lastValidBlockHeight: bigint }>> {
  if (latestBlockhash) {
    return latestBlockhash
  }
  return await rpc
    .getLatestBlockhash()
    .send()
    .then(({ value }) => value)
}
async function sendAndConfirm({ ix, payer }: { ix: Instruction; payer: KeyPairSigner }) {
  const tx = createTransaction({
    feePayer: payer,
    instructions: [ix],
    version: 'legacy',
    latestBlockhash: await getLatestBlockhash(),
  })
  const signedTransaction = await signTransactionMessageWithSigners(tx)
  return await sendAndConfirmTransaction(signedTransaction)
}
