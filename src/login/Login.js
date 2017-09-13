import React from 'react';
import EnterNickname from './EnterNickname';
import LoginTitle from '../img/LoginTitle.png';
import './Login.css';
import NoMetamask from './NoMetamask';
import LoginStep from './LoginStep';


class Login extends React.Component {

  constructor(props) {
    super(props);
    const intervalId = setInterval(() =>
      window.web3.eth.getAccounts((err, accounts) => {
        this.setState({hasActiveAccount: (!err && accounts.length)});
      }), 1000);
    this.state = {hasActiveAccount: false, intervalId: intervalId};
    window.web3.eth.getAccounts((err, accounts) => {
      this.setState({hasActiveAccount: (!err && accounts.length)});
    });
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
      return (<LoginStep onClick={this.props.onLoginClick} hasActiveAccount={this.state.hasActiveAccount} />);
    }
  }

  render() {
    return (
      <div className="login_wrapper">
        <div className="login_content">
          <div className="login_steps">
            <div className="login_title_wrapper">
              <div className="login_title_img_wr">
                <img className="login_title_img" src={LoginTitle} alt="" title="" />
              </div>
              <div className="login_title_text">(Alpha)</div>
            </div>
            {this.renderStep()}
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
