const PostCard = ({title, content}: {title: string, content: string}) => {
  return (
    <>
      <div className="card border-4 w-64 h-64 overflow-hidden">
        <div className="card-title card-bordered w-64 h-24 justify-center">
          {title}
        </div>
        <div className="card-body w-64 h-1">
          <div className="card-actions justify-start">
            {content}
          </div>
        </div>
      </div>
    </>
  );
}

export default PostCard;