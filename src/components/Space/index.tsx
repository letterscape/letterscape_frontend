import { spaceApi } from "@/api/space/space";
import { successCode } from "@/lib/constants";
import { SpaceContent } from "@/store/Space";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import SpaceCard from "../SpaceCard";
import Link from "next/link";
import { From } from "../SpaceCard";

const Space = () => {

  const account = useAccount();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentList, setContentList] = useState<any[]>([])

  useEffect(() => {
    const queryPage = async () => {
      try {
        let params = {
          page: 1,
          pageSize: 10,
          isShown: true
        };
        await spaceApi.page(params).then(resp => {
          if (resp && resp.code === successCode) {
            const contentList: SpaceContent[] = resp.data.list
            const contentPage: any[] = []
            contentList.forEach(item => {
              let link = `/contents/${item.contentId}`
              contentPage.push({
                id: item.contentId,
                style: <SpaceCard content={item} link={link} from={From.PUBLIC}/>
              })
            })
            setContentList(contentPage);
          } else {
            // alert(resp.msg);
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
       <div className='"max-w-3xl p-6 h-screen'>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 h-64">
          {contentList && contentList.length > 0 && contentList.map(item => (
            <div key={item.id}>
                {item.style}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default observer(Space);