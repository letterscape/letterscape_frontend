import {Article} from '@/store/Posts';
import Scape from '../Scape';
import { useAccount } from 'wagmi';

const SpaceDetail = ({article, hostname, uri}: {article: Article, hostname: string, uri: string}) => {

  const account = useAccount();
  debugger
  return (
    <div className="max-w-3xl mx-auto p-6">
      <article>
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <div className="text-sm text-gray-600 mb-6">
          <span>By {article.author}</span> | <span>{article.date}</span>
        </div>
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content1 }} />
          <Scape isShow={true} chainId={String(account.chainId)} hostname={hostname} originURI={uri} positionId={'1'} typeId={'1'}/>
          <div dangerouslySetInnerHTML={{ __html: article.content2 }} />
          <Scape isShow={true} chainId={String(account.chainId)} hostname={hostname} originURI={uri} positionId={'2'} typeId={'1'}/>
          <div dangerouslySetInnerHTML={{ __html: article.content3 }} />
        </div>
      </article>
    </div>
  );
}

export default SpaceDetail;