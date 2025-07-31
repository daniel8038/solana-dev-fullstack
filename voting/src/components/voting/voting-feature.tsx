import { WalletButton } from '../solana/solana-provider'
import { VotingButtonInitialize, VotingList, VotingProgramExplorerLink, VotingProgramGuard } from './voting-ui'
import { AppHero } from '../app-hero'
import { useWalletUi } from '@wallet-ui/react'

export default function VotingFeature() {
  const { account } = useWalletUi()

  return (
    <VotingProgramGuard>
      <AppHero
        title="Voting"
        subtitle={
          account
            ? "Initialize a new voting onchain by clicking the button. Use the program's methods (increment, decrement, set, and close) to change the state of the account."
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <VotingProgramExplorerLink />
        </p>
        {account ? (
          <VotingButtonInitialize />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletButton />
          </div>
        )}
      </AppHero>
      {account ? <VotingList /> : null}
    </VotingProgramGuard>
  )
}
