import { connect } from 'react-redux';
import { logIn, addName } from '../actions/auth';
import Login from './Login';

const mapStateToProps = state => ({
  nameRequired: state.auth.nameRequired,
  isMainNet: state.isMainNet,
});


const mapDispatchToProps = dispatch =>({
  onLoginClick: () => dispatch(logIn()),
  onNicknameSet: nickname => dispatch(addName(nickname)),
  onNetSelect: () => {
    console.log('o net select');
    dispatch({
    type: 'ON_NET_SELECT',
  })
  },
});

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);

export default LoginContainer;
