import React from 'react';
import Metamask from '../../img/Metamask.png';
import Cipher from '../../img/Cipher.png';
import DemoButton from './DemoButton';
import './NoMetamask.css';

export default () => {
  const isIOSorAndroid = (/android|iphone|ipad/i).test(window.navigator.userAgent);
  if(isIOSorAndroid) {
    return (
      <div className="login_no_metamask">
        <div className="login_no_metamask_title">Please, install Cipher Browser</div>
        <div className="login_no_metamask_text">To use Membrana Platform on mobile devices you need to install Cipher Browser:</div>
        <div className='row justify-content-around'>
          <div className="metamask_link_wrapper col-12 d-flex  justify-content-center  col-md-auto">
            <a
              href="https://www.cipherbrowser.com/"
              className="metamask_link" rel="nofollow">
              <img className="cipher_link_img" src={Cipher} alt="" title=""/>
            </a>
          </div>
          <div className="metamask_text_wrapper col-12 col-md">
            <div className="metamask_text_title cipher">What is Cipher Browser?</div>
            <div className="metamask_text">Cipher Browser is the world's first full-featured mobile dapp browser and wallet for the Ethereum blockchain. Cipher allows you to interact with dapps powered by Ethereum on your mobile device and makes it easy for you to securely store, send and receive Ether and ERC20 tokens.</div>
          </div>
        </div>
        <DemoButton />
      </div>
    );
  }
  else {
    return (
      <div className="login_no_metamask">
        <div className="login_no_metamask_title">Please, install Metamask</div>
        <div className="login_no_metamask_text">To login you need to connect through Chrome or Firefox browsers and install Metamask extension:</div>
        <div className='row justify-content-around'>
          <div className="metamask_link_wrapper col-12 d-flex  justify-content-center  col-md-auto">
            <a
              href="https://metamask.io/"
              className="metamask_link" rel="nofollow">
              <img className="metamask_link_img" src={Metamask} alt="" title=""/>
            </a>
          </div>
          <div className="metamask_text_wrapper col-12 col-md">
            <div className="metamask_text_title">What is Metamask?</div>
            <div className="metamask_text">MetaMask is a bridge that allows you to visit the distributed web of tomorrow in your browser today. It allows you to run Ethereum dApps right in your  browser without running a full Ethereum node. MetaMask includes a secure identity vault, providing a user interface to manage your identities on different sites and sign blockchain transactions.</div>
          </div>
        </div>
        <DemoButton />
      </div>
    );
  }
}
