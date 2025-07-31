import {
  VotingAccount,
  getCloseInstruction,
  getVotingProgramAccounts,
  getVotingProgramId,
  getDecrementInstruction,
  getIncrementInstruction,
  getInitializeInstruction,
  getSetInstruction,
} from '@project/anchor'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { generateKeyPairSigner } from 'gill'
import { useWalletUi } from '@wallet-ui/react'
import { useWalletTransactionSignAndSend } from '../solana/use-wallet-transaction-sign-and-send'
import { useClusterVersion } from '@/components/cluster/use-cluster-version'
import { toastTx } from '@/components/toast-tx'
import { useWalletUiSigner } from '@/components/solana/use-wallet-ui-signer'
import { install as installEd25519 } from '@solana/webcrypto-ed25519-polyfill'

// polyfill ed25519 for browsers (to allow `generateKeyPairSigner` to work)
installEd25519()

export function useVotingProgramId() {
  const { cluster } = useWalletUi()
  return useMemo(() => getVotingProgramId(cluster.id), [cluster])
}

export function useVotingProgram() {
  const { client, cluster } = useWalletUi()
  const programId = useVotingProgramId()
  const query = useClusterVersion()

  return useQuery({
    retry: false,
    queryKey: ['get-program-account', { cluster, clusterVersion: query.data }],
    queryFn: () => client.rpc.getAccountInfo(programId).send(),
  })
}

export function useVotingInitializeMutation() {
  const { cluster } = useWalletUi()
  const queryClient = useQueryClient()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => {
      const voting = await generateKeyPairSigner()
      return await signAndSend(getInitializeInstruction({ payer: signer, voting }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await queryClient.invalidateQueries({ queryKey: ['voting', 'accounts', { cluster }] })
    },
    onError: () => toast.error('Failed to run program'),
  })
}

export function useVotingDecrementMutation({ voting }: { voting: VotingAccount }) {
  const invalidateAccounts = useVotingAccountsInvalidate()
  const signer = useWalletUiSigner()
  const signAndSend = useWalletTransactionSignAndSend()

  return useMutation({
    mutationFn: async () => await signAndSend(getDecrementInstruction({ voting: voting.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useVotingIncrementMutation({ voting }: { voting: VotingAccount }) {
  const invalidateAccounts = useVotingAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async () => await signAndSend(getIncrementInstruction({ voting: voting.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useVotingSetMutation({ voting }: { voting: VotingAccount }) {
  const invalidateAccounts = useVotingAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async (value: number) =>
      await signAndSend(
        getSetInstruction({
          voting: voting.address,
          value,
        }),
        signer,
      ),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useVotingCloseMutation({ voting }: { voting: VotingAccount }) {
  const invalidateAccounts = useVotingAccountsInvalidate()
  const signAndSend = useWalletTransactionSignAndSend()
  const signer = useWalletUiSigner()

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(getCloseInstruction({ payer: signer, voting: voting.address }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}

export function useVotingAccountsQuery() {
  const { client } = useWalletUi()

  return useQuery({
    queryKey: useVotingAccountsQueryKey(),
    queryFn: async () => await getVotingProgramAccounts(client.rpc),
  })
}

function useVotingAccountsInvalidate() {
  const queryClient = useQueryClient()
  const queryKey = useVotingAccountsQueryKey()

  return () => queryClient.invalidateQueries({ queryKey })
}

function useVotingAccountsQueryKey() {
  const { cluster } = useWalletUi()

  return ['voting', 'accounts', { cluster }]
}
