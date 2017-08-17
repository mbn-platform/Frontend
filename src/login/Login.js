import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { logIn } from '../actions/auth';

class Login extends React.Component {

  render() {
    if(!window.web3) {
      return (<div>Install Metamask plugin</div>);
    }
    return (<button onClick={this.props.onLoginButtonClick}>Log in</button>);
  }
}

export default Login;
