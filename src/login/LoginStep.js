import React from 'react';
import './LoginStep.css';

const LoginStep = ({ onClick, hasActiveAccount }) => (
  <div className="login_step_login">
    {hasActiveAccount ?  null : (<div className="login_step_has_account">Thank you for installing Metamask!</div>)}
    {hasActiveAccount ? (
        <div className="login_step_login_text">Please push the button login and<br/> button sign to reach dashboard:</div>
      ) : (
        <div className="login_step_login_text">Please login into your Metamask account and <br/>click Login button:</div>
      )
    }
    <div className="login_step_login_field_wrapper clearfix">
      <input className="login_step_login_submit" type="submit" onClick={onClick} value="Login" />
    </div>
  </div>
);

export default LoginStep;
