import React from 'react';
import EnterNickname from './EnterNickname';

class Login extends React.Component {

  render() {
    if(!window.web3) {
      return (<div>Install Metamask plugin</div>);
    }
    if(this.props.nameRequired) {
      return (<EnterNickname onNicknameSet={this.props.onNicknameSet} />);
    } else {
      return (<button onClick={this.props.onLoginClick}>Log in</button>);
    }
  }
}

export default Login;
