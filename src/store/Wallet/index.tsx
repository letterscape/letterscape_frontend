import { makeAutoObservable } from 'mobx';
import { WalletClient, createWalletClient, custom } from 'viem';
import { etherWindow, transport, walletClient as etherWalletClient } from '../EtherClient';
import { mainnet_local } from '../EtherClient/clients';
import { stringify } from 'querystring';


export class Wallet {

  constructor() {
    // makeAutoObservable: 自动将所有属性和方法转换为可观察对象。
    makeAutoObservable(this);
    this.createWalletClient();
  }

  walletInfo = {
    name: '',
    icon: '',
  }

  accountInfo = {
    address: '',
  }
  
  account: `0x${string}` = '0x0';
  chainId = '0';

  walletClient: WalletClient = etherWalletClient

  setWalletInfo = (param : any) => {
    this.walletInfo.name = param?.name || ''
    this.walletInfo.icon = param?.icon || ''
  }

  putAccountAddress = (param : any) => {
    if (param!.address) {
      this.account = param!.address;
    }
    if (param!.chainId) {
      this.chainId = String(param!.chainId);
    }
    this.createWalletClient();
  }

  createWalletClient = () => {
    // let walletTransport = transport
    // if (typeof etherWindow !== "undefined") {
    //   walletTransport = custom(etherWindow.ethereum!)
    // }
    // this.walletClient = createWalletClient({
    //   account: this.accountInfo.address as `0x${string}`,
    //   chain: mainnet_local,
    //   transport: transport
    // })
    // return createWalletClient
    this.getWalletClient();
 }

 getWalletClient = async () => {
  // if (typeof etherWindow !== "undefined") {

  //   const [account] = await etherWindow.ethereum!.request({ method: 'eth_requestAccounts' });
  //   this.account = account;
  // }

  this.walletClient = createWalletClient({
    account: this.account,
    chain: mainnet_local,
    transport: transport
  })
 }

}

const wallet = new Wallet();
export { wallet };