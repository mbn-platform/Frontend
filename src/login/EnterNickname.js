import React from 'react';
import PropTypes from 'prop-types';

class EnterNickname extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {nickname: ''};
  }

  onChange(e) {
    this.setState({nickname: e.target.value});
  }

  onSubmit(e) {
    e.preventDefault();
    const nickname = this.state.nickname;
    this.props.onNicknameSet(nickname);
  }

  render() {
    return (
    <form onSubmit={this.onSubmit}>
      <input placeholder="Enter nickname" onChange={this.onChange} />
      <input type="submit" />
    </form>
    );
  }
}

EnterNickname.propTypes = {
  onNicknameSet: PropTypes.func.isRequired
}

export default EnterNickname;
