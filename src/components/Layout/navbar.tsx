import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { AdjustmentsHorizontalIcon, UserIcon, ClipboardDocumentListIcon, ArrowTurnDownRightIcon, PlusIcon } from '@heroicons/react/24/outline'
import Image from 'next/image';

const Navbar = () => {
  return (
    <>
      <div data-theme="cupcake" className="navbar fixed top-0 left-0 right-0 bg-base-100 z-50">
        <div className="flex-none">
          <Image src="/logo_round.png" alt="Letterscape" width={50} height={50} priority/>
        </div>
        <div className="navbar-start pr-32">
          <span className="btn btn-ghost text-xl font-bold"><Link href="/market"><h1>Letterscape</h1></Link></span>
          <div className="divider divider-horizontal"></div>
          <div className="flex-none">
            <ul className="menu menu-horizontal">
              <li className="text-xs"><Link href="/market"><b>Market</b></Link></li>
              <li className="text-xs"><Link href="/mint"><b>Mint</b></Link></li>
              <li className="text-xs"><Link href="/space"><b>Space</b></Link></li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70">
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd" />
          </svg>
          <input type="text" className="grow" placeholder="Search" />
          <kbd className="kbd kbd-sm">⌘</kbd>
          </label>
        </div>
        <div className="navbar-end">
          <ul className="menu menu-horizontal">
            <li className="text-xs"><Link href="/create"><PlusIcon className="size-6"/><b>Create</b></Link></li>
          </ul>
          
          <w3m-button />
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full content-center">
                <FontAwesomeIcon size="2x" icon={faCircleUser} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li>
                <span className="justify-stretch gap-8 leading-loose">
                  <UserIcon className="size-5" />
                  <Link href="/profile"><b>Profile</b></Link>
                </span>
              </li>
              <li>
                <span className="justify-stretch gap-8 leading-loose">
                  <ClipboardDocumentListIcon className="size-5"/>
                  <Link href="/lists"><b>lists</b></Link>
                </span>
              </li>
              <div className="divider divider-vertical"></div>
              <li>
                <a className="justify-stretch gap-8 leading-loose">
                  <AdjustmentsHorizontalIcon className="size-5"/>
                  <b>Settings</b>
                </a>
              </li>
              <div className="divider divider-vertical"></div>
              <li>
                <a className="justify-stretch gap-8 leading-loose">
                  <ArrowTurnDownRightIcon className="size-5"/>
                  <b>Logout</b>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/transaction">Transaction</Link>
          </li>
          <li>
            <Link href="/storage">Storage</Link>
          </li>
        </ul>
      </div> */}
    </>
  );
}

export default observer(Navbar);
