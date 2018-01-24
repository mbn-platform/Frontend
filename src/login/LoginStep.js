import React from 'react';
import './LoginStep.css';

const LoginStep = ({ onClick, hasActiveAccount }) => {
  return hasActiveAccount ? <MetamaskAccountActive onClick={onClick} /> : <MetamaskAccountNotActive />;
};

const MetamaskAccountNotActive = () => (
  <div className="login_step_login">
    <div className="login_step_has_account">Thank you for installing Metamask!</div>
    <div className="login_step_login_text">Please login into your Metamask account or check demo version.</div>
  </div>
);

const MetamaskAccountActive = ({ onClick }) => (
  <div className="login_step_login">
    <div className="login_step_has_account">Thank you for installing Metamask!</div>
    <div className="login_step_login_text">Please click the login button and<br/> button sign to reach dashboard:</div>
    <div className="login_step_login_field_wrapper clearfix">
      <input className="login_step_login_submit" type="submit" onClick={onClick} value="Login" />
    </div>
  </div>
);
export default LoginStep;
