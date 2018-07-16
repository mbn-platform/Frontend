import React from 'react';
import Metamask from '../../img/Metamask.png';
import Trust from '../../img/trust.svg';
import Toshi from '../../img/toshi.svg';
import Cipher from '../../img/CIPHER2.svg';
import './NoMetamask.css';

export default () => {
  const isIOSorAndroid = (/android|iphone|ipad/i).test(window.navigator.userAgent);
  if(isIOSorAndroid) {
    return (
      <div className="login_no_metamask">
        <div className="login_no_metamask_title">Please, install one of these browsers to use Membrana Platform</div>
        <div className='row justify-content-around'>
          <div className="metamask_link_wrapper metamask_link_wrapper__black col-12 col-md-auto">
            <a
              href="https://trustwalletapp.com/"
              className="metamask_link metamask_link_mobile" rel="nofollow">
              <img className="cipher_link_img" src={Trust} alt="" title=""/>
              <div className="metamask_separator"/>
              <div className="metamask_link_text">Install Trust</div>
            </a>
          </div>
        </div>
        <div className='row justify-content-around'>
          <div className="metamask_link_wrapper metamask_link_wrapper__dark-blue col-12 col-md-auto">
            <a
              href="https://www.toshi.org/"
              className="metamask_link metamask_link_mobile" rel="nofollow">
              <img className="cipher_link_img" src={Toshi} alt="" title=""/>
              <div className="metamask_separator"/>
              <div className="metamask_link_text">Install Toshi</div>
            </a>
          </div>
        </div>
        <div className='row justify-content-around'>
          <div className="metamask_link_wrapper metamask_link_wrapper__blue col-12 col-md-auto">
            <a
              href="https://www.cipherbrowser.com/"
              className="metamask_link metamask_link_mobile" rel="nofollow">
              <img className="cipher_link_img" src={Cipher} alt="" title=""/>
              <div className="metamask_separator"/>
              <div className="metamask_link_text">Install Chiper</div>
            </a>
          </div>
        </div>
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
      </div>
    );
  }
};
