import { makeAutoObservable } from 'mobx';
import { encodePacked, hexToBigInt, keccak256, toHex } from 'viem';

class Scape {

  constructor() {
    makeAutoObservable(this); 
  }

  getTokenURI = async (tokenId: `0x${string}`) => {
    
  }
}

export type ScapeProperty = {
  creator: `0x${string}`
  hostname: string
  originURI: string
  positionId: string
}

const scape = new Scape();
export {scape};