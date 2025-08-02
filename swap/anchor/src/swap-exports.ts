// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, address, getBase58Decoder, SolanaClient } from 'gill'
import { SolanaClusterId } from '@wallet-ui/react'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Swap, SWAP_DISCRIMINATOR, SWAP_PROGRAM_ADDRESS, getSwapDecoder } from './client/js'
import SwapIDL from '../target/idl/swap.json'

export type SwapAccount = Account<Swap, string>

// Re-export the generated IDL and type
export { SwapIDL }

// This is a helper function to get the program ID for the Swap program depending on the cluster.
export function getSwapProgramId(cluster: SolanaClusterId) {
  switch (cluster) {
    case 'solana:devnet':
    case 'solana:testnet':
      // This is the program ID for the Swap program on devnet and testnet.
      return address('6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF')
    case 'solana:mainnet':
    default:
      return SWAP_PROGRAM_ADDRESS
  }
}

export * from './client/js'

export function getSwapProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getSwapDecoder(),
    filter: getBase58Decoder().decode(SWAP_DISCRIMINATOR),
    programAddress: SWAP_PROGRAM_ADDRESS,
  })
}
