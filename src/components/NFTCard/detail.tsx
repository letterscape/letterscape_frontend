import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { lsNFTStore, marketStore } from '@/store';
import { ChangeEvent, useEffect, useState } from 'react';
import { wnftApi } from '@/api/wnft/wnft';
import { successCode } from '@/lib/constants';
import { WnftInfo } from '@/store/LsNFT';
import axios, { baseUrl } from '@/lib/axios';
import TransactionEcharts from "@/components/Echarts/transactions"
import { chainName, symbol, symbolDecimal, symbolDimension } from '@/lib/chainTerms';
import { divideBigIntWithDecimal, formatTimestampToDateTime, truncateDynamic } from '@/lib/utils';
import { ArrowTopRightOnSquareIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const UploadFile = ({url, sendDataToParent, src} : {url: string, sendDataToParent: (arg0: string) => void, src: any}) => {
  
  const router = useRouter();
  
  const [preview, setPreview] = useState("");
  const [fileType, setFileType] = useState("");
  const [file, setFile] = useState(null);
  const [resource, setResource] = useState(undefined);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setResource(src);
  }, [src])

  const handleFileChange = (event: any) => {
    debugger
    const file = event.target.files[0];
    if (file) {
      setFileType(file.type);
      setFile(file);
      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
      setInputValue("");
    }
  };

  const handleUpload = async (url: string) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('data', file);

    try {
      const resp = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (resp.data.code === successCode) {
        console.log('上传成功: ', resp.data.data);
        alert("upload success")
        sendDataToParent(resp.data.data);
        router.replace(router.asPath);
      } else {
        console.log('上传失败: ', resp.data);
      }
    } catch (error) {
      console.error('上传失败', error);
    }
  };

  const handleRemove = () => {

    setPreview("");
    setFileType("");
    setFile(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      
      {preview ? (
        <div className="relative mt-4">
          <img src={preview} alt="Preview" className="max-w-full max-h-64 rounded-lg shadow-md" />
          <button
            onClick={() => handleUpload(url)}
            className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs hover:bg-blue-600"
          >
            Upload
          </button>
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ) :
        <div style={{ margin: '20px 20px' }}>
          <img src={resource} style={{ maxWidth: '100%' }}></img>
        </div>
      }
      <label className="flex flex-col align-bottom px-4 py-6 bg-blue-100 rounded-lg cursor-pointer hover:bg-blue-200">
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} value={inputValue} className="hidden" />
        <span className="text-blue-600">Choose Image</span>
      </label>
    </div>
  );
}

const NFTDetail = () => {

  const router = useRouter();
  const { id } = router.query;
  const wnftId = id as string;

  const handleBack = () => {
    router.back();
  };
  
  const { lsNFT } = lsNFTStore;
  const { setTokenURI, getFpFromTokenId } = lsNFT;
  const { market } = marketStore;
  const { burn, getHoldFee, payHoldFee } = market;

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [imageSrc, setImageSrc] = useState('');

  const [holdfeeStr, setHoldfeeStr] = useState("0");
  const [holdfee, setHoldfee] = useState(BigInt(0));
  
  const detail = () => {
    try {
      let params = {
        wnftId: wnftId,
      }
      wnftApi.detail(params).then(resp => {
        if (resp && resp.code === successCode) {

          const wnftInfo: WnftInfo = resp.data;
          setWnftDetail(wnftInfo);
          return wnftInfo;
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
  };
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

  useEffect(() => {
    const handleRouteChange = () => {
      const element = document.getElementById("edit_input") as HTMLInputElement;
      if (element) {
        element.checked = false;
        setIsEdit(false);
      }
      debugger
      detail();
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setWnftDetail((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    let params = {
      ...wnftDetail
    }
    wnftApi.updateDetail(params).then(resp => {
      if (resp && resp.code === successCode) {
        alert('update success')
      } else {
        alert(resp.msg);
      }
      router.push(router.asPath)
    }).catch((error) => {
      console.log(error);
    })
  }

  const handleDataFromUpload = (data: any) => {
    console.log("from upload data: ", data);
    setTokenURI(wnftDetail.tokenId, data) // tokenURI = cid
  }

  const onEditClick = () => {
    setIsEdit(!isEdit);
    console.log("isEdit: ", isEdit)
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
      router.push("/lists").then(() => {
        router.reload();
      });
    } finally {
      closeBurnDialog();
    }
  }

  async function onPayHoldFeeDialog(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    const element = document.getElementById('payHoldFee_modal') as HTMLDialogElement | null;
    element!.showModal();
    let holdfee = await getHoldFee(wnftDetail.tokenId) as bigint;
    setHoldfee(holdfee);
    // debugger
    const holdfeeStr = divideBigIntWithDecimal(holdfee, symbolDimension(Number(wnftDetail.chainId)), symbolDecimal(Number(wnftDetail.chainId)))
    setHoldfeeStr(holdfeeStr);
  }

  function closePayHoldFeeDialog() {
    const element = document.getElementById('payHoldFee_modal') as HTMLDialogElement | null;
    element!.close();
  }

  const onPayHoldFeeClick = async () => {
    try {
      await payHoldFee(wnftDetail.wnftId, wnftDetail.tokenId, holdfee);
      router.push("/lists").then(() => {
        router.reload();
      });
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
      {/* <div className="fixed">
        <button className='px-6 py-6' onClick={handleBack}>
          {'<-'}
        </button>
      </div> */}
      <div className="container mx-auto p-6" style={{margin: '50px 50px'}}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center bg-gray-200">
            <UploadFile url={`${baseUrl}/wnftInfo/upload`} sendDataToParent={handleDataFromUpload} src={imageSrc}/>
          </div>
          <div className="flex flex-col justify-normal px-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2">
              {isEdit ?
                <label className="input input-bordered input-primary flex items-center gap-2 mb-10">
                  <p className="font-bold">Title</p>
                  <input name="title" value={wnftDetail.title} type="text" className="grow" placeholder='set a title to NFT' onChange={handleChange} />
                </label>
                :
                <div className="flex gap-2 mb-10">
                  <h1 className="text-3xl font-bold mb-4">
                    {wnftDetail.title}  
                  </h1>
                  <a href={wnftDetail.originUri} target="_blank" rel="noopener noreferrer">
                    <ArrowTopRightOnSquareIcon className="size-5  text-blue-500"/>
                  </a>
                </div>
              }
              <div className="flex justify-end">
                <label className="btn btn-circle swap swap-rotate">
                  <input id="edit_input" type="checkbox" onClick={onEditClick}/>
                  <svg
                    className="swap-off fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 512 512">
                    <text x="25" y="350" fill="black" font-size="250" font-family="Arial">
                      Edit
                    </text>
                  </svg>
                  <svg
                    className="swap-on fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 512 512">
                    <polygon
                      points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                  </svg>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <p className="flex text-gray-700 mb-6">TokenId</p>
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
            {isEdit ?
              <div className="grid grid-cols-2">
                <p className="flex text-gray-700 mb-6 items-center">
                  Content
                </p>
                <label className="input input-bordered input-primary flex items-center gap-2 mb-6">
                  <input name="content" value={wnftDetail.content} type="text" className="grow" placeholder='set content' onChange={handleChange} />
                </label>
              </div>
              :
              <div className="grid grid-cols-2">
                <p className="flex text-gray-700 mb-6">
                  Content
                </p>
                <p className="text-gray-700 mb-6">{wnftDetail.content}</p>
              </div>
            }
            <div className="grid grid-cols-2">
              <p className="text-gray-700 mb-6">Price</p>
              <p className="text-gray-700 mb-6">{wnftDetail.price} {symbol(Number(wnftDetail.chainId))}</p>
            </div>
            <div className="grid grid-cols-2">
              <p className="text-gray-700 mb-6">Deadline</p>
              <p className="text-gray-700 mb-6">{formatTimestampToDateTime(wnftDetail.deadline)}</p>
            </div>
            {isEdit &&
              <div className="grid grid-cols-1 mt-6">
                <span className="">
                  <button 
                    className="btn w-full rounded-md bg-gradient-to-r from-emerald-600/50 to-emerald-800/50 backdrop-blur-md text-white font-extrabold hover:from-emerald-700/60 hover:to-emerald-900/60 hover:scale-105 transition-transform duration-300" 
                    type="submit">
                    Save
                  </button>
                </span>
              </div>
            }
          </form>
            
            {/* <div style={{margin: '20px 0'}}>
              <h1 className="text-3xl font-bold mb-4 text-center py-4">Edit</h1>
              <form onSubmit={handleSubmit}>
                <div className='space-y-12'>
                <label className="input input-bordered input-primary flex items-center gap-2">
                  OriginURI
                  <input type="originURI" value={wnftDetail.originUri} placeholder='' className="input input-bordered w-full max-w-xs" disabled onChange={handleChange} />
                  {wnftDetail?.originUri?.includes("http") && <button onClick={handleGo} type="button"><kbd>Go</kbd></button>}
                </label>
                  <label className="input input-bordered input-primary flex items-center gap-2">
                    Title
                    <input name="title" value={wnftDetail.title} type="text" className="grow" placeholder='set a title to NFT' onChange={handleChange} />
                  </label>
                  <label className="input input-bordered input-primary flex items-center gap-2">
                    Content
                    <input name="content" value={wnftDetail.content} type="text" className="grow" placeholder='set content' onChange={handleChange} />
                  </label>
                </div>
                <div className="grid grid-cols-1 mt-8">
                  <span className="">
                    <button 
                      className="btn w-full rounded-md bg-gradient-to-r from-emerald-600/50 to-emerald-800/50 backdrop-blur-md text-white font-extrabold hover:from-emerald-700/60 hover:to-emerald-900/60 hover:scale-105 transition-transform duration-300" 
                      type="submit">
                      Save
                    </button>
                  </span>
                </div>
              </form>
            </div> */}
            <div className="grid grid-cols-2 gap-6" style={{margin: '20px 0'}}>
              <div >
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
              <div >
                <button 
                  className="btn w-full rounded bg-gradient-to-r from-sky-600/50 to-sky-800/50 backdrop-blur-md text-white font-extrabold hover:from-sky-700/60 hover:to-sky-900/60 hover:scale-105 transition-transform duration-300" 
                  onClick={onPayHoldFeeDialog}>Pay HoldFee</button>
                <dialog id="payHoldFee_modal" className="modal">
                  <div className="modal-box">
                    <div className="grid grid-cols-4">
                      <h1 className="text-2xl font-bold">Checkout</h1>
                      <div className="grid grid-cols-4 justify-center col-start-4">
                        <button className="flex justify-center bg-white col-start-4" onClick={closePayHoldFeeDialog}>
                          <p className="align-middle">X</p>
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center mt-6 mb-6">
                      <div className="grid grid-cols-2">
                        <p className="text-gray-700 mb-2 px-10">Hold Fee</p>
                        <p className="text-gray-700 mb-2">{holdfeeStr}  {symbol(Number(wnftDetail.chainId))}</p>
                      </div>
                    </div>
                    <div className="modal-action justify-center ml-6 mr-6">
                      <button 
                        className="btn w-full rounded-md bg-gradient-to-r from-emerald-600/50 to-emerald-800/50 backdrop-blur-md text-white font-extrabold hover:from-emerald-700/60 hover:to-emerald-900/60 hover:scale-105 transition-transform duration-300" 
                        disabled={wnftDetail.isExpired || wnftDetail.isBurnt}
                        onClick={onPayHoldFeeClick}>
                          Pay
                      </button>
                    </div>
                  </div>
                </dialog>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      <div className="mt-12">
        <TransactionEcharts wnftId={wnftId} />
      </div>
    </>
  )
}

export default observer(NFTDetail);