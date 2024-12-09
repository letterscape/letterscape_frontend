import { makeAutoObservable } from 'mobx';
import { client, sepoliaClient, walletClient } from '../EtherClient';
import { base } from '../Base';
import {
  encodePacked,
  hexToBigInt,
  keccak256,
  toHex,
} from 'viem';
import { abi as lsNFTABI } from './abi';
import { abi as marketABI } from '../Market/abi';
import { wallet } from '../Wallet';
import { wnftApi } from '@/api/wnft/wnft';
import { successCode } from '@/lib/constants';
import { getAddress } from "ethers/address";


class LsNFT {

  constructor() {
    makeAutoObservable(this);
  }

  contractOwner: string = '0x0';

  // contractAddress = '0xadee9e9a309e3f13f1c92462c3cd6b9d2229feed';

  wnftList: WLSNFT[] = [];

  wnftInfoList: WnftInfo[] = [];

  nftGoodsList: NFTGoods[] = [];
  // <tokenId, index>
  nftGoodsMap: Map<string, number> = new Map();

  initNftGoods = (title: string, tokenId: `0x${string}`, originURI: string): NFTGoods => {
    debugger
    const nftGoods: NFTGoods = {
      id: toHex(tokenId),
      title: title,
      content: '',
      originURI: originURI,
      isTitlePicture: false,
      isListed: false,
      shouldBurn: false,
      wnft: null
    }

    this.nftGoodsList.push(nftGoods);
    this.nftGoodsMap.set(tokenId, this.nftGoodsList.length - 1);
    return nftGoods;
  }

  setMarket = async (params: string) => {
    const { request } = await client.simulateContract({
      address: base.nftAddress,
      abi: lsNFTABI,
      functionName: 'setMarket',
      args: [`0x${params.slice(2)}`],
      account: wallet.account,
    })
    wallet.walletClient.writeContract(request).then(async resp => {
      debugger
      console.log("resp: ", resp);
    }).catch(error => {
      debugger
      console.log("setMarket error: ", error);
    });
  }

  getOwner = async () => {
    const data = await client.readContract({
      address: base.nftAddress,
      abi: lsNFTABI,
      functionName: 'owner',
      args: [],
      account: wallet.account,
    })
    return data as string;
  }

  genTokenId = ({creator, hostname, originURI, positionId}: {creator: `0x${string}`, hostname: string, originURI: string, positionId: string}): `0x${string}` => {
    if (Number(positionId) > 127) {
      throw new Error("positionId too long");
    }

    const tokenId = (hexToBigInt(creator) << BigInt(96)) + this.genFp({hostname, originURI, positionId});
    return toHex(tokenId);
  }

  genFp = ({hostname, originURI, positionId}: {hostname: string, originURI: string, positionId: string}): bigint => {
    const websiteHex: string = keccak256(encodePacked(['string'], [hostname]));
    const websiteFp = websiteHex.slice(0, 10) as `0x${string}`;

    const uriHex: string = keccak256(encodePacked(['string'], [originURI]));
    const uriFp = uriHex.slice(0, 10) as `0x${string}`;

    return (hexToBigInt(websiteFp) << BigInt(64)) + (hexToBigInt(uriFp) << BigInt(32)) + BigInt(positionId);
  }

  getCreator = (tokenId: `0x${string}`): string | undefined => {

    if (tokenId && tokenId.length >= 66) {
      return getAddress(`0x${tokenId.slice(2, 42)}`);
    }
    return undefined;
  }

  getFpFromTokenId = (tokenId: `0x${string}`): `0x${string}` => {
    if (tokenId && tokenId.length >= 66) {
      return `0x${tokenId.slice(42, tokenId.length)}`
    }
    return '0x0'
  }

  getTokenURI = async (tokenId: `0x${string}`) => {
    const data = await client.readContract({
      address: base.nftAddress,
      abi: lsNFTABI,
      functionName: 'tokenURI',
      args: [hexToBigInt(tokenId)],
      account: wallet.account,
    })
    return data;
  }

  setTokenURI = async (tokenId: `0x${string}`, tokenURI: string) => {
    const { request } = await client.simulateContract({
      account: wallet.account,
      address: base.nftAddress,
      abi: lsNFTABI,
      args: [hexToBigInt(tokenId), tokenURI],
      functionName: 'setTokenURI'
    })
    const txHash = await walletClient.writeContract(request)
  }

  getOriginURI = async (tokenId: `0x${string}`) => {
    const data = await client.readContract({
      address: base.nftAddress,
      abi: lsNFTABI,
      functionName: 'getOriginURI',
      args: [tokenId],
      account: wallet.account,
    })
    return data as string;
  }

  getTokenIds = async () => {
    debugger
    const data = await client.readContract({
      address: base.nftAddress,
      abi: lsNFTABI,
      functionName: 'getTokenIds',
      account: wallet.account,
    })
    return data;
  }

  getNFTList = async () => {
    const tokenIds = await this.getTokenIds() as Array<BigInt>;
    tokenIds.forEach(async tokenId => {
      const data = await client.readContract({
        address: base.marketAddress,
        abi: marketABI,
        functionName: 'getWNFT',
        args: [tokenId],
        account: wallet.account,
      });
      // debugger
      const wnft = data as WLSNFT;
      const isExpired = await this.detectExpired(tokenId.valueOf()) as boolean;
      wnft.isExpired = isExpired
      this.wnftList.push(wnft);
    });
  }

  getNFTGoodsById = (tokenId: string): NFTGoods | null => {
    const index: number | undefined = this.nftGoodsMap.get(tokenId);
    if (index != undefined && index >= 0) {
      return this.nftGoodsList[index]
    }
    return null;
  }

  updateNFTGoodsById = (nftGoods: NFTGoods) => {
    const tokenId = toHex(nftGoods.id);
    const index: number | undefined = this.nftGoodsMap.get(tokenId);
    if (index) {
      this.nftGoodsList[index] = nftGoods;
    }
  }

  detectExpired = async (tokenId: bigint) => {
    const data = await client.readContract({
      address: base.marketAddress,
      abi: marketABI,
      functionName: 'isExpired',
      args: [tokenId],
      account: wallet.account,
    })
    console.log('detectExpired: ',toHex(tokenId), data);
    return data;
  }

  refreshNFTGoods = async (from: string) => {
    await this.getNFTList();
    console.log('refresh wnft from [%s] start: ', from);
    this.wnftList.forEach(wnft => {
      const index = this.nftGoodsMap.get(toHex(wnft.tokenId));
      if (index !== undefined) {
        const nftGoods = this.nftGoodsList[index];
        if (wnft.isListed) {
          nftGoods.isListed = true;
        }
        nftGoods.wnft = wnft;
        console.log('refreshed: ', nftGoods.wnft);
      }
    })
    console.log('refresh wnft finished');
  }

  deleteNFTGoods = (tokenId: string) => {
    const index = this.nftGoodsMap.get(toHex(tokenId));
    if (index !== undefined) {
      this.nftGoodsList.slice(index, 1);
    }
  }

  getPage = async (params: any) => {
    let pageParams = {
      ...params,
      owner: wallet.account
    }
    debugger
    await wnftApi.page(pageParams).then(resp => {
      debugger
      if (resp && resp.code === successCode) {
        this.wnftInfoList = resp.data.list
      } else {
        alert(resp.msg);
      }
    }).catch((error) => {
      console.log(error);
    })
  }
}

export type WnftInfo = {
  wnftId: string
  tokenId: `0x${string}`
  chainId: string
  owner: `0x${string}`
  price: string
  interval: number
  deadline: 0,
  isPaid: boolean
  isListed: boolean
  isExpired: boolean
  isBurnt: boolean
  title: string
  content: string
  hostname: string
  originUri: string
  createTime: string
  modifyTime: string
  isTitlePicture: boolean
}

export type WLSNFT = {
  deadline: string
  isPaid: boolean
  isListed: boolean
  isExpired: boolean
  interval: number
  owner: `0x${string}`
  tokenId: `0x${string}`
  price: bigint
  lastDealPrice: bigint
}

export type NFTGoods = {
  id: string
  title: string
  content: string
  originURI: string
  isTitlePicture: boolean
  isListed: boolean
  shouldBurn: boolean
  wnft: WLSNFT | null
}


const lsNFT = new LsNFT();
export { lsNFT };