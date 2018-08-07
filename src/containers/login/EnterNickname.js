import React from 'react';
import PropTypes from 'prop-types';
import './EnterNickname.css';
import { FormattedMessage } from 'react-intl';

class EnterNickname extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {nickname: ''};
  }

  onChange(e) {
    const value = e.target.value;
    this.setState({nickname: value.replace(' ', '')});
  }

  onSubmit(e) {
    e.preventDefault();
    const nickname = this.state.nickname;
    this.props.onNicknameSet(nickname);
  }

  render() {
    return (
      <div className="login_step_nickname">
        <div className="login_step_nickname_text">
          <FormattedMessage
            id="chooseNickname.chooseNickname"
            defaultMessage="Please choose nickname:"
          />
        </div>
        <div className="login_step_nickname_field_wrapper clearfix">
          <form onSubmit={this.onSubmit}>
            <input className="login_step_nickname_field"
              type="text" value={this.state.nickname}
              name="nickname" placeholder="Nickname"
              onChange={this.onChange}
            />
            <input className="login_step_nickname_submit" type="submit" value="ok"/>
          </form>
        </div>
      </div>
    );
  }
}

EnterNickname.propTypes = {
  onNicknameSet: PropTypes.func.isRequired
};

export default EnterNickname;
