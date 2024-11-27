import Space from '@/components/Space';
import Link from 'next/link';
import PostCard from '@/components/Space/card';
import {posts} from '@/store/Posts';

export default function Index() {

  const {articles} = posts;

  const postList = [
    { id: '1', style: <PostCard title='First Post' content='aaaaa'/>, article: articles[0] },
    { id: '2', style: <PostCard title='Second Post' content='bbbbbb'/>, article: articles[1] },
    { id: '3', style: <PostCard title='Third Post' content='bbbbbb'/>, article: articles[2] },
    { id: '4', style: <PostCard title='Fourth Post' content='bbbbbb'/>, article: articles[3] },
    { id: '5', style: <PostCard title='Fifth Post' content='bbbbbb'/>, article: articles[4] },
    // { id: '6', style: <PostCard title='Sixth Post' content='bbbbbb'/>, article: articles[0] },
    // { id: '7', style: <PostCard title='Seventh Post' content='bbbbbb'/>, article: articles[1] },
    // { id: '8', style: <PostCard title='Eighth Post' content='bbbbbb'/>, article: articles[2] },
    // { id: '9', style: <PostCard title='Ninth Post' content='bbbbbb'/>, article: articles[3] },
    // { id: '10', style: <PostCard title='Tenth Post' content='bbbbbb'/>, article: articles[4] },
  ];

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 ">
        {postList.map(post => (
          <div key={post.id}>
            <Link href={`/space/${post.article.authorAddress}/${post.id}`}>
              {post.style}
            </Link>
          </div>
        ))}
      </div>
      <Link href="/space/overview">Overview</Link>
    </div>
  );
}
