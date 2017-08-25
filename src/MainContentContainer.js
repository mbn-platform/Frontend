import MainContent from './MainContent';
import { logIn, setNickname } from './actions/auth';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

const mapStateToProps = state => ({loggedIn: state.auth.loggedIn, isNew: state.auth.isNew});
const mapDispatchToProps = dispatch =>({
  onLoginClick: () => dispatch(logIn()),
  onNicknameSet: nickname => dispatch(setNickname(nickname))
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainContent));
