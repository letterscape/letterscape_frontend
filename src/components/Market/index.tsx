import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { lsNFTStore } from '@/store';
import NFTCard, { From } from '../NFTCard';
import { useAccount } from 'wagmi';
import { wnftApi } from '@/api/wnft/wnft';
import { successCode } from '@/lib/constants';
import { WnftInfo } from '@/store/LsNFT';
import Link from 'next/link';

const Market = () => {

  const { lsNFT } = lsNFTStore;
  const { nftGoodsList } = lsNFT;

  const account = useAccount();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nftList, setNftList] = useState<any[]>([])

  // const nftList = [
  //   { id: '1', style: <NFTCard title='First Post' isTitlePicture={false} content='aaaaa' shouldBurn={false}/> },
  //   { id: '2', style: <NFTCard title='https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp' isTitlePicture={true} content='aaaaa' shouldBurn={true}/> },
  //   { id: '3', style: <NFTCard title='https://images.pexels.com/photos/4109268/pexels-photo-4109268.jpeg' isTitlePicture={true} content='' shouldBurn={false}/> },
  //   { id: '4', style: <NFTCard title='Fourth Post' isTitlePicture={false} content='aaaaa' shouldBurn={true}/> },
  //   { id: '5', style: <NFTCard title='Fifth Post' isTitlePicture={false} content='aaaaa' shouldBurn={false}/> },
  // ];

  useEffect(() => {
    const queryPage = async () => {
      try {
        let params = {
          page: 1,
          pageSize: 10,
          isListed: true,
          isBurnt: false,
          chainId: account.chainId
        };
        await wnftApi.page(params).then(resp => {
          if (resp && resp.code === successCode) {
            const wnftInfoList: WnftInfo[] = resp.data.list
            const nftPage: any[] = []
            wnftInfoList.forEach(item => {
              let link = `/market/${item.wnftId}`
              nftPage.push({
                id: item.wnftId,
                isListed: item.isListed,
                style: <NFTCard nftInfo={item} from={From.MARKET} link={link} />
              })
            })
            setNftList(nftPage);
          } else {
            alert(resp.msg);
          }
        }).catch((error) => {
          console.log(error);
        })
        
      } catch (err) {
        console.log("get wnft page list error: ", err);
      } finally {
        setLoading(false);
      }
    }
    queryPage()
  }, [])
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
     {/* <div>
      <button className="btn btn-active btn-primary" onClick={onAccountInfo}>获取账户信息</button>
      <span>账户信息：<i>{account}</i></span>
     </div> */}
     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
     {nftList.map(nft => (
        <div key={nft.id}>
          {nft.style}
        </div>
      ))}
     </div>
    </>
  );
}

export default observer(Market);