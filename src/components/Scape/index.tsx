import { ScapeProperty } from '@/store/Scape';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { scapeStore, lsNFTStore } from '@/store';
import { baseUrl } from '@/lib/axios';
import { toHex } from 'viem';
import { wnftResrouceApi } from '@/api/wnft/resource';
import { successCode } from '@/lib/constants';

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
  const [resourceText, setResourceText] = useState('');
  const [resourceURL, setResourceURL] = useState('');

  // useEffect(() => {
  //   async function fetchData() {
  //     const result = await getTokenURI(tokenId);
  //     setTokenURI(result as string);
  //   }

  //   fetchData();
  // }, []);

  useEffect(() => {
    const findResource = () => {
      let fp = toHex(genFp({hostname, originURI, positionId, typeId}))
      const params = {
        fp: fp,
        chainId: chainId
      }
      wnftResrouceApi.find(params).then(resp => {
        if (resp && resp.code === successCode) {
          
          const resource = JSON.parse(resp.data);
          setResourceText(resource.text);
          setResourceURL(resource.url);
          return resource.resourceId;
        } else {
          alert(resp.msg);
          return undefined;
        }
      }).then((resourceId) =>{
        fetchImage(resourceId);
      }).catch((error) => {
        console.log(error);
      })
    }
    const fetchImage = async (resourceId: string | undefined) => {
      
      try {
        if (!resourceId) {
          return
        }
        const response = await fetch(`${baseUrl}/resource/fetch?resourceId=${resourceId}`);

        if (!response.ok) {
          console.log("fetch error:", response);
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

    findResource();
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
          <a href={resourceURL} target="_blank" rel="noopener noreferrer">
            <ins
              className="adsbyletterscape"
              style={{ display: 'block', textAlign: 'center' }}
            >
              <img src={imageSrc} style={{ maxWidth: '100%' }}></img>
            </ins>
          </a>
        </div>
      }
    </>
    
  );
}

export default observer(Scape);