import MainContent from './MainContent';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { closeNotification, showNotification } from './actions/notification';

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
    showNotificationBar: (
      notificationType,
      notificationID,
      message,
      url
    ) => dispatch(showNotification(
      notificationType,
      notificationID,
      message,
      url)
    ),
    closeNotificationBar: () => dispatch(closeNotification()),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainContent));
