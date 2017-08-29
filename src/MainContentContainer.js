import MainContent from './MainContent';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

const mapStateToProps = state => ({loggedIn: state.auth.loggedIn});
export default withRouter(connect(mapStateToProps)(MainContent));
