import { observer } from 'mobx-react-lite';
import { observable, action } from 'mobx';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { ChangeEvent, useEffect, useState } from 'react';
import { lsNFTStore } from '@/store';
import { useAccount } from 'wagmi';
import NFTCard, { From } from '../NFTCard';
import { toHex } from 'viem';
import Link from 'next/link';
import { WnftInfo } from '@/store/LsNFT';
import { wnftApi } from '@/api/wnft/wnft';
import { successCode } from '@/lib/constants';

export enum ListStatus {
  NONE,
  ALL,
  LISTED,
  NOT_LISTED,
}

const Lists = ({nftList, status}: {nftList: any[], status: ListStatus}) => {

  const listed: any[] = [];
  const notListed: any[] = [];

  if (nftList && nftList.length > 0) {

    nftList.forEach(nft => {
      nft.isListed ? listed.push(nft) : notListed.push(nft);
    })
  }

  return (
    <>
      { (status == ListStatus.ALL || status == ListStatus.LISTED) &&
      <>
        <div className="grid grid-cols-4 gap-4">
          <div className='divider divider-vertical'>Listed</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {listed && listed.length > 0 && listed.map(nft => (
            <div key={nft.id}>
                {nft.style}
            </div>
          ))}
        </div>
       </>
      }
      { (status == ListStatus.ALL || status == ListStatus.NOT_LISTED) &&
      <>
        <div className="grid grid-cols-4 gap-4">
          <div className='divider divider-vertical'>Not Listed</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {notListed && notListed.length > 0 && notListed.map(nft => (
            <div key={nft.id}>
                {nft.style}
            </div>
          ))}
        </div>
      </>
      }
    </>
  );
}

const Saleslist = () => {
  const { lsNFT } = lsNFTStore;
  const { wnftInfoList, getPage } = lsNFT;

  const account = useAccount();
  const tokenIdSet: string[] = [];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isListed, setIsListed] = useState<boolean | null>(null);
  const [selectedStatus, setSelectedStatus] = useState(ListStatus.ALL);
  const [nftList, setNftList] = useState<any[]>([])

  function handleStatusSelection(event: ChangeEvent<HTMLSelectElement>): void {
    switch (event.target.value) {
      case 'Listed':
        setIsListed(true);
        setSelectedStatus(ListStatus.LISTED);
        break;
      case 'Not Listed':
        setIsListed(false);
        setSelectedStatus(ListStatus.NOT_LISTED);
        break;
      case 'All':
        setIsListed(null)
      default:
        setSelectedStatus(ListStatus.ALL);
        break;
    }
  }
  /*
  const wnftPage = observable({
    getPage: action(async function () {
      try {
        debugger
        let params = {
          page: 1,
          pageSize: 10,
          isListed: isListed
        };
        await getPage(params);
        const nftPage: any[] = []
        wnftInfoList.forEach(item => {
          nftPage.push({
            id: item.tokenId,
            style: <NFTCard nftInfo={item} from={From.LISTS} />
          })
        })
        setNftList(nftPage);
      } catch (err) {
        console.log("get wnft page list error: ", err);
      } finally {
        setLoading(false);
      }
    })
  })
  wnftPage.getPage()
  */
  
  useEffect(() => {
    const queryPage = async () => {
      try {
        let params = {
          page: 1,
          pageSize: 10,
          isListed: isListed,
          isBurnt: false,
          owner: account.address,
          chainId: account.chainId
        };
        await wnftApi.page(params).then(resp => {
          if (resp && resp.code === successCode) {
            const wnftInfoList: WnftInfo[] = resp.data.list
            const nftPage: any[] = []
            wnftInfoList.forEach(item => {
              let link = `/lists/${item.wnftId}`
              nftPage.push({
                id: item.wnftId,
                isListed: item.isListed,
                style: <NFTCard nftInfo={item} from={From.LISTS} link={link} />
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
    <div>
      <div className="navbar bg-base-100">
        <div className="navbar-start hidden lg:flex">
          <button className="btn btn-square btn-ghost">
            <ClipboardDocumentListIcon className="size-5" />
          </button>
          <select className="select select-bordered w-full max-w-xs " defaultValue="All" onChange={handleStatusSelection}>
            <option value="All">All</option>
            <option value="Listed">Listed</option>
            <option value="Not Listed">Not Listed</option>
          </select>
        </div>
      </div>
      <div className='"max-w-3xl mx-auto p-6'>
        <Lists nftList={nftList} status={selectedStatus} />
      </div>
      {/* <div className="grid grid-cols-4 gap-4">
        {nftList && nftList.length > 0 && nftList.map(nft => (
          <div key={nft.id}>{nft.style}</div>
        ))}
      </div> */}
    </div>
    
  );
}

export default observer(Saleslist);