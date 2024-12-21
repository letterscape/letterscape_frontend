import { useEffect, useState } from "react";

export default function Index() {
  const text = "Welcome to Letterscape!";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false); 
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    
    const typingSpeed = 150;
    const deletingSpeed = 50;
    const pauseDurationCompleted = 1000;
    const pauseDurationStart = 100;

    const handleTyping = () => {
      if (!isDeleting) {
        
        if (index < text.length) {
          setIndex((prevIndex) => prevIndex + 1);
        } else {
          
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
          }, pauseDurationCompleted);
        }
      } else {
        
        if (index > 0) {
          setIndex((prevIndex) => prevIndex - 1);
        } else {
          
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(false);
          }, pauseDurationStart);
        }
      }
    };

    const timeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout); // 清理定时器
  }, [index, isDeleting, text]);

  useEffect(() => {
    // 根据当前索引更新展示的文字
    setDisplayText(text.slice(0, index));
  }, [index, text]);

  return (
    <div className="flex items-center justify-center h-screen w-full -mt-24">
      <p className="font-mono text-4xl">{displayText}</p>
      {/* <span className="animate-blink">|</span> */}
    </div>
  );
}