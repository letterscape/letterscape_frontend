import { CustomTransport, Transport, createPublicClient, createWalletClient, custom, http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import {mainnet_local, bsc_testnet} from './clients'
import 'viem/window';

export const transport : Transport = http(
  // 'https://eth-mainnet.g.alchemy.com/v2/ToDOPYbbyBKiCdbWdhYBf6FrS3M23oAk'
  // 'http://127.0.0.1:8545'
  // 'https://data-seed-prebsc-1-s1.binance.org:8545/'
  'https://bnb-testnet.g.alchemy.com/v2/ToDOPYbbyBKiCdbWdhYBf6FrS3M23oAk'
);

export const client = createPublicClient({
  // chain: mainnet_local,
  chain: bsc_testnet,
  transport: transport
});

export const sepoliaClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export const bsctestnetClient = createPublicClient({
  chain: bsc_testnet,
  transport: transport
})

export const walletClient = createWalletClient({
  // chain: mainnet_local,
  chain: bsc_testnet,
  transport: http()
});

export const etherWindow = (typeof window !== "undefined") ? window : undefined;