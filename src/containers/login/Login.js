import React from 'react';
import EnterNickname from './EnterNickname';
import './Login.css';
import './LoginStep.css';
import NoMetamask from '../../components/NoMetamask';
import MetamaskClosed from './MetamaskClosed';
import LoginForm from './LoginForm';

class Login extends React.Component {

  constructor(props) {
    super(props);
    if(window.web3) {
      const intervalId = setInterval(() =>
        window.web3.eth.getAccounts((err, accounts) => {
          this.setState({hasActiveAccount: (!err && accounts.length),
            modern: !!window.ethereum});
        }), 1000);
      this.state = {hasActiveAccount: false, intervalId: intervalId};
      window.web3.eth.getAccounts((err, accounts) => {
        this.setState({hasActiveAccount: (!err && accounts.length), modern: !!window.ethereum});
      });
    } else {
      this.state = {};
    }
  }

  onLoginClick = () => {
    if (!this.state.hasActiveAccount && this.state.modern) {
      window.ethereum.enable().then(() => {
        this.props.onLoginClick();
      }).catch(e => console.log(e));
    } else if (this.state.hasActiveAccount) {
      this.props.onLoginClick();
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

  renderStep() {
    if(!window.web3) {
      return (<NoMetamask />);
    } else if(this.props.nameRequired) {
      return (<EnterNickname onNicknameSet={this.props.onNicknameSet} />);
    } else {
      return (
        this.state.hasActiveAccount || this.state.modern ? (
          <LoginForm
            onClick={this.onLoginClick}
          />
        ) : (
          <MetamaskClosed />
        )
      );
    }
  }

  render() {
    return (
      <div className={'login_wrapper container-fluid ' + (!window.web3 ? 'login_wrapper_no_metamask' : '')}>
        <div className="login_content row justify-content-center align-items-center">
          <div className="login_steps">
            <div className="login_title_wrapper">
              <div className="login_title_text">
                  Membrana Platform
                <br/>
                  Beta v1.6.3
              </div>
            </div>
            {this.renderStep()}
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
