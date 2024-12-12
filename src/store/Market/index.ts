import { makeAutoObservable } from 'mobx'
import { client, sepoliaClient, walletClient } from '../EtherClient'
import { abi as marketABI } from './abi'
import { base } from '../Base'
import {
  ByteArray,
  encodePacked,
  hexToBigInt,
  keccak256,
  toHex,
} from 'viem'
import { WLSNFT, WnftInfo, lsNFT } from '../LsNFT'
import { wallet } from '../Wallet'
import { domain, types } from '../Market/data'
import { wnftApi } from '@/api/wnft/wnft'
import { successCode } from '@/lib/constants'
import { symbolDimension } from '@/lib/chainTerms'

class Market {

  constructor() {
    makeAutoObservable(this)
  }

  getNonces = async () => {
    const data = await client.readContract({
      account: wallet.account,
      address: base.marketAddress,
      abi: marketABI,
      args: [wallet.account],
      functionName: 'nonces',
    })
    return data
  }

  mint = async ({tokenId, price, interval, title, hostname, originURI, firstCreate}: {tokenId: `0x${string}`, price: bigint, interval: number, title: string, hostname: string | undefined, originURI: string, firstCreate: boolean}) => {
    
    if (!wallet || !wallet.account) {
      alert("please connect wallet first")
      return
    }

    const creator = lsNFT.getCreator(tokenId);
    let realPrice = price * symbolDimension(Number(wallet.chainId));
    let mintfee = BigInt(0);
    
    if (!firstCreate && wallet.account !== creator) {
      mintfee = await this.getMintFee(realPrice) as bigint
    }
    
    const { request } = await client.simulateContract({
      account: wallet.account,
      address: base.marketAddress,
      abi: marketABI,
      args: [hexToBigInt(tokenId), realPrice, interval, originURI],
      functionName: 'mint',
      value: mintfee
    })
    const txHash = await walletClient.writeContract(request)
    
    let params = {
      tokenId: tokenId,
      chainId: wallet.chainId,
      owner: wallet.account,
      price: price.toString(),
      interval: interval,
      title: title,
      hostname: hostname,
      originUri: originURI,
      txHash: txHash
    }
    wnftApi.mint(params).then(data => {
      console.log("mint response: ", data)
    }).catch((error) => {
      alert(error)
    })
  }

  list = async (wnft: WnftInfo) => {
    console.log('list nft: ', toHex(wnft.tokenId))
    const nonces = await this.getNonces() as bigint
    
    const tokenId = hexToBigInt(wnft.tokenId)
    const sellerSign = await wallet.walletClient.signTypedData({
      domain,
      types,
      primaryType: 'WNFT',
      message: {
        owner: wallet.account,
        nft: base.nftAddress,
        tokenId: tokenId,
        price: BigInt(wnft.price),
        nonce: nonces,
      },
      account: wallet.account
    })
    console.log('sellerSign: ', hexToBigInt(sellerSign))
    const { request } = await client.simulateContract({
      account: wallet.account,
      address: base.marketAddress,
      abi: marketABI,
      args: [tokenId, wnft.price, sellerSign],
      functionName: 'list',
    })
    const txHash = await walletClient.writeContract(request)
    let params = {
      wnftId: wnft.wnftId,
      owner: wallet.account,
      txHash: txHash
    }
    wnftApi.list(params).then(data => {
      console.log("mint response: ", data)
    }).catch((error) => {
      alert(error)
    })
  }

  buy = async (wnftId: string, tokenId: `0x${string}`, buyPrice: bigint, sellPrice: bigint) => {
    console.log('buy nft: ', tokenId)
    
    const holdfee = await this.getHoldFee(tokenId) as bigint
    
    const { request } = await client.simulateContract({
      account: wallet.account,
      address: base.marketAddress,
      abi: marketABI,
      args: [tokenId, buyPrice, sellPrice],
      functionName: 'buy',
      value: buyPrice + holdfee
    })
    const txHash = await walletClient.writeContract(request)
    let params = {
      wnftId: wnftId,
      txHash: txHash
    }
    wnftApi.buy(params).then(data => {
      console.log("buy response: ", data)
    }).catch((error) => {
      alert(error)
    })
  }

  burn = async (wnftId: string, tokenId: `0x${string}`) => {
    console.log('burn nft: ', tokenId)
    const { request } = await client.simulateContract({
      account: wallet.account,
      address: base.marketAddress,
      abi: marketABI,
      args: [tokenId],
      functionName: 'burn'
    })
    const txHash = await walletClient.writeContract(request)
    let params = {
      wnftId: wnftId,
      txHash: txHash
    }
    wnftApi.burn(params).then(data => {
      console.log("burn response: ", data)
    }).catch((error) => {
      alert(error)
    })
  }

  getHoldFee = async (tokenId: `0x${string}`) => {
    const data = await client.readContract({
      account: wallet.account,
      address: base.marketAddress,
      abi: marketABI,
      args: [tokenId, 3],
      functionName: 'getHoldFee',
    })
    return data
  }

  payHoldFee = async (wnftId: string, tokenId: `0x${string}`, holdfee: bigint) => {
    const { request } = await client.simulateContract({
      account: wallet.account,
      address: base.marketAddress,
      abi: marketABI,
      args: [tokenId],
      functionName: 'payHoldFee',
      value: holdfee
    })
    const txHash = await walletClient.writeContract(request)
    let params = {
      wnftId: wnftId,
      txHash: txHash
    }
    wnftApi.payHoldfee(params).then(data => {
      console.log("payHoldfee response: ", data)
      alert("pay success")
    }).catch((error) => {
      alert(error)
    })
  }

  getMintFee = async (price: bigint) => {
    const data = await client.readContract({
      account: wallet.account,
      address: base.marketAddress,
      abi: marketABI,
      args: [price],
      functionName: 'getMintFee',
    })
    return data
  }
}

const market = new Market()
export { market }