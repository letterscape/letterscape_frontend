import React, { ReactNode } from 'react';
import { createWeb3Modal, useWalletInfo } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

import { WagmiProvider, useAccount } from 'wagmi';
import { arbitrum, mainnet, sepolia } from 'wagmi/chains';
import { mainnet_local } from '@/store/EtherClient/clients';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { walletStore, lsNFTStore, marketStore } from '@/store';


const queryClient = new QueryClient();

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = '04a801d386dc7fa9f9ef84df2ea3ea35';

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'http://127.0.0.1:8080', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [arbitrum, sepolia, mainnet_local] as const;
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});



function WrapQueryClientProvider({ children }: { children: ReactNode }) {

  const { wallet } = walletStore;
  const { putAccountAddress } = wallet;  
  
  const account = useAccount();

  putAccountAddress(account);

  // const { lsNFT } = lsNFTStore;
  // const { setWallet } = lsNFT;
  // setWallet(wallet);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const Web3Provider = function Web3ModalProvider({ children }: { children: ReactNode }) {

  return (
    <WagmiProvider config={config}>
      <WrapQueryClientProvider >{children}</WrapQueryClientProvider>
    </WagmiProvider>
  );
}
// const Web3Connect = function ConnectButton() {

//   return (
//     <div className="web3-wallet">
//       {/* <span>Web3 Wallet</span> */}
//       <Web3Provider>
//         <w3m-button />
//       </Web3Provider>
//     </div>
//   );
// };
export default Web3Provider;
