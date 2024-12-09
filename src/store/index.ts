import * as React from 'react';
import { configure } from 'mobx';
import { globalStore } from './Global';
import { blockChain } from './BlockChain';
import { wallet } from './Wallet';
import { market } from './Market';
import { lsNFT } from './LsNFT';
import { posts } from './Posts';
import { scape } from './Scape';
import { space } from './Space';

configure({ enforceActions: 'always' }); // 任何状态都能只能通过actions来修改，在实际开发中也包括新建状态。

export const stores = { globalStore };

export const storesContext = React.createContext(stores);

export const useStores = () => React.useContext(storesContext);

export const StoresProvider = storesContext.Provider;

export const blockChainStore = { blockChain };
export const walletStore = { wallet };
export const marketStore = { market };
export const lsNFTStore = { lsNFT };
export const postsStore = { posts };
export const scapeStore = { scape };
export const spaceStore= { space };
