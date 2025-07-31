import { ellipsify } from '@wallet-ui/react'
import {
  useVotingAccountsQuery,
  useVotingCloseMutation,
  useVotingDecrementMutation,
  useVotingIncrementMutation,
  useVotingInitializeMutation,
  useVotingProgram,
  useVotingProgramId,
  useVotingSetMutation,
} from './voting-data-access'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExplorerLink } from '../cluster/cluster-ui'
import { VotingAccount } from '@project/anchor'
import { ReactNode } from 'react'

export function VotingProgramExplorerLink() {
  const programId = useVotingProgramId()

  return <ExplorerLink address={programId.toString()} label={ellipsify(programId.toString())} />
}

export function VotingList() {
  const votingAccountsQuery = useVotingAccountsQuery()

  if (votingAccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!votingAccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {votingAccountsQuery.data?.map((voting) => (
        <VotingCard key={voting.address} voting={voting} />
      ))}
    </div>
  )
}

export function VotingProgramGuard({ children }: { children: ReactNode }) {
  const programAccountQuery = useVotingProgram()

  if (programAccountQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!programAccountQuery.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }

  return children
}

function VotingCard({ voting }: { voting: VotingAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Voting: {voting.data.count}</CardTitle>
        <CardDescription>
          Account: <ExplorerLink address={voting.address} label={ellipsify(voting.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <VotingButtonIncrement voting={voting} />
          <VotingButtonSet voting={voting} />
          <VotingButtonDecrement voting={voting} />
          <VotingButtonClose voting={voting} />
        </div>
      </CardContent>
    </Card>
  )
}

export function VotingButtonInitialize() {
  const mutationInitialize = useVotingInitializeMutation()

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Voting {mutationInitialize.isPending && '...'}
    </Button>
  )
}

export function VotingButtonIncrement({ voting }: { voting: VotingAccount }) {
  const incrementMutation = useVotingIncrementMutation({ voting })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}

export function VotingButtonSet({ voting }: { voting: VotingAccount }) {
  const setMutation = useVotingSetMutation({ voting })

  return (
    <Button
      variant="outline"
      onClick={() => {
        const value = window.prompt('Set value to:', voting.data.count.toString() ?? '0')
        if (!value || parseInt(value) === voting.data.count || isNaN(parseInt(value))) {
          return
        }
        return setMutation.mutateAsync(parseInt(value))
      }}
      disabled={setMutation.isPending}
    >
      Set
    </Button>
  )
}

export function VotingButtonDecrement({ voting }: { voting: VotingAccount }) {
  const decrementMutation = useVotingDecrementMutation({ voting })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}

export function VotingButtonClose({ voting }: { voting: VotingAccount }) {
  const closeMutation = useVotingCloseMutation({ voting })

  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (!window.confirm('Are you sure you want to close this account?')) {
          return
        }
        return closeMutation.mutateAsync()
      }}
      disabled={closeMutation.isPending}
    >
      Close
    </Button>
  )
}
