import { spaceApi } from "@/api/space/space";
import { successCode } from "@/lib/constants";
import { SpaceContent } from "@/store/Space";
import { observer } from "mobx-react-lite";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import parse, { DOMNode, Element, Text } from "html-react-parser";
import React from "react";
import Scape from "../Scape";
import { useAccount } from "wagmi";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const baseUrl = publicRuntimeConfig.baseUrl;

const Header = ({pathId}: {pathId: string}) => {

  const account = useAccount();
  const [counter, setCounter] = useState(0);

  const maxVisible = 3;

  const handleCount = (isUsed: boolean) => {
    if (isUsed) {
      setCounter(counter + 1);
    }
  }

  return (
    <div className="space-y-3 mb-3">
      {Array.from({ length: maxVisible }, (_, index) => (
        <Scape 
          key={`scape-${index}`} 
          isShow={true} 
          chainId={String(account.chainId)} 
          hostname={baseUrl} 
          originURI={`${baseUrl}/contents/${pathId}`} 
          positionId={String(index)} 
          typeId={'1'}
          sendDataToParent={handleCount}/>
        ))
      }
    </div>
  );
}


const Body = ({htmlContent, interval}: {htmlContent: string, interval: number}) => {

  const { id } = router.query;
  const account = useAccount();

  // resovle html to DOM node array
  const contentNodes = parse(htmlContent, {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.tagName === "p") {
        // 提取 <p> 标签内容
        const textContent = domNode.children
          .map((child) =>
            child.nodeType === 3 ? (child as Text).data : null
          )
          .join("");
        return <p>{textContent}</p>;
      }
      return domNode;
    },
  });

  const handleChildData = () => {

  }

  const contentWithResrouce: JSX.Element[] = [];
  let pCounter = 0;
  let pInterval = 0;

  React.Children.forEach(contentNodes, (node, index) => {
    if (React.isValidElement(node) && node.type === "p") {
      contentWithResrouce.push(node);
      pCounter++;

      // insert resource
      if (pCounter % interval === 0) {
        pInterval++;
        contentWithResrouce.push(
          <Scape 
            key={`scape-${index}`} 
            isShow={true} 
            chainId={String(account.chainId)} 
            hostname={baseUrl} 
            originURI={`${baseUrl}/contents/${id}`} 
            positionId={String(pInterval)} 
            typeId={'2'}
            sendDataToParent={handleChildData}
          />);
      }
    } else {
      // not <p> tag
      contentWithResrouce.push(node as JSX.Element);
    }
  });

  console.log("pInterval: ", pInterval);
  return <div className="space-y-5">{contentWithResrouce}</div>;
}

const Footer = ({pathId}: {pathId: string}) => {

  const account = useAccount();
  const [counter, setCounter] = useState(0);
  var holdAmt = 0;
  const maxHold = 100;

  const maxVisible = 10;

  const handleCount = (isUsed: boolean) => {
    if (isUsed) {
      holdAmt++
      setCounter(holdAmt);
      console.log("holder: ", holdAmt);
    }
  }

  return (
    <div className="flex">
      <div className="flex -space-x-3 overflow-hidden">
        {Array.from({ length: maxHold }, (_, index) => (
            <Scape
              key={`scape-${index}`} 
              isShow={index <= maxVisible} 
              chainId={String(account.chainId)} 
              hostname={baseUrl} 
              originURI={`${baseUrl}/contents/${pathId}`} 
              positionId={String(index)} 
              typeId={'3'}
              sendDataToParent={handleCount}/>
          ))
        }
      </div>
      {counter > 0 &&
        <div className="flex items-center mx-1">
          <p className="text-zinc-400">{counter} holders</p>
        </div>
      }
    </div>
  );
}

const SpaceDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  
  const [loading, setLoading] = useState(true);
  const [pathId, setPathId] = useState('');
  const [title, setTitle] = useState('');
  const [contentBody, setContentBody] = useState('');
  const [content, setContent] = useState<SpaceContent>();

  const info = () => {
    try {
      let params = {
        id: id,
      }
      
      spaceApi.info(params).then(resp => {
        if (resp && resp.code === successCode) {

          const content: SpaceContent = resp.data;
          setContent(content);
          return content.resource;
        } else {
          alert(resp.msg);
          return '';
        }
      }).then((wnft) =>{
        fetchResource(wnft)
      }).catch((error) => {
        console.log(error);
      })
      
    } catch (err) {
      console.log("get wnft detail error: ", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchResource = async (resource: string) => {
    try {
      let param = {
        resource: resource,
      }
      spaceApi.fetch(param).then(resp => {
        
        if (resp && resp.code === successCode) {
          setContentBody(resp.data);
        } else {
          alert(resp.msg);
        }
      })
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  

  useEffect(() => {
    if (id) {
      setPathId(id as string);
      info();
    }
  }, [id])


  if (!pathId || loading) {
    return <div>Loading...</div>;
  }

  const avatarUrls = [
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/150/0000FF",
    "https://via.placeholder.com/150/FF0000",
    "https://via.placeholder.com/150/00FF00",
    "https://via.placeholder.com/150/FFFF00",
    "https://via.placeholder.com/150/FFFF00",
    "https://via.placeholder.com/150/FFFF00",
    "https://via.placeholder.com/150/FFFF00",
    "https://via.placeholder.com/150/FFFF00",
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-5xl border font-bold border-gray-300 rounded border-none outline-none resize-none w-full h-32">{content?.title}</div>
      <div className="text-sm text-gray-600 mb-6">
        <span>By {content?.author}</span>
      </div>
      <div>
        <Header pathId={pathId}/>
      </div>
      <div className="space-y-5 mb-6"
        // dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(contentBody) }}
      >
        <Body htmlContent={contentBody} interval={2}/>
      </div>
      <div>
        <Footer pathId={pathId}/>
      </div>
    </div>
  );
}
export default observer(SpaceDetail);