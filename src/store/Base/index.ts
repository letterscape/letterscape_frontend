import { makeAutoObservable } from 'mobx';
import { encodeFunctionData, hexToBigInt, keccak256, toHex } from 'viem';
import { ethers } from 'ethers';
import { mainnet_local } from '../EtherClient/clients';

class Base {
  constructor() {
    makeAutoObservable(this);
  }


  adminAddress = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720" as `0x${string}`;
  nftAddress = "0xF62eEc897fa5ef36a957702AA4a45B58fE8Fe312" as `0x${string}`;
  marketAddress = "0x364C7188028348566E38D762f6095741c49f492B" as `0x${string}`;
  spaceAddress = "0x0" as `0x${string}`;

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