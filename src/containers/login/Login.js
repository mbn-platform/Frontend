import React from 'react';
import EnterNickname from './EnterNickname';
import './Login.css';
import './LoginStep.css';
import NoMetamask from '../../components/NoMetamask';
import Competition from './Competition';
import MetamaskClosed from './MetamaskClosed';
import LoginForm from './LoginForm';



class Login extends React.Component {

  constructor(props) {
    super(props);
    if(window.web3) {
      const intervalId = setInterval(() =>
        window.web3.eth.getAccounts((err, accounts) => {
          this.setState({hasActiveAccount: (!err && accounts.length)});
        }), 1000);
      this.state = {hasActiveAccount: false, intervalId: intervalId};
      window.web3.eth.getAccounts((err, accounts) => {
        this.setState({hasActiveAccount: (!err && accounts.length)});
      });
    } else {
      this.state = {};
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps !== this.props) {
      return true;
    } else {
      return !(this.state.hasActiveAccount === nextState.hasActiveAccount);
    }
  }

  onDemoClick() {
    console.log(' on demo click');
    window.location = 'https://demo.membrana.io';
  }

  renderStep() {
    if(!window.web3) {
      return (<NoMetamask />);
    } else if(this.props.nameRequired) {
      return (<EnterNickname onNicknameSet={this.props.onNicknameSet} />);
    } else {
      return (
        this.state.hasActiveAccount ? (
          <LoginForm
            onClick={this.props.onLoginClick}
          />
        ) : (
          <MetamaskClosed />
        )
      );
    }
  }

  render() {
    const isIOSorAndroid = (/android|iphone|ipad/i).test(window.navigator.userAgent);
    return (
      <div className={'login_wrapper container-fluid ' + (!window.web3 ? 'login_wrapper_no_metamask' : '')}>
        <div className="login_content row justify-content-center align-items-center">
          <div className="login_steps">
            <div className="login_title_wrapper">
              <div className="login_title_text">Beta</div>
            </div>
            {this.renderStep()}
          </div>
          {!window.web3 && isIOSorAndroid && <Competition/>}
        </div>
      </div>
    );
  }
}

export default Login;
