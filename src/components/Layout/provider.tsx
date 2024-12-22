import { useEffect, useState } from "react";
import Footer from './footer';
import Navbar from './navbar';
import Web3Provider from '../Wallet';
import { useTheme } from "next-themes";

const LetterscapeApp = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  return (
    <div className="">
      <div className="flex flex-col bg-main relative ">
        {/* <div className=""> */}
        {isDarkMode ? (
          <>
            <div className="circle-gradient-dark w-[330px] h-[330px]"></div>
            <div className="circle-gradient-blue-dark w-[330px] h-[330px]"></div>
          </>
        ) : (
          <>
            <div className="w-full">
              {/* <div className="gradient-to-bottom-blue w-full h-[150px]"></div> */}
              <div className="gradient-to-bottom-blue w-2/3 h-[100px]" style={{marginTop: '30px', marginLeft: '150px'}}></div>
            </div>
            <div className="w-full grid grid-cols-2">
              <div className="circle-gradient-pink w-[330px] h-[330px]"></div>
              <div className="circle-gradient-green w-[330px] h-[330px] items-end end justify-end"></div>
            </div>
            <div className="gradient-to-top-yellow w-full h-[150px]"></div>
          </>
        )}
        {/* </div> */}
        {/* <div className="z-50"> */}
        <Web3Provider>
          <Navbar />
          <main className="relative flex flex-col flex-1">{children}</main>
          {/* <Footer /> */}
        </Web3Provider>
        {/* </div> */}
        
      </div>
    </div>
  );
};

export const LetterscapeAppWithProviders = ({ children }: { children: React.ReactNode}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <LetterscapeApp>{children}</LetterscapeApp>
  );
};