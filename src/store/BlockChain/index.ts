import { makeAutoObservable, runInAction } from 'mobx';
import { client, sepoliaClient } from '../EtherClient';
import {
  encodePacked,
  hexToBigInt,
  keccak256,
  parseAbiItem,
  toHex,
} from 'viem';

class BlockChain {
  constructor() {
    // makeAutoObservable: 自动将所有属性和方法转换为可观察对象。
    makeAutoObservable(this);
  }

  loading = true;

  blockNum = '0';
  owner = '';
  tokenURI = '';

  blockInfo = {
    blockNumber: '',
    blockHash: '',
  };

  balance = BigInt(1);

  readonly USER: bigint =
    BigInt(0xffffffffffffffffffffffffffffffff0000000000000000);
  readonly TIME: BigInt =
    BigInt(0x0000000000000000000000000000000000000000ffffffff);

  lockInfos = [];

  txLog = '';

  unwatchBlock = () => {};
  unwatchTx = () => {};

  abiText = [
    {
      inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
      name: 'ownerOf',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: '_tokenId', type: 'uint256' }],
      name: 'tokenURI',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
  ];

  getBlockNumber = async () => {
    runInAction(() => {
      this.loading = true;
    });
    this.blockNum = String(await client.getBlockNumber());
  };

  getOwner = async (param: string) => {
    const data = await client.readContract({
      address: '0x0483b0dfc6c78062b9e999a82ffb795925381415',
      abi: this.abiText,
      functionName: 'ownerOf',
      args: [param],
    });
    this.owner = data as string;
  };

  storageAt = async (param: any) => {
    const bytecode = await sepoliaClient.getStorageAt({
      address: param.address,
      slot: param.slot,
      blockTag: 'latest',
    });
    const data = hexToBigInt(`0x${String(bytecode).substring(2)}`);
    return data;
  };

  getTokenURI = async (param: string) => {
    debugger
    const data = await client.readContract({
      address: '0x0483b0dfc6c78062b9e999a82ffb795925381415',
      abi: this.abiText,
      functionName: 'tokenURI',
      args: [param],
    });
    this.tokenURI = data as string;
  };

  watchBlock = async () => {
    this.unwatchBlock = client.watchBlocks({
      onBlock: (block) => {
        if (block) {
          this.blockInfo.blockNumber = block.number.toString();
          this.blockInfo.blockHash = block.hash;
        }
      },
      pollingInterval: 1_000,
    });
  };

  watchTx = async (param: string) => {
    const unwatch = client.watchEvent({
      address: param as `0x${string}`,
      event: parseAbiItem(
        'event Transfer(address indexed from, address indexed to, uint256 value)'
      ),
      onLogs: (logs) => {
        if (logs && logs.length > 0) {
          const { blockNumber, blockHash, topics, data } =
            logs[logs.length - 1];
          const amount = parseInt(data) / 10e6;
          this.txLog = `在 ${blockNumber} 区块 ${blockHash} 交易中从 ${topics[1]} 转账 ${amount} USDT 到 ${topics[2]}`;
        }
      },
    });
    this.unwatchTx = unwatch;
    // console.log(this.unwatchTx);
  };

  getBalance = async (params: `0x${string}`) => {
    this.balance = await client.getBalance({
      address: params,
      blockTag: 'safe'
    })
  }

  unWatchBlockAction = () => {
    this.unwatchBlock.call(this.unwatchBlock);
    this.blockInfo = { blockHash: '', blockNumber: '' };
  };

  unWatchTxAction = () => {
    this.unwatchTx.call(this.unwatchTx);
    this.txLog = '';
  };

  getStorage = async () => {
    let paramLen = {
      address: '0x254Ff72FBc2d17c9d21a46d2b6be07CC24b260c8',
      slot: toHex(0),
    };
    const len = Number(await this.storageAt(paramLen));

    const q = keccak256(encodePacked(['uint256'], [BigInt(0)]));
    for (let i = 0; i < len; i++) {
      let param1 = {
        address: '0x254Ff72FBc2d17c9d21a46d2b6be07CC24b260c8',
        slot: toHex(hexToBigInt(q) + BigInt(i * 2)),
      };
      const res1 = await this.storageAt(param1);

      let param2 = {
        address: '0x254Ff72FBc2d17c9d21a46d2b6be07CC24b260c8',
        slot: toHex(hexToBigInt(q) + BigInt(i * 2 + 1)),
      };
      const res2 = await this.storageAt(param2);
      let lockInfo = {
        user: toHex(res1).substring(0, 42),
        startTime: (res1 & this.TIME.valueOf()).toString(),
        amount: res2.toString(),
      };
      // this.lockInfos.push(lockInfo);
    }
  };

  clearStorageInfo = () => {
    this.lockInfos = [];
  };

  queryBalance = (param: string) => {
    this.getBalance(`0x${param.slice(2)}`)
  }
}

const blockChain = new BlockChain();
export { blockChain };
