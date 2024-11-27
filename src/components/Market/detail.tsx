import { WnftInfo, lsNFT } from "@/store/LsNFT";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { wnftApi } from "@/api/wnft/wnft";
import { ETH_TO_WEI, successCode } from "@/lib/constants";
import TransactionEcharts from "@/components/Echarts/transactions"
import { baseUrl } from "@/lib/axios";
import { chainName, symbol, symbolDecimal, symbolDimension } from "@/lib/chainTerms";
import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { useAccount } from "wagmi";
import { marketStore } from "@/store";
import { divideBigIntWithDecimal, truncateDynamic } from "@/lib/utils";

let timeLeft = {
  day: 0,
  hour: 0,
  minute: 0,
  second: 0
}

function calculateTimeLeft(deadline: Number) {

  const difference = Number(deadline) - +new Date();

  if (difference > 0) {
    timeLeft = {
      day: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hour: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minute: Math.floor((difference / 1000 / 60) % 60),
      second: Math.floor((difference / 1000) % 60),
    };
  }
};

const CountDown = ({onBurnChange, deadline}: {onBurnChange: any, deadline: number}) => {

  calculateTimeLeft(deadline);

  const [days, setDays] = useState(timeLeft.day);
  const [hours, setHours] = useState(timeLeft.hour);
  const [minutes, setMinutes] = useState(timeLeft.minute);
  const [seconds, setSeconds] = useState(timeLeft.second);

  // setDays(timeLeft.day);
  // setHours(timeLeft.hour);
  // setMinutes(timeLeft.minute);
  // setSeconds(timeLeft.second);

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setInterval(() => {

        setSeconds((prevTime) => prevTime - 1);
      }, 1000);
      
      // avoid out of memory
      return () => clearInterval(timerId);
    } else if (seconds == 0) {
      if (minutes > 0) {
        setSeconds(59);
        setMinutes(minutes - 1);
      } else if (minutes == 0) {
        if (hours > 0) {
          setSeconds(59);
          setMinutes(59);
          setHours(hours - 1);
        } else if (hours == 0) {
          if (days > 0) {
            setSeconds(59);
            setMinutes(59);
            setHours(23);
            setDays(days - 1);
          } else if (days == 0) {
            onBurnChange(true);
          }
        }
      }
    }
  }, [seconds]);
  
  
  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max p-5">
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span style={{"--value":`${days}`} as React.CSSProperties}></span>
        </span>
        days
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span style={{"--value":`${hours}`} as React.CSSProperties}></span>
        </span>
        hours
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span style={{"--value":`${minutes}`} as React.CSSProperties}></span>
        </span>
        min
      </div>
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span style={{"--value":`${seconds}`} as React.CSSProperties}></span>
        </span>
        sec
      </div>
    </div>
  );
}

const MarketDetail = () => {

  const account = useAccount();

  const router = useRouter();
  const { id } = router.query;
  const wnftId = id as string
  const handleBack = () => {
    router.back();
  };

  const { getFpFromTokenId } = lsNFT;
  const { market } = marketStore;
  const { list, buy, burn, getHoldFee } = market;

  const [holdfee, setHoldFee] = useState("0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [imageSrc, setImageSrc] = useState('');
  const [shouldBurn, setShouldBurn] = useState(false);
  const handleBurnChange = (value: boolean) => {
    setShouldBurn(value);
  }


  const [wnftDetail, setWnftDetail] = useState<WnftInfo>({
    wnftId: '',
    tokenId: `0x0`,
    chainId: '0',
    owner: `0x0`,
    price: '0',
    interval: 0,
    deadline: 0,
    isPaid: false,
    isListed: false,
    isExpired: false,
    isBurnt: false,
    title: '',
    content: '',
    hostname: '',
    originUri: '',
    createTime: '',
    modifyTime: '',
    isTitlePicture: false
  });

  const detail = async () => {
    try {
      let params = {
        wnftId: wnftId,
      }
      await wnftApi.detail(params).then(resp => {
        if (resp && resp.code === successCode) {
          const wnftInfo: WnftInfo = resp.data;
          setWnftDetail(wnftInfo);
          return wnftInfo
        } else {
          alert(resp.msg);
          return wnftDetail
        }
      }).then((wnft) =>{
        fetchImage(wnft)
      }).catch((error) => {
        console.log(error);
      })
      
    } catch (err) {
      console.log("get wnft detail error: ", err);
    } finally {
      setLoading(false);
    }
  }
  
  const fetchImage = async (wnftInfo: WnftInfo) => {
    try {
      let fp = getFpFromTokenId(wnftInfo.tokenId)
      const response = await fetch(`${baseUrl}/wnftInfo/fetch?fp=${fp}&chainId=${wnftInfo.chainId}`);

      if (!response.ok) {
        console.log("fetch error:", response)
        throw new Error("Failed to fetch resource");
      }

      const contentType = response.headers.get('Content-Type');
      if (!contentType) {
        return
      }
      if (contentType.startsWith('application/json')) {
        return
      }
      
      if (contentType.startsWith('image/')) {
        const blob = await response.blob();
        setImageSrc(URL.createObjectURL(blob));
      }
    } catch (error) {
        console.error("Error fetching image:", error);
    }
  };
  
  useEffect(() => {
    detail();
  }, [])

  async function onBuyDialog(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    const element = document.getElementById('buy_modal') as HTMLDialogElement | null;
    element!.showModal();
    let holdfee = await getHoldFee(wnftDetail.tokenId) as bigint;
    // debugger
    const holdfeeStr = divideBigIntWithDecimal(holdfee, symbolDimension(Number(wnftDetail.chainId)), symbolDecimal(Number(wnftDetail.chainId)))
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

    await buy(wnftDetail.wnftId, wnftDetail.tokenId, BigInt(wnftDetail.price) * symbolDimension(Number(wnftDetail.chainId)), BigInt(sellPrice) * symbolDimension(Number(wnftDetail.chainId)));
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
      await burn(wnftDetail.wnftId, wnftDetail.tokenId);
      detail();
    } finally {
      closeBurnDialog();
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {/* <div className="bg-gray-50 sticky top-16 z-50 w-full">
        <button className='px-6 py-6' onClick={handleBack}>
          {'<-'}
        </button>
      </div> */}
      <div className="container mx-auto p-6">
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* tokenURI resource */}
          <div className="flex justify-center bg-gray-200">

            <div style={{ margin: '20px 20px' }}>
              <img src={imageSrc} style={{ maxWidth: '100%' }}></img>
            </div>
          </div>

          {/* nft info */}
          <div className="flex flex-col justify-center">
            <div className="flex gap-2">
              <h1 className="text-3xl font-bold mb-4">
                {wnftDetail.title}  
              </h1>
              <a href={wnftDetail.originUri} target="_blank" rel="noopener noreferrer">
                <ArrowTopRightOnSquareIcon className="size-5  text-blue-500"/>
              </a>
            </div>
            <p className="mb-10 text-blue-500">{wnftDetail.owner}</p>
            <div className="grid grid-cols-2">
              <p className="text-gray-700 mb-6">TokenId</p>
              <div className="relative group">
                <div className="truncate">
                  {truncateDynamic(wnftDetail.tokenId, 23)}
                </div>
                <div className="absolute hidden group-hover:flex bg-gray-900 text-white text-sm p-2 rounded shadow-lg -top-8 left-0 z-50">
                  {wnftDetail.tokenId}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <p className="text-gray-700 mb-6">Chain</p>
              <p className="text-gray-700 mb-6">{chainName(Number(wnftDetail.chainId))}</p>
            </div>
            <div className="grid grid-cols-2">
              <p className="text-gray-700 mb-6">Content</p>
              <p className="text-gray-700 mb-6">{wnftDetail.content}</p>
            </div>
            <div className="grid grid-cols-2">
              <p className="text-gray-700 mb-6">Price</p>
              <p className="text-gray-700 mb-6">{wnftDetail.price} {symbol(Number(wnftDetail.chainId))}</p>
            </div>
            {/* <span className="text-2xl font-bold text-red-600 mb-6">￥999.00</span> */}
            {shouldBurn ?
              <div style={{margin: '20px 0'}}>
                <button 
                  className="btn w-full rounded bg-gradient-to-r from-red-600/50 to-red-800/50 backdrop-blur-md text-white font-extrabold hover:from-red-700/60 hover:to-red-900/60 hover:scale-105 transition-transform duration-300" 
                  disabled={wnftDetail.isBurnt}
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
            :
              <div>
                <p className="text-gray-700 font-bold">Countdown to Burn</p>
                <CountDown onBurnChange={handleBurnChange} deadline={wnftDetail.deadline * 1000} />
                <button 
                  className="btn mt-6 w-full bg-gradient-to-r from-blue-600/50 to-blue-800/50 backdrop-blur-md text-white font-extrabold rounded border border-red-900 hover:from-blue-700/60 hover:to-blue-900/60 hover:scale-105 transition-transform duration-300"
                  disabled={!(wnftDetail.isListed && !wnftDetail.isExpired && account.address != wnftDetail.owner)} 
                  onClick={onBuyDialog}>
                    Buy
                </button>
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
                            <p className="text-gray-700 mb-2">{wnftDetail.price}  {symbol(Number(wnftDetail.chainId))}</p>
                          </div>
                          <div className="grid grid-cols-2">
                            <p className="text-gray-700 mb-2 px-10">Hold Fee</p>
                            <p className="text-gray-700 mb-2">{holdfee}  {symbol(Number(wnftDetail.chainId))}</p>
                          </div>
                          <div className="grid grid-cols-2">
                            <p className="align-middle px-10">Sell Price</p>
                            <div className="grid grid-cols-2">
                              <input name="sellPrice" type="text" className="border border-gray-500 rounded-md mr-2 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="set price" required />
                              <span className="align-middle">{symbol(Number(wnftDetail.chainId))}</span>
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
            }
          </div>
        </div>

        {/* 其他信息部分 */}
        <div className="mt-12">
          <TransactionEcharts wnftId={wnftId} />
        </div>
      </div>
    </>
    
  );
}

export default observer(MarketDetail);