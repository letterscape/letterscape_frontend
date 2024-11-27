import { useRouter } from 'next/router';
import Link from 'next/link';
import {posts} from '@/store/Posts';
import SpaceDetail from '@/components/Space/detail';

export default function PostDetail() {

  const {articles, getArticleById} = posts;
  const router = useRouter();

  const { id,address } = router.query;
  const idx: number = Number(id) || 0;
  const article = getArticleById(String(idx % articles.length));
  const handleBack = () => {
    router.back();
  };

  if (!router.isReady) {
    return <p>加载中...</p>;
  }

  return (
    <div>
      <button className="px-5 py-5" onClick={handleBack}>
        {'<-'}
      </button>
      <h1>Post Detail for ID: {id}</h1>
      <div>
        <SpaceDetail article={article} hostname={'http://localhost:3000'} uri={`http://localhost:3000/space/${address}/${id}`}/>
      </div>
      <Link href={`/space/${id}/comments`}>View Comments</Link>
    </div>
  );
}