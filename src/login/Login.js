import React from 'react';
import EnterNickname from './EnterNickname';
import './Login.css';
import NoMetamask from './NoMetamask';
import LoginStep from './LoginStep';


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
        <LoginStep onClick={this.props.onLoginClick} hasActiveAccount={this.state.hasActiveAccount}
          onNetSelect={this.props.onNetSelect}
          isMainNet={this.props.isMainNet}
        />
      );
    }
  }

  render() {
    return (
      <div className="login_wrapper container-fluid">
        <div className="login_content row justify-content-center align-items-center">
          <div className="login_steps">
            <div className="login_title_wrapper">
              <div className="login_title_text">Alpha</div>
            </div>
            {this.renderStep()}
            <div className="demo_button_wr">
              <button onClick={this.onDemoClick} className="login_step_login_submit">DEMO</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
