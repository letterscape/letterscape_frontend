import { makeAutoObservable } from 'mobx';
import { encodeFunctionData, hexToBigInt, keccak256, toHex } from 'viem';
import { ethers } from 'ethers';
import { mainnet_local } from '../EtherClient/clients';

class Base {
  constructor() {
    makeAutoObservable(this);
  }


  // local
  // adminAddress = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720" as `0x${string}`;
  // nftAddress = "0x359f320DFA5237dBA263e8C978Cb743f4C7bFb09" as `0x${string}`;
  // marketAddress = "0xeC6c32bd206f661F6BF22d7dE2ECe4Db8020039B" as `0x${string}`;
  // spaceAddress = "0x565b23e0D9E2C5Fa3A8f979f190BB96E2Cde945a" as `0x${string}`;

  // bsc testnet
  adminAddress = "0xD571Cb930A525c83D7D2B7442a34b09c5F1cCa3E" as `0x${string}`;
  nftAddress = "0xb35A11CDb37992163961320CDC1A0EED46321F13" as `0x${string}`;
  marketAddress = "0xBD9c7a82F7A9AD60c69f232788D0BB70Dd32DFC9" as `0x${string}`;
  spaceAddress = "0xF88B35b228B89076B385Ce700aa014fBA7e13515" as `0x${string}`;

  ecdsaName = "LSMarket";
  ecdsaVersion = "1";
  hashPtr = toHex("19_01");
  chainId = mainnet_local.id;

  abiCoder = ethers.AbiCoder.defaultAbiCoder();

  eip712Domain = this.abiCoder.encode(["string", "string", "uint256", "address"], [this.ecdsaName, this.ecdsaVersion, this.chainId, this.marketAddress]) as `0x${string}`

  eip712HashTypedDataV4 = (structHash: `0x${string}`) => {
    const prefix = '0x1901';
    const domain = keccak256(this.eip712Domain);
    const raw = (prefix + domain.slice(2) + structHash.slice(2)) as `0x${string}`;
    debugger
    return keccak256(raw);
  }

}

const base = new Base();
export {base};