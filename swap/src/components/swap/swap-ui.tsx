import { ellipsify } from '@wallet-ui/react'
import {
  useSwapAccountsQuery,
  useSwapCloseMutation,
  useSwapDecrementMutation,
  useSwapIncrementMutation,
  useSwapInitializeMutation,
  useSwapProgram,
  useSwapProgramId,
  useSwapSetMutation,
} from './swap-data-access'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExplorerLink } from '../cluster/cluster-ui'
import { SwapAccount } from '@project/anchor'
import { ReactNode } from 'react'

export function SwapProgramExplorerLink() {
  const programId = useSwapProgramId()

  return <ExplorerLink address={programId.toString()} label={ellipsify(programId.toString())} />
}

export function SwapList() {
  const swapAccountsQuery = useSwapAccountsQuery()

  if (swapAccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!swapAccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {swapAccountsQuery.data?.map((swap) => (
        <SwapCard key={swap.address} swap={swap} />
      ))}
    </div>
  )
}

export function SwapProgramGuard({ children }: { children: ReactNode }) {
  const programAccountQuery = useSwapProgram()

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

function SwapCard({ swap }: { swap: SwapAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Swap: {swap.data.count}</CardTitle>
        <CardDescription>
          Account: <ExplorerLink address={swap.address} label={ellipsify(swap.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <SwapButtonIncrement swap={swap} />
          <SwapButtonSet swap={swap} />
          <SwapButtonDecrement swap={swap} />
          <SwapButtonClose swap={swap} />
        </div>
      </CardContent>
    </Card>
  )
}

export function SwapButtonInitialize() {
  const mutationInitialize = useSwapInitializeMutation()

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Swap {mutationInitialize.isPending && '...'}
    </Button>
  )
}

export function SwapButtonIncrement({ swap }: { swap: SwapAccount }) {
  const incrementMutation = useSwapIncrementMutation({ swap })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}

export function SwapButtonSet({ swap }: { swap: SwapAccount }) {
  const setMutation = useSwapSetMutation({ swap })

  return (
    <Button
      variant="outline"
      onClick={() => {
        const value = window.prompt('Set value to:', swap.data.count.toString() ?? '0')
        if (!value || parseInt(value) === swap.data.count || isNaN(parseInt(value))) {
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

export function SwapButtonDecrement({ swap }: { swap: SwapAccount }) {
  const decrementMutation = useSwapDecrementMutation({ swap })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}

export function SwapButtonClose({ swap }: { swap: SwapAccount }) {
  const closeMutation = useSwapCloseMutation({ swap })

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
