import { spaceApi } from "@/api/space/space";
import { successCode } from "@/lib/constants";
import { SpaceContent } from "@/store/Space";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

const Avatars = ({avatars}: {avatars: string[]}) => {

  const maxVisible = 5;

  return (
    <div className="flex">
      <div className="flex -space-x-3 overflow-hidden">
        {avatars.slice(0, maxVisible - 1).map((avatar, index) => (
          <img
            key={index}
            src={avatar}
            alt={`Avatar ${index + 1}`}
            className="w-12 h-12 rounded-full border-2 border-white object-cover"
          />
        ))}
      </div>
      {avatars.length > 0 &&
        <div className="flex items-center mx-1">
          <p className="text-zinc-400">{avatars.length} holders</p>
        </div>
      }
    </div>
  );
}

const SpaceDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
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
        debugger
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
    info();
  }, [])

  if (loading) {
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
      <div className="space-y-3 mb-3">
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <div className="chat-bubble chat-bubble-info">Good!</div>
        </div>
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <div className="chat-bubble chat-bubble-info">Excellent!</div>
        </div>
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <div className="chat-bubble chat-bubble-info">That's awsome</div>
        </div>
      </div>
      <div className="space-y-5"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(contentBody) }}
      />
      <div>
        <Avatars avatars={avatarUrls}/>
      </div>
    </div>
  );
}
export default observer(SpaceDetail);