import { observer } from 'mobx-react-lite';
import { WnftInfo } from '@/store/LsNFT'
import { useAccount } from 'wagmi';
import { marketStore } from '@/store';
import Link from 'next/link';
import { useState } from 'react';
import { ETH_TO_WEI } from '@/lib/constants';
import router from 'next/router';
import { divideBigIntWithDecimal, formatTimestampToDateTime } from '@/lib/utils';
import { symbol, symbolDecimal, symbolDimension } from '@/lib/chainTerms';

export enum From {
  MARKET,
  LISTS,
}

const Buttons = ({nftInfo, from}: {nftInfo: WnftInfo, from: From}) => {

  const account = useAccount();

  const { market } = marketStore;
  const { list, buy, burn, getHoldFee } = market;

  const [holdfee, setHoldFee] = useState("0");

  const handleList = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    debugger
    if (nftInfo) {
      await list(nftInfo);
      router.push('/market')
    }
  }

  async function onBuyDialog(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    const element = document.getElementById('buy_modal') as HTMLDialogElement | null;
    element!.showModal();
    let holdfee = await getHoldFee(nftInfo.tokenId) as bigint;
    // debugger
    const holdfeeStr = divideBigIntWithDecimal(holdfee, symbolDimension(Number(nftInfo.chainId)), symbolDecimal(Number(nftInfo.chainId)))
    setHoldFee(holdfeeStr);
  }

  function closeBuyDialog() {
    const element = document.getElementById('buy_modal') as HTMLDialogElement | null;
    element!.close();
  }

  async function submitBuyForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const sellPrice = formData.get('sellPrice') as string

    await buy(nftInfo.wnftId, nftInfo.tokenId, BigInt(nftInfo.price) * symbolDimension(Number(nftInfo.chainId)), BigInt(sellPrice) * symbolDimension(Number(nftInfo.chainId)));
    router.push("/lists").then(() => {
      router.reload();
    });
  }

  async function onBurnDialog(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    const element = document.getElementById('burn_modal') as HTMLDialogElement | null;
    element!.showModal();
  }

  function closeBurnDialog() {
    const element = document.getElementById('burn_modal') as HTMLDialogElement | null;
    element!.close();
  }

  const onBurnClick = async () => {
    try {
      await burn(nftInfo.wnftId, nftInfo.tokenId);
      router.reload();
    } finally {
      closeBurnDialog();
    }
  }

  return (
    <div className="">
      {from === From.MARKET && nftInfo.isListed &&
        <div className="grid grid-cols-2 w-full gap-0">
            <div className="card-actions justify-center bg-gray-300">
              <button 
                className="btn w-full rounded-none bg-gradient-to-r from-red-600/50 to-red-800/50 backdrop-blur-md text-white font-extrabold hover:from-red-700/60 hover:to-red-900/60 hover:scale-105 transition-transform duration-300" 
                disabled={!(nftInfo.isExpired && !nftInfo.isBurnt)}
                onClick={onBurnDialog}>Burn</button>
              <dialog id="burn_modal" className="modal">
                <div className="modal-box">
                  <div className="flex justify-center">
                    <h1 className="text-2xl font-bold">Still Burn it?</h1>
                  </div>
                  <div className="modal-action justify-center">
                    <div className="grid grid-cols-2 gap-8">
                      <button 
                        className="btn w-full rounded-md bg-gradient-to-r from-teal-500/50 to-teal-600/50 backdrop-blur-md text-white font-extrabold hover:from-teal-700/60 hover:to-teal-800/60 hover:scale-105 transition-transform duration-300" 
                        onClick={closeBurnDialog}>
                        Calm Down
                      </button>
                      <button 
                        className="btn w-full rounded-md bg-gradient-to-r from-orange-500/50 to-orange-600/50 backdrop-blur-md text-white font-extrabold hover:from-orange-700/60 hover:to-orange-800/60 hover:scale-105 transition-transform duration-300" 
                        onClick={onBurnClick}>
                        Burn It
                      </button>
                    </div>
                  </div>
                </div>
              </dialog>
            </div>
            <div className="card-actions justify-center bg-gray-300">
              <button 
                className="btn w-full rounded-none bg-gradient-to-r from-blue-600/50 to-blue-800/50 backdrop-blur-md text-white font-extrabold hover:from-blue-700/60 hover:to-blue-900/60 hover:scale-105 transition-transform duration-300" 
                disabled={!(nftInfo.isListed && !nftInfo.isExpired && account.address != nftInfo.owner)} 
                onClick={onBuyDialog}>Buy</button>
              <dialog id="buy_modal" className="modal">
                <div className="modal-box">
                  <div className="grid grid-cols-4">
                    <h1 className="text-2xl font-bold">Checkout</h1>
                    <div className="grid grid-cols-4 justify-center col-start-4">
                      <button className="flex justify-center bg-white col-start-4" onClick={closeBuyDialog}>
                        <p className="align-middle">X</p>
                      </button>
                    </div>
                  </div>
                  <div className="modal-action justify-center ml-6 mr-6">
                    <form method="dialog" onSubmit={submitBuyForm}>
                      <div className="flex flex-col justify-center mb-6">
                        <div className="grid grid-cols-2">
                          <p className="text-gray-700 mb-2 px-10">Price</p>
                          <p className="text-gray-700 mb-2">{nftInfo.price}  {symbol(Number(nftInfo.chainId))}</p>
                        </div>
                        <div className="grid grid-cols-2">
                          <p className="text-gray-700 mb-2 px-10">Hold Fee</p>
                          <p className="text-gray-700 mb-2">{holdfee}  {symbol(Number(nftInfo.chainId))}</p>
                        </div>
                        <div className="grid grid-cols-2">
                          <p className="align-middle px-10">Sell Price</p>
                          <div className="grid grid-cols-2">
                            <input name="sellPrice" type="text" className="border border-gray-500 rounded-md mr-2 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="set price" required />
                            <span className="align-middle">{symbol(Number(nftInfo.chainId))}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        className="btn w-full rounded-md bg-gradient-to-r from-emerald-600/50 to-emerald-800/50 backdrop-blur-md text-white font-extrabold hover:from-emerald-700/60 hover:to-emerald-900/60 hover:scale-105 transition-transform duration-300" 
                        type="submit">Confirm</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
        </div>
      }
      {from === From.LISTS && account.address == nftInfo.owner &&
        <div className="grid grid-cols-2 w-full gap-0">
          <div className="card-actions justify-center bg-gray-300">
            <button 
              className="btn w-full rounded-none bg-gradient-to-r from-red-600/50 to-red-800/50 backdrop-blur-md text-white font-extrabold hover:from-red-700/60 hover:to-red-900/60 hover:scale-105 transition-transform duration-300" 
              disabled={nftInfo.isBurnt}
              onClick={onBurnDialog}>Burn</button>
            <dialog id="burn_modal" className="modal">
              <div className="modal-box">
                <div className="flex justify-center">
                  <h1 className="text-2xl font-bold">Still burn it?</h1>
                </div>
                <div className="modal-action justify-center">
                  <div className="grid grid-cols-2 gap-8">
                    <button 
                      className="btn w-full rounded-md bg-gradient-to-r from-teal-500/50 to-teal-600/50 backdrop-blur-md text-white font-extrabold hover:from-teal-700/60 hover:to-teal-800/60 hover:scale-105 transition-transform duration-300" 
                      onClick={closeBurnDialog}>
                      Calm Down
                    </button>
                    <button 
                      className="btn w-full rounded-md bg-gradient-to-r from-orange-500/50 to-orange-600/50 backdrop-blur-md text-white font-extrabold hover:from-orange-700/60 hover:to-orange-800/60 hover:scale-105 transition-transform duration-300" 
                      onClick={onBurnClick}>
                      Burn It
                    </button>
                  </div>
                </div>
              </div>
            </dialog>
          </div>
          <div className="card-actions justify-center bg-gray-300">
            <button
              className="btn w-full rounded-none bg-gradient-to-r from-green-600/50 to-green-800/50 backdrop-blur-md text-white font-extrabold hover:from-green-700/60 hover:to-green-900/60 hover:scale-105 transition-transform duration-300" 
              disabled={!(!nftInfo.isListed && !nftInfo.isBurnt && !nftInfo.isExpired)}
              onClick={handleList}>List</button>
          </div>
        </div>
      }
    </div>
  );
}

const NFTCard = ({nftInfo, from, link}: {nftInfo: WnftInfo, from: From, link: string}) => {

  return (
    <>
      <div className="card border-2 h-full w-full overflow-hidden ">
        <Link href={link}>
          {nftInfo?.isTitlePicture ?
            <div className="card-title card-bordered w-96 h-32 justify-center">
              <figure >
                <img
                  src={nftInfo?.title}
                  alt="Oops!"/>
              </figure>
            </div>
          :
            <div className="card-title card-bordered w-full h-24 justify-center">
              <div>
                {nftInfo?.title}
              </div> 
            </div>
            
          }
          <div className="card-body w-full h-24 px-1 py-1 card-bordered">
            <div className="card-actions justify-start">
              {nftInfo?.content}
            </div>
          </div>
        </Link>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center font-mediu">
            <p className="text-center font-bold">Price</p>
          </div>
          <div className="flex items-center justify-center font-mediu space-x-4">
            <p className="text-center">{nftInfo.price}</p><p className="font-bold">{symbol(Number(nftInfo.chainId))}</p>
          </div>
          {/* <div className="text-center font-medium">{nftInfo.price}</div> */}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center font-mediu">
            <p className="text-center font-bold">Deadline</p>
          </div>
          <div className="flex items-center justify-center font-mediu">
            <p className="text-center">{formatTimestampToDateTime(nftInfo.deadline)}</p>
          </div>
        </div>
        <div className="">
          <Buttons nftInfo={nftInfo} from={from} />
        </div>
      </div>
    </>
  );
}

export default observer(NFTCard);