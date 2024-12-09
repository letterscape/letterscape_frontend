import { ScapeProperty } from '@/store/Scape';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { scapeStore, lsNFTStore } from '@/store';
import { baseUrl } from '@/lib/axios';
import { toHex } from 'viem';

export const scapeType = (typeId: string): string => {
  switch(typeId) {
    case '1':
      return 'header';
    case '2':
      return 'body';
    case '3':
      return 'footer';
  }
  return '';
}

// advertisement component
const Scape = ({isShow, chainId, hostname, originURI, positionId, typeId}: {isShow: boolean, chainId: string, hostname: string, originURI: string, positionId: string, typeId: string}) => {

  const { lsNFT } = lsNFTStore;
  const { genFp } = lsNFT;

  const [tokenURI, setTokenURI] = useState('');
  const [tokenId, setTokenId] = useState<`0x${string}`>('0x');
  const [imageSrc, setImageSrc] = useState('');

  // useEffect(() => {
  //   async function fetchData() {
  //     const result = await getTokenURI(tokenId);
  //     setTokenURI(result as string);
  //   }

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchImage = async () => {
      debugger
        try {
            let fp = toHex(genFp({hostname, originURI, positionId, typeId}))
            const response = await fetch(`${baseUrl}/wnftInfo/fetch?fp=${fp}&chainId=${chainId}`);

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

    fetchImage();
  }, []);

  // useEffect(() => {
  //   function createTokenId() {
  //     const adProperty: ScapeProperty = {
  //       creator,
  //       hostname,
  //       originURI,
  //       positionId
  //     }
  //     const result = genTokenId(adProperty);;
  //     setTokenId(result);
  //   }

  //   createTokenId();
  // }, []);

  // if (!imageSrc) {
  //   return <p>Loading...</p>;
  // }
  
  
  
  return (
    <>
      {isShow && imageSrc &&
        <div style={{ margin: '20px 0' }}>
          <ins
            className="adsbyletterscape"
            style={{ display: 'block', textAlign: 'center' }}
          >
            <img src={imageSrc} style={{ maxWidth: '100%' }}></img>
          </ins>
        </div>
      }
    </>
    
  );
}

export default observer(Scape);