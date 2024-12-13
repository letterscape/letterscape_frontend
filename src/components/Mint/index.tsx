// "use client"
import { observer } from 'mobx-react-lite';
import { useAccount, useWriteContract } from 'wagmi';
import {abi} from '@/store/LsNFT/abi';
import { hexToBigInt, toHex } from 'viem';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import { marketStore, lsNFTStore } from '@/store';
import { NFTGoods } from '@/store/LsNFT';
import { client } from '@/store/EtherClient';
import { symbol, symbolDecimal, symbolDimension } from '@/lib/chainTerms';
import { divideBigIntWithDecimal } from '@/lib/utils';


const NoTokenForm = () => {

  const router = useRouter();
  const account = useAccount();
  
  const { market } = marketStore;
  const { mint } = market;

  const { lsNFT } = lsNFTStore;
  const { genTokenId } = lsNFT;

  const [uri, setURI] = useState('');
  const [showGo, setShowGo] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get('title') as string 
    // const to = formData.get('to') as string 
    const originURI = formData.get('originURI') as string
    const typeId = formData.get('typeId') as string
    const positionId = formData.get('positionId') as string
    const sellPrice = formData.get('sellPrice') as string 
    const interval = formData.get('interval') as string
    const address = account.address || '0x00';

    if (!originURI || originURI.length == 0) {
      alert("originURI cannot be empty")
    }
    
    const hostname = new URL(originURI).origin;
    console.log("hostname: ", hostname);

    let tokenIdProperty = {
      creator: address,
      hostname,
      originURI,
      positionId,
      typeId
    }
    const tokenId = genTokenId(tokenIdProperty)
    
    let params = {
      tokenId: tokenId,
      chainId: account.chainId,
      price: BigInt(sellPrice),
      interval: Number(interval),
      title: title,
      hostname: hostname,
      originURI: originURI,
      firstCreate: true
    }
    // 
    await mint(params);
    alert("mint success");
    router.push("/lists").then(() => {
      router.reload();
    });
  }

  const handleGo = async () => {
    router.push(uri);
  }

  function handleURLChange(event: ChangeEvent<HTMLInputElement>): void {
    const content = event.target.value;
    setURI(content);
    if (content.includes('http')) {
      setShowGo(true);
    } else {
      setShowGo(false);
    }
  }

  return (
    <>
      <form onSubmit={submit} >
        <div className='space-y-12'>
          <label className="input input-bordered input-primary flex items-center gap-2">
            Title
            <input name="title" type="text" className="grow" placeholder="set a title to NFT" required />
          </label>
          <label className="input input-bordered input-primary flex items-center gap-2">
            originURI
            <input name="originURI" type="text" className="grow" placeholder="originURI" onChange={handleURLChange} required />
            {showGo && <button onClick={handleGo} type="button"><kbd>Go</kbd></button>}
          </label>
          <label className="input input-bordered input-primary flex items-center gap-2">
            typeId
            <input name="typeId" type="text" className="grow" placeholder="typeId of NFT" required />
          </label>
          <label className="input input-bordered input-primary flex items-center gap-2">
            positionId
            <input name="positionId" type="text" className="grow" placeholder="id of ad in the layout,length must be less than 100" required />
          </label>
          <label className="input input-bordered input-primary flex items-center gap-2">
            sellPrice
            <input name="sellPrice" type="text" className="grow" placeholder="set a sell price for NFT" required />
            <span>{symbol(account.chainId)}</span>
          </label>
          <label className="input input-bordered input-primary flex items-center gap-2">
            interval
            <input name="interval" type="text" className="grow" placeholder="the survival time of NFT after first trading" required />
            <span><p>hour(s)</p></span>
          </label>
        </div>
        <div className='flex justify-center p-8'>
          <button className="btn btn-success" type="submit">Mint</button>
        </div>
      </form>
    </>
  );
}

const TokenForm = () => {
  const router = useRouter();
  const account = useAccount();

  const { market } = marketStore;
  const { mint, getMintFee } = market;

  const { lsNFT } = lsNFTStore;
  const { getOriginURI, getCreator } = lsNFT;

  const [uri, setURI] = useState('');
  const [showGo, setShowGo] = useState(false);
  const [tokenId, setTokenId] = useState('')
  const [mintfee, setMintfee] = useState('0');
  const [sellPrice, setSellPrice] = useState<bigint>(BigInt(0));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get('title') as string; 
    let tokenId = formData.get('tokenId') as string;
    if ((tokenId && !tokenId.includes('0x')) || tokenId.length < 66) {
      alert('tokenId not right');
      return;
    }
    const sellPrice = formData.get('sellPrice') as string ;
    const interval = formData.get('interval') as string;
    const originURI = await getOriginURI(tokenId as `0x${string}`);

    if (!originURI) {
      alert('originURI not exists');
      return;
    }

    let params = {
      tokenId: tokenId as `0x${string}`,
      chainId: account.chainId,
      price: BigInt(sellPrice),
      interval: Number(interval),
      title: title,
      hostname: undefined,
      originURI: originURI,
      firstCreate: false
    }
    
    await mint(params);
    router.push('/lists');
  }

  const handleGo = async () => {
    router.push(uri);
  }

  function handleURLChange(event: ChangeEvent<HTMLInputElement>): void {
    const content = event.target.value;
    if (content.includes('http')) {
      setShowGo(true);
    } else {
      setShowGo(false);
    }
  }

  async function handleTokenIdChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    
    const value = event.target.value;
    if (!value || value =="" || (value && !value.includes('0x')) || value.length < 66) {
      return;
    }
    // const tokenId = toHex(value);
    const tokenId = value as `0x${string}`
    setTokenId(tokenId);
    const originURI = await getOriginURI(tokenId);
    setURI(originURI);
  }
  
  async function handleSellPriceChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    
    if (!(event.target.value)) {
      return;
    }
    const value = BigInt(event.target.value);
    
    if (value <= 0) {
      return
    }
    setSellPrice(value);
  }

  async function onMintDialog(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();

    if (!account || !account.address) {
      alert("please connect wallet");
      return
    }

    const element = document.getElementById('mint_modal') as HTMLDialogElement | null;
    element!.showModal();

    if (account.address === getCreator(tokenId as `0x${string}`)) {
      setMintfee('0');
      return ;
    }

    let mintfee = await getMintFee(sellPrice * BigInt(symbolDimension(account.chainId))) as bigint;
    // 
    const mintfeeStr = divideBigIntWithDecimal(mintfee, symbolDimension(account.chainId), symbolDecimal(account.chainId))
    setMintfee(mintfeeStr);
  }

  function closeMintDialog() {
    const element = document.getElementById('mint_modal') as HTMLDialogElement | null;
    element!.close();
  }

  return (
    <>
      <form className="token_form" onSubmit={submit} >
        <div className='space-y-12'>
          <label className="input input-bordered input-primary flex items-center gap-2">
            Title
            <input name="title" type="text" className="grow" placeholder="set a title to NFT" required />
          </label>
          <label className="input input-bordered input-primary flex items-center gap-2">
            TokenId
            <input name="tokenId" type="text" className="grow" placeholder="66 length string started with 0x" required onChange={handleTokenIdChange}/>
          </label>
          <label className="input input-bordered input-primary flex items-center gap-2">
            originURI
            <input name="originURI" type="text" className="grow" disabled placeholder={uri} onChange={handleURLChange}/>
            {showGo && <button onClick={handleGo} type="button"><kbd>Go</kbd></button>}
          </label>
          <label className="input input-bordered input-primary flex items-center gap-2">
            sellPrice
            <input name="sellPrice" type="text" className="grow" placeholder="set a sell price for NFT" required onChange={handleSellPriceChange}/>
            <span>{symbol(account.chainId)}</span>
          </label>
          <label className="input input-bordered input-primary flex items-center gap-2">
            interval
            <input name="interval" type="text" className="grow" placeholder="the survival time of NFT after first trading" required />
            <span><p>hour(s)</p></span>
          </label>
        </div>
        <div className='flex justify-center p-8'>
          <button 
            className="btn btn-success"
            type='button'
            onClick={onMintDialog}>Mint
          </button>
          <dialog id="mint_modal" className="modal">
            <div className="modal-box">
              <div className="grid grid-cols-4">
                <h1 className="text-2xl font-bold">Checkout</h1>
                <div className="grid grid-cols-4 justify-center col-start-4">
                  <button className="flex justify-center bg-white col-start-4" type='button' onClick={closeMintDialog}>
                    <p className="align-middle">X</p>
                  </button>
                </div>
              </div>
              <div className="flex flex-col justify-center mt-6 mb-6">
                <div className="grid grid-cols-2">
                  <p className="text-gray-700 mb-2 px-10">Mint Fee</p>
                  <p className="text-gray-700 mb-2">{mintfee}  {symbol(account.chainId)}</p>
                </div>
              </div>
              <div className="modal-action justify-center ml-6 mr-6">
                <button 
                  className="btn w-full rounded-md bg-gradient-to-r from-emerald-600/50 to-emerald-800/50 backdrop-blur-md text-white font-extrabold hover:from-emerald-700/60 hover:to-emerald-900/60 hover:scale-105 transition-transform duration-300" 
                  type="submit">
                    Confirm
                </button>
              </div>
            </div>
          </dialog>
        </div>
      </form>
    </>
  );
}

const Mint = () => {

  return (
    <div className='gap-px max-w-xl mx-auto p-8'>
      <div className="p-16">
        <span><p className='text-center text-xl font-mono'>Mint NFT</p></span>
      </div>
      <div role="tablist" className="tabs tabs-boxed">
        <input type="radio" name="creation_tab" role="tab" className="tab" aria-label="First Mint" defaultChecked/>
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <NoTokenForm />
        </div>

        <input type="radio" name="creation_tab" role="tab" className="tab" aria-label="Mint with tokenId" />
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <TokenForm />
        </div>
      </div>
    </div>
  );
}

export default observer(Mint);