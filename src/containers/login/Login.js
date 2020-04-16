import React from 'react';
import qs from 'qs';
import EnterNickname from './EnterNickname';
import './Login.css';
import './LoginStep.css';
import MetamaskClosed from './MetamaskClosed';
import LoginForm from './LoginForm';
import { redirectToAuthorization } from '../../actions/auth';

class Login extends React.Component {

  componentDidMount() {
    if(!window.web3) {
      redirectToAuthorization('', true);
      return;
    }
    this.onLoginClick();
  }

  onLoginClick = async () => {
    await window.ethereum.enable();
    this.props.onLoginClick();
  }

  render() {
    return (
      <div className={'login_wrapper container-fluid ' + (!window.web3 ? 'login_wrapper_no_metamask' : '')}>
        <div className="login_content row justify-content-center align-items-center">
          <div className="login_steps">
            <div className="login_title_wrapper">
              <div className="login_title_text">
                  MBN Platform
                <br/>
                  Beta {process.env.REACT_APP_VERSION}
              </div>
            </div>
            {this.props.nameRequired && <EnterNickname onNicknameSet={this.props.onNicknameSet} />}
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
