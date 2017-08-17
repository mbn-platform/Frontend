import React from 'react';

class Login extends React.Component {

  render() {
    if(!window.web3) {
      return (<div>Install Metamask plugin</div>);
    }
    return (<button onClick={this.props.onLoginClick}>Log in</button>);
  }
}

export default Login;
