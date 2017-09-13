import React from 'react';
import EnterNickname from './EnterNickname';
import LoginTitle from '../img/LoginTitle.png';
import './Login.css';
import NoMetamask from './NoMetamask';
import LoginStep from './LoginStep';


class Login extends React.Component {

  renderStep() {
    if(!window.web3) {
      return (<NoMetamask />);
    } else if(this.props.nameRequired) {
      return (<EnterNickname onNicknameSet={this.props.onNicknameSet} />);
    } else {
      return (<LoginStep onClick={this.props.onLoginClick} />);
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
    //if(window.web3) {
      //return (<NoMetamask />);
    //}
    //if(this.props.nameRequired) {
      //return (<EnterNickname onNicknameSet={this.props.onNicknameSet} />);
    //} else {
      //return (<button onClick={this.props.onLoginClick}>Log in</button>);
    //}
}




}

export default Login;
