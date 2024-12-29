import { spaceApi } from '@/api/space/space'
import { successCode } from '@/lib/constants'
import { makeAutoObservable } from 'mobx'
import { simulateContract, writeContract } from '@wagmi/core'
// import { client, walletClient } from '../EtherClient'
import { wallet } from '../Wallet'
import { base } from '../Base'
import { spaceABI } from './abi'
import { rpcConfig } from '../EtherClient/clients'

class Space {

  constructor() {
    makeAutoObservable(this)
  }

  create = async ({content, originURI}: {content: SpaceContent, originURI: string}) => {
    const { request } = await simulateContract(rpcConfig, {
      account: wallet.account,
      address: base.spaceAddress,
      abi: spaceABI,
      args: [content.contentId, content.title, content.resource, originURI],
      functionName: 'create'
    })
    const txHash = await writeContract(rpcConfig,request)
    debugger
    spaceApi.create(content).then(resp => {
      if (resp && resp.code === successCode) {
        // alert("success");
      } else {
        // alert(resp.msg);
      }
    }).catch((error) => {
      // alert(error)
    })
  }

  publish = async (contentId: string) => {
    const { request } = await simulateContract(rpcConfig, {
      account: wallet.account,
      address: base.spaceAddress,
      abi: spaceABI,
      args: [contentId, true],
      functionName: 'setShowStatus'
    })
    const txHash = await writeContract(rpcConfig, request)
    let params = {
      contentId: contentId
    }
    spaceApi.publish(params).then(resp => {
      if (resp && resp.code === successCode) {
        // alert("success");
      } else {
        // alert(resp.msg);
      }
    }).catch((error) => {
      // alert(error)
    })
  }
  
}

export type SpaceContent = {
  contentId: string
  chainId: string
  author: `0x${string}`
  title: string
  resource: string
  favouriteNum: number
  label: number
  isShown: boolean
}

const space = new Space();
export { space }