import { useRouter } from 'next/router';

export default function Comments() {
  const router = useRouter();
  const { id } = router.query;
  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <h1>Comments for Post ID: {id}</h1>
      <p>Here are the comments...</p>
      <button onClick={handleBack}>
        Go Back
      </button>
    </div>
  );
}