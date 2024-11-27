'use client';

import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { blockChainStore } from '@/store';

const StorageAt = () => {
  const { blockChain } = blockChainStore;
  const { lockInfos, getStorage, clearStorageInfo } = blockChain;

  return (
    <>
      <div>
        <span>
          <button onClick={getStorage}>storageAt</button>
        </span>
        <span> </span>
        <span>
          <button onClick={clearStorageInfo}>clear</button>
        </span>
      </div>
      <div>
        {lockInfos.map((item: any, index: any) => (
          <div key={index} className="item">
            <span>locks[{index}]: </span>
            <span>user:</span>
            <i>{item.user}, </i>
            <span>startTime:</span>
            <i>{item.startTime}, </i>
            <span>amount:</span>
            <i>{item.amount}</i>
          </div>
        ))}
      </div>
    </>
  );
};
export default observer(StorageAt);
