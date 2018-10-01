import MainContent from './MainContent';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { closeNotification } from './actions/notification';

const mapStateToProps = state =>  ({
  loggedIn: state.auth.loggedIn,
  profile: state.auth.profile,
  isNotificationOpen:  state.notification.isVisible,
  notificationUrl:  state.notification.url,
  notificationType:  state.notification.notificationType,
  notificationMessage:  state.notification.message,

});

const mapDispatchToProps = dispatch => {
  return {
    closeNotificationBar: () => dispatch(closeNotification()),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainContent));
