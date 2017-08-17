import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { logIn } from '../actions/auth';

class Login extends React.Component {

  render() {
    if(this.props.auth.loggedIn) {
      return (<Redirect to="/dashboard" />);
    }

    return (<button onClick={this.props.onLoginButtonClick}>Log in</button>);
  }
}

const mapStateToProps = state => {
  return {auth: state.auth};
};

const mapDispatchToProps = dispatch => {
  return {
    onLoginButtonClick: () => dispatch(logIn())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
