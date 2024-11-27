import { CustomTransport, Transport, createPublicClient, createWalletClient, custom, http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import {mainnet_local} from './clients'
import 'viem/window';

export const transport : Transport = http(
  // 'https://eth-mainnet.g.alchemy.com/v2/ToDOPYbbyBKiCdbWdhYBf6FrS3M23oAk'
  'http://127.0.0.1:8545'
);

export const client = createPublicClient({
  chain: mainnet_local,
  transport: transport
});

export const sepoliaClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});


export const walletClient = createWalletClient({
  chain: mainnet_local,
  transport: transport,
});

export const etherWindow = (typeof window !== "undefined") ? window : undefined;