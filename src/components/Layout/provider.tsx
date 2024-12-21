import { useEffect, useState } from "react";
import Footer from './footer';
import Navbar from './navbar';
import Web3Provider from '../Wallet';
import { useTheme } from "next-themes";

const LetterscapeApp = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  return (
    <>
      <div className="flex relative flex-col min-h-screen bg-main">
        {isDarkMode ? (
          <>
            <div className="circle-gradient-dark w-[330px] h-[330px]"></div>
            <div className="circle-gradient-blue-dark w-[330px] h-[330px]"></div>
          </>
        ) : (
          <>
            <div className="circle-gradient w-[330px] h-[330px]"></div>
            <div className="circle-gradient-pink w-[330px] h-[330px]"></div>
          </>
        )}
        <Web3Provider>
          <Navbar />
          <main className="relative flex flex-col flex-1">{children}</main>
          {/* <Footer /> */}
        </Web3Provider>
      </div>
    </>
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