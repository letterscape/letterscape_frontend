import { base } from "../Base"

// All properties on a domain are optional
export const domain = {
  name: 'LSMarket',
  version: '1',
  chainId: 1,
  verifyingContract: base.marketAddress,
} as const
 
// The named list of all type definitions
export const types = {
  WNFT: [
    { name: 'owner', type: 'address' },
    { name: 'nft', type: 'address' },
    { name: 'tokenId', type: 'uint256' },
    { name: 'price', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
  ],
} as const