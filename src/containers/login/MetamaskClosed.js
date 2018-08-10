import React from 'react';
import { FormattedMessage } from 'react-intl';

const MetamaskClosed = () => (
  <div className="login_step_login">
    <div className="login_step_login_text">
      <FormattedMessage
        id="nometamask.loginToMetamask"
        defaultMessage="Please login into your Metamask account."
      />
    </div>
  </div>
);

export default MetamaskClosed;
