import { makeAutoObservable } from 'mobx';
import { encodePacked, hexToBigInt, keccak256, toHex } from 'viem';

class Adscape {

  constructor() {
    makeAutoObservable(this); 
  }

  getTokenURI = async (tokenId: `0x${string}`) => {
    
  }
}

export type AdscapeProperty = {
  creator: `0x${string}`
  hostname: string
  originURI: string
  positionId: string
}

const adscape = new Adscape();
export {adscape};