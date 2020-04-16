import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default class TopBanner extends React.PureComponent {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.el.className = 'col-12';
  }

  componentDidMount() {
    this.root = document.getElementById('top-banner');
    this.root.appendChild(this.el);
  }
  componentWillUnmount() {
    this.root.removeChild(this.el);
  }

  render() {
    if (!this.props.auth || !this.props.auth.loggedIn) {
      return ReactDOM.createPortal(
        <a href={process.env.REACT_APP_SIGN_IN_LANDING}
          className="top_banner"
        >
          {this.getTitle()}
        </a>,
        this.el
      );
    } else {
      return null;
    }
  }

  getTitle() {
    const isIOSorAndroid = (/android|iphone|ipad/i).test(window.navigator.userAgent);
    const hasWeb3 = !!window.ethereum || !!window.web3;
    let title = 'Click here to login to MBN Platform. ';
    if (!hasWeb3) {
      if (isIOSorAndroid) {
        title += 'To login you need to use a browser that supports dapps';
      } else {
        title += 'To login you need to connect through Chrome or Firefox browsers and install Metamask extension. It is 100% secure to use Metamask';
      }
    }
    return title;
  }
}
