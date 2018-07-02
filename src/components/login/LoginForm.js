import React from 'react';
import NetSelector from './NetSelector';

const LoginForm = ({ onClick, onNetSelect, isMainNet }) => (
  <div className="login_step_login">
    <div className="login_step_login_text">Please click the login button and button sign to reach dashboard:</div>
    <NetSelector
      onNetSelect={onNetSelect}
      isMainNet={isMainNet}
    />
    <div className="login_step_login_field_wrapper clearfix">
      <input className="login_step_login_submit" type="submit" onClick={onClick} value="Login" />
    </div>
  </div>
);
export default LoginForm;
