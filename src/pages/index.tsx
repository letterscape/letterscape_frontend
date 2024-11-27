import Link from 'next/link';
import Web3Connect from '@/components/Wallet';
import Home from './home';
import Head from 'next/head';

export default function Index() {
  return (
    <>

      <div>
        <Head>
          <title>Letterscape</title>
          <link rel="icon" href="/logo_round.png" type="image/x-icon" />
        </Head>
        <Home />
      </div>
      {/* <div data-theme="cupcake" className="navbar bg-base-100">
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">LetterSpace</a>
          <a>|</a>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li><Link href="/market">Market</Link></li>
            </ul>
          </div>
        </div>
        <div className="navbar-end">
          <Web3Connect />
        </div>
      </div> */}
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/transaction">Transaction</Link>
          </li>
          <li>
            <Link href="/storage">Storage</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
