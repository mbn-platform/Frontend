import { connect } from 'react-redux';
import { logIn, addName } from '../actions/auth';
import Login from './Login';

const mapStateToProps = state => ({
  nameRequired: state.auth.nameRequired
});


const mapDispatchToProps = dispatch =>({
  onLoginClick: () => dispatch(logIn()),
  onNicknameSet: nickname => dispatch(addName(nickname))
});

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);

export default LoginContainer;
