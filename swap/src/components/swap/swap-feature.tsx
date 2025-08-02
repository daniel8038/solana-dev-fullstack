import { WalletButton } from '../solana/solana-provider'
import { SwapButtonInitialize, SwapList, SwapProgramExplorerLink, SwapProgramGuard } from './swap-ui'
import { AppHero } from '../app-hero'
import { useWalletUi } from '@wallet-ui/react'

export default function SwapFeature() {
  const { account } = useWalletUi()

  return (
    <SwapProgramGuard>
      <AppHero
        title="Swap"
        subtitle={
          account
            ? "Initialize a new swap onchain by clicking the button. Use the program's methods (increment, decrement, set, and close) to change the state of the account."
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <SwapProgramExplorerLink />
        </p>
        {account ? (
          <SwapButtonInitialize />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletButton />
          </div>
        )}
      </AppHero>
      {account ? <SwapList /> : null}
    </SwapProgramGuard>
  )
}
