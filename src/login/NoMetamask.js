import React from 'react';
import Metamask from '../img/Metamask.png';
import './NoMetamask.css';

export default () => (
  <div className="login_no_metamask">
    <div className="login_no_metamask_title">Please, install Metamask</div>
    <div className="login_no_metamask_text">To login you need to connect through google chrome and install Metamask extension:</div>
    <div className='row justify-content-around'>
      <div className="metamask_link_wrapper col-12 d-flex  justify-content-center  col-md-auto">
        <a
          href="https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn"
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
