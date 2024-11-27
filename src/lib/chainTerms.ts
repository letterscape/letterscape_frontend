import { BNB_DECIMAL, BNB_TO_WEI, ETH_DECIMAL, ETH_TO_WEI } from "./constants"

export const chainName = (chainId: number | undefined): string => {
  if (!chainId) {
    return ""
  }
  switch (chainId) {
    case 1: // ethereum mainnet
      return "Ethereum"
    case 10: // OP Mainnet
      return "Optimism"
    case 8453: // Base
      return "Base"
    case 42161: // Arbitrum One
      return "Arbitrum One"
    case 56: // BNB Smart Chain Mainnet
      return "BNB"
    default: 
      return ""
  }
}

export const symbol = (chainId: number | undefined): string => {
  if (!chainId) {
    return ""
  }
  switch (chainId) {
    case 1: // ethereum mainnet
    case 10: // OP Mainnet
    case 8453: // Base
    case 42161: // Arbitrum One
      return "ETH"
    case 56: // BNB Smart Chain Mainnet
      return "BNB"
    default: 
      return ""
  }
}

export const symbolDimension = (chainId: number | undefined): bigint => {
  if (!chainId) {
    return BigInt(1)
  }
  switch (chainId) {
    case 1: // ethereum mainnet
    case 10: // OP Mainnet
    case 8453: // Base
    case 42161: // Arbitrum One
      return ETH_TO_WEI
    case 56: // BNB Smart Chain Mainnet
      return BNB_TO_WEI
    default: 
      return BigInt(1)
  }
}

export const symbolDecimal = (chainId: number | undefined): number => {
  if (!chainId) {
    return 1
  }
  switch (chainId) {
    case 1: // ethereum mainnet
    case 10: // OP Mainnet
    case 8453: // Base
    case 42161: // Arbitrum One
      return ETH_DECIMAL
    case 56: // BNB Smart Chain Mainnet
      return BNB_DECIMAL
    default: 
      return 1
  }
}