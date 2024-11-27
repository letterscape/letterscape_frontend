import Footer from './footer';
import Navbar from './navbar';
import Web3Provider from '../Wallet';

const Layout = ({ children } : any) => {
  return (
    <div>
      <Web3Provider>
        <Navbar />
        <main data-theme="light" className="pt-16">{children}</main>
        <Footer />
      </Web3Provider>
    </div>
  );
};

export default Layout;