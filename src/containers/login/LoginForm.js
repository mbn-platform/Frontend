import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

class LoginForm extends React.PureComponent {

  static propTypes = {
    autoLogin: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
  }

  componentDidMount() {
    if (this.props.autoLogin) {
      this.props.onClick();
    }
  }

  render() {
    const { onClick } = this.props;
    return (
      <div className="login_step_login">
        <div className="login_step_login_text">
          <FormattedMessage
            id="login.message"
            defaultMessage="Please click the login button and button sign to reach dashboard:"
          />
        </div>
        <div className="login_step_login_field_wrapper clearfix">
          <input className="login_step_login_submit" type="submit" onClick={onClick} value="Login" />
        </div>
      </div>
    );
  }
}
export default LoginForm;
