import { SpaceContent } from "@/store/Space";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import router from "next/router";
import { useAccount } from "wagmi";
import { spaceStore } from '@/store';
import { truncateDynamic } from "@/lib/utils";
import getConfig from "next/config";
import { rpcConfig } from "@/store/EtherClient/clients";
import { getAccount } from "@wagmi/core";

export enum From {
  PUBLIC,
  PRIVATE,
}

const Buttons = ({content, link}: {content: SpaceContent, link: string}) => {

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = publicRuntimeConfig.baseUrl;
  const account = getAccount(rpcConfig);

  const { space } = spaceStore;
  const { publish } = space;

  const handlePublish = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    
    if (content) {
      await publish(content.contentId);
      router.push('/space')
    }
  }

  const handleMint = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, link: string) => {
    event.preventDefault();

    if (link) {
      router.push({
        pathname: '/mint',
        query:{
          from: `${baseUrl}${link}`,
        }
      })
    }
  }

  return (
    <div className="">
      {/* {account.address == content.author &&
        <div className="grid grid-cols-2 w-full gap-0">
          <div className="card-actions justify-center bg-gray-300">
            <button 
              className="btn w-full rounded-none bg-gradient-to-r from-red-600/50 to-red-800/50 backdrop-blur-md text-white font-extrabold hover:from-red-700/60 hover:to-red-900/60 hover:scale-105 transition-transform duration-300" 
              onClick={onBurnDialog}>Delete</button>
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
              disabled={content.isShown}
              onClick={handleList}>Publish</button>
          </div>
        </div>
      } */}
      {account.address == content.author &&
        <div className="grid grid-cols-2 w-full gap-0">
          <div className="card-actions justify-center bg-gray-300">
            <button
              className="btn w-full rounded-none bg-gradient-to-r from-green-600/50 to-green-800/50 backdrop-blur-md text-white font-extrabold hover:from-green-700/60 hover:to-green-900/60 hover:scale-103 transition-transform duration-300" 
              disabled={content.isShown}
              onClick={handlePublish}>Publish</button>
          </div>
          <div className="card-actions justify-center bg-gray-300">
            <button
              className="btn w-full rounded-none bg-gradient-to-r from-blue-600/50 to-blue-800/50 backdrop-blur-md text-white font-extrabold hover:from-blue-700/60 hover:to-blue-900/60 hover:scale-103 transition-transform duration-300" 
              onClick={(e) => handleMint(e, link)}>Mint</button>
          </div>
        </div>
      }
    </div>
  );
}

const SpaceCard = ({content, link, from}: {content: SpaceContent, link: string, from: From}) => {

  return (
    <>
      <div className="card border-2 h-full w-full overflow-hidden ">
        <Link href={link}>
          <div className="card-title card-bordered w-full h-24 justify-center">
            <div className="flex text-center">
              {content.title}
            </div> 
          </div>
        
          <div className="grid grid-cols-1 gap-4 w-full">
            {/* <div className="flex items-center justify-center font-mediu">
              <p className="text-center font-bold">Author</p>
            </div> */}
            <div className="relative group flex items-center justify-center font-mediu space-x-4 h-12">
              <div className="truncate">
                <p className="text-center">{truncateDynamic(content.author, 23)}</p>
              </div>
              <div className="absolute hidden group-hover:flex bg-gray-900 text-white text-sm p-2 rounded shadow-lg -top-8 left-0 z-50">
                {content.author}
              </div>
            </div>
          </div>
        </Link>
        { from === From.PRIVATE &&
          <div className="mt-auto">
            <Buttons content={content} link={link} />
          </div>
        }
      </div>
    </>
  );
}
export default observer(SpaceCard);