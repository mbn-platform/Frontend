import React from 'react';
import Metamask from '../assets/img/Metamask.png';
import Trust from '../assets/svg/trust.svg';
import Toshi from '../assets/svg/toshi.svg';
import Cipher from '../assets/svg/CIPHER2.svg';
import PlayButton from '../assets/svg/play_button.svg';
import './NoMetamask.css';
import { FormattedMessage } from 'react-intl';


export default () => {
  const isIOSorAndroid = (/android|iphone|ipad/i).test(window.navigator.userAgent);
  if(isIOSorAndroid) {
    return (
      <div className="login_no_metamask">
        <div className="login_no_metamask_title">
          <FormattedMessage id="pleaseInstallBrowser"
            defaultMessage="Please, install one of these browsers to use"/>
          <br/>
          <span className="login_no_metamask_title__font-light-green">
            <FormattedMessage id="membranaPlatform"
              defaultMessage="Membrana Platform"/>
          </span>
          <br/>
          <FormattedMessage id="orImportAccount"
            defaultMessage="or import ETH account if you already installed"/>
        </div>
        <div className='row justify-content-around'>
          <div className="metamask_link_wrapper metamask_link_wrapper__black col-12 col-md-auto">
            <a
              href="https://trustwalletapp.com/"
              className="metamask_link metamask_link_mobile" rel="nofollow">
              <img className="trust_link_img link_img" src={Trust} alt="" title=""/>
              <div className="metamask_separator"/>
              <div className="metamask_link_text-wrapper">
                <img src={PlayButton} className="metamask_link_text-icon"/>
                <div className="metamask_link_text">
                  <FormattedMessage id="installTrust"
                    defaultMessage="Install Trust"/>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div className='row justify-content-around'>
          <div className="metamask_link_wrapper metamask_link_wrapper__dark-blue col-12 col-md-auto">
            <a
              href="https://www.toshi.org/"
              className="metamask_link metamask_link_mobile" rel="nofollow">
              <img className="toshi_link_img link_img" src={Toshi} alt="" title=""/>
              <div className="metamask_separator"/>
              <div className="metamask_link_text-wrapper">
                <img src={PlayButton} className="metamask_link_text-icon"/>
                <div className="metamask_link_text">
                  <FormattedMessage id="installToshi"
                    defaultMessage="Install Toshi"/></div>
              </div>
            </a>
          </div>
        </div>
        <div className='row justify-content-around'>
          <div className="metamask_link_wrapper metamask_link_wrapper__blue col-12 col-md-auto">
            <a
              href="https://www.cipherbrowser.com/"
              className="metamask_link metamask_link_mobile" rel="nofollow">
              <img className="cipher_link_img link_img" src={Cipher} alt="" title=""/>
              <div className="metamask_separator"/>
              <div className="metamask_link_text-wrapper">
                <img src={PlayButton} className="metamask_link_text-icon"/>
                <div className="metamask_link_text">
                  <FormattedMessage id="installChiper"
                    defaultMessage="Install Chiper"/>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }
  else {
    return (
      <div className="login_no_metamask">
        <div className="login_no_metamask_title">
          <FormattedMessage id="installMetamask"
            defaultMessage="Please, install Metamask"/>
        </div>
        <div className="login_no_metamask_text">
          <FormattedMessage id="toLoginYouNeedInstallMetamask"
            defaultMessage="To login you need to connect through Chrome or Firefox browsers and install Metamask extension:"/>
        </div>
        <div className='row justify-content-around'>
          <div className="metamask_link_wrapper col-12 d-flex  justify-content-center  col-md-auto">
            <a
              href="https://metamask.io/"
              className="metamask_link" rel="nofollow">
              <img className="metamask_link_img" src={Metamask} alt="" title=""/>
            </a>
          </div>
          <div className="metamask_text_wrapper col-12 col-md">
            <div className="metamask_text_title">
              <FormattedMessage id="whatIsMetamask"
                defaultMessage="What is Metamask?"/></div>
            <div className="metamask_text">
              <FormattedMessage id="metamaskIs"
                defaultMessage="MetaMask is a bridge that allows you to visit the distributed web of tomorrow in your browser today. It allows you to run Ethereum dApps right in your  browser without running a full Ethereum node. MetaMask includes a secure identity vault, providing a user interface to manage your identities on different sites and sign blockchain transactions."/>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
