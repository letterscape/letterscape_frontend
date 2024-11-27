import { useRouter } from "next/router";

export default function Overview() {
  const router = useRouter()
  

  const handleBack = () => {
    router.back();
  }
  return (
    <div>
      <button onClick={handleBack}>
        {'<-'}
      </button>
      <h1>Posts Overview</h1>
      <p>This is an overview of all posts.</p>
    </div>
  );
}