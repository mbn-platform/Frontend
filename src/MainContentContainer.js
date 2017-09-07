import MainContent from './MainContent';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

const mapStateToProps = state => ({loggedIn: state.auth.loggedIn, profile: state.auth.profile});
export default withRouter(connect(mapStateToProps)(MainContent));
