import { observer } from 'mobx-react-lite';
import { walletStore, lsNFTStore } from '@/store';
import { ChangeEvent, useEffect, useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi'
import {abi} from '@/store/LsNFT/abi';
import { base } from '@/store/Base';

const { lsNFT } = lsNFTStore;
const { setMarket, getOwner, contractOwner } = lsNFT;

let showAdminSetting = false;

const AdminSetting = () => {

  const { wallet } = walletStore;
  const { accountInfo } = wallet;

  const { 
    data: hash, 
    isPending,
    writeContract 
  } = useWriteContract()

  // let showAdminSetting = accountInfo.address == '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
  useEffect(() => {
    showAdminSetting = accountInfo.address == '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    console.log('showAdminSetting: ', showAdminSetting);
  }, []);

  const [adminAddress, setMarketAddress] = useState('');

  function onChangeAdminText(event: ChangeEvent<HTMLInputElement>): void {
    setMarketAddress(event.target.value);
  }

  async function onSetMarket() {
    console.log('adminAddress: ', adminAddress)
    setMarket(adminAddress);
    // debugger
    // await writeContract({
    //   address: '0xA3E5DfE71aE3e6DeC4D98fa28821dF355d7244B3',
    //   abi,
    //   functionName: 'setMarket',
    //   args: [adminAddress],
    // })
    // console.log("data hash:", hash);
  }

  return (
    <div className="join">
      <div>
        <input className="input input-bordered join-item" placeholder="set market contract address" onChange={onChangeAdminText}/>
      </div>
      <div className="indicator">
        <button className="btn join-item" onClick={onSetMarket}>Set</button>
      </div>
    </div>
  );
}

const GetOwner = () => {

  const [owner, setOwner] = useState('');

  async function onDialog() {
    const data = await getOwner()
    debugger
    setOwner(data);

    const element = document.getElementById('my_modal_1') as HTMLDialogElement | null;
    element!.showModal();
  }

  return (
    <div>
      <button className="btn" onClick={onDialog}>Contract Owner</button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">LSNFT contract owner:</h3>
          <p className="py-4">{owner}</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

const Profile = () => {

  const account = useAccount();

  return (
    <div role="tablist" className="tabs tabs-bordered">
      <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Profile" defaultChecked />
      <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
        Nothing
      </div>

      <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Market" />
      <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
        { account.address === base.adminAddress && <AdminSetting />}
        <div style={{margin: '20px 0'}}>
          <GetOwner />
        </div>
      </div>

      <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Other" />
      <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">Nothing</div>
    </div>
  );
}

export default observer(Profile);